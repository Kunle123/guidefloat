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
                        <button class="guidefloat-header-btn minimize-btn" title="Minimize">−</button>
                        <button class="guidefloat-header-btn close-btn" title="Close">×</button>
                    </div>
                </div>
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
                alert('GuideFloat Help\n\n- Check boxes to mark steps complete\n- Click step headers to expand/collapse\n- Drag the header to move the widget\n- Click "Skip" button if step is already done\n- Progress is saved automatically');
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
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="guidefloat-action-btn"
                           data-button-id="${button.text}">
                            ${button.text} 🔗
                        </a>
                    `).join('')}
                </div>
                <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 8px 12px; margin: 8px 0 0 36px; font-size: 12px;">
                    <strong>💡 Tip:</strong> Links open in new tabs - the guide stays here!
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
                const index = completedSteps.indexOf(step.id);
                completedSteps.splice(index, 1);
            } else {
                completedSteps.push(step.id);
            }

            await this.saveProgress(this.currentGuide.id, this.currentStepIndex + 1, completedSteps);
            this.renderSteps();
            this.updateProgress();
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

        close: async function() {
            if (confirm('Close GuideFloat? Your progress will be saved.')) {
                await this.saveProgress(this.currentGuide.id, this.currentStepIndex + 1);
                this.hide();
                await chrome.storage.local.set({ widgetVisible: false });
                chrome.runtime.sendMessage({ action: 'widgetClosed' });
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

