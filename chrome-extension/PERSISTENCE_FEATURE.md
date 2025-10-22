# 🔄 Guide Persistence Across Page Navigation

## 🎯 Problem Solved

**Before:** Guide disappeared when navigating to a new page (clicking links, form submissions, etc.)

**After:** Guide automatically restores itself on every page navigation! 🎉

---

## ✨ How It Works

### **The Magic:**

```
User starts guide on Tab A
↓
Clicks link → New page loads
↓
🔄 Background script detects navigation
↓
Re-injects content script automatically
↓
Restores guide at same step/progress
↓
✓ Guide appears again, ready to use!
```

---

## 🔧 Technical Implementation

### **1. Background Service Worker (`background.js`)**

Listens for navigation events:

```javascript
chrome.webNavigation.onCompleted.addListener(async (details) => {
  // When page finishes loading...
  
  // Check: Is there an active guide?
  // Check: Is this the tab with the guide?
  
  if (yes) {
    → Re-inject CSS + JavaScript
    → Wait for script to be ready (ping/pong)
    → Restore the guide
    → User sees guide again!
  }
});
```

### **2. State Persistence**

Stored in `chrome.storage.local`:
```javascript
{
  currentGuide: 'facebook-ads-setup',
  activeTabId: 123456,
  widgetVisible: true,
  'guidefloat-progress-facebook-ads-setup': {
    currentStep: 3,
    completedSteps: [1, 2],
    lastUpdated: '2025-10-22T...'
  }
}
```

### **3. Smart Restoration**

- ✅ Restores same guide ID
- ✅ Restores progress (step + completed steps)
- ✅ Restores widget position (from localStorage)
- ✅ Only on the correct tab

---

## 🎬 User Experience

### **Scenario 1: Facebook Ads Guide**

```
1. Start "Facebook Ads Setup" guide
2. Complete Step 1: "Set up Business Manager"
3. Click button → Opens business.facebook.com
4. 🔄 Page loads...
5. ✓ Guide automatically appears!
6. Still on Step 2, ready to continue
```

### **Scenario 2: Multi-Page Journey**

```
Tab with guide:
Page A → Page B → Page C → Page D
  ↓        ↓        ↓        ↓
Guide   Guide    Guide    Guide
shows   shows    shows    shows
```

**Guide stays with you through the entire journey!**

### **Scenario 3: Manual Dismissal**

```
1. Guide is active
2. Click "Close Guide" in popup
3. Navigate to new page
4. ✓ Guide does NOT reappear (you dismissed it)
```

---

## 🎯 Key Features

### ✅ **Always Visible**
Guide stays in foreground across all navigations until you explicitly close it

### ✅ **Progress Preserved**
Your current step and completed steps are maintained

### ✅ **Smart Detection**
Only restores on the specific tab where guide is active

### ✅ **Reliable**
Uses ping/pong to ensure script is ready before showing

### ✅ **Fast**
Restoration typically happens in < 1 second

---

## 📊 Navigation Types Supported

| Navigation Type | Guide Persists? |
|-----------------|-----------------|
| Click link | ✅ Yes |
| Form submission | ✅ Yes |
| Browser back/forward | ✅ Yes |
| Refresh page (F5) | ✅ Yes |
| URL typed in address bar | ✅ Yes |
| JavaScript navigation | ✅ Yes |
| New tab | ❌ No (guide is tab-specific) |

---

## 🔧 Technical Details

### **Permissions Required:**
- `webNavigation` - To detect page loads
- `scripting` - To re-inject content script
- `storage` - To track active guide state

### **Events Listened:**
- `chrome.webNavigation.onCompleted` - Main frame navigation only (frameId === 0)

### **Restoration Logic:**
1. Check if guide is active
2. Check if navigation is on the guide's tab
3. Re-inject CSS (with USER origin for priority)
4. Re-inject JavaScript
5. Ping until script responds
6. Send `showGuide` message with guide ID
7. Content script loads progress from storage
8. Widget appears at correct step

---

## 🐛 Edge Cases Handled

### **Case 1: Tab Closed**
- User closes tab with guide
- State remains in storage
- Click "Go to Guide" → Error message
- State cleared automatically

### **Case 2: Multiple Navigations**
- User clicks many links quickly
- Each navigation triggers restoration
- Last one wins (no conflicts)

### **Case 3: Script Injection Fails**
- Network issues, permissions, etc.
- Logged to console
- Guide won't appear but no crash
- User can restart manually

### **Case 4: Page With iframe**
- Only main frame (frameId === 0) triggers restoration
- iframes ignored
- No duplicate guides

---

## 🚀 Testing Scenarios

### **Test 1: Basic Navigation**
1. Start guide
2. Click any link on the page
3. ✓ Guide reappears on new page
4. ✓ Progress maintained

### **Test 2: Multi-Page Flow**
1. Start Facebook Ads guide
2. Step 1 → Click button → Opens business.facebook.com
3. ✓ Guide appears
4. Step 2 → Click button → Opens another page
5. ✓ Guide appears again
6. Continue through all steps

### **Test 3: Dismiss & Navigate**
1. Start guide
2. Click "Close Guide"
3. Navigate to new page
4. ✓ Guide does NOT appear (correctly dismissed)

### **Test 4: Browser Back/Forward**
1. Start guide on Page A
2. Navigate to Page B (guide appears)
3. Click browser Back button
4. ✓ Guide reappears on Page A

### **Test 5: Minimize & Navigate**
1. Start guide
2. Minimize guide (🚀 icon)
3. Navigate to new page
4. ✓ Minimized icon reappears in same position

---

## 📝 Console Logs

When working, you'll see:
```
Page navigated on tab 123456, restoring guide...
Ping attempt 1 failed
Ping attempt 2 failed
Content script is ready!
Guide restored successfully!
```

---

## ✅ Success Criteria

- ✅ Guide appears within 1 second of page load
- ✅ No duplicate guides
- ✅ Progress preserved correctly
- ✅ Works on all navigation types
- ✅ Only appears on the correct tab
- ✅ Stops appearing when explicitly closed

---

**This is the core feature that makes GuideFloat truly useful!** 🚀

Users can now follow multi-page guides without losing their place or having to manually re-open the guide after every navigation.

