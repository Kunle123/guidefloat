# GuideFloat JSON Guide Specification

## Overview
This document defines the complete JSON structure required to create fully functional guides in the GuideFloat Chrome extension. Each guide is a JSON file that defines step-by-step instructions with interactive elements, visual guidance, and automated navigation.

## File Structure

### Root Level Properties

```json
{
  "id": "unique-guide-identifier",
  "title": "Guide Title with Emoji",
  "description": "Brief description of what the guide accomplishes",
  "category": "Category Name",
  "difficulty": "Beginner|Intermediate|Advanced",
  "estimatedTime": "X minutes|X hours",
  "totalSteps": 15,
  "affiliateDisclosure": "Optional affiliate disclosure text",
  "prerequisites": { /* Prerequisites object */ },
  "steps": [ /* Array of step objects */ ]
}
```

### Required Root Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier (kebab-case, no spaces) |
| `title` | string | ✅ | Display title (include relevant emoji) |
| `description` | string | ✅ | Brief description for guide cards |
| `category` | string | ✅ | Category for organization |
| `difficulty` | string | ✅ | One of: "Beginner", "Intermediate", "Advanced" |
| `estimatedTime` | string | ✅ | Human-readable time estimate |
| `totalSteps` | number | ✅ | Total number of steps in the guide |
| `steps` | array | ✅ | Array of step objects |

### Optional Root Properties

| Property | Type | Required | Description |
|----------|------|❌ | Optional affiliate disclosure text |
| `prerequisites` | object | ❌ | Prerequisites and checkpoints |

## Prerequisites Object

```json
{
  "title": "What You'll Need",
  "description": "Make sure you have these ready before starting:",
  "items": [
    "Business name and description",
    "Product photos (if selling physical products)",
    "Business email address"
  ],
  "checkpoints": [
    {
      "id": "has-business-manager",
      "question": "Do you already have Facebook Business Manager?",
      "skipToStep": 2
    }
  ]
}
```

### Prerequisites Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | ✅ | Section title |
| `description` | string | ✅ | Description text |
| `items` | array | ❌ | List of required items |
| `checkpoints` | array | ❌ | Adaptive checkpoints for skipping steps |

### Checkpoint Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique checkpoint identifier |
| `question` | string | ✅ | Question to ask user |
| `skipToStep` | number | ✅ | Step number to skip to if completed |

## Step Object

Each step in the `steps` array must follow this structure:

```json
{
  "id": 1,
  "title": "Step Title",
  "description": "Brief step description",
  "instructions": "Detailed step-by-step instructions with line breaks",
  "skipIfCompleted": true,
  "skipMessage": "Already completed? Skip this step.",
  "layoutDiagram": "<svg>...</svg>",
  "actionButtons": [ /* Array of action button objects */ ],
  "tips": [ /* Array of tip strings */ ],
  "estimatedTime": "X minutes",
  "spotlight": { /* Spotlight configuration object */ },
  "autoNavigate": { /* Auto-navigation object */ },
  "fieldProgression": { /* Field progression object */ }
}
```

### Required Step Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | number | ✅ | Step number (1-based) |
| `title` | string | ✅ | Step title |
| `description` | string | ✅ | Brief step description |
| `instructions` | string | ✅ | Detailed instructions (use `\n` for line breaks) |
| `estimatedTime` | string | ✅ | Time estimate for this step |

### Optional Step Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `skipIfCompleted` | boolean | ❌ | Allow skipping if already completed |
| `skipMessage` | string | ❌ | Message shown when skipping |
| `layoutDiagram` | string | ❌ | SVG diagram showing UI layout |
| `actionButtons` | array | ❌ | Array of action button objects |
| `tips` | array | ❌ | Array of helpful tip strings |
| `spotlight` | object | ❌ | Spotlight configuration |
| `autoNavigate` | object | ❌ | Auto-navigation configuration |
| `fieldProgression` | object | ❌ | Field-by-field progression |

## Action Button Object

```json
{
  "text": "Button Text",
  "url": "https://example.com",
  "type": "affiliate|regular"
}
```

### Action Button Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `text` | string | ✅ | Button display text |
| `url` | string | ✅ | URL to navigate to |
| `type` | string | ✅ | "affiliate" or "regular" |

## Spotlight Object

```json
{
  "target": "input[type='email'], input[name*='email']",
  "message": "Enter your email address to start your free trial",
  "type": "success|info|warning|error",
  "position": "auto|top|bottom|left|right"
}
```

### Spotlight Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `target` | string | ✅ | CSS selector(s) for target element(s) |
| `message` | string | ✅ | Message to display in dialog |
| `type` | string | ✅ | Visual style: "success", "info", "warning", "error" |
| `position` | string | ✅ | Dialog position: "auto", "top", "bottom", "left", "right" |

### CSS Selector Guidelines

- Use valid CSS selectors only
- Multiple selectors: `"input[type='email'], input[name*='email']"`
- Avoid jQuery selectors like `:contains()`
- Use attribute selectors: `input[name*='email']`
- Use type selectors: `button[type='submit']`
- Use class selectors: `.btn-primary`
- Use ID selectors: `#email-input`

## Auto-Navigate Object

```json
{
  "url": "https://www.shopify.com/free-trial",
  "message": "Taking you to Shopify to start your free trial..."
}
```

### Auto-Navigate Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `url` | string | ✅ | URL to navigate to |
| `message` | string | ✅ | Message shown during navigation |

## Field Progression Object

```json
{
  "enabled": true,
  "fields": [
    {
      "selector": "input[type='email'], input[name*='email']",
      "message": "Enter your email address",
      "required": true
    },
    {
      "selector": "input[type='password'], input[name*='password']",
      "message": "Create a secure password (8+ characters)",
      "required": true
    },
    {
      "selector": "button[type='submit'], button",
      "message": "Click 'Create Shopify account' to continue",
      "required": true
    }
  ]
}
```

### Field Progression Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `enabled` | boolean | ✅ | Enable field progression mode |
| `fields` | array | ✅ | Array of field objects |

### Field Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `selector` | string | ✅ | CSS selector for the field |
| `message` | string | ✅ | Message to show for this field |
| `required` | boolean | ✅ | Whether field is required |

## Layout Diagram (SVG)

The `layoutDiagram` property should contain inline SVG code showing the UI layout:

```json
{
  "layoutDiagram": "<svg viewBox='0 0 300 100' xmlns='http://www.w3.org/2000/svg'><rect width='300' height='100' fill='#eff6ff' rx='8'/><text x='150' y='20' text-anchor='middle' font-size='13' font-weight='600' fill='#1e40af'>🔍 What to Look For:</text><rect x='20' y='30' width='70' height='24' fill='#f3f4f6' stroke='#9ca3af' stroke-width='2' rx='4'/><text x='55' y='47' text-anchor='middle' font-size='11' font-weight='600' fill='#374151'>Button</text></svg>"
}
```

### SVG Guidelines

- Use `viewBox` for responsive sizing
- Keep it simple and clear
- Use consistent colors and styling
- Include labels and arrows for clarity
- Maximum width: 300px, height: 100px

## Complete Example

Here's a complete step example:

```json
{
  "id": 1,
  "title": "Sign Up for Shopify",
  "description": "Start your 3-day free trial - no credit card required to begin",
  "instructions": "1. Click the button below to start your Shopify trial\n2. Enter your email address\n3. Click 'Start free trial'\n4. Fill in: Store name, Country, Industry\n5. Click 'Next' to continue\n\n💡 Pro Tip: Choose your store name carefully - it will be your default URL (storename.myshopify.com)",
  "skipIfCompleted": true,
  "skipMessage": "Already have a Shopify account? Skip this step.",
  "layoutDiagram": "<svg viewBox='0 0 300 80' xmlns='http://www.w3.org/2000/svg'><rect width='300' height='80' fill='#eff6ff' rx='8'/><text x='150' y='25' text-anchor='middle' font-size='13' font-weight='600' fill='#1e40af'>🔍 What to Look For:</text><rect x='20' y='35' width='260' height='32' fill='#3b82f6' rx='6'/><text x='150' y='55' text-anchor='middle' font-size='14' font-weight='bold' fill='white'>Start free trial</text></svg>",
  "actionButtons": [
    {
      "text": "Start Shopify Free Trial",
      "url": "https://www.shopify.com/free-trial",
      "type": "affiliate"
    }
  ],
  "tips": [
    "3-day free trial, then $1/month for first 3 months",
    "No credit card needed to start trial",
    "Store name becomes your subdomain (changeable later)",
    "Can upgrade/downgrade plans anytime"
  ],
  "estimatedTime": "3 minutes",
  "spotlight": {
    "target": "input[type='email'], input[name*='email']",
    "message": "Enter your email address to start your free trial",
    "type": "success",
    "position": "auto"
  },
  "autoNavigate": {
    "url": "https://www.shopify.com/free-trial",
    "message": "Taking you to Shopify to start your free trial..."
  },
  "fieldProgression": {
    "enabled": true,
    "fields": [
      {
        "selector": "input[type='email'], input[name*='email']",
        "message": "Enter your email address",
        "required": true
      },
      {
        "selector": "input[type='password'], input[name*='password']",
        "message": "Create a secure password (8+ characters)",
        "required": true
      },
      {
        "selector": "button[type='submit'], button",
        "message": "Click 'Create Shopify account' to continue",
        "required": true
      }
    ]
  }
}
```

## Best Practices

### 1. Step Organization
- Start with account creation/signup steps
- Group related actions together
- End with completion/launch steps
- Use logical progression

### 2. CSS Selectors
- Test selectors on the actual page
- Use multiple fallback selectors
- Avoid overly specific selectors
- Use attribute selectors for robustness

### 3. Instructions
- Use numbered lists (1. 2. 3.)
- Include pro tips with 💡 emoji
- Add notes with 📝 emoji
- Use line breaks (`\n`) for readability

### 4. Timing
- Be realistic with time estimates
- Consider user experience level
- Add buffer time for complex steps

### 5. Affiliate Links
- Always include affiliate disclosure
- Use `"type": "affiliate"` for tracking
- Test all URLs before publishing

### 6. Field Progression
- Use for multi-step forms
- Start with required fields
- End with submit buttons
- Provide clear completion criteria

## Validation Checklist

Before publishing a guide, ensure:

- [ ] All required properties are present
- [ ] CSS selectors are valid and tested
- [ ] URLs are working and correct
- [ ] Time estimates are realistic
- [ ] Instructions are clear and complete
- [ ] Affiliate links are properly marked
- [ ] SVG diagrams are clear and helpful
- [ ] Field progression covers all form fields
- [ ] Spotlight targets exist on the page
- [ ] Auto-navigation URLs are correct

## File Naming Convention

- Use kebab-case: `shopify-store-setup.json`
- Match the `id` property
- Place in `chrome-extension/guides/` directory
- Use descriptive names that indicate the service

This specification ensures all guides work consistently with the GuideFloat extension's features including auto-navigation, spotlight guidance, field progression, and visual diagrams.
