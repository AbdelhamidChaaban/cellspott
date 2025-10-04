/* Sidebar Management
   Handles sidebar collapse/expand and mobile menu
*/

// ---------- Sidebar Collapse ----------
function initSidebar() {
  const sidebar = $("#sidebar");
  const toggle = $("#sidebar-toggle");
  const brandText = $("#brand-text");
  const labels = $$(".nav-label");
  const backdrop = $("#sidebar-backdrop");
  const sidebarOpen = $("#sidebar-open");

  console.log("initSidebar called", { sidebar, toggle, brandText, labelsCount: labels.length });

  if (!sidebar || !toggle || !brandText) {
    console.error("Sidebar elements not found!");
    return;
  }

  const isMobile = () => window.innerWidth < 1024;

  function closeMobileSidebar() {
    if (isMobile()) {
      sidebar.classList.add("-translate-x-full");
      if (backdrop) backdrop.classList.add("hidden");
    }
  }

  function openMobileSidebar() {
    if (isMobile()) {
      sidebar.classList.remove("-translate-x-full");
      if (backdrop) backdrop.classList.remove("hidden");
    }
  }

  function applyCollapsed(collapsed) {
    console.log("applyCollapsed:", collapsed);
    
    // On desktop, handle collapse
    if (!isMobile()) {
      if (collapsed) {
        sidebar.style.width = "4rem"; // icons-only
        brandText.classList.add("hidden");
        labels.forEach((l) => l.classList.add("hidden"));
        toggle.innerHTML = '<i data-feather="chevron-right"></i>';
      } else {
        sidebar.style.width = "16rem"; // default w-64
        brandText.classList.remove("hidden");
        labels.forEach((l) => l.classList.remove("hidden"));
        toggle.innerHTML = '<i data-feather="chevron-left"></i>';
      }
      if (window.feather) feather.replace();
      localStorage.setItem("sidebarCollapsed", collapsed ? "1" : "0");
    } else {
      // On mobile, toggle open/close
      closeMobileSidebar();
    }
  }

  // Desktop toggle button
  toggle.addEventListener("click", (e) => {
    console.log("Sidebar toggle clicked!");
    e.preventDefault();
    e.stopPropagation();
    
    if (isMobile()) {
      closeMobileSidebar();
    } else {
      const current = localStorage.getItem("sidebarCollapsed") === "1";
      applyCollapsed(!current);
    }
  });

  // Mobile open button
  if (sidebarOpen) {
    sidebarOpen.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMobileSidebar();
    });
  }

  // Backdrop click closes sidebar
  if (backdrop) {
    backdrop.addEventListener("click", closeMobileSidebar);
  }

  // Close sidebar when clicking nav items on mobile
  $$(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (isMobile()) {
        closeMobileSidebar();
      }
    });
  });

  // Apply initial state (desktop only)
  if (!isMobile()) {
    const initial = localStorage.getItem("sidebarCollapsed") === "1";
    applyCollapsed(initial);
  }
}
