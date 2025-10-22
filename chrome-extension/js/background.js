// GuideFloat Chrome Extension - Background Service Worker

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // First time install
        chrome.tabs.create({
            url: 'https://kunle123.github.io/guidefloat/'
        });
    }
});

// Listen for navigation events to restore guide on page load
chrome.webNavigation.onCompleted.addListener(async (details) => {
    console.log('[GuideFloat Background] Navigation detected:', details);
    
    // Only handle main frame navigation (not iframes)
    if (details.frameId !== 0) {
        console.log('[GuideFloat Background] Ignoring iframe navigation');
        return;
    }
    
    const tabId = details.tabId;
    console.log('[GuideFloat Background] Checking if guide needs restoration on tab:', tabId);
    
    // Check if this tab has an active guide or a pending guide load
    const result = await chrome.storage.local.get(['currentGuide', 'activeTabId', 'widgetVisible', 'pendingGuideLoad']);
    console.log('[GuideFloat Background] Storage state:', result);
    
    // Check if we have a pending guide load (from restricted page redirect)
    const isPendingLoad = result.pendingGuideLoad && result.activeTabId === tabId;
    
    if (!result.currentGuide || (!result.widgetVisible && !isPendingLoad)) {
        console.log('[GuideFloat Background] No active guide to restore');
        return; // No active guide
    }
    
    // Check if this is the tab with the active guide
    if (result.activeTabId !== tabId) {
        console.log(`[GuideFloat Background] Guide is on tab ${result.activeTabId}, not ${tabId}`);
        return; // Guide is on a different tab
    }
    
    // Clear the pending flag if it was set
    if (isPendingLoad) {
        console.log('[GuideFloat Background] Processing pending guide load from restricted page redirect');
        await chrome.storage.local.set({ 
            pendingGuideLoad: false,
            widgetVisible: true 
        });
    }
    
    console.log(`[GuideFloat Background] ✓ Will restore guide on tab ${tabId}`);
    
    // Get tab info to check URL
    const tab = await chrome.tabs.get(tabId);
    const url = tab.url || '';
    
    // Don't inject on restricted URLs
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || 
        url.startsWith('edge://') || url.startsWith('about:') || url.startsWith('file://')) {
        console.log(`[GuideFloat Background] Cannot inject on restricted URL: ${url}`);
        return;
    }
    
    console.log(`[GuideFloat Background] Restoring on URL: ${url}`);
    
    // Re-inject the content script
    try {
        // Inject CSS first
        await chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ['css/widget.css'],
            origin: 'USER'
        });
        
        // Then inject JavaScript
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['js/content.js']
        });
        
        // Wait for script to load with ping checks
        let scriptReady = false;
        for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            try {
                const response = await chrome.tabs.sendMessage(tabId, { action: 'ping' });
                if (response && response.status === 'ready') {
                    scriptReady = true;
                    break;
                }
            } catch (e) {
                console.log(`Ping attempt ${i + 1} failed`);
            }
        }
        
        if (scriptReady) {
            // Restore the guide
            await chrome.tabs.sendMessage(tabId, {
                action: 'showGuide',
                guideId: result.currentGuide
            });
            console.log('Guide restored successfully!');
        } else {
            console.warn('Failed to restore guide - script not ready');
        }
    } catch (err) {
        console.error('Failed to restore guide after navigation:', err);
    }
});

// Keep service worker alive
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle messages if needed
    return true;
});

