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

// Keep service worker alive
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle messages if needed
    return true;
});

