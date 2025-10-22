// GuideFloat Chrome Extension - Popup Script

const guides = [
    {
        id: 'facebook-ads-setup',
        title: 'Facebook Ads Setup Guide',
        description: 'Complete step-by-step guide to setting up Facebook Ads from scratch',
        category: 'Marketing',
        difficulty: 'Beginner',
        estimatedTime: '45 minutes',
        totalSteps: 15,
        icon: '📱'
    },
    {
        id: 'shopify-store-setup',
        title: 'Shopify Store Setup',
        description: 'Build a professional e-commerce store with Shopify',
        category: 'E-commerce',
        difficulty: 'Beginner',
        estimatedTime: '60 minutes',
        totalSteps: 12,
        icon: '🛒'
    },
    {
        id: 'mailchimp-campaign',
        title: 'Mailchimp Email Campaign',
        description: 'Create and launch your first email marketing campaign',
        category: 'Email',
        difficulty: 'Beginner',
        estimatedTime: '30 minutes',
        totalSteps: 10,
        icon: '📧'
    },
    {
        id: 'wordpress-website',
        title: 'WordPress Website Setup',
        description: 'Launch a professional WordPress website from scratch',
        category: 'Website',
        difficulty: 'Intermediate',
        estimatedTime: '90 minutes',
        totalSteps: 14,
        icon: '🌐'
    },
    {
        id: 'google-analytics-setup',
        title: 'Google Analytics Setup',
        description: 'Set up Google Analytics 4 to track your website visitors',
        category: 'Analytics',
        difficulty: 'Beginner',
        estimatedTime: '25 minutes',
        totalSteps: 8,
        icon: '📊'
    }
];

let currentGuideId = null;
let isWidgetVisible = false;

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
    const result = await chrome.storage.local.get(['currentGuide', 'widgetVisible']);
    currentGuideId = result.currentGuide || null;
    isWidgetVisible = result.widgetVisible || false;
}

// Render guide list
function renderGuides() {
    const guideList = document.getElementById('guideList');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredGuides = guides.filter(guide => 
        guide.title.toLowerCase().includes(searchTerm) ||
        guide.description.toLowerCase().includes(searchTerm) ||
        guide.category.toLowerCase().includes(searchTerm)
    );
    
    if (filteredGuides.length === 0) {
        guideList.innerHTML = '';
        document.getElementById('noResults').style.display = 'block';
        return;
    }
    
    document.getElementById('noResults').style.display = 'none';
    
    guideList.innerHTML = filteredGuides.map(guide => `
        <div class="guide-card ${guide.id === currentGuideId ? 'active' : ''}" data-guide-id="${guide.id}">
            <div class="guide-icon">${guide.icon}</div>
            <div class="guide-title">${guide.title}</div>
            <div class="guide-meta">
                <span>📋 ${guide.totalSteps} steps</span>
                <span>⏱️ ${guide.estimatedTime}</span>
            </div>
            ${guide.id === currentGuideId ? '<div style="margin-top: 8px; color: #10b981; font-size: 13px; font-weight: 600;">✓ Active Guide</div>' : ''}
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.guide-card').forEach(card => {
        card.addEventListener('click', () => {
            selectGuide(card.dataset.guideId);
        });
    });
}

// Select a guide
async function selectGuide(guideId) {
    // Close any existing guide first (only one at a time)
    if (currentGuideId && currentGuideId !== guideId) {
        await closeAllGuides();
    }
    
    currentGuideId = guideId;
    await chrome.storage.local.set({ currentGuide: guideId });
    
    // Show widget on current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.tabs.sendMessage(tab.id, {
        action: 'showGuide',
        guideId: guideId
    }).catch(() => {
        // Tab doesn't have content script loaded yet, it's okay
    });
    
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
        showStatus('Guide closed', 'success');
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
                    <small style="opacity: 0.8;">Active guide</small>
                </div>
                <button id="goToGuideBtn" style="padding: 6px 12px; background: #10b981; border: none; color: white; border-radius: 6px; cursor: pointer; font-size: 12px;">
                    Go to Guide →
                </button>
            </div>
        `;
        
        // Add event listener for "Go to Guide" button
        setTimeout(() => {
            const goBtn = document.getElementById('goToGuideBtn');
            if (goBtn) {
                goBtn.addEventListener('click', async () => {
                    if (result.activeTabId) {
                        try {
                            await chrome.tabs.update(result.activeTabId, { active: true });
                            window.close(); // Close popup
                        } catch (e) {
                            alert('The tab with the guide was closed. The guide will appear on your current tab.');
                            // Show on current tab instead
                            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                            await chrome.tabs.sendMessage(tab.id, {
                                action: 'showGuide',
                                guideId: currentGuideId
                            });
                            await chrome.storage.local.set({ activeTabId: tab.id });
                        }
                    }
                });
            }
        }, 100);
        
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

