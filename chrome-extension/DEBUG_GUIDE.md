# 🐛 Debug: Guide Not Following Across Pages

## Quick Debug Steps:

### 1. Check Background Script Logs

1. Go to `chrome://extensions/`
2. Find "GuideFloat"
3. Click "**service worker**" (blue link under "Inspect views")
4. Console opens
5. Navigate to a new page while guide is active
6. Look for these logs:
   ```
   Page navigated on tab 12345, restoring guide...
   [GuideFloat Background] Restoring on URL: https://...
   ```

**If you DON'T see these logs** → Background script isn't triggering

### 2. Check Storage State

In the page console (F12), run:
```javascript
chrome.storage.local.get(['currentGuide', 'widgetVisible', 'activeTabId'], (result) => {
    console.log('Storage state:', result);
});
```

**Expected:**
```
{
  currentGuide: "facebook-ads-setup",
  widgetVisible: true,
  activeTabId: 123456
}
```

### 3. Manual Test

In page console (F12):
```javascript
// Check if content script loaded after navigation
console.log('GuideFloat loaded?', {
    injected: window.guideFloatInjected,
    listener: window.guideFloatListenerSetup,
    object: typeof window.GuideFloat
});
```

**Expected:** All should be `true` or `"object"`

---

## Common Issues:

| Issue | Symptom | Fix |
|-------|---------|-----|
| Background script not running | No logs in service worker | Reload extension |
| Wrong tab ID | Guide on different tab | Close guide and restart |
| Restricted URL | Can't inject on chrome:// | Use regular website |
| Script injection failed | Permission error | Check console for errors |

---

## Force It To Work:

If debugging doesn't help, run this in the page console after navigation:

```javascript
chrome.storage.local.get(['currentGuide'], (result) => {
    if (result.currentGuide) {
        chrome.runtime.sendMessage({
            action: 'showGuide',
            guideId: result.currentGuide
        });
    }
});
```

This manually triggers the guide to show.

