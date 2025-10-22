# ⚡ GuideFloat Quick Start Guide

Get GuideFloat running in 5 minutes!

---

## 🎯 Goal

By the end of this guide, you'll have GuideFloat running locally and ready to test.

---

## 📦 What You Built

GuideFloat is a complete MVP with:
- ✅ Landing page with 5 guides
- ✅ Floating, draggable widget
- ✅ Progress tracking with localStorage
- ✅ Bookmarklet for any website
- ✅ 5 complete guides (Facebook Ads, Shopify, Mailchimp, WordPress, Google Analytics)
- ✅ Mobile responsive design
- ✅ Modern UI with Tailwind CSS

---

## 🚀 Run Locally (3 Steps)

### Step 1: Start a Local Server

Open terminal in the GuideFloat folder and run:

**Option A: Python (Recommended)**
```bash
python3 -m http.server 8000
```

**Option B: Python 2**
```bash
python -m SimpleHTTPServer 8000
```

**Option C: Node.js**
```bash
npx http-server -p 8000
```

**Option D: PHP**
```bash
php -S localhost:8000
```

### Step 2: Open in Browser

```
http://localhost:8000
```

### Step 3: Test It!

1. **Browse guides** on the landing page
2. **Click "Start Guide"** on any guide
3. The widget should appear with step-by-step instructions
4. **Test features:**
   - ✅ Drag the widget around
   - ✅ Check off steps
   - ✅ Click Next/Previous
   - ✅ Minimize the widget
   - ✅ Close and reopen (progress should save)

---

## 🧪 Test the Bookmarklet

The bookmarklet is the killer feature - it lets users access guides on ANY website.

### Test Locally:

1. Go to `http://localhost:8000`
2. **Drag the "GuideFloat Bookmarklet" button** from the hero section to your bookmarks bar
3. Click a guide (e.g., "Start Guide" on Facebook Ads)
4. Go to a different website (e.g., `https://google.com`)
5. **Click the bookmarklet** in your bookmarks bar
6. The widget should appear with your selected guide!

**Note**: The bookmarklet is smart - it detects localhost and loads local files when testing.

---

## 📂 Project Structure

```
GuideFloat/
│
├── index.html              ← Landing page (start here)
├── widget.js               ← Widget functionality
├── widget.css              ← Widget styles
│
├── guides/                 ← Guide data (JSON)
│   ├── facebook-ads-setup.json
│   ├── shopify-store-setup.json
│   ├── mailchimp-campaign.json
│   ├── wordpress-website.json
│   └── google-analytics-setup.json
│
├── assets/
│   ├── js/
│   │   ├── landing.js      ← Landing page logic
│   │   └── bookmarklet.js  ← Bookmarklet code
│   └── images/
│
├── README.md               ← Full documentation
├── DEPLOYMENT.md           ← Deployment instructions
├── QUICKSTART.md           ← This file
└── .gitignore
```

---

## 🎨 Customize Your Brand

### 1. Change Colors

**Hero Section** (in `index.html`):
```css
.hero-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

**Widget Header** (in `widget.css`):
```css
.guidefloat-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 2. Update Branding

- Replace `🚀` emoji with your logo or different emoji
- Change "GuideFloat" to your brand name
- Update colors throughout

### 3. Add Your Logo

1. Save logo as `assets/images/logo.png`
2. Update references in HTML

---

## ➕ Add a New Guide

### 1. Create JSON File

Create `guides/my-new-guide.json`:
```json
{
  "id": "my-new-guide",
  "title": "My New Guide",
  "description": "What this guide teaches",
  "category": "Marketing",
  "difficulty": "Beginner",
  "estimatedTime": "30 minutes",
  "totalSteps": 3,
  "steps": [
    {
      "id": 1,
      "title": "First Step",
      "description": "What this accomplishes",
      "instructions": "Detailed instructions here",
      "actionButtons": [
        {
          "text": "Open Tool",
          "url": "https://example.com",
          "type": "affiliate"
        }
      ],
      "tips": ["Tip 1", "Tip 2"],
      "estimatedTime": "10 minutes"
    }
  ]
}
```

### 2. Add to Landing Page

Edit `assets/js/landing.js`, add to `guidesData` array:
```javascript
{
    id: 'my-new-guide',
    title: 'My New Guide',
    description: 'What this guide teaches',
    category: 'marketing',
    difficulty: 'Beginner',
    estimatedTime: '30 minutes',
    totalSteps: 3,
    icon: '📱'
}
```

### 3. Test

Refresh browser and your guide should appear!

---

## 🚀 Deploy to Production

### Quick Deploy with Vercel (Easiest):

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd GuideFloat
vercel
```

Follow prompts → Your site is live! 🎉

### Or Use GitHub Pages:

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/guidefloat.git
git push -u origin main

# Enable GitHub Pages in repo settings
```

**Full deployment guide**: See `DEPLOYMENT.md`

---

## 🐛 Common Issues

### Widget doesn't appear
- Check browser console for errors
- Verify `widget.js` and `widget.css` are loading
- Make sure you're running a local server (not opening HTML directly)

### Guides don't load
- Check that JSON files are in `guides/` folder
- Verify JSON is valid (use jsonlint.com)
- Check browser console for fetch errors

### Bookmarklet doesn't work
- Make sure you dragged it to bookmarks bar (don't click)
- Check you selected a guide first
- Some sites block external scripts (CSP policy)

### Styles are broken
- Verify `widget.css` is loading
- Check for CSS conflicts
- Clear browser cache

---

## 📱 Test on Mobile

1. Find your computer's IP address:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. On your phone's browser, visit:
   ```
   http://YOUR_IP:8000
   ```

3. Test the widget on mobile!

---

## 🎯 Next Steps

### Immediate (Before Launch):
1. ✅ Test all 5 guides thoroughly
2. ✅ Customize branding (colors, logo)
3. ✅ Test on different browsers
4. ✅ Test on mobile devices
5. ✅ Replace affiliate links with real ones

### Before Public Launch:
1. 📝 Add Google Analytics
2. 🔒 Create Privacy Policy & Terms
3. 📧 Set up support email
4. 📱 Create social media accounts
5. 🎥 Make a demo video

### After Launch:
1. 📣 Post on Product Hunt
2. 🐦 Share on Twitter
3. 💼 Post on LinkedIn
4. 📝 Write blog posts
5. 📊 Monitor analytics

---

## 💡 Tips for Success

1. **Start small**: Launch with 5 guides, add more based on demand
2. **Get feedback**: Share with friends before public launch
3. **Focus on quality**: Better to have 5 great guides than 20 mediocre ones
4. **Track metrics**: Which guides are most popular? Double down on those
5. **Build in public**: Share your progress on social media
6. **Be patient**: Building an audience takes time

---

## 📚 Documentation

- **README.md**: Complete documentation
- **DEPLOYMENT.md**: Deployment guide
- **QUICKSTART.md**: This file

---

## 🆘 Need Help?

1. Check browser console for errors
2. Read the README.md
3. Review DEPLOYMENT.md
4. Check that all files are in correct folders
5. Verify you're running a local server

---

## 🎉 You're Ready!

You now have a complete, production-ready MVP. Time to:

1. ✅ Test locally
2. ✅ Customize branding
3. ✅ Deploy to production
4. ✅ Launch and get users!

---

## 🌟 Make It Your Own

This is just the beginning. Here are ideas to expand:

- 🎨 Add dark mode
- 👥 User accounts
- 💾 Cloud sync
- 🔌 Browser extension
- 📱 Mobile app
- 🛍️ Premium guides
- 🤝 Team collaboration
- 📊 Analytics dashboard

---

**Good luck with your launch!** 🚀

If you find success, consider:
- ⭐ Starring the repo
- 🐦 Sharing on social media
- 📝 Writing about your experience

---

*Built with ❤️ using the GuideFloat MVP spec*

