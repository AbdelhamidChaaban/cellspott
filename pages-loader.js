// Pages content embedded as JavaScript (fallback for file:// protocol)
window.PAGES = {
  "welcome-carousel": `<div id="page-welcome-carousel" class="page">
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-navy-800 border border-navy-600 rounded-2xl max-w-2xl w-full overflow-hidden">
      <div id="carousel-slides" class="relative">
        <div class="carousel-slide active p-8 text-center">
          <div class="mb-6">
            <div class="w-24 h-24 mx-auto bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
              <i data-feather="smile" class="w-12 h-12 text-blue-600"></i>
            </div>
            <h2 class="text-3xl font-bold mb-2">Welcome to CellSpot!</h2>
            <p class="text-gray-400">We're excited to have you here</p>
          </div>
          <div class="space-y-4 text-left max-w-md mx-auto">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i data-feather="check" class="w-4 h-4 text-green-500"></i>
              </div>
              <div>
                <h3 class="font-semibold mb-1">Easy Purchases</h3>
                <p class="text-sm text-gray-400">Buy data packages, credits, and more with just a few clicks</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i data-feather="zap" class="w-4 h-4 text-blue-500"></i>
              </div>
              <div>
                <h3 class="font-semibold mb-1">Fast Delivery</h3>
                <p class="text-sm text-gray-400">Get your services activated quickly after payment confirmation</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i data-feather="shield" class="w-4 h-4 text-purple-500"></i>
              </div>
              <div>
                <h3 class="font-semibold mb-1">Secure & Reliable</h3>
                <p class="text-sm text-gray-400">Your data and transactions are safe with us</p>
              </div>
            </div>
          </div>
        </div>
        <div class="carousel-slide p-8 text-center">
          <div class="mb-6">
            <div class="w-24 h-24 mx-auto bg-green-600/20 rounded-full flex items-center justify-center mb-4">
              <i data-feather="info" class="w-12 h-12 text-green-600"></i>
            </div>
            <h2 class="text-3xl font-bold mb-2">How It Works</h2>
            <p class="text-gray-400">Simple steps to get started</p>
          </div>
          <div class="space-y-6 text-left max-w-md mx-auto">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div>
                <h3 class="font-semibold mb-1">Choose Your Service</h3>
                <p class="text-sm text-gray-400">Browse our packages and select what you need</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
                <h3 class="font-semibold mb-1">Make Payment</h3>
                <p class="text-sm text-gray-400">Transfer money and send proof via WhatsApp</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <h3 class="font-semibold mb-1">Get Activated</h3>
                <p class="text-sm text-gray-400">We'll activate your service once payment is confirmed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-6 border-t border-navy-600 flex items-center justify-between">
        <div class="flex gap-2">
          <div class="carousel-dot active w-2 h-2 rounded-full bg-blue-600"></div>
          <div class="carousel-dot w-2 h-2 rounded-full bg-gray-600"></div>
        </div>
        <div class="flex gap-3">
          <button id="carousel-prev" class="px-4 py-2 rounded-lg bg-navy-700 hover:bg-navy-600 text-white text-sm font-medium transition-colors">Previous</button>
          <button id="carousel-next" class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">Next</button>
          <button id="carousel-skip" class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors hidden">Get Started</button>
        </div>
      </div>
    </div>
  </div>
</div>`,

  "profile": `<div id="page-profile" class="page">
  <div class="max-w-3xl">
    <!-- Personal Information Card -->
    <div class="bgblue">
      <div class="card">
        <div class="flex items-center space-x-2 mb-4">
          <i data-feather="user" class="w-5 h-5"></i>
          <h3 class="text-xl font-semibold">Personal Information</h3>
        </div>
      <p class="text-sm text-gray-400 mb-6">View your profile information</p>
      <form id="profile-form" class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-2 text-gray-300">First Name</label>
            <input id="profile-firstName" disabled class="w-full px-4 py-3 rounded-lg input-dark text-gray-500 cursor-not-allowed">
          </div>
          <div>
            <label class="block text-sm mb-2 text-gray-300">Last Name</label>
            <input id="profile-lastName" disabled class="w-full px-4 py-3 rounded-lg input-dark text-gray-500 cursor-not-allowed">
          </div>
        </div>
        <div>
          <label class="block text-sm mb-2 text-gray-300">Phone Number</label>
          <input id="profile-phone" disabled class="w-full px-4 py-3 rounded-lg input-dark text-gray-500 cursor-not-allowed">
        </div>
        <p class="text-xs text-yellow-400 mt-4">⚠️ Personal information cannot be changed after registration.</p>
      </form>
      </div>
    </div>
  </div>
</div>`,

  "open-services": `<div id="page-open-services" class="page">
  <div class="card-bg border border-navy-600 rounded-2xl p-6">
    <div class="flex items-center space-x-2 mb-4">
      <i data-feather="wifi" class="w-5 h-5"></i>
      <h3 class="text-xl font-semibold">Open u-share Services</h3>
    </div>
    <p class="text-sm text-gray-400 mb-6">Available Open u-share Packages</p>
    
    <!-- Promo Code Section -->
    <div class="mb-6 max-w-md">
      <label class="block text-sm mb-2 text-gray-300">Have a promo code?</label>
      <div class="flex gap-3">
        <input 
          id="open-promo-code-input" 
          type="text" 
          placeholder="Enter promo code" 
          class="flex-1 px-4 py-2.5 rounded-lg input-dark text-sm"
        />
        <button 
          id="open-apply-promo-btn" 
          class="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Apply
        </button>
      </div>
      <div id="open-promo-message" class="mt-2 text-sm"></div>
    </div>
    
    <!-- Packages Grid -->
    <div id="open-packages-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Packages will be loaded here -->
    </div>
  </div>
</div>`,

  "closed-services": `<div id="page-closed-services" class="page">
  <div class="card-bg border border-navy-600 rounded-2xl p-6">
    <div class="flex items-center space-x-2 mb-4">
      <i data-feather="wifi" class="w-5 h-5"></i>
      <h3 class="text-xl font-semibold">Closed u-share Services</h3>
    </div>
    <p class="text-sm text-gray-400 mb-6">Available u-share Services</p>
    
    <!-- Promo Code Section -->
    <div class="mb-6 max-w-md">
      <label class="block text-sm mb-2 text-gray-300">Have a promo code?</label>
      <div class="flex gap-3">
        <input 
          id="promo-code-input" 
          type="text" 
          placeholder="Enter promo code" 
          class="flex-1 px-4 py-2.5 rounded-lg input-dark text-sm"
        />
        <button 
          id="apply-promo-btn" 
          class="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Apply
        </button>
      </div>
      <div id="promo-message" class="mt-2 text-sm"></div>
    </div>
    
    <div id="packages-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"></div>
  </div>
</div>`,

  "alfa-gifts": `<div id="page-alfa-gifts" class="page">
  <div class="card-bg border border-navy-600 rounded-2xl p-6">
    <div class="flex items-center space-x-2 mb-4">
      <i data-feather="gift" class="w-5 h-5"></i>
      <h3 class="text-xl font-semibold">Alfa Gifts</h3>
    </div>
    <p class="text-sm text-gray-400 mb-6">Available Gift Packages</p>
    
    <!-- Promo Code Section -->
    <div class="mb-6 max-w-md">
      <label class="block text-sm mb-2 text-gray-300">Have a promo code?</label>
      <div class="flex gap-3">
        <input 
          id="alfa-promo-code-input" 
          type="text" 
          placeholder="Enter promo code" 
          class="flex-1 px-4 py-2.5 rounded-lg input-dark text-sm"
        />
        <button 
          id="alfa-apply-promo-btn" 
          class="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Apply
        </button>
      </div>
      <div id="alfa-promo-message" class="mt-2 text-sm"></div>
    </div>
    
    <div id="alfa-packages-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"></div>
  </div>
</div>`,

  "streaming": `<div id="page-streaming" class="page">
  <div class="card-bg border border-navy-600 rounded-2xl p-6">
    <div class="flex items-center space-x-2 mb-4">
      <i data-feather="tv" class="w-5 h-5"></i>
      <h3 class="text-xl font-semibold">Streaming Services</h3>
    </div>
    <p class="text-sm text-gray-400 mb-8">Choose a streaming service to manage</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Netflix Card -->
      <div class="package-card-wrapper">
        <div class="package-card-inner flex flex-col items-center text-center space-y-4">
          <svg class="w-20 h-20 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c2.873-.086 4.958-.406 5.002-.398V1.05z"/>
          </svg>
          <div>
            <h4 class="text-2xl font-bold text-white mb-2">Netflix</h4>
            <p class="text-sm text-gray-400">Manage Netflix subscriptions</p>
          </div>
          <button data-service="netflix" class="streaming-enter w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all hover:scale-105 flex items-center justify-center space-x-2">
            <span>Enter</span>
            <i data-feather="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Shahed Card -->
      <div class="package-card-wrapper">
        <div class="package-card-inner flex flex-col items-center text-center space-y-4">
          <svg class="w-20 h-20 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          <div>
            <h4 class="text-2xl font-bold text-white mb-2">Shahed</h4>
            <p class="text-sm text-gray-400">Manage Shahed subscriptions</p>
          </div>
          <button data-service="shahed" class="streaming-enter w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all hover:scale-105 flex items-center justify-center space-x-2">
            <span>Enter</span>
            <i data-feather="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- OSN+ Card -->
      <div class="package-card-wrapper">
        <div class="package-card-inner flex flex-col items-center text-center space-y-4">
          <svg class="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
          </svg>
          <div>
            <h4 class="text-2xl font-bold text-white mb-2">OSN+</h4>
            <p class="text-sm text-gray-400">Manage OSN+ subscriptions</p>
          </div>
          <button data-service="osn" class="streaming-enter w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all hover:scale-105 flex items-center justify-center space-x-2">
            <span>Enter</span>
            <i data-feather="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`,

  "credits": `<div id="page-credits" class="page">
  <div class="max-w-2xl mx-auto">
    <div class="bgblue">
      <div class="card">
        <div class="flex items-center space-x-2 mb-6">
          <i data-feather="dollar-sign" class="w-5 h-5"></i>
          <h3 class="text-xl font-semibold">Credits Purchase</h3>
        </div>
      
      <!-- Warning Message -->
      <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
        <i data-feather="alert-triangle" class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"></i>
        <p class="text-sm text-yellow-200">Make sure to transfer the required amount to purchase the service</p>
      </div>
      
      <!-- Phone Number Input -->
      <div class="mb-6">
        <label class="block text-sm mb-2 text-gray-300">Phone Number</label>
        <input 
          id="credits-phone-input" 
          type="text" 
          inputmode="numeric" 
          pattern="^\\d{8}$" 
          placeholder="70xxxxxx" 
          class="w-full px-4 py-3 rounded-lg input-dark"
        >
        <p class="text-xs text-gray-400 mt-1">Enter your phone number (8 digits)</p>
      </div>
      
      <!-- Number of Credits Input -->
      <div class="mb-6">
        <label class="block text-sm mb-2 text-gray-300">Number of Credits</label>
        <div class="flex items-center gap-2">
          <input 
            id="credits-amount-input" 
            type="number" 
            min="1" 
            placeholder="Enter number of credits" 
            class="flex-1 px-4 py-3 rounded-lg input-dark"
          >
          <button 
            id="credits-show-price-btn" 
            type="button" 
            class="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Apply
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-1">Enter the required number of credits</p>
        
        <!-- Price Display (Red Message) -->
        <div id="credits-price-display" class="hidden mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p class="text-sm text-red-400 font-semibold">
            Total Price: <span id="credits-total-price" class="text-red-300">0 LBP</span>
          </p>
        </div>
      </div>
      
      <!-- Transfer Number -->
      <div class="bg-navy-800 rounded-lg p-4 border border-navy-600 mb-6">
        <label class="block text-sm mb-2 text-gray-300">Transfer to this number:</label>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl font-mono font-bold">71829887</span>
            <span class="text-sm font-semibold text-red-500">WHISH MONEY</span>
          </div>
          <button id="credits-copy-btn" type="button" class="text-gray-400 hover:text-white transition-colors" title="Copy">
            <i data-feather="copy" class="w-5 h-5"></i>
          </button>
        </div>
      </div>
      
      <!-- Payment Confirmation Button -->
      <div class="mb-6">
        <button id="credits-confirm-btn" type="button" class="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors flex items-center justify-center space-x-2">
          <i data-feather="check-circle" class="w-5 h-5"></i>
          <span>I have transferred the money</span>
        </button>
      </div>
      
      <!-- WhatsApp Reminder -->
      <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
        <i data-feather="message-circle" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"></i>
        <p class="text-sm text-green-200">📸 Remember to upload your transfer proof image on WhatsApp</p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <button id="credits-cancel-btn" type="button" class="px-6 py-3 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors">
          Cancel
        </button>
        <button id="credits-submit-btn" type="button" class="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors flex items-center space-x-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>Send to WhatsApp</span>
        </button>
      </div>
      
      <p id="credits-error" class="text-sm text-red-400 mt-3 text-center"></p>
      </div>
    </div>
  </div>
</div>`,

  "credits-old": `<div id="page-credits-old" class="page">
  <div class="max-w-2xl mx-auto">
    <div class="card-bg border border-navy-600 rounded-2xl p-6">
      <div class="flex items-center space-x-2 mb-6">
        <i data-feather="dollar-sign" class="w-5 h-5"></i>
        <h3 class="text-xl font-semibold">Credits Purchase</h3>
      </div>
      
      <!-- Warning Message -->
      <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
        <i data-feather="alert-triangle" class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"></i>
        <p class="text-sm text-yellow-200">Make sure to transfer the required amount to purchase the service</p>
      </div>
      
      <!-- Form Inputs -->
      <div class="space-y-5">
        <!-- Phone Number to Transfer To -->
        <div>
          <label class="block text-sm mb-2 text-gray-300">Number to transfer to</label>
          <input 
            id="credits-phone-input" 
            type="text" 
            inputmode="numeric" 
            pattern="^\\d{8}$" 
            placeholder="70xxxxxx" 
            class="w-full px-4 py-3 rounded-lg input-dark"
          >
          <p class="text-xs text-gray-400 mt-1">Enter the phone number you want to transfer credits to</p>
        </div>
        
        <!-- Number of Credits -->
        <div>
          <label class="block text-sm mb-2 text-gray-300">Number of Credits</label>
          <div class="flex items-center gap-2">
            <input 
              id="credits-amount-input" 
              type="number" 
              min="1" 
              placeholder="Enter number of credits" 
              class="flex-1 px-4 py-3 rounded-lg input-dark"
            >
            <button 
              id="credits-show-price-btn" 
              type="button" 
              class="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-1">Enter the required number of credits</p>
          
          <!-- Price Display (Red Message) -->
          <div id="credits-price-display" class="hidden mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p class="text-sm text-red-400 font-semibold">
              Total Price: <span id="credits-total-price" class="text-red-300">0 LBP</span>
            </p>
          </div>
        </div>
        
        <!-- Transfer Number -->
        <div class="bg-navy-800 rounded-lg p-4 border border-navy-600">
          <label class="block text-sm mb-2 text-gray-300">Transfer to this number:</label>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl font-mono font-bold">71829887</span>
              <span class="text-sm font-semibold text-red-500">WISH MONEY</span>
            </div>
            <button id="credits-copy-btn" type="button" class="text-gray-400 hover:text-white transition-colors" title="Copy">
              <i data-feather="copy" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
        
        <!-- Payment Confirmation Button -->
        <div>
          <button id="credits-confirm-btn" type="button" class="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors flex items-center justify-center space-x-2">
            <i data-feather="check-circle" class="w-5 h-5"></i>
            <span>I have transferred the money</span>
          </button>
        </div>
      </div>
      
      <!-- WhatsApp Reminder -->
      <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-6 flex items-start gap-3">
        <i data-feather="message-circle" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"></i>
        <p class="text-sm text-green-200">Remember to upload your transfer proof image on WhatsApp</p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 mt-6">
        <button id="credits-cancel-btn" type="button" class="px-6 py-3 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors">
          Cancel
        </button>
        <button id="credits-submit-btn" type="button" class="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors flex items-center space-x-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>Send to WhatsApp</span>
        </button>
      </div>
      
      <p id="credits-error" class="text-sm text-red-400 mt-3 text-center"></p>
    </div>
  </div>
</div>`,

  "validity": `<div id="page-validity" class="page">
    <div class="card-bg border border-navy-600 rounded-2xl p-6">
      <div class="flex items-center space-x-2 mb-6">
        <i data-feather="calendar" class="w-5 h-5"></i>
        <h3 class="text-xl font-semibold">Validity Packages</h3>
      </div>
      <p class="text-sm text-gray-400 mb-8">Choose your validity extension package</p>
      
      <!-- Promo Code Section -->
      <div class="mb-6 max-w-md">
        <label class="block text-sm mb-2 text-gray-300">Have a promo code?</label>
        <div class="flex gap-3">
          <input 
            id="validity-promo-code-input" 
            type="text" 
            placeholder="Enter promo code" 
            class="flex-1 px-4 py-2.5 rounded-lg input-dark text-sm"
          />
          <button 
            id="validity-apply-promo-btn" 
            class="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Apply
          </button>
        </div>
        <div id="validity-promo-message" class="mt-2 text-sm"></div>
      </div>

      <div id="validity-packages-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="col-span-full text-center py-8 text-gray-400">Loading packages...</div>
      </div>
    </div>
  </div>
</div>`,

  "validity-old": `<div id="page-validity-old" class="page">
  <div class="max-w-2xl mx-auto">
    <div class="card-bg border border-navy-600 rounded-2xl p-6">
      <div class="flex items-center space-x-2 mb-6">
        <i data-feather="calendar" class="w-5 h-5"></i>
        <h3 class="text-xl font-semibold">Validity Purchase</h3>
      </div>
      
      <!-- Warning Message -->
      <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
        <i data-feather="alert-triangle" class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"></i>
        <p class="text-sm text-yellow-200">Make sure to transfer the required amount to purchase the service</p>
      </div>
      
      <!-- Transfer Number -->
      <div class="mb-6">
        <label class="block text-sm mb-2 text-gray-300">Transfer to this number:</label>
        <div class="flex items-center justify-between bg-navy-800 rounded-lg px-4 py-3 border border-navy-600">
          <div class="flex items-center gap-3">
            <span class="text-2xl font-mono font-bold">71829887</span>
            <span class="text-sm font-semibold text-red-500">WISH MONEY</span>
          </div>
          <button id="validity-copy-btn" type="button" class="text-gray-400 hover:text-white transition-colors" title="Copy">
            <i data-feather="copy" class="w-5 h-5"></i>
          </button>
        </div>
      </div>
      
      <!-- Payment Confirmation Button -->
      <div class="mb-6">
        <button id="validity-confirm-btn" type="button" class="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors flex items-center justify-center space-x-2">
          <i data-feather="check-circle" class="w-5 h-5"></i>
          <span>I have transferred the money</span>
        </button>
      </div>
      
      <!-- Form Input (Initially Disabled) -->
      <div id="validity-form-section" class="space-y-5 opacity-50 pointer-events-none">
        <!-- Phone Number -->
        <div>
          <label class="block text-sm mb-2 text-gray-300">Phone Number</label>
          <input 
            id="validity-phone-input" 
            type="text" 
            inputmode="numeric" 
            pattern="^\\d{8}$" 
            placeholder="70xxxxxx" 
            class="w-full px-4 py-3 rounded-lg input-dark"
            disabled
          >
          <p class="text-xs text-gray-400 mt-1">Please enter a valid phone number</p>
        </div>
        
        <p class="text-xs text-gray-500 flex items-center gap-2">
          <i data-feather="alert-circle" class="w-4 h-4"></i>
          <span>Please confirm payment first</span>
        </p>
      </div>
      
      <!-- WhatsApp Reminder -->
      <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-6 flex items-start gap-3">
        <i data-feather="message-circle" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"></i>
        <p class="text-sm text-green-200">Remember to upload your transfer proof image on WhatsApp</p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 mt-6">
        <button id="validity-cancel-btn" type="button" class="px-6 py-3 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors">
          Cancel
        </button>
        <button id="validity-submit-btn" type="button" class="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors flex items-center space-x-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>Send to WhatsApp</span>
        </button>
      </div>
      
      <p id="validity-error" class="text-sm text-red-400 mt-3 text-center"></p>
    </div>
  </div>
</div>`,

  "order-history": `<div id="page-order-history" class="page">
  <div class="card-bg border border-navy-600 rounded-2xl p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <i data-feather="list" class="w-5 h-5"></i>
        <h3 class="text-xl font-semibold">Order History</h3>
      </div>
      <div class="flex items-center gap-2">
        <button id="export-orders-btn" class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors flex items-center gap-2">
          <i data-feather="download" class="w-4 h-4"></i>
          <span>Export to Excel</span>
        </button>
        <button id="toggle-all-orders-btn" class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors flex items-center gap-2">
          <i data-feather="clock" class="w-4 h-4"></i>
          <span>Show All Orders</span>
        </button>
      </div>
    </div>
    <p class="text-sm text-gray-400 mb-4">Showing today's orders only. Click "Show All Orders" to view previous orders.</p>
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <input id="order-search" placeholder="Search by phone" class="px-4 py-2.5 rounded-lg input-dark text-sm flex-1 min-w-[200px]" />
      <select id="order-status" class="px-4 py-2.5 rounded-lg input-dark text-sm min-w-[150px]">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <div class="relative">
        <button id="order-date-btn" class="px-4 py-2.5 rounded-lg input-dark text-sm flex items-center space-x-2 min-w-[200px]">
          <i data-feather="calendar" class="w-4 h-4"></i>
          <span id="order-date-label">selectDateRange</span>
        </button>
        <input id="order-start" type="date" class="hidden" />
        <input id="order-end" type="date" class="hidden" />
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="border-b border-navy-600">
            <th class="text-left px-4 py-3 text-gray-400 font-medium">date</th>
            <th class="text-left px-4 py-3 text-gray-400 font-medium">Service Type</th>
            <th class="text-left px-4 py-3 text-gray-400 font-medium">price</th>
            <th class="text-left px-4 py-3 text-gray-400 font-medium">status</th>
            <th class="text-left px-4 py-3 text-gray-400 font-medium">Quantity</th>
          </tr>
        </thead>
        <tbody id="order-history-body"></tbody>
      </table>
      <div id="order-history-empty" class="text-center text-gray-400 py-12">No order history found yet</div>
    </div>
  </div>
</div>`,

  "netflix": `<div id="page-netflix" class="page">
  <div class="card-bg border border-navy-600 rounded-2xl p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <button id="back-to-streaming" class="text-gray-400 hover:text-gray-200 mr-2">
          <i data-feather="arrow-left" class="w-5 h-5"></i>
        </button>
        <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c2.873-.086 4.958-.406 5.002-.398V1.05z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold">Netflix Subscriptions</h3>
      </div>
    </div>
    <p class="text-sm text-gray-400 mb-8">Choose your Netflix subscription plan</p>
    
    <!-- Promo Code Section -->
    <div class="mb-6 max-w-md">
      <label class="block text-sm mb-2 text-gray-300">Have a promo code?</label>
      <div class="flex gap-3">
        <input 
          id="netflix-promo-code-input" 
          type="text" 
          placeholder="Enter promo code" 
          class="flex-1 px-4 py-2.5 rounded-lg input-dark text-sm"
        />
        <button 
          id="netflix-apply-promo-btn" 
          class="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Apply
        </button>
      </div>
      <div id="netflix-promo-message" class="mt-2 text-sm"></div>
    </div>

    <div id="netflix-packages-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="col-span-full text-center py-8 text-gray-400">Loading packages...</div>
    </div>
  </div>
</div>`,

  "shahed": `<div id="page-shahed" class="page">
  <div class="card-bg border border-navy-600 rounded-2xl p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <button id="back-to-streaming" class="text-gray-400 hover:text-gray-200 mr-2">
          <i data-feather="arrow-left" class="w-5 h-5"></i>
        </button>
        <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold">Shahed Subscriptions</h3>
      </div>
    </div>
    <p class="text-sm text-gray-400 mb-8">Choose your Shahed subscription plan</p>
    
    <!-- Promo Code Section -->
    <div class="mb-6 max-w-md">
      <label class="block text-sm mb-2 text-gray-300">Have a promo code?</label>
      <div class="flex gap-3">
        <input 
          id="shahed-promo-code-input" 
          type="text" 
          placeholder="Enter promo code" 
          class="flex-1 px-4 py-2.5 rounded-lg input-dark text-sm"
        />
        <button 
          id="shahed-apply-promo-btn" 
          class="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Apply
        </button>
      </div>
      <div id="shahed-promo-message" class="mt-2 text-sm"></div>
    </div>

    <div id="shahed-packages-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="col-span-full text-center py-8 text-gray-400">Loading packages...</div>
    </div>
  </div>
</div>`,

  "osn": `<div id="page-osn" class="page">
  <div class="card-bg border border-navy-600 rounded-2xl p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <button id="back-to-streaming" class="text-gray-400 hover:text-gray-200 mr-2">
          <i data-feather="arrow-left" class="w-5 h-5"></i>
        </button>
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold">OSN+ Subscriptions</h3>
      </div>
    </div>
    <p class="text-sm text-gray-400 mb-8">Choose your OSN+ subscription plan</p>
    
    <!-- Promo Code Section -->
    <div class="mb-6 max-w-md">
      <label class="block text-sm mb-2 text-gray-300">Have a promo code?</label>
      <div class="flex gap-3">
        <input 
          id="osn-promo-code-input" 
          type="text" 
          placeholder="Enter promo code" 
          class="flex-1 px-4 py-2.5 rounded-lg input-dark text-sm"
        />
        <button 
          id="osn-apply-promo-btn" 
          class="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Apply
        </button>
      </div>
      <div id="osn-promo-message" class="mt-2 text-sm"></div>
    </div>

    <div id="osn-packages-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="col-span-full text-center py-8 text-gray-400">Loading packages...</div>
    </div>
  </div>
</div>`
};
