// HubSpot Page Detector and Panel Manager
// Detects HubSpot onboarding pages and shows the floating assistant panel

(function() {
    'use strict';

    // Prevent duplicate initialization
    if (typeof window.HubSpotDetector !== 'undefined') {
        return;
    }

    window.HubSpotDetector = {
        currentStep: null,
        panel: null,
        guideData: null,
        isInitialized: false,

        // Initialize the HubSpot detector
        init: function() {
            console.log('[HubSpot Detector] Initializing...');
            
            // Check if we're on a HubSpot page
            if (!this.isHubSpotPage()) {
                console.log('[HubSpot Detector] Not on HubSpot page');
                return;
            }
            
            // Load guide data
            this.loadGuideData();
            
            // Detect current step
            this.detectCurrentStep();
            
            // Initialize panel if we have a valid step
            if (this.currentStep !== null) {
                this.initializePanel();
            }
            
            this.isInitialized = true;
        },

        // Check if we're on a HubSpot page
        isHubSpotPage: function() {
            const hostname = window.location.hostname;
            const pathname = window.location.pathname;
            
            // Check for HubSpot domains
            const hubspotDomains = [
                'app.hubspot.com',
                'hubspot.com',
                'www.hubspot.com'
            ];
            
            const isHubspotDomain = hubspotDomains.some(domain => 
                hostname === domain || hostname.endsWith('.' + domain)
            );
            
            if (!isHubspotDomain) {
                return false;
            }
            
            // Check for onboarding-related paths
            const onboardingPaths = [
                '/onboarding',
                '/settings/domains',
                '/tracking-code',
                '/contacts/new',
                '/deals/new',
                '/dashboard',
                '/home'
            ];
            
            const isOnboardingPath = onboardingPaths.some(path => 
                pathname.includes(path)
            );
            
            console.log('[HubSpot Detector] HubSpot page detected:', {
                hostname,
                pathname,
                isOnboardingPath
            });
            
            return isOnboardingPath;
        },

        // Load guide data from storage or fetch from file
        loadGuideData: function() {
            // Try to get guide data from storage first
            chrome.storage.local.get(['hubspotGuideData'], (result) => {
                if (result.hubspotGuideData) {
                    this.guideData = result.hubspotGuideData;
                    console.log('[HubSpot Detector] Guide data loaded from storage');
                } else {
                    // Fetch from guide file
                    this.fetchGuideData();
                }
            });
        },

        // Fetch guide data from the guide file
        fetchGuideData: function() {
            const guideUrl = chrome.runtime.getURL('guides/hubspot-prefilled-setup.json');
            
            fetch(guideUrl)
                .then(response => response.json())
                .then(data => {
                    this.guideData = data;
                    console.log('[HubSpot Detector] Guide data fetched:', data.id);
                    
                    // Save to storage for future use
                    chrome.storage.local.set({ hubspotGuideData: data });
                })
                .catch(error => {
                    console.error('[HubSpot Detector] Error fetching guide data:', error);
                });
        },

        // Detect the current step based on page content
        detectCurrentStep: function() {
            if (!this.guideData) {
                console.log('[HubSpot Detector] No guide data available');
                return;
            }
            
            const pathname = window.location.pathname;
            const pageContent = document.body.textContent.toLowerCase();
            
            // Step 1: Business Profile
            if (pathname.includes('/onboarding') && 
                (pageContent.includes('tell us about your business') || 
                 pageContent.includes('company information') ||
                 pageContent.includes('business profile'))) {
                this.currentStep = 0;
                console.log('[HubSpot Detector] Detected Step 1: Business Profile');
                return;
            }
            
            // Step 2: Connect Domain
            if (pathname.includes('/settings/domains') || 
                (pageContent.includes('connect your domain') || 
                 pageContent.includes('website tracking') ||
                 pageContent.includes('dns'))) {
                this.currentStep = 1;
                console.log('[HubSpot Detector] Detected Step 2: Connect Domain');
                return;
            }
            
            // Step 3: Tracking Pixel
            if (pathname.includes('/tracking-code') || 
                (pageContent.includes('tracking code') || 
                 pageContent.includes('tracking pixel') ||
                 pageContent.includes('js.hs-scripts.com'))) {
                this.currentStep = 2;
                console.log('[HubSpot Detector] Detected Step 3: Tracking Pixel');
                return;
            }
            
            // Step 4: CRM Data
            if (pathname.includes('/contacts/new') || 
                pathname.includes('/deals/new') ||
                (pageContent.includes('create your first contact') || 
                 pageContent.includes('add a contact') ||
                 pageContent.includes('create a deal'))) {
                this.currentStep = 3;
                console.log('[HubSpot Detector] Detected Step 4: CRM Data');
                return;
            }
            
            // Step 5: Dashboard
            if (pathname.includes('/dashboard') || 
                pathname.includes('/home') ||
                (pageContent.includes('dashboard') || 
                 pageContent.includes('welcome to hubspot'))) {
                this.currentStep = 4;
                console.log('[HubSpot Detector] Detected Step 5: Dashboard');
                return;
            }
            
            console.log('[HubSpot Detector] No specific step detected, defaulting to step 0');
            this.currentStep = 0;
        },

        // Initialize the floating panel
        initializePanel: function() {
            if (!this.guideData || this.currentStep === null) {
                console.log('[HubSpot Detector] Cannot initialize panel - missing data');
                return;
            }
            
            // Wait for panel component to be available
            if (typeof window.GuideFloatPanel === 'undefined') {
                console.log('[HubSpot Detector] Panel component not loaded, waiting...');
                setTimeout(() => this.initializePanel(), 1000);
                return;
            }
            
            // Initialize the panel
            window.GuideFloatPanel.init(this.guideData);
            
            // Show the current step
            window.GuideFloatPanel.showStep(this.currentStep);
            
            // Perform autofill for current step
            this.performAutofill(this.currentStep);
            
            console.log('[HubSpot Detector] Panel initialized for step:', this.currentStep);
        },

        // Perform autofill for a specific step
        performAutofill: function(stepIndex) {
            if (!this.guideData || !this.guideData.steps[stepIndex]) {
                return;
            }
            
            const step = this.guideData.steps[stepIndex];
            
            if (!step.autofill || !step.autofill.enabled) {
                console.log('[HubSpot Detector] No autofill configured for step:', stepIndex);
                return;
            }
            
            console.log('[HubSpot Detector] Performing autofill for step:', stepIndex);
            
            // Get stored data from the 6-step wizard
            chrome.storage.local.get(['wizardData'], (result) => {
                const wizardData = result.wizardData || {};
                
                // Perform autofill for each field
                step.autofill.fields.forEach(field => {
                    this.autofillField(field, wizardData);
                });
            });
        },

        // Autofill a specific field
        autofillField: function(field, wizardData) {
            try {
                const elements = document.querySelectorAll(field.selector);
                
                if (elements.length === 0) {
                    console.log('[HubSpot Detector] No elements found for selector:', field.selector);
                    return;
                }
                
                // Replace template variables with actual data
                let value = field.value;
                Object.keys(wizardData).forEach(key => {
                    const placeholder = `{{${key}}}`;
                    if (value.includes(placeholder)) {
                        value = value.replace(new RegExp(placeholder, 'g'), wizardData[key] || '');
                    }
                });
                
                // Fill the field
                elements.forEach(element => {
                    if (element.type === 'radio' || element.type === 'checkbox') {
                        // Handle radio buttons and checkboxes
                        if (element.value === value || element.value === wizardData[field.value]) {
                            element.checked = true;
                            element.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    } else {
                        // Handle text inputs, selects, etc.
                        element.value = value;
                        element.dispatchEvent(new Event(field.event || 'input', { bubbles: true }));
                    }
                    
                    console.log('[HubSpot Detector] Autofilled field:', field.selector, 'with value:', value);
                });
                
            } catch (error) {
                console.error('[HubSpot Detector] Error autofilling field:', field.selector, error);
            }
        },

        // Handle page navigation
        handleNavigation: function() {
            console.log('[HubSpot Detector] Page navigation detected');
            
            // Wait for page to load
            setTimeout(() => {
                this.detectCurrentStep();
                
                if (this.currentStep !== null && this.panel) {
                    window.GuideFloatPanel.showStep(this.currentStep);
                    this.performAutofill(this.currentStep);
                }
            }, 1000);
        },

        // Start monitoring for page changes
        startMonitoring: function() {
            // Monitor for URL changes
            let lastUrl = window.location.href;
            
            setInterval(() => {
                if (window.location.href !== lastUrl) {
                    lastUrl = window.location.href;
                    this.handleNavigation();
                }
            }, 1000);
            
            // Monitor for DOM changes (for SPA navigation)
            const observer = new MutationObserver(() => {
                this.handleNavigation();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.HubSpotDetector.init();
        });
    } else {
        window.HubSpotDetector.init();
    }
    
    // Start monitoring for page changes
    window.HubSpotDetector.startMonitoring();
    
    console.log('[HubSpot Detector] HubSpot detector loaded');
})();
