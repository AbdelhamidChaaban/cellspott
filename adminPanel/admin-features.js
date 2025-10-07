// ==================== PACKAGE MANAGEMENT ====================
async function loadPackages() {
  const content = $("#admin-content");
  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Package Management</h2>
        <button onclick="showAddPackageModal()" class="px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium transition-colors flex items-center gap-2">
          <i data-feather="plus" class="w-4 h-4"></i>
          <span>Add Package</span>
        </button>
      </div>
      
      <!-- Service Type Tabs -->
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <div class="flex gap-2 mb-6 overflow-x-auto">
          <button onclick="loadPackagesByType('closed-service')" data-pkg-tab="closed-service" class="pkg-tab px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
            Closed u-share
          </button>
          <button onclick="loadPackagesByType('open-service')" data-pkg-tab="open-service" class="pkg-tab px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
            Open u-share
          </button>
          <button onclick="loadPackagesByType('alfa-gift')" data-pkg-tab="alfa-gift" class="pkg-tab px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
            Alfa Gifts
          </button>
          <button onclick="loadPackagesByType('validity')" data-pkg-tab="validity" class="pkg-tab px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
            Validity
          </button>
          <button onclick="loadPackagesByType('streaming')" data-pkg-tab="streaming" class="pkg-tab px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
            Streaming
          </button>
        </div>
        
        <div id="packages-list-container">
          <p class="text-gray-400 text-center py-8">Select a service type to view packages</p>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Package Modal -->
    <div id="package-modal" class="hidden fixed inset-0 bg-black/70 backdrop-blur-sm items-center justify-center p-4 z-50">
      <div class="card-bg border border-navy-600 rounded-2xl w-full max-w-md p-6">
        <h3 class="text-xl font-bold mb-4" id="package-modal-title">Add Package</h3>
        <form id="package-form" class="space-y-4">
          <input type="hidden" id="package-id">
          
          <div>
            <label class="block text-sm font-medium mb-2">Service Type</label>
            <select id="package-type" required onchange="toggleStreamingFields()" class="w-full px-4 py-2 rounded-lg input-dark">
              <option value="closed-service">Closed u-share Service</option>
              <option value="open-service">Open u-share Service</option>
              <option value="alfa-gift">Alfa Gift</option>
              <option value="validity">Validity</option>
              <option value="streaming">Streaming</option>
            </select>
          </div>
          
          <div id="streaming-service-field" class="hidden">
            <label class="block text-sm font-medium mb-2">Streaming Service</label>
            <select id="streaming-service" class="w-full px-4 py-2 rounded-lg input-dark">
              <option value="Netflix">Netflix</option>
              <option value="Shahed">Shahed</option>
              <option value="OSN+">OSN+</option>
            </select>
          </div>
          
          <div id="streaming-description-field" class="hidden">
            <label class="block text-sm font-medium mb-2">Package Description</label>
            <input type="text" id="streaming-description" placeholder="e.g., 1 User - 1 Month" class="w-full px-4 py-2 rounded-lg input-dark">
            <p class="text-xs text-gray-400 mt-1">Description shown to customers</p>
          </div>
          
          <div id="validity-description-field" class="hidden">
            <label class="block text-sm font-medium mb-2">Validity Duration</label>
            <input type="text" id="validity-description" placeholder="e.g., 1 Month" class="w-full px-4 py-2 rounded-lg input-dark">
            <p class="text-xs text-gray-400 mt-1">Duration shown to customers</p>
          </div>
          
          <div id="package-size-field">
            <label class="block text-sm font-medium mb-2">Package Size (GB)</label>
            <input type="number" id="package-size" step="0.1" min="0" placeholder="e.g., 5.5" class="w-full px-4 py-2 rounded-lg input-dark">
            <p class="text-xs text-gray-400 mt-1">Leave empty for Validity/Streaming</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Price (LBP)</label>
            <input type="number" id="package-price" step="1000" min="0" placeholder="e.g., 540000" class="w-full px-4 py-2 rounded-lg input-dark">
            <p class="text-xs text-gray-400 mt-1">Required for all types</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Quantity Available</label>
            <input type="number" id="package-quantity" min="0" placeholder="e.g., 10" required class="w-full px-4 py-2 rounded-lg input-dark">
            <p class="text-xs text-gray-400 mt-1">0 = Sold Out, 1-2 = Low Stock, 3+ = Available</p>
          </div>
          
          <div>
            <label class="flex items-center gap-2">
              <input type="checkbox" id="package-active" checked class="w-4 h-4">
              <span class="text-sm">Active (visible to customers)</span>
            </label>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" onclick="closePackageModal()" class="flex-1 px-4 py-2 rounded-lg bg-navy-700 hover:bg-navy-600 text-white font-medium">
              Cancel
            </button>
            <button type="submit" class="flex-1 px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white font-medium">
              Save Package
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  if (window.feather) feather.replace();
  
  // Set up form handler
  $("#package-form").addEventListener("submit", savePackage);
  
  // Load default type
  await loadPackagesByType("closed-service");
}

let currentPackageType = "closed-service";

async function loadPackagesByType(type) {
  currentPackageType = type;
  
  // Update tab styles
  $$(".pkg-tab").forEach(tab => {
    if (tab.getAttribute("data-pkg-tab") === type) {
      tab.classList.add("bg-brand", "text-white");
      tab.classList.remove("bg-navy-700", "text-gray-400");
    } else {
      tab.classList.remove("bg-brand", "text-white");
      tab.classList.add("bg-navy-700", "text-gray-400");
    }
  });
  
  const container = $("#packages-list-container");
  container.innerHTML = '<p class="text-gray-400 text-center py-8">Loading packages...</p>';
  
  try {
    const packagesSnap = await db.collection("packages")
      .where("type", "==", type)
      .get();
    
    if (packagesSnap.empty) {
      container.innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-400 mb-4">No packages found for this service type</p>
          <button onclick="showAddPackageModal('${type}')" class="px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium">
            Add First Package
          </button>
        </div>
      `;
      return;
    }
    
    // Get packages and sort in JavaScript
    let packages = [];
    packagesSnap.forEach(doc => {
      packages.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by sizeGB ascending
    packages.sort((a, b) => (a.sizeGB || 0) - (b.sizeGB || 0));
    
    container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
    
    packages.forEach(pkg => {
      
      const card = document.createElement("div");
      card.className = "bg-navy-800 border border-navy-600 rounded-lg p-4";
      const qty = pkg.quantity !== undefined ? pkg.quantity : 0;
      let qtyColor = 'bg-red-500/20 text-red-500';
      let qtyText = 'Sold Out';
      if (qty >= 3) {
        qtyColor = 'bg-green-500/20 text-green-500';
        qtyText = `${qty} Available`;
      } else if (qty >= 1) {
        qtyColor = 'bg-yellow-500/20 text-yellow-500';
        qtyText = `${qty} Low Stock`;
      }
      
      let displayTitle = "No Size";
      if (pkg.type === "streaming") {
        displayTitle = `${pkg.streamingService || ""} - ${pkg.description || ""}`;
      } else if (pkg.type === "validity") {
        displayTitle = pkg.description || "Validity";
      } else if (pkg.sizeGB) {
        displayTitle = `${pkg.sizeGB} GB`;
      }
      
      card.innerHTML = `
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="font-bold text-lg">${displayTitle}</p>
            <p class="text-sm text-gray-400">${pkg.priceLBP ? formatLBP(pkg.priceLBP) : "No Price"}</p>
            <p class="text-xs mt-1"><span class="px-2 py-0.5 rounded ${qtyColor}">${qtyText}</span></p>
          </div>
          <span class="px-2 py-1 rounded text-xs ${pkg.active ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}">
            ${pkg.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div class="flex gap-2">
          <button onclick="editPackage('${pkg.id}')" class="flex-1 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">
            Edit
          </button>
          <button onclick="deletePackage('${pkg.id}')" class="flex-1 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium">
            Delete
          </button>
        </div>
      `;
      
      grid.appendChild(card);
    });
    
    container.appendChild(grid);
    
  } catch (error) {
    console.error("Error loading packages:", error);
    container.innerHTML = '<p class="text-red-400 text-center py-8">Error loading packages</p>';
  }
}

function toggleStreamingFields() {
  const type = $("#package-type").value;
  const streamingServiceField = $("#streaming-service-field");
  const streamingDescField = $("#streaming-description-field");
  const validityDescField = $("#validity-description-field");
  const sizeField = $("#package-size-field");
  
  if (type === "streaming") {
    streamingServiceField.classList.remove("hidden");
    streamingDescField.classList.remove("hidden");
    validityDescField.classList.add("hidden");
    sizeField.classList.add("hidden");
  } else if (type === "validity") {
    streamingServiceField.classList.add("hidden");
    streamingDescField.classList.add("hidden");
    validityDescField.classList.remove("hidden");
    sizeField.classList.add("hidden");
  } else {
    streamingServiceField.classList.add("hidden");
    streamingDescField.classList.add("hidden");
    validityDescField.classList.add("hidden");
    sizeField.classList.remove("hidden");
  }
}

function showAddPackageModal(type = null) {
  $("#package-modal-title").textContent = "Add Package";
  $("#package-form").reset();
  $("#package-id").value = "";
  if (type) $("#package-type").value = type;
  else $("#package-type").value = currentPackageType;
  toggleStreamingFields();
  const modal = $("#package-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closePackageModal() {
  const modal = $("#package-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

async function editPackage(packageId) {
  try {
    const doc = await db.collection("packages").doc(packageId).get();
    if (!doc.exists) {
      alert("Package not found");
      return;
    }
    
    const pkg = doc.data();
    $("#package-modal-title").textContent = "Edit Package";
    $("#package-id").value = packageId;
    $("#package-type").value = pkg.type;
    $("#package-size").value = pkg.sizeGB || "";
    $("#package-price").value = pkg.priceLBP || "";
    $("#package-quantity").value = pkg.quantity !== undefined ? pkg.quantity : 0;
    $("#package-active").checked = pkg.active !== false;
    
    // Set streaming fields if applicable
    if (pkg.type === "streaming") {
      $("#streaming-service").value = pkg.streamingService || "Netflix";
      $("#streaming-description").value = pkg.description || "";
    } else if (pkg.type === "validity") {
      $("#validity-description").value = pkg.description || "";
    }
    
    toggleStreamingFields();
    
    const modal = $("#package-modal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  } catch (error) {
    console.error("Error loading package:", error);
    alert("Failed to load package");
  }
}

async function savePackage(e) {
  e.preventDefault();
  
  const packageId = $("#package-id").value;
  const type = $("#package-type").value;
  const size = parseFloat($("#package-size").value) || null;
  const price = parseFloat($("#package-price").value) || null;
  const quantity = parseInt($("#package-quantity").value) || 0;
  const active = $("#package-active").checked;
  
  const packageData = {
    type,
    quantity,
    active,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedBy: currentAdmin.username
  };
  
  // Add type-specific fields
  if (type === "streaming") {
    packageData.streamingService = $("#streaming-service").value;
    packageData.description = $("#streaming-description").value;
    packageData.priceLBP = price;
  } else if (type === "validity") {
    packageData.description = $("#validity-description").value;
    packageData.priceLBP = price;
  } else {
    // Add regular package fields
    packageData.sizeGB = size;
    packageData.priceLBP = price;
  }
  
  try {
    if (packageId) {
      // Update existing
      await db.collection("packages").doc(packageId).update(packageData);
      alert("Package updated successfully!");
    } else {
      // Create new
      packageData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      packageData.createdBy = currentAdmin.username;
      await db.collection("packages").add(packageData);
      alert("Package added successfully!");
    }
    
    closePackageModal();
    await loadPackagesByType(type);
  } catch (error) {
    console.error("Error saving package:", error);
    alert("Failed to save package");
  }
}

async function deletePackage(packageId) {
  if (!confirm("Are you sure you want to delete this package? This action cannot be undone.")) return;
  
  try {
    await db.collection("packages").doc(packageId).delete();
    alert("Package deleted successfully!");
    await loadPackagesByType(currentPackageType);
  } catch (error) {
    console.error("Error deleting package:", error);
    alert("Failed to delete package");
  }
}

// Make functions global
window.loadPackages = loadPackages;
window.loadPackagesByType = loadPackagesByType;
window.showAddPackageModal = showAddPackageModal;
window.closePackageModal = closePackageModal;
window.editPackage = editPackage;
window.deletePackage = deletePackage;

// ==================== USER MANAGEMENT ====================
async function loadUsers() {
  const content = $("#admin-content");
  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">User Management</h2>
      </div>
      
      <!-- Search -->
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <input id="user-search" oninput="refreshUsers()" type="text" placeholder="Search by name, email, or phone..." class="w-full px-4 py-2 rounded-lg input-dark">
      </div>
      
      <!-- Users Table -->
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-navy-600">
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Name</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Email</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Phone</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Balance</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Status</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody id="users-table-body">
              <tr><td colspan="6" class="text-center py-8 text-gray-400">Loading users...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  if (window.feather) feather.replace();
  await refreshUsers();
}

async function refreshUsers() {
  try {
    const searchQuery = $("#user-search")?.value.trim().toLowerCase() || "";
    
    // Fetch users, creditRequests and orders to compute balances
    const [usersSnap, creditSnap, ordersSnap] = await Promise.all([
      db.collection("users").get(),
      db.collection("creditRequests").get(),
      db.collection("orders").get()
    ]);

    console.log('admin-features.refreshUsers: users=', usersSnap.size, 'credits=', creditSnap.size, 'orders=', ordersSnap.size);

    let users = [];
    usersSnap.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort users by creation date first to get proper order
    users.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateA - dateB;
    });
    
    // Apply search filter
    if (searchQuery) {
      users = users.filter(u => 
        (u.firstName && u.firstName.toLowerCase().includes(searchQuery)) ||
        (u.lastName && u.lastName.toLowerCase().includes(searchQuery)) ||
        (u.email && u.email.toLowerCase().includes(searchQuery)) ||
        (u.phone && u.phone.includes(searchQuery))
      );
    }
    
    const tbody = $("#users-table-body");
    
    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-400">No users found</td></tr>';
      return;
    }
    
    tbody.innerHTML = "";
    
    // Aggregate credits and spent across all documents (no date filter in this simpler view)
    const creditSums = {}; // uid -> sum
    creditSnap.forEach(doc => {
      const d = doc.data();
      const uid = d.uid;
      const status = (d.status || '').toString().toLowerCase();
      const acceptedStatuses = ['approved','processed','completed','paid'];
      if (!acceptedStatuses.includes(status)) return;
      const amount = Number(d.amountLBP) || 0;
      creditSums[uid] = (creditSums[uid] || 0) + amount;
    });

    const spentSums = {};
    ordersSnap.forEach(doc => {
      const d = doc.data();
      const uid = d.uid;
      const status = (d.status || '').toString().toLowerCase();
      const acceptedOrderStatuses = ['approved','completed','paid'];
      if (!acceptedOrderStatuses.includes(status)) return;
      const price = Number(d.priceLBP) || 0;
      spentSums[uid] = (spentSums[uid] || 0) + price;
    });

    for (const user of users) {
      const uid = user.id;
      const isBlocked = user.blocked || false;
      
      const statusBadge = isBlocked 
        ? '<span class="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">Blocked</span>'
        : '<span class="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">Active</span>';
      
      const actionButton = isBlocked
        ? `<button onclick="unblockUser('${uid}')" class="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-medium">Unblock</button>`
        : `<button onclick="blockUser('${uid}')" class="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-medium">Block</button>`;
      
      const tr = document.createElement("tr");
      tr.className = "border-b border-navy-700 hover:bg-navy-800";
      // Compute balance = stored + credits - spent
      const stored = Number(user.balanceLBP) || 0;
      const credits = Number(creditSums[uid] || 0);
      const spent = Number(spentSums[uid] || 0);
      const balance = stored + credits - spent;

      tr.innerHTML = `
        <td class="px-4 py-3 text-sm">${user.firstName || ""} ${user.lastName || ""}</td>
  <td class="px-4 py-3 text-sm">${user.email || ""}</td>
  <td class="px-4 py-3 text-sm">${user.phone || ""}</td>
  <td class="px-4 py-3 text-sm" style="--tw-content:''">${formatLBP(balance || 0)}</td>
        <td class="px-4 py-3">${statusBadge}</td>
        <td class="px-4 py-3">${actionButton}</td>
      `;
      
      tbody.appendChild(tr);
    }
    
  } catch (error) {
    console.error("Error loading users:", error);
    $("#users-table-body").innerHTML = '<tr><td colspan="6" class="text-center py-8 text-red-400">Error loading users</td></tr>';
  }
}

async function viewUserOrders(userId) {
  // Switch to orders tab and filter by user
  switchTab("orders");
  
  // Set a global filter for this user
  window.currentUserFilter = userId;
  
  // Refresh orders with user filter
  await refreshOrders();
}

window.loadUsers = loadUsers;
window.refreshUsers = refreshUsers;
window.viewUserOrders = viewUserOrders;

// ==================== SETTINGS ====================
async function loadSettings() {
  const content = $("#admin-content");
  content.innerHTML = `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold">System Settings</h2>
      
      <!-- Promo Code Settings -->
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <h3 class="text-lg font-bold mb-4">Promo Code Management</h3>
        <p class="text-sm text-gray-400 mb-6">Set the active promo code and discount that customers can use when purchasing packages.</p>
        
        <form id="promo-settings-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Active Promo Code</label>
            <input type="text" id="promo-code" placeholder="Enter promo code (e.g., SUMMER2024)" class="w-full px-4 py-2 rounded-lg input-dark" required>
            <p class="text-xs text-gray-400 mt-1">This is the code customers will enter to get a discount</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Discount Amount (LBP)</label>
            <input type="number" id="promo-discount" min="0" step="1000" placeholder="50000" class="w-full px-4 py-2 rounded-lg input-dark" required>
            <p class="text-xs text-gray-400 mt-1">Enter fixed amount in LBP to subtract from package price (e.g., 50000)</p>
          </div>
          <div class="flex items-center gap-2 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <i data-feather="info" class="w-5 h-5 text-blue-400"></i>
            <p class="text-sm text-blue-300">Changes take effect immediately for all customers</p>
          </div>
          <button type="submit" class="px-6 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white font-medium transition-colors">
            Save Promo Code Settings
          </button>
        </form>
        
        <div id="promo-current-settings" class="mt-6 p-4 bg-navy-800 rounded-lg hidden">
          <p class="text-sm font-medium mb-2">Current Active Promo Code:</p>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-bold text-brand" id="current-promo-code">-</p>
              <p class="text-sm text-gray-400" id="current-promo-discount">-</p>
            </div>
            <span class="px-3 py-1 rounded bg-green-500/20 text-green-500 text-sm font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  if (window.feather) feather.replace();
  
  // Load saved settings
  await loadSavedSettings();
  
  // Set up form handler
  $("#promo-settings-form").addEventListener("submit", savePromoSettings);
}

async function loadSavedSettings() {
  try {
    const settingsDoc = await db.collection("settings").doc("promoCode").get();
    if (settingsDoc.exists) {
      const settings = settingsDoc.data();
      if (settings.code) {
        $("#promo-code").value = settings.code;
        $("#current-promo-code").textContent = settings.code;
      }
      if (settings.discount !== undefined) {
        // discount is stored as an amount in LBP
        $("#promo-discount").value = settings.discount;
        $("#current-promo-discount").textContent = `${Number(settings.discount).toLocaleString()} LBP discount`;
      }
      
      // Show current settings
      if (settings.code && settings.discount !== undefined) {
        $("#promo-current-settings").classList.remove("hidden");
      }
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
}

async function savePromoSettings(e) {
  e.preventDefault();
  const code = $("#promo-code").value.trim();
  const discount = parseFloat($("#promo-discount").value);
  
  if (!code) {
    alert("Please enter a promo code");
    return;
  }
  
  if (isNaN(discount) || discount < 0) {
    alert("Please enter a valid discount amount in LBP (>= 0)");
    return;
  }
  
  try {
    // Save to Firebase
    // Save discount as an amount in LBP
    await db.collection("settings").doc("promoCode").set({
      code: code,
      discount: discount,
      active: true,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: currentAdmin.username
    });
    
    // Update display
  $("#current-promo-code").textContent = code;
  $("#current-promo-discount").textContent = `${Number(discount).toLocaleString()} LBP discount`;
    $("#promo-current-settings").classList.remove("hidden");
    
  alert(`Promo code saved successfully!\n\nCode: ${code}\nDiscount: ${Number(discount).toLocaleString()} LBP\n\nCustomers can now use this code!`);
  } catch (error) {
    console.error("Error saving promo code:", error);
    alert("Failed to save promo code settings");
  }
}

window.loadSettings = loadSettings;



async function blockUser(uid) {
  if (!confirm("Are you sure you want to block this user? They will not be able to access the website.")) {
    return;
  }
  
  try {
    await db.collection("users").doc(uid).update({
      blocked: true,
      blockedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    alert("User blocked successfully!");
    await refreshUsers();
  } catch (error) {
    console.error("Error blocking user:", error);
    alert("Failed to block user");
  }
}

async function unblockUser(uid) {
  if (!confirm("Are you sure you want to unblock this user?")) {
    return;
  }
  
  try {
    await db.collection("users").doc(uid).update({
      blocked: false,
      unblockedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    alert("User unblocked successfully!");
    await refreshUsers();
  } catch (error) {
    console.error("Error unblocking user:", error);
    alert("Failed to unblock user");
  }
}

window.loadUsers = loadUsers;
window.blockUser = blockUser;
window.unblockUser = unblockUser;
