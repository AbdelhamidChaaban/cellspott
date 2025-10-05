// Bootloader: defer loading heavy modules until after user authentication
// This file listens for auth state and dynamically imports heavy scripts

(function() {
  function loadScript(src, attrs = {}) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.defer = true;
      Object.keys(attrs).forEach(k => s.setAttribute(k, attrs[k]));
      s.onload = () => resolve(src);
      s.onerror = (e) => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  // List of heavy scripts to load only after auth
  const heavyScripts = [
    './pages-loader.js',
    './js/promo-codes.js',
    './js/packages.js',
    './js/remaining-modules.js'
  ];

  // If firebase isn't ready yet, poll for it briefly
  function whenFirebaseReady() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const t = setInterval(() => {
        attempts++;
        if (window.firebase && window.firebase.auth) {
          clearInterval(t);
          resolve();
        } else if (attempts > 50) { // ~5s
          clearInterval(t);
          reject(new Error('Firebase did not initialize in time'));
        }
      }, 100);
    });
  }

  async function init() {
    try {
      await whenFirebaseReady();

      // Wait for auth state; if user is logged in load heavy modules immediately;
      // if not logged in, wait until they log in to load heavy modules.
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // Load heavy scripts once
          Promise.all(heavyScripts.map(src => loadScript(src))).then(() => {
            console.info('Heavy modules loaded');
          }).catch(err => console.error('Error loading heavy scripts', err));
        } else {
          // If user is not signed in yet, still preload pages-loader (small) after a short idle timeout
          // to improve navigation for unauthenticated flows but avoid loading full app logic.
          setTimeout(() => {
            loadScript('./pages-loader.js').catch(() => {});
          }, 1000);
        }
      });
    } catch (e) {
      console.warn('Bootloader: firebase not ready, loading heavy modules as fallback');
      // fallback: load everything to avoid breaking app
      heavyScripts.forEach(src => {
        const s = document.createElement('script'); s.src = src; s.defer = true; document.head.appendChild(s);
      });
    }
  }

  init();
})();
