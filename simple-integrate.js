#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 GuideFloat Design Integration Starting...\n');

// Create output directory
const OUTPUT_DIR = './chrome-extension/design-system';
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('✅ Created design-system directory');
}

// 1. Extract and process CSS
function extractCSS() {
    console.log('📦 Extracting CSS styles...');
    
    const cssFile = path.join('./design-repo/dist/assets/index-CrS8N3h2.css');
    const outputCSS = path.join(OUTPUT_DIR, 'design-system.css');
    
    if (fs.existsSync(cssFile)) {
        let css = fs.readFileSync(cssFile, 'utf8');
        
        // Add Chrome extension specific overrides
        const extensionOverrides = `
/* GuideFloat Chrome Extension Overrides */
.guidefloat-extension {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --guide-primary: 18 100% 56%; /* HubSpot Orange */
    --guide-secondary: 207 92% 54%; /* HubSpot Blue */
    --guide-accent: 18 100% 64%; /* Lighter orange */
}

/* Extension Popup Styles */
.guidefloat-popup {
    width: 400px;
    height: 600px;
    background: hsl(var(--background));
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Floating Widget Styles */
.guidefloat-widget {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 360px;
    max-height: calc(100vh - 40px);
    background: hsl(var(--background));
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    z-index: 2147483647;
    border: 1px solid hsl(var(--border));
}

/* Progress Bar */
.guidefloat-progress {
    width: 100%;
    height: 6px;
    background: hsl(var(--muted));
    border-radius: 3px;
    overflow: hidden;
}

.guidefloat-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, hsl(var(--guide-primary)) 0%, hsl(var(--guide-accent)) 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
}

/* Button Styles */
.guidefloat-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
    padding: 12px 16px;
}

.guidefloat-button-primary {
    background: linear-gradient(135deg, hsl(var(--guide-primary)) 0%, hsl(var(--guide-accent)) 100%);
    color: white;
}

.guidefloat-button-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.guidefloat-button-secondary {
    background: hsl(var(--muted));
    color: hsl(var(--foreground));
    border: 1px solid hsl(var(--border));
}

.guidefloat-button-secondary:hover {
    background: hsl(var(--muted) / 0.8);
}

/* Card Styles */
.guidefloat-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Badge Styles */
.guidefloat-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 500;
}

.guidefloat-badge-success {
    background: hsl(142 76% 36% / 0.1);
    color: hsl(142 76% 36%);
}

.guidefloat-badge-warning {
    background: hsl(38 92% 50% / 0.1);
    color: hsl(38 92% 50%);
}

.guidefloat-badge-info {
    background: hsl(var(--guide-primary) / 0.1);
    color: hsl(var(--guide-primary));
}

/* Responsive Design */
@media (max-width: 768px) {
    .guidefloat-widget {
        width: calc(100vw - 40px);
        right: 20px;
        left: 20px;
    }
    
    .guidefloat-popup {
        width: calc(100vw - 20px);
        height: calc(100vh - 20px);
    }
}
`;
        
        css += extensionOverrides;
        fs.writeFileSync(outputCSS, css);
        console.log('✅ CSS extracted and processed');
    } else {
        console.log('❌ CSS file not found');
    }
}

// 2. Extract design tokens
function extractDesignTokens() {
    console.log('🎨 Extracting design tokens...');
    
    const tokens = {
        colors: {
            primary: "18 100% 56%", // HubSpot Orange
            secondary: "207 92% 54%", // HubSpot Blue
            accent: "18 100% 64%", // Lighter orange
            success: "142 76% 36%", // Green
            warning: "38 92% 50%", // Yellow
            error: "0 84% 60%", // Red
            background: "0 0% 100%", // White
            foreground: "222.2 84% 4.9%", // Dark gray
            muted: "210 40% 98%", // Light gray
            border: "214.3 31.8% 91.4%" // Border gray
        },
        typography: {
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSizes: {
                xs: "12px",
                sm: "14px",
                base: "16px",
                lg: "18px",
                xl: "20px",
                "2xl": "24px"
            },
            fontWeights: {
                normal: "400",
                medium: "500",
                semibold: "600",
                bold: "700"
            }
        },
        spacing: {
            xs: "4px",
            sm: "8px",
            md: "16px",
            lg: "24px",
            xl: "32px",
            "2xl": "48px"
        },
        borderRadius: {
            sm: "4px",
            md: "8px",
            lg: "12px",
            xl: "16px"
        },
        shadows: {
            sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
            md: "0 4px 6px rgba(0, 0, 0, 0.1)",
            lg: "0 8px 32px rgba(0, 0, 0, 0.12)",
            xl: "0 20px 40px rgba(0, 0, 0, 0.15)"
        }
    };
    
    const tokensFile = path.join(OUTPUT_DIR, 'design-tokens.json');
    fs.writeFileSync(tokensFile, JSON.stringify(tokens, null, 2));
    console.log('✅ Design tokens extracted');
}

// 3. Create integration guide
function createIntegrationGuide() {
    console.log('📚 Creating integration guide...');
    
    const guide = `# GuideFloat Design Integration Guide

## Overview
This guide explains how to integrate the new React/TypeScript design system with the existing Chrome extension.

## Files Created
- \`design-system.css\` - Complete CSS with Tailwind and custom styles
- \`design-tokens.json\` - Design tokens for colors, typography, spacing

## Integration Steps

### 1. Update Extension Popup
Replace the existing popup HTML with the new design:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="design-system/design-system.css">
</head>
<body class="guidefloat-extension">
    <div class="guidefloat-popup">
        <div id="popup-header"></div>
        <div id="popup-content">
            <!-- Content will be populated by JavaScript -->
        </div>
    </div>
    <script src="js/popup.js"></script>
</body>
</html>
\`\`\`

### 2. Update Content Script
Use the new design system classes in your floating widget:

\`\`\`javascript
// In content.js - update your existing floating panel
const panel = document.createElement('div');
panel.className = 'guidefloat-widget';
panel.innerHTML = \`
    <div class="guidefloat-widget-header">
        <div class="guidefloat-widget-branding">
            <div class="guidefloat-widget-logo">🚀</div>
            <div class="guidefloat-widget-title">\${guideData.title}</div>
        </div>
        <div class="guidefloat-widget-controls">
            <button class="guidefloat-button guidefloat-button-secondary" id="minimize-btn">−</button>
            <button class="guidefloat-button guidefloat-button-secondary" id="close-btn">×</button>
        </div>
    </div>
    
    <div class="guidefloat-widget-progress">
        <div class="guidefloat-progress">
            <div class="guidefloat-progress-fill" style="width: \${progress}%"></div>
        </div>
        <div class="guidefloat-widget-progress-text">
            \${currentStep} of \${totalSteps} steps complete
        </div>
    </div>
    
    <div class="guidefloat-widget-content">
        <div class="guidefloat-widget-step-header">
            <div class="guidefloat-widget-step-title">\${currentStepData.title}</div>
            <div class="guidefloat-widget-step-description">\${currentStepData.description}</div>
        </div>
        
        <div class="guidefloat-widget-step-content">
            \${currentStepData.content}
        </div>
        
        <div class="guidefloat-widget-step-actions">
            <button class="guidefloat-button guidefloat-button-primary">Continue</button>
            <button class="guidefloat-button guidefloat-button-secondary">Skip</button>
        </div>
    </div>
\`;
\`\`\`

### 3. Update CSS Integration
Add the design system CSS to your manifest:

\`\`\`json
{
  "web_accessible_resources": [
    {
      "resources": [
        "design-system/design-system.css",
        "design-system/design-tokens.json"
      ],
      "matches": ["<all_urls>"]
    }
  ]
}
\`\`\`

### 4. Design Token Usage
Use the design tokens for consistent styling:

\`\`\`javascript
// Load design tokens
const tokens = await fetch(chrome.runtime.getURL('design-system/design-tokens.json'))
    .then(response => response.json());

// Apply tokens dynamically
document.documentElement.style.setProperty('--guide-primary', tokens.colors.primary);
\`\`\`

## Customization
- Modify \`design-tokens.json\` to change colors, fonts, spacing
- Update \`design-system.css\` for custom styles
- Use the provided CSS classes for consistent styling

## Next Steps
1. Test the integration in development
2. Update existing components to use new design system
3. Add new components as needed
4. Deploy updated extension
`;
    
    fs.writeFileSync(path.join(OUTPUT_DIR, 'INTEGRATION_GUIDE.md'), guide);
    console.log('✅ Integration guide created');
}

// 4. Copy assets
function copyAssets() {
    console.log('📁 Copying assets...');
    
    const assetsDir = path.join(OUTPUT_DIR, 'assets');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    // Copy favicon and other assets
    const sourceAssets = path.join('./design-repo/dist');
    const files = ['favicon.ico', 'placeholder.svg'];
    
    files.forEach(file => {
        const source = path.join(sourceAssets, file);
        const dest = path.join(assetsDir, file);
        
        if (fs.existsSync(source)) {
            fs.copyFileSync(source, dest);
            console.log(`✅ Copied ${file}`);
        }
    });
    
    console.log('✅ Assets copied');
}

// Run integration
async function runIntegration() {
    try {
        extractCSS();
        extractDesignTokens();
        createIntegrationGuide();
        copyAssets();
        
        console.log('\n🎉 Design integration complete!');
        console.log('\nNext steps:');
        console.log('1. Review the integration guide: chrome-extension/design-system/INTEGRATION_GUIDE.md');
        console.log('2. Update your popup.html to use the new design system');
        console.log('3. Update content.js to use the new CSS classes');
        console.log('4. Test the integration in development');
        console.log('5. Deploy the updated extension');
        
    } catch (error) {
        console.error('❌ Integration failed:', error);
        process.exit(1);
    }
}

// Run the integration
runIntegration();
