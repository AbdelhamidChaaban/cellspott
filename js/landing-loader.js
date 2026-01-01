/* Landing Page Loader
   Loads and displays the landing page for unauthenticated users
*/

window.loadLandingPage = async function loadLandingPage() {
  const landingView = document.getElementById('landing-view');
  if (!landingView) {
    console.error('Landing view not found');
    return;
  }

  try {
    const response = await fetch('./pages/landing.html');
    if (response.ok) {
      const html = await response.text();
      
      // Extract and inject styles and scripts
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      const styleTag = tempDiv.querySelector('style');
      if (styleTag) {
        const styleContent = styleTag.textContent;
        let existingStyle = document.getElementById('landing-page-styles');
        if (existingStyle) {
          existingStyle.textContent = styleContent;
        } else {
          const newStyle = document.createElement('style');
          newStyle.id = 'landing-page-styles';
          newStyle.textContent = styleContent;
          document.head.appendChild(newStyle);
        }
        styleTag.remove(); // Remove style tag after extracting
      }
      
      // Extract and remove script tags
      const scriptTag = tempDiv.querySelector('script');
      let scriptContent = '';
      if (scriptTag) {
        scriptContent = scriptTag.textContent;
        scriptTag.remove(); // Remove script tag after extracting
      }
      
      // Get the content div and insert it (style and script tags already removed)
      const contentDiv = tempDiv.querySelector('#landing-page');
      if (contentDiv) {
        landingView.innerHTML = contentDiv.outerHTML;
      } else {
        landingView.innerHTML = html;
      }
      
      // Initialize feather icons after content loads
      if (window.feather) {
        feather.replace();
      }
      
      // Execute the extracted script content
      if (scriptContent) {
        try {
          eval(scriptContent);
        } catch (error) {
          console.error('Error executing landing page script:', error);
        }
      }
      
      // Set up the showLogin function globally
      window.showLogin = function() {
        const landingView = document.getElementById('landing-view');
        const authView = document.getElementById('auth-view');
        
        if (landingView) landingView.classList.add('hidden');
        if (authView) {
          authView.classList.remove('hidden');
          authView.classList.add('flex');
        }
        
        // Initialize feather icons in auth view
        if (window.feather) {
          feather.replace();
        }
      };
      
      console.log('Landing page loaded successfully');
    } else {
      console.error('Failed to load landing page:', response.status);
      landingView.innerHTML = '<div class="flex items-center justify-center h-screen"><p class="text-white">Failed to load landing page</p></div>';
    }
  } catch (error) {
    console.error('Error loading landing page:', error);
    landingView.innerHTML = '<div class="flex items-center justify-center h-screen"><p class="text-white">Error loading landing page</p></div>';
  }
}

// Global function to navigate back to landing page
window.goToLanding = function() {
  const landingView = document.getElementById('landing-view');
  const authView = document.getElementById('auth-view');
  const loadingView = document.getElementById('loading-view');
  
  // Hide loading and auth views
  if (loadingView) {
    loadingView.classList.add('hidden');
  }
  if (authView) {
    authView.classList.add('hidden');
    authView.classList.remove('flex');
  }
  if (landingView) {
    landingView.classList.remove('hidden');
  }
  
  // Initialize feather icons
  if (window.feather) {
    feather.replace();
  }
};

// Load landing page immediately when script loads (not waiting for DOMContentLoaded)
// This ensures the landing page appears as fast as possible
if (document.readyState === 'loading') {
  // If still loading, wait for DOMContentLoaded
  document.addEventListener('DOMContentLoaded', loadLandingPage);
} else {
  // DOM is already ready, load immediately
  loadLandingPage();
}

