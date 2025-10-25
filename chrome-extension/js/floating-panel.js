// GuideFloat Floating Panel Component
// Renders the right-side assistant panel for HubSpot and other guided experiences

(function() {
    'use strict';

    // Prevent duplicate initialization
    if (typeof window.GuideFloatPanel !== 'undefined') {
        return;
    }

    window.GuideFloatPanel = {
        panel: null,
        currentStep: 0,
        totalSteps: 0,
        guideData: null,
        isVisible: false,

        // Initialize the floating panel
        init: function(guideData) {
            console.log('[GuideFloat Panel] Initializing with guide:', guideData.id);
            
            this.guideData = guideData;
            this.totalSteps = guideData.steps.length;
            this.currentStep = 0;
            
            this.createPanel();
            this.showStep(0);
            this.show();
        },

        // Create the floating panel DOM structure
        createPanel: function() {
            // Remove existing panel if it exists
            this.destroy();
            
            // Create panel container
            this.panel = document.createElement('div');
            this.panel.id = 'guidefloat-panel';
            this.panel.className = 'guidefloat-panel';
            
            // Panel HTML structure
            this.panel.innerHTML = `
                <div class="guidefloat-panel-header">
                    <div class="guidefloat-panel-branding">
                        <div class="guidefloat-panel-logo">🚀</div>
                        <div class="guidefloat-panel-title">${this.guideData.title}</div>
                    </div>
                    <div class="guidefloat-panel-controls">
                        <button class="guidefloat-panel-minimize" title="Minimize">−</button>
                        <button class="guidefloat-panel-close" title="Close">×</button>
                    </div>
                </div>
                
                <div class="guidefloat-panel-progress">
                    <div class="guidefloat-panel-progress-bar">
                        <div class="guidefloat-panel-progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="guidefloat-panel-progress-text">0 of ${this.totalSteps} steps complete</div>
                </div>
                
                <div class="guidefloat-panel-content">
                    <div class="guidefloat-panel-step-list"></div>
                    <div class="guidefloat-panel-current-step"></div>
                </div>
                
                <div class="guidefloat-panel-footer">
                    <div class="guidefloat-panel-status">We're filling things in for you using your answers.</div>
                </div>
            `;
            
            // Add panel to page
            document.body.appendChild(this.panel);
            
            // Add event listeners
            this.setupEventListeners();
            
            // Add panel styles
            this.addPanelStyles();
        },

        // Add CSS styles for the panel
        addPanelStyles: function() {
            if (document.getElementById('guidefloat-panel-styles')) {
                return;
            }
            
            const styles = document.createElement('style');
            styles.id = 'guidefloat-panel-styles';
            styles.textContent = `
                .guidefloat-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 360px;
                    max-height: calc(100vh - 40px);
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                    z-index: 2147483647;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 14px;
                    line-height: 1.5;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                }
                
                .guidefloat-panel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #ff7a59 0%, #ff6b35 100%);
                    color: white;
                }
                
                .guidefloat-panel-branding {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .guidefloat-panel-logo {
                    font-size: 20px;
                }
                
                .guidefloat-panel-title {
                    font-weight: 600;
                    font-size: 16px;
                }
                
                .guidefloat-panel-controls {
                    display: flex;
                    gap: 8px;
                }
                
                .guidefloat-panel-minimize,
                .guidefloat-panel-close {
                    width: 24px;
                    height: 24px;
                    border: none;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .guidefloat-panel-minimize:hover,
                .guidefloat-panel-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                .guidefloat-panel-progress {
                    padding: 16px 20px;
                    background: #f9fafb;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .guidefloat-panel-progress-bar {
                    width: 100%;
                    height: 6px;
                    background: #e5e7eb;
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: 8px;
                }
                
                .guidefloat-panel-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #ff7a59 0%, #ff6b35 100%);
                    border-radius: 3px;
                    transition: width 0.3s ease;
                }
                
                .guidefloat-panel-progress-text {
                    font-size: 12px;
                    color: #6b7280;
                    text-align: center;
                }
                
                .guidefloat-panel-content {
                    max-height: calc(100vh - 200px);
                    overflow-y: auto;
                }
                
                .guidefloat-panel-step-list {
                    padding: 16px 20px;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .guidefloat-panel-step {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px 0;
                    border-radius: 6px;
                    transition: background-color 0.2s ease;
                }
                
                .guidefloat-panel-step:hover {
                    background: #f9fafb;
                }
                
                .guidefloat-panel-step.active {
                    background: #fef3f2;
                    border-left: 3px solid #ff7a59;
                    padding-left: 12px;
                }
                
                .guidefloat-panel-step.completed {
                    background: #f0fdf4;
                }
                
                .guidefloat-panel-step-icon {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 600;
                }
                
                .guidefloat-panel-step-icon.pending {
                    background: #e5e7eb;
                    color: #6b7280;
                }
                
                .guidefloat-panel-step-icon.active {
                    background: #ff7a59;
                    color: white;
                }
                
                .guidefloat-panel-step-icon.completed {
                    background: #10b981;
                    color: white;
                }
                
                .guidefloat-panel-step-content {
                    flex: 1;
                }
                
                .guidefloat-panel-step-title {
                    font-weight: 500;
                    color: #111827;
                    margin-bottom: 2px;
                }
                
                .guidefloat-panel-step-status {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                .guidefloat-panel-current-step {
                    padding: 20px;
                }
                
                .guidefloat-panel-step-header {
                    margin-bottom: 16px;
                }
                
                .guidefloat-panel-step-title-large {
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 8px;
                }
                
                .guidefloat-panel-step-description {
                    color: #6b7280;
                    margin-bottom: 16px;
                }
                
                .guidefloat-panel-step-content-text {
                    color: #374151;
                    margin-bottom: 20px;
                    white-space: pre-line;
                }
                
                .guidefloat-panel-step-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .guidefloat-panel-button {
                    padding: 12px 16px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                }
                
                .guidefloat-panel-button.primary {
                    background: linear-gradient(135deg, #ff7a59 0%, #ff6b35 100%);
                    color: white;
                }
                
                .guidefloat-panel-button.primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
                }
                
                .guidefloat-panel-button.secondary {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }
                
                .guidefloat-panel-button.secondary:hover {
                    background: #e5e7eb;
                }
                
                .guidefloat-panel-footer {
                    padding: 16px 20px;
                    background: #f9fafb;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                }
                
                .guidefloat-panel-status {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                .guidefloat-panel.minimized {
                    height: 60px;
                    overflow: hidden;
                }
                
                .guidefloat-panel.minimized .guidefloat-panel-content,
                .guidefloat-panel.minimized .guidefloat-panel-footer {
                    display: none;
                }
                
                .guidefloat-panel.minimized .guidefloat-panel-progress {
                    display: none;
                }
                
                @media (max-width: 768px) {
                    .guidefloat-panel {
                        width: calc(100vw - 40px);
                        right: 20px;
                        left: 20px;
                    }
                }
            `;
            
            document.head.appendChild(styles);
        },

        // Setup event listeners
        setupEventListeners: function() {
            // Close button
            this.panel.querySelector('.guidefloat-panel-close').addEventListener('click', () => {
                this.hide();
            });
            
            // Minimize button
            this.panel.querySelector('.guidefloat-panel-minimize').addEventListener('click', () => {
                this.toggleMinimize();
            });
            
            // Step click handlers
            this.panel.addEventListener('click', (e) => {
                if (e.target.classList.contains('guidefloat-panel-step')) {
                    const stepIndex = parseInt(e.target.dataset.stepIndex);
                    this.showStep(stepIndex);
                }
            });
        },

        // Show a specific step
        showStep: function(stepIndex) {
            if (stepIndex < 0 || stepIndex >= this.totalSteps) {
                return;
            }
            
            this.currentStep = stepIndex;
            const step = this.guideData.steps[stepIndex];
            
            // Update step list
            this.updateStepList();
            
            // Update current step content
            this.updateCurrentStep(step);
            
            // Update progress
            this.updateProgress();
        },

        // Update the step list
        updateStepList: function() {
            const stepList = this.panel.querySelector('.guidefloat-panel-step-list');
            stepList.innerHTML = '';
            
            this.guideData.steps.forEach((step, index) => {
                const stepElement = document.createElement('div');
                stepElement.className = 'guidefloat-panel-step';
                stepElement.dataset.stepIndex = index;
                
                let status = 'pending';
                let statusText = 'Ready to fill';
                let icon = (index + 1).toString();
                
                if (index < this.currentStep) {
                    status = 'completed';
                    statusText = 'Done ✓';
                    icon = '✓';
                } else if (index === this.currentStep) {
                    status = 'active';
                    statusText = 'Action needed';
                }
                
                stepElement.innerHTML = `
                    <div class="guidefloat-panel-step-icon ${status}">${icon}</div>
                    <div class="guidefloat-panel-step-content">
                        <div class="guidefloat-panel-step-title">${step.title}</div>
                        <div class="guidefloat-panel-step-status">${statusText}</div>
                    </div>
                `;
                
                stepList.appendChild(stepElement);
            });
        },

        // Update current step content
        updateCurrentStep: function(step) {
            const currentStepContainer = this.panel.querySelector('.guidefloat-panel-current-step');
            
            currentStepContainer.innerHTML = `
                <div class="guidefloat-panel-step-header">
                    <div class="guidefloat-panel-step-title-large">${step.title}</div>
                    <div class="guidefloat-panel-step-description">${step.description}</div>
                </div>
                
                <div class="guidefloat-panel-step-content-text">${step.content}</div>
                
                <div class="guidefloat-panel-step-actions">
                    ${this.renderActionButtons(step.actionButtons)}
                </div>
            `;
            
            // Add action button event listeners
            this.setupActionButtonListeners(step);
        },

        // Render action buttons
        renderActionButtons: function(actionButtons) {
            if (!actionButtons || actionButtons.length === 0) {
                return '';
            }
            
            return actionButtons.map(button => {
                const buttonClass = button.primary ? 'primary' : 'secondary';
                return `
                    <button class="guidefloat-panel-button ${buttonClass}" 
                            data-action="${button.text}" 
                            data-url="${button.url}">
                        ${button.text}
                    </button>
                `;
            }).join('');
        },

        // Setup action button listeners
        setupActionButtonListeners: function(step) {
            const buttons = this.panel.querySelectorAll('.guidefloat-panel-button');
            
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const action = e.target.dataset.action;
                    const url = e.target.dataset.url;
                    
                    this.handleAction(action, url, step);
                });
            });
        },

        // Handle action button clicks
        handleAction: function(action, url, step) {
            console.log('[GuideFloat Panel] Action clicked:', action, url);
            
            // Handle step navigation
            if (url.startsWith('#step')) {
                const stepNumber = parseInt(url.replace('#step', ''));
                this.showStep(stepNumber - 1);
                return;
            }
            
            // Handle completion
            if (url === '#complete') {
                this.showCompletion();
                return;
            }
            
            // Handle external URLs
            if (url.startsWith('http')) {
                window.open(url, '_blank');
                return;
            }
            
            // Handle autofill actions
            if (action.includes('Complete') || action.includes('Done')) {
                this.markStepComplete();
                this.nextStep();
            }
        },

        // Mark current step as complete
        markStepComplete: function() {
            console.log('[GuideFloat Panel] Marking step complete:', this.currentStep);
            
            // Update step status in the list
            const stepElement = this.panel.querySelector(`[data-step-index="${this.currentStep}"]`);
            if (stepElement) {
                stepElement.classList.remove('active');
                stepElement.classList.add('completed');
                
                const icon = stepElement.querySelector('.guidefloat-panel-step-icon');
                icon.classList.remove('active');
                icon.classList.add('completed');
                icon.textContent = '✓';
                
                const status = stepElement.querySelector('.guidefloat-panel-step-status');
                status.textContent = 'Done ✓';
            }
        },

        // Move to next step
        nextStep: function() {
            if (this.currentStep < this.totalSteps - 1) {
                this.showStep(this.currentStep + 1);
            } else {
                this.showCompletion();
            }
        },

        // Show completion screen
        showCompletion: function() {
            const currentStepContainer = this.panel.querySelector('.guidefloat-panel-current-step');
            
            currentStepContainer.innerHTML = `
                <div class="guidefloat-panel-step-header">
                    <div class="guidefloat-panel-step-title-large">🎉 Setup Complete!</div>
                    <div class="guidefloat-panel-step-description">Your HubSpot workspace is now running!</div>
                </div>
                
                <div class="guidefloat-panel-step-content-text">${this.guideData.completion.message}</div>
                
                <div class="guidefloat-panel-step-actions">
                    ${this.renderActionButtons(this.guideData.completion.actions)}
                </div>
            `;
            
            // Update progress to 100%
            this.updateProgress(100);
            
            // Setup completion action listeners
            this.setupActionButtonListeners({ actionButtons: this.guideData.completion.actions });
        },

        // Update progress bar
        updateProgress: function(percentage) {
            const progressFill = this.panel.querySelector('.guidefloat-panel-progress-fill');
            const progressText = this.panel.querySelector('.guidefloat-panel-progress-text');
            
            if (percentage !== undefined) {
                progressFill.style.width = percentage + '%';
                progressText.textContent = `${this.totalSteps} of ${this.totalSteps} steps complete`;
            } else {
                const completedSteps = this.currentStep;
                const percentage = Math.round((completedSteps / this.totalSteps) * 100);
                progressFill.style.width = percentage + '%';
                progressText.textContent = `${completedSteps} of ${this.totalSteps} steps complete`;
            }
        },

        // Show the panel
        show: function() {
            if (this.panel) {
                this.panel.style.display = 'block';
                this.isVisible = true;
                console.log('[GuideFloat Panel] Panel shown');
            }
        },

        // Hide the panel
        hide: function() {
            if (this.panel) {
                this.panel.style.display = 'none';
                this.isVisible = false;
                console.log('[GuideFloat Panel] Panel hidden');
            }
        },

        // Toggle minimize
        toggleMinimize: function() {
            if (this.panel) {
                this.panel.classList.toggle('minimized');
                const minimizeBtn = this.panel.querySelector('.guidefloat-panel-minimize');
                minimizeBtn.textContent = this.panel.classList.contains('minimized') ? '+' : '−';
            }
        },

        // Destroy the panel
        destroy: function() {
            if (this.panel) {
                this.panel.remove();
                this.panel = null;
                this.isVisible = false;
                console.log('[GuideFloat Panel] Panel destroyed');
            }
        }
    };

    console.log('[GuideFloat Panel] Panel component loaded');
})();
