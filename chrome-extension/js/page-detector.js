// GuideFloat Page Detector - Smart detection of user's account status

const PageDetector = {
    // Facebook Business Manager Detection
    facebook: {
        // Check if user has Business Manager
        hasBusinessManager: function() {
            const url = window.location.href;
            const indicators = [
                // URL patterns that indicate Business Manager exists
                url.includes('business.facebook.com/') && !url.includes('/create'),
                url.includes('business.facebook.com/settings'),
                url.includes('business.facebook.com/home'),
                // DOM elements that indicate Business Manager
                !!document.querySelector('[data-testid="business-manager-navigation"]'),
                !!document.querySelector('.business-manager-sidebar'),
                // Text content checks
                document.body.textContent.includes('Business Settings'),
                document.body.textContent.includes('Ad Accounts') && 
                    document.body.textContent.includes('Pages')
            ];
            
            const detected = indicators.filter(Boolean).length >= 2;
            console.log('[PageDetector] Has Business Manager:', detected, indicators);
            return detected;
        },
        
        // Check if user has connected Pages
        hasPages: function() {
            const url = window.location.href;
            const indicators = [
                // URL patterns
                url.includes('business.facebook.com/settings/pages'),
                // DOM checks
                !!document.querySelector('[data-testid="pages-list"]'),
                // Check for "Add Page" button (means on pages settings)
                document.body.textContent.includes('Add Page') || 
                    document.body.textContent.includes('Connected Pages')
            ];
            
            const detected = indicators.filter(Boolean).length >= 1;
            console.log('[PageDetector] Has Pages:', detected, indicators);
            return detected;
        },
        
        // Check if user has Ad Accounts
        hasAdAccount: function() {
            const url = window.location.href;
            const indicators = [
                // URL patterns
                url.includes('business.facebook.com/settings/ad-accounts'),
                url.includes('adsmanager.facebook.com'),
                // DOM checks
                !!document.querySelector('[data-testid="ad-accounts-list"]'),
                document.body.textContent.includes('Ad Account') && 
                    document.body.textContent.includes('Account ID')
            ];
            
            const detected = indicators.filter(Boolean).length >= 1;
            console.log('[PageDetector] Has Ad Account:', detected, indicators);
            return detected;
        },
        
        // Check if user has payment method
        hasPaymentMethod: function() {
            const url = window.location.href;
            const indicators = [
                url.includes('billing_hub/payment_settings'),
                url.includes('billing_hub/payment_methods'),
                // Check for payment method indicators
                document.body.textContent.includes('Payment Method') &&
                    (document.body.textContent.includes('ending in') || 
                     document.body.textContent.includes('•••• ••••'))
            ];
            
            const detected = indicators.filter(Boolean).length >= 1;
            console.log('[PageDetector] Has Payment Method:', detected, indicators);
            return detected;
        }
    },
    
    // Google Ads Detection
    google: {
        hasAdsAccount: function() {
            const url = window.location.href;
            return url.includes('ads.google.com') && 
                   !url.includes('/signup') &&
                   !url.includes('/welcome');
        },
        
        hasPaymentInfo: function() {
            return document.body.textContent.includes('Billing') &&
                   document.body.textContent.includes('Payment method');
        }
    },
    
    // Shopify Detection
    shopify: {
        hasStore: function() {
            const url = window.location.href;
            return url.includes('.myshopify.com/admin') ||
                   url.includes('shopify.com/store/');
        },
        
        hasProducts: function() {
            return document.body.textContent.includes('Products') &&
                   document.querySelector('[data-polaris-unstyled="true"]');
        }
    },
    
    // Generic detection helper
    waitForElement: async function(selector, timeout = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        return null;
    },
    
    // Detect current state for a specific guide
    detectGuideState: async function(guideId) {
        console.log(`[PageDetector] Detecting state for guide: ${guideId}`);
        
        // Wait a bit for page to fully load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const state = {};
        
        if (guideId === 'facebook-ads-setup') {
            state.hasBusinessManager = this.facebook.hasBusinessManager();
            state.hasPages = this.facebook.hasPages();
            state.hasAdAccount = this.facebook.hasAdAccount();
            state.hasPaymentMethod = this.facebook.hasPaymentMethod();
            
            // Determine recommended skip steps
            const skipSteps = [];
            if (state.hasBusinessManager) skipSteps.push(1);
            if (state.hasPages) skipSteps.push(2);
            if (state.hasAdAccount) skipSteps.push(3);
            if (state.hasPaymentMethod) skipSteps.push(4);
            
            state.recommendedSkips = skipSteps;
        }
        
        console.log('[PageDetector] Detected state:', state);
        return state;
    },
    
    // Get smart suggestion message
    getSuggestionMessage: function(detectedState, guideId) {
        if (guideId === 'facebook-ads-setup') {
            const skips = detectedState.recommendedSkips || [];
            if (skips.length === 0) {
                return null; // No suggestions
            }
            
            const stepNames = {
                1: 'Business Manager setup',
                2: 'Page connection',
                3: 'Ad Account creation',
                4: 'Payment method'
            };
            
            const skipList = skips.map(num => stepNames[num]).join(', ');
            
            return {
                title: '🎯 Smart Detection!',
                message: `We detected you already have: ${skipList}. Would you like to skip these steps?`,
                action: 'skip',
                steps: skips
            };
        }
        
        return null;
    }
};

// Make it globally accessible
window.PageDetector = PageDetector;

console.log('[PageDetector] Loaded successfully');

