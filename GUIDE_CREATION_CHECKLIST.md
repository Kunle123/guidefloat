# GuideFloat Guide Creation Checklist

## Quick Reference for Creating Complete JSON Guides

### 1. Basic Information
- [ ] **ID**: Unique identifier (kebab-case, no spaces)
- [ ] **Title**: Include relevant emoji (🎯 📱 🛍️ 📧 🌐 📊)
- [ ] **Description**: Brief, compelling description
- [ ] **Category**: Marketing, E-commerce, Email, Website, Analytics
- [ ] **Difficulty**: Beginner, Intermediate, Advanced
- [ ] **Time**: Realistic estimate (e.g., "45 minutes", "2 hours")
- [ ] **Total Steps**: Count of all steps

### 2. Prerequisites (Optional)
- [ ] **Title**: "What You'll Need" or similar
- [ ] **Description**: Brief intro text
- [ ] **Items**: List of required items
- [ ] **Checkpoints**: Adaptive questions for skipping steps

### 3. Each Step Must Have:
- [ ] **ID**: Step number (1, 2, 3, etc.)
- [ ] **Title**: Clear, action-oriented title
- [ ] **Description**: Brief step description
- [ ] **Instructions**: Numbered list with `\n` for line breaks
- [ ] **Estimated Time**: Time for this step

### 4. Optional Step Features:
- [ ] **Skip Options**: `skipIfCompleted` and `skipMessage`
- [ ] **Action Buttons**: Links to external pages
- [ ] **Tips**: Helpful hints array
- [ ] **Layout Diagram**: SVG showing UI elements
- [ ] **Spotlight**: Blue dot guidance
- [ ] **Auto-Navigate**: Automatic page navigation
- [ ] **Field Progression**: Step-by-step form guidance

### 5. CSS Selectors (Critical!)
- [ ] **Valid CSS**: No jQuery selectors like `:contains()`
- [ ] **Multiple Fallbacks**: `"input[type='email'], input[name*='email']"`
- [ ] **Tested**: Verify selectors work on actual page
- [ ] **Robust**: Use attribute selectors for reliability

### 6. Common Selector Patterns:
```css
/* Email inputs */
input[type='email'], input[name*='email']

/* Password inputs */
input[type='password'], input[name*='password']

/* Submit buttons */
button[type='submit'], button

/* Radio buttons */
input[type='radio'], input[type='checkbox']

/* Links */
a[href*='next'], a[href*='continue']

/* Generic buttons */
button, a[role='button']
```

### 7. Spotlight Types:
- `"success"` - Green (completion, success)
- `"info"` - Blue (information, guidance)
- `"warning"` - Yellow (caution, important)
- `"error"` - Red (errors, problems)

### 8. Field Progression (For Forms):
- [ ] **Enabled**: Set to `true`
- [ ] **Fields Array**: Each field needs selector, message, required
- [ ] **Logical Order**: Email → Password → Submit
- [ ] **Clear Messages**: Specific instructions for each field

### 9. Auto-Navigation:
- [ ] **URL**: Exact URL to navigate to
- [ ] **Message**: User-friendly navigation message
- [ ] **First Step Only**: Usually only on step 1

### 10. Action Buttons:
- [ ] **Text**: Clear button text
- [ ] **URL**: Working URL
- [ ] **Type**: "affiliate" or "regular"

### 11. Instructions Format:
```
1. First action to take
2. Second action to take
3. Third action to take

💡 Pro Tip: Helpful tip for this step
📝 Note: Important note about this step
```

### 12. File Requirements:
- [ ] **Filename**: Match the `id` property
- [ ] **Location**: `chrome-extension/guides/`
- [ ] **Format**: Valid JSON (use JSON validator)
- [ ] **Encoding**: UTF-8

### 13. Testing Checklist:
- [ ] **JSON Valid**: No syntax errors
- [ ] **URLs Work**: All links are accessible
- [ ] **Selectors Work**: Test on actual pages
- [ ] **Navigation**: Auto-navigation works
- [ ] **Spotlight**: Blue dot appears correctly
- [ ] **Field Progression**: Moves through form fields
- [ ] **Time Estimates**: Realistic and helpful

### 14. Common Mistakes to Avoid:
- ❌ Using jQuery selectors (`:contains()`)
- ❌ Missing required properties
- ❌ Invalid JSON syntax
- ❌ Broken URLs
- ❌ Unrealistic time estimates
- ❌ Vague instructions
- ❌ Missing line breaks in instructions
- ❌ Overly specific CSS selectors

### 15. Quality Checklist:
- [ ] **Clear Instructions**: Easy to follow
- [ ] **Helpful Tips**: Add value for users
- [ ] **Visual Guidance**: SVG diagrams where helpful
- [ ] **Error Prevention**: Anticipate common issues
- [ ] **Progress Tracking**: Logical step progression
- [ ] **User Experience**: Smooth, intuitive flow

## Quick Copy-Paste Template:

```json
{
  "id": "your-guide-id",
  "title": "🎯 Your Guide Title",
  "description": "Brief description",
  "category": "Category",
  "difficulty": "Beginner",
  "estimatedTime": "30 minutes",
  "totalSteps": 5,
  "steps": [
    {
      "id": 1,
      "title": "Step Title",
      "description": "Step description",
      "instructions": "1. Action one\n2. Action two\n3. Action three",
      "estimatedTime": "5 minutes",
      "spotlight": {
        "target": "input[type='email'], input[name*='email']",
        "message": "Enter your email here",
        "type": "success",
        "position": "auto"
      }
    }
  ]
}
```

Use this checklist to ensure your JSON guides are complete and functional!
