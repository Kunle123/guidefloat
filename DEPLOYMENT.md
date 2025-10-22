# 🚀 GuideFloat Deployment Guide

This guide will help you deploy GuideFloat to production.

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure you've completed these steps:

- [ ] Tested all guides locally
- [ ] Updated all URLs from localhost to your production domain
- [ ] Replaced placeholder affiliate links with real ones
- [ ] Added your branding (logo, colors, etc.)
- [ ] Tested bookmarklet on multiple websites
- [ ] Checked mobile responsiveness
- [ ] Added Google Analytics (optional)
- [ ] Created privacy policy and terms of service
- [ ] Tested on multiple browsers

---

## 🌐 Deployment Options

### Option 1: GitHub Pages (Free, Easiest)

**Pros**: Free, easy to set up, automatic HTTPS  
**Cons**: No server-side code, limited to 100GB bandwidth/month

#### Steps:

1. **Create GitHub repository**
   ```bash
   cd GuideFloat
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**
   ```bash
   # Create repo on GitHub first, then:
   git remote add origin https://github.com/yourusername/guidefloat.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `(root)`
   - Click Save

4. **Your site will be live at:**
   ```
   https://yourusername.github.io/guidefloat/
   ```

5. **Update URLs in code**
   
   Edit these files and replace `https://guidefloat.com` with your GitHub Pages URL:
   
   - `index.html` (bookmarklet href)
   - `assets/js/bookmarklet.js` (baseUrl)
   - `assets/js/landing.js` (if needed)

6. **Commit and push changes**
   ```bash
   git add .
   git commit -m "Update URLs for GitHub Pages"
   git push
   ```

7. **Wait 2-3 minutes** for changes to deploy

#### Custom Domain (Optional)

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In GitHub repo settings → Pages → Custom domain
3. Enter your domain (e.g., `guidefloat.com`)
4. Add DNS records at your domain provider:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   
   Type: A
   Name: @
   Value: 185.199.109.153
   
   Type: A
   Name: @
   Value: 185.199.110.153
   
   Type: A
   Name: @
   Value: 185.199.111.153
   
   Type: CNAME
   Name: www
   Value: yourusername.github.io
   ```
5. Wait 24-48 hours for DNS propagation
6. Enable "Enforce HTTPS" in GitHub Pages settings

---

### Option 2: Vercel (Free, Fast)

**Pros**: Instant deployments, custom domain, great performance  
**Cons**: Learning curve if new to Vercel

#### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd GuideFloat
   vercel
   ```

3. **Follow prompts:**
   - Set up and deploy? Y
   - Which scope? (your account)
   - Link to existing project? N
   - Project name? guidefloat
   - Directory? ./
   - Override settings? N

4. **Your site is live!**
   Vercel will give you a URL like: `https://guidefloat.vercel.app`

5. **Add custom domain (optional)**
   ```bash
   vercel domains add guidefloat.com
   ```
   Then add DNS records as instructed

6. **Continuous deployment**
   - Push to GitHub
   - Import project in Vercel dashboard
   - Connect to GitHub repo
   - Auto-deploys on every push!

---

### Option 3: Netlify (Free, Easy)

**Pros**: Drag-and-drop deployment, form handling, serverless functions  
**Cons**: None for basic use

#### Steps:

1. **Create account** at [netlify.com](https://netlify.com)

2. **Drag and drop method:**
   - Zip your GuideFloat folder
   - Go to Netlify dashboard
   - Drag zip file onto "Sites" page
   - Done!

3. **Or connect to Git:**
   - Push code to GitHub
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository
   - Build settings: leave blank (static site)
   - Click "Deploy site"

4. **Custom domain:**
   - Site settings → Domain management
   - Add custom domain
   - Follow DNS instructions

---

### Option 4: Traditional Web Hosting

**Pros**: Full control, can add server-side features later  
**Cons**: Costs money, requires more setup

#### Steps:

1. **Choose hosting** (Bluehost, SiteGround, HostGator)
2. **Purchase shared hosting plan** ($3-10/month)
3. **Upload files via FTP:**
   - Use FileZilla or similar FTP client
   - Upload all GuideFloat files to `public_html/`
4. **Access at:** `https://yourdomain.com`

---

## 🔧 Post-Deployment Configuration

### 1. Update Bookmarklet URLs

After deployment, update the bookmarklet code with your production URL.

**In `index.html`**, update the bookmarklet link:
```html
<a href="javascript:(function(){if(document.getElementById('guidefloat-widget')){alert('GuideFloat is already running!');return;}var css=document.createElement('link');css.rel='stylesheet';css.href='https://YOUR-DOMAIN.com/widget.css';document.head.appendChild(css);var script=document.createElement('script');script.src='https://YOUR-DOMAIN.com/widget.js';script.onload=function(){GuideFloat.init({guideId:localStorage.getItem('guidefloat-current-guide')||null});};document.body.appendChild(script);})();">
```

### 2. Test the Bookmarklet

1. Visit your deployed site
2. Drag bookmarklet to your bookmarks bar
3. Choose a guide
4. Go to another website (e.g., google.com)
5. Click bookmarklet
6. Verify widget appears and works correctly

### 3. Set Up Analytics (Optional)

#### Google Analytics:

Add to `<head>` of `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Track guide starts in `widget.js`:
```javascript
// Add to loadGuide() function
if (typeof gtag !== 'undefined') {
    gtag('event', 'guide_started', {
        'guide_id': guideId
    });
}
```

### 4. Add Meta Tags for SEO

Add to `<head>` of `index.html`:
```html
<!-- SEO Meta Tags -->
<meta name="description" content="Step-by-step guides that float while you work. Complete complex business tasks with ease.">
<meta name="keywords" content="guides, tutorials, step-by-step, business, marketing">
<meta name="author" content="GuideFloat">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://yourdomain.com/">
<meta property="og:title" content="GuideFloat - Step-by-Step Guides That Float">
<meta property="og:description" content="Complete complex tasks with confidence using our floating guide widget.">
<meta property="og:image" content="https://yourdomain.com/assets/images/og-image.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://yourdomain.com/">
<meta property="twitter:title" content="GuideFloat - Step-by-Step Guides That Float">
<meta property="twitter:description" content="Complete complex tasks with confidence using our floating guide widget.">
<meta property="twitter:image" content="https://yourdomain.com/assets/images/og-image.png">
```

### 5. Create OG Image

Create a 1200x630px image for social media sharing:
- Include your logo and tagline
- Save as `assets/images/og-image.png`
- Update meta tags with correct path

---

## 🔒 Security Best Practices

1. **HTTPS Only**: Always use HTTPS (GitHub Pages, Vercel, Netlify do this automatically)

2. **Content Security Policy**: Add to `index.html`:
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; 
                  script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; 
                  style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com;
                  img-src 'self' data: https:;">
   ```

3. **Sanitize User Input**: If you add forms or user-generated content later, always sanitize inputs

4. **Rate Limiting**: If you add a backend, implement rate limiting on API endpoints

5. **Regular Updates**: Keep any dependencies updated (though this project has none currently)

---

## 📊 Monitor Performance

### Tools to Use:

1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
   - Check load times
   - Get optimization suggestions

2. **GTmetrix**: https://gtmetrix.com/
   - Detailed performance report
   - Track performance over time

3. **Google Search Console**: https://search.google.com/search-console
   - Submit sitemap
   - Monitor search rankings
   - See which queries bring traffic

### Optimization Tips:

- Minify CSS/JS files
- Compress images
- Enable gzip compression
- Use CDN for static assets
- Implement caching headers

---

## 🐛 Troubleshooting

### Bookmarklet doesn't work after deployment

**Problem**: URLs are still pointing to localhost  
**Solution**: Search all files for `localhost` and replace with production URL

### CSS/JS files not loading

**Problem**: 404 errors on widget.css or widget.js  
**Solution**: Check file paths are correct relative to root

### Widget appears but doesn't function

**Problem**: JavaScript errors in console  
**Solution**: Check browser console, verify all JS files loaded correctly

### Guides don't load

**Problem**: JSON files not found  
**Solution**: Verify `guides/` folder is deployed, check paths in widget.js

---

## 📞 Support After Deployment

Set up these channels:

1. **Email**: Create support@yourdomain.com
2. **Social Media**: Twitter, Facebook for updates
3. **Issue Tracker**: Enable GitHub Issues
4. **Documentation**: Link to README in footer

---

## 🎉 Launch Checklist

- [ ] Site is live and accessible
- [ ] All pages load without errors
- [ ] Bookmarklet works on test websites
- [ ] Mobile version looks good
- [ ] Forms work (if applicable)
- [ ] Analytics is tracking
- [ ] Social media accounts created
- [ ] Launch announcement prepared
- [ ] Support email is set up
- [ ] Backup system in place (GitHub acts as backup)

---

## 🚀 Next Steps After Launch

1. **Submit to Product Hunt**: Great for initial traffic
2. **Post on Reddit**: r/SideProject, r/Entrepreneur
3. **Share on Twitter/LinkedIn**: Use relevant hashtags
4. **Write a blog post**: Explain the problem you're solving
5. **Create demo video**: Loom or YouTube
6. **Email list**: Collect emails for updates
7. **SEO**: Write blog content to attract organic traffic

---

## 📈 Scaling Tips

As your site grows:

1. **Add more guides**: Create guides for popular topics
2. **User accounts**: Let users save progress across devices
3. **Premium guides**: Monetize with paid content
4. **API**: Allow developers to integrate your guides
5. **Browser extension**: Easier than bookmarklet
6. **Mobile app**: Native iOS/Android apps

---

**Questions?** 

Open an issue on GitHub or email support@yourdomain.com

Good luck with your launch! 🎉

