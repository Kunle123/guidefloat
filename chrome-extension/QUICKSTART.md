# ⚡ QuickStart - Get Running in 5 Minutes

## 🎯 Goal
Load the GuideFloat extension in Chrome and test it!

---

## Step 1: Create Simple Icons (2 minutes)

You need 3 icon files. **Easiest way:**

### Option A: Use Placeholders (Fastest!)
Create any 3 simple colored squares:

```bash
# On Mac (using ImageMagick if installed):
convert -size 16x16 xc:purple chrome-extension/icons/icon16.png
convert -size 48x48 xc:purple chrome-extension/icons/icon48.png
convert -size 128x128 xc:purple chrome-extension/icons/icon128.png
```

### Option B: Use Online Tool (2 clicks)
1. Go to: https://icon.kitchen
2. Upload ANY image (screenshot, logo, anything)
3. Download - it creates all 3 sizes!
4. Move to `chrome-extension/icons/` folder

### Option C: Screenshot Method
1. Take a screenshot of the 🚀 emoji
2. Crop to square
3. Resize to 128x128, 48x48, 16x16
4. Save as PNG in icons folder

---

## Step 2: Load in Chrome (1 minute)

1. Open Chrome

2. Go to: **chrome://extensions/**

3. Toggle **"Developer mode"** ON (top-right)

4. Click **"Load unpacked"**

5. Select the **`chrome-extension`** folder

6. ✅ Done! Extension loaded!

---

## Step 3: Test It! (2 minutes)

1. **Click the GuideFloat icon** in Chrome toolbar (top-right)

2. **Click any guide** (e.g., "Facebook Ads Setup")

3. The guide appears on your page! ✨

4. **Navigate to Facebook.com**

5. **The guide STAYS VISIBLE!** 🎉

6. It actually works now!

---

## 🎉 Success!

You now have a working Chrome extension that:
- ✅ Appears on command
- ✅ Stays visible while navigating
- ✅ Persists across all pages
- ✅ Saves progress automatically

---

## 🐛 Issues?

**"Invalid manifest"**
- Make sure all files are in chrome-extension folder
- Check icons folder has 3 PNG files

**"Extension didn't load"**
- Check all JSON files in guides/ folder
- Look at errors in chrome://extensions/

**"Guide doesn't appear"**
- Click the extension icon
- Select a guide from popup
- Reload the page if needed

---

## 📝 What's Next?

1. **Test on multiple sites** - Facebook, Google, etc.
2. **Add better icons** - Make it look professional
3. **Test all guides** - Make sure they work
4. **Publish!** - See README.md for publishing guide

---

**The extension is ready to use! No more bookmarklet problems!** 🚀

