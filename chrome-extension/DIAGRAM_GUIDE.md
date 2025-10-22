# 📐 Layout Diagram Guide

How to create visual diagrams showing where actions happen on pages.

---

## 🎯 What Are Layout Diagrams?

Simple wireframe-style graphics that show:
- The page layout (simplified)
- Where the button/action is located
- What to look for

**Example:**
- Shows a sidebar on the left
- Main content area
- Highlighted button or area where action happens

---

## 📝 How to Add Diagrams

### In Your Guide JSON:

Add a `layoutDiagram` field to any step:

```json
{
  "id": 1,
  "title": "Click the Sign Up button",
  "instructions": "...",
  "layoutDiagram": "<svg>...your SVG code...</svg>",
  "tips": [...]
}
```

---

## 🎨 Creating SVG Diagrams

### Method 1: Use the Template (Easiest!)

Here's a simple template you can customize:

```xml
<svg viewBox='0 0 280 160' xmlns='http://www.w3.org/2000/svg'>
  <!-- Background -->
  <rect width='280' height='160' fill='#f9fafb' stroke='#e5e7eb' stroke-width='2'/>
  
  <!-- Page title -->
  <text x='140' y='25' text-anchor='middle' font-size='11' font-weight='bold' fill='#374151'>
    Page Name
  </text>
  
  <!-- Highlighted button (this is what user should click) -->
  <rect x='20' y='40' width='240' height='30' fill='#dbeafe' stroke='#3b82f6' stroke-width='2' rx='4'/>
  <text x='140' y='60' text-anchor='middle' font-size='10' fill='#1e40af'>
    Button Name
  </text>
  
  <!-- Other elements (grayed out) -->
  <rect x='20' y='80' width='240' height='15' fill='#f3f4f6' rx='2'/>
  <rect x='20' y='100' width='240' height='15' fill='#f3f4f6' rx='2'/>
  
  <!-- Help text at bottom -->
  <text x='140' y='140' text-anchor='middle' font-size='9' fill='#6b7280'>
    Look for the blue button at the top
  </text>
</svg>
```

### Method 2: Use Figma/Sketch

1. Create a 280x160px artboard
2. Draw simple rectangles for layout
3. Highlight the action area in color
4. Export as SVG
5. Copy the SVG code to your JSON

### Method 3: Use draw.io (Free!)

1. Go to https://app.diagrams.net
2. Create a simple layout (280x160)
3. Export as SVG
4. Copy the code

---

## 🎨 Color Guide

Use these colors for consistency:

```
Highlighted Button (Blue):
- Fill: #dbeafe
- Border: #3b82f6 (2px)
- Text: #1e40af

Highlighted Button (Green - for success):
- Fill: #dcfce7
- Border: #10b981 (2px)
- Text: #065f46

Highlighted Button (Yellow - for warning):
- Fill: #fef3c7
- Border: #f59e0b (2px)
- Text: #92400e

Gray Elements (non-active):
- Fill: #f3f4f6
- Border: #d1d5db

Background:
- Fill: #f9fafb
- Border: #e5e7eb

Text:
- Title: #374151 (bold, 11px)
- Labels: #6b7280 (9px)
- Button text: matches button color
```

---

## 📐 Layout Patterns

### Pattern 1: Simple Button on Page

```xml
<svg viewBox='0 0 280 160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='280' height='160' fill='#f9fafb' stroke='#e5e7eb' stroke-width='2'/>
  <text x='140' y='25' text-anchor='middle' font-size='11' font-weight='bold' fill='#374151'>Page Title</text>
  
  <!-- THE BUTTON TO CLICK -->
  <rect x='20' y='40' width='240' height='30' fill='#dbeafe' stroke='#3b82f6' stroke-width='2' rx='4'/>
  <text x='140' y='60' text-anchor='middle' font-size='10' fill='#1e40af'>Click This Button</text>
  
  <text x='140' y='140' text-anchor='middle' font-size='9' fill='#6b7280'>The button is near the top</text>
</svg>
```

### Pattern 2: Sidebar Navigation

```xml
<svg viewBox='0 0 280 160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='280' height='160' fill='#f9fafb' stroke='#e5e7eb' stroke-width='2'/>
  
  <!-- Sidebar -->
  <rect x='10' y='10' width='50' height='140' fill='#f3f4f6'/>
  <text x='35' y='25' text-anchor='middle' font-size='8' fill='#6b7280'>Menu</text>
  
  <!-- Highlighted menu item -->
  <rect x='15' y='35' width='40' height='12' fill='#dbeafe' stroke='#3b82f6' stroke-width='2' rx='2'/>
  <text x='35' y='43' text-anchor='middle' font-size='7' fill='#1e40af' font-weight='bold'>Settings</text>
  
  <!-- Main content area -->
  <rect x='70' y='10' width='200' height='140' fill='white' stroke='#e5e7eb'/>
  <text x='170' y='30' text-anchor='middle' font-size='10' font-weight='bold' fill='#374151'>Content Area</text>
</svg>
```

### Pattern 3: Top Right Button

```xml
<svg viewBox='0 0 280 160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='280' height='160' fill='#f9fafb' stroke='#e5e7eb' stroke-width='2'/>
  
  <!-- Header -->
  <rect x='10' y='10' width='260' height='25' fill='white' stroke='#e5e7eb'/>
  <text x='20' y='25' font-size='10' fill='#374151'>Logo</text>
  
  <!-- Button in top right -->
  <rect x='200' y='14' width='60' height='17' fill='#dcfce7' stroke='#10b981' stroke-width='2' rx='3'/>
  <text x='230' y='25' text-anchor='middle' font-size='8' fill='#065f46' font-weight='bold'>Sign Up</text>
  
  <text x='140' y='140' text-anchor='middle' font-size='9' fill='#6b7280'>Look for button in top-right corner</text>
</svg>
```

### Pattern 4: Form Field

```xml
<svg viewBox='0 0 280 160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='280' height='160' fill='#f9fafb' stroke='#e5e7eb' stroke-width='2'/>
  <text x='140' y='25' text-anchor='middle' font-size='11' font-weight='bold' fill='#374151'>Form Title</text>
  
  <!-- Regular field -->
  <rect x='40' y='40' width='200' height='20' fill='white' stroke='#d1d5db' rx='2'/>
  <text x='50' y='35' font-size='8' fill='#6b7280'>Name</text>
  
  <!-- Highlighted field -->
  <rect x='40' y='70' width='200' height='20' fill='#fef3c7' stroke='#f59e0b' stroke-width='2' rx='2'/>
  <text x='50' y='65' font-size='8' fill='#92400e' font-weight='bold'>Email (enter here)</text>
  
  <!-- Submit button -->
  <rect x='40' y='100' width='80' height='20' fill='#f3f4f6' rx='2'/>
  <text x='80' y='113' text-anchor='middle' font-size='9' fill='#6b7280'>Submit</text>
</svg>
```

---

## ✅ Quick Checklist

When creating diagrams:

- [ ] Keep it simple - show only what's needed
- [ ] Highlight the action area in color
- [ ] Other elements in gray (#f3f4f6)
- [ ] Add helpful text at bottom
- [ ] Use consistent colors
- [ ] Size: 280x160 viewBox
- [ ] Test in the extension!

---

## 🎯 Examples from Facebook Ads Guide

Check `guides/facebook-ads-setup.json` steps 1-3 for working examples!

---

## 💡 Tips

1. **Keep it simple** - Users should understand in 1 second
2. **Use color to guide** - Blue = click here, Gray = ignore
3. **Add context** - Show surrounding elements so they know where they are
4. **Test it** - Load in extension and see if it's clear

---

## 🚀 Quick Start

To add a diagram to any step:

1. Copy one of the patterns above
2. Customize the text and positions
3. Add to your step as `"layoutDiagram": "<svg>...code...</svg>"`
4. Reload extension
5. Test!

---

**Making guides visual = Much better user experience!** ✨

