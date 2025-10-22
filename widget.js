// GuideFloat Widget - Main JavaScript
// Floating step-by-step guide widget that works on any website

(function() {
    'use strict';

    // Main GuideFloat object
    window.GuideFloat = {
        currentGuide: null,
        currentStepIndex: 0,
        widget: null,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        isMinimized: false,

        // Initialize the widget
        init: function(options = {}) {
            const guideId = options.guideId || localStorage.getItem('guidefloat-current-guide');
            
            if (!guideId) {
                this.showGuideSelector();
                return;
            }
            
            this.loadGuide(guideId);
        },

        // Load a guide from JSON
        loadGuide: function(guideId) {
            this.showLoading();
            
            // Construct the URL for the guide JSON
            const guideUrl = `guides/${guideId}.json`;
            
            fetch(guideUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Guide not found');
                    }
                    return response.json();
                })
                .then(data => {
                    this.currentGuide = data;
                    localStorage.setItem('guidefloat-current-guide', guideId);
                    
                    // Load saved progress
                    const progress = this.loadProgress(guideId);
                    if (progress) {
                        this.currentStepIndex = progress.currentStep - 1; // Convert to 0-based index
                    } else {
                        this.currentStepIndex = 0;
                    }
                    
                    this.renderWidget();
                })
                .catch(error => {
                    console.error('Failed to load guide:', error);
                    this.showError('Failed to load guide. Please try again.');
                });
        },

        // Show loading state
        showLoading: function() {
            if (!this.widget) {
                this.createWidget();
            }
            
            const content = this.widget.querySelector('.guidefloat-content');
            content.innerHTML = `
                <div class="guidefloat-loading">
                    <div class="guidefloat-spinner"></div>
                    <div class="guidefloat-loading-text">Loading guide...</div>
                </div>
            `;
        },

        // Show error message
        showError: function(message) {
            if (!this.widget) {
                this.createWidget();
            }
            
            const content = this.widget.querySelector('.guidefloat-content');
            content.innerHTML = `
                <div class="guidefloat-empty">
                    <div class="guidefloat-empty-icon">⚠️</div>
                    <div class="guidefloat-empty-text">${message}</div>
                </div>
            `;
        },

        // Show guide selector when no guide is selected
        showGuideSelector: function() {
            if (!this.widget) {
                this.createWidget();
            }
            
            const content = this.widget.querySelector('.guidefloat-content');
            content.innerHTML = `
                <div class="guidefloat-empty">
                    <div class="guidefloat-empty-icon">📚</div>
                    <div class="guidefloat-empty-text">
                        <p style="margin-bottom: 12px;">No guide selected.</p>
                        <p style="font-size: 13px;">Visit the GuideFloat homepage to choose a guide.</p>
                    </div>
                </div>
            `;
            
            const header = this.widget.querySelector('.guidefloat-title');
            header.innerHTML = '<span>🚀</span> GuideFloat';
        },

        // Create the widget DOM structure
        createWidget: function() {
            // Check if widget already exists
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
                    <button class="guidefloat-nav-btn primary next-btn">Next Step ▶</button>
                </div>
                <div class="guidefloat-action-bar">
                    <button class="guidefloat-secondary-btn reset-btn danger">Reset Progress</button>
                    <button class="guidefloat-secondary-btn help-btn">Help</button>
                </div>
            `;
            
            document.body.appendChild(widget);
            this.widget = widget;
            
            // Load saved position
            this.loadPosition();
            
            // Setup event listeners
            this.setupEventListeners();
        },

        // Setup all event listeners
        setupEventListeners: function() {
            // Make header draggable
            const header = this.widget.querySelector('.guidefloat-header');
            this.makeDraggable(header);
            
            // Minimize button
            this.widget.querySelector('.minimize-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize();
            });
            
            // Close button
            this.widget.querySelector('.close-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
            
            // Navigation buttons
            this.widget.querySelector('.prev-btn').addEventListener('click', () => {
                this.previousStep();
            });
            
            this.widget.querySelector('.next-btn').addEventListener('click', () => {
                this.nextStep();
            });
            
            // Reset button
            this.widget.querySelector('.reset-btn').addEventListener('click', () => {
                this.resetProgress();
            });
            
            // Help button
            this.widget.querySelector('.help-btn').addEventListener('click', () => {
                alert('GuideFloat Help\n\n- Check boxes to mark steps complete\n- Click step headers to expand/collapse\n- Drag the header to move the widget\n- Progress is saved automatically\n\nNeed more help? Visit guidefloat.com');
            });
        },

        // Render the widget with guide data
        renderWidget: function() {
            if (!this.widget) {
                this.createWidget();
            }
            
            // Update header title
            const titleText = this.widget.querySelector('.guidefloat-title-text');
            titleText.textContent = this.currentGuide.title;
            
            // Update progress
            this.updateProgress();
            
            // Render steps
            this.renderSteps();
            
            // Update navigation buttons
            this.updateNavigation();
        },

        // Render all steps
        renderSteps: function() {
            const content = this.widget.querySelector('.guidefloat-content');
            const progress = this.loadProgress(this.currentGuide.id);
            const completedSteps = progress ? progress.completedSteps : [];
            
            const stepsHTML = this.currentGuide.steps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isActive = index === this.currentStepIndex;
                const isExpanded = isActive;
                
                return this.createStepHTML(step, index, isCompleted, isActive, isExpanded);
            }).join('');
            
            content.innerHTML = stepsHTML;
            
            // Add event listeners to steps
            this.setupStepListeners();
        },

        // Create HTML for a single step
        createStepHTML: function(step, index, isCompleted, isActive, isExpanded) {
            const stepClasses = ['guidefloat-step'];
            if (isCompleted) stepClasses.push('completed');
            if (isActive) stepClasses.push('active');
            if (isExpanded) stepClasses.push('expanded');
            
            const tipsHTML = step.tips && step.tips.length > 0 ? `
                <div class="guidefloat-step-tips">
                    <div class="guidefloat-tip-title">
                        💡 Tips
                    </div>
                    <ul class="guidefloat-tip-list">
                        ${step.tips.map(tip => `<li class="guidefloat-tip-item">${tip}</li>`).join('')}
                    </ul>
                </div>
            ` : '';
            
            const actionButtonsHTML = step.actionButtons && step.actionButtons.length > 0 ? `
                <div class="guidefloat-action-buttons">
                    ${step.actionButtons.map(button => `
                        <a href="${button.url}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="guidefloat-action-btn"
                           data-button-id="${button.text}"
                           title="Opens in new tab - widget stays here">
                            ${button.text}
                            🔗
                        </a>
                    `).join('')}
                </div>
                <p style="font-size: 11px; color: #6c757d; margin: 8px 0 0 36px;">
                    💡 Tip: Links open in new tab so this guide stays visible
                </p>
            ` : '';
            
            return `
                <div class="${stepClasses.join(' ')}" data-step-id="${step.id}" data-step-index="${index}">
                    <div class="guidefloat-step-header">
                        <div class="guidefloat-checkbox">
                            <span class="guidefloat-checkbox-icon">✓</span>
                        </div>
                        <div style="flex: 1;">
                            <div class="guidefloat-step-number">Step ${step.id} of ${this.currentGuide.totalSteps}</div>
                            <div class="guidefloat-step-title">${step.title}</div>
                        </div>
                        <div class="guidefloat-expand-icon">▼</div>
                    </div>
                    <div class="guidefloat-step-body">
                        <div class="guidefloat-step-description">${step.description}</div>
                        <div class="guidefloat-step-instructions">${step.instructions}</div>
                        ${tipsHTML}
                        ${actionButtonsHTML}
                    </div>
                </div>
            `;
        },

        // Setup listeners for step interactions
        setupStepListeners: function() {
            const steps = this.widget.querySelectorAll('.guidefloat-step');
            
            steps.forEach(stepEl => {
                const stepIndex = parseInt(stepEl.dataset.stepIndex);
                
                // Toggle expansion on header click
                const header = stepEl.querySelector('.guidefloat-step-header');
                header.addEventListener('click', (e) => {
                    // Don't toggle if clicking checkbox
                    if (e.target.closest('.guidefloat-checkbox')) {
                        return;
                    }
                    stepEl.classList.toggle('expanded');
                });
                
                // Checkbox click
                const checkbox = stepEl.querySelector('.guidefloat-checkbox');
                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleStepComplete(stepIndex);
                });
            });
            
            // Track action button clicks
            const actionButtons = this.widget.querySelectorAll('.guidefloat-action-btn');
            actionButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const buttonId = button.dataset.buttonId;
                    const url = button.href;
                    this.trackClick(buttonId, url);
                });
            });
        },

        // Toggle step completion
        toggleStepComplete: function(stepIndex) {
            const step = this.currentGuide.steps[stepIndex];
            const progress = this.loadProgress(this.currentGuide.id);
            const completedSteps = progress ? progress.completedSteps : [];
            
            const isCompleted = completedSteps.includes(step.id);
            
            if (isCompleted) {
                // Unmark as complete
                const index = completedSteps.indexOf(step.id);
                completedSteps.splice(index, 1);
            } else {
                // Mark as complete
                completedSteps.push(step.id);
            }
            
            this.saveProgress(this.currentGuide.id, this.currentStepIndex + 1, completedSteps);
            this.renderSteps();
            this.updateProgress();
        },

        // Move to next step
        nextStep: function() {
            if (this.currentStepIndex < this.currentGuide.steps.length - 1) {
                this.currentStepIndex++;
                this.saveProgress(this.currentGuide.id, this.currentStepIndex + 1);
                this.renderSteps();
                this.updateProgress();
                this.updateNavigation();
                
                // Scroll to top of content
                this.widget.querySelector('.guidefloat-content').scrollTop = 0;
            }
        },

        // Move to previous step
        previousStep: function() {
            if (this.currentStepIndex > 0) {
                this.currentStepIndex--;
                this.saveProgress(this.currentGuide.id, this.currentStepIndex + 1);
                this.renderSteps();
                this.updateProgress();
                this.updateNavigation();
                
                // Scroll to top of content
                this.widget.querySelector('.guidefloat-content').scrollTop = 0;
            }
        },

        // Update navigation buttons
        updateNavigation: function() {
            const prevBtn = this.widget.querySelector('.prev-btn');
            const nextBtn = this.widget.querySelector('.next-btn');
            
            prevBtn.disabled = this.currentStepIndex === 0;
            nextBtn.disabled = this.currentStepIndex === this.currentGuide.steps.length - 1;
            
            if (this.currentStepIndex === this.currentGuide.steps.length - 1) {
                nextBtn.textContent = '🎉 Complete';
            } else {
                nextBtn.textContent = 'Next Step ▶';
            }
        },

        // Update progress bar
        updateProgress: function() {
            const progress = this.loadProgress(this.currentGuide.id);
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

        // Toggle minimize/maximize
        toggleMinimize: function() {
            this.isMinimized = !this.isMinimized;
            
            if (this.isMinimized) {
                this.widget.classList.add('minimized');
                // Make the entire widget clickable when minimized
                this.widget.style.cursor = 'pointer';
                this.widget.addEventListener('click', this.handleMinimizedClick);
            } else {
                this.widget.classList.remove('minimized');
                this.widget.style.cursor = '';
                this.widget.removeEventListener('click', this.handleMinimizedClick);
            }
        },

        // Handle click on minimized widget
        handleMinimizedClick: function(e) {
            if (GuideFloat.isMinimized) {
                GuideFloat.toggleMinimize();
            }
        },

        // Close the widget
        close: function() {
            if (confirm('Close GuideFloat? Your progress will be saved.')) {
                this.saveProgress(this.currentGuide.id, this.currentStepIndex + 1);
                this.savePosition();
                this.widget.remove();
                this.widget = null;
            }
        },

        // Reset progress
        resetProgress: function() {
            if (confirm('Reset all progress for this guide? This cannot be undone.')) {
                this.deleteProgress(this.currentGuide.id);
                this.currentStepIndex = 0;
                this.renderWidget();
            }
        },

        // Make element draggable
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

        // Save widget position
        savePosition: function() {
            const rect = this.widget.getBoundingClientRect();
            const position = {
                left: rect.left,
                top: rect.top
            };
            localStorage.setItem('guidefloat-position', JSON.stringify(position));
        },

        // Load widget position
        loadPosition: function() {
            const savedPosition = localStorage.getItem('guidefloat-position');
            if (savedPosition) {
                const position = JSON.parse(savedPosition);
                this.widget.style.left = position.left + 'px';
                this.widget.style.top = position.top + 'px';
                this.widget.style.transform = 'none';
            }
        },

        // Save progress to localStorage
        saveProgress: function(guideId, currentStep, completedSteps = null) {
            let allProgress = JSON.parse(localStorage.getItem('guidefloat-progress') || '{}');
            
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
            
            localStorage.setItem('guidefloat-progress', JSON.stringify(allProgress));
        },

        // Load progress from localStorage
        loadProgress: function(guideId) {
            const allProgress = JSON.parse(localStorage.getItem('guidefloat-progress') || '{}');
            return allProgress[guideId] || null;
        },

        // Delete progress for a guide
        deleteProgress: function(guideId) {
            let allProgress = JSON.parse(localStorage.getItem('guidefloat-progress') || '{}');
            delete allProgress[guideId];
            localStorage.setItem('guidefloat-progress', JSON.stringify(allProgress));
        },

        // Track affiliate link clicks
        trackClick: function(buttonId, url) {
            console.log('GuideFloat: Tracking click', { buttonId, url, guideId: this.currentGuide.id });
            
            // You can send this to an analytics service
            // For now, just log to console
            
            // Optional: Send to analytics endpoint
            // fetch('/api/analytics/click', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ buttonId, url, guideId: this.currentGuide.id })
            // });
        }
    };

    // Auto-initialize if guide is set
    const savedGuide = localStorage.getItem('guidefloat-current-guide');
    if (savedGuide && !document.getElementById('guidefloat-widget')) {
        // Don't auto-init if we're on the landing page
        if (!window.location.pathname.includes('index.html') && !window.location.pathname.endsWith('/')) {
            // We're on an external site, auto-load might be appropriate
            // But let's wait for explicit bookmarklet activation
        }
    }

})();

