/* Promo Code Module
   Handles promo code validation and application for all service types
*/

// ---------- Promo Code State ----------
let promoCodeApplied = false;
let promoDiscount = 0;

let alfaPromoCodeApplied = false;
let alfaPromoDiscount = 0;

let openPromoCodeApplied = false;
let openPromoDiscount = 0;

let creditsPromoCodeApplied = false;
let creditsPromoDiscount = 0;

// ---------- Closed Services Promo Code ----------
async function applyPromoCode() {
  const input = $("#promo-code-input");
  const message = $("#promo-message");
  const applyBtn = $("#apply-promo-btn");
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode").get();
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
        promoCodeApplied = true;
        promoDiscount = promoData.discount / 100; // Convert percentage to decimal
        message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${promoData.discount}% discount on all packages</span>`;
        input.disabled = true;
        if (applyBtn) applyBtn.disabled = true;
        renderPackages(); // Re-render with discount
      } else {
        message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
      }
    } else {
      message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    }
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

// ---------- Alfa Gifts Promo Code ----------
async function applyAlfaPromoCode() {
  const input = $("#alfa-promo-code-input");
  const message = $("#alfa-promo-message");
  const applyBtn = $("#alfa-apply-promo-btn");
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode").get();
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
        alfaPromoCodeApplied = true;
        alfaPromoDiscount = promoData.discount / 100; // Convert percentage to decimal
        message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${promoData.discount}% discount on all packages</span>`;
        input.disabled = true;
        if (applyBtn) applyBtn.disabled = true;
        renderAlfaPackages(); // Re-render with discount
      } else {
        message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
      }
    } else {
      message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    }
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

// ---------- Open Services Promo Code ----------
async function applyOpenPromoCode() {
  const input = $("#open-promo-code-input");
  const message = $("#open-promo-message");
  const applyBtn = $("#open-apply-promo-btn");
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode").get();
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
        openPromoCodeApplied = true;
        openPromoDiscount = promoData.discount / 100; // Convert percentage to decimal
        message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${promoData.discount}% discount on all packages</span>`;
        input.disabled = true;
        if (applyBtn) applyBtn.disabled = true;
        renderOpenPackages(); // Re-render with discount
      } else {
        message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
      }
    } else {
      message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    }
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}
