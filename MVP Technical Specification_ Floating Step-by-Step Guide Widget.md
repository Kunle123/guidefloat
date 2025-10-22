# MVP Technical Specification: Floating Step-by-Step Guide Widget

**Project Name:** GuideFloat (working title)

**Version:** 1.0 MVP

**Target Completion:** 2-4 weeks

---

## Project Overview

Build a floating, draggable widget that displays step-by-step guides for common business tasks (like setting up Facebook Ads, creating a Shopify store, etc.). The widget should work as a bookmarklet that users can activate on any webpage, staying visible while they complete tasks. Each step includes instructions, action buttons (with affiliate links), and checkboxes to track progress.

---

## Core Requirements

### Must-Have Features (MVP)

1. **Floating Widget UI**
   - Draggable window that stays on top of other content
   - Minimizable/expandable
   - Resizable (optional for MVP)
   - Persists across page navigation
   - Clean, modern design

2. **Step-by-Step Guide Display**
   - Show one step at a time with option to see all steps
   - Progress indicator (e.g., "Step 3 of 15")
   - Checkbox to mark step complete
   - "Next" and "Previous" navigation buttons
   - Collapsible step details

3. **Guide Library**
   - Landing page with list of available guides
   - Search/filter functionality
   - Guide categories (Marketing, Website Setup, Email, etc.)
   - Click to activate guide → launches widget

4. **Progress Tracking**
   - Save progress in browser localStorage
   - Resume where user left off
   - Show completion percentage
   - "Reset Progress" option

5. **Bookmarklet Activation**
   - One-click bookmarklet to launch widget
   - Works on any website
   - Loads guide data from your server

6. **Affiliate Link Integration**
   - Action buttons with affiliate links
   - Track clicks (for analytics)
   - Open in new tab (don't lose progress)

---

## Technical Architecture

### Tech Stack Recommendation

**Frontend:**
- **HTML/CSS/JavaScript** (vanilla JS or React)
- **Tailwind CSS** for styling (fast, modern)
- **LocalStorage API** for progress tracking
- **Fetch API** for loading guide data

**Backend:**
- **Static JSON files** (for MVP, no database needed)
- **GitHub Pages** or **Vercel** for hosting (free)
- **Optional:** Simple Node.js/Express server if you need analytics

**Why this stack:**
- Fast to build
- Free to host
- Easy to maintain
- Scalable later

### Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│           User's Browser (Any Website)          │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │     Floating Widget (Injected via JS)    │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │  Step 3 of 15: Create Ad Account   │  │  │
│  │  │  ☐ Click "Create Account" below    │  │  │
│  │  │  [Open Facebook Ads] [Next Step]   │  │  │
│  │  └────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
│                      ↓                          │
│              localStorage (Progress)            │
└─────────────────────────────────────────────────┘
                       ↓
              Fetch guide data from:
┌─────────────────────────────────────────────────┐
│        Your Server (GitHub Pages/Vercel)        │
│  ┌──────────────────────────────────────────┐  │
│  │  Landing Page (guidefloat.com)           │  │
│  │  - Browse guides                         │  │
│  │  - Search guides                         │  │
│  │  - Get bookmarklet                       │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │  Guide Data (JSON files)                 │  │
│  │  - facebook-ads-setup.json               │  │
│  │  - shopify-store-setup.json              │  │
│  │  - mailchimp-campaign.json               │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## Detailed Feature Specifications

### 1. Floating Widget Component

**Visual Design:**

```
┌─────────────────────────────────────────────┐
│ 🚀 Facebook Ads Setup Guide        [─] [×] │ ← Header (draggable)
├─────────────────────────────────────────────┤
│ Progress: Step 3 of 15                      │
│ ████████░░░░░░░░░░░░░░░░░░░░░░ 20%         │ ← Progress bar
├─────────────────────────────────────────────┤
│                                             │
│ ☐ Step 1: Set up Business Manager          │ ← Completed steps (collapsed)
│ ☐ Step 2: Connect Facebook Page            │
│                                             │
│ ▼ Step 3: Create Ad Account                │ ← Current step (expanded)
│                                             │
│   In Facebook Business Manager, click       │
│   "Business Settings" → "Accounts" →        │
│   "Ad Accounts" → "Add".                    │
│                                             │
│   [Open Facebook Business Manager] 🔗       │ ← Action button (affiliate link)
│                                             │
│   ☐ Mark this step as complete              │ ← Checkbox
│                                             │
│ ☐ Step 4: Add Payment Method               │ ← Upcoming steps (collapsed)
│ ☐ Step 5: Install Facebook Pixel           │
│                                             │
│ [◀ Previous]              [Next Step ▶]     │ ← Navigation
│                                             │
│ [Minimize] [Reset Progress] [Close Guide]  │ ← Actions
└─────────────────────────────────────────────┘
```

**Technical Requirements:**

```javascript
// Widget must be:
- Position: fixed (stays in viewport)
- Z-index: 999999 (on top of everything)
- Width: 400px (desktop), 90% (mobile)
- Max-height: 80vh (scrollable content)
- Draggable: Yes (via mouse/touch)
- Shadow: Large drop shadow for depth
- Border-radius: 12px (modern look)
```

**Key Interactions:**

1. **Drag to move:** Click and hold header, drag anywhere
2. **Minimize:** Collapses to small tab on side of screen
3. **Close:** Removes widget, saves progress
4. **Mark complete:** Checkbox → step collapses, moves to next
5. **Action button:** Opens link in new tab, tracks click

### 2. Guide Data Structure (JSON)

**File:** `guides/facebook-ads-setup.json`

```json
{
  "id": "facebook-ads-setup",
  "title": "Facebook Ads Setup Guide",
  "description": "Complete step-by-step guide to setting up Facebook Ads from scratch",
  "category": "Marketing",
  "difficulty": "Beginner",
  "estimatedTime": "45 minutes",
  "totalSteps": 15,
  "steps": [
    {
      "id": 1,
      "title": "Set up Facebook Business Manager",
      "description": "Facebook Business Manager is required to run professional ads and track results properly.",
      "instructions": "Go to business.facebook.com and click 'Create Account'. Enter your business name, your name, and business email. Click 'Submit'.",
      "actionButtons": [
        {
          "text": "Open Facebook Business Manager",
          "url": "https://business.facebook.com?ref=guidefloat",
          "type": "affiliate",
          "affiliateId": "your-affiliate-id"
        }
      ],
      "tips": [
        "Use your business email, not personal",
        "Have your business details ready"
      ],
      "estimatedTime": "5 minutes",
      "videoUrl": "https://youtube.com/watch?v=example",
      "imageUrl": "https://yoursite.com/images/fb-business-manager.png"
    },
    {
      "id": 2,
      "title": "Connect Your Facebook Page",
      "description": "Your ads will run from this page, and people will click through to learn about you.",
      "instructions": "In Business Manager, click 'Business Settings' → 'Accounts' → 'Pages' → 'Add'. If you have a page, claim it. If not, create a new page.",
      "actionButtons": [
        {
          "text": "Go to Business Settings",
          "url": "https://business.facebook.com/settings?ref=guidefloat",
          "type": "affiliate"
        }
      ],
      "tips": [
        "Use a professional profile photo",
        "Add a cover photo that represents your brand"
      ],
      "estimatedTime": "5 minutes"
    }
    // ... more steps
  ],
  "resources": [
    {
      "title": "Facebook Ads Official Guide",
      "url": "https://facebook.com/business/ads"
    }
  ],
  "affiliateDisclosure": "This guide contains affiliate links. We may earn a commission if you sign up through our links, at no extra cost to you."
}
```

### 3. Landing Page (Guide Library)

**URL:** `https://guidefloat.com` or `https://yourname.github.io/guidefloat`

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  🚀 GuideFloat                      [Search...] [Login] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Step-by-step guides that float while you work          │
│                                                         │
│  [Get Bookmarklet] ← Drag this to your bookmarks bar   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Categories:  [All] [Marketing] [Website] [Email]      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ 📱 Facebook Ads  │  │ 🛒 Shopify Store │            │
│  │ Setup            │  │ Setup            │            │
│  │                  │  │                  │            │
│  │ 15 steps         │  │ 12 steps         │            │
│  │ 45 mins          │  │ 30 mins          │            │
│  │ Beginner         │  │ Beginner         │            │
│  │                  │  │                  │            │
│  │ [Start Guide →]  │  │ [Start Guide →]  │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ 📧 Mailchimp     │  │ 🌐 WordPress     │            │
│  │ Campaign         │  │ Website          │            │
│  │ [Start Guide →]  │  │ [Start Guide →]  │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**

1. **Search bar:** Filter guides by keyword
2. **Category filter:** Marketing, Website, Email, E-commerce, etc.
3. **Guide cards:** Show title, description, steps, time, difficulty
4. **"Start Guide" button:** Launches widget with that guide
5. **Bookmarklet:** Drag-to-bookmark button at top

### 4. Bookmarklet Code

**What is a bookmarklet?**
A bookmark that contains JavaScript code. When clicked, it executes the code on the current page.

**Bookmarklet Code:**

```javascript
javascript:(function(){
  // Check if widget already exists
  if(document.getElementById('guidefloat-widget')){
    alert('GuideFloat is already running!');
    return;
  }
  
  // Inject CSS
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://guidefloat.com/widget.css';
  document.head.appendChild(css);
  
  // Inject JavaScript
  var script = document.createElement('script');
  script.src = 'https://guidefloat.com/widget.js';
  script.onload = function(){
    // Initialize widget
    GuideFloat.init({
      guideId: localStorage.getItem('guidefloat-current-guide') || null
    });
  };
  document.body.appendChild(script);
})();
```

**How users get it:**

1. Go to your landing page
2. Drag the "Get GuideFloat" button to their bookmarks bar
3. Click it on any page to launch the widget

### 5. Progress Tracking (LocalStorage)

**Data Structure:**

```javascript
// Stored in localStorage
{
  "guidefloat-current-guide": "facebook-ads-setup",
  "guidefloat-progress": {
    "facebook-ads-setup": {
      "currentStep": 3,
      "completedSteps": [1, 2],
      "startedAt": "2025-10-22T10:30:00Z",
      "lastUpdated": "2025-10-22T11:15:00Z"
    },
    "shopify-store-setup": {
      "currentStep": 1,
      "completedSteps": [],
      "startedAt": "2025-10-21T14:00:00Z",
      "lastUpdated": "2025-10-21T14:05:00Z"
    }
  },
  "guidefloat-settings": {
    "widgetPosition": { "x": 100, "y": 100 },
    "theme": "light"
  }
}
```

**Key Functions:**

```javascript
// Save progress
function saveProgress(guideId, stepId, completed) {
  let progress = JSON.parse(localStorage.getItem('guidefloat-progress') || '{}');
  
  if (!progress[guideId]) {
    progress[guideId] = {
      currentStep: stepId,
      completedSteps: [],
      startedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  }
  
  if (completed && !progress[guideId].completedSteps.includes(stepId)) {
    progress[guideId].completedSteps.push(stepId);
  }
  
  progress[guideId].currentStep = stepId;
  progress[guideId].lastUpdated = new Date().toISOString();
  
  localStorage.setItem('guidefloat-progress', JSON.stringify(progress));
}

// Load progress
function loadProgress(guideId) {
  let progress = JSON.parse(localStorage.getItem('guidefloat-progress') || '{}');
  return progress[guideId] || null;
}

// Reset progress
function resetProgress(guideId) {
  let progress = JSON.parse(localStorage.getItem('guidefloat-progress') || '{}');
  delete progress[guideId];
  localStorage.setItem('guidefloat-progress', JSON.stringify(progress));
}
```

---

## File Structure

```
guidefloat/
│
├── index.html                 # Landing page (guide library)
├── widget.html                # Widget UI (loaded via iframe or injected)
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
│   │   └── styles.css         # Landing page styles
│   ├── js/
│   │   ├── landing.js         # Landing page logic
│   │   └── bookmarklet.js     # Bookmarklet code
│   └── images/
│       ├── logo.png
│       └── guide-thumbnails/
│
└── README.md
```

---

## Implementation Steps (For AI)

### Step 1: Create Landing Page (index.html)

**Prompt for AI:**

```
Create a modern landing page for GuideFloat with:
- Hero section with headline "Step-by-step guides that float while you work"
- Prominent bookmarklet button (drag to bookmarks bar)
- Grid of guide cards (4 columns on desktop, 1 on mobile)
- Each card shows: title, description, number of steps, estimated time, difficulty, "Start Guide" button
- Search bar to filter guides
- Category filter buttons (All, Marketing, Website, Email, E-commerce)
- Clean, modern design using Tailwind CSS
- Responsive (mobile-first)
- Footer with affiliate disclosure

Use this color scheme:
- Primary: #3B82F6 (blue)
- Secondary: #10B981 (green)
- Background: #F9FAFB (light gray)
- Text: #1F2937 (dark gray)
```

### Step 2: Create Widget UI (widget.html + widget.css)

**Prompt for AI:**

```
Create a floating widget component with:
- Fixed position, draggable header
- Width: 400px (desktop), 90% (mobile)
- Max-height: 80vh with scrollable content
- Header: Guide title, minimize button, close button
- Progress bar showing current step / total steps
- Step list: completed steps (collapsed), current step (expanded), upcoming steps (collapsed)
- Each step has: checkbox, title, description, action buttons, tips
- Navigation buttons: Previous, Next
- Action buttons at bottom: Minimize, Reset Progress, Close Guide
- Large drop shadow, rounded corners (12px)
- Z-index: 999999 (on top of everything)
- Smooth animations (fade in/out, expand/collapse)

Make it draggable using vanilla JavaScript (no libraries).
```

### Step 3: Create Widget Logic (widget.js)

**Prompt for AI:**

```
Create the main widget JavaScript with these functions:

1. GuideFloat.init(options)
   - Load guide data from JSON file
   - Check localStorage for saved progress
   - Render widget on page
   - Set up event listeners

2. GuideFloat.loadGuide(guideId)
   - Fetch guide JSON from /guides/{guideId}.json
   - Parse and store guide data
   - Render first step (or resume from saved progress)

3. GuideFloat.renderStep(stepId)
   - Display step content
   - Show/hide action buttons
   - Update progress bar
   - Mark completed steps

4. GuideFloat.nextStep()
   - Mark current step as complete
   - Move to next step
   - Save progress to localStorage

5. GuideFloat.previousStep()
   - Go back to previous step
   - Don't unmark as complete

6. GuideFloat.toggleMinimize()
   - Collapse widget to small tab on side
   - Expand back to full size

7. GuideFloat.close()
   - Save progress
   - Remove widget from DOM

8. GuideFloat.resetProgress()
   - Confirm with user
   - Clear localStorage for this guide
   - Restart from step 1

9. GuideFloat.trackClick(buttonId, url)
   - Log affiliate link click (for analytics)
   - Open URL in new tab

10. GuideFloat.makeDraggable(element)
    - Enable drag-and-drop for widget
    - Save position to localStorage

Use vanilla JavaScript (no jQuery). Make it work in all modern browsers.
```

### Step 4: Create Sample Guide Data

**Prompt for AI:**

```
Create 5 sample guide JSON files following this structure:

1. facebook-ads-setup.json (15 steps)
2. shopify-store-setup.json (12 steps)
3. mailchimp-campaign.json (10 steps)
4. wordpress-website.json (14 steps)
5. google-analytics-setup.json (8 steps)

Each guide should have:
- Realistic, detailed step-by-step instructions
- Action buttons with placeholder affiliate links
- Tips for each step
- Estimated time per step
- Total estimated time
- Difficulty level (Beginner/Intermediate/Advanced)

Make the instructions clear and actionable, as if you're teaching someone who's never done this before.
```

### Step 5: Create Bookmarklet

**Prompt for AI:**

```
Create a bookmarklet that:
1. Checks if GuideFloat is already running (prevent duplicates)
2. Injects widget.css into the page
3. Injects widget.js into the page
4. Initializes GuideFloat with saved guide (if any)
5. Shows error message if injection fails

Minify the JavaScript so it works as a bookmarklet URL.

Also create a landing page section that explains:
- What a bookmarklet is
- How to install it (drag to bookmarks bar)
- How to use it (click on any page)
- Include a demo GIF or video
```

### Step 6: Add Analytics (Optional for MVP)

**Prompt for AI:**

```
Add simple analytics tracking:
1. Track guide starts (which guide, when)
2. Track step completions
3. Track affiliate link clicks
4. Track guide completions

Use a simple approach:
- Send data to a Google Sheet via Google Apps Script webhook
- Or use a free analytics service like Plausible or Umami
- Or just log to console for MVP (add real analytics later)

Don't use Google Analytics (too heavy for MVP).
```

### Step 7: Deploy to GitHub Pages

**Prompt for AI:**

```
Create deployment instructions for GitHub Pages:
1. Create new GitHub repository
2. Push all files
3. Enable GitHub Pages in settings
4. Set custom domain (optional)
5. Update all URLs in code to use production domain

Also create a README.md with:
- Project description
- How to run locally
- How to add new guides
- How to customize
- License (MIT)
```

---

## Testing Checklist

Before launching, test:

- [ ] Widget loads on different websites (Google, Facebook, Reddit, etc.)
- [ ] Widget is draggable and stays in position
- [ ] Progress saves and resumes correctly
- [ ] All buttons work (Next, Previous, Action buttons)
- [ ] Minimize/maximize works
- [ ] Close and reopen maintains progress
- [ ] Reset progress works
- [ ] Affiliate links open in new tab
- [ ] Mobile responsive (test on phone)
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] No conflicts with existing page JavaScript
- [ ] Bookmarklet installs and works correctly

---

## Launch Checklist

- [ ] Create 5 high-quality guides
- [ ] Sign up for affiliate programs (Shopify, Mailchimp, etc.)
- [ ] Replace placeholder affiliate links with real ones
- [ ] Add affiliate disclosure on landing page
- [ ] Deploy to production (GitHub Pages or Vercel)
- [ ] Test on multiple devices and browsers
- [ ] Create demo video (Loom or similar)
- [ ] Write launch post for Product Hunt
- [ ] Prepare social media posts (Twitter, LinkedIn, Reddit)
- [ ] Set up basic analytics
- [ ] Create email capture for updates (optional)

---

## Future Enhancements (Post-MVP)

**Phase 2 Features:**
- User accounts (save progress across devices)
- Custom guide creation (users can make their own)
- Mobile app version
- Browser extension (easier than bookmarklet)
- Video tutorials embedded in steps
- Community features (comments, ratings)
- Premium guides (paid)
- White-label version for agencies

**Phase 3 Features:**
- AI-powered guide generation
- Integration with Zapier/Make
- API for third-party developers
- Marketplace for guide creators
- Advanced analytics dashboard
- A/B testing for affiliate links

---

## Estimated Development Time

| Task | Time Estimate |
|------|---------------|
| Landing page | 4-6 hours |
| Widget UI | 6-8 hours |
| Widget logic | 8-12 hours |
| Guide data (5 guides) | 4-6 hours |
| Bookmarklet | 2-3 hours |
| Testing & bug fixes | 4-6 hours |
| Deployment | 2-3 hours |
| **Total** | **30-44 hours** |

**Timeline:** 1-2 weeks if working full-time, 2-4 weeks if part-time

---

## Success Metrics (First 30 Days)

- [ ] 100+ users activate bookmarklet
- [ ] 50+ guides started
- [ ] 10+ guides completed
- [ ] 5+ affiliate conversions
- [ ] 20+ returning users
- [ ] Average session: 15+ minutes
- [ ] Product Hunt: 100+ upvotes

---

## Questions to Answer Before Building

1. **What's your primary goal?**
   - Validate the concept quickly?
   - Build a sustainable business?
   - Sell to a larger company?

2. **How much time can you invest?**
   - Full-time (1-2 weeks to MVP)
   - Part-time (2-4 weeks to MVP)
   - Weekends only (4-6 weeks to MVP)

3. **Do you want to code it yourself or hire?**
   - DIY: Use this spec with AI coding assistant
   - Hire: Budget $2,000-$5,000 for developer

4. **Which guides should you create first?**
   - Pick 5 with highest search volume
   - Pick 5 with best affiliate programs
   - Pick 5 you're most knowledgeable about

---

## Resources & Tools

**Design:**
- Figma (free) - Design mockups
- Tailwind CSS - Fast styling
- Heroicons - Free icons

**Development:**
- VS Code - Code editor
- GitHub - Version control & hosting
- Vercel - Alternative hosting (faster than GitHub Pages)

**Testing:**
- BrowserStack - Test on different browsers
- Lighthouse - Performance testing
- GTmetrix - Speed testing

**Analytics:**
- Plausible - Privacy-friendly analytics
- Umami - Self-hosted analytics
- Google Sheets - Simple tracking

**Affiliate Programs:**
- Shopify Partners - $150 per referral
- Mailchimp - 30% recurring
- Bluehost - $65-130 per sale
- ConvertKit - 30% recurring

---

This specification is complete and ready to be given to an AI coding assistant (Claude, ChatGPT, Cursor, etc.) to build the MVP. Each section can be used as a separate prompt, or you can give the entire document at once.

Would you like me to also create the actual prompts formatted specifically for Claude/ChatGPT, or help you get started with building it?

