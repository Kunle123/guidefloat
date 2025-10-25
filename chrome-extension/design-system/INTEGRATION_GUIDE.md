# GuideFloat Design Integration Guide

## Overview
This guide explains how to integrate the new React/TypeScript design system with the existing Chrome extension.

## Files Created
- `design-system.css` - Complete CSS with Tailwind and custom styles
- `design-tokens.json` - Design tokens for colors, typography, spacing

## Integration Steps

### 1. Update Extension Popup
Replace the existing popup HTML with the new design:

```html
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
```

### 2. Update Content Script
Use the new design system classes in your floating widget:

```javascript
// In content.js - update your existing floating panel
const panel = document.createElement('div');
panel.className = 'guidefloat-widget';
panel.innerHTML = `
    <div class="guidefloat-widget-header">
        <div class="guidefloat-widget-branding">
            <div class="guidefloat-widget-logo">🚀</div>
            <div class="guidefloat-widget-title">${guideData.title}</div>
        </div>
        <div class="guidefloat-widget-controls">
            <button class="guidefloat-button guidefloat-button-secondary" id="minimize-btn">−</button>
            <button class="guidefloat-button guidefloat-button-secondary" id="close-btn">×</button>
        </div>
    </div>
    
    <div class="guidefloat-widget-progress">
        <div class="guidefloat-progress">
            <div class="guidefloat-progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="guidefloat-widget-progress-text">
            ${currentStep} of ${totalSteps} steps complete
        </div>
    </div>
    
    <div class="guidefloat-widget-content">
        <div class="guidefloat-widget-step-header">
            <div class="guidefloat-widget-step-title">${currentStepData.title}</div>
            <div class="guidefloat-widget-step-description">${currentStepData.description}</div>
        </div>
        
        <div class="guidefloat-widget-step-content">
            ${currentStepData.content}
        </div>
        
        <div class="guidefloat-widget-step-actions">
            <button class="guidefloat-button guidefloat-button-primary">Continue</button>
            <button class="guidefloat-button guidefloat-button-secondary">Skip</button>
        </div>
    </div>
`;
```

### 3. Update CSS Integration
Add the design system CSS to your manifest:

```json
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
```

### 4. Design Token Usage
Use the design tokens for consistent styling:

```javascript
// Load design tokens
const tokens = await fetch(chrome.runtime.getURL('design-system/design-tokens.json'))
    .then(response => response.json());

// Apply tokens dynamically
document.documentElement.style.setProperty('--guide-primary', tokens.colors.primary);
```

## Customization
- Modify `design-tokens.json` to change colors, fonts, spacing
- Update `design-system.css` for custom styles
- Use the provided CSS classes for consistent styling

## Next Steps
1. Test the integration in development
2. Update existing components to use new design system
3. Add new components as needed
4. Deploy updated extension
