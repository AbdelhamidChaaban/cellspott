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

// ---------- Second Promo Code State ----------
let promo2CodeApplied = false;
let promo2Discount = 0;

let alfaPromo2CodeApplied = false;
let alfaPromo2Discount = 0;

let openPromo2CodeApplied = false;
let openPromo2Discount = 0;

let creditsPromo2CodeApplied = false;
let creditsPromo2Discount = 0;

let netflixPromo2CodeApplied = false;
let netflixPromo2Discount = 0;

let shahedPromo2CodeApplied = false;
let shahedPromo2Discount = 0;

let osnPromo2CodeApplied = false;
let osnPromo2Discount = 0;

let validityPromo2CodeApplied = false;
let validityPromo2Discount = 0;

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
    // Load both promo codes from Firebase
    const [promoDoc, promo2Doc] = await Promise.all([
      db.collection("settings").doc("promoCode").get(),
      db.collection("settings").doc("promoCode2").get()
    ]);
    
    let promoData = null;
    let promo2Data = null;
    
    if (promoDoc.exists) {
      promoData = promoDoc.data();
    }
    
    if (promo2Doc.exists) {
      promo2Data = promo2Doc.data();
    }
    
    // Check if code matches first promo code
    if (promoData && promoData.code === code && promoData.active) {
      promoCodeApplied = true;
      promoDiscount = promoData.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderPackages(); // Re-render with discount
      return;
    }
    
    // Check if code matches second promo code
    if (promo2Data && promo2Data.code === code && promo2Data.active) {
      promoCodeApplied = true;
      promoDiscount = promo2Data.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promo2Data.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderPackages(); // Re-render with discount
      return;
    }
    
    // If no match found
    message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

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
    // Load both promo codes from Firebase
    const [promoDoc, promo2Doc] = await Promise.all([
      db.collection("settings").doc("promoCode").get(),
      db.collection("settings").doc("promoCode2").get()
    ]);
    
    let promoData = null;
    let promo2Data = null;
    
    if (promoDoc.exists) {
      promoData = promoDoc.data();
    }
    
    if (promo2Doc.exists) {
      promo2Data = promo2Doc.data();
    }
    
    // Check if code matches first promo code
    if (promoData && promoData.code === code && promoData.active) {
      alfaPromoCodeApplied = true;
      alfaPromoDiscount = promoData.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderAlfaPackages(); // Re-render with discount
      return;
    }
    
    // Check if code matches second promo code
    if (promo2Data && promo2Data.code === code && promo2Data.active) {
      alfaPromoCodeApplied = true;
      alfaPromoDiscount = promo2Data.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promo2Data.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderAlfaPackages(); // Re-render with discount
      return;
    }
    
    // If no match found
    message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

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
    // Load both promo codes from Firebase
    const [promoDoc, promo2Doc] = await Promise.all([
      db.collection("settings").doc("promoCode").get(),
      db.collection("settings").doc("promoCode2").get()
    ]);
    
    let promoData = null;
    let promo2Data = null;
    
    if (promoDoc.exists) {
      promoData = promoDoc.data();
    }
    
    if (promo2Doc.exists) {
      promo2Data = promo2Doc.data();
    }
    
    // Check if code matches first promo code
    if (promoData && promoData.code === code && promoData.active) {
      openPromoCodeApplied = true;
      openPromoDiscount = promoData.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderOpenPackages(); // Re-render with discount
      return;
    }
    
    // Check if code matches second promo code
    if (promo2Data && promo2Data.code === code && promo2Data.active) {
      openPromoCodeApplied = true;
      openPromoDiscount = promo2Data.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promo2Data.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderOpenPackages(); // Re-render with discount
      return;
    }
    
    // If no match found
    message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

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
    // Load both promo codes from Firebase
    const [promoDoc, promo2Doc] = await Promise.all([
      db.collection("settings").doc("promoCode").get(),
      db.collection("settings").doc("promoCode2").get()
    ]);
    
    let promoData = null;
    let promo2Data = null;
    
    if (promoDoc.exists) {
      promoData = promoDoc.data();
    }
    
    if (promo2Doc.exists) {
      promo2Data = promo2Doc.data();
    }
    
    // Check if code matches first promo code
    if (promoData && promoData.code === code && promoData.active) {
      netflixPromoCodeApplied = true;
      netflixPromoDiscount = promoData.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderStreamingPackages("Netflix"); // Re-render with discount
      return;
    }
    
    // Check if code matches second promo code
    if (promo2Data && promo2Data.code === code && promo2Data.active) {
      netflixPromoCodeApplied = true;
      netflixPromoDiscount = promo2Data.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promo2Data.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderStreamingPackages("Netflix"); // Re-render with discount
      return;
    }
    
    // If no match found
    message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

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
    // Load both promo codes from Firebase
    const [promoDoc, promo2Doc] = await Promise.all([
      db.collection("settings").doc("promoCode").get(),
      db.collection("settings").doc("promoCode2").get()
    ]);
    
    let promoData = null;
    let promo2Data = null;
    
    if (promoDoc.exists) {
      promoData = promoDoc.data();
    }
    
    if (promo2Doc.exists) {
      promo2Data = promo2Doc.data();
    }
    
    // Check if code matches first promo code
    if (promoData && promoData.code === code && promoData.active) {
      shahedPromoCodeApplied = true;
      shahedPromoDiscount = promoData.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderStreamingPackages("Shahed"); // Re-render with discount
      return;
    }
    
    // Check if code matches second promo code
    if (promo2Data && promo2Data.code === code && promo2Data.active) {
      shahedPromoCodeApplied = true;
      shahedPromoDiscount = promo2Data.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promo2Data.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderStreamingPackages("Shahed"); // Re-render with discount
      return;
    }
    
    // If no match found
    message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

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
    // Load both promo codes from Firebase
    const [promoDoc, promo2Doc] = await Promise.all([
      db.collection("settings").doc("promoCode").get(),
      db.collection("settings").doc("promoCode2").get()
    ]);
    
    let promoData = null;
    let promo2Data = null;
    
    if (promoDoc.exists) {
      promoData = promoDoc.data();
    }
    
    if (promo2Doc.exists) {
      promo2Data = promo2Doc.data();
    }
    
    // Check if code matches first promo code
    if (promoData && promoData.code === code && promoData.active) {
      osnPromoCodeApplied = true;
      osnPromoDiscount = promoData.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderStreamingPackages("OSN+"); // Re-render with discount
      return;
    }
    
    // Check if code matches second promo code
    if (promo2Data && promo2Data.code === code && promo2Data.active) {
      osnPromoCodeApplied = true;
      osnPromoDiscount = promo2Data.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promo2Data.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderStreamingPackages("OSN+"); // Re-render with discount
      return;
    }
    
    // If no match found
    message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

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
    // Load both promo codes from Firebase
    const [promoDoc, promo2Doc] = await Promise.all([
      db.collection("settings").doc("promoCode").get(),
      db.collection("settings").doc("promoCode2").get()
    ]);
    
    let promoData = null;
    let promo2Data = null;
    
    if (promoDoc.exists) {
      promoData = promoDoc.data();
    }
    
    if (promo2Doc.exists) {
      promo2Data = promo2Doc.data();
    }
    
    // Check if code matches first promo code
    if (promoData && promoData.code === code && promoData.active) {
      validityPromoCodeApplied = true;
      validityPromoDiscount = promoData.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderValidityPackages(); // Re-render with discount
      return;
    }
    
    // Check if code matches second promo code
    if (promo2Data && promo2Data.code === code && promo2Data.active) {
      validityPromoCodeApplied = true;
      validityPromoDiscount = promo2Data.discount; // amount LBP
      message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promo2Data.discount).toLocaleString()} LBP off on all packages</span>`;
      input.disabled = true;
      if (applyBtn) applyBtn.disabled = true;
      renderValidityPackages(); // Re-render with discount
      return;
    }
    
    // If no match found
    message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

// ---------- Second Promo Code Functions ----------
async function applyPromo2Code() {
  console.log("applyPromo2Code called!");
  const input = $("#promo2-code-input");
  const message = $("#promo2-message");
  const applyBtn = $("#apply-promo2-btn");
  
  console.log("Elements found:", { input: !!input, message: !!message, applyBtn: !!applyBtn });
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode2").get();
    
    console.log("Second promo code check:", {
      exists: promoDoc.exists,
      data: promoDoc.exists ? promoDoc.data() : null,
      enteredCode: code
    });
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
        promo2CodeApplied = true;
        promo2Discount = promoData.discount; // amount LBP
        message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
        input.disabled = true;
        if (applyBtn) applyBtn.disabled = true;
        renderPackages(); // Re-render with discount
      } else {
        message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
      }
    } else {
      message.innerHTML = '<span class="text-red-400">Promo code not found. Please contact admin.</span>';
    }
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

async function applyAlfaPromo2Code() {
  const input = $("#alfa-promo2-code-input");
  const message = $("#alfa-promo2-message");
  const applyBtn = $("#alfa-apply-promo2-btn");
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode2").get();
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
        alfaPromo2CodeApplied = true;
        alfaPromo2Discount = promoData.discount; // amount LBP
        message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
        input.disabled = true;
        if (applyBtn) applyBtn.disabled = true;
        renderAlfaPackages(); // Re-render with discount
      } else {
        message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
      }
    } else {
      message.innerHTML = '<span class="text-red-400">Promo code not found. Please contact admin.</span>';
    }
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

async function applyOpenPromo2Code() {
  const input = $("#open-promo2-code-input");
  const message = $("#open-promo2-message");
  const applyBtn = $("#open-apply-promo2-btn");
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode2").get();
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
        openPromo2CodeApplied = true;
        openPromo2Discount = promoData.discount; // amount LBP
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

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

async function applyNetflixPromo2Code() {
  const input = $("#netflix-promo2-code-input");
  const message = $("#netflix-promo2-message");
  const applyBtn = $("#netflix-apply-promo2-btn");
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode2").get();
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
        netflixPromo2CodeApplied = true;
        netflixPromo2Discount = promoData.discount; // amount LBP
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

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

async function applyShahedPromo2Code() {
  const input = $("#shahed-promo2-code-input");
  const message = $("#shahed-promo2-message");
  const applyBtn = $("#shahed-apply-promo2-btn");
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode2").get();
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
        shahedPromo2CodeApplied = true;
        shahedPromo2Discount = promoData.discount; // amount LBP
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

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

async function applyOsnPromo2Code() {
  const input = $("#osn-promo2-code-input");
  const message = $("#osn-promo2-message");
  const applyBtn = $("#osn-apply-promo2-btn");
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode2").get();
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
        osnPromo2CodeApplied = true;
        osnPromo2Discount = promoData.discount; // amount LBP
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

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;

async function applyValidityPromo2Code() {
  console.info('applyValidityPromo2Code called');
  const input = $("#validity-promo2-code-input");
  const message = $("#validity-promo2-message");
  const applyBtn = $("#validity-apply-promo2-btn");
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode2").get();
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
        validityPromo2CodeApplied = true;
        validityPromo2Discount = promoData.discount; // amount LBP
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

// Make second promo code functions globally available
window.applyPromo2Code = applyPromo2Code;
window.applyAlfaPromo2Code = applyAlfaPromo2Code;
window.applyOpenPromo2Code = applyOpenPromo2Code;
window.applyNetflixPromo2Code = applyNetflixPromo2Code;
window.applyShahedPromo2Code = applyShahedPromo2Code;
window.applyOsnPromo2Code = applyOsnPromo2Code;
window.applyValidityPromo2Code = applyValidityPromo2Code;
