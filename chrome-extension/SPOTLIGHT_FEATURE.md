# 🎯 Spotlight Feature - Visual Page Guidance

GuideFloat now includes a **Spotlight system** that shows users exactly where to click or interact on the page!

---

## ✨ **What It Does**

For each step in a guide, Spotlight can:
- 🎯 **Bouncing Dot** - Points to the exact button/field/element
- 💬 **Floating Dialog** - Shows helpful instructions
- ⭐ **Element Highlight** - Adds a glowing outline to the target
- 🎨 **Smart Positioning** - Auto-positions to avoid overlaps

---

## 🎬 **Visual Example**

```
┌─ Page Content ─────────────────────────────────┐
│                                                  │
│  [Button] ← 🔵 ← ┌─────────────────────┐       │
│             ↑     │ 💡 Next Step         │       │
│             │     │                      │       │
│      Bouncing     │ Click the blue       │       │
│        Dot        │ 'Create Account'     │       │
│                   │ button to proceed.   │       │
│                   │                 [×]  │       │
│                   └─────────────────────┘       │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🎯 **Components**

### **1. Bouncing Dot**
- Pulses and bounces to grab attention
- Positioned exactly at/near the target element
- Animated with gradient pulse effect
- Follows page scroll

### **2. Floating Dialog**
- Shows step instructions
- Auto-positions to avoid covering content
- Has arrow pointing to target
- Dismissible with × button
- Auto-dismisses on target click

### **3. Element Highlight**
- Adds colored outline to target
- Glowing shadow effect
- Removed when spotlight dismissed

---

## 📋 **How It Works**

### **For Users:**
1. Start a guide
2. Navigate to step with spotlight
3. See bouncing dot + dialog appear
4. Follow the instructions
5. Click target → Spotlight disappears
6. Move to next step

### **For Guide Creators:**
Add `spotlight` object to any step in your guide JSON:

```json
{
  "id": 1,
  "title": "Click the Submit Button",
  "instructions": "...",
  "spotlight": {
    "target": "button[type='submit']",
    "message": "Click this blue button to submit the form",
    "type": "info",
    "position": "auto"
  }
}
```

---

## 🔧 **Spotlight Configuration**

### **Required Fields:**
- **`target`** - CSS selector for the element to highlight
  ```json
  "target": "button[type='submit']"
  "target": "#create-account-btn"
  "target": ".signup-button"
  ```

### **Optional Fields:**
- **`message`** - Custom message (defaults to step title)
  ```json
  "message": "Click the blue 'Create Account' button"
  ```

- **`type`** - Visual style (info/warning/success)
  ```json
  "type": "info"     // Blue - default
  "type": "warning"  // Orange - caution
  "type": "success"  // Green - final step
  ```

- **`position`** - Dialog placement (auto/top/bottom/left/right)
  ```json
  "position": "auto"   // Smart positioning (default)
  "position": "right"  // Always to the right
  "position": "bottom" // Always below
  ```

---

## 🎨 **Visual Styles**

### **Info (Blue) - Default**
```
💡 Next Step
Click the 'Create Account' button to proceed.
```
- Use for: Normal instructions
- Color: Purple/Blue gradient

### **Warning (Orange)**
```
⚠️ Next Step
Choose currency carefully - it cannot be changed!
```
- Use for: Important warnings
- Color: Orange

### **Success (Green)**
```
✅ Next Step
Almost done! Click 'Finish' to complete setup.
```
- Use for: Final steps, confirmations
- Color: Green

---

## 💡 **Smart Features**

### **1. Auto-Positioning**
Spotlight intelligently positions the dialog:
1. **First Choice:** Right of target (if space)
2. **Second Choice:** Left of target
3. **Third Choice:** Below target
4. **Last Resort:** Above target

### **2. Element Detection**
- Waits up to 1 second for dynamic elements
- Retries if element not immediately found
- Gracefully handles missing elements

### **3. Scroll Tracking**
- Dot follows target element on scroll
- Positions update dynamically
- Smooth transitions

### **4. Auto-Dismissal**
Spotlight automatically closes when:
- User clicks the target element ✓
- User clicks × button ✓
- User navigates to next step ✓
- 15 seconds pass (optional timeout)

### **5. Highlight Protection**
- Stores original element styles
- Restores styles on dismiss
- No permanent changes to page

---

## 🧪 **Examples**

### **Example 1: Simple Button**
```json
{
  "spotlight": {
    "target": "#submit-button",
    "message": "Click here to submit the form"
  }
}
```

### **Example 2: Warning for Irreversible Action**
```json
{
  "spotlight": {
    "target": "#delete-account-btn",
    "message": "Warning: This action cannot be undone!",
    "type": "warning",
    "position": "top"
  }
}
```

### **Example 3: Success for Final Step**
```json
{
  "spotlight": {
    "target": "#finish-setup-btn",
    "message": "Congratulations! Click here to finish setup.",
    "type": "success",
    "position": "auto"
  }
}
```

### **Example 4: Multiple Possible Selectors**
```json
{
  "spotlight": {
    "target": "button[type='submit'], .submit-btn, #submit",
    "message": "Submit button may vary - look for blue button"
  }
}
```

---

## 🎯 **CSS Selectors Guide**

### **By ID:**
```css
#submit-button         → <button id="submit-button">
#create-account        → <div id="create-account">
```

### **By Class:**
```css
.btn-primary           → <button class="btn-primary">
.signup-form           → <form class="signup-form">
```

### **By Attribute:**
```css
button[type="submit"]  → <button type="submit">
input[name="email"]    → <input name="email">
a[href*="signup"]      → <a href="/signup">
```

### **By Data Attribute:**
```css
[data-testid="add-button"]
[data-action="create"]
```

### **Multiple Selectors (OR):**
```css
"#submit, .submit-btn, button[type='submit']"
```
Tries each selector until one matches

---

## 📊 **When to Use Spotlight**

### **✅ Good Use Cases:**
- **Complex interfaces** - Many buttons, unclear flow
- **Important fields** - Specific form inputs
- **Hidden elements** - Nested in menus/dropdowns
- **Ambiguous actions** - Multiple similar buttons
- **Critical warnings** - Irreversible actions

### **❌ Don't Use When:**
- **Single obvious button** - No confusion possible
- **Standard forms** - Self-explanatory
- **Every single step** - Becomes annoying
- **Element doesn't exist** - Dynamic/conditional content
- **Mobile-only elements** - Responsive design issues

---

## 🔍 **Debugging**

### **Spotlight Not Appearing?**

**Check Console:**
```javascript
[Spotlight] Target element not found: #my-button
```

**Solutions:**
1. **Verify selector:**
   - Open page in browser
   - Open DevTools (F12)
   - Try: `document.querySelector("#my-button")`
   - If null, selector is wrong

2. **Wait for dynamic content:**
   - Element may load after page
   - Spotlight waits 1 second automatically
   - May need longer wait for slow pages

3. **Check element visibility:**
   - Element must be visible on screen
   - Can't target `display: none` elements
   - Can't target elements off-screen

### **Dialog Cut Off?**

**Problem:** Dialog extends beyond viewport

**Solution:**
```json
"position": "top"  // Force specific position
```

---

## 🚀 **Advanced Usage**

### **Programmatic Control:**

```javascript
// Show spotlight manually
window.Spotlight.create({
    target: '#my-button',
    message: 'Click this button',
    type: 'info',
    position: 'auto'
});

// Remove spotlight
window.Spotlight.remove();

// Point to element by selector
window.Spotlight.pointTo(
    '#submit-button',
    'Submit the form',
    'info'
);
```

### **Dynamic Targets:**
```json
{
  "spotlight": {
    "target": "[aria-label='Create Account']",
    "message": "Button text varies by language"
  }
}
```

---

## 📝 **Best Practices**

### **1. Use Specific Selectors**
```
✅ Good: "#create-account-button"
❌ Bad:  "button"  (too generic)
```

### **2. Keep Messages Short**
```
✅ Good: "Click 'Submit' to continue"
❌ Bad:  "Now that you've filled out all the fields..."
```

### **3. Match Step Content**
Message should complement, not repeat, step instructions

### **4. Test on Real Pages**
Always test spotlight with actual target pages

### **5. Provide Fallbacks**
If element might not exist, mention in instructions

---

## 🎨 **Customization**

### **Colors:**
Modify in `spotlight.js`:
```javascript
const typeColors = {
    info: { bg: '#667eea', border: '#5a67d8' },
    warning: { bg: '#f59e0b', border: '#d97706' },
    success: { bg: '#10b981', border: '#059669' }
};
```

### **Animations:**
Adjust in CSS:
```css
@keyframes guidefloat-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }  // Change bounce height
}
```

### **Timing:**
```javascript
setTimeout(() => {
    window.Spotlight.create(...);
}, 500);  // Adjust delay
```

---

## 🔒 **Privacy & Performance**

✅ **No tracking** - Local only  
✅ **No data collection** - Just visual aid  
✅ **Lightweight** - ~5KB total  
✅ **No external calls** - Fully contained  
✅ **Respects page** - Doesn't modify content  

---

## 📈 **Future Enhancements**

Coming soon:
- **Video tutorials** embedded in dialog
- **Interactive walkthroughs** (click to continue)
- **Multi-step spotlights** (sequential highlighting)
- **Screen recording** of spotlight actions
- **A/B testing** spotlight effectiveness

---

**Reload extension and test it!** Start the Facebook Ads guide on business.facebook.com to see spotlight in action! 🎯

