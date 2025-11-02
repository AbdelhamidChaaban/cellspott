/* Utility Functions
   DOM helpers, formatters, and validators
*/

// ---------- DOM Helpers ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const show = (el) => el && el.classList.remove("hidden");
const hide = (el) => el && el.classList.add("hidden");

// ---------- Formatters ----------
function formatLBP(n) {
  if (n === undefined || n === null || isNaN(n)) return "0 LBP";
  return `${Number(n).toLocaleString("en-LB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} LBP`;
}

// ---------- Validators ----------
function isValidLebPhone8(num) {
  return /^\d{8}$/.test(String(num || "").trim());
}

// ---------- WhatsApp Helper (iOS Compatible) ----------
function openWhatsApp(url) {
  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // iOS requires a more direct approach - create and click anchor element immediately
  // This MUST be done synchronously in the same call stack as user interaction
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Make it invisible but present in DOM
    link.style.position = 'fixed';
    link.style.top = '-9999px';
    link.style.left = '-9999px';
    link.style.width = '1px';
    link.style.height = '1px';
    link.style.opacity = '0';
    link.style.pointerEvents = 'none';
    
    // Append to body
    document.body.appendChild(link);
    
    // CRITICAL: Click must happen immediately, synchronously
    // On iOS, any delay breaks the user interaction chain
    if (isIOS) {
      // For iOS: Force a synchronous click and handle navigation
      link.click();
      // Don't remove immediately on iOS - let the browser handle navigation
      // The browser will navigate to WhatsApp app, page might unload anyway
    } else {
      // For other platforms: Click and clean up
      link.click();
      setTimeout(() => {
        try {
          if (link.parentNode) {
            document.body.removeChild(link);
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      }, 100);
    }
  } catch (e) {
    // Fallback methods
    console.warn('Primary WhatsApp open method failed, trying fallback:', e);
    
    if (isIOS) {
      // Final iOS fallback: direct navigation (will navigate away from page)
      try {
        window.location.href = url;
      } catch (e2) {
        // Last resort
        window.open(url, '_blank');
      }
    } else {
      // Final fallback for non-iOS
      window.open(url, '_blank');
    }
  }
}
