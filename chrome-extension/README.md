# 🚀 GuideFloat Chrome Extension

Transform GuideFloat into a powerful Chrome extension that truly stays visible while you work!

---

## ✨ What's Different from the Bookmarklet?

**Bookmarklet Version:**
- ❌ Guide disappears when you navigate
- ❌ Must click bookmarklet on every new page
- ❌ Confusing user experience

**Extension Version:**
- ✅ Guide stays visible across ALL pages
- ✅ Automatically persists while navigating
- ✅ Simple: Install once, use everywhere
- ✅ Professional and trustworthy

---

## 🚀 Installation (For Testing/Development)

### Step 1: Add Icons

Before installing, you need icons in the `icons/` folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

See `icons/README.md` for how to create these quickly.

### Step 2: Load Extension in Chrome

1. **Open Chrome** and go to:
   ```
   chrome://extensions/
   ```

2. **Enable "Developer mode"** (toggle in top-right)

3. **Click "Load unpacked"**

4. **Select the `chrome-extension` folder**

5. **Done!** You'll see the GuideFloat icon in your toolbar

---

## 🎯 How to Use

### Super Simple:

1. **Click the GuideFloat icon** in your Chrome toolbar

2. **Pick a guide** from the popup

3. **That's it!** The guide appears and stays with you everywhere

### The Guide Will:
- ✅ Appear on the current page
- ✅ Stay visible when you navigate
- ✅ Persist across all tabs with that guide
- ✅ Save your progress automatically
- ✅ Follow you wherever you go!

---

## 📁 Extension Structure

```
chrome-extension/
├── manifest.json           # Extension configuration
├── popup.html              # Extension popup UI
├── js/
│   ├── popup.js           # Popup logic
│   ├── content.js         # Widget injected on pages
│   └── background.js      # Service worker
├── css/
│   └── widget.css         # Widget styles
├── guides/                 # Guide JSON files
│   ├── facebook-ads-setup.json
│   ├── shopify-store-setup.json
│   └── ...
└── icons/                  # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🛠️ Development

### Making Changes:

1. Edit files in the `chrome-extension/` folder
2. Go to `chrome://extensions/`
3. Click the **refresh icon** on the GuideFloat extension
4. Test your changes!

### Adding New Guides:

1. Add new JSON file to `guides/` folder
2. Add guide info to `js/popup.js` in the `guides` array
3. Refresh extension
4. Done!

---

## 📦 Publishing to Chrome Web Store

Ready to launch? Here's how:

### Step 1: Prepare

1. **Create icons** (professional looking)
2. **Test thoroughly** on multiple websites
3. **Take screenshots** for the store listing
4. **Write a good description**

### Step 2: Create Developer Account

1. Go to: https://chrome.google.com/webstore/devconsole
2. **Pay $5 one-time registration fee**
3. Fill out developer information

### Step 3: Package Extension

1. **Zip the chrome-extension folder:**
   ```bash
   cd chrome-extension
   zip -r guidefloat-extension.zip .
   ```

2. **Or use Chrome's "Pack extension" feature**

### Step 4: Upload

1. Click "New Item" in developer console
2. Upload your ZIP file
3. Fill in:
   - **Name**: GuideFloat
   - **Description**: Step-by-step guides that float while you work
   - **Category**: Productivity
   - **Screenshots**: Add 3-5 screenshots
   - **Privacy policy**: Add URL (required)
   - **Permissions justification**: Explain why you need storage

4. **Submit for review**

### Step 5: Wait

- **Review time**: 1-3 days typically
- Check email for approval/rejection
- Make changes if needed and resubmit

---

## 🎨 Customization

### Change Colors:

Edit `css/widget.css`:
```css
.guidefloat-header {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Change Extension Name:

Edit `manifest.json`:
```json
{
  "name": "Your New Name",
  "description": "Your new description"
}
```

---

## 🐛 Troubleshooting

### Extension doesn't load:
- Check all required files are present
- Make sure icons folder has all 3 PNG files
- Check Chrome console for errors (chrome://extensions/)

### Guide doesn't appear:
- Click the extension icon
- Select a guide
- Refresh the page if needed

### Guide disappears:
- Check that you selected a guide in the popup
- Make sure extension is enabled

---

## 🔒 Permissions Explained

This extension needs:

**`storage`** - Save your guide progress and preferences  
**`activeTab`** - Show the guide on the current page

That's it! Very minimal permissions.

---

## 📊 What Users Will See

### In Chrome Web Store:

**Title**: GuideFloat - Floating Step-by-Step Guides

**Short Description**:
Complete complex tasks with confidence. Floating guides that stay visible while you work on any website.

**Long Description**:
GuideFloat provides step-by-step guides that float on your screen while you work. Perfect for:

- Setting up Facebook Ads
- Creating Shopify stores
- Email marketing campaigns
- WordPress websites
- Google Analytics
- And more!

**Features:**
✓ Guides stay visible while you navigate
✓ Auto-save progress
✓ Drag and position anywhere
✓ Works on all websites
✓ Free and privacy-friendly

---

## 🎉 Success!

You now have a **professional Chrome extension** that actually solves the problem!

**Next Steps:**
1. Test it thoroughly
2. Add nice icons
3. Publish to Chrome Web Store
4. Get users!

---

## 💰 Monetization Ideas

- Free version: 5 basic guides
- Pro version: Unlimited guides ($4.99/month)
- White label: License to companies
- Affiliate commissions: Already built-in!

---

## 📞 Support

Questions? Check:
- Main README.md in parent folder
- Test locally before publishing
- Chrome extension documentation: https://developer.chrome.com/docs/extensions/

---

**Built with ❤️ for better productivity**

