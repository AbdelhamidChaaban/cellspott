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
  // iOS Safari blocks window.open() for external URLs in some contexts
  // Create a temporary anchor element and click it - this works on iOS
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
