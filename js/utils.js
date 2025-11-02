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
    // iOS Safari: Use window.location.href which reliably opens WhatsApp app
    // This navigates away but opens WhatsApp directly on iOS
    window.location.href = url;
  } else {
    // For other platforms: Try anchor element first, fallback to window.open
    try {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      // Small delay before removing to ensure click is processed
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (e) {
      // Fallback to window.open if anchor method fails
      window.open(url, '_blank');
    }
  }
}
