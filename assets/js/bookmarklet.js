// GuideFloat Bookmarklet
// This file contains both the minified bookmarklet code and the source code

/**
 * BOOKMARKLET CODE (Minified)
 * 
 * To create a bookmarklet, users should drag this link to their bookmarks bar:
 * 
 * javascript:(function(){if(document.getElementById('guidefloat-widget')){alert('GuideFloat is already running!');return;}var css=document.createElement('link');css.rel='stylesheet';css.href='https://guidefloat.com/widget.css';document.head.appendChild(css);var script=document.createElement('script');script.src='https://guidefloat.com/widget.js';script.onload=function(){GuideFloat.init({guideId:localStorage.getItem('guidefloat-current-guide')||null});};document.body.appendChild(script);})();
 * 
 * Note: Replace 'https://guidefloat.com' with your actual domain
 */

/**
 * SOURCE CODE (Readable version)
 * 
 * This is the expanded, readable version of the bookmarklet code.
 * Use this for understanding and modifications.
 */

(function() {
    // Check if GuideFloat widget already exists
    if (document.getElementById('guidefloat-widget')) {
        alert('GuideFloat is already running!');
        return;
    }
    
    // Base URL for GuideFloat resources
    // IMPORTANT: Change this to your production domain
    var baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? window.location.origin 
        : 'https://guidefloat.com';
    
    // Inject CSS
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = baseUrl + '/widget.css';
    document.head.appendChild(css);
    
    // Inject JavaScript
    var script = document.createElement('script');
    script.src = baseUrl + '/widget.js';
    
    // Initialize widget when script loads
    script.onload = function() {
        if (window.GuideFloat) {
            GuideFloat.init({
                guideId: localStorage.getItem('guidefloat-current-guide') || null
            });
        } else {
            alert('Failed to load GuideFloat. Please try again.');
        }
    };
    
    // Handle script loading errors
    script.onerror = function() {
        alert('Failed to load GuideFloat. Please check your internet connection and try again.');
    };
    
    document.body.appendChild(script);
})();

/**
 * DEVELOPMENT VERSION (for testing locally)
 * 
 * This version detects localhost and uses local resources.
 * Perfect for testing before deploying.
 * 
 * javascript:(function(){if(document.getElementById('guidefloat-widget')){alert('GuideFloat is already running!');return;}var baseUrl=window.location.hostname==='localhost'||window.location.hostname==='127.0.0.1'?window.location.origin:'https://guidefloat.com';var css=document.createElement('link');css.rel='stylesheet';css.href=baseUrl+'/widget.css';document.head.appendChild(css);var script=document.createElement('script');script.src=baseUrl+'/widget.js';script.onload=function(){if(window.GuideFloat){GuideFloat.init({guideId:localStorage.getItem('guidefloat-current-guide')||null});}else{alert('Failed to load GuideFloat.');}};script.onerror=function(){alert('Failed to load GuideFloat. Please check your connection.');};document.body.appendChild(script);})();
 */

/**
 * HOW TO USE THIS BOOKMARKLET
 * 
 * For Users:
 * 1. Go to your GuideFloat landing page
 * 2. Drag the "GuideFloat Bookmarklet" button to your bookmarks bar
 * 3. Choose a guide from the library (this saves it to localStorage)
 * 4. Go to any website where you need to follow the guide
 * 5. Click the bookmarklet in your bookmarks bar
 * 6. The guide widget appears and you can follow along!
 * 
 * For Developers:
 * 1. Update the baseUrl in the code above to your production domain
 * 2. Minify the code using a JavaScript minifier
 * 3. Add "javascript:" prefix to make it a bookmarklet URL
 * 4. Add the bookmarklet to your landing page as an <a> href
 */

/**
 * BOOKMARKLET BEST PRACTICES
 * 
 * 1. Keep code small - browsers have URL length limits
 * 2. Use HTTPS for security
 * 3. Include error handling
 * 4. Check for conflicts with existing page JavaScript
 * 5. Namespace your code to avoid variable collisions
 * 6. Test on multiple websites
 * 7. Handle edge cases (no internet, script blocked, etc.)
 */

/**
 * TROUBLESHOOTING
 * 
 * Problem: Bookmarklet doesn't work on some sites
 * Solution: Some sites use Content Security Policy (CSP) that blocks external scripts.
 *           Consider creating a browser extension as an alternative.
 * 
 * Problem: Styles are broken
 * Solution: Check that widget.css is loading correctly. Check browser console for errors.
 * 
 * Problem: Widget doesn't appear
 * Solution: Check browser console for JavaScript errors. Verify widget.js is loading.
 * 
 * Problem: Widget conflicts with site's existing code
 * Solution: Increase z-index in widget.css, use more specific CSS selectors.
 */

// Export for testing purposes (if using as a module)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        bookmarkletCode: "javascript:(function(){if(document.getElementById('guidefloat-widget')){alert('GuideFloat is already running!');return;}var css=document.createElement('link');css.rel='stylesheet';css.href='https://guidefloat.com/widget.css';document.head.appendChild(css);var script=document.createElement('script');script.src='https://guidefloat.com/widget.js';script.onload=function(){GuideFloat.init({guideId:localStorage.getItem('guidefloat-current-guide')||null});};document.body.appendChild(script);})();"
    };
}

