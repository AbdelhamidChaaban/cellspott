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

let netflixPromoCodeApplied = false;
let netflixPromoDiscount = 0;

let shahedPromoCodeApplied = false;
let shahedPromoDiscount = 0;

let osnPromoCodeApplied = false;
let osnPromoDiscount = 0;

let validityPromoCodeApplied = false;
let validityPromoDiscount = 0;

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
  // promoData.discount is now an amount in LBP
  promoDiscount = promoData.discount; // amount LBP
  message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
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
  alfaPromoDiscount = promoData.discount; // amount LBP
  message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
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
  openPromoDiscount = promoData.discount; // amount LBP
  message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
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

// ---------- Netflix Promo Code ----------
async function applyNetflixPromoCode() {
  const input = $("#netflix-promo-code-input");
  const message = $("#netflix-promo-message");
  const applyBtn = $("#netflix-apply-promo-btn");
  
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
  netflixPromoCodeApplied = true;
  netflixPromoDiscount = promoData.discount; // amount LBP
  message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
        input.disabled = true;
        if (applyBtn) applyBtn.disabled = true;
        renderStreamingPackages("Netflix"); // Re-render with discount
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

// ---------- Shahed Promo Code ----------
async function applyShahedPromoCode() {
  const input = $("#shahed-promo-code-input");
  const message = $("#shahed-promo-message");
  const applyBtn = $("#shahed-apply-promo-btn");
  
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
  shahedPromoCodeApplied = true;
  shahedPromoDiscount = promoData.discount; // amount LBP
  message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
        input.disabled = true;
        if (applyBtn) applyBtn.disabled = true;
        renderStreamingPackages("Shahed"); // Re-render with discount
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

// ---------- OSN+ Promo Code ----------
async function applyOsnPromoCode() {
  const input = $("#osn-promo-code-input");
  const message = $("#osn-promo-message");
  const applyBtn = $("#osn-apply-promo-btn");
  
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
  osnPromoCodeApplied = true;
  osnPromoDiscount = promoData.discount; // amount LBP
  message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
        input.disabled = true;
        if (applyBtn) applyBtn.disabled = true;
        renderStreamingPackages("OSN+"); // Re-render with discount
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

// ---------- Validity Promo Code ----------
async function applyValidityPromoCode() {
  console.info('applyValidityPromoCode called');
  const input = $("#validity-promo-code-input");
  const message = $("#validity-promo-message");
  const applyBtn = $("#validity-apply-promo-btn");
  
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
  validityPromoCodeApplied = true;
  validityPromoDiscount = promoData.discount; // amount LBP
  message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
        input.disabled = true;
        if (applyBtn) applyBtn.disabled = true;
        renderValidityPackages(); // Re-render with discount
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
