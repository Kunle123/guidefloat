// GuideFloat Chrome Extension - Content Script
// This runs on every page and shows the floating guide widget

(function() {
    'use strict';

    console.log('[GuideFloat Content] Script loaded');
    
    // Always set up message listener first (even on re-injection)
    if (!window.guideFloatListenerSetup) {
        console.log('[GuideFloat Content] Setting up message listener...');
        
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log('[GuideFloat Content] Received message:', message.action);
            
            if (message.action === 'ping') {
                // Respond to ping to confirm script is loaded
                console.log('[GuideFloat Content] Responding to ping');
                sendResponse({ status: 'ready' });
                return true;
            } else if (message.action === 'showGuide') {
                console.log('[GuideFloat Content] Showing guide:', message.guideId);
                if (window.GuideFloat) {
                    window.GuideFloat.loadGuide(message.guideId);
                    sendResponse({ status: 'shown' });
                } else {
                    console.error('[GuideFloat Content] GuideFloat object not ready!');
                    sendResponse({ status: 'error', message: 'GuideFloat not initialized' });
                }
                return true;
            } else if (message.action === 'hideGuide') {
                if (window.GuideFloat) {
                    window.GuideFloat.hide();
                    sendResponse({ status: 'hidden' });
                } else {
                    sendResponse({ status: 'error' });
                }
                return true;
            } else if (message.action === 'showWidget') {
                // Show and un-minimize the widget if it exists
                if (window.GuideFloat && window.GuideFloat.widget) {
                    window.GuideFloat.widget.style.display = 'flex';
                    window.GuideFloat.widget.classList.remove('minimized');
                    window.GuideFloat.isMinimized = false;
                    sendResponse({ status: 'shown' });
                } else {
                    sendResponse({ status: 'no_widget' });
                }
                return true;
            }
        });
        
        window.guideFloatListenerSetup = true;
        console.log('[GuideFloat Content] Message listener ready!');
    }

    // Prevent multiple full injections
    if (window.guideFloatInjected) {
        console.log('[GuideFloat Content] Already injected, skipping re-initialization');
        return;
    }
    window.guideFloatInjected = true;
    console.log('[GuideFloat Content] Initializing GuideFloat object...');

    // Main GuideFloat object
    const GuideFloat = {
        currentGuide: null,
        currentStepIndex: 0,
        widget: null,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        isMinimized: false,

        // Initialize
        init: async function() {
            // Check if there's a saved guide
            const result = await chrome.storage.local.get(['currentGuide', 'widgetVisible']);
            
            if (result.currentGuide && result.widgetVisible) {
                this.loadGuide(result.currentGuide);
            }
        },

        // Load a guide
        loadGuide: async function(guideId) {
            try {
                const url = chrome.runtime.getURL(`guides/${guideId}.json`);
                const response = await fetch(url);
                this.currentGuide = await response.json();
                
                // Load progress
                const progress = await this.loadProgress(guideId);
                this.currentStepIndex = progress ? progress.currentStep - 1 : 0;
                
                this.show();
                
                // Smart detection: Check if user has already completed some steps
                if (window.PageDetector) {
                    console.log('[GuideFloat] Running smart page detection...');
                    const detectedState = await window.PageDetector.detectGuideState(guideId);
                    const suggestion = window.PageDetector.getSuggestionMessage(detectedState, guideId);
                    
                    if (suggestion && suggestion.steps && suggestion.steps.length > 0) {
                        this.showSmartSuggestion(suggestion);
                    }
                }
                
                // Auto-navigate to first step if needed
                const firstStep = this.currentGuide.steps[this.currentStepIndex];
                let shouldNavigate = false;
                let targetUrl = null;
                
                // Check if first step has auto-navigation
                if (firstStep.autoNavigate && firstStep.autoNavigate.url) {
                    targetUrl = firstStep.autoNavigate.url;
                    shouldNavigate = true;
                } else if (firstStep.actionButtons && firstStep.actionButtons.length > 0) {
                    // Or use the first action button URL
                    targetUrl = firstStep.actionButtons[0].url;
                    shouldNavigate = true;
                }
                
                // Navigate if we have a URL and not already there
                if (shouldNavigate && targetUrl && this.currentStepIndex === 0) {
                    const currentUrl = window.location.href;
                    
                    try {
                        const currentUrlObj = new URL(currentUrl);
                        const targetUrlObj = new URL(targetUrl);
                        
                        console.log('[GuideFloat] Checking navigation for first step:');
                        console.log('[GuideFloat] Current URL:', currentUrl);
                        console.log('[GuideFloat] Target URL:', targetUrl);
                        console.log('[GuideFloat] Current domain:', currentUrlObj.origin);
                        console.log('[GuideFloat] Target domain:', targetUrlObj.origin);
                        
                        // More flexible URL comparison
                        const isSameDomain = currentUrlObj.origin === targetUrlObj.origin;
                        const currentPath = currentUrlObj.pathname;
                        const targetPath = targetUrlObj.pathname;
                        
                        // Special handling for Shopify URLs
                        const isShopifyDomain = currentUrlObj.hostname.includes('shopify.com') || 
                                              targetUrlObj.hostname.includes('shopify.com');
                        
                        let isOnTargetPage = false;
                        
                        if (isShopifyDomain) {
                            // For Shopify, be more lenient - if we're on any Shopify domain, don't navigate
                            isOnTargetPage = currentUrlObj.hostname.includes('shopify.com');
                            console.log('[GuideFloat] Shopify domain detected, isOnTargetPage:', isOnTargetPage);
                        } else {
                            // For other domains, use normal logic
                            isOnTargetPage = isSameDomain && (
                                currentPath === targetPath || 
                                currentPath.startsWith(targetPath + '/') ||
                                targetPath.startsWith(currentPath + '/')
                            );
                        }
                        
                        if (!isOnTargetPage) {
                            console.log('[GuideFloat] Auto-navigating to first step:', targetUrl);
                            this.showNavigationNotice(firstStep.autoNavigate?.message || `Taking you to ${firstStep.title}...`);
                            setTimeout(() => {
                                window.location.href = targetUrl;
                            }, 1000);
                            return; // Don't show spotlight yet, we're navigating
                        } else {
                            console.log('[GuideFloat] Already on target page for first step, skipping navigation');
                        }
                    } catch (error) {
                        console.error('[GuideFloat] Error comparing URLs in loadGuide:', error);
                        // If URL parsing fails, don't navigate to avoid loops
                    }
                }
                
                // Show spotlight for initial step (if not navigating)
                this.showSpotlight();
            } catch (error) {
                console.error('Failed to load guide:', error);
            }
        },

        // Show widget
        show: function() {
            if (!this.widget) {
                this.createWidget();
            }
            this.widget.style.display = 'flex';
            this.renderWidget();
        },

        // Hide widget
        hide: function() {
            if (this.widget) {
                this.widget.style.display = 'none';
            }
        },

        // Create widget DOM
        createWidget: function() {
            if (document.getElementById('guidefloat-widget')) {
                this.widget = document.getElementById('guidefloat-widget');
                return;
            }

            const widget = document.createElement('div');
            widget.id = 'guidefloat-widget';
            widget.innerHTML = `
                <div class="guidefloat-header">
                    <div class="guidefloat-title">
                        <span>🚀</span>
                        <span class="guidefloat-title-text">GuideFloat</span>
                    </div>
                    <div class="guidefloat-header-buttons">
                        <button class="guidefloat-header-btn peek-btn" title="Peek Mode (Compact)">⚡</button>
                        <button class="guidefloat-header-btn minimize-btn" title="Minimize">−</button>
                        <button class="guidefloat-header-btn close-btn" title="Close">×</button>
                    </div>
                </div>
                <div class="guidefloat-keyboard-hint">Press ESC to toggle peek mode</div>
                <div class="guidefloat-progress-section">
                    <div class="guidefloat-progress-text">
                        <span class="progress-label">Progress</span>
                        <span class="progress-percentage">0%</span>
                    </div>
                    <div class="guidefloat-progress-bar">
                        <div class="guidefloat-progress-fill" style="width: 0%"></div>
                    </div>
                </div>
                <div class="guidefloat-content"></div>
                <div class="guidefloat-footer">
                    <button class="guidefloat-nav-btn prev-btn" disabled>◀ Previous</button>
                    <button class="guidefloat-nav-btn skip-btn" style="background: #f59e0b; display: none;">Skip ⏭</button>
                    <button class="guidefloat-nav-btn primary next-btn">Next Step ▶</button>
                </div>
                <div class="guidefloat-action-bar">
                    <button class="guidefloat-secondary-btn reset-btn danger">Reset Progress</button>
                    <button class="guidefloat-secondary-btn help-btn">Help</button>
                </div>
            `;

            document.body.appendChild(widget);
            this.widget = widget;

            this.setupEventListeners();
            this.loadPosition();
        },

        // Setup event listeners
        setupEventListeners: function() {
            const header = this.widget.querySelector('.guidefloat-header');
            this.makeDraggable(header);

            this.widget.querySelector('.peek-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePeekMode();
            });

            this.widget.querySelector('.minimize-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize();
            });

            this.widget.querySelector('.close-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });

            this.widget.querySelector('.prev-btn').addEventListener('click', () => this.previousStep());
            this.widget.querySelector('.next-btn').addEventListener('click', () => this.nextStep());
            this.widget.querySelector('.skip-btn').addEventListener('click', () => this.skipStep());
            this.widget.querySelector('.reset-btn').addEventListener('click', () => this.resetProgress());
            this.widget.querySelector('.help-btn').addEventListener('click', () => {
                alert('GuideFloat Help\n\n- Check boxes to mark steps complete\n- Click step headers to expand/collapse\n- Drag the header to move the widget\n- Click "Skip" button if step is already done\n- Press ESC to toggle peek mode (compact sidebar)\n- Progress is saved automatically');
            });

            // Keyboard shortcut: ESC to toggle peek mode
            document.addEventListener('keydown', (e) => {
                // Only toggle if widget is visible and not in an input field
                if (e.key === 'Escape' && 
                    this.widget && 
                    this.widget.style.display !== 'none' &&
                    !this.isMinimized &&
                    !e.target.matches('input, textarea, [contenteditable="true"]')) {
                    e.preventDefault();
                    this.togglePeekMode();
                }
            });
        },

        // Render widget content
        renderWidget: function() {
            if (!this.widget || !this.currentGuide) return;

            const titleText = this.widget.querySelector('.guidefloat-title-text');
            titleText.textContent = this.currentGuide.title;

            this.updateProgress();
            this.renderSteps();
            this.updateNavigation();
        },

        // Render steps
        renderSteps: async function() {
            const content = this.widget.querySelector('.guidefloat-content');
            const progress = await this.loadProgress(this.currentGuide.id);
            const completedSteps = progress ? progress.completedSteps : [];

            const stepsHTML = this.currentGuide.steps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isActive = index === this.currentStepIndex;
                const isExpanded = isActive;

                return this.createStepHTML(step, index, isCompleted, isActive, isExpanded);
            }).join('');

            content.innerHTML = stepsHTML;
            this.setupStepListeners();
        },

        // Create step HTML
        createStepHTML: function(step, index, isCompleted, isActive, isExpanded) {
            const stepClasses = ['guidefloat-step'];
            if (isCompleted) stepClasses.push('completed');
            if (isActive) stepClasses.push('active');
            if (isExpanded) stepClasses.push('expanded');

            const tipsHTML = step.tips && step.tips.length > 0 ? `
                <div class="guidefloat-step-tips">
                    <div class="guidefloat-tip-title">💡 Tips</div>
                    <ul class="guidefloat-tip-list">
                        ${step.tips.map(tip => `<li class="guidefloat-tip-item">${tip}</li>`).join('')}
                    </ul>
                </div>
            ` : '';

            const layoutDiagramHTML = step.layoutDiagram ? `
                <div class="guidefloat-layout-diagram" style="margin: 12px 0 12px 36px;">
                    <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 6px;">📍 Where to find it:</div>
                    <div style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 12px; max-width: 280px;">
                        ${step.layoutDiagram}
                    </div>
                </div>
            ` : '';

            const actionButtonsHTML = step.actionButtons && step.actionButtons.length > 0 ? `
                <div class="guidefloat-action-buttons">
                    ${step.actionButtons.map(button => `
                        <a href="${button.url}" 
                           class="guidefloat-action-btn"
                           data-button-id="${button.text}">
                            ${button.text} →
                        </a>
                    `).join('')}
                </div>
                <div style="background: #e0f2fe; border-left: 3px solid #0ea5e9; padding: 10px 12px; margin: 8px 0 0 36px; font-size: 12px; color: #0c4a6e; font-weight: 500;">
                    💡 The guide will follow you to the next page!
                </div>
            ` : '';

            const skipBadge = step.skipIfCompleted ? `
                <div style="display: inline-block; background: #fef3c7; color: #92400e; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: 600;">
                    ⏭ SKIPPABLE
                </div>
            ` : '';

            return `
                <div class="${stepClasses.join(' ')}" data-step-id="${step.id}" data-step-index="${index}">
                    <div class="guidefloat-step-header">
                        <div class="guidefloat-checkbox">
                            <span class="guidefloat-checkbox-icon">✓</span>
                        </div>
                        <div style="flex: 1;">
                            <div class="guidefloat-step-number">
                                Step ${step.id} of ${this.currentGuide.totalSteps}
                                ${skipBadge}
                            </div>
                            <div class="guidefloat-step-title">${step.title}</div>
                        </div>
                        <div class="guidefloat-expand-icon">▼</div>
                    </div>
                    <div class="guidefloat-step-body">
                        ${step.skipIfCompleted ? `<div style="background: #fffbeb; border-left: 3px solid #f59e0b; padding: 8px 12px; margin: 8px 0; font-size: 12px; color: #92400e;">💡 ${step.skipMessage || 'Skip this step if you\'ve already completed it.'}</div>` : ''}
                        <div class="guidefloat-step-description">${step.description}</div>
                        <div class="guidefloat-step-instructions">${step.instructions}</div>
                        ${layoutDiagramHTML}
                        ${tipsHTML}
                        ${actionButtonsHTML}
                    </div>
                </div>
            `;
        },

        // Setup step listeners
        setupStepListeners: function() {
            const steps = this.widget.querySelectorAll('.guidefloat-step');

            steps.forEach(stepEl => {
                const stepIndex = parseInt(stepEl.dataset.stepIndex);

                const header = stepEl.querySelector('.guidefloat-step-header');
                header.addEventListener('click', (e) => {
                    if (e.target.closest('.guidefloat-checkbox')) return;
                    stepEl.classList.toggle('expanded');
                });

                const checkbox = stepEl.querySelector('.guidefloat-checkbox');
                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleStepComplete(stepIndex);
                });
            });
        },

        // Toggle step completion
        toggleStepComplete: async function(stepIndex) {
            const step = this.currentGuide.steps[stepIndex];
            const progress = await this.loadProgress(this.currentGuide.id);
            const completedSteps = progress ? progress.completedSteps : [];

            const isCompleted = completedSteps.includes(step.id);

            if (isCompleted) {
                // Unchecking - just remove from completed
                const index = completedSteps.indexOf(step.id);
                completedSteps.splice(index, 1);
            } else {
                // Checking - mark complete and advance to next step
                completedSteps.push(step.id);
                
                // Auto-minimize the completed step
                const stepEl = this.widget.querySelector(`[data-step-index="${stepIndex}"]`);
                if (stepEl) {
                    stepEl.classList.remove('expanded');
                }
                
                // If there's a next step, expand it and scroll to it
                const nextStepIndex = stepIndex + 1;
                if (nextStepIndex < this.currentGuide.steps.length) {
                    // Wait for re-render, then expand and scroll to next step
                    setTimeout(() => {
                        const nextStepEl = this.widget.querySelector(`[data-step-index="${nextStepIndex}"]`);
                        if (nextStepEl) {
                            // Expand the next step
                            nextStepEl.classList.add('expanded');
                            
                            // Scroll to top of next step
                            const content = this.widget.querySelector('.guidefloat-content');
                            if (content) {
                                // Get position of next step relative to content container
                                const contentRect = content.getBoundingClientRect();
                                const stepRect = nextStepEl.getBoundingClientRect();
                                const scrollOffset = stepRect.top - contentRect.top + content.scrollTop;
                                
                                // Smooth scroll to the next step
                                content.scrollTo({
                                    top: scrollOffset,
                                    behavior: 'smooth'
                                });
                            }
                        }
                    }, 100); // Small delay to ensure render completes
                }
            }

            await this.saveProgress(this.currentGuide.id, this.currentStepIndex + 1, completedSteps);
            this.renderSteps();
            this.updateProgress();
        },

        // Show spotlight for current step
        showSpotlight: function() {
            const step = this.currentGuide.steps[this.currentStepIndex];
            
            // Check if step has spotlight data
            if (step.spotlight && window.Spotlight) {
                console.log('[GuideFloat] Showing spotlight for step', step.id);
                
                // Wait a bit for page to settle
                setTimeout(() => {
                    window.Spotlight.create({
                        target: step.spotlight.target,
                        message: step.spotlight.message || step.title,
                        type: step.spotlight.type || 'info',
                        position: step.spotlight.position || 'auto'
                    });
                }, 2000);
            }
        },

        // Check and handle auto-navigation
        checkAutoNavigate: function() {
            const step = this.currentGuide.steps[this.currentStepIndex];
            
            // Check if step has autoNavigate URL
            if (step.autoNavigate && step.autoNavigate.url) {
                const currentUrl = window.location.href;
                const targetUrl = step.autoNavigate.url;
                
                try {
                    const currentUrlObj = new URL(currentUrl);
                    const targetUrlObj = new URL(targetUrl);
                    
                    console.log('[GuideFloat] Checking auto-navigation:');
                    console.log('[GuideFloat] Current URL:', currentUrl);
                    console.log('[GuideFloat] Target URL:', targetUrl);
                    console.log('[GuideFloat] Current domain:', currentUrlObj.origin);
                    console.log('[GuideFloat] Target domain:', targetUrlObj.origin);
                    
                    // More flexible URL comparison
                    const isSameDomain = currentUrlObj.origin === targetUrlObj.origin;
                    const currentPath = currentUrlObj.pathname;
                    const targetPath = targetUrlObj.pathname;
                    
                    // Special handling for Shopify URLs
                    const isShopifyDomain = currentUrlObj.hostname.includes('shopify.com') || 
                                          targetUrlObj.hostname.includes('shopify.com');
                    
                    let isOnTargetPage = false;
                    
                    if (isShopifyDomain) {
                        // For Shopify, be more lenient - if we're on any Shopify domain, don't navigate
                        isOnTargetPage = currentUrlObj.hostname.includes('shopify.com');
                        console.log('[GuideFloat] Shopify domain detected, isOnTargetPage:', isOnTargetPage);
                    } else {
                        // For other domains, use normal logic
                        isOnTargetPage = isSameDomain && (
                            currentPath === targetPath || 
                            currentPath.startsWith(targetPath + '/') ||
                            targetPath.startsWith(currentPath + '/')
                        );
                    }
                    
                    if (!isOnTargetPage) {
                        console.log('[GuideFloat] Auto-navigating to:', targetUrl);
                        
                        // Show brief notification
                        if (step.autoNavigate.message) {
                            this.showNavigationNotice(step.autoNavigate.message);
                        }
                        
                        // Navigate after short delay (let user see the notification)
                        setTimeout(() => {
                            window.location.href = targetUrl;
                        }, 1000);
                    } else {
                        console.log('[GuideFloat] Already on target page, skipping navigation');
                    }
                } catch (error) {
                    console.error('[GuideFloat] Error comparing URLs:', error);
                    // If URL parsing fails, don't navigate to avoid loops
                }
            }
        },

        // Show navigation notice
        showNavigationNotice: function(message) {
            const notice = document.createElement('div');
            notice.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 2147483647;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: 14px;
                font-weight: 500;
                animation: guidefloat-slideIn 0.3s ease-out;
            `;
            
            notice.innerHTML = `🚀 ${message}`;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes guidefloat-slideIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `;
            
            if (!document.querySelector('style[data-navigation-notice]')) {
                style.setAttribute('data-navigation-notice', 'true');
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notice);
            
            // Remove after delay
            setTimeout(() => {
                notice.style.opacity = '0';
                setTimeout(() => notice.remove(), 300);
            }, 2500);
        },

        // Navigation
        nextStep: function() {
            if (this.currentStepIndex < this.currentGuide.steps.length - 1) {
                this.currentStepIndex++;
                this.saveProgress(this.currentGuide.id, this.currentStepIndex + 1);
                this.renderSteps();
                this.updateProgress();
                this.updateNavigation();
                this.widget.querySelector('.guidefloat-content').scrollTop = 0;
                
                // Check for auto-navigation first, then spotlight
                this.checkAutoNavigate();
                
                // Only show spotlight if not navigating away
                const step = this.currentGuide.steps[this.currentStepIndex];
                if (!step.autoNavigate || !step.autoNavigate.url) {
                    this.showSpotlight();
                }
            }
        },

        previousStep: function() {
            if (this.currentStepIndex > 0) {
                this.currentStepIndex--;
                this.saveProgress(this.currentGuide.id, this.currentStepIndex + 1);
                this.renderSteps();
                this.updateProgress();
                this.updateNavigation();
                this.widget.querySelector('.guidefloat-content').scrollTop = 0;
                
                // Check for auto-navigation first, then spotlight
                this.checkAutoNavigate();
                
                // Only show spotlight if not navigating away
                const step = this.currentGuide.steps[this.currentStepIndex];
                if (!step.autoNavigate || !step.autoNavigate.url) {
                    this.showSpotlight();
                }
            }
        },

        skipStep: async function() {
            // Mark current step as completed and move to next
            const currentStep = this.currentGuide.steps[this.currentStepIndex];
            const progress = await this.loadProgress(this.currentGuide.id);
            const completedSteps = progress ? progress.completedSteps : [];
            
            // Add to completed if not already
            if (!completedSteps.includes(currentStep.id)) {
                completedSteps.push(currentStep.id);
                
                // Auto-minimize the current step
                const stepEl = this.widget.querySelector(`[data-step-index="${this.currentStepIndex}"]`);
                if (stepEl) {
                    stepEl.classList.remove('expanded');
                }
                
                await chrome.storage.local.set({
                    [`guidefloat-progress-${this.currentGuide.id}`]: {
                        currentStep: this.currentStepIndex + 2,
                        completedSteps: completedSteps,
                        lastUpdated: new Date().toISOString()
                    }
                });
            }
            
            // Move to next step
            this.nextStep();
        },

        updateNavigation: function() {
            const prevBtn = this.widget.querySelector('.prev-btn');
            const nextBtn = this.widget.querySelector('.next-btn');
            const skipBtn = this.widget.querySelector('.skip-btn');
            
            const currentStep = this.currentGuide.steps[this.currentStepIndex];

            prevBtn.disabled = this.currentStepIndex === 0;
            nextBtn.disabled = this.currentStepIndex === this.currentGuide.steps.length - 1;

            // Show skip button if current step can be skipped
            if (currentStep && currentStep.skipIfCompleted) {
                skipBtn.style.display = 'inline-block';
                skipBtn.title = currentStep.skipMessage || 'Skip this step if already completed';
            } else {
                skipBtn.style.display = 'none';
            }

            if (this.currentStepIndex === this.currentGuide.steps.length - 1) {
                nextBtn.textContent = '🎉 Complete';
            } else {
                nextBtn.textContent = 'Next Step ▶';
            }
        },

        updateProgress: async function() {
            const progress = await this.loadProgress(this.currentGuide.id);
            const completedSteps = progress ? progress.completedSteps.length : 0;
            const totalSteps = this.currentGuide.totalSteps;
            const percentage = Math.round((completedSteps / totalSteps) * 100);

            const progressFill = this.widget.querySelector('.guidefloat-progress-fill');
            const progressPercentage = this.widget.querySelector('.progress-percentage');
            const progressLabel = this.widget.querySelector('.progress-label');

            progressFill.style.width = percentage + '%';
            progressPercentage.textContent = percentage + '%';
            progressLabel.textContent = `Step ${this.currentStepIndex + 1} of ${totalSteps}`;
        },

        toggleMinimize: function() {
            this.isMinimized = !this.isMinimized;
            if (this.isMinimized) {
                this.widget.classList.add('minimized');
                this.widget.style.cursor = 'pointer';
                // Make the entire minimized widget clickable
                this.widget.addEventListener('click', this.handleMinimizedClick);
            } else {
                this.widget.classList.remove('minimized');
                this.widget.style.cursor = '';
                this.widget.removeEventListener('click', this.handleMinimizedClick);
            }
        },

        handleMinimizedClick: function(e) {
            if (GuideFloat.isMinimized) {
                GuideFloat.toggleMinimize();
            }
        },

        togglePeekMode: function() {
            if (this.widget.classList.contains('peek-mode')) {
                this.widget.classList.remove('peek-mode');
                const peekBtn = this.widget.querySelector('.peek-btn');
                if (peekBtn) {
                    peekBtn.textContent = '⚡';
                    peekBtn.title = 'Peek Mode (Compact)';
                }
            } else {
                this.widget.classList.add('peek-mode');
                const peekBtn = this.widget.querySelector('.peek-btn');
                if (peekBtn) {
                    peekBtn.textContent = '📖';
                    peekBtn.title = 'Full Mode (Expand)';
                }
            }
        },

        showSmartSuggestion: function(suggestion) {
            console.log('[GuideFloat] Showing smart suggestion:', suggestion);
            
            // Check if notification already exists
            const existing = this.widget.querySelector('.guidefloat-smart-notification');
            if (existing) {
                console.log('[GuideFloat] Smart notification already showing, skipping duplicate');
                return;
            }
            
            // Create notification overlay
            const notification = document.createElement('div');
            notification.className = 'guidefloat-smart-notification';
            notification.style.cssText = `
                position: relative;
                width: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px;
                border-radius: 16px 16px 0 0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10;
                animation: slideDown 0.3s ease-out;
                flex-shrink: 0;
            `;
            
            notification.innerHTML = `
                <style>
                    @keyframes slideDown {
                        from { transform: translateY(-100%); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                </style>
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                    ${suggestion.title}
                </div>
                <div style="font-size: 13px; line-height: 1.5; margin-bottom: 12px; opacity: 0.95;">
                    ${suggestion.message}
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="smart-accept" style="
                        flex: 1;
                        background: white;
                        color: #667eea;
                        border: none;
                        padding: 10px 16px;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 13px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">
                        ✓ Yes, Skip These Steps
                    </button>
                    <button class="smart-decline" style="
                        flex: 1;
                        background: rgba(255, 255, 255, 0.2);
                        color: white;
                        border: none;
                        padding: 10px 16px;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 13px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">
                        No Thanks
                    </button>
                </div>
            `;
            
            // Add hover effects
            const acceptBtn = notification.querySelector('.smart-accept');
            const declineBtn = notification.querySelector('.smart-decline');
            
            acceptBtn.addEventListener('mouseenter', () => {
                acceptBtn.style.background = '#f0f0f0';
                acceptBtn.style.transform = 'scale(1.02)';
            });
            acceptBtn.addEventListener('mouseleave', () => {
                acceptBtn.style.background = 'white';
                acceptBtn.style.transform = 'scale(1)';
            });
            
            declineBtn.addEventListener('mouseenter', () => {
                declineBtn.style.background = 'rgba(255, 255, 255, 0.3)';
                declineBtn.style.transform = 'scale(1.02)';
            });
            declineBtn.addEventListener('mouseleave', () => {
                declineBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                declineBtn.style.transform = 'scale(1)';
            });
            
            // Handle accept
            acceptBtn.addEventListener('click', async () => {
                // Mark suggested steps as completed
                const progress = await this.loadProgress(this.currentGuide.id);
                const completedSteps = progress ? progress.completedSteps : [];
                
                for (const stepNum of suggestion.steps) {
                    if (!completedSteps.includes(stepNum)) {
                        completedSteps.push(stepNum);
                    }
                }
                
                await this.saveProgress(this.currentGuide.id, this.currentStepIndex + 1, completedSteps);
                
                // Re-render to show updated state
                this.renderSteps();
                this.updateProgress();
                
                // Remove notification with animation
                notification.style.animation = 'slideDown 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            });
            
            // Handle decline
            declineBtn.addEventListener('click', () => {
                notification.style.animation = 'slideDown 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            });
            
            // Add to widget - insert after header
            const header = this.widget.querySelector('.guidefloat-header');
            if (header && header.nextSibling) {
                this.widget.insertBefore(notification, header.nextSibling);
            } else {
                this.widget.insertBefore(notification, this.widget.firstChild);
            }
            
            // Auto-dismiss after 15 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.animation = 'slideDown 0.3s ease-out reverse';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 15000);
        },

        close: async function() {
            if (confirm('Close GuideFloat? Your progress will be saved.')) {
                console.log('[GuideFloat Content] Closing widget...');
                await this.saveProgress(this.currentGuide.id, this.currentStepIndex + 1);
                this.hide();
                
                // Clear state
                await chrome.storage.local.set({ 
                    widgetVisible: false,
                    currentGuide: null,
                    activeTabId: null
                });
                
                // Remove widget from DOM
                if (this.widget) {
                    this.widget.remove();
                    this.widget = null;
                }
                
                this.currentGuide = null;
                console.log('[GuideFloat Content] Widget closed and removed');
            }
        },

        resetProgress: async function() {
            if (confirm('Reset all progress for this guide? This cannot be undone.')) {
                await this.deleteProgress(this.currentGuide.id);
                this.currentStepIndex = 0;
                this.renderWidget();
            }
        },

        makeDraggable: function(element) {
            element.addEventListener('mousedown', (e) => {
                if (this.isMinimized) return;
                if (e.target.closest('.guidefloat-header-btn')) return;

                this.isDragging = true;
                const rect = this.widget.getBoundingClientRect();
                this.dragOffset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };

                element.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;

                const x = e.clientX - this.dragOffset.x;
                const y = e.clientY - this.dragOffset.y;

                this.widget.style.left = x + 'px';
                this.widget.style.top = y + 'px';
                this.widget.style.transform = 'none';
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    element.style.cursor = 'move';
                    this.savePosition();
                }
            });
        },

        savePosition: async function() {
            const rect = this.widget.getBoundingClientRect();
            const position = { left: rect.left, top: rect.top };
            await chrome.storage.local.set({ widgetPosition: position });
        },

        loadPosition: async function() {
            const result = await chrome.storage.local.get(['widgetPosition']);
            if (result.widgetPosition) {
                this.widget.style.left = result.widgetPosition.left + 'px';
                this.widget.style.top = result.widgetPosition.top + 'px';
                this.widget.style.transform = 'none';
            }
        },

        saveProgress: async function(guideId, currentStep, completedSteps = null) {
            const result = await chrome.storage.local.get(['progress']);
            let allProgress = result.progress || {};

            if (!allProgress[guideId]) {
                allProgress[guideId] = {
                    currentStep: currentStep,
                    completedSteps: [],
                    startedAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                };
            } else {
                allProgress[guideId].currentStep = currentStep;
                allProgress[guideId].lastUpdated = new Date().toISOString();
            }

            if (completedSteps !== null) {
                allProgress[guideId].completedSteps = completedSteps;
            }

            await chrome.storage.local.set({ progress: allProgress });
        },

        loadProgress: async function(guideId) {
            const result = await chrome.storage.local.get(['progress']);
            const allProgress = result.progress || {};
            return allProgress[guideId] || null;
        },

        deleteProgress: async function(guideId) {
            const result = await chrome.storage.local.get(['progress']);
            let allProgress = result.progress || {};
            delete allProgress[guideId];
            await chrome.storage.local.set({ progress: allProgress });
        }
    };

    // Make GuideFloat globally accessible
    window.GuideFloat = GuideFloat;
    console.log('[GuideFloat Content] GuideFloat object ready');

    // Initialize on page load
    GuideFloat.init().then(() => {
        console.log('[GuideFloat Content] Initialization complete');
    }).catch((err) => {
        console.error('[GuideFloat Content] Initialization error:', err);
    });

})();

