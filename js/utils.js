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
