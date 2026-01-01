// Admin credentials (in production, these should be in Firebase with hashed passwords)
const ADMIN_CREDENTIALS = [
  { username: "sarikomutan", password: "BlondeMan123", name: "Sari Komutan" },
  { username: "Abdulghani", password: "Realmadred1$", name: "Abdulghani" },
  { username: "Saker", password: "Realmadred1$", name: "Saker" }
];

// Utility functions
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const show = (el) => el?.classList.remove("hidden");
const hide = (el) => el?.classList.add("hidden");

// Firebase services are already initialized in firebase-config.js
// No need to redeclare db and storage here

let currentAdmin = null;
let currentTab = "dashboard";

// Track pending approvals/rejections to prevent duplicate requests
const pendingApprovals = new Set();
const pendingRejections = new Set();

// Format currency
function formatLBP(amount) {
  if (!amount && amount !== 0) return "0 LBP";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " LBP";
}

// Admin Login
document.getElementById("admin-login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = $("#admin-username").value.trim();
  const password = $("#admin-password").value;
  
  const admin = ADMIN_CREDENTIALS.find(
    a => a.username === username && a.password === password
  );
  
  if (admin) {
    currentAdmin = admin;
    localStorage.setItem("adminSession", JSON.stringify(admin));
    showAdminDashboard();
  } else {
    $("#admin-login-error").textContent = "Invalid username or password";
  }
});

// Check for existing session
window.addEventListener("DOMContentLoaded", () => {
  const session = localStorage.getItem("adminSession");
  if (session) {
    currentAdmin = JSON.parse(session);
    showAdminDashboard();
  }
});

// Logout
$("#admin-logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("adminSession");
  currentAdmin = null;
  hide($("#admin-dashboard-view"));
  show($("#admin-login-view"));
  $("#admin-username").value = "";
  $("#admin-password").value = "";
});

// Show admin dashboard
function showAdminDashboard() {
  hide($("#admin-login-view"));
  show($("#admin-dashboard-view"));
  $("#admin-name").textContent = currentAdmin.name;
  
  // Set up tab navigation
  $$(".admin-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const tabName = tab.getAttribute("data-tab");
      switchTab(tabName);
    });
  });
  
  // Load default tab
  switchTab("dashboard");
}

// Switch tabs
function switchTab(tabName) {
  currentTab = tabName;
  
  // Update tab styles
  $$(".admin-tab").forEach(tab => {
    if (tab.getAttribute("data-tab") === tabName) {
      tab.classList.add("border-blue-500", "text-blue-500");
      tab.classList.remove("border-transparent", "text-gray-400");
    } else {
      tab.classList.remove("border-blue-500", "text-blue-500");
      tab.classList.add("border-transparent", "text-gray-400");
    }
  });
  
  // Load tab content
  switch(tabName) {
    case "dashboard":
      loadDashboard();
      break;
    case "orders":
      loadOrders();
      break;
    case "packages":
      loadPackages();
      break;
    case "users":
      loadUsers();
      break;
    case "revenue":
      loadRevenue();
      break;
    case "settings":
      loadSettings();
      break;
  }
  
  // Replace feather icons
  if (window.feather) feather.replace();
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
  const content = $("#admin-content");
  content.innerHTML = `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold">Dashboard Overview</h2>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card-bg border border-navy-600 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <i data-feather="shopping-cart" class="w-6 h-6 text-blue-500"></i>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-1">Today's Orders</p>
          <p id="stat-today-orders" class="text-3xl font-bold">0</p>
        </div>
        
        <div class="card-bg border border-navy-600 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <i data-feather="clock" class="w-6 h-6 text-yellow-500"></i>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-1">Pending Orders</p>
          <p id="stat-pending-orders" class="text-3xl font-bold">0</p>
        </div>
        
        <div class="card-bg border border-navy-600 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <i data-feather="dollar-sign" class="w-6 h-6 text-green-500"></i>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-1">Today's Revenue</p>
          <p id="stat-today-revenue" class="text-3xl font-bold">0 LBP</p>
        </div>
        
        <div class="card-bg border border-navy-600 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <i data-feather="users" class="w-6 h-6 text-purple-500"></i>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-1">Total Users</p>
          <p id="stat-total-users" class="text-3xl font-bold">0</p>
        </div>
      </div>
      
      <!-- Recent Orders -->
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold">Recent Orders</h3>
          <button onclick="switchTab('orders')" class="text-brand hover:text-brand-dark text-sm font-medium">
            View All →
          </button>
        </div>
        <div id="dashboard-recent-orders" class="space-y-4">
          <p class="text-gray-400 text-center py-8">Loading...</p>
        </div>
      </div>
      
      <!-- Service Type Distribution -->
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <h3 class="text-xl font-bold mb-6">Orders by Service Type (Today)</h3>
        <div id="dashboard-service-stats" class="space-y-3">
          <p class="text-gray-400 text-center py-8">Loading...</p>
        </div>
      </div>
      
    </div>
  `;
  
  if (window.feather) feather.replace();
  
  // Load statistics
  await loadDashboardStats();
}

async function loadDashboardStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's orders
    const ordersSnap = await db.collection("orders")
      .where("createdAt", ">=", today)
      .get();
    
    let todayOrders = 0;
    let pendingOrders = 0;
    let todayRevenue = 0;
    const serviceTypes = {};
    
    ordersSnap.forEach(doc => {
      const data = doc.data();
      
      if (data.status === "pending") pendingOrders++;
      
      // Only count approved orders
      if (data.status === "approved") {
        todayOrders++;
        
        // Add revenue from approved orders
        if (data.priceLBP) {
          todayRevenue += data.priceLBP;
        }
        
        // Count by service type (only approved orders)
        let serviceType = data.type || "closed-service";
        if (serviceType === "alfa-gift") serviceType = "Alfa Gift";
        else if (serviceType === "credits") serviceType = "Credits";
        else if (serviceType === "validity") serviceType = "Validity";
        else if (serviceType === "streaming") serviceType = "Streaming";
        else if (serviceType === "open-service") serviceType = "Open u-share Service";
        else serviceType = "Closed u-share Service";
        
        serviceTypes[serviceType] = (serviceTypes[serviceType] || 0) + 1;
      }
    });
    
    // Get total users
    const usersSnap = await db.collection("users").get();
    const totalUsers = usersSnap.size;
    
    // Update stats (with null checks)
    const todayOrdersEl = $("#stat-today-orders");
    const pendingOrdersEl = $("#stat-pending-orders");
    const todayRevenueEl = $("#stat-today-revenue");
    const totalUsersEl = $("#stat-total-users");
    
    if (todayOrdersEl) todayOrdersEl.textContent = todayOrders;
    if (pendingOrdersEl) pendingOrdersEl.textContent = pendingOrders;
    if (todayRevenueEl) todayRevenueEl.textContent = formatLBP(todayRevenue);
    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    
    // Load recent orders
    await loadDashboardRecentOrders();
    
    // Load service type distribution
    loadServiceTypeStats(serviceTypes);
    
  } catch (error) {
    console.error("Error loading dashboard stats:", error);
  }
}

async function loadDashboardRecentOrders() {
  try {
    const container = $("#dashboard-recent-orders");
    
    // Check if container exists (dashboard might not be loaded)
    if (!container) {
      console.warn("Dashboard recent orders container not found");
      return;
    }
    
    const ordersSnap = await db.collection("orders")
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();
    
    if (ordersSnap.empty) {
      container.innerHTML = '<p class="text-gray-400 text-center py-8">No orders yet</p>';
      return;
    }
    
    container.innerHTML = "";
    
    ordersSnap.forEach(doc => {
      const data = doc.data();
      const orderDiv = document.createElement("div");
      orderDiv.className = "flex items-center justify-between p-4 bg-navy-800 rounded-lg";
      
      let serviceType = data.type || "closed-service";
      if (serviceType === "alfa-gift") serviceType = "Alfa Gift";
      else if (serviceType === "credits") serviceType = "Credits";
      else if (serviceType === "validity") serviceType = "Validity";
      else serviceType = "Closed u-share Service";
      
      const statusColor = data.status === "pending" ? "yellow" : 
                         data.status === "approved" ? "green" : "red";
      
      orderDiv.innerHTML = `
        <div>
          <p class="font-medium">${serviceType}</p>
          <p class="text-sm text-gray-400">${data.createdAt?.toDate?.().toLocaleString() || "-"}</p>
        </div>
        <div class="text-right">
          <p class="font-medium">${data.priceLBP ? formatLBP(data.priceLBP) : "-"}</p>
          <span class="text-xs px-2 py-1 rounded bg-${statusColor}-500/20 text-${statusColor}-500">${data.status}</span>
        </div>
      `;
      
      container.appendChild(orderDiv);
    });
    
  } catch (error) {
    console.error("Error loading recent orders:", error);
  }
}

function loadServiceTypeStats(serviceTypes) {
  const container = $("#dashboard-service-stats");
  
  // Check if container exists (dashboard might not be loaded)
  if (!container) {
    console.warn("Dashboard service stats container not found");
    return;
  }
  
  if (Object.keys(serviceTypes).length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-8">No orders today</p>';
    return;
  }
  
  container.innerHTML = "";
  
  const total = Object.values(serviceTypes).reduce((a, b) => a + b, 0);
  
  Object.entries(serviceTypes).forEach(([type, count]) => {
    const percentage = ((count / total) * 100).toFixed(1);
    
    const statDiv = document.createElement("div");
    statDiv.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm">${type}</span>
        <span class="text-sm font-medium">${count} orders (${percentage}%)</span>
      </div>
      <div class="w-full bg-navy-700 rounded-full h-2">
        <div class="bg-brand h-2 rounded-full" style="width: ${percentage}%"></div>
      </div>
    `;
    
    container.appendChild(statDiv);
  });
}

// ==================== ORDERS MANAGEMENT ====================
async function loadOrders() {
  const content = $("#admin-content");
  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">Order Management</h2>
          <p id="user-filter-label" class="text-sm text-gray-400 mt-1 hidden"></p>
        </div>
        <div class="flex gap-2">
          <button id="admin-export-orders-btn" class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors flex items-center gap-2">
            <i data-feather="download" class="w-4 h-4"></i>
            <span>Export to Excel</span>
          </button>
          <button id="clear-user-filter-btn" onclick="clearUserFilter()" style="display: none;" class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors flex items-center gap-2">
            <i data-feather="x" class="w-4 h-4"></i>
            <span>Clear User Filter</span>
          </button>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Date Filter</label>
            <select id="order-date-filter" onchange="refreshOrders()" class="w-full px-4 py-2 rounded-lg input-dark text-sm">
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Status</label>
            <select id="order-status-filter" onchange="refreshOrders()" class="w-full px-4 py-2 rounded-lg input-dark text-sm">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Service Type</label>
            <select id="order-type-filter" onchange="refreshOrders()" class="w-full px-4 py-2 rounded-lg input-dark text-sm">
              <option value="">All Types</option>
              <option value="closed-service">Closed u-share Service</option>
              <option value="open-service">Open u-share Service</option>
              <option value="alfa-gift">Alfa Gift</option>
              <option value="credits">Credits</option>
              <option value="validity">Validity</option>
              <option value="streaming">Streaming Services</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Search</label>
            <input id="order-search" oninput="refreshOrders()" type="text" placeholder="Search by name or number" class="w-full px-4 py-2 rounded-lg input-dark text-sm">
          </div>
        </div>
      </div>
      
      <!-- Orders Table -->
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-navy-600">
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Date</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">User</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Service</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Quantity</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Price</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Phone</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Status</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody id="orders-table-body">
              <tr><td colspan="8" class="text-center py-8 text-gray-400">Loading orders...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  if (window.feather) feather.replace();
  
  // Attach export button handler
  const exportBtn = $("#admin-export-orders-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", async () => {
      const dateFilter = document.getElementById('order-date-filter')?.value || 'all';
      const statusFilter = $("#order-status-filter")?.value || "";
      const typeFilter = $("#order-type-filter")?.value || "";
      const searchQuery = $("#order-search")?.value.trim() || "";
      const userFilter = window.currentUserFilter || null;
      
      await exportAllOrdersToExcel(dateFilter, statusFilter, typeFilter, searchQuery, userFilter);
    });
  }
  
  await refreshOrders();
}

async function exportAllOrdersToExcel(dateFilter = 'all', statusFilter = '', typeFilter = '', searchQuery = '', userFilter = null) {
  try {
    // Determine date range based on filter
    let startDate = null;
    let endDate = null;
    const now = new Date();

    if (dateFilter === 'today') {
      startDate = new Date(); startDate.setHours(0,0,0,0);
      endDate = new Date(); endDate.setHours(23,59,59,999);
    } else if (dateFilter === 'yesterday') {
      startDate = new Date(); startDate.setDate(startDate.getDate() - 1); startDate.setHours(0,0,0,0);
      endDate = new Date(); endDate.setDate(endDate.getDate() - 1); endDate.setHours(23,59,59,999);
    } else if (dateFilter === 'week') {
      startDate = new Date(); startDate.setDate(startDate.getDate() - 7); startDate.setHours(0,0,0,0);
      endDate = new Date(); endDate.setHours(23,59,59,999);
    } else if (dateFilter === 'month') {
      startDate = new Date(); startDate.setMonth(startDate.getMonth() - 1); startDate.setHours(0,0,0,0);
      endDate = new Date(); endDate.setHours(23,59,59,999);
    }

    let query = db.collection("orders").orderBy("createdAt", "desc");
    if (startDate && endDate) {
      query = db.collection("orders")
        .where('createdAt', '>=', startDate)
        .where('createdAt', '<=', endDate)
        .orderBy('createdAt', 'desc');
    }

    const ordersSnap = await query.get();

    if (ordersSnap.empty) {
      alert("No orders to export for the selected date range");
      return;
    }
    
    // Apply filters similar to refreshOrders function
    let orders = [];
    ordersSnap.forEach(doc => {
      const data = doc.data();
      const orderDate = data.createdAt?.toDate();
      
      // Apply date filter
      if (startDate && endDate && orderDate) {
        if (orderDate >= startDate && orderDate <= endDate) {
          orders.push({ id: doc.id, ...data });
        }
      } else if (!startDate && !endDate) {
        // "All Time" - include all orders
        orders.push({ id: doc.id, ...data });
      }
    });
    
    // Apply user filter
    if (userFilter) {
      orders = orders.filter(o => o.uid === userFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      orders = orders.filter(o => o.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter) {
      orders = orders.filter(o => (o.type || "closed-service") === typeFilter);
    }
    
    // Apply search query filter for phone numbers
    if (searchQuery && /^\d+$/.test(searchQuery)) {
      orders = orders.filter(o => 
        (o.phone && o.phone.includes(searchQuery)) ||
        (o.secondaryPhone && o.secondaryPhone.includes(searchQuery))
      );
    }
    
    // For name search, we need to fetch user data
    if (searchQuery && !/^\d+$/.test(searchQuery)) {
      const qLower = searchQuery.toLowerCase();
      const filteredOrders = [];
      
      // Fetch all user data in parallel
      const userPromises = orders.map(order => 
        order.uid ? db.collection("users").doc(order.uid).get().catch(() => null) : Promise.resolve(null)
      );
      const userDocs = await Promise.all(userPromises);
      
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const userDoc = userDocs[i];
        let matched = false;
        
        if (userDoc && userDoc.exists) {
          const u = userDoc.data();
          const username = (u.username || "").toString().toLowerCase();
          const fullName = `${(u.firstName||"").toString()} ${(u.lastName||"").toString()}`.toLowerCase().trim();
          
          if (username && username.includes(qLower)) matched = true;
          if (!matched && fullName && fullName.includes(qLower)) matched = true;
        }
        
        // Also allow matching by email
        if (!matched && order.email && order.email.toLowerCase().includes(qLower)) matched = true;
        
        if (matched) {
          filteredOrders.push(order);
        }
      }
      
      // Replace orders with filtered list
      orders = filteredOrders;
    }
    
    if (orders.length === 0) {
      alert("No orders match your search criteria");
      return;
    }
    
    let csv = "Date,User Name,Service Type,Quantity,Price (LBP),Phone,Status\n";
    
    // Process filtered orders instead of all orders
    for (const order of orders) {
      const date = order.createdAt?.toDate?.().toLocaleString() || "-";
      
      let userName = "Unknown";
      if (order.uid) {
        try {
          const userDoc = await db.collection("users").doc(order.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            userName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User";
          }
        } catch (e) {}
      }
      
      let serviceType = order.type || "closed-service";
      if (serviceType === "streaming") serviceType = `Streaming: ${order.serviceName || ""}`;
      else if (serviceType === "alfa-gift") serviceType = "Alfa Gift";
      else if (serviceType === "credits") serviceType = "Credits";
      else if (serviceType === "validity") serviceType = "Validity";
      else if (serviceType === "open-service") serviceType = "Open u-share";
      else serviceType = "Closed u-share";
      
      let quantity = "-";
      if (order.type === "streaming") quantity = order.packageName || "-";
      else if (order.packageSizeGB) quantity = order.packageSizeGB + " GB";
      else if (order.creditsAmount) quantity = order.creditsAmount + " Credits";
      
      const price = order.priceLBP || 0;
      const phone = order.phone || order.secondaryPhone || "-";
      const status = order.status || "pending";
      
      csv += `"${date}","${userName}","${serviceType}","${quantity}",${price},"${phone}","${status}"\n`;
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const filenameDate = (() => {
      if (dateFilter === 'today' || dateFilter === 'yesterday') return (startDate || new Date()).toISOString().split('T')[0];
      if (dateFilter === 'week') return `week_${new Date().toISOString().split('T')[0]}`;
      if (dateFilter === 'month') return `month_${new Date().toISOString().split('T')[0]}`;
      return `all_${new Date().toISOString().split('T')[0]}`;
    })();
    link.setAttribute("download", `orders_${dateFilter}_${filenameDate}.csv`);
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

async function refreshOrders() {
  try {
    const dateFilter = $("#order-date-filter")?.value || "today";
    const statusFilter = $("#order-status-filter")?.value || "";
    const typeFilter = $("#order-type-filter")?.value || "";
    const searchQuery = $("#order-search")?.value.trim() || "";
    const userFilter = window.currentUserFilter || null;
    
    // Calculate date range
    let startDate = null;
    let endDate = null;
    
    const now = new Date();
    
    if (dateFilter === "today") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    } else if (dateFilter === "yesterday") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
    } else if (dateFilter === "week") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    } else if (dateFilter === "month") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }
    
    // Query orders
    let query = db.collection("orders").orderBy("createdAt", "desc");
    
    const ordersSnap = await query.get();
    
    let orders = [];
    ordersSnap.forEach(doc => {
      const data = doc.data();
      const orderDate = data.createdAt?.toDate();
      
      // Apply date filter
      if (startDate && endDate && orderDate) {
        if (orderDate >= startDate && orderDate <= endDate) {
          orders.push({ id: doc.id, ...data });
        }
      } else if (!startDate && !endDate) {
        // "All Time" - include all orders
        orders.push({ id: doc.id, ...data });
      }
    });
    
    // Apply filters
    if (userFilter) {
      orders = orders.filter(o => o.uid === userFilter);
      
      // Show user filter UI
      const filterLabel = $("#user-filter-label");
      const clearBtn = $("#clear-user-filter-btn");
      if (filterLabel && clearBtn) {
        filterLabel.textContent = `Filtering orders for specific user`;
        filterLabel.classList.remove("hidden");
        clearBtn.style.display = "flex";
      }
    } else {
      // Hide user filter UI
      const filterLabel = $("#user-filter-label");
      const clearBtn = $("#clear-user-filter-btn");
      if (filterLabel && clearBtn) {
        filterLabel.classList.add("hidden");
        clearBtn.style.display = "none";
      }
    }
    
    if (statusFilter) {
      orders = orders.filter(o => o.status === statusFilter);
    }
    
    if (typeFilter) {
      orders = orders.filter(o => (o.type || "closed-service") === typeFilter);
    }
    
    if (searchQuery) {
      const isNumericSearch = /^\d+$/.test(searchQuery);
      if (isNumericSearch) {
        // Phone search (existing behavior)
        orders = orders.filter(o => 
          (o.phone && o.phone.includes(searchQuery)) ||
          (o.secondaryPhone && o.secondaryPhone.includes(searchQuery))
        );
      } else {
        // Name/username search - we'll filter after we resolve user docs
        // mark that we need name filtering
        orders = orders; // keep orders for now; actual filtering below after fetching userDocs
      }
    }
    
    // Render orders
    const tbody = $("#orders-table-body");
    
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-gray-400">No orders found</td></tr>';
      return;
    }
    
    tbody.innerHTML = "";
    
    // Fetch all user data in parallel
    const userPromises = orders.map(order => 
      order.uid ? db.collection("users").doc(order.uid).get().catch(() => null) : Promise.resolve(null)
    );
    const userDocs = await Promise.all(userPromises);

    // If a non-numeric search was provided, filter orders by username or full name
    if (searchQuery && !/^[0-9]+$/.test(searchQuery)) {
      const qLower = searchQuery.toLowerCase();
      const filteredOrders = [];
      const filteredUserDocs = [];

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const userDoc = userDocs[i];
        let matched = false;

        if (userDoc && userDoc.exists) {
          const u = userDoc.data();
          const username = (u.username || "").toString().toLowerCase();
          const fullName = `${(u.firstName||"").toString()} ${(u.lastName||"").toString()}`.toLowerCase().trim();

          if (username && username.includes(qLower)) matched = true;
          if (!matched && fullName && fullName.includes(qLower)) matched = true;
        }

        // Also allow matching by email
        if (!matched && order.email && order.email.toLowerCase().includes(qLower)) matched = true;

        if (matched) {
          filteredOrders.push(order);
          filteredUserDocs.push(userDoc);
        }
      }

      // Replace orders and userDocs with filtered lists
      orders = filteredOrders;
      // keep userDocs aligned with orders for rendering
      userDocs.length = 0;
      Array.prototype.push.apply(userDocs, filteredUserDocs);
    }
    
    // Build all rows HTML first
    const rowsHTML = orders.map((order, index) => {
      // Get user info
      let userName = "Unknown";
      let userPhone = order.phone || order.secondaryPhone || "-";
      
      const userDoc = userDocs[index];
      if (userDoc && userDoc.exists) {
        const userData = userDoc.data();
        userName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User";
        
        // If phone not in order, get it from user profile
        if (!order.phone && !order.secondaryPhone) {
          userPhone = userData.phone || userData.secondaryPhone || userData.mainPhone || "-";
        }
      }
      
      let serviceType = order.type || "closed-service";
      if (serviceType === "streaming") serviceType = `Streaming: ${order.serviceName || ""}`;
      else if (serviceType === "alfa-gift") serviceType = "Alfa Gift";
      else if (serviceType === "credits") serviceType = "Credits";
      else if (serviceType === "validity") serviceType = "Validity";
      else if (serviceType === "open-service") serviceType = "Open u-share";
      else serviceType = "Closed u-share";
      
      let quantity = "-";
      if (order.type === "streaming") quantity = order.packageName || "-";
      else if (order.packageSizeGB) quantity = `${order.packageSizeGB} GB`;
      else if (order.creditsAmount) quantity = `${order.creditsAmount} Credits`;
      
      const statusColor = order.status === "pending" ? "yellow" : 
                         order.status === "approved" ? "green" : "red";
      
      return `
        <tr class="border-b border-navy-700 hover:bg-navy-800">
          <td class="px-4 py-3 text-sm">${order.createdAt?.toDate?.().toLocaleString() || "-"}</td>
          <td class="px-4 py-3 text-sm">${userName}</td>
          <td class="px-4 py-3 text-sm">${serviceType}</td>
          <td class="px-4 py-3 text-sm">${quantity}</td>
          <td class="px-4 py-3 text-sm">${order.priceLBP ? formatLBP(order.priceLBP) : "-"}</td>
          <td class="px-4 py-3 text-sm">${userPhone}</td>
          <td class="px-4 py-3 text-sm">
            <span class="px-2 py-1 rounded text-xs bg-${statusColor}-500/20 text-${statusColor}-500">${order.status}</span>
          </td>
          <td class="px-4 py-3 text-sm">
            <div class="flex items-center gap-2">
              ${order.status === "pending" ? `
                <button onclick="approveOrder('${order.id}')" class="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-medium">
                  Approve
                </button>
                <button onclick="rejectOrder('${order.id}')" class="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-medium">
                  Reject
                </button>
              ` : `
                <span class="text-gray-500 text-xs">No actions</span>
              `}
              <!-- Delete button always available to admin -->
              <button onclick="deleteOrder('${order.id}')" class="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium">
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
    
    // Insert all rows at once
    tbody.innerHTML = rowsHTML;
    
  } catch (error) {
    console.error("Error loading orders:", error);
    $("#orders-table-body").innerHTML = '<tr><td colspan="8" class="text-center py-8 text-red-400">Error loading orders</td></tr>';
  }
}

// ==================== PACKAGES MANAGEMENT ====================
async function loadPackages() {
  const content = $("#admin-content");
  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Packages Management</h2>
      </div>
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <p class="text-gray-400 text-center py-8">Packages management coming soon...</p>
      </div>
    </div>
  `;
}

// ==================== SETTINGS ====================
async function loadSettings() {
  const content = $("#admin-content");
  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Settings</h2>
      </div>
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <p class="text-gray-400 text-center py-8">Settings management coming soon...</p>
      </div>
    </div>
  `;
}

// ==================== USERS MANAGEMENT ====================
async function loadUsers() {
  const content = $("#admin-content");
  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Users Management</h2>
      </div>
      
      <!-- Search + Balance Date -->
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <input id="user-search" oninput="refreshUsers()" type="text" placeholder="Search by ID, name, email or phone..." class="w-full px-4 py-2 rounded-lg input-dark">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Balance Date</label>
            <input id="user-balance-date" onchange="refreshUsers()" type="date" class="w-full px-4 py-2 rounded-lg input-dark text-sm">
            <p class="text-xs text-gray-400 mt-2">No date: shows stored balance. With date: shows daily credits - spent for that day only</p>
          </div>
        </div>
      </div>
      
      <!-- Users Table -->
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-navy-600">
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">ID</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Name</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Email</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Phone</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Balance</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Status</th>
                <th class="text-left px-4 py-3 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody id="users-table-body">
              <tr><td colspan="7" class="text-center py-8 text-gray-400">Loading users...</td></tr>
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
    console.log("Loading users...");
    const searchQuery = $("#user-search")?.value.trim().toLowerCase() || "";
    // Determine balance cutoff date (end of selected day). If empty -> all time
    const dateVal = $("#user-balance-date")?.value || "";
    let balanceEndDate = null;
    if (dateVal) {
      balanceEndDate = new Date(dateVal);
      balanceEndDate.setHours(23, 59, 59, 999);
    }

    // Fetch users, credit requests and orders (we'll filter statuses client-side to support variants)
    const [usersSnap, creditSnap, ordersSnap] = await Promise.all([
      db.collection("users").get(),
      db.collection("creditRequests").get(),
      db.collection("orders").get()
    ]);
    const tbody = $("#users-table-body");
    
    console.log("Users found:", usersSnap.size);
    
    if (usersSnap.empty) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-400">No users found</td></tr>';
      return;
    }
    
    // Collect all users and apply search filter
    let users = [];
    usersSnap.forEach(doc => {
      const user = doc.data();
      const uid = doc.id;

      // Apply search filter (id, phone, name, email)
      if (searchQuery) {
        const matchesId = uid.toLowerCase().includes(searchQuery);
        const matchesPhone = (user.phone || '').toLowerCase().includes(searchQuery);
        const matchesEmail = (user.email || '').toLowerCase().includes(searchQuery);
        const matchesName = (`${user.firstName || ''} ${user.lastName || ''}`).toLowerCase().includes(searchQuery);

        if (!matchesId && !matchesPhone && !matchesEmail && !matchesName) {
          return; // Skip this user
        }
      }

      users.push({ uid, ...user });
    });
    
    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-400">No users found matching your search</td></tr>';
      return;
    }
    
    // Debug: log fetch sizes
    console.log('refreshUsers: usersSnap.size=', usersSnap.size, 'creditSnap.size=', creditSnap.size, 'ordersSnap.size=', ordersSnap.size, 'balanceEndDate=', balanceEndDate);

    // Aggregate approved credit requests up to the selected date to compute historical credits
    const creditSums = {}; // uid -> sum
    creditSnap.forEach(doc => {
      const d = doc.data();
      const uid = d.uid;
      // Only count credit requests that are completed/approved by admin. Accept common status variants
      const status = (d.status || '').toString().toLowerCase();
      const acceptedStatuses = ['approved', 'processed', 'completed', 'paid'];
      if (!acceptedStatuses.includes(status)) return;
      // Determine processed timestamp (fallback to requestDate if processedDate missing)
      const processedTs = (d.processedDate && d.processedDate.toDate) ? d.processedDate.toDate() : (d.requestDate && d.requestDate.toDate ? d.requestDate.toDate() : null);
      if (!processedTs) return;
      if (balanceEndDate && processedTs > balanceEndDate) return; // ignore later
      creditSums[uid] = (creditSums[uid] || 0) + (Number(d.amountLBP) || 0);
    });

    // Aggregate approved orders (spent amounts) up to the selected date
    const spentSums = {}; // uid -> sum spent
    ordersSnap.forEach(doc => {
      const d = doc.data();
      const uid = d.uid;
      // Only count orders that are approved/paid/completed
      const status = (d.status || '').toString().toLowerCase();
      const acceptedOrderStatuses = ['approved', 'completed', 'paid'];
      if (!acceptedOrderStatuses.includes(status)) return;
      // Prefer approvedAt/processedAt timestamps, fallback to createdAt
      const createdTs = (d.approvedAt && d.approvedAt.toDate) ? d.approvedAt.toDate() : ((d.createdAt && d.createdAt.toDate) ? d.createdAt.toDate() : null);
      if (!createdTs) return;
      if (balanceEndDate && createdTs > balanceEndDate) return; // ignore later
      // Only consider priceLBP as spent amount
      const price = Number(d.priceLBP) || 0;
      spentSums[uid] = (spentSums[uid] || 0) + price;
    });

    // Debug aggregates for first few users
    const sampleUsers = users.slice(0, 5).map(u => u.uid);
    console.log('refreshUsers: sample user ids:', sampleUsers);
    sampleUsers.forEach(uid => {
      console.log('user', uid, 'credits=', creditSums[uid] || 0, 'spent=', spentSums[uid] || 0, 'stored=', (users.find(x=>x.uid===uid)||{}).balanceLBP);
    });

    let html = '';
    let idCounter = 1;
    users.forEach(user => {
      const uid = user.uid;
      const isBlocked = user.blocked || false;
      
      console.log("User:", uid, user.firstName, user.lastName, "Blocked:", isBlocked);
      
      const statusBadge = isBlocked 
        ? '<span class="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">Blocked</span>'
        : '<span class="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">Active</span>';
      
      const actionButton = isBlocked
        ? `<button onclick="unblockUser('${uid}')" class="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-medium">Unblock</button>`
        : `<button onclick="blockUser('${uid}')" class="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-medium">Block</button>`;
      
  // FIXED: Calculate daily balance only (not cumulative)
  // If no date is selected, show the stored balance
  // If date is selected, only show credits - spent for that specific day
  const stored = Number(user.balanceLBP) || 0;
  
  // Default to showing stored balance
  let balanceAsOf = stored;
  
  // Only calculate daily transactions if a date is selected
  if (balanceEndDate) {
    // IMPORTANT: We're completely ignoring the stored balance and creditSums/spentSums
    // when a date is selected - we ONLY want transactions from that specific day
    
    // Create a start date for the same day at 00:00:00
    const balanceStartDate = new Date(balanceEndDate);
    balanceStartDate.setHours(0, 0, 0, 0);
    
    // Initialize daily credits and spent
    let dailyCredits = 0;
    let dailySpent = 0;
    
    // Calculate credits for the specific day only
    creditSnap.forEach(doc => {
      const d = doc.data();
      if (d.uid !== uid) return;
      
      const status = (d.status || '').toString().toLowerCase();
      const acceptedStatuses = ['approved', 'processed', 'completed', 'paid'];
      if (!acceptedStatuses.includes(status)) return;
      
      const processedTs = (d.processedDate && d.processedDate.toDate) ? d.processedDate.toDate() : 
                         (d.requestDate && d.requestDate.toDate ? d.requestDate.toDate() : null);
      if (!processedTs) return;
      
      // Only include credits from the selected day
      if (processedTs >= balanceStartDate && processedTs <= balanceEndDate) {
        const amount = Number(d.amountLBP) || 0;
        dailyCredits += amount;
        
        // Debug log for first few users
        if (idCounter <= 5) {
          console.log(`Daily credit for user ${uid} on ${balanceStartDate.toLocaleDateString()}: +${amount} LBP`);
        }
      }
    });
    
    // Calculate spent for the specific day only
    ordersSnap.forEach(doc => {
      const d = doc.data();
      if (d.uid !== uid) return;
      
      const status = (d.status || '').toString().toLowerCase();
      const acceptedOrderStatuses = ['approved', 'completed', 'paid'];
      if (!acceptedOrderStatuses.includes(status)) return;
      
      const createdTs = (d.approvedAt && d.approvedAt.toDate) ? d.approvedAt.toDate() : 
                       ((d.createdAt && d.createdAt.toDate) ? d.createdAt.toDate() : null);
      if (!createdTs) return;
      
      // Only include orders from the selected day
      if (createdTs >= balanceStartDate && createdTs <= balanceEndDate) {
        const amount = Number(d.priceLBP) || 0;
        dailySpent += amount;
        
        // Debug log for first few users
        if (idCounter <= 5) {
          console.log(`Daily spent for user ${uid} on ${balanceStartDate.toLocaleDateString()}: -${amount} LBP`);
        }
      }
    });
    
    // IMPORTANT CHANGE: For daily balance, we ONLY show credits - spent for the selected day
    // We're completely replacing balanceAsOf with just the daily calculation
    balanceAsOf = dailyCredits - dailySpent;
    
    // Debug log for first few users
    if (idCounter <= 5) {
      console.log(`Final daily balance for user ${uid} on ${balanceStartDate.toLocaleDateString()}: ${balanceAsOf} LBP (credits: ${dailyCredits}, spent: ${dailySpent}, stored balance IGNORED: ${stored})`);
    }
  }

      html += `
        <tr class="border-b border-navy-700 hover:bg-navy-800">
          <td class="px-4 py-3 text-sm font-medium">${idCounter}</td>
          <td class="px-4 py-3">${user.firstName || ''} ${user.lastName || ''}</td>
          <td class="px-4 py-3 text-sm text-gray-400">${user.email || ''}</td>
          <td class="px-4 py-3 text-sm">${user.phone || ''}</td>
          <td class="px-4 py-3 text-sm" style="tw-content: ''">
            ${balanceEndDate ? 
              `<span class="text-blue-500 font-medium">${formatLBP(balanceAsOf || 0)} <span class="bg-blue-500/20 px-2 py-1 rounded text-xs">DAILY</span></span>` : 
              `<span>${formatLBP(balanceAsOf || 0)} <span class="bg-gray-500/20 px-2 py-1 rounded text-xs">TOTAL</span></span>`
            }
          </td>
          <td class="px-4 py-3">${statusBadge}</td>
          <td class="px-4 py-3">${actionButton}</td>
        </tr>
      `;
      idCounter++;
    });
    
    console.log("Generated HTML length:", html.length);
    tbody.innerHTML = html;
    console.log("Users table updated!");
  } catch (error) {
    console.error("Error loading users:", error);
    const tbody = $("#users-table-body");
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-red-400">Error loading users</td></tr>';
    }
  }
}

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

// ==================== REVENUE ====================
async function loadRevenue() {
  const content = $("#admin-content");
  content.innerHTML = `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold">Revenue History</h2>
      
      <!-- Date Range Filter -->
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <div class="flex items-center gap-4 flex-wrap">
          <button id="revenue-today" class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
            Today
          </button>
          <button id="revenue-all" class="px-4 py-2 rounded-lg bg-navy-700 hover:bg-navy-600 text-white text-sm font-medium transition-colors">
            All Time
          </button>
          <div class="flex items-center gap-2 ml-4">
            <label class="text-sm text-gray-400">Select Date:</label>
            <input type="date" id="revenue-date-picker" class="px-3 py-2 rounded-lg input-dark text-sm">
          </div>
        </div>
      </div>
      
      <!-- Revenue List -->
      <div class="card-bg border border-navy-600 rounded-xl p-6">
        <div id="revenue-list" class="space-y-3">
          <p class="text-gray-400 text-center py-8">Loading...</p>
        </div>
      </div>
    </div>
  `;
  
  if (window.feather) feather.replace();
  
  // Load today's revenue by default
  await loadRevenueData('today');
  
  // Set up button handlers
  $("#revenue-today").addEventListener("click", () => loadRevenueData('today'));
  $("#revenue-all").addEventListener("click", () => loadRevenueData('all'));
  
  // Date picker handler
  const datePicker = $("#revenue-date-picker");
  if (datePicker) {
    datePicker.addEventListener("change", () => {
      const selectedDate = new Date(datePicker.value);
      loadRevenueData('custom', selectedDate);
    });
  }
}

let currentRevenueRange = 'today';

async function loadRevenueData(range, customDate = null) {
  currentRevenueRange = range;
  const container = $("#revenue-list");
  if (!container) return;
  
  container.innerHTML = '<p class="text-gray-400 text-center py-8">Loading...</p>';
  
  try {
    // Calculate date range
    let startDate, endDate;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    switch(range) {
      case 'today':
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        endDate = today;
        break;
      case 'custom':
        if (customDate) {
          startDate = new Date(customDate);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(customDate);
          endDate.setHours(23, 59, 59, 999);
        } else {
          startDate = new Date(today);
          startDate.setHours(0, 0, 0, 0);
          endDate = today;
        }
        break;
      case 'all':
        startDate = new Date(2020, 0, 1); // Start from 2020
        endDate = today;
        break;
    }
    
    // Get all orders in the date range (no status filter to avoid composite index)
    const ordersSnap = await db.collection("orders")
      .where("createdAt", ">=", startDate)
      .where("createdAt", "<=", endDate)
      .orderBy("createdAt", "desc")
      .get();
    
    // Group orders by date (filter approved orders here)
    const revenueByDate = new Map();
    ordersSnap.forEach(doc => {
      const data = doc.data();
      // Only count approved orders with prices
      if (data.status === "approved" && data.priceLBP) {
        const orderDate = data.createdAt?.toDate();
        if (orderDate) {
          const dateKey = orderDate.toISOString().split('T')[0];
          if (!revenueByDate.has(dateKey)) {
            revenueByDate.set(dateKey, { revenue: 0, orders: 0, date: orderDate });
          }
          const dayData = revenueByDate.get(dateKey);
          dayData.revenue += data.priceLBP;
          dayData.orders += 1;
        }
      }
    });
    
    if (revenueByDate.size === 0) {
      container.innerHTML = '<p class="text-gray-400 text-center py-8">No revenue data found for this period</p>';
      return;
    }
    
    // Sort by date descending
    const sortedDates = Array.from(revenueByDate.entries()).sort((a, b) => b[1].date - a[1].date);
    
    // Calculate totals
    let totalRevenue = 0;
    let totalOrders = 0;
    sortedDates.forEach(([_, data]) => {
      totalRevenue += data.revenue;
      totalOrders += data.orders;
    });
    
    // Build HTML
    let html = `
      <!-- Summary Card -->
      <div class="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-400 mb-1">Total Revenue</p>
            <p class="text-3xl font-bold text-green-400">${formatLBP(totalRevenue)}</p>
          </div>
          <div>
            <p class="text-sm text-gray-400 mb-1">Total Orders</p>
            <p class="text-3xl font-bold text-blue-400">${totalOrders}</p>
          </div>
        </div>
      </div>
      
      <!-- Daily Revenue List -->
      <div class="space-y-3">
    `;
    
    sortedDates.forEach(([dateKey, data]) => {
      const isToday = dateKey === new Date().toISOString().split('T')[0];
      const dateLabel = isToday ? 'Today' : data.date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      
      const bgColor = isToday ? 'bg-blue-500/10 border-blue-500/30' : 'bg-navy-800/50 border-navy-700';
      
      html += `
        <div class="${bgColor} border rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <i data-feather="dollar-sign" class="w-5 h-5 text-green-500"></i>
              </div>
              <div>
                <h4 class="font-semibold text-white">${dateLabel}</h4>
                <p class="text-sm text-gray-400">${data.orders} orders</p>
              </div>
              ${isToday ? '<span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Live</span>' : ''}
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-green-400">${formatLBP(data.revenue)}</p>
              <p class="text-sm text-gray-400">Avg: ${formatLBP(data.revenue / data.orders)}</p>
            </div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    if (window.feather) feather.replace();
    
  } catch (error) {
    console.error("Error loading revenue data:", error);
    container.innerHTML = '<p class="text-red-400 text-center py-8">Error loading revenue data</p>';
  }
}

async function approveOrder(orderId) {
  // Prevent duplicate requests
  if (pendingApprovals.has(orderId)) {
    return;
  }

  if (!confirm("Are you sure you want to approve this order?")) return;
  
  // Mark as pending
  pendingApprovals.add(orderId);
  
  // Disable the button immediately to prevent multiple clicks
  const approveBtn = document.querySelector(`button[onclick="approveOrder('${orderId}')"]`);
  const rejectBtn = document.querySelector(`button[onclick="rejectOrder('${orderId}')"]`);
  if (approveBtn) {
    approveBtn.disabled = true;
    const originalText = approveBtn.textContent;
    approveBtn.textContent = "Approving...";
  }
  if (rejectBtn) rejectBtn.disabled = true;
  
  try {
    const orderRef = db.collection("orders").doc(orderId);
    
    // Pre-check: Try a simple read first to detect quota issues early and check order status
    try {
      const preCheckSnap = await orderRef.get();
      if (!preCheckSnap.exists) {
        throw new Error('Order not found');
      }
      const preCheckData = preCheckSnap.data();
      if (preCheckData.status === "approved") {
        throw new Error('Order already approved');
      }
    } catch (preCheckError) {
      // If it's already approved or not found, throw immediately
      if (preCheckError.message?.includes('already approved') || preCheckError.message?.includes('not found')) {
        throw preCheckError;
      }
      // If it's a quota error, fail immediately with clear message
      if (preCheckError.code === 'resource-exhausted' || preCheckError.code === 8 || 
          preCheckError.message?.includes('Quota') || preCheckError.message?.includes('429')) {
        throw new Error('Firebase quota exceeded. Please wait 10-15 minutes before trying again. Your daily quota limit has been reached.');
      }
      // For other errors, continue (might succeed in transaction)
    }
    
    // Add retry logic with exponential backoff for quota errors
    let retries = 0;
    const maxRetries = 2; // Reduced retries since Firebase SDK already retries internally
    let lastError = null;
    
    while (retries <= maxRetries) {
      try {
        // Wait before attempting (longer wait for retries)
        if (retries > 0) {
          const waitTime = Math.pow(2, retries) * 2000; // 2s, 4s, 8s
          console.warn(`Waiting ${waitTime/1000}s before retry (attempt ${retries + 1}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        // Use a timeout to prevent Firebase from retrying too many times
        const transactionPromise = db.runTransaction(async (tx) => {
          // Read order first
          const orderSnap = await tx.get(orderRef);
          if (!orderSnap.exists) throw new Error('Order not found');
          const orderData = orderSnap.data();

          // Double-check status
          if (orderData.status === "approved") {
            throw new Error('Order already approved');
          }

          // If we need to adjust package stock, read the package doc as well (reads must happen before writes)
          let pkgSnap = null;
          let packageRef = null;
          let shouldAdjustStock = false;

          if (orderData.packageId && !orderData.stockAdjusted) {
            packageRef = db.collection('packages').doc(orderData.packageId);
            pkgSnap = await tx.get(packageRef);
            shouldAdjustStock = pkgSnap.exists;
          }

          // Now perform writes
          const orderUpdate = {
            status: "approved",
            approvedBy: currentAdmin.username,
            approvedAt: firebase.firestore.FieldValue.serverTimestamp()
          };

          if (shouldAdjustStock) {
            orderUpdate.stockAdjusted = true;
          }

          tx.update(orderRef, orderUpdate);

          if (shouldAdjustStock && pkgSnap) {
            const currentQty = pkgSnap.data().quantity || 0;
            const newQty = Math.max(0, currentQty - 1);
            tx.update(packageRef, { quantity: newQty });
          }
        });
        
        // Add a timeout to the transaction (5 seconds)
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Transaction timeout - quota may be exhausted')), 5000);
        });
        
        await Promise.race([transactionPromise, timeoutPromise]);
        
        // Success - break out of retry loop
        break;
      } catch (error) {
        lastError = error;
        
        // Check if it's a quota/resource-exhausted error
        if (error.code === 'resource-exhausted' || error.code === 8 || error.message?.includes('Quota') || error.message?.includes('429')) {
          if (retries < maxRetries) {
            retries++;
            continue;
          } else {
            // Max retries reached - provide clear message
            throw new Error('Firebase quota exceeded. Please wait 10-15 minutes before trying again. Your daily quota limit has been reached. Consider upgrading your Firebase plan if this happens frequently.');
          }
        }
        
        // For other errors, don't retry
        throw error;
      }
    }

    alert("Order approved successfully!");
    
    // Update the UI without full refresh to save quota
    if (currentTab === "orders") {
      // Update the specific row in the table
      const row = document.querySelector(`button[onclick="approveOrder('${orderId}')"]`)?.closest('tr') || 
                  document.querySelector(`button[onclick="rejectOrder('${orderId}')"]`)?.closest('tr');
      if (row) {
        // Update status badge
        const statusCell = row.querySelector('td:nth-child(7)');
        if (statusCell) {
          statusCell.innerHTML = '<span class="px-2 py-1 rounded text-xs bg-green-500/20 text-green-500">approved</span>';
        }
        
        // Remove action buttons since order is approved
        const actionsCell = row.querySelector('td:nth-child(8)');
        if (actionsCell) {
          actionsCell.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs">No actions</span>
              <button onclick="deleteOrder('${orderId}')" class="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium">
                Delete
              </button>
            </div>
          `;
        }
      } else {
        // Fallback: full refresh if row not found
        await refreshOrders();
      }
    }
  } catch (error) {
    console.error("Error approving order:", error);
    
    // User-friendly error messages
    let errorMessage = "Failed to approve order";
    if (error.message?.includes('quota') || error.message?.includes('Quota')) {
      errorMessage = "Firebase quota exceeded. Please wait a few minutes before trying again.";
    } else if (error.message?.includes('already approved')) {
      errorMessage = "This order is already approved.";
    } else {
      errorMessage = error.message || "Failed to approve order. Please try again.";
    }
    
    alert(errorMessage);
    
    // Re-enable buttons on error
    if (approveBtn) {
      approveBtn.disabled = false;
      approveBtn.textContent = "Approve";
    }
    if (rejectBtn) rejectBtn.disabled = false;
  } finally {
    // Remove from pending set
    pendingApprovals.delete(orderId);
  }
}

async function rejectOrder(orderId) {
  // Prevent duplicate requests
  if (pendingRejections.has(orderId)) {
    return;
  }

  const reason = prompt("Enter rejection reason (optional):");
  if (reason === null) return; // User cancelled
  
  // Mark as pending
  pendingRejections.add(orderId);
  
  // Disable buttons
  const approveBtn = document.querySelector(`button[onclick="approveOrder('${orderId}')"]`);
  const rejectBtn = document.querySelector(`button[onclick="rejectOrder('${orderId}')"]`);
  if (rejectBtn) {
    rejectBtn.disabled = true;
    const originalText = rejectBtn.textContent;
    rejectBtn.textContent = "Rejecting...";
  }
  if (approveBtn) approveBtn.disabled = true;
  
  try {
    // Add retry logic for quota errors
    let retries = 0;
    const maxRetries = 3;
    
    while (retries <= maxRetries) {
      try {
        await db.collection("orders").doc(orderId).update({
          status: "rejected",
          rejectedBy: currentAdmin.username,
          rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
          rejectionReason: reason || ""
        });
        break; // Success
      } catch (error) {
        // Check if it's a quota error
        if ((error.code === 'resource-exhausted' || error.code === 8 || error.message?.includes('Quota') || error.message?.includes('429')) && retries < maxRetries) {
          const waitTime = Math.pow(2, retries) * 1000;
          console.warn(`Quota exceeded, retrying in ${waitTime/1000}s (attempt ${retries + 1}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retries++;
          continue;
        }
        throw error;
      }
    }
    
    alert("Order rejected successfully!");
    
    // Update the UI without full refresh to save quota
    if (currentTab === "orders") {
      // Update the specific row in the table
      const row = document.querySelector(`button[onclick="rejectOrder('${orderId}')"]`)?.closest('tr') ||
                  document.querySelector(`button[onclick="approveOrder('${orderId}')"]`)?.closest('tr');
      if (row) {
        // Update status badge
        const statusCell = row.querySelector('td:nth-child(7)');
        if (statusCell) {
          statusCell.innerHTML = '<span class="px-2 py-1 rounded text-xs bg-red-500/20 text-red-500">rejected</span>';
        }
        
        // Remove action buttons since order is rejected
        const actionsCell = row.querySelector('td:nth-child(8)');
        if (actionsCell) {
          actionsCell.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs">No actions</span>
              <button onclick="deleteOrder('${orderId}')" class="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium">
                Delete
              </button>
            </div>
          `;
        }
      } else {
        // Fallback: full refresh if row not found
        await refreshOrders();
      }
    }
  } catch (error) {
    console.error("Error rejecting order:", error);
    
    let errorMessage = "Failed to reject order";
    if (error.message?.includes('quota') || error.message?.includes('Quota')) {
      errorMessage = "Firebase quota exceeded. Please wait a few minutes before trying again.";
    } else {
      errorMessage = error.message || "Failed to reject order. Please try again.";
    }
    
    alert(errorMessage);
    
    // Re-enable buttons on error
    if (rejectBtn) {
      rejectBtn.disabled = false;
      rejectBtn.textContent = "Reject";
    }
    if (approveBtn) approveBtn.disabled = false;
  } finally {
    pendingRejections.delete(orderId);
  }
}

async function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to permanently delete this order? This action cannot be undone.")) return;

  try {
    await db.collection("orders").doc(orderId).delete();
    alert("Order deleted successfully");
    await refreshOrders();
  } catch (error) {
    console.error("Error deleting order:", error);
    alert("Failed to delete order");
  }
}

// Clear user filter
async function clearUserFilter() {
  window.currentUserFilter = null;
  await refreshOrders();
}

// Revenue History Functions
async function saveRevenueSnapshot() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get yesterday's approved orders
    const ordersSnap = await db.collection("orders")
      .where("createdAt", ">=", yesterday)
      .where("createdAt", "<", today)
      .where("status", "==", "approved")
      .get();
    
    let revenue = 0;
    ordersSnap.forEach(doc => {
      const data = doc.data();
      if (data.priceLBP) revenue += data.priceLBP;
    });
    
    // Save to revenue history
    const dateStr = yesterday.toISOString().split('T')[0];
    await db.collection("revenueHistory").doc(dateStr).set({
      date: yesterday,
      revenue: revenue,
      orderCount: ordersSnap.size,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Revenue snapshot saved for ${dateStr}: ${revenue} LBP`);
    
    // Also update today's revenue in real-time
    await updateTodayRevenue();
    
  } catch (error) {
    console.error("Error saving revenue snapshot:", error);
  }
}

// New function to update today's revenue in real-time
async function updateTodayRevenue() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get today's approved orders
    const ordersSnap = await db.collection("orders")
      .where("createdAt", ">=", today)
      .where("createdAt", "<", tomorrow)
      .where("status", "==", "approved")
      .get();
    
    let revenue = 0;
    ordersSnap.forEach(doc => {
      const data = doc.data();
      if (data.priceLBP) revenue += data.priceLBP;
    });
    
    // Save today's revenue (will be updated throughout the day)
    const dateStr = today.toISOString().split('T')[0];
    await db.collection("revenueHistory").doc(dateStr).set({
      date: today,
      revenue: revenue,
      orderCount: ordersSnap.size,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
  } catch (error) {
    console.error("Error updating today's revenue:", error);
  }
}

async function loadRevenueHistory(range = 'week') {
  try {
    const container = $("#revenue-history");
    if (!container) return;
    
    // Calculate date range based on selection
    let startDate, endDate, title;
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    switch(range) {
      case 'today':
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        endDate = today;
        title = 'Today';
        break;
      case 'week':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        endDate = today;
        title = 'Last 7 Days';
        break;
      case 'month':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
        endDate = today;
        title = 'Last 30 Days';
        break;
      case 'custom':
        const startInput = $("#revenue-start-date").value;
        const endInput = $("#revenue-end-date").value;
        if (!startInput || !endInput) {
          container.innerHTML = '<p class="text-red-400 text-center py-4 text-sm">Please select both start and end dates</p>';
          return;
        }
        startDate = new Date(startInput);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(endInput);
        endDate.setHours(23, 59, 59, 999);
        title = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        endDate = today;
        title = 'Last 7 Days';
    }
    
    // Get revenue history for the selected range
    const historySnap = await db.collection("revenueHistory")
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .orderBy("date", "desc")
      .get();
    
    // Create a map of existing revenue data
    const revenueData = new Map();
    historySnap.forEach(doc => {
      const data = doc.data();
      const date = data.date.toDate();
      const dateKey = date.toISOString().split('T')[0];
      revenueData.set(dateKey, data);
    });
    
    // Generate days for the selected range
    let html = '';
    let totalRevenue = 0;
    let totalOrders = 0;
    let dayCount = 0;
    
    const currentDate = new Date(endDate);
    while (currentDate >= startDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const data = revenueData.get(dateKey);
      
      const isToday = dateKey === new Date().toISOString().split('T')[0];
      const dateLabel = isToday ? 'Today' : currentDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      
      const revenue = data ? data.revenue : 0;
      const orderCount = data ? data.orderCount : 0;
      
      totalRevenue += revenue;
      totalOrders += orderCount;
      dayCount++;
      
      const revenueColor = revenue > 0 ? 'text-green-400' : 'text-gray-500';
      const bgColor = isToday ? 'bg-blue-500/10 border-blue-500/30' : 'bg-navy-800/50 border-navy-700';
      
      // Compact display for multiple days
      if (range === 'month' || (range === 'custom' && dayCount > 7)) {
        html += `
          <div class="${bgColor} border rounded-lg p-3 ${isToday ? 'ring-1 ring-blue-500/30' : ''}">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-white">${dateLabel}</span>
                ${isToday ? '<span class="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">Live</span>' : ''}
              </div>
              <div class="text-right">
                <p class="font-semibold ${revenueColor}">${formatLBP(revenue)}</p>
                <p class="text-xs text-gray-400">${orderCount} orders</p>
              </div>
            </div>
          </div>
        `;
      } else {
        // Detailed display for shorter ranges
        html += `
          <div class="${bgColor} border rounded-lg p-4 ${isToday ? 'ring-2 ring-blue-500/30' : ''}">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <h4 class="font-semibold text-white">${dateLabel}</h4>
                ${isToday ? '<span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Live</span>' : ''}
              </div>
              <p class="font-bold ${revenueColor} text-lg">${formatLBP(revenue)}</p>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                <span class="text-gray-400">Orders:</span>
                <span class="text-white font-medium">${orderCount}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <span class="text-gray-400">Avg:</span>
                <span class="text-white font-medium">${formatLBP(orderCount > 0 ? revenue / orderCount : 0)}</span>
              </div>
            </div>
          </div>
        `;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Add summary
    const avgDailyRevenue = dayCount > 0 ? totalRevenue / dayCount : 0;
    
    html = `
      <div class="bg-navy-800 border border-navy-600 rounded-lg p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-semibold text-white">${title} Summary</h4>
          <div class="flex items-center gap-2">
            <i data-feather="trending-up" class="w-4 h-4 text-green-400"></i>
            <span class="text-xs text-gray-400">${dayCount} days</span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-xl font-bold text-green-400">${formatLBP(totalRevenue)}</p>
            <p class="text-xs text-gray-400">Total Revenue</p>
          </div>
          <div>
            <p class="text-xl font-bold text-blue-400">${totalOrders}</p>
            <p class="text-xs text-gray-400">Total Orders</p>
          </div>
          <div>
            <p class="text-xl font-bold text-purple-400">${formatLBP(avgDailyRevenue)}</p>
            <p class="text-xs text-gray-400">Daily Average</p>
          </div>
        </div>
      </div>
      ${html}
    `;
    
    // Update button states
    updateRevenueButtonStates(range);
    
    container.innerHTML = html;
    
    // Replace feather icons
    if (window.feather) feather.replace();
    
  } catch (error) {
    console.error("Error loading revenue history:", error);
    const container = $("#revenue-history");
    if (container) {
      container.innerHTML = '<p class="text-red-400 text-center py-4 text-sm">Error loading history</p>';
    }
  }
}

function updateRevenueButtonStates(activeRange) {
  const buttons = ['today', 'week', 'month'];
  buttons.forEach(range => {
    const btn = $(`#revenue-preset-${range}`);
    if (btn) {
      if (range === activeRange) {
        btn.className = "px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors";
      } else {
        btn.className = "px-3 py-1.5 rounded-lg bg-navy-700 hover:bg-navy-600 text-white text-sm font-medium transition-colors";
      }
    }
  });
}

function scheduleRevenueSnapshot() {
  // Calculate time until midnight
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const timeUntilMidnight = midnight - now;
  
  // Schedule snapshot at midnight
  setTimeout(async () => {
    await saveRevenueSnapshot();
    // Reschedule for next day
    scheduleRevenueSnapshot();
    // Reload dashboard to show updated stats
    if (currentTab === 'dashboard') {
      await loadDashboard();
    }
  }, timeUntilMidnight);
  
  console.log(`Revenue snapshot scheduled in ${Math.round(timeUntilMidnight / 1000 / 60)} minutes`);
}

// Make functions global
window.switchTab = switchTab;
window.refreshOrders = refreshOrders;
window.approveOrder = approveOrder;
window.rejectOrder = rejectOrder;
window.clearUserFilter = clearUserFilter;
window.blockUser = blockUser;
window.unblockUser = unblockUser;
