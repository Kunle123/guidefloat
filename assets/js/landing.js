// GuideFloat Landing Page JavaScript
// Handles guide library, search, filtering, and guide activation

// Available guides metadata
const guidesData = [
    {
        id: 'facebook-ads-setup',
        title: 'Facebook Ads Setup Guide',
        description: 'Complete step-by-step guide to setting up Facebook Ads from scratch. Learn how to create campaigns that convert.',
        category: 'marketing',
        difficulty: 'Beginner',
        estimatedTime: '45 minutes',
        totalSteps: 15,
        icon: '📱'
    },
    {
        id: 'shopify-store-setup',
        title: 'Shopify Store Setup',
        description: 'Build a professional e-commerce store with Shopify. From domain to first sale.',
        category: 'ecommerce',
        difficulty: 'Beginner',
        estimatedTime: '60 minutes',
        totalSteps: 12,
        icon: '🛒'
    },
    {
        id: 'mailchimp-campaign',
        title: 'Mailchimp Email Campaign',
        description: 'Create and launch your first email marketing campaign with Mailchimp. Grow your audience effectively.',
        category: 'email',
        difficulty: 'Beginner',
        estimatedTime: '30 minutes',
        totalSteps: 10,
        icon: '📧'
    },
    {
        id: 'wordpress-website',
        title: 'WordPress Website Setup',
        description: 'Launch a professional WordPress website from scratch. Hosting, theme, plugins, and more.',
        category: 'website',
        difficulty: 'Intermediate',
        estimatedTime: '90 minutes',
        totalSteps: 14,
        icon: '🌐'
    },
    {
        id: 'google-analytics-setup',
        title: 'Google Analytics Setup',
        description: 'Set up Google Analytics 4 to track your website visitors and understand your audience.',
        category: 'analytics',
        difficulty: 'Beginner',
        estimatedTime: '25 minutes',
        totalSteps: 8,
        icon: '📊'
    }
];

// State
let currentCategory = 'all';
let currentSearchTerm = '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderGuides();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearchTerm = e.target.value.toLowerCase();
            renderGuides();
        });
    }
    
    // Category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            categoryFilters.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            this.classList.add('active', 'bg-blue-500', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');
            
            // Update category and re-render
            currentCategory = this.dataset.category;
            renderGuides();
        });
    });
}

// Filter guides based on category and search term
function filterGuides() {
    return guidesData.filter(guide => {
        const matchesCategory = currentCategory === 'all' || guide.category === currentCategory;
        const matchesSearch = currentSearchTerm === '' || 
            guide.title.toLowerCase().includes(currentSearchTerm) ||
            guide.description.toLowerCase().includes(currentSearchTerm);
        
        return matchesCategory && matchesSearch;
    });
}

// Render guide cards
function renderGuides() {
    const guideGrid = document.getElementById('guideGrid');
    const noResults = document.getElementById('noResults');
    const filteredGuides = filterGuides();
    
    if (filteredGuides.length === 0) {
        guideGrid.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }
    
    guideGrid.classList.remove('hidden');
    noResults.classList.add('hidden');
    
    guideGrid.innerHTML = filteredGuides.map(guide => createGuideCard(guide)).join('');
    
    // Add event listeners to start buttons
    document.querySelectorAll('.start-guide-btn').forEach(button => {
        button.addEventListener('click', function() {
            const guideId = this.dataset.guideId;
            startGuide(guideId);
        });
    });
}

// Create a guide card HTML
function createGuideCard(guide) {
    const difficultyClass = `difficulty-${guide.difficulty.toLowerCase()}`;
    
    return `
        <div class="guide-card bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-start justify-between mb-4">
                <div class="text-4xl">${guide.icon}</div>
                <span class="difficulty-badge ${difficultyClass}">${guide.difficulty}</span>
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 mb-2">${guide.title}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">${guide.description}</p>
            
            <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div class="flex items-center">
                    <i class="fas fa-list-ol mr-1"></i>
                    <span>${guide.totalSteps} steps</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-clock mr-1"></i>
                    <span>${guide.estimatedTime}</span>
                </div>
            </div>
            
            <button 
                class="start-guide-btn w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center"
                data-guide-id="${guide.id}">
                <span>Start Guide</span>
                <i class="fas fa-arrow-right ml-2"></i>
            </button>
        </div>
    `;
}

// Start a guide
function startGuide(guideId) {
    // Save the guide ID to localStorage
    localStorage.setItem('guidefloat-current-guide', guideId);
    
    // Ask user which mode they prefer (only first time)
    const hasChosenMode = localStorage.getItem('guidefloat-mode-chosen');
    
    if (!hasChosenMode) {
        const usePopup = confirm(
            "🚀 How would you like to use GuideFloat?\n\n" +
            "Click OK for POPUP MODE (Recommended):\n" +
            "• Opens in separate window\n" +
            "• Stays visible while you navigate\n" +
            "• Floats above all tabs\n\n" +
            "Click Cancel for OVERLAY MODE:\n" +
            "• Appears on current page only\n" +
            "• Click bookmarklet again on new pages\n\n" +
            "You can change this anytime in settings."
        );
        
        localStorage.setItem('guidefloat-use-popup', usePopup ? 'true' : 'false');
        localStorage.setItem('guidefloat-mode-chosen', 'true');
    }
    
    const usePopup = localStorage.getItem('guidefloat-use-popup') === 'true';
    
    if (usePopup) {
        // Open in popup window
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        const popupUrl = window.location.origin + basePath + 'popup.html?guide=' + guideId;
        
        const popup = window.open(
            popupUrl,
            'guidefloat-popup',
            'width=450,height=700,left=100,top=100,resizable=yes,scrollbars=yes,alwaysRaised=yes'
        );
        
        if (!popup) {
            alert('❌ Popup was blocked!\n\n1. Look for a popup blocker icon in your address bar\n2. Click it and allow popups for this site\n3. Try again\n\nOr click Mode button to switch to Overlay mode.');
            localStorage.setItem('guidefloat-use-popup', 'false');
        } else {
            popup.focus();
            // Show instructions
            setTimeout(() => {
                alert('✅ Guide opened in separate window!\n\nYou can now:\n• Navigate to Facebook.com (or any site)\n• Keep the guide window visible\n• Arrange windows side-by-side\n\nThe guide stays with you wherever you go!');
            }, 500);
        }
    } else {
        // Load inline widget
        if (window.GuideFloat) {
            GuideFloat.loadGuide(guideId);
        } else {
            loadWidget(guideId);
        }
    }
}

// Load the widget on the current page
function loadWidget(guideId) {
    // Check if widget already exists
    if (document.getElementById('guidefloat-widget')) {
        alert('GuideFloat is already running!');
        return;
    }
    
    // Inject CSS
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'widget.css';
    document.head.appendChild(css);
    
    // Inject JavaScript
    const script = document.createElement('script');
    script.src = 'widget.js';
    script.onload = function() {
        // Initialize widget
        if (window.GuideFloat) {
            GuideFloat.init({ guideId: guideId });
        }
    };
    script.onerror = function() {
        alert('Failed to load GuideFloat. Please try again.');
    };
    document.body.appendChild(script);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Toggle between popup and overlay mode
function toggleMode() {
    const currentMode = localStorage.getItem('guidefloat-use-popup') === 'true';
    const newMode = !currentMode;
    
    const modeNames = newMode ? 'POPUP MODE' : 'OVERLAY MODE';
    const modeDescription = newMode 
        ? '• Guide opens in separate window\n• Stays visible while you navigate\n• Floats above all tabs' 
        : '• Guide appears on current page\n• Click bookmarklet on each new page\n• No popup windows needed';
    
    const confirm = window.confirm(
        `Switch to ${modeNames}?\n\n${modeDescription}\n\nYour preference will be saved.`
    );
    
    if (confirm) {
        localStorage.setItem('guidefloat-use-popup', newMode ? 'true' : 'false');
        alert(`✅ Switched to ${modeNames}!\n\nThis will take effect when you start your next guide.`);
    }
}

// Make toggleMode globally accessible
window.toggleMode = toggleMode;

