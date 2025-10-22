# 🚀 GuideFloat

**Step-by-step guides that float while you work**

GuideFloat is a floating, draggable widget that displays step-by-step guides for common business tasks. It works as a bookmarklet that users can activate on any webpage, staying visible while they complete tasks.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

---

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Adding New Guides](#adding-new-guides)
- [Customization](#customization)
- [Deployment](#deployment)
- [Browser Compatibility](#browser-compatibility)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Features

- **Floating Widget**: Draggable window that stays on top of other content
- **Minimizable**: Collapse to a small tab when not in use
- **Progress Tracking**: Automatically saves progress in browser localStorage
- **Step-by-Step Navigation**: Clear progression through complex tasks
- **Action Buttons**: Direct links to tools and resources needed for each step
- **Bookmarklet Activation**: Works on any website with one click
- **Mobile Responsive**: Adapts to different screen sizes
- **Affiliate Link Integration**: Built-in support for affiliate links

### Technical Features

- **Pure JavaScript**: No dependencies, lightweight and fast
- **LocalStorage**: Persistent progress tracking across sessions
- **Drag & Drop**: Smooth dragging experience for repositioning
- **Modern Design**: Clean UI with Tailwind CSS
- **SEO Friendly**: Search-optimized landing page
- **Easy to Deploy**: Static files, works on GitHub Pages, Vercel, Netlify

---

## 🎥 Demo

Visit the live demo: [https://guidefloat.com](https://guidefloat.com) *(replace with your actual URL)*

![GuideFloat Demo](assets/images/demo.gif) *(add a demo GIF/video)*

---

## 🚀 Installation

### Option 1: Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/guidefloat.git
   cd guidefloat
   ```

2. **Start a local server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server -p 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Option 2: Deploy to GitHub Pages

1. **Create a new GitHub repository**

2. **Push your code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/guidefloat.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Click Save

4. **Update URLs**
   - Replace all instances of `https://guidefloat.com` with your GitHub Pages URL
   - Files to update: `index.html`, `assets/js/landing.js`, `assets/js/bookmarklet.js`

### Option 3: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow prompts** to link to your account and deploy

---

## 📖 Usage

### For Users

1. **Visit the Landing Page**
   - Go to your GuideFloat website
   
2. **Install the Bookmarklet**
   - Drag the "GuideFloat Bookmarklet" button to your bookmarks bar
   
3. **Choose a Guide**
   - Browse available guides
   - Click "Start Guide" on any guide
   
4. **Use the Widget**
   - The widget appears on the page
   - Follow steps one by one
   - Check off completed steps
   - Progress is saved automatically
   
5. **Use on Any Website**
   - Click the bookmarklet on any website
   - Your current guide will appear
   - Continue where you left off

### Widget Controls

- **Drag Header**: Move the widget anywhere on screen
- **Minimize Button**: Collapse to small circle
- **Close Button**: Hide widget (progress is saved)
- **Checkboxes**: Mark steps as complete
- **Next/Previous**: Navigate between steps
- **Reset Progress**: Start guide over from beginning
- **Action Buttons**: Open relevant websites/tools

---

## 📁 File Structure

```
guidefloat/
│
├── index.html                 # Landing page (guide library)
├── widget.js                  # Main widget logic
├── widget.css                 # Widget styles
│
├── guides/                    # Guide data (JSON files)
│   ├── facebook-ads-setup.json
│   ├── shopify-store-setup.json
│   ├── mailchimp-campaign.json
│   ├── wordpress-website.json
│   └── google-analytics-setup.json
│
├── assets/
│   ├── css/
│   │   └── styles.css         # Landing page styles (if separate)
│   ├── js/
│   │   ├── landing.js         # Landing page logic
│   │   └── bookmarklet.js     # Bookmarklet code
│   └── images/
│       ├── logo.png
│       └── guide-thumbnails/
│
└── README.md                  # This file
```

---

## ➕ Adding New Guides

### Step 1: Create Guide JSON File

Create a new file in the `guides/` directory:

```json
{
  "id": "your-guide-id",
  "title": "Your Guide Title",
  "description": "Brief description of what this guide teaches",
  "category": "Marketing",
  "difficulty": "Beginner",
  "estimatedTime": "30 minutes",
  "totalSteps": 5,
  "steps": [
    {
      "id": 1,
      "title": "Step Title",
      "description": "What this step accomplishes",
      "instructions": "Detailed instructions for this step",
      "actionButtons": [
        {
          "text": "Button Text",
          "url": "https://example.com",
          "type": "affiliate"
        }
      ],
      "tips": [
        "Helpful tip 1",
        "Helpful tip 2"
      ],
      "estimatedTime": "5 minutes"
    }
  ],
  "resources": [
    {
      "title": "Additional Resource",
      "url": "https://example.com"
    }
  ],
  "affiliateDisclosure": "Affiliate disclosure text"
}
```

### Step 2: Add to Landing Page

Edit `assets/js/landing.js` and add your guide to the `guidesData` array:

```javascript
{
    id: 'your-guide-id',
    title: 'Your Guide Title',
    description: 'Brief description',
    category: 'marketing',
    difficulty: 'Beginner',
    estimatedTime: '30 minutes',
    totalSteps: 5,
    icon: '📱'
}
```

### Step 3: Test

1. Open your site
2. Find your guide in the library
3. Click "Start Guide"
4. Test all steps and buttons

---

## 🎨 Customization

### Change Colors

Edit color schemes in:

**Landing Page (index.html)**
```html
<style>
    .hero-gradient {
        background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
    }
</style>
```

**Widget (widget.css)**
```css
.guidefloat-header {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Change Logo

1. Replace `assets/images/logo.png` with your logo
2. Update the emoji (🚀) in `index.html` and `widget.js` if desired

### Modify Widget Size

In `widget.css`:
```css
#guidefloat-widget {
    width: 420px;  /* Change this */
    max-height: 85vh;  /* And this */
}
```

### Update Font

Add to `index.html` and `widget.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');

body {
    font-family: 'Your Font', sans-serif;
}
```

---

## 🌐 Deployment

### Update URLs Before Deployment

Before deploying, update these URLs with your production domain:

1. **index.html**: Update bookmarklet href
2. **assets/js/bookmarklet.js**: Update `baseUrl` variable
3. **assets/js/landing.js**: Update paths if needed

### Deploy to GitHub Pages

See [Installation - Option 2](#option-2-deploy-to-github-pages)

### Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Deploy (automatic)

### Deploy to Netlify

1. Push code to GitHub
2. New site from Git in Netlify
3. Select repository
4. Deploy

### Custom Domain

After deploying:

1. Purchase domain (Namecheap, GoDaddy, etc.)
2. Add custom domain in hosting settings
3. Update DNS records
4. Wait 24-48 hours for DNS propagation
5. Update all URLs in code to use custom domain

---

## 🌍 Browser Compatibility

Tested and working on:

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome)

**Note**: Some websites with strict Content Security Policies (CSP) may block the bookmarklet. This is a limitation of bookmarklets in general.

---

## 🔧 Troubleshooting

### Bookmarklet doesn't work

- Check browser console for errors
- Verify URLs are correct in bookmarklet code
- Some sites block external scripts (CSP)
- Try refreshing the page and clicking bookmarklet again

### Widget doesn't appear

- Check that widget.js and widget.css are loading
- Verify no JavaScript errors in console
- Check z-index isn't being overridden by page styles

### Progress not saving

- Verify localStorage is enabled in browser
- Check browser's privacy settings
- Private/Incognito mode may not persist localStorage

### Styles are broken

- Check that widget.css loaded successfully
- Verify no CSS conflicts with page styles
- Clear browser cache

---

## 📊 Analytics (Optional)

To track guide usage, you can add analytics:

### Google Analytics

1. Add GA tracking code to `index.html`
2. Track events in `widget.js`:
   ```javascript
   gtag('event', 'guide_started', {
       'guide_id': guideId
   });
   ```

### Custom Analytics

Update the `trackClick` function in `widget.js` to send data to your endpoint:

```javascript
trackClick: function(buttonId, url) {
    fetch('https://your-api.com/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            guideId: this.currentGuide.id,
            buttonId: buttonId,
            url: url,
            timestamp: new Date().toISOString()
        })
    });
}
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Ideas

- New guide templates
- Additional themes
- Improved mobile experience
- Browser extension version
- Backend for user accounts
- Guide analytics dashboard

---

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 GuideFloat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- Tailwind CSS for styling
- Font Awesome for icons
- The open-source community

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/guidefloat/issues)
- **Email**: support@guidefloat.com *(update with your email)*
- **Twitter**: [@guidefloat](https://twitter.com/guidefloat) *(update with your handle)*

---

## 🗺️ Roadmap

### Version 1.1 (Coming Soon)
- [ ] Dark mode support
- [ ] Export/import progress
- [ ] Share guides with team
- [ ] Custom guide creator

### Version 2.0
- [ ] User accounts
- [ ] Cloud sync
- [ ] Browser extension
- [ ] Mobile app
- [ ] Premium guides marketplace

---

## ⭐ Show Your Support

If you find GuideFloat helpful, please:

- ⭐ Star this repository
- 🐦 Share on Twitter
- 📝 Write a blog post
- 🎥 Make a video tutorial

---

Made with ❤️ by GuideFloat Team

*Last updated: October 2025*

