# 🧪 GuideFloat Test Setup

## Quick Test Setup

### 1. Open the Test Page
```bash
# Open the test page in your browser
open /Users/admin/Documents/KunleDevFolder/GuideFloat/test-page.html
```

Or manually navigate to:
```
file:///Users/admin/Documents/KunleDevFolder/GuideFloat/test-page.html
```

### 2. Load the Extension
1. Go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder inside your GuideFloat directory
5. Verify the extension appears in your toolbar

### 3. Test the Guide
1. Click the GuideFloat extension icon
2. Select "🧪 Test Signup Flow Guide"
3. Watch the magic happen! ✨

## What You'll See

### 🎯 Auto-Navigation
- Extension automatically navigates to the test page
- Shows navigation message: "Opening the test page for you..."

### 🔵 Blue Dot Spotlight
- Blue bouncing dot appears on target elements
- Shows helpful messages for each field
- Moves between fields as you complete them

### 📝 Field Progression
- Guides you field-by-field through the form
- Auto-advances when you complete each field
- Shows specific instructions for each input

### 🎨 Visual Elements
- SVG diagrams showing what to look for
- Step indicators showing progress
- Success messages and tips

### 🔄 Auto-Advancement
- Automatically moves to next step when form is submitted
- Collapses completed steps
- Shows progress through the flow

## Test Scenarios

### Scenario 1: Complete Flow
1. Follow the guide through all 4 steps
2. Observe how the blue dot guides you
3. Notice the field progression working
4. See auto-advancement between steps

### Scenario 2: Skip Steps
1. Try the "Skip" functionality
2. See how the guide adapts
3. Notice the progress tracking

### Scenario 3: Debug Mode
1. Open Developer Tools (F12)
2. Watch the console logs
3. See detailed debugging information
4. Understand how the system works

## Debug Information

The test page includes a debug panel (top-right) showing:
- Current step number
- Target CSS selectors
- Element information

Console logs show:
```
🧪 GuideFloat Test Page Loaded
📋 Available elements for testing:
  • Email input: input[type="email"]
  • Password input: input[type="password"]
  • Submit button: button[type="submit"]
  • First name: input[name="firstName"]
  • Last name: input[name="lastName"]
  • Industry select: select[name="industry"]
  • Checkboxes: input[type="checkbox"]
  • Continue button: button
```

## Expected Behavior

### Step 1: Account Creation
- Blue dot appears on email field
- Guides through: email → password → confirm → terms → submit
- Auto-advances to Step 2 when form submitted

### Step 2: Profile Setup
- Blue dot appears on first name field
- Guides through: first name → last name → company → industry → phone → continue
- Auto-advances to Step 3 when form submitted

### Step 3: Preferences
- Blue dot appears on feature checkboxes
- Guides through: features → notifications → newsletter → complete
- Auto-advances to Step 4 when form submitted

### Step 4: Success
- Blue dot appears on "Go to Dashboard" button
- Shows success message
- Completes the test flow

## Troubleshooting

### Blue Dot Not Appearing
1. Check console for errors
2. Verify CSS selectors are correct
3. Ensure spotlight.js is loaded
4. Check if target elements exist

### Field Progression Not Working
1. Verify field selectors match the page
2. Check if field completion detection is working
3. Look for JavaScript errors in console

### Auto-Navigation Not Working
1. Check if autoNavigate URL is correct
2. Verify background script is running
3. Check for navigation errors in console

### Extension Not Loading
1. Ensure you're in Developer mode
2. Check for manifest.json errors
3. Verify all required files are present

## Creating Your Own Guides

After testing, use the template and specification to create your own guides:

1. **Copy the template**: `guide-template.json`
2. **Follow the specification**: `GUIDE_JSON_SPECIFICATION.md`
3. **Use the checklist**: `GUIDE_CREATION_CHECKLIST.md`
4. **Validate your JSON**: `node validate-guide.js your-guide.json`

## Test Data

Use these test values for the form:
- **Email**: test@example.com
- **Password**: testpassword123
- **First Name**: John
- **Last Name**: Doe
- **Company**: Test Company
- **Industry**: Technology
- **Phone**: +1 (555) 123-4567

This test setup gives you a complete understanding of how GuideFloat works before creating your own guides!
