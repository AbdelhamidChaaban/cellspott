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
  
  if (isIOS) {
    // iOS: Use window.location.href for maximum reliability
    // This is the most reliable method on iOS Safari, even though it navigates away
    // Users will be redirected to WhatsApp app, which is the desired behavior
    window.location.href = url;
  } else {
    // For other platforms: Use anchor element click method
    try {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
      document.body.appendChild(link);
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
    } catch (e) {
      // Fallback
      window.open(url, '_blank');
    }
  }
}
