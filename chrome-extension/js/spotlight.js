// GuideFloat Spotlight - Visual indicator showing where to interact on the page

const Spotlight = {
    activeSpotlight: null,
    activeDialog: null,
    
    // Create and position spotlight
    create: function(options) {
        // Remove any existing spotlight
        this.remove();
        
        const {
            target,        // CSS selector or coordinates
            message,       // What to tell the user
            type = 'info', // info, warning, success
            position = 'auto' // auto, top, bottom, left, right
        } = options;
        
        console.log('[Spotlight] Creating spotlight:', options);
        
        // Find target element if selector provided
        let targetElement = null;
        let targetRect = null;
        
        if (typeof target === 'string') {
            targetElement = document.querySelector(target);
            if (!targetElement) {
                console.warn('[Spotlight] Target element not found:', target);
                
                // Try multiple fallback selectors for common patterns
                const fallbackSelectors = [
                    'button[type="submit"]',
                    'button[type="button"]',
                    'input[type="submit"]',
                    'a[role="button"]',
                    'button',
                    'a[href*="signup"]',
                    'a[href*="create"]',
                    'a[href*="next"]',
                    'a[href*="continue"]'
                ];
                
                let foundElement = null;
                for (const selector of fallbackSelectors) {
                    try {
                        foundElement = document.querySelector(selector);
                        if (foundElement) {
                            console.log('[Spotlight] Found fallback element:', selector);
                            targetElement = foundElement;
                            break;
                        }
                    } catch (e) {
                        // Skip invalid selectors
                        continue;
                    }
                }
                
                if (!targetElement) {
                    // Try waiting a bit for dynamic content
                    setTimeout(() => {
                        const retryElement = document.querySelector(target);
                        if (retryElement) {
                            this.create(options);
                        } else {
                            console.log('[Spotlight] No suitable target found, showing general guidance');
                            // Show a general guidance message instead of specific targeting
                            this.showGeneralGuidance(message);
                        }
                    }, 2000);
                    return;
                }
            }
            targetRect = targetElement.getBoundingClientRect();
        } else if (target && target.x !== undefined && target.y !== undefined) {
            // Use provided coordinates
            targetRect = {
                x: target.x,
                y: target.y,
                width: 0,
                height: 0,
                top: target.y,
                left: target.x,
                right: target.x,
                bottom: target.y
            };
        } else {
            console.error('[Spotlight] Invalid target:', target);
            return;
        }
        
        // Create bouncing dot
        const dot = document.createElement('div');
        dot.className = 'guidefloat-spotlight-dot';
        dot.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: #667eea;
            border-radius: 50%;
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
            z-index: 2147483646;
            pointer-events: none;
            animation: guidefloat-pulse 1.5s infinite, guidefloat-bounce 2s infinite;
            top: ${targetRect.top + targetRect.height / 2 - 10}px;
            left: ${targetRect.left + targetRect.width / 2 - 10}px;
        `;
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes guidefloat-pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
                }
                50% {
                    box-shadow: 0 0 0 20px rgba(102, 126, 234, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
                }
            }
            
            @keyframes guidefloat-bounce {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-10px);
                }
            }
            
            .guidefloat-spotlight-dialog {
                animation: guidefloat-dialog-in 0.3s ease-out;
            }
            
            @keyframes guidefloat-dialog-in {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
        `;
        
        // Create floating dialog
        const dialog = document.createElement('div');
        dialog.className = 'guidefloat-spotlight-dialog';
        
        const typeColors = {
            info: { bg: '#667eea', border: '#5a67d8' },
            warning: { bg: '#f59e0b', border: '#d97706' },
            success: { bg: '#10b981', border: '#059669' }
        };
        
        const colors = typeColors[type] || typeColors.info;
        
        dialog.style.cssText = `
            position: fixed;
            max-width: 280px;
            background: white;
            border: 2px solid ${colors.border};
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 2147483646;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #1a1a1a;
        `;
        
        // Create arrow
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            border: 8px solid transparent;
        `;
        
        // Position dialog relative to target
        const dialogPadding = 20;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Auto-determine best position
        let finalPosition = position;
        if (position === 'auto') {
            // Prefer right, then left, then bottom, then top
            if (targetRect.right + 300 < viewportWidth) {
                finalPosition = 'right';
            } else if (targetRect.left - 300 > 0) {
                finalPosition = 'left';
            } else if (targetRect.bottom + 150 < viewportHeight) {
                finalPosition = 'bottom';
            } else {
                finalPosition = 'top';
            }
        }
        
        // Position dialog and arrow
        switch (finalPosition) {
            case 'right':
                dialog.style.left = `${targetRect.right + dialogPadding}px`;
                dialog.style.top = `${targetRect.top + targetRect.height / 2}px`;
                dialog.style.transform = 'translateY(-50%)';
                arrow.style.left = '-16px';
                arrow.style.top = '50%';
                arrow.style.transform = 'translateY(-50%)';
                arrow.style.borderRightColor = colors.border;
                break;
            case 'left':
                dialog.style.right = `${viewportWidth - targetRect.left + dialogPadding}px`;
                dialog.style.top = `${targetRect.top + targetRect.height / 2}px`;
                dialog.style.transform = 'translateY(-50%)';
                arrow.style.right = '-16px';
                arrow.style.top = '50%';
                arrow.style.transform = 'translateY(-50%)';
                arrow.style.borderLeftColor = colors.border;
                break;
            case 'bottom':
                dialog.style.left = `${targetRect.left + targetRect.width / 2}px`;
                dialog.style.top = `${targetRect.bottom + dialogPadding}px`;
                dialog.style.transform = 'translateX(-50%)';
                arrow.style.left = '50%';
                arrow.style.top = '-16px';
                arrow.style.transform = 'translateX(-50%)';
                arrow.style.borderBottomColor = colors.border;
                break;
            case 'top':
                dialog.style.left = `${targetRect.left + targetRect.width / 2}px`;
                dialog.style.bottom = `${viewportHeight - targetRect.top + dialogPadding}px`;
                dialog.style.transform = 'translateX(-50%)';
                arrow.style.left = '50%';
                arrow.style.bottom = '-16px';
                arrow.style.transform = 'translateX(-50%)';
                arrow.style.borderTopColor = colors.border;
                break;
        }
        
        // Add content
        const typeEmoji = {
            info: '💡',
            warning: '⚠️',
            success: '✅'
        };
        
        dialog.innerHTML = `
            <div style="display: flex; align-items: start; gap: 8px;">
                <div style="font-size: 20px; line-height: 1;">${typeEmoji[type]}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px; color: ${colors.bg};">
                        Next Step
                    </div>
                    <div style="color: #4a4a4a;">
                        ${message}
                    </div>
                </div>
                <button class="spotlight-close" style="
                    background: none;
                    border: none;
                    color: #9ca3af;
                    font-size: 20px;
                    line-height: 1;
                    cursor: pointer;
                    padding: 0;
                    margin: -4px -4px 0 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                ">×</button>
            </div>
        `;
        
        // Add arrow to dialog
        dialog.appendChild(arrow);
        
        // Add optional highlight to target element
        if (targetElement) {
            const originalOutline = targetElement.style.outline;
            const originalBoxShadow = targetElement.style.boxShadow;
            targetElement.style.outline = `3px solid ${colors.bg}`;
            targetElement.style.boxShadow = `0 0 0 6px rgba(102, 126, 234, 0.2)`;
            targetElement.style.transition = 'all 0.3s ease';
            
            // Store cleanup function
            this.cleanup = () => {
                targetElement.style.outline = originalOutline;
                targetElement.style.boxShadow = originalBoxShadow;
            };
        }
        
        // Add to page
        if (!document.querySelector('style[data-spotlight]')) {
            style.setAttribute('data-spotlight', 'true');
            document.head.appendChild(style);
        }
        document.body.appendChild(dot);
        document.body.appendChild(dialog);
        
        // Close button handler
        const closeBtn = dialog.querySelector('.spotlight-close');
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#f3f4f6';
            closeBtn.style.color = '#1f2937';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'none';
            closeBtn.style.color = '#9ca3af';
        });
        closeBtn.addEventListener('click', () => {
            this.remove();
        });
        
        // Auto-dismiss on scroll or target click
        const scrollHandler = () => {
            // Update positions on scroll
            if (targetElement) {
                const newRect = targetElement.getBoundingClientRect();
                dot.style.top = `${newRect.top + newRect.height / 2 - 10}px`;
                dot.style.left = `${newRect.left + newRect.width / 2 - 10}px`;
                // Could also update dialog position here
            }
        };
        
        const clickHandler = (e) => {
            if (targetElement && targetElement.contains(e.target)) {
                // User clicked the target, remove spotlight
                this.remove();
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        document.addEventListener('click', clickHandler);
        
        // Store for cleanup
        this.activeSpotlight = { dot, dialog, scrollHandler, clickHandler };
        
        console.log('[Spotlight] Created successfully');
    },
    
    // Remove spotlight
    remove: function() {
        if (this.activeSpotlight) {
            const { dot, dialog, scrollHandler, clickHandler } = this.activeSpotlight;
            
            // Fade out
            dot.style.opacity = '0';
            dialog.style.opacity = '0';
            dialog.style.transform += ' scale(0.9)';
            
            setTimeout(() => {
                dot.remove();
                dialog.remove();
            }, 300);
            
            // Remove event listeners
            window.removeEventListener('scroll', scrollHandler);
            document.removeEventListener('click', clickHandler);
            
            // Cleanup target element
            if (this.cleanup) {
                this.cleanup();
                this.cleanup = null;
            }
            
            this.activeSpotlight = null;
            console.log('[Spotlight] Removed');
        }
    },
    
    showGeneralGuidance: function(message) {
        // Create a general guidance overlay when no specific target is found
        const guidance = document.createElement('div');
        guidance.className = 'guidefloat-spotlight-guidance';
        guidance.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            font-size: 14px;
            text-align: center;
            max-width: 400px;
            animation: guidefloat-guidance-fadeIn 0.3s ease-out;
        `;
        
        guidance.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">🎯</div>
            <div style="font-weight: 600; margin-bottom: 8px;">Look for:</div>
            <div>${message}</div>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                margin-top: 12px;
                cursor: pointer;
                font-size: 12px;
            ">Got it!</button>
        `;
        
        document.body.appendChild(guidance);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (guidance.parentElement) {
                guidance.remove();
            }
        }, 10000);
    },
    
    // Point to element by selector with custom message
    pointTo: function(selector, message, type = 'info') {
        this.create({
            target: selector,
            message: message,
            type: type,
            position: 'auto'
        });
    },
    
    // Update spotlight position (for scrolling/resizing)
    updatePosition: function() {
        if (this.activeSpotlight) {
            // Trigger re-creation with same options
            // (stored options would be needed for this)
        }
    }
};

// Make globally accessible
window.Spotlight = Spotlight;

console.log('[Spotlight] Loaded successfully');

