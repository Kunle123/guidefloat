// GuideFloat Chrome Extension - Popup Script

// Category definitions
const categories = {
    testing: { name: 'Testing & Development', icon: '🧪', color: '#f59e0b' },
    examples: { name: 'Examples & Demos', icon: '📝', color: '#10b981' },
    marketing: { name: 'Marketing & Ads', icon: '📱', color: '#3b82f6' },
    ecommerce: { name: 'E-commerce', icon: '🛒', color: '#10b981' },
    email: { name: 'Email Marketing', icon: '📧', color: '#8b5cf6' },
    website: { name: 'Website Building', icon: '🌐', color: '#06b6d4' },
    analytics: { name: 'Analytics', icon: '📊', color: '#f59e0b' },
    business: { name: 'Business Tools', icon: '💼', color: '#8b5cf6' }
};

const guides = [
    {
        id: 'test-signup-flow',
        title: '🧪 Test Signup Flow Guide',
        description: 'Test guide for the GuideFloat test page - demonstrates all features',
        category: 'testing',
        difficulty: 'Beginner',
        estimatedTime: '5 minutes',
        totalSteps: 4,
        icon: '🧪'
    },
    {
        id: 'generic-form-guide',
        title: '📝 Generic Form Guide',
        description: 'Demonstrates automatic field detection on any website form',
        category: 'examples',
        difficulty: 'Beginner',
        estimatedTime: '3 minutes',
        totalSteps: 2,
        icon: '📝'
    },
    {
        id: 'facebook-ads-setup',
        title: 'Facebook Ads Setup Guide',
        description: 'Complete step-by-step guide to setting up Facebook Ads from scratch',
        category: 'marketing',
        difficulty: 'Beginner',
        estimatedTime: '45 minutes',
        totalSteps: 15,
        icon: '📱'
    },
    {
        id: 'shopify-store-setup',
        title: '🛍️ Shopify Store Setup',
        description: 'Build your online store from scratch - complete setup in under 2 hours',
        category: 'ecommerce',
        difficulty: 'Beginner',
        estimatedTime: '90 minutes',
        totalSteps: 12,
        icon: '🛍️',
        hasAffiliate: true
    },
    {
        id: 'hubspot-prefilled-setup',
        title: '💼 HubSpot Setup Assistant',
        description: 'Floating assistant panel that guides you through HubSpot onboarding with pre-filled data',
        category: 'business',
        difficulty: 'Intermediate',
        estimatedTime: '15-20 minutes',
        totalSteps: 5,
        icon: '💼',
        hasAffiliate: true
    },
    {
        id: 'mailchimp-campaign',
        title: 'Mailchimp Email Campaign',
        description: 'Create and launch your first email marketing campaign',
        category: 'email',
        difficulty: 'Beginner',
        estimatedTime: '30 minutes',
        totalSteps: 10,
        icon: '📧'
    },
    {
        id: 'wordpress-website',
        title: 'WordPress Website Setup',
        description: 'Launch a professional WordPress website from scratch',
        category: 'website',
        difficulty: 'Intermediate',
        estimatedTime: '90 minutes',
        totalSteps: 14,
        icon: '🌐'
    },
    {
        id: 'google-analytics-setup',
        title: 'Google Analytics Setup',
        description: 'Set up Google Analytics 4 to track your website visitors',
        category: 'analytics',
        difficulty: 'Beginner',
        estimatedTime: '25 minutes',
        totalSteps: 8,
        icon: '📊'
    },
    // More Marketing guides
    {
        id: 'google-ads-campaign',
        title: 'Google Ads Campaign',
        description: 'Create your first Google Search Ads campaign',
        category: 'marketing',
        difficulty: 'Beginner',
        estimatedTime: '40 minutes',
        totalSteps: 13,
        icon: '🔍'
    },
    {
        id: 'instagram-ads-guide',
        title: 'Instagram Advertising',
        description: 'Master Instagram ads for your business',
        category: 'marketing',
        difficulty: 'Beginner',
        estimatedTime: '35 minutes',
        totalSteps: 11,
        icon: '📸'
    },
    {
        id: 'linkedin-ads-b2b',
        title: 'LinkedIn B2B Ads',
        description: 'Reach decision-makers with LinkedIn advertising',
        category: 'marketing',
        difficulty: 'Intermediate',
        estimatedTime: '50 minutes',
        totalSteps: 16,
        icon: '💼'
    },
    {
        id: 'tiktok-ads-mastery',
        title: 'TikTok Ads Mastery',
        description: 'Grow your brand with TikTok advertising',
        category: 'marketing',
        difficulty: 'Beginner',
        estimatedTime: '35 minutes',
        totalSteps: 12,
        icon: '🎵'
    },
    // More E-commerce guides
    {
        id: 'woocommerce-setup',
        title: 'WooCommerce Store',
        description: 'Add e-commerce to your WordPress site',
        category: 'ecommerce',
        difficulty: 'Intermediate',
        estimatedTime: '75 minutes',
        totalSteps: 18,
        icon: '🛍️'
    },
    {
        id: 'amazon-seller-central',
        title: 'Amazon Seller Setup',
        description: 'Start selling on Amazon marketplace',
        category: 'ecommerce',
        difficulty: 'Intermediate',
        estimatedTime: '90 minutes',
        totalSteps: 20,
        icon: '📦'
    },
    {
        id: 'etsy-shop-launch',
        title: 'Launch Etsy Shop',
        description: 'Set up and optimize your Etsy store',
        category: 'ecommerce',
        difficulty: 'Beginner',
        estimatedTime: '45 minutes',
        totalSteps: 14,
        icon: '🎨'
    },
    {
        id: 'shopify-apps-essentials',
        title: 'Essential Shopify Apps',
        description: 'Install must-have apps for your Shopify store',
        category: 'ecommerce',
        difficulty: 'Beginner',
        estimatedTime: '30 minutes',
        totalSteps: 9,
        icon: '🔌'
    },
    // More Email guides
    {
        id: 'convertkit-setup',
        title: 'ConvertKit Email Setup',
        description: 'Build your email list with ConvertKit',
        category: 'email',
        difficulty: 'Beginner',
        estimatedTime: '35 minutes',
        totalSteps: 11,
        icon: '📬'
    },
    {
        id: 'email-automation',
        title: 'Email Automation',
        description: 'Create automated email sequences that convert',
        category: 'email',
        difficulty: 'Intermediate',
        estimatedTime: '60 minutes',
        totalSteps: 15,
        icon: '🤖'
    },
    {
        id: 'newsletter-design',
        title: 'Newsletter Design',
        description: 'Design beautiful newsletters that get opened',
        category: 'email',
        difficulty: 'Beginner',
        estimatedTime: '40 minutes',
        totalSteps: 12,
        icon: '✉️'
    },
    // More Website guides
    {
        id: 'squarespace-site',
        title: 'Squarespace Website',
        description: 'Build a stunning Squarespace site',
        category: 'website',
        difficulty: 'Beginner',
        estimatedTime: '70 minutes',
        totalSteps: 16,
        icon: '⬛'
    },
    {
        id: 'webflow-design',
        title: 'Webflow Design',
        description: 'Create custom websites with Webflow',
        category: 'website',
        difficulty: 'Advanced',
        estimatedTime: '120 minutes',
        totalSteps: 25,
        icon: '🌊'
    },
    {
        id: 'wordpress-seo',
        title: 'WordPress SEO',
        description: 'Optimize your WordPress site for search engines',
        category: 'website',
        difficulty: 'Intermediate',
        estimatedTime: '55 minutes',
        totalSteps: 14,
        icon: '🔎'
    },
    {
        id: 'landing-page-optimization',
        title: 'Landing Page Optimization',
        description: 'Increase conversions with better landing pages',
        category: 'website',
        difficulty: 'Intermediate',
        estimatedTime: '45 minutes',
        totalSteps: 13,
        icon: '🎯'
    },
    // More Analytics guides
    {
        id: 'facebook-pixel-setup',
        title: 'Facebook Pixel Setup',
        description: 'Track conversions with Facebook Pixel',
        category: 'analytics',
        difficulty: 'Beginner',
        estimatedTime: '20 minutes',
        totalSteps: 7,
        icon: '📍'
    },
    {
        id: 'google-tag-manager',
        title: 'Google Tag Manager',
        description: 'Manage all your tracking tags in one place',
        category: 'analytics',
        difficulty: 'Intermediate',
        estimatedTime: '50 minutes',
        totalSteps: 14,
        icon: '🏷️'
    },
    {
        id: 'conversion-tracking',
        title: 'Conversion Tracking',
        description: 'Set up accurate conversion tracking',
        category: 'analytics',
        difficulty: 'Intermediate',
        estimatedTime: '40 minutes',
        totalSteps: 12,
        icon: '📈'
    },
    {
        id: 'heatmap-analysis',
        title: 'Heatmap Analysis',
        description: 'Understand user behavior with heatmaps',
        category: 'analytics',
        difficulty: 'Beginner',
        estimatedTime: '30 minutes',
        totalSteps: 9,
        icon: '🔥'
    }
];

let currentGuideId = null;
let isWidgetVisible = false;
let currentView = 'home'; // 'home', 'category', 'guide'
let selectedCategory = null;
let recentlyUsed = [];

// Initialize popup
document.addEventListener('DOMContentLoaded', async function() {
    await loadState();
    
    // If a guide is active, check if we should focus its tab
    if (currentGuideId && isWidgetVisible) {
        const result = await chrome.storage.local.get(['activeTabId']);
        if (result.activeTabId) {
            // Check if that tab still exists
            try {
                await chrome.tabs.get(result.activeTabId);
                // Tab exists, we can offer to switch to it
            } catch (e) {
                // Tab was closed, clear the stored tab ID
                await chrome.storage.local.remove('activeTabId');
            }
        }
    }
    
    renderGuides();
    setupEventListeners();
    updateStatus();
});

// Load saved state
async function loadState() {
    const result = await chrome.storage.local.get(['currentGuide', 'widgetVisible', 'recentlyUsed']);
    currentGuideId = result.currentGuide || null;
    isWidgetVisible = result.widgetVisible || false;
    recentlyUsed = result.recentlyUsed || [];
}

// Render based on current view
function renderGuides() {
    const guideList = document.getElementById('guideList');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Update search placeholder based on view
    const searchInput = document.getElementById('searchInput');
    if (currentView === 'category') {
        searchInput.placeholder = `🔍 Search ${categories[selectedCategory].name}...`;
    } else {
        searchInput.placeholder = '🔍 Search guides...';
    }
    
    if (searchTerm) {
        // Search mode
        renderSearchResults(searchTerm);
    } else if (currentView === 'home') {
        renderHomeView();
    } else if (currentView === 'category') {
        renderCategoryView();
    }
}

// Render home view with categories
function renderHomeView() {
    const guideList = document.getElementById('guideList');
    document.getElementById('noResults').style.display = 'none';
    
    let html = '';
    
    // Recently used section
    if (recentlyUsed.length > 0) {
        html += '<div style="margin-bottom: 16px;"><div style="font-size: 13px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">📊 Recently Used</div>';
        recentlyUsed.slice(0, 3).forEach(guideId => {
            const guide = guides.find(g => g.id === guideId);
            if (guide) {
                html += createCompactGuideCard(guide);
            }
        });
        html += '</div>';
    }
    
    // Categories
    html += '<div style="font-size: 13px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">Browse by Category</div>';
    
    Object.entries(categories).forEach(([catId, cat]) => {
        const count = guides.filter(g => g.category === catId).length;
        html += `
            <div class="guidefloat-guide-card" data-category-id="${catId}" style="cursor: pointer;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 32px;">${cat.icon}</div>
                        <div>
                            <div style="font-size: 15px; font-weight: 600; color: #1f2937;">${cat.name}</div>
                            <div style="font-size: 12px; color: #6b7280;">${count} guide${count !== 1 ? 's' : ''}</div>
                        </div>
                    </div>
                    <div style="color: #9ca3af;">›</div>
                </div>
            </div>
        `;
    });
    
    guideList.innerHTML = html;
    
    // Add click handlers for categories
    document.querySelectorAll('[data-category-id]').forEach(card => {
        card.addEventListener('click', () => {
            selectedCategory = card.dataset.categoryId;
            currentView = 'category';
            renderGuides();
        });
    });
    
    // Add click handlers for recent guides
    document.querySelectorAll('.compact-guide').forEach(card => {
        card.addEventListener('click', () => {
            selectGuide(card.dataset.guideId);
        });
    });
}

// Render category view
function renderCategoryView() {
    const guideList = document.getElementById('guideList');
    const cat = categories[selectedCategory];
    const categoryGuides = guides.filter(g => g.category === selectedCategory);
    
    let html = `
        <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <button id="backBtn" style="background: none; border: none; color: #3b82f6; font-size: 18px; cursor: pointer; padding: 4px;">←</button>
            <div>
                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${cat.icon} ${cat.name}</div>
                <div style="font-size: 12px; color: #6b7280;">${categoryGuides.length} guides</div>
            </div>
        </div>
    `;
    
    categoryGuides.forEach(guide => {
        html += createFullGuideCard(guide);
    });
    
    guideList.innerHTML = html;
    document.getElementById('noResults').style.display = 'none';
    
    // Back button
    document.getElementById('backBtn').addEventListener('click', () => {
        currentView = 'home';
        selectedCategory = null;
        renderGuides();
    });
    
    // Guide click handlers
    document.querySelectorAll('.guidefloat-guide-card[data-guide-id]').forEach(card => {
        card.addEventListener('click', () => {
            selectGuide(card.dataset.guideId);
        });
    });
}

// Render search results
function renderSearchResults(searchTerm) {
    const guideList = document.getElementById('guideList');
    
    const filteredGuides = guides.filter(guide => 
        guide.title.toLowerCase().includes(searchTerm) ||
        guide.description.toLowerCase().includes(searchTerm) ||
        categories[guide.category].name.toLowerCase().includes(searchTerm)
    );
    
    if (filteredGuides.length === 0) {
        guideList.innerHTML = '';
        document.getElementById('noResults').style.display = 'block';
        return;
    }
    
    document.getElementById('noResults').style.display = 'none';
    
    let html = `<div style="font-size: 13px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">Found ${filteredGuides.length} guide${filteredGuides.length !== 1 ? 's' : ''}</div>`;
    
    filteredGuides.forEach(guide => {
        html += createFullGuideCard(guide);
    });
    
    guideList.innerHTML = html;
    
    // Guide click handlers
    document.querySelectorAll('.guidefloat-guide-card[data-guide-id]').forEach(card => {
        card.addEventListener('click', () => {
            selectGuide(card.dataset.guideId);
        });
    });
}

// Create compact guide card (for recently used)
function createCompactGuideCard(guide) {
    return `
        <div class="guidefloat-guide-card compact-guide ${guide.id === currentGuideId ? 'active' : ''}" data-guide-id="${guide.id}" style="padding: 10px 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 20px;">${guide.icon}</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 14px; font-weight: 600; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${guide.title}</div>
                    <div style="font-size: 11px; color: #6b7280;">${guide.totalSteps} steps • ${guide.estimatedTime}</div>
                </div>
                ${guide.id === currentGuideId ? '<div style="color: #10b981; font-size: 16px;">✓</div>' : ''}
            </div>
        </div>
    `;
}

// Create full guide card
function createFullGuideCard(guide) {
    const cat = categories[guide.category];
    return `
        <div class="guidefloat-guide-card ${guide.id === currentGuideId ? 'active' : ''}" data-guide-id="${guide.id}">
            <div class="guidefloat-guide-icon">${guide.icon}</div>
            <div class="guidefloat-guide-title">${guide.title}</div>
            <div style="font-size: 12px; color: #6b7280; margin: 4px 0;">${guide.description}</div>
            <div class="guidefloat-guide-meta">
                <span>${cat.icon} ${cat.name}</span>
                <span>📋 ${guide.totalSteps} steps</span>
                <span>⏱️ ${guide.estimatedTime}</span>
            </div>
            ${guide.id === currentGuideId ? '<div style="margin-top: 8px; color: #10b981; font-size: 13px; font-weight: 600;">✓ Active Guide</div>' : ''}
        </div>
    `;
}

// Select a guide
async function selectGuide(guideId) {
    // If clicking the same guide that's already active, just switch to its tab
    if (currentGuideId === guideId) {
        const result = await chrome.storage.local.get(['activeTabId']);
        if (result.activeTabId) {
            try {
                await chrome.tabs.update(result.activeTabId, { active: true });
                window.close(); // Close popup
                return;
            } catch (e) {
                // Tab was closed, continue to show guide on current tab
                console.log('Active tab was closed, showing on current tab');
            }
        }
    }
    
    // Close any existing guide first (only one at a time)
    if (currentGuideId && currentGuideId !== guideId) {
        await closeAllGuides();
    }
    
    currentGuideId = guideId;
    
    // Track in recently used
    if (!recentlyUsed.includes(guideId)) {
        recentlyUsed.unshift(guideId);
    } else {
        // Move to front
        recentlyUsed = [guideId, ...recentlyUsed.filter(id => id !== guideId)];
    }
    recentlyUsed = recentlyUsed.slice(0, 10); // Keep last 10
    
    await chrome.storage.local.set({ 
        currentGuide: guideId,
        recentlyUsed: recentlyUsed
    });
    
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    console.log(`[GuideFloat] Loading guide "${guideId}" on tab ${tab.id}`);
    console.log(`[GuideFloat] Tab URL: ${tab.url}`);
    
    // Check if we can inject on this URL
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
        console.log('[GuideFloat] Cannot inject on restricted page, navigating to guide target...');
        
        // Get the guide's target URL
        const guide = guides.find(g => g.id === guideId);
        let targetUrl = 'https://kunle123.github.io/guidefloat/'; // Default fallback
        
        if (guide) {
            // Try to get the first step's autoNavigate URL or action button URL
            try {
                const guideUrl = chrome.runtime.getURL(`guides/${guideId}.json`);
                const response = await fetch(guideUrl);
                const guideData = await response.json();
                
                const firstStep = guideData.steps[0];
                if (firstStep.autoNavigate && firstStep.autoNavigate.url) {
                    targetUrl = firstStep.autoNavigate.url;
                } else if (firstStep.actionButtons && firstStep.actionButtons.length > 0) {
                    targetUrl = firstStep.actionButtons[0].url;
                }
            } catch (e) {
                console.log('[GuideFloat] Could not load guide data, using default URL');
            }
        }
        
        showStatus(`Opening ${guide?.title || 'guide'}...`, 'info');
        
        // Store that we want to load this guide after navigation
        await chrome.storage.local.set({ 
            currentGuide: guideId,
            pendingGuideLoad: true,
            activeTabId: tab.id
        });
        
        // Auto-navigate to the guide's target URL
        await chrome.tabs.update(tab.id, { 
            url: targetUrl
        });
        
        // Close popup - background script will handle loading the guide
        window.close();
        
        return;
    }
    
    // Show loading feedback
    showStatus('Loading guide...', 'info');
    
    // Inject CSS and script into this specific tab (CSS first!)
    try {
        console.log('[GuideFloat] Starting injection process...');
        console.log('[GuideFloat] Tab ID:', tab.id);
        console.log('[GuideFloat] Tab URL:', tab.url);
        
        console.log('[GuideFloat] Injecting CSS...');
        // Inject CSS first with USER origin for highest priority
        await chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['css/widget.css'],
            origin: 'USER'
        });
        console.log('[GuideFloat] ✓ CSS injected');
        
        console.log('[GuideFloat] Injecting JavaScript...');
        
        // Inject all scripts in sequence with proper timing
        const scripts = [
            'js/page-detector.js',
            'js/spotlight.js', 
            'js/field-detector.js',
            'js/floating-panel.js',
            'js/hubspot-detector.js',
            'js/content.js'
        ];
        
        for (const script of scripts) {
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: [script]
                });
                console.log(`[GuideFloat] ✓ ${script} injected`);
                
                // Small delay between injections to ensure proper loading
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`[GuideFloat] ❌ Failed to inject ${script}:`, error);
                throw error;
            }
        }
        
        // Add a small delay to let scripts initialize
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('[GuideFloat] Scripts should be ready now');
        
    } catch (e) {
        console.error('[GuideFloat] ❌ Injection failed:', e);
        showStatus('❌ Failed to inject script. See console for details.', 'error');
        console.error('[GuideFloat] Injection error details:', {
            message: e.message,
            stack: e.stack,
            tabId: tab.id,
            tabUrl: tab.url,
            errorName: e.name
        });
        
        // Try to get more info about the tab
        try {
            const tabInfo = await chrome.tabs.get(tab.id);
            console.log('[GuideFloat] Tab info:', tabInfo);
        } catch (tabError) {
            console.error('[GuideFloat] Could not get tab info:', tabError);
        }
        
        return; // Stop here if injection failed
    }
    
    // Wait for script to be ready with ping checks
    console.log('[GuideFloat] Waiting for content script to be ready...');
    let scriptReady = false;
    let maxPingAttempts = 10; // Increased attempts
    
    for (let i = 0; i < maxPingAttempts; i++) {
        const delay = 300 * (i + 1); // Increased delay
        console.log(`[GuideFloat] Ping attempt ${i + 1}/${maxPingAttempts} (waiting ${delay}ms)...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        try {
            console.log(`[GuideFloat] Sending ping to tab ${tab.id}...`);
            const response = await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
            console.log(`[GuideFloat] Ping response:`, response);
            
            if (response && response.status === 'ready') {
                console.log('[GuideFloat] ✓ Content script is ready!');
                console.log('[GuideFloat] GuideFloat ready:', response.guideFloatReady);
                console.log('[GuideFloat] Spotlight ready:', response.spotlightReady);
                console.log('[GuideFloat] FieldDetector ready:', response.fieldDetectorReady);
                
                // Check if all required objects are ready AND fully initialized
                if (response.guideFloatReady && response.spotlightReady && response.fieldDetectorReady && response.fullyInitialized) {
                    scriptReady = true;
                    console.log('[GuideFloat] ✓ All objects are ready and fully initialized!');
                    break;
                } else {
                    console.log('[GuideFloat] ⚠️ Some objects not ready yet, continuing to wait...');
                    console.log('[GuideFloat] GuideFloat ready:', response.guideFloatReady);
                    console.log('[GuideFloat] Spotlight ready:', response.spotlightReady);
                    console.log('[GuideFloat] FieldDetector ready:', response.fieldDetectorReady);
                    console.log('[GuideFloat] Fully initialized:', response.fullyInitialized);
                }
            } else {
                console.log(`[GuideFloat] Unexpected ping response:`, response);
            }
        } catch (e) {
            console.log(`[GuideFloat] Ping attempt ${i + 1} failed:`, e.message);
            console.log(`[GuideFloat] Error details:`, e);
            
            // Check if tab still exists
            try {
                const tabInfo = await chrome.tabs.get(tab.id);
                console.log(`[GuideFloat] Tab still exists:`, tabInfo.url);
            } catch (tabError) {
                console.error(`[GuideFloat] Tab no longer exists:`, tabError);
                break;
            }
        }
    }
    
    if (!scriptReady) {
        console.warn('[GuideFloat] ⚠️ Script did not respond to ping after all attempts');
        console.warn('[GuideFloat] This might be due to:');
        console.warn('[GuideFloat] - Content script not loading properly');
        console.warn('[GuideFloat] - Page security restrictions');
        console.warn('[GuideFloat] - Extension permissions issues');
        
        // Try one more injection attempt
        console.log('[GuideFloat] Attempting one more injection...');
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/content.js']
            });
            console.log('[GuideFloat] ✓ Retry injection successful');
            
            // Wait a bit more and try ping again
            await new Promise(resolve => setTimeout(resolve, 1000));
            try {
                const response = await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
                if (response && response.status === 'ready') {
                    scriptReady = true;
                    console.log('[GuideFloat] ✓ Content script ready after retry!');
                }
            } catch (retryError) {
                console.log('[GuideFloat] Retry ping failed:', retryError);
            }
        } catch (retryInjectionError) {
            console.error('[GuideFloat] Retry injection failed:', retryInjectionError);
        }
        
        if (!scriptReady) {
            showStatus('⚠️ Script not responding. Check console for details.', 'error');
        }
    }
    
    // Now show the guide
    try {
        console.log(`[GuideFloat] Sending showGuide message for "${guideId}"...`);
        await chrome.tabs.sendMessage(tab.id, {
            action: 'showGuide',
            guideId: guideId
        });
        console.log('[GuideFloat] ✓ Guide loaded successfully!');
        showStatus('✓ Guide loaded!', 'success');
        
        // Auto-close popup after successful guide load
        setTimeout(() => {
            window.close();
        }, 500); // Small delay so user sees success message
        
    } catch (e) {
        console.error('[GuideFloat] ❌ Failed to show guide:', e);
        showStatus('❌ Failed to load. Check console (F12) for details.', 'error');
        // Log detailed error for debugging
        console.error('[GuideFloat] Error details:', {
            error: e.message,
            stack: e.stack,
            tabId: tab.id,
            guideId: guideId
        });
    }
    
    isWidgetVisible = true;
    await chrome.storage.local.set({ widgetVisible: true, activeTabId: tab.id });
    
    renderGuides();
    updateStatus();
}

// Close all guides across all tabs
async function closeAllGuides() {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
        try {
            await chrome.tabs.sendMessage(tab.id, { action: 'hideGuide' });
        } catch (e) {
            // Tab doesn't have guide, continue
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', renderGuides);
    
    // Toggle button (now acts as Close button)
    document.getElementById('toggleBtn').addEventListener('click', async () => {
        if (!currentGuideId) {
            showStatus('Please select a guide first', 'error');
            return;
        }
        
        // Show confirmation
        const guide = guides.find(g => g.id === currentGuideId);
        if (!confirm(`Close "${guide?.title || 'this guide'}"?\n\nThis will:\n✗ Close the guide overlay\n✗ Keep your progress saved\n\nYou can restart anytime by selecting the guide again.`)) {
            return;
        }
        
        // Close the guide completely
        await closeAllGuides();
        
        // Clear state
        currentGuideId = null;
        isWidgetVisible = false;
        await chrome.storage.local.set({ 
            currentGuide: null, 
            widgetVisible: false,
            activeTabId: null
        });
        
        renderGuides();
        updateStatus();
        showStatus('✓ Guide closed. Your progress is saved!', 'success');
    });
}

// Update status display
async function updateStatus() {
    const statusEl = document.getElementById('status');
    const toggleBtn = document.getElementById('toggleBtn');
    
    if (currentGuideId) {
        const guide = guides.find(g => g.id === currentGuideId);
        const result = await chrome.storage.local.get(['activeTabId']);
        
        statusEl.style.display = 'block';
        statusEl.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <div>✓ ${guide.title}</div>
                    <small style="opacity: 0.8;">Click guide to switch to it</small>
                </div>
            </div>
        `;
        
        toggleBtn.style.display = 'block';
        toggleBtn.textContent = 'Close Guide';
        toggleBtn.classList.add('hide');
    } else {
        statusEl.style.display = 'none';
        toggleBtn.style.display = 'none';
    }
}

// Show temporary status message
function showStatus(message, type = 'success') {
    const statusEl = document.getElementById('status');
    statusEl.style.display = 'block';
    statusEl.textContent = message;
    statusEl.style.background = type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)';
    
    setTimeout(() => {
        updateStatus();
    }, 3000);
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'widgetClosed') {
        isWidgetVisible = false;
        chrome.storage.local.set({ widgetVisible: false });
        updateStatus();
    }
});

