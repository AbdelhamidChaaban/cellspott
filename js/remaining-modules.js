// ---------- Purchase Modal ----------
let currentPurchase = null;
function openPurchaseModal(pkg) {
  currentPurchase = pkg;
  $("#purchase-summary").textContent = `You are about to purchase ${pkg.sizeGB}GB for ${formatLBP(pkg.priceLBP)}`;
  $("#purchase-phone").value = "";
  $("#purchase-error").textContent = "";
  
  // Pre-load user data for iOS WhatsApp messages (fire-and-forget)
  if (window.uid) {
    db.collection("users").doc(window.uid).get().then((doc) => {
      if (doc.exists) {
        window._cachedUserData = doc.data();
      }
    }).catch(() => {});
  }
  
  // Reset payment confirmation state
  const confirmPaymentBtn = $("#confirm-payment-btn");
  const secondaryPhoneSection = $("#secondary-phone-section");
  const purchasePhoneInput = $("#purchase-phone");
  
  if (confirmPaymentBtn) {
    confirmPaymentBtn.classList.remove("bg-gray-600", "cursor-not-allowed");
    confirmPaymentBtn.classList.add("bg-green-600", "hover:bg-green-700");
    confirmPaymentBtn.disabled = false;
    confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
  }
  
  if (secondaryPhoneSection) {
    secondaryPhoneSection.classList.add("opacity-50", "pointer-events-none");
    // Re-add warning text if it doesn't exist
    if (!secondaryPhoneSection.querySelector(".text-xs")) {
      const warning = document.createElement("p");
      warning.className = "text-xs text-gray-500 mt-1";
      warning.textContent = "⚠️ Please confirm payment first";
      secondaryPhoneSection.appendChild(warning);
    }
  }
  
  if (purchasePhoneInput) {
    purchasePhoneInput.disabled = true;
  }
  
  const modal = $("#purchase-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  
  // Re-initialize feather icons
  if (window.feather) feather.replace();
}

function closePurchaseModal() {
  const modal = $("#purchase-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function initPurchaseModal(uid) {
  window.uid = uid; // Store for modal open functions
  // Copy number button
  const copyBtn = $("#copy-number-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const number = "03475704";
      try {
        await navigator.clipboard.writeText(number);
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          if (window.feather) feather.replace();
        }, 2000);
      } catch (err) {
        alert("Number copied: " + number);
      }
    });
  }
  
  // Payment confirmation button
  const confirmPaymentBtn = $("#confirm-payment-btn");
  const secondaryPhoneSection = $("#secondary-phone-section");
  const purchasePhoneInput = $("#purchase-phone");
  
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener("click", () => {
      // Enable the secondary phone section
      if (secondaryPhoneSection) {
        secondaryPhoneSection.classList.remove("opacity-50", "pointer-events-none");
      }
      if (purchasePhoneInput) {
        purchasePhoneInput.disabled = false;
        purchasePhoneInput.focus();
      }
      
      // Change button to confirmed state
      confirmPaymentBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      confirmPaymentBtn.classList.add("bg-gray-600", "cursor-not-allowed");
      confirmPaymentBtn.disabled = true;
      confirmPaymentBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i><span>Payment Confirmed ✓</span>';
      if (window.feather) feather.replace();
      
      // Remove warning text
      const warningText = secondaryPhoneSection?.querySelector(".text-xs");
      if (warningText) warningText.remove();
    });
  }
  
  $("#purchase-cancel").addEventListener("click", closePurchaseModal);
  
  $("#purchase-confirm").addEventListener("click", async (e) => {
    // CRITICAL: Check iOS FIRST before ANY other operation
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      // iOS: Open WhatsApp IMMEDIATELY - no validation, no checks, nothing first!
      // Use cached user data if available
      let userName = "User";
      try {
        const cachedUserData = window._cachedUserData || {};
        userName = `${cachedUserData.firstName || ""} ${cachedUserData.lastName || ""}`.trim() || "User";
      } catch (e) {}
      
      const phone = $("#purchase-phone")?.value?.trim() || "";
      const packageSize = currentPurchase?.sizeGB || "N/A";
      const packagePrice = currentPurchase?.priceLBP || 0;
      
      // Build URL with minimal encoding
      const message = `New Purchase Request\n\nName: ${userName}\nPackage: ${packageSize}GB\nPrice: ${formatLBP(packagePrice)}\nPhone: ${phone}\n\nI'll send you the proof image.`;
      const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
      
      // Start background save immediately (don't wait)
      const phoneValue = phone;
      const purchaseData = currentPurchase;
      const userId = uid;
      (async () => {
        try {
          await db.collection("orders").add({
            uid: userId,
            packageSizeGB: purchaseData?.sizeGB,
            priceLBP: purchaseData?.priceLBP,
            packageId: purchaseData?.packageId || null,
            secondaryPhone: phoneValue,
            type: purchaseData?.type || "closed-service",
            status: "pending",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } catch (err) {
          console.error("Order save error:", err);
        }
      })();
      
      // IMMEDIATE navigation - this MUST be the last synchronous operation
      window.location = whatsappUrl;
      return; // Stop execution
    }
    
    // Non-iOS: Normal flow with validation
    const phone = $("#purchase-phone").value.trim();
    if (!isValidLebPhone8(phone)) {
      $("#purchase-error").textContent = "Phone must be 8 digits (no +961 or leading 0)";
      return;
    }
    if (!currentPurchase) return;

    let userName = "User";
    try {
      const cachedUserData = window._cachedUserData || {};
      userName = `${cachedUserData.firstName || ""} ${cachedUserData.lastName || ""}`.trim() || "User";
    } catch (e) {}
    
    const message = `New Purchase Request

Name: ${userName}
Package: ${currentPurchase.sizeGB}GB
Price: ${formatLBP(currentPurchase.priceLBP)}
Secondary Phone: ${phone}

I'll send you the proof image.`;
    
    const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
    openWhatsApp(whatsappUrl);
    closePurchaseModal();
    
    try {
      const userDoc = await db.collection("users").doc(uid).get();
      const userData = userDoc.data() || {};
      await db.collection("orders").add({
        uid,
        packageSizeGB: currentPurchase.sizeGB,
        priceLBP: currentPurchase.priceLBP,
        packageId: currentPurchase.packageId || null,
        secondaryPhone: phone,
        type: currentPurchase.type || "closed-service",
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      window._cachedUserData = userData;
      requestAnimationFrame(() => {
        setTimeout(() => {
          alert("✅ Order saved! WhatsApp opened - please send your transfer proof image.");
        }, 1000);
      });
    } catch (error) {
      $("#purchase-error").textContent = error.message || "Failed to submit order";
    }
  });
}

// Delegated fallback to ensure #validity-apply-promo-btn triggers handler even if added later
try {
  if (!window._validityPromoDelegationAdded) {
    document.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('#validity-apply-promo-btn') : null;
      if (btn) {
        e.preventDefault();
        if (typeof applyValidityPromoCode === 'function') {
          console.debug('Delegated: invoking applyValidityPromoCode');
          applyValidityPromoCode();
        }
      }
    });
    window._validityPromoDelegationAdded = true;
  }
} catch (err) {
  console.warn('Could not add delegated validity promo handler', err);
}

// ---------- Alfa Gifts Purchase Modal ----------
let currentAlfaPurchase = null;
function openAlfaPurchaseModal(pkg) {
  currentAlfaPurchase = pkg;
  $("#alfa-purchase-summary").textContent = `You are about to purchase ${pkg.sizeGB}GB for ${formatLBP(pkg.priceLBP)}`;
  $("#alfa-purchase-phone").value = "";
  $("#alfa-purchase-error").textContent = "";
  
  // Pre-load user data for iOS WhatsApp messages (fire-and-forget)
  if (window.uid) {
    db.collection("users").doc(window.uid).get().then((doc) => {
      if (doc.exists) {
        window._cachedUserData = doc.data();
      }
    }).catch(() => {});
  }
  
  // Reset payment confirmation state
  const confirmPaymentBtn = $("#alfa-confirm-payment-btn");
  const phoneSection = $("#alfa-phone-section");
  const purchasePhoneInput = $("#alfa-purchase-phone");
  
  if (confirmPaymentBtn) {
    confirmPaymentBtn.classList.remove("bg-gray-600", "cursor-not-allowed");
    confirmPaymentBtn.classList.add("bg-green-600", "hover:bg-green-700");
    confirmPaymentBtn.disabled = false;
    confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
  }
  
  if (phoneSection) {
    phoneSection.classList.add("opacity-50", "pointer-events-none");
    // Re-add warning text if it doesn't exist
    const warnings = phoneSection.querySelectorAll(".text-xs");
    if (warnings.length < 2) {
      phoneSection.innerHTML = `
        <label class="block text-sm mb-2 text-gray-300">Phone Number</label>
        <input id="alfa-purchase-phone" inputmode="numeric" pattern="^\\d{8}$" placeholder="70xxxxxx" class="w-full px-4 py-3 rounded-lg input-dark" disabled>
        <p class="text-xs text-gray-500 mt-1">⚠️ Please confirm payment first</p>
        <p class="text-xs text-gray-400 mt-1">Please enter a valid phone number</p>
      `;
    }
  }
  
  if (purchasePhoneInput) {
    purchasePhoneInput.disabled = true;
  }
  
  const modal = $("#alfa-purchase-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  
  // Re-initialize feather icons
  if (window.feather) feather.replace();
}

function closeAlfaPurchaseModal() {
  const modal = $("#alfa-purchase-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function initAlfaPurchaseModal(uid) {
  window.uid = uid; // Store for modal open functions
  // Copy number button
  const copyBtn = $("#alfa-copy-number-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const number = "03475704";
      try {
        await navigator.clipboard.writeText(number);
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          if (window.feather) feather.replace();
        }, 2000);
      } catch (err) {
        alert("Number copied: " + number);
      }
    });
  }
  
  // Payment confirmation button
  const confirmPaymentBtn = $("#alfa-confirm-payment-btn");
  const phoneSection = $("#alfa-phone-section");
  const purchasePhoneInput = $("#alfa-purchase-phone");
  
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener("click", () => {
      // Enable the phone section
      if (phoneSection) {
        phoneSection.classList.remove("opacity-50", "pointer-events-none");
      }
      if (purchasePhoneInput) {
        purchasePhoneInput.disabled = false;
        purchasePhoneInput.focus();
      }
      
      // Change button to confirmed state
      confirmPaymentBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      confirmPaymentBtn.classList.add("bg-gray-600", "cursor-not-allowed");
      confirmPaymentBtn.disabled = true;
      confirmPaymentBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i><span>Payment Confirmed ✓</span>';
      if (window.feather) feather.replace();
      
      // Remove first warning text only
      const warnings = phoneSection?.querySelectorAll(".text-xs");
      if (warnings && warnings.length > 0) {
        warnings[0].remove();
      }
    });
  }
  
  $("#alfa-purchase-cancel").addEventListener("click", closeAlfaPurchaseModal);
  
  $("#alfa-purchase-confirm").addEventListener("click", async () => {
    // CRITICAL: Check iOS FIRST
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      // iOS: Open immediately - use cached user data if available
      let userName = "User";
      try {
        const cachedUserData = window._cachedUserData || {};
        userName = `${cachedUserData.firstName || ""} ${cachedUserData.lastName || ""}`.trim() || "User";
      } catch (e) {}
      
      const phone = $("#alfa-purchase-phone")?.value?.trim() || "";
      const packageSize = currentAlfaPurchase?.sizeGB || "N/A";
      const packagePrice = currentAlfaPurchase?.priceLBP || 0;
      const message = `New Alfa Gift Purchase Request\n\nName: ${userName}\nPackage: ${packageSize}GB\nPrice: ${formatLBP(packagePrice)}\nPhone: ${phone}\n\nI'll send you the proof image.`;
      const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
      
      // Background save
      const phoneValue = phone;
      const purchaseData = currentAlfaPurchase;
      const userId = uid;
      (async () => {
        try {
          await db.collection("orders").add({
            uid: userId,
            packageSizeGB: purchaseData?.sizeGB,
            priceLBP: purchaseData?.priceLBP,
            packageId: purchaseData?.packageId || null,
            phone: phoneValue,
            type: "alfa-gift",
            status: "pending",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
          if (purchaseData?.packageId) {
            try {
              await db.collection("packages").doc(purchaseData.packageId).update({
                quantity: firebase.firestore.FieldValue.increment(-1)
              });
            } catch (err) {}
          }
        } catch (err) {
          console.error("Order save error:", err);
        }
      })();
      
      window.location = whatsappUrl;
      return;
    }
    
    // Non-iOS flow
    const phone = $("#alfa-purchase-phone").value.trim();
    if (!isValidLebPhone8(phone)) {
      $("#alfa-purchase-error").textContent = "Phone must be 8 digits (no +961 or leading 0)";
      return;
    }
    if (!currentAlfaPurchase) return;

    let userName = "User";
    try {
      const cachedUserData = window._cachedUserData || {};
      userName = `${cachedUserData.firstName || ""} ${cachedUserData.lastName || ""}`.trim() || "User";
    } catch (e) {}
    
    const message = `New Alfa Gift Purchase Request

Name: ${userName}
Package: ${currentAlfaPurchase.sizeGB}GB
Price: ${formatLBP(currentAlfaPurchase.priceLBP)}
Phone Number: ${phone}

I'll send you the proof image.`;
    
    const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
    openWhatsApp(whatsappUrl);
    closeAlfaPurchaseModal();
    
    try {
      const userDoc = await db.collection("users").doc(uid).get();
      const userData = userDoc.data() || {};
      window._cachedUserData = userData;
      
      await db.collection("orders").add({
        uid,
        packageSizeGB: currentAlfaPurchase.sizeGB,
        priceLBP: currentAlfaPurchase.priceLBP,
        packageId: currentAlfaPurchase.packageId || null,
        phone: phone,
        type: "alfa-gift",
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      if (currentAlfaPurchase.packageId) {
        try {
          const packageRef = db.collection("packages").doc(currentAlfaPurchase.packageId);
          await packageRef.update({
            quantity: firebase.firestore.FieldValue.increment(-1)
          });
        } catch (error) {
          console.error("Error decreasing package quantity:", error);
        }
      }
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          alert("✅ Order saved! WhatsApp opened - please send your transfer proof image.");
        }, 1000);
      });
    } catch (e) {
      $("#alfa-purchase-error").textContent = e.message || "Failed to submit order";
    }
  });
}

// ---------- Credits Page ----------
async function renderCreditsPackages() {
  const container = $("#credits-packages-container");
  if (!container) return;
  
  try {
    const packagesSnap = await db.collection("packages")
      .where("type", "==", "credits")
      .where("active", "==", true)
      .get();
    
    container.innerHTML = "";
    
    if (packagesSnap.empty) {
      container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-400">No credits packages available</div>';
      return;
    }
    
    const packages = [];
    packagesSnap.forEach(doc => {
      packages.push({ id: doc.id, ...doc.data() });
    });
    
    packages.forEach(pkg => {
      const qty = pkg.quantity !== undefined ? pkg.quantity : 0;
      let buttonDisabled = '';
      let buttonClass = 'bg-green-600 hover:bg-green-700';
      
      if (qty === 0) {
        buttonDisabled = 'disabled';
        buttonClass = 'bg-gray-600 cursor-not-allowed text-gray-400';
      }
      
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "package-card-wrapper";
      cardWrapper.innerHTML = `
        <div class="package-card-inner flex flex-col">
          <div class="text-center mb-4">
            <svg class="w-16 h-16 mx-auto mb-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="text-2xl font-bold text-white mb-1">${pkg.description || "Credits"}</div>
            <div class="text-sm text-gray-400">Package</div>
          </div>
          <div class="text-center mb-4">
            <div class="text-2xl font-bold text-white">${formatLBP(pkg.priceLBP)}</div>
          </div>
          <button ${buttonDisabled} class="credits-pkg-buy w-full py-3 rounded-lg ${buttonClass} text-white font-semibold transition-all hover:scale-105" data-package="${pkg.description}" data-price="${pkg.priceLBP}">
            ${qty === 0 ? 'Sold Out' : 'Purchase'}
          </button>
        </div>
      `;
      container.appendChild(cardWrapper);
    });
    
    // Add event listeners to new buttons
    container.querySelectorAll(".credits-pkg-buy").forEach(btn => {
      btn.addEventListener("click", () => {
        const packageName = btn.getAttribute("data-package");
        const price = parseInt(btn.getAttribute("data-price"));
        
        openCreditsPurchaseModal({
          packageName,
          price
        });
      });
    });
    
  } catch (error) {
    console.error("Error loading credits packages:", error);
    container.innerHTML = '<div class="col-span-full text-center py-8 text-red-400">Error loading packages</div>';
  }
}

let currentCreditsPurchase = null;

function openCreditsPurchaseModal(packageData) {
  currentCreditsPurchase = packageData;
  const modal = $("#credits-purchase-modal");
  const summary = $("#credits-purchase-summary");
  
  summary.textContent = `You are about to purchase ${packageData.packageName} for ${formatLBP(packageData.price)}`;
  
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  
  // Pre-load user data for iOS WhatsApp messages (fire-and-forget)
  if (window.uid) {
    db.collection("users").doc(window.uid).get().then((doc) => {
      if (doc.exists) {
        window._cachedUserData = doc.data();
      }
    }).catch(() => {});
  }
  
  if (window.feather) feather.replace();
}

function initCreditsPage(uid) {
  window.uid = uid; // Store for access in handlers
  console.log("Initializing credits page");
  
  // Credit pricing system
  const creditPrices = {
    1: 120000,
    2: 220000,
    3: 300000,
    4: 420000,
    5: 520000,
    6: 600000,
    7: 720000,
    8: 820000,
    9: 900000,
    10: 1020000
  };
  
  // Calculate price for any number of credits
  function calculateCreditsPrice(credits) {
    if (credits <= 10 && creditPrices[credits]) {
      return creditPrices[credits];
    }
    
    // For more than 10 credits, use the formula based on 2-credit packages
    // Example: 14 credits = 7 packages of 2 credits = 7 * 220,000 = 1,540,000 LBP
    // Example: 18 credits = 9 packages of 2 credits = 9 * 220,000 = 1,980,000 LBP
    const packages = Math.ceil(credits / 2);
    return packages * 220000;
  }
  
  // Copy number button
  const copyBtn = $("#credits-copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const number = "03475704";
      try {
        await navigator.clipboard.writeText(number);
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          if (window.feather) feather.replace();
        }, 2000);
      } catch (err) {
        alert("Number copied: " + number);
      }
    });
  }
  
  // Form elements
  const phoneInput = $("#credits-phone-input");
  const amountInput = $("#credits-amount-input");
  const priceDisplay = $("#credits-price-display");
  const totalPrice = $("#credits-total-price");
  const showPriceBtn = $("#credits-show-price-btn");
  const confirmBtn = $("#credits-confirm-btn");
  const submitBtn = $("#credits-submit-btn");
  const cancelBtn = $("#credits-cancel-btn");
  
  let paymentConfirmed = false;
  
  // Enable/disable show price button based on credits input
  if (amountInput && showPriceBtn) {
    // Initial state - disable if no value
    if (!amountInput.value || parseInt(amountInput.value) <= 0) {
      showPriceBtn.disabled = true;
    }
    
    amountInput.addEventListener("input", () => {
      const credits = parseInt(amountInput.value);
      if (credits && credits > 0) {
        showPriceBtn.disabled = false;
        // Hide price display when input changes
        if (priceDisplay) {
          priceDisplay.classList.add("hidden");
        }
      } else {
        showPriceBtn.disabled = true;
        if (priceDisplay) {
          priceDisplay.classList.add("hidden");
        }
      }
    });
  }
  
  // Show price button click handler
  if (showPriceBtn) {
    showPriceBtn.addEventListener("click", () => {
      const credits = parseInt(amountInput.value);
      if (credits && credits > 0) {
        const price = calculateCreditsPrice(credits);
        if (totalPrice) {
          totalPrice.textContent = formatLBP(price);
        }
        if (priceDisplay) {
          priceDisplay.classList.remove("hidden");
        }
      } else {
        $("#credits-error").textContent = "Please enter a valid number of credits";
      }
    });
  }
  
  // Payment confirmation button
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      paymentConfirmed = true;
      
      // Change button state
      confirmBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      confirmBtn.classList.add("bg-green-700");
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>Payment Confirmed ✓</span>';
      if (window.feather) feather.replace();
    });
  }
  
  // Cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      // Reset form
      if (phoneInput) {
        phoneInput.value = "";
      }
      if (amountInput) {
        amountInput.value = "";
      }
      if (showPriceBtn) {
        showPriceBtn.disabled = true;
      }
      $("#credits-error").textContent = "";
      if (priceDisplay) {
        priceDisplay.classList.add("hidden");
      }
      
      paymentConfirmed = false;
      
      // Reset confirmation button
      if (confirmBtn) {
        confirmBtn.classList.remove("bg-green-700");
        confirmBtn.classList.add("bg-green-600", "hover:bg-green-700");
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
        if (window.feather) feather.replace();
      }
    });
  }
  
  // Submit button
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      // CRITICAL: Check iOS FIRST
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (isIOS) {
        // iOS: Open immediately - use cached user data if available
        let userName = "User";
        try {
          const cachedUserData = window._cachedUserData || {};
          userName = `${cachedUserData.firstName || ""} ${cachedUserData.lastName || ""}`.trim() || "User";
        } catch (e) {}
        
        const phone = phoneInput?.value?.trim() || "";
        const creditsAmount = amountInput?.value?.trim() || "0";
        const credits = parseInt(creditsAmount) || 0;
        const price = credits > 0 ? calculateCreditsPrice(credits) : 0;
        const message = `New Credits Purchase Request\n\nName: ${userName}\nCredits: ${credits}\nPrice: ${formatLBP(price)}\nPhone: ${phone}\n\nI'll send you the proof image.`;
        const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
        
        // Background save
        (async () => {
          try {
            await db.collection("orders").add({
              uid,
              phone: phone,
              creditsAmount: credits,
              priceLBP: price,
              type: "credits",
              status: "pending",
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
          } catch (err) {
            console.error("Order save error:", err);
          }
        })();
        
        window.location = whatsappUrl;
        return;
      }
      
      // Non-iOS flow
      const phone = phoneInput?.value.trim();
      if (!isValidLebPhone8(phone)) {
        $("#credits-error").textContent = "Phone must be 8 digits (no +961 or leading 0)";
        return;
      }
      
      const creditsAmount = amountInput?.value.trim();
      if (!creditsAmount || parseInt(creditsAmount) < 1) {
        $("#credits-error").textContent = "Please enter a valid number of credits";
        return;
      }
      
      let userName = "User";
      try {
        const cachedUserData = window._cachedUserData || {};
        userName = `${cachedUserData.firstName || ""} ${cachedUserData.lastName || ""}`.trim() || "User";
      } catch (e) {}
      
      const credits = parseInt(creditsAmount);
      const price = calculateCreditsPrice(credits);
      const message = `New Credits Purchase Request

Name: ${userName}
Number of Credits: ${credits}
Price: ${formatLBP(price)}
Phone Number: ${phone}

I'll send you the proof image.`;
      
      const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
      openWhatsApp(whatsappUrl);
      
      if (cancelBtn) cancelBtn.click();
      
      try {
        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data() || {};
        window._cachedUserData = userData;
        
        await db.collection("orders").add({
          uid,
          phone: phone,
          creditsAmount: credits,
          priceLBP: price,
          type: "credits",
          status: "pending",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        
        requestAnimationFrame(() => {
          setTimeout(() => {
            alert("✅ Order saved! WhatsApp opened - please send your transfer proof image.");
          }, 1000);
        });
      } catch (e) {
        $("#credits-error").textContent = e.message || "Failed to submit order";
      }
    });
  }
}

// ---------- Validity Page ----------
async function renderValidityPackages() {
  const container = $("#validity-packages-container");
  if (!container) return;
  // Ensure promo UI exists for validity page (inject if missing)
  try {
    const promoInput = document.querySelector('#validity-promo-code-input');
    if (!promoInput) {
      const promoHtml = `\n  <!-- Promo Code Section -->\n  <div class="mb-6 max-w-md">\n    <label class="block text-sm mb-2 text-gray-300">Have a promo code?</label>\n    <div class="flex gap-3">\n      <input \n        id="validity-promo-code-input" \n        type="text" \n        placeholder="Enter promo code" \n        class="flex-1 px-4 py-2.5 rounded-lg input-dark text-sm"\n      />\n      <button \n        id="validity-apply-promo-btn" \n        class="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"\n      >\n        Apply\n      </button>\n    </div>\n    <div id="validity-promo-message" class="mt-2 text-sm"></div>\n  </div>\n`;
      container.insertAdjacentHTML('beforebegin', promoHtml);
      console.debug('Inserted promo block for validity page');
    }
  } catch (err) {
    console.warn('Could not ensure validity promo block', err);
  }
  
  try {
    const packagesSnap = await db.collection("packages")
      .where("type", "==", "validity")
      .where("active", "==", true)
      .get();
    
    container.innerHTML = "";
    
    if (packagesSnap.empty) {
      container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-400">No validity packages available</div>';
      return;
    }
    
    const packages = [];
    packagesSnap.forEach(doc => {
      packages.push({ id: doc.id, ...doc.data() });
    });
    
  // Determine validity promo state (promoDiscount is an amount in LBP)
  const promoApplied = typeof validityPromoCodeApplied !== 'undefined' ? validityPromoCodeApplied : false;
  const promoDiscount = typeof validityPromoDiscount !== 'undefined' ? validityPromoDiscount : 0;
  const promo2Applied = typeof validityPromo2CodeApplied !== 'undefined' ? validityPromo2CodeApplied : false;
  const promo2Discount = typeof validityPromo2Discount !== 'undefined' ? validityPromo2Discount : 0;

    packages.forEach(pkg => {
      const qty = pkg.quantity !== undefined ? pkg.quantity : 0;
      let buttonDisabled = '';
      let buttonClass = 'bg-blue-600 hover:bg-blue-700';
      
      if (qty === 0) {
        buttonDisabled = 'disabled';
        buttonClass = 'bg-gray-600 cursor-not-allowed text-gray-400';
      }

      const originalPrice = pkg.priceLBP;
      const fakeOriginalPrice = originalPrice + 50000; // Add 50,000 LBP to create fake discount
      
      // Calculate total discount from both promo codes
      const totalDiscount = (promoApplied ? promoDiscount : 0) + (promo2Applied ? promo2Discount : 0);
      const discountedPrice = totalDiscount > 0 ? Math.max(0, Math.round(originalPrice - totalDiscount)) : originalPrice;
      const hasDiscount = promoApplied || promo2Applied;
      
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "package-card-wrapper";
      cardWrapper.innerHTML = `
        <div class="package-card-inner flex flex-col">
          <div class="text-center mb-4">
            <svg class="w-16 h-16 mx-auto mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <div class="text-2xl font-bold text-white mb-1">${pkg.description || "Validity"}</div>
            <div class="text-sm text-gray-400">Extension</div>
          </div>
          <div class="text-center mb-4">
            <!-- Always show fake original price with strikethrough -->
            <div class="text-sm text-gray-500 line-through">${formatLBP(fakeOriginalPrice)}</div>
            <div class="text-2xl font-bold text-white text-green-400">${formatLBP(discountedPrice)}</div>
          </div>
          <button ${buttonDisabled} class="validity-pkg-buy w-full py-3 rounded-lg ${buttonClass} text-white font-semibold transition-all hover:scale-105" data-package="${pkg.description}" data-price="${discountedPrice}">
            ${qty === 0 ? 'Sold Out' : 'Purchase'}
          </button>
        </div>
      `;
      container.appendChild(cardWrapper);
    });
    
    // Add event listeners to new buttons
    container.querySelectorAll(".validity-pkg-buy").forEach(btn => {
      btn.addEventListener("click", () => {
        const packageName = btn.getAttribute("data-package");
        const price = parseInt(btn.getAttribute("data-price"));
        
        openValidityPurchaseModal({
          packageName,
          price
        });
      });
    });
    // Wire promo apply button and Enter key
    try {
      const applyBtn = $("#validity-apply-promo-btn");
      if (applyBtn) applyBtn.addEventListener('click', applyValidityPromoCode);
      const promoInput = $("#validity-promo-code-input");
      if (promoInput) promoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') applyValidityPromoCode(); });
      
      // Add second promo code handlers
      const apply2Btn = $("#validity-apply-promo2-btn");
      if (apply2Btn) apply2Btn.addEventListener('click', applyValidityPromo2Code);
      const promo2Input = $("#validity-promo2-code-input");
      if (promo2Input) promo2Input.addEventListener('keypress', (e) => { if (e.key === 'Enter') applyValidityPromo2Code(); });
    } catch (err) {
      console.warn('Failed to wire validity promo handlers in renderValidityPackages', err);
    }
    
  } catch (error) {
    console.error("Error loading validity packages:", error);
    container.innerHTML = '<div class="col-span-full text-center py-8 text-red-400">Error loading packages</div>';
  }
}

let currentValidityPurchase = null;

function initValidityPurchaseModal(uid) {
  window.uid = uid; // Store for modal open functions
  const modal = $("#validity-purchase-modal");
  const cancelBtn = $("#validity-purchase-cancel");
  const confirmBtn = $("#validity-purchase-confirm");
  const confirmPaymentBtn = $("#validity-confirm-payment-btn");
  const copyBtn = $("#validity-copy-number-btn");
  
  let paymentConfirmed = false;
  
  // Copy number functionality
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText("03475704");
      copyBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
      setTimeout(() => {
        copyBtn.innerHTML = '<i data-feather="copy" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
      }, 2000);
    });
  }
  
  // Payment confirmation button
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener("click", () => {
      paymentConfirmed = true;
      confirmPaymentBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      confirmPaymentBtn.classList.add("bg-green-700");
      confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>Payment Confirmed ✓</span>';
      if (window.feather) feather.replace();
    });
  }
  
  // Cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      paymentConfirmed = false;
      if (confirmPaymentBtn) {
        confirmPaymentBtn.classList.remove("bg-green-700");
        confirmPaymentBtn.classList.add("bg-green-600", "hover:bg-green-700");
        confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
        if (window.feather) feather.replace();
      }
      currentValidityPurchase = null;
    });
  }
  
  // Confirm button (Send to WhatsApp)
  if (confirmBtn) {
    confirmBtn.addEventListener("click", async () => {
      // CRITICAL: Check iOS FIRST
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (isIOS) {
        // iOS: Open immediately - use cached user data if available
        let userName = "User";
        try {
          const cachedUserData = window._cachedUserData || {};
          userName = `${cachedUserData.firstName || ""} ${cachedUserData.lastName || ""}`.trim() || "User";
        } catch (e) {}
        
        const purchaseData = currentValidityPurchase || {};
        const message = `New Purchase Request\n\nName: ${userName}\nService: Validity Extension\nPackage: ${purchaseData.packageName || "N/A"}\nPrice: ${formatLBP(purchaseData.price || 0)}\n\nI'll send you the proof image.`;
        const whatsappUrl = `https://wa.me/96171829887?text=${encodeURIComponent(message)}`;
        
        // Background save
        const purchase = purchaseData;
        const userId = uid;
        (async () => {
          try {
            const userDoc = await db.collection("users").doc(userId).get();
            const userData = userDoc.data() || {};
            await db.collection("orders").add({
              uid: userId,
              type: "validity",
              packageName: purchase.packageName,
              priceLBP: purchase.price,
              phone: userData.phone || userData.secondaryPhone || userData.mainPhone || "",
              status: "pending",
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
          } catch (err) {
            console.error("Order save error:", err);
          }
        })();
        
        window.location = whatsappUrl;
        return;
      }
      
      // Non-iOS: Normal validation
      if (!paymentConfirmed) {
        $("#validity-purchase-error").textContent = "Please confirm that you have transferred the money";
        return;
      }
      
      if (!currentValidityPurchase) return;
      
      const purchaseData = {
        packageName: currentValidityPurchase.packageName,
        price: currentValidityPurchase.price
      };
      
      let userName = "User";
      let userPhone = "";
      try {
        const cachedUserData = window._cachedUserData || {};
        userName = `${cachedUserData.firstName || ""} ${cachedUserData.lastName || ""}`.trim() || "User";
        userPhone = cachedUserData.phone || cachedUserData.secondaryPhone || cachedUserData.mainPhone || "";
      } catch (e) {}
      
      const message = `New Purchase Request

Name: ${userName}
Service: Validity Extension
Package: ${purchaseData.packageName}
Price: ${formatLBP(purchaseData.price)}

I'll send you the proof image.`;
      
      const whatsappUrl = `https://wa.me/96171829887?text=${encodeURIComponent(message)}`;
      openWhatsApp(whatsappUrl);
      
      // Close modal immediately
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      paymentConfirmed = false;
      if (confirmPaymentBtn) {
        confirmPaymentBtn.classList.remove("bg-green-700");
        confirmPaymentBtn.classList.add("bg-green-600", "hover:bg-green-700");
        confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
        if (window.feather) feather.replace();
      }
      currentValidityPurchase = null;
      
      // Now do async operations in background
      try {
        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data() || {};
        window._cachedUserData = userData;
        const actualUserPhone = userData.phone || userData.secondaryPhone || userData.mainPhone || "";
        
        await db.collection("orders").add({
          uid: uid,
          type: "validity",
          packageName: purchaseData.packageName,
          priceLBP: purchaseData.price,
          phone: actualUserPhone,
          status: "pending",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        setTimeout(() => {
          alert("✅ Order saved! Your request is pending approval.");
        }, 500);
      } catch (error) {
        console.error("Error:", error);
        $("#validity-purchase-error").textContent = "Failed to process request";
      }
    });
  }
}

function openValidityPurchaseModal(packageData) {
  currentValidityPurchase = packageData;
  const modal = $("#validity-purchase-modal");
  const summary = $("#validity-purchase-summary");
  
  summary.textContent = `You are about to purchase ${packageData.packageName} for ${formatLBP(packageData.price)}`;
  
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  
  // Pre-load user data for iOS WhatsApp messages (fire-and-forget)
  if (window.uid) {
    db.collection("users").doc(window.uid).get().then((doc) => {
      if (doc.exists) {
        window._cachedUserData = doc.data();
      }
    }).catch(() => {});
  }
  
  if (window.feather) feather.replace();
}

function initValidityPage(uid) {
  window.uid = uid; // Store for access in handlers
  console.log("Initializing validity page");
  
  // Load validity packages
  renderValidityPackages();
  
  // Copy number button
  const copyBtn = $("#validity-copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const number = "03475704";
      try {
        await navigator.clipboard.writeText(number);
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          if (window.feather) feather.replace();
        }, 2000);
      } catch (err) {
        alert("Number copied: " + number);
      }
    });
  }
  
  // Payment confirmation button
  const confirmBtn = $("#validity-confirm-btn");
  const formSection = $("#validity-form-section");
  const phoneInput = $("#validity-phone-input");
  
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      // Enable form section
      if (formSection) {
        formSection.classList.remove("opacity-50", "pointer-events-none");
      }
      if (phoneInput) {
        phoneInput.disabled = false;
        phoneInput.focus();
      }
      
      // Change button state
      confirmBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      confirmBtn.classList.add("bg-gray-600", "cursor-not-allowed");
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i><span>Payment Confirmed ✓</span>';
      if (window.feather) feather.replace();
      
      // Remove warning text
      const warning = formSection?.querySelector(".text-gray-500");
      if (warning) warning.remove();
    });
  }
  
  // Cancel button
  const cancelBtn = $("#validity-cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      // Reset form
      if (phoneInput) phoneInput.value = "";
      $("#validity-error").textContent = "";
      
      // Reset confirmation button
      if (confirmBtn) {
        confirmBtn.classList.remove("bg-gray-600", "cursor-not-allowed");
        confirmBtn.classList.add("bg-green-600", "hover:bg-green-700");
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
        if (window.feather) feather.replace();
      }
      
      // Disable form section
      if (formSection) {
        formSection.classList.add("opacity-50", "pointer-events-none");
        // Re-add warning if not exists
        if (!formSection.querySelector(".text-gray-500")) {
          const warning = document.createElement("p");
          warning.className = "text-xs text-gray-500 flex items-center gap-2";
          warning.innerHTML = '<i data-feather="alert-circle" class="w-4 h-4"></i><span>Please confirm payment first</span>';
          formSection.appendChild(warning);
          if (window.feather) feather.replace();
        }
      }
      if (phoneInput) phoneInput.disabled = true;
    });
  }
  
  // Submit button
  const submitBtn = $("#validity-submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      // CRITICAL: Check iOS FIRST
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (isIOS) {
        // iOS: Open immediately - use cached user data if available
        let userName = "User";
        try {
          const cachedUserData = window._cachedUserData || {};
          userName = `${cachedUserData.firstName || ""} ${cachedUserData.lastName || ""}`.trim() || "User";
        } catch (e) {}
        
        const phone = phoneInput?.value?.trim() || "";
        const message = `New Validity Purchase Request\n\nName: ${userName}\nPhone: ${phone}\n\nI'll send you the proof image.`;
        const whatsappUrl = `https://wa.me/96171829887?text=${encodeURIComponent(message)}`;
        
        // Background save
        (async () => {
          try {
            await db.collection("orders").add({
              uid,
              phone: phone,
              type: "validity",
              status: "pending",
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
          } catch (err) {
            console.error("Order save error:", err);
          }
        })();
        
        window.location = whatsappUrl;
        return;
      }
      
      // Non-iOS flow
      const phone = phoneInput?.value.trim();
      if (!isValidLebPhone8(phone)) {
        $("#validity-error").textContent = "Phone must be 8 digits (no +961 or leading 0)";
        return;
      }
      
      let userName = "User";
      try {
        const cachedUserData = window._cachedUserData || {};
        userName = `${cachedUserData.firstName || ""} ${cachedUserData.lastName || ""}`.trim() || "User";
      } catch (e) {}
      
      const message = `New Validity Purchase Request

Name: ${userName}
Phone Number: ${phone}

I'll send you the proof image.`;
      
      const whatsappUrl = `https://wa.me/96171829887?text=${encodeURIComponent(message)}`;
      openWhatsApp(whatsappUrl);
      
      if (cancelBtn) cancelBtn.click();
      
      try {
        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data() || {};
        window._cachedUserData = userData;
        
        await db.collection("orders").add({
          uid,
          phone: phone,
          type: "validity",
          status: "pending",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        
        requestAnimationFrame(() => {
          setTimeout(() => {
            alert("✅ Order saved! WhatsApp opened - please send your transfer proof image.");
          }, 1000);
        });
      } catch (e) {
        $("#validity-error").textContent = e.message || "Failed to submit order";
      }
    });
  }
}

// ---------- Credits Purchase Modal ----------
// currentCreditsPurchase already declared above
// function openCreditsPurchaseModal already defined above

function closeCreditsPurchaseModal() {
  const modal = $("#credits-purchase-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function initCreditsPurchaseModal(uid) {
  window.uid = uid; // Store for modal open functions
  const modal = $("#credits-purchase-modal");
  const cancelBtn = $("#credits-purchase-cancel");
  const confirmBtn = $("#credits-purchase-confirm");
  const confirmPaymentBtn = $("#credits-confirm-payment-btn");
  const copyBtn = $("#credits-copy-number-btn");
  
  let paymentConfirmed = false;
  
  // Copy number functionality
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText("03475704");
      copyBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
      setTimeout(() => {
        copyBtn.innerHTML = '<i data-feather="copy" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
      }, 2000);
    });
  }
  
  // Payment confirmation button
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener("click", () => {
      paymentConfirmed = true;
      confirmPaymentBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      confirmPaymentBtn.classList.add("bg-green-700");
      confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>Payment Confirmed ✓</span>';
      if (window.feather) feather.replace();
    });
  }
  
  // Cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      paymentConfirmed = false;
      if (confirmPaymentBtn) {
        confirmPaymentBtn.classList.remove("bg-green-700");
        confirmPaymentBtn.classList.add("bg-green-600", "hover:bg-green-700");
        confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
        if (window.feather) feather.replace();
      }
      currentCreditsPurchase = null;
    });
  }
}

// ---------- Add Credit ----------
function initAddCredit(uid) {
  // Show file name when selected
  const fileInput = $("#credit-proof");
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const label = fileInput.parentElement.querySelector("span");
    if (file && label) {
      label.textContent = file.name;
    }
  });

  $("#add-credit-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = parseFloat($("#credit-amount").value);
    const file = fileInput.files[0] || null;

    if (isNaN(amount) || amount < 0 || amount > 999999.99) {
      alert("Amount must be between 0 and 999,999.99 LBP");
      return;
    }

    let proofUrl = null;
    try {
      if (file) {
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const path = `creditProofs/${uid}/${safeName}`;
        const task = await storage.ref().child(path).put(file);
        proofUrl = await task.ref.getDownloadURL();
      }
      await db.collection("creditRequests").add({
        uid,
        amountLBP: Math.round(amount * 100) / 100,
        paymentMethod: "transfer",
        proofUrl: proofUrl || null,
        status: "pending",
        requestDate: firebase.firestore.FieldValue.serverTimestamp(),
      });
      $("#credit-amount").value = "";
      fileInput.value = "";
      const label = fileInput.parentElement.querySelector("span");
      if (label) label.textContent = "Upload Proof";
      alert("Credit request submitted");
    } catch (e) {
      alert("Failed to submit credit request: " + (e.message || e));
    }
  });
}

// ---------- Credit History ----------
async function loadCreditHistory(uid) {
  const status = $("#credit-status").value;
  const start = $("#credit-start").value ? new Date($("#credit-start").value) : null;
  const end = $("#credit-end").value ? new Date($("#credit-end").value) : null;

  try {
    // Query with orderBy (requires composite index)
    let q = db.collection("creditRequests")
      .where("uid", "==", uid)
      .orderBy("requestDate", "desc");
    
    const snap = await q.get();
    let rows = [];
    snap.forEach((doc) => {
      const d = doc.data();
      const ts = d.requestDate?.toDate?.() || null;
      
      // Client-side filtering for status and dates
      if (status && d.status !== status) return;
      if (start && ts && ts < start) return;
      if (end && ts && ts > new Date(end.getTime() + 86400000 - 1)) return;
      
      rows.push({ id: doc.id, ...d });
    });

    const tbody = $("#credit-history-body");
    const empty = $("#credit-history-empty");
    tbody.innerHTML = "";
    if (!rows.length) {
      show(empty);
      return;
    }
    hide(empty);
    rows.forEach((r) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-navy-600/50";
      tr.innerHTML = `
        <td class="px-2 md:px-4 py-3 whitespace-nowrap">${r.requestDate?.toDate?.().toLocaleDateString?.() || "-"}</td>
        <td class="px-2 md:px-4 py-3 whitespace-nowrap">${formatLBP(r.amountLBP)}</td>
        <td class="px-2 md:px-4 py-3 whitespace-nowrap">${r.paymentMethod || "-"}</td>
        <td class="px-2 md:px-4 py-3 whitespace-nowrap"><span class="px-2 py-1 rounded text-xs ${r.status === 'approved' ? 'bg-green-500/20 text-green-400' : r.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}">${r.status || "-"}</span></td>
        <td class="px-2 md:px-4 py-3 whitespace-nowrap hidden md:table-cell">${r.processedDate?.toDate?.().toLocaleDateString?.() || "-"}</td>
        <td class="px-2 md:px-4 py-3 whitespace-nowrap hidden lg:table-cell">${r.processedBy || "-"}</td>
        <td class="px-2 md:px-4 py-3 hidden lg:table-cell">${r.rejectionReason || "-"}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading credit history:", err);
    const empty = $("#credit-history-empty");
    if (empty) {
      empty.textContent = "Error loading credit history";
      show(empty);
    }
  }

}

function initCreditHistory(uid) {
  const dateBtn = $("#credit-date-btn");
  const dateLabel = $("#credit-date-label");
  const startInput = $("#credit-start");
  const endInput = $("#credit-end");
  
  // When button is clicked, trigger the start date picker
  if (dateBtn && startInput) {
    dateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      startInput.showPicker ? startInput.showPicker() : startInput.click();
    });
  }
  
  // Update label when dates are selected
  function updateDateLabel() {
    if (startInput.value && endInput.value) {
      dateLabel.textContent = `${startInput.value} to ${endInput.value}`;
    } else if (startInput.value) {
      dateLabel.textContent = `From ${startInput.value}`;
    } else {
      dateLabel.textContent = "selectDateRange";
    }
  }
  
  // Listen for date changes
  startInput.addEventListener("change", () => {
    updateDateLabel();
    // Auto-open end date picker after start date is selected
    setTimeout(() => {
      endInput.showPicker ? endInput.showPicker() : endInput.click();
    }, 100);
    loadCreditHistory(uid);
  });
  
  endInput.addEventListener("change", () => {
    updateDateLabel();
    loadCreditHistory(uid);
  });
  
  $("#credit-status").addEventListener("change", () => loadCreditHistory(uid));
}

// ---------- Order History ----------
async function loadOrderHistory(uid) {
  const qStatus = $("#order-status").value;
  const start = $("#order-start").value ? new Date($("#order-start").value) : null;
  const end = $("#order-end").value ? new Date($("#order-end").value) : null;
  const search = $("#order-search").value.trim();

  try {
    // Query with orderBy (requires composite index)
    let q = db.collection("orders")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc");
    
    const snap = await q.get();

    let rows = [];
    snap.forEach((doc) => {
      const d = doc.data();
      const ts = d.createdAt?.toDate?.() || null;
      
      // Client-side filtering for status and dates
      if (qStatus && d.status !== qStatus) return;
      if (start && ts && ts < start) return;
      if (end && ts && ts > new Date(end.getTime() + 86400000 - 1)) return;
      
      rows.push({ id: doc.id, ...d });
    });

    if (search) {
      const s = search.replace(/\D/g, "");
      rows = rows.filter((r) => String(r.secondaryPhone || "").includes(s) || String(r.mainPhone || "").includes(s));
    }

    const tbody = $("#order-history-body");
    const empty = $("#order-history-empty");
    tbody.innerHTML = "";
    if (!rows.length) { show(empty); return; }
    hide(empty);
    rows.forEach((r) => {
      // Determine service type based on order type
      let serviceType = "Closed u-share Service";
      let quantity = "-";
      
      if (r.type === "streaming") {
        serviceType = `Streaming: ${r.serviceName || ""}`;
        quantity = r.packageName || "-";
      } else if (r.type === "alfa-gift") {
        serviceType = "Alfa Gift";
        quantity = r.packageSizeGB ? `${r.packageSizeGB} GB` : "-";
      } else if (r.type === "credits") {
        serviceType = "Credits";
        quantity = r.creditsAmount ? `${r.creditsAmount} Credits` : "-";
      } else if (r.type === "validity") {
        serviceType = "Validity";
        quantity = r.packageName || "-";
      } else if (r.type === "open-service") {
        serviceType = "Open u-share Service";
        quantity = r.packageSizeGB ? `${r.packageSizeGB} GB` : "-";
      } else if (r.packageSizeGB) {
        // Default to Closed u-share Service
        serviceType = "Closed u-share Service";
        quantity = `${r.packageSizeGB} GB`;
      }
      
      // Format status with rejection reason if applicable
      let statusDisplay = r.status;
      if (r.status === "rejected" && r.rejectionReason) {
        statusDisplay = `<span class="text-red-500">rejected</span><br><span class="text-xs text-gray-400">Reason: ${r.rejectionReason}</span>`;
      } else if (r.status === "rejected") {
        statusDisplay = `<span class="text-red-500">rejected</span>`;
      } else if (r.status === "approved") {
        statusDisplay = `<span class="text-green-500">approved</span>`;
      } else if (r.status === "pending") {
        statusDisplay = `<span class="text-yellow-500">pending</span>`;
      }
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="px-3 py-2">${r.createdAt?.toDate?.().toLocaleString?.() || "-"}</td>
        <td class="px-3 py-2">${serviceType}</td>
        <td class="px-3 py-2">${r.priceLBP ? formatLBP(r.priceLBP) : "-"}</td>
        <td class="px-3 py-2">${statusDisplay}</td>
        <td class="px-3 py-2">${quantity}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading order history:", err);
    const empty = $("#order-history-empty");
    if (empty) {
      empty.textContent = "Error loading order history";
      show(empty);
    }
  }
}

// ---------- Order History ----------
let showAllOrders = false;

async function exportOrdersToExcel(uid) {
  console.log("exportOrdersToExcel called with uid:", uid);
  try {
    // Get all user's orders
    console.log("Fetching orders from Firebase...");
    const ordersSnap = await db.collection("orders")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .get();
    
    console.log("Orders fetched:", ordersSnap.size);
    
    if (ordersSnap.empty) {
      alert("No orders to export");
      return;
    }
    
    // Prepare CSV data
    let csv = "Date,Service Type,Price (LBP),Status,Quantity,Phone\n";
    
    ordersSnap.forEach(doc => {
      const d = doc.data();
      const date = d.createdAt?.toDate?.().toLocaleString() || "-";
      
      let serviceType = "Closed u-share Service";
      if (d.type === "streaming") serviceType = `Streaming: ${d.serviceName || ""}`;
      else if (d.type === "alfa-gift") serviceType = "Alfa Gift";
      else if (d.type === "credits") serviceType = "Credits";
      else if (d.type === "validity") serviceType = "Validity";
      else if (d.type === "open-service") serviceType = "Open u-share Service";
      
      const price = d.priceLBP || 0;
      const status = d.status || "pending";
      
      let quantity = "-";
      if (d.type === "streaming") quantity = d.packageName || "-";
      else if (d.type === "validity") quantity = d.packageName || "-";
      else if (d.packageSizeGB) quantity = d.packageSizeGB + " GB";
      else if (d.creditsAmount) quantity = d.creditsAmount + " Credits";
      
      const phone = d.phone || d.secondaryPhone || "-";
      
      csv += `"${date}","${serviceType}",${price},"${status}","${quantity}","${phone}"\n`;
    });
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert("✅ Orders exported successfully!");
  } catch (error) {
    console.error("Error exporting orders:", error);
    alert("Failed to export orders");
  }
}

function initOrderHistory(uid) {
  const startInput = $("#order-start");
  const endInput = $("#order-end");
  const dateBtn = $("#order-date-btn");
  const dateLabel = $("#order-date-label");
  const toggleBtn = $("#toggle-all-orders-btn");
  
  // Set default to today
  const today = new Date().toISOString().split('T')[0];
  startInput.value = today;
  endInput.value = today;
  
  function updateDateLabel() {
    const start = startInput.value;
    const end = endInput.value;
    if (start && end) {
      dateLabel.textContent = `${start} to ${end}`;
    } else if (start) {
      dateLabel.textContent = `From ${start}`;
    } else if (end) {
      dateLabel.textContent = `Until ${end}`;
    } else {
      dateLabel.textContent = "Select Date Range";
    }
  }
  
  updateDateLabel();
  
  dateBtn.addEventListener("click", () => {
    startInput.showPicker?.();
  });
  
  startInput.addEventListener("change", () => {
    updateDateLabel();
    loadOrderHistory(uid);
  });
  
  endInput.addEventListener("change", () => {
    updateDateLabel();
    loadOrderHistory(uid);
  });
  
  $("#order-status").addEventListener("change", () => loadOrderHistory(uid));
  $("#order-search").addEventListener("input", () => loadOrderHistory(uid));
  
  // Export to Excel button
  const exportBtn = $("#export-orders-btn");
  if (exportBtn) {
    console.log("Export button found, attaching listener");
    exportBtn.addEventListener("click", async () => {
      console.log("Export button clicked!");
      await exportOrdersToExcel(uid);
    });
  } else {
    console.log("Export button NOT found");
  }
  
  // Toggle button for showing all orders
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      showAllOrders = !showAllOrders;
      
      if (showAllOrders) {
        // Show all orders - clear date filters
        startInput.value = "";
        endInput.value = "";
        toggleBtn.innerHTML = '<i data-feather="calendar" class="w-4 h-4"></i><span>Show Today Only</span>';
        toggleBtn.classList.remove("bg-blue-600");
        toggleBtn.classList.add("bg-purple-600", "hover:bg-purple-700");
      } else {
        // Show today only
        const today = new Date().toISOString().split('T')[0];
        startInput.value = today;
        endInput.value = today;
        toggleBtn.innerHTML = '<i data-feather="clock" class="w-4 h-4"></i><span>Show All Orders</span>';
        toggleBtn.classList.remove("bg-purple-600", "hover:bg-purple-700");
        toggleBtn.classList.add("bg-blue-600");
      }
      
      updateDateLabel();
      if (window.feather) feather.replace();
      loadOrderHistory(uid);
    });
  }
}

let currentStreamingPurchase = null;

function initStreamingPurchaseModal(uid) {
  window.uid = uid; // Store for modal open functions
  const modal = $("#streaming-purchase-modal");
  const cancelBtn = $("#streaming-purchase-cancel");
  const confirmBtn = $("#streaming-purchase-confirm");
  const confirmPaymentBtn = $("#streaming-confirm-payment-btn");
  const copyBtn = $("#streaming-copy-number-btn");
  
  let paymentConfirmed = false;
  
  // Copy number functionality
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText("03475704");
      copyBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
      setTimeout(() => {
        copyBtn.innerHTML = '<i data-feather="copy" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
      }, 2000);
    });
  }
  
  // Payment confirmation button
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener("click", () => {
      paymentConfirmed = true;
      confirmPaymentBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      confirmPaymentBtn.classList.add("bg-green-700");
      confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>Payment Confirmed ✓</span>';
      if (window.feather) feather.replace();
    });
  }
  
  // Cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      paymentConfirmed = false;
      if (confirmPaymentBtn) {
        confirmPaymentBtn.classList.remove("bg-green-700");
        confirmPaymentBtn.classList.add("bg-green-600", "hover:bg-green-700");
        confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
        if (window.feather) feather.replace();
      }
      currentStreamingPurchase = null;
    });
  }
  
  // Confirm button (Send to WhatsApp)
  if (confirmBtn) {
    confirmBtn.addEventListener("click", async () => {
      // CRITICAL: Check iOS FIRST
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (isIOS) {
        // iOS: Open immediately - use cached user data if available
        let userName = "User";
        try {
          const cachedUserData = window._cachedUserData || {};
          userName = `${cachedUserData.firstName || ""} ${cachedUserData.lastName || ""}`.trim() || "User";
        } catch (e) {}
        
        const purchaseData = currentStreamingPurchase || {};
        const message = `New Purchase Request\n\nName: ${userName}\nService: ${purchaseData.serviceName || "N/A"}\nPackage: ${purchaseData.packageName || "N/A"}\nPrice: ${formatLBP(purchaseData.price || 0)}\n\nI'll send you the proof image.`;
        const whatsappUrl = `https://wa.me/96171829887?text=${encodeURIComponent(message)}`;
        
        // Background save
        const purchase = purchaseData;
        const userId = uid;
        (async () => {
          try {
            const userDoc = await db.collection("users").doc(userId).get();
            const userData = userDoc.data() || {};
            await db.collection("orders").add({
              uid: userId,
              type: "streaming",
              serviceName: purchase.serviceName,
              packageName: purchase.packageName,
              priceLBP: purchase.price,
              phone: userData.phone || userData.secondaryPhone || userData.mainPhone || "",
              status: "pending",
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
          } catch (err) {
            console.error("Order save error:", err);
          }
        })();
        
        window.location = whatsappUrl;
        return;
      }
      
      // Non-iOS: Normal validation
      if (!paymentConfirmed) {
        $("#streaming-purchase-error").textContent = "Please confirm that you have transferred the money";
        return;
      }
      
      if (!currentStreamingPurchase) return;
      
      const purchaseData = {
        serviceName: currentStreamingPurchase.serviceName,
        packageName: currentStreamingPurchase.packageName,
        price: currentStreamingPurchase.price
      };
      
      let userName = "User";
      let userPhone = "";
      try {
        const cachedUserData = window._cachedUserData || {};
        userName = `${cachedUserData.firstName || ""} ${cachedUserData.lastName || ""}`.trim() || "User";
        userPhone = cachedUserData.phone || cachedUserData.secondaryPhone || cachedUserData.mainPhone || "";
      } catch (e) {}
      
      const message = `New Purchase Request

Name: ${userName}
Service: ${purchaseData.serviceName}
Package: ${purchaseData.packageName}
Price: ${formatLBP(purchaseData.price)}

I'll send you the proof image.`;
      
      const whatsappUrl = `https://wa.me/96171829887?text=${encodeURIComponent(message)}`;
      openWhatsApp(whatsappUrl);
      
      // Close modal immediately
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      paymentConfirmed = false;
      if (confirmPaymentBtn) {
        confirmPaymentBtn.classList.remove("bg-green-700");
        confirmPaymentBtn.classList.add("bg-green-600", "hover:bg-green-700");
        confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
        if (window.feather) feather.replace();
      }
      currentStreamingPurchase = null;
      
      // Now do async operations in background
      try {
        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data() || {};
        window._cachedUserData = userData;
        const actualUserPhone = userData.phone || userData.secondaryPhone || userData.mainPhone || "";
        
        await db.collection("orders").add({
          uid: uid,
          type: "streaming",
          serviceName: purchaseData.serviceName,
          packageName: purchaseData.packageName,
          priceLBP: purchaseData.price,
          phone: actualUserPhone,
          status: "pending",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        setTimeout(() => {
          alert("✅ Order saved! Your request is pending approval.");
        }, 500);
      } catch (error) {
        console.error("Error:", error);
        $("#streaming-purchase-error").textContent = "Failed to process request";
      }
    });
  }
}

function openStreamingPurchaseModal(packageData) {
  currentStreamingPurchase = packageData;
  const modal = $("#streaming-purchase-modal");
  const summary = $("#streaming-purchase-summary");
  
  summary.textContent = `You are about to purchase ${packageData.packageName} for ${formatLBP(packageData.price)}`;
  
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  
  // Pre-load user data for iOS WhatsApp messages (fire-and-forget)
  if (window.uid) {
    db.collection("users").doc(window.uid).get().then((doc) => {
      if (doc.exists) {
        window._cachedUserData = doc.data();
      }
    }).catch(() => {});
  }
  
  if (window.feather) feather.replace();
}

async function renderStreamingPackages(serviceName) {
  let container = null;
  if (serviceName === "Netflix") {
    container = document.querySelector("#netflix-packages-container");
  } else if (serviceName === "Shahed") {
    container = document.querySelector("#shahed-packages-container");
  } else if (serviceName === "OSN+") {
    container = document.querySelector("#osn-packages-container");
  }
  
  if (!container) {
    console.error("Container not found for", serviceName);
    return;
  }

  // Ensure promo UI exists for this streaming page. Some fallback/embedded pages
  // or cached HTML may be missing the promo block; inject it once if absent.
  try {
    let prefix = "";
    if (serviceName === "Netflix") prefix = "netflix";
    else if (serviceName === "Shahed") prefix = "shahed";
    else if (serviceName === "OSN+") prefix = "osn";

    if (prefix) {
      const promoInput = document.querySelector(`#${prefix}-promo-code-input`);
      if (!promoInput) {
        const promoHtml = `\n    <!-- Promo Code Section -->\n    <div class="mb-6 max-w-md">\n      <label class="block text-sm mb-2 text-gray-300">Have a promo code?</label>\n      <div class="flex gap-3">\n        <input \n          id="${prefix}-promo-code-input" \n          type="text" \n          placeholder="Enter promo code" \n          class="flex-1 px-4 py-2.5 rounded-lg input-dark text-sm"\n        />\n        <button \n          id="${prefix}-apply-promo-btn" \n          class="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"\n        >\n          Apply\n        </button>\n      </div>\n      <div id="${prefix}-promo-message" class="mt-2 text-sm"></div>\n    </div>\n`;
        // Insert the promo block before the packages container
        container.insertAdjacentHTML('beforebegin', promoHtml);
        console.debug(`Inserted promo block for streaming service: ${serviceName}`);
      }
    }
  } catch (err) {
    console.warn('Could not ensure promo block for', serviceName, err);
  }
  
  try {
    const packagesSnap = await db.collection("packages")
      .where("type", "==", "streaming")
      .where("streamingService", "==", serviceName)
      .where("active", "==", true)
      .get();
    
    container.innerHTML = "";
    
    if (packagesSnap.empty) {
      container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-400">No packages available</div>';
      return;
    }
    
    const packages = [];
    packagesSnap.forEach(doc => {
      packages.push({ id: doc.id, ...doc.data() });
    });
    
    // Determine button color based on service
    let buttonColor = "bg-blue-600 hover:bg-blue-700";
    if (serviceName === "Netflix") buttonColor = "bg-red-600 hover:bg-red-700";
    else if (serviceName === "Shahed") buttonColor = "bg-purple-600 hover:bg-purple-700";
    
    // Determine icon color
    let iconColor = "text-blue-400";
    if (serviceName === "Netflix") iconColor = "text-red-400";
    else if (serviceName === "Shahed") iconColor = "text-purple-400";
    
    // Determine which promo codes apply
    let promoApplied = false;
    let promoDiscount = 0;
    let promo2Applied = false;
    let promo2Discount = 0;
    
    if (serviceName === "Netflix") {
      promoApplied = netflixPromoCodeApplied;
      promoDiscount = netflixPromoDiscount;
      promo2Applied = netflixPromo2CodeApplied;
      promo2Discount = netflixPromo2Discount;
    } else if (serviceName === "Shahed") {
      promoApplied = shahedPromoCodeApplied;
      promoDiscount = shahedPromoDiscount;
      promo2Applied = shahedPromo2CodeApplied;
      promo2Discount = shahedPromo2Discount;
    } else if (serviceName === "OSN+") {
      promoApplied = osnPromoCodeApplied;
      promoDiscount = osnPromoDiscount;
      promo2Applied = osnPromo2CodeApplied;
      promo2Discount = osnPromo2Discount;
    }
    
    packages.forEach(pkg => {
      const originalPrice = pkg.priceLBP;
      const fakeOriginalPrice = originalPrice + 50000; // Add 50,000 LBP to create fake discount
      
      // Calculate total discount from both promo codes
      const totalDiscount = (promoApplied ? promoDiscount : 0) + (promo2Applied ? promo2Discount : 0);
      const discountedPrice = totalDiscount > 0 ? Math.max(0, Math.round(originalPrice - totalDiscount)) : originalPrice;
      const hasDiscount = promoApplied || promo2Applied;
      
      const qty = pkg.quantity !== undefined ? pkg.quantity : 0;
      let buttonDisabled = '';
      let buttonClass = buttonColor;
      
      if (qty === 0) {
        buttonDisabled = 'disabled';
        buttonClass = 'bg-gray-600 cursor-not-allowed text-gray-400';
      }
      
      // Get correct icon based on service
      let iconSvg = '';
      if (serviceName === "Netflix") {
        iconSvg = `<svg class="w-16 h-16 mx-auto mb-3 ${iconColor}" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c2.873-.086 4.958-.406 5.002-.398V1.05z"/>
        </svg>`;
      } else if (serviceName === "Shahed") {
        iconSvg = `<svg class="w-16 h-16 mx-auto mb-3 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>`;
      } else {
        iconSvg = `<svg class="w-16 h-16 mx-auto mb-3 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
        </svg>`;
      }
      
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "package-card-wrapper";
      cardWrapper.innerHTML = `
        <div class="package-card-inner flex flex-col">
          ${hasDiscount ? '<div class="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full z-20">' + Number(totalDiscount).toLocaleString() + ' LBP off</div>' : ''}
          <div class="text-center mb-4">
            ${iconSvg}
            <div class="text-2xl font-bold text-white mb-1">${pkg.description || "Package"}</div>
            <div class="text-sm text-gray-400">${serviceName}</div>
          </div>
          <div class="text-center mb-4">
            <!-- Always show fake original price with strikethrough -->
            <div class="text-sm text-gray-500 line-through">${formatLBP(fakeOriginalPrice)}</div>
            <div class="text-2xl font-bold text-white text-green-400">${formatLBP(discountedPrice)}</div>
          </div>
          <button ${buttonDisabled} class="streaming-pkg-buy w-full py-3 rounded-lg ${buttonClass} text-white font-semibold transition-all hover:scale-105" data-service="${serviceName}" data-package="${pkg.description}" data-price="${Math.round(discountedPrice)}">
            ${qty === 0 ? 'Sold Out' : 'Purchase'}
          </button>
        </div>
      `;
      container.appendChild(cardWrapper);
    });
    
    // Add event listeners to new buttons
    container.querySelectorAll(".streaming-pkg-buy").forEach(btn => {
      btn.addEventListener("click", () => {
        const serviceName = btn.getAttribute("data-service");
        const packageName = btn.getAttribute("data-package");
        const price = parseInt(btn.getAttribute("data-price"));
        
        openStreamingPurchaseModal({
          serviceName,
          packageName,
          price
        });
      });
    });
    
    // Add promo code button handlers based on service
    if (serviceName === "Netflix") {
      const applyBtn = $("#netflix-apply-promo-btn");
      if (applyBtn) {
        applyBtn.addEventListener("click", applyNetflixPromoCode);
      }
      const promoInput = $("#netflix-promo-code-input");
      if (promoInput) {
        promoInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            applyNetflixPromoCode();
          }
        });
      }
      
      // Add second promo code handlers
      const apply2Btn = $("#netflix-apply-promo2-btn");
      if (apply2Btn) {
        apply2Btn.addEventListener("click", applyNetflixPromo2Code);
      }
      const promo2Input = $("#netflix-promo2-code-input");
      if (promo2Input) {
        promo2Input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            applyNetflixPromo2Code();
          }
        });
      }
    } else if (serviceName === "Shahed") {
      const applyBtn = $("#shahed-apply-promo-btn");
      if (applyBtn) {
        applyBtn.addEventListener("click", applyShahedPromoCode);
      }
      const promoInput = $("#shahed-promo-code-input");
      if (promoInput) {
        promoInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            applyShahedPromoCode();
          }
        });
      }
      
      // Add second promo code handlers
      const apply2Btn = $("#shahed-apply-promo2-btn");
      if (apply2Btn) {
        apply2Btn.addEventListener("click", applyShahedPromo2Code);
      }
      const promo2Input = $("#shahed-promo2-code-input");
      if (promo2Input) {
        promo2Input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            applyShahedPromo2Code();
          }
        });
      }
    } else if (serviceName === "OSN+") {
      const applyBtn = $("#osn-apply-promo-btn");
      if (applyBtn) {
        applyBtn.addEventListener("click", applyOsnPromoCode);
      }
      const promoInput = $("#osn-promo-code-input");
      if (promoInput) {
        promoInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            applyOsnPromoCode();
          }
        });
      }
      
      // Add second promo code handlers
      const apply2Btn = $("#osn-apply-promo2-btn");
      if (apply2Btn) {
        apply2Btn.addEventListener("click", applyOsnPromo2Code);
      }
      const promo2Input = $("#osn-promo2-code-input");
      if (promo2Input) {
        promo2Input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            applyOsnPromo2Code();
          }
        });
      }
    }
    
  } catch (error) {
    console.error("Error loading streaming packages:", error);
    container.innerHTML = '<div class="col-span-full text-center py-8 text-red-400">Error loading packages</div>';
  }
}

function initServicePage() {
  console.log("Initializing service page");
  
  // Add back button handler
  const backBtn = $("#back-to-streaming");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      navTo("streaming");
    });
  }
  
  // Add streaming service navigation handlers
  const streamingBtns = $$(".streaming-enter");
  streamingBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const service = btn.getAttribute("data-service");
      if (service) {
        navTo(service);
      }
    });
  });
  
  // Load streaming packages dynamically based on current page
  setTimeout(() => {
    const currentHash = window.location.hash.replace("#", "");
    if (currentHash === "netflix") {
      renderStreamingPackages("Netflix");
    } else if (currentHash === "shahed") {
      renderStreamingPackages("Shahed");
    } else if (currentHash === "osn") {
      renderStreamingPackages("OSN+");
    }
  }, 100);
}

// ---------- App Boot ----------
function showAuth() {
  const landingView = document.getElementById('landing-view');
  const authView = document.getElementById('auth-view');
  const appShell = document.getElementById('app-shell');
  const loadingView = document.getElementById('loading-view');
  
  // Hide loading and other views
  if (loadingView) {
    loadingView.classList.add('hidden');
  }
  if (landingView) {
    landingView.classList.add('hidden');
  }
  if (authView) {
    authView.classList.remove('hidden');
    authView.classList.add('flex');
  }
  if (appShell) {
    appShell.classList.add('hidden');
  }
}
function showApp() {
  const landingView = document.getElementById('landing-view');
  const authView = document.getElementById('auth-view');
  const appShell = document.getElementById('app-shell');
  const loadingView = document.getElementById('loading-view');
  
  // Hide loading and other views
  if (loadingView) {
    loadingView.classList.add('hidden');
  }
  if (landingView) {
    landingView.classList.add('hidden');
  }
  if (authView) {
    authView.classList.add('hidden');
    authView.classList.remove('flex');
  }
  if (appShell) {
    appShell.classList.remove('hidden');
  }
}

async function checkFirstLogin(uid) {
  try {
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    
    if (!userData || userData.hasSeenWelcome !== true) {
      window.location.hash = "welcome-carousel";
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking first login:", error);
    return false;
  }
}

function initWelcomeCarousel(uid) {
  let currentSlide = 0;
  const slides = $$(".carousel-slide");
  const dots = $$(".carousel-dot");
  const prevBtn = $("#carousel-prev");
  const nextBtn = $("#carousel-next");
  const skipBtn = $("#carousel-skip");
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) slide.classList.add("active");
      else slide.classList.remove("active");
    });
    
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add("active", "bg-blue-600");
        dot.classList.remove("bg-gray-600");
      } else {
        dot.classList.remove("active", "bg-blue-600");
        dot.classList.add("bg-gray-600");
      }
    });
    
    if (index === 0) {
      prevBtn.disabled = true;
      prevBtn.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      prevBtn.disabled = false;
      prevBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
    
    if (index === slides.length - 1) {
      nextBtn.classList.add("hidden");
      skipBtn.classList.remove("hidden");
    } else {
      nextBtn.classList.remove("hidden");
      skipBtn.classList.add("hidden");
    }
  }
  
  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      showSlide(currentSlide);
    }
  });
  
  nextBtn.addEventListener("click", () => {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      showSlide(currentSlide);
    }
  });
  
  skipBtn.addEventListener("click", async () => {
    await db.collection("users").doc(uid).update({ hasSeenWelcome: true });
    navTo("profile");
  });
  
  if (window.feather) feather.replace();
  showSlide(0);
}

function bootForUser(user) {
  const uid = user.uid;
  
  // Page-specific initialization function (must be set BEFORE initRouting)
  window.currentPageInit = (route) => {
    if (route === "profile") {
      const updateInitial = bindProfileForm(uid);
      subscribeUserProfile(uid, updateInitial);
    } else if (route === "closed-services") {
      renderPackages();
    } else if (route === "open-services") {
      renderOpenPackages();
    } else if (route === "alfa-gifts") {
      renderAlfaPackages();
    } else if (route === "credits") {
      initCreditsPage(uid);
    } else if (route === "validity") {
      initValidityPage(uid);
    } else if (route === "streaming" || route === "netflix" || route === "shahed" || route === "osn") {
      initServicePage();
    } else if (route === "order-history") {
      initOrderHistory(uid);
      loadOrderHistory(uid);
    } else if (route === "welcome-carousel") {
      initWelcomeCarousel(uid);
    }
  };
  
  initTopBar();
  initSidebar();
  initPurchaseModal(uid);
  initAlfaPurchaseModal(uid);
  initStreamingPurchaseModal(uid);
  initValidityPurchaseModal(uid);
  initCreditsPurchaseModal(uid);
  const unsubProfile = subscribeUserProfile(uid, null);
  
  checkFirstLogin(uid).then(() => {
    initRouting();
  });

  // Help button visibility per page (example: show on closed-services)
  const helpBtn = $("#help-btn");
  if (helpBtn) {
    function applyHelp(route) {
      if (route === "closed-services") show(helpBtn); else hide(helpBtn);
    }
    applyHelp(window.location.hash.replace('#','') || 'profile');
    window.addEventListener("hashchange", () => applyHelp(window.location.hash.replace('#','')));
  }

  return () => {
    if (unsubProfile) unsubProfile();
  };
}

function showLoadingState() {
  const landingView = document.getElementById('landing-view');
  const authView = document.getElementById('auth-view');
  const appShell = document.getElementById('app-shell');
  const loadingView = document.getElementById('loading-view');
  
  // Hide all views initially
  if (landingView) {
    landingView.classList.add('hidden');
  }
  if (authView) {
    authView.classList.add('hidden');
    authView.classList.remove('flex');
  }
  if (appShell) {
    appShell.classList.add('hidden');
  }
  if (loadingView) {
    loadingView.classList.remove('hidden');
  }
}

function showLanding() {
  const landingView = document.getElementById('landing-view');
  const authView = document.getElementById('auth-view');
  const appShell = document.getElementById('app-shell');
  const loadingView = document.getElementById('loading-view');
  
  // Hide loading and other views
  if (loadingView) {
    loadingView.classList.add('hidden');
  }
  if (authView) {
    authView.classList.add('hidden');
    authView.classList.remove('flex');
  }
  if (appShell) {
    appShell.classList.add('hidden');
  }
  
  // Show landing view
  if (landingView) {
    landingView.classList.remove('hidden');
  }
  
  // Load landing page content dynamically
  if (window.loadLandingPage) {
    window.loadLandingPage();
  }
}

// Expose globally for use in other scripts
window.showLanding = showLanding;

function initApp() {
  initTheme();
  
  // Hide loading view immediately and show landing page
  // This gives users instant feedback instead of waiting for Firebase
  const loadingView = document.getElementById('loading-view');
  if (loadingView) {
    loadingView.classList.add('hidden');
  }
  
  // Show landing page immediately (optimistic display)
  showLanding();

  // Wait for Firebase to be ready, then check auth state
  function waitForFirebase(callback) {
    if (window.auth && window.db) {
      callback();
    } else {
      // Check every 100ms if Firebase is ready
      setTimeout(() => waitForFirebase(callback), 100);
    }
  }

  waitForFirebase(() => {
    // Firebase is ready, now initialize auth and check state
    initAuthView();
    
    // Also wire topbar theme button
    const topToggle = $("#toggle-theme");
    if (topToggle) topToggle.addEventListener("click", () => setTheme(!document.documentElement.classList.contains("dark")));

    let cleanup = null;
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Check if user is blocked
        try {
          const userDoc = await db.collection("users").doc(user.uid).get();
          const userData = userDoc.data();
          
          if (userData && userData.blocked) {
            // User is blocked - sign them out
            await auth.signOut();
            alert("Your account has been blocked. Please contact support for assistance.");
            showLanding();
            return;
          }
          
          // User is not blocked - proceed normally
          showApp();
          if (cleanup) cleanup();
          cleanup = bootForUser(user);
        } catch (error) {
          console.error("Error checking user status:", error);
          // If error checking, still allow login but log the error
          showApp();
          if (cleanup) cleanup();
          cleanup = bootForUser(user);
        }
      } else {
        if (cleanup) { cleanup(); cleanup = null; }
        // User logged out - hide app and show landing page
        showLanding();
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", initApp);

// Privacy Policy Modal
function initPrivacyPolicy() {
  const privacyBtn = $("#privacy-policy-btn");
  const privacyModal = $("#privacy-policy-modal");
  const privacyClose = $("#privacy-policy-close");
  const privacyAccept = $("#privacy-policy-accept");
  
  if (privacyBtn && privacyModal) {
    privacyBtn.addEventListener("click", () => {
      privacyModal.classList.remove("hidden");
      privacyModal.classList.add("flex");
      if (window.feather) feather.replace();
    });
    
    const closeModal = () => {
      privacyModal.classList.add("hidden");
      privacyModal.classList.remove("flex");
    };
    
    if (privacyClose) privacyClose.addEventListener("click", closeModal);
    if (privacyAccept) privacyAccept.addEventListener("click", closeModal);
    
    // Close on backdrop click
    privacyModal.addEventListener("click", (e) => {
      if (e.target === privacyModal) closeModal();
    });
  }
}

// Initialize privacy policy after DOM loads
setTimeout(initPrivacyPolicy, 500);
