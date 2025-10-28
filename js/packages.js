/* Package Modules
   Handles package rendering for Closed Services, Alfa Gifts, and Open Services
*/

// ---------- Closed Services Packages ----------
async function renderPackages() {
  const container = $("#packages-list");
  if (!container) return;
  
  container.innerHTML = '<p class="text-center text-gray-400 py-8">Loading packages...</p>';
  
  try {
    // Load packages from Firebase
    const packagesSnap = await db.collection("packages")
      .where("type", "==", "closed-service")
      .where("active", "==", true)
      .get();
    
    let packages = [];
    packagesSnap.forEach(doc => {
      packages.push({ id: doc.id, packageId: doc.id, ...doc.data() });
    });
    
    // Sort by size
    packages.sort((a, b) => (a.sizeGB || 0) - (b.sizeGB || 0));
    
    if (packages.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-400 py-8">No packages available</p>';
      return;
    }
    
    container.innerHTML = "";
    packages.forEach((p, idx) => {
      const originalPrice = p.priceLBP;
      const fakeOriginalPrice = originalPrice + 50000; // Add 50,000 LBP to create fake discount
      
      // Calculate total discount from both promo codes
      const totalDiscount = (promoCodeApplied ? promoDiscount : 0) + (promo2CodeApplied ? promo2Discount : 0);
      const discountedPrice = totalDiscount > 0 ? Math.max(0, Math.round(originalPrice - totalDiscount)) : originalPrice;
      const hasDiscount = promoCodeApplied || promo2CodeApplied;
      
      // Determine availability status
      const qty = p.quantity !== undefined ? p.quantity : 0;
      let availabilityBadge = '';
      let buttonDisabled = '';
      let buttonClass = 'bg-blue-600 hover:bg-blue-700 text-white';
      
      if (qty === 0) {
        availabilityBadge = '<div class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Sold Out</div>';
        buttonDisabled = 'disabled';
        buttonClass = 'bg-gray-400 cursor-not-allowed text-gray-700';
      } else if (qty <= 2) {
        availabilityBadge = '<div class="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Low Stock</div>';
      } else {
        availabilityBadge = '<div class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Available</div>';
      }
    
      const card = document.createElement("div");
      card.className = "package-card-wrapper";
      card.innerHTML = `
        <div class="package-card-inner flex flex-col">
          ${availabilityBadge}
          ${hasDiscount ? '<div class="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full z-20">' + Number(totalDiscount).toLocaleString() + ' LBP off</div>' : ''}
          
          <div class="text-center mb-4">
            <svg class="w-16 h-16 mx-auto mb-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
            <div class="text-3xl font-bold text-white mb-1">${p.sizeGB}GB</div>
            <div class="text-sm text-gray-400">Data Package</div>
          </div>
          
          <div class="text-center mb-4">
            <!-- Always show fake original price with strikethrough -->
            <div class="text-sm text-gray-500 line-through">${formatLBP(fakeOriginalPrice)}</div>
            <div class="text-2xl font-bold text-white text-green-400">${formatLBP(discountedPrice)}</div>
          </div>
          
          <button data-idx="${idx}" data-price="${discountedPrice}" data-package-id="${p.id || ''}" ${buttonDisabled} class="pkg-buy w-full py-3 rounded-lg ${buttonClass} font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-105">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span>${qty === 0 ? 'Sold Out' : 'Purchase'}</span>
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll(".pkg-buy").forEach((btn) => btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-idx");
      const p = packages[idx];
      const discountedPrice = parseFloat(btn.getAttribute("data-price"));
      openPurchaseModal({ ...p, priceLBP: discountedPrice });
    }));
    
    // Add promo code button handler
    const applyBtn = $("#apply-promo-btn");
    if (applyBtn) {
      applyBtn.addEventListener("click", applyPromoCode);
    }
    
    // Allow Enter key to apply promo code
    const promoInput = $("#promo-code-input");
    if (promoInput) {
      promoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          applyPromoCode();
        }
      });
    }
  } catch (error) {
    console.error("Error loading packages:", error);
    container.innerHTML = '<p class="text-center text-red-400 py-8">Error loading packages</p>';
  }
}

// ---------- Alfa Gifts Packages ----------
async function renderAlfaPackages() {
  const container = $("#alfa-packages-list");
  if (!container) return;
  
  container.innerHTML = '<p class="text-center text-gray-400 py-8">Loading packages...</p>';
  
  try {
    // Load packages from Firebase
    const packagesSnap = await db.collection("packages")
      .where("type", "==", "alfa-gift")
      .where("active", "==", true)
      .get();
    
    let packages = [];
    packagesSnap.forEach(doc => {
      packages.push({ id: doc.id, packageId: doc.id, ...doc.data() });
    });
    
    // Sort by size
    packages.sort((a, b) => (a.sizeGB || 0) - (b.sizeGB || 0));
    
    if (packages.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-400 py-8">No packages available</p>';
      return;
    }
    
    container.innerHTML = "";
    packages.forEach((p, idx) => {
      const originalPrice = p.priceLBP;
      const fakeOriginalPrice = originalPrice + 50000; // Add 50,000 LBP to create fake discount
      
      const discountedPrice = alfaPromoCodeApplied ? Math.max(0, Math.round(originalPrice - alfaPromoDiscount)) : originalPrice;
      const hasDiscount = alfaPromoCodeApplied;
      
      // Determine availability status
      const qty = p.quantity !== undefined ? p.quantity : 0;
      let availabilityBadge = '';
      let buttonDisabled = '';
      let buttonClass = 'bg-blue-600 hover:bg-blue-700 text-white';
      
      if (qty === 0) {
        availabilityBadge = '<div class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Sold Out</div>';
        buttonDisabled = 'disabled';
        buttonClass = 'bg-gray-400 cursor-not-allowed text-gray-700';
      } else if (qty <= 2) {
        availabilityBadge = '<div class="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Low Stock</div>';
      } else {
        availabilityBadge = '<div class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Available</div>';
      }
    
      const card = document.createElement("div");
      card.className = "package-card-wrapper";
      card.innerHTML = `
        <div class="package-card-inner flex flex-col">
          ${availabilityBadge}
          ${hasDiscount ? '<div class="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full z-20">' + Number(alfaPromoDiscount).toLocaleString() + ' LBP off</div>' : ''}
          <div class="text-center mb-4">
            <svg class="w-16 h-16 mx-auto mb-3 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm10 16H4V9h16v11z"/>
            </svg>
            <div class="text-3xl font-bold text-white mb-1">${p.sizeGB}GB</div>
            <div class="text-sm text-gray-400">Gift Package</div>
          </div>
          <div class="text-center mb-4">
            <!-- Always show fake original price with strikethrough -->
            <div class="text-sm text-gray-500 line-through">${formatLBP(fakeOriginalPrice)}</div>
            <div class="text-2xl font-bold text-white text-green-400">${formatLBP(discountedPrice)}</div>
          </div>
          <button data-idx="${idx}" data-price="${discountedPrice}" data-package-id="${p.id || ''}" ${buttonDisabled} class="alfa-pkg-buy w-full py-3 rounded-lg ${buttonClass} font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-105">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span>${qty === 0 ? 'Sold Out' : 'Recharge'}</span>
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll(".alfa-pkg-buy").forEach((btn) => btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-idx");
      const p = packages[idx];
      const discountedPrice = parseFloat(btn.getAttribute("data-price"));
      openAlfaPurchaseModal({ ...p, priceLBP: discountedPrice });
    }));
    
    // Add promo code button handler
    const applyBtn = $("#alfa-apply-promo-btn");
    if (applyBtn) {
      applyBtn.addEventListener("click", applyAlfaPromoCode);
    }
    
    // Allow Enter key to apply promo code
    const promoInput = $("#alfa-promo-code-input");
    if (promoInput) {
      promoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          applyAlfaPromoCode();
        }
      });
    }
  } catch (error) {
    console.error("Error loading Alfa packages:", error);
    container.innerHTML = '<p class="text-center text-red-400 py-8">Error loading packages</p>';
  }
}

// ---------- Open Services Packages ----------
async function renderOpenPackages() {
  const container = $("#open-packages-list");
  if (!container) return;
  
  container.innerHTML = '<p class="text-center text-gray-400 py-8">Loading packages...</p>';
  
  try {
    // Load packages from Firebase
    const packagesSnap = await db.collection("packages")
      .where("type", "==", "open-service")
      .where("active", "==", true)
      .get();
    
    let packages = [];
    packagesSnap.forEach(doc => {
      packages.push({ id: doc.id, packageId: doc.id, ...doc.data() });
    });
    
    // Sort by size
    packages.sort((a, b) => (a.sizeGB || 0) - (b.sizeGB || 0));
    
    if (packages.length === 0) {
      container.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-16">
          <svg class="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
          </svg>
          <h4 class="text-xl font-semibold mb-2">No Packages Available</h4>
          <p class="text-gray-400 text-center">Check back later for available packages</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = "";
    packages.forEach((p, idx) => {
      const originalPrice = p.priceLBP;
      const fakeOriginalPrice = originalPrice + 50000; // Add 50,000 LBP to create fake discount
      
      const discountedPrice = openPromoCodeApplied ? Math.max(0, Math.round(originalPrice - openPromoDiscount)) : originalPrice;
      const hasDiscount = openPromoCodeApplied;
      
      // Determine availability status
      const qty = p.quantity !== undefined ? p.quantity : 0;
      let availabilityBadge = '';
      let buttonDisabled = '';
      let buttonClass = 'bg-blue-600 hover:bg-blue-700 text-white';
      
      if (qty === 0) {
        availabilityBadge = '<div class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Sold Out</div>';
        buttonDisabled = 'disabled';
        buttonClass = 'bg-gray-400 cursor-not-allowed text-gray-700';
      } else if (qty <= 2) {
        availabilityBadge = '<div class="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Low Stock</div>';
      } else {
        availabilityBadge = '<div class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Available</div>';
      }
      
      const card = document.createElement("div");
      card.className = "package-card-wrapper";
      card.innerHTML = `
        <div class="package-card-inner flex flex-col">
          ${availabilityBadge}
          ${hasDiscount ? '<div class="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full z-20">' + Number(openPromoDiscount).toLocaleString() + ' LBP off</div>' : ''}
          <div class="text-center mb-4">
            <svg class="w-16 h-16 mx-auto mb-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
            <div class="text-3xl font-bold text-white mb-1">${p.sizeGB}GB</div>
            <div class="text-sm text-gray-400">Open Service Package</div>
          </div>
          <div class="text-center mb-4">
            <!-- Always show fake original price with strikethrough -->
            <div class="text-sm text-gray-500 line-through">${formatLBP(fakeOriginalPrice)}</div>
            <div class="text-2xl font-bold text-white text-green-400">${formatLBP(discountedPrice)}</div>
          </div>
          <button data-idx="${idx}" data-price="${discountedPrice}" data-package-id="${p.id || ''}" ${buttonDisabled} class="open-pkg-buy w-full py-3 rounded-lg ${buttonClass} font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-105">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span>${qty === 0 ? 'Sold Out' : 'Purchase'}</span>
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll(".open-pkg-buy").forEach((btn) => btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-idx");
      const p = packages[idx];
      const discountedPrice = parseFloat(btn.getAttribute("data-price"));
      openPurchaseModal({ ...p, priceLBP: discountedPrice });
    }));
    
    // Add promo code button handler
    const applyBtn = $("#open-apply-promo-btn");
    if (applyBtn) {
      applyBtn.addEventListener("click", applyOpenPromoCode);
    }
    
    // Allow Enter key to apply promo code
    const promoInput = $("#open-promo-code-input");
    if (promoInput) {
      promoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          applyOpenPromoCode();
        }
      });
    }
    
  } catch (error) {
    console.error("Error loading Open Services packages:", error);
    container.innerHTML = '<p class="text-center text-red-400 py-8">Error loading packages</p>';
  }
}
