// ============================================================================
    // AllPuffs POS - Staff-Facing Point of Sale
    // ============================================================================

    const STORE = {
      id: 'allpuffs',
      name: 'AllPuffs',
      address: '123 Main St',
      purchaseBonusPoints: 10,
      signupBonusPoints: 100,
      taxRate: 0.0825
    };

    const PRODUCTS = [
      // Disposables
      { id: 'p1', name: 'Puff Bar Plus', category: 'Disposables', flavor: 'Strawberry Banana', price: 12.99, emoji: '🍓', featured: true, puffs: '800+' },
      { id: 'p2', name: 'Elf Bar BC5000', category: 'Disposables', flavor: 'Blue Razz Ice', price: 15.99, emoji: '🫐', featured: true, puffs: '5000' },
      { id: 'p3', name: 'Lost Mary OS5000', category: 'Disposables', flavor: 'Watermelon Ice', price: 14.99, emoji: '🍉', featured: false, puffs: '5000' },
      { id: 'p4', name: 'Breeze Pro', category: 'Disposables', flavor: 'Mint', price: 13.99, emoji: '🌿', featured: true, puffs: '2000' },
      { id: 'p5', name: 'Hyde Edge', category: 'Disposables', flavor: 'Peach Mango', price: 12.99, emoji: '🥭', featured: false, puffs: '1500' },
      { id: 'p6', name: 'Flum Float', category: 'Disposables', flavor: 'Aloe Grape', price: 14.99, emoji: '🍇', featured: false, puffs: '3000' },
      { id: 'p7', name: 'Geek Bar Pulse', category: 'Disposables', flavor: 'Mango Peach', price: 16.99, emoji: '🥭', featured: true, puffs: '15000' },
      { id: 'p8', name: 'RAZ TN9000', category: 'Disposables', flavor: 'Blue Razz', price: 17.99, emoji: '🫐', featured: false, puffs: '9000' },

      // Pods
      { id: 'p9', name: 'JUUL Pods', category: 'Pods', flavor: 'Virginia Tobacco', price: 19.99, emoji: '📦', featured: true, puffs: '4-Pack' },
      { id: 'p10', name: 'Vuse Alto', category: 'Pods', flavor: 'Menthol', price: 18.99, emoji: '📦', featured: false, puffs: '2-Pack' },
      { id: 'p11', name: 'SMOK Nord Pods', category: 'Pods', flavor: 'Mixed Berry', price: 16.99, emoji: '📦', featured: false, puffs: '3-Pack' },
      { id: 'p12', name: 'Caliburn Pods', category: 'Pods', flavor: 'Apple Ice', price: 15.99, emoji: '📦', featured: true, puffs: '4-Pack' },

      // E-Liquids
      { id: 'p13', name: 'Naked 100', category: 'E-Liquid', flavor: 'Lava Flow', price: 24.99, emoji: '💧', featured: true, puffs: '60ml' },
      { id: 'p14', name: 'Juice Head', category: 'E-Liquid', flavor: 'Blueberry Lemon', price: 22.99, emoji: '💧', featured: false, puffs: '100ml' },
      { id: 'p15', name: 'Vapetasia', category: 'E-Liquid', flavor: 'Killer Kustard', price: 21.99, emoji: '💧', featured: true, puffs: '100ml' },
      { id: 'p16', name: 'Pacha Mama', category: 'E-Liquid', flavor: 'Fuji Apple', price: 23.99, emoji: '💧', featured: false, puffs: '60ml' },

      // Devices
      { id: 'p17', name: 'SMOK RPM 5', category: 'Devices', flavor: 'Starter Kit', price: 39.99, emoji: '📱', featured: true, puffs: 'Kit' },
      { id: 'p18', name: 'GeekVape Aegis', category: 'Devices', flavor: 'Legend 3', price: 69.99, emoji: '📱', featured: false, puffs: 'Mod' },
      { id: 'p19', name: 'Vaporesso XROS', category: 'Devices', flavor: 'Pod System', price: 29.99, emoji: '📱', featured: false, puffs: 'Kit' },
      { id: 'p20', name: 'Voopoo Drag X', category: 'Devices', flavor: 'Pro Kit', price: 54.99, emoji: '📱', featured: true, puffs: 'Kit' }
    ];

    let appState = {
      currentView: 'age-gate',
      ageVerified: false,
      cart: [],
      currentCategory: 'All',
      searchQuery: '',
      // Terminal bridge state
      transactionCustomer: null,
      terminalStatus: 'idle', // idle | pending | phone-entered | processing | complete | error
      terminalResult: null
    };

    // ============================================================================
    // STORAGE
    // ============================================================================

    function loadAgeVerification() {
      return sessionStorage.getItem('ageVerified') === 'true';
    }

    function saveAgeVerification() {
      sessionStorage.setItem('ageVerified', 'true');
      appState.ageVerified = true;
    }

    // Customer database (shared with terminal via localStorage)
    function lookupCustomerByPhone(phone) {
      const cleaned = phone.replace(/\D/g, '');
      const customers = JSON.parse(localStorage.getItem('allpuffs_customers') || '[]');
      return customers.find(c => c.phone.replace(/\D/g, '') === cleaned);
    }

    function registerCustomer(phone) {
      const customers = JSON.parse(localStorage.getItem('allpuffs_customers') || '[]');
      const newCustomer = {
        id: 'cust_' + Date.now(),
        name: 'Customer',
        phone: phone,
        points: STORE.signupBonusPoints,
        entries: 0,
        bankLinked: false,
        createdAt: new Date().toISOString()
      };
      customers.push(newCustomer);
      localStorage.setItem('allpuffs_customers', JSON.stringify(customers));
      return newCustomer;
    }

    function updateCustomerPoints(customerId, pointsDelta) {
      const customers = JSON.parse(localStorage.getItem('allpuffs_customers') || '[]');
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        customer.points = (customer.points || 0) + pointsDelta;
        customer.entries = (customer.entries || 0) + 1;
        localStorage.setItem('allpuffs_customers', JSON.stringify(customers));
        return customer;
      }
      return null;
    }

    // ============================================================================
    // FILTERS
    // ============================================================================

    function getFilteredProducts() {
      let filtered = PRODUCTS;
      if (appState.currentCategory !== 'All') {
        filtered = filtered.filter(p => p.category === appState.currentCategory);
      }
      if (appState.searchQuery) {
        const query = appState.searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.flavor.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }
      return filtered;
    }

    function getFeaturedProducts() {
      return PRODUCTS.filter(p => p.featured).slice(0, 4);
    }

    // ============================================================================
    // VIEWS
    // ============================================================================

    function AgeGateView() {
      return `
        <div class="age-gate">
          <div class="age-gate-card">
            <div class="age-icon">🛡️</div>
            <h1 class="age-title">Age Verification Required</h1>
            <p class="age-subtitle">You must be 21 or older to access this system</p>

            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <input type="text" class="form-input" id="dob" placeholder="MM/DD/YYYY">
            </div>

            <div class="checkbox-group" onclick="toggleCheckbox('ageCheck')">
              <div class="checkbox" id="ageCheck"></div>
              <label class="checkbox-label">
                I confirm that I am 21 years of age or older and agree to comply with all applicable laws regarding tobacco and vape product purchases.
              </label>
            </div>

            <button class="btn btn-primary" style="margin-top: 24px;" onclick="handleAgeVerify()">
              Verify Age & Enter
            </button>

            <p class="disclaimer">
              Federal law prohibits the sale of tobacco and vape products to persons under 21 years of age.
            </p>
          </div>
        </div>
      `;
    }

    function ShopView() {
      const filteredProducts = getFilteredProducts();
      const featuredProducts = getFeaturedProducts();
      const categories = ['All', 'Disposables', 'Pods', 'E-Liquid', 'Devices'];

      const statusDot = appState.terminalStatus === 'idle' ? 'status-idle' :
                         appState.terminalStatus === 'pending' ? 'status-pending' :
                         appState.terminalStatus === 'complete' ? 'status-complete' : 'status-active';

      const statusLabel = appState.terminalStatus === 'idle' ? 'Terminal Ready' :
                          appState.terminalStatus === 'pending' ? 'Waiting on Customer...' :
                          appState.terminalStatus === 'phone-entered' ? 'Customer Identified' :
                          appState.terminalStatus === 'processing' ? 'Processing...' :
                          appState.terminalStatus === 'complete' ? 'Transaction Complete' : 'Terminal Ready';

      return `
        <div class="header">
          <div class="header-content">
            <div class="logo-section">
              <div class="logo-icon">💨</div>
              <div class="logo-text">${STORE.name} <span class="pos-label">POS</span></div>
            </div>
            <div class="header-actions">
              <div class="terminal-status-badge ${statusDot}">
                <div class="terminal-dot"></div>
                <span>${statusLabel}</span>
              </div>
            </div>
          </div>
          ${appState.transactionCustomer ? `
            <div class="customer-banner">
              <div class="customer-banner-avatar">${appState.transactionCustomer.name.charAt(0)}</div>
              <div class="customer-banner-info">
                <strong>${appState.transactionCustomer.name}</strong> &middot; ${appState.transactionCustomer.phone}
                <span class="customer-banner-points">${appState.transactionCustomer.points} pts</span>
                ${appState.transactionCustomer.bankLinked ? '<span class="bank-linked-tag">Bank Linked</span>' : ''}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="main-content">
          <div class="search-section">
            <div class="search-bar">
              <input
                type="text"
                class="search-input"
                placeholder="Search products, flavors..."
                value="${appState.searchQuery}"
                oninput="handleSearch(event)"
              >
              <span class="search-icon">🔍</span>
            </div>
          </div>

          ${appState.searchQuery === '' && appState.currentCategory === 'All' ? `
            <div class="featured-banner">
              <div class="featured-content">
                <h2>Featured Products</h2>
                <p>Most popular items</p>
              </div>
              <div class="featured-badge">🔥 Hot Sellers</div>
            </div>

            <div class="section-header">
              <h2 class="section-title">Top Picks</h2>
            </div>

            <div class="product-grid">
              ${featuredProducts.map(product => renderProductCard(product, true)).join('')}
            </div>
          ` : ''}

          <div class="category-tabs">
            ${categories.map(cat => `
              <div class="category-tab ${appState.currentCategory === cat ? 'active' : ''}"
                   onclick="setCategory('${cat}')">
                ${cat === 'All' ? '🔥' : cat === 'Disposables' ? '💨' : cat === 'Pods' ? '📦' : cat === 'E-Liquid' ? '💧' : '📱'} ${cat}
              </div>
            `).join('')}
          </div>

          <div class="section-header">
            <h2 class="section-title">
              ${appState.searchQuery ? `Search Results (${filteredProducts.length})` :
                appState.currentCategory === 'All' ? 'All Products' : appState.currentCategory}
            </h2>
          </div>

          ${filteredProducts.length === 0 ? `
            <div style="text-align: center; padding: 60px 20px;">
              <div style="font-size: 64px; margin-bottom: 16px;">🔍</div>
              <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">No products found</h3>
              <p style="color: var(--text-secondary);">Try adjusting your search or filters</p>
            </div>
          ` : `
            <div class="product-grid">
              ${filteredProducts.map(product => renderProductCard(product, false)).join('')}
            </div>
          `}
        </div>

        ${appState.cart.length > 0 ? `
          <div class="cart-float" onclick="navigate('checkout')">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 24px;">🛒</div>
              <div style="font-weight: 600;">Checkout (${appState.cart.reduce((t, i) => t + i.quantity, 0)} items)</div>
            </div>
            <div style="font-size: 20px; font-weight: 800;">$${calculateTotal().toFixed(2)}</div>
          </div>
        ` : ''}
      `;
    }

    function renderProductCard(product, isFeatured) {
      const inCart = appState.cart.find(item => item.id === product.id);
      return `
        <div class="product-card">
          ${isFeatured ? '<div class="product-badge">Featured</div>' : ''}
          <div class="product-image">${product.emoji}</div>
          <div class="product-category">${product.category}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-flavor">${product.flavor}</div>
          <div class="product-meta">
            <div class="product-puffs">${product.puffs}</div>
          </div>
          <div class="product-footer">
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-btn ${inCart ? 'added' : ''}" onclick="handleAddToCart('${product.id}')">
              ${inCart ? '✓ ' + inCart.quantity : '+'}
            </button>
          </div>
        </div>
      `;
    }

    function CheckoutView() {
      const subtotal = calculateTotal();
      const tax = subtotal * STORE.taxRate;
      const total = subtotal + tax;
      const customer = appState.transactionCustomer;
      const bankLinked = customer?.bankLinked || false;
      const basePoints = appState.cart.reduce((t, i) => t + i.quantity, 0) * STORE.purchaseBonusPoints;
      const bonusPoints = bankLinked ? basePoints : 0;
      const totalPoints = basePoints + bonusPoints;

      let terminalStatusHTML = '';
      if (appState.terminalStatus === 'pending') {
        terminalStatusHTML = `
          <div class="terminal-status-panel pending">
            <div class="terminal-status-spinner"></div>
            <div class="terminal-status-text">
              <strong>Waiting for customer...</strong>
              <p>Transaction sent to card reader. Customer should enter phone number or skip.</p>
            </div>
          </div>
        `;
      } else if (appState.terminalStatus === 'phone-entered') {
        terminalStatusHTML = `
          <div class="terminal-status-panel active">
            <div class="terminal-status-icon">👤</div>
            <div class="terminal-status-text">
              <strong>Customer: ${customer?.name || 'Unknown'}</strong>
              <p>${customer?.phone || ''} &middot; ${customer?.points || 0} pts${bankLinked ? ' &middot; Bank Linked' : ''}</p>
            </div>
          </div>
        `;
      } else if (appState.terminalStatus === 'processing') {
        terminalStatusHTML = `
          <div class="terminal-status-panel pending">
            <div class="terminal-status-spinner"></div>
            <div class="terminal-status-text">
              <strong>Processing payment...</strong>
              <p>Do not interrupt the terminal.</p>
            </div>
          </div>
        `;
      } else if (appState.terminalStatus === 'complete') {
        const result = appState.terminalResult;
        const isApproved = result?.status === 'approved';
        terminalStatusHTML = `
          <div class="terminal-status-panel ${isApproved ? 'success' : 'error'}">
            <div class="terminal-status-icon">${isApproved ? '✓' : '✕'}</div>
            <div class="terminal-status-text">
              <strong>${isApproved ? 'Payment Approved' : 'Payment Declined'}</strong>
              <p>${isApproved ? 'Auth: ' + (result?.authCode || '') : result?.reason || 'Try another payment method'}</p>
              ${isApproved && customer ? `<p style="color: var(--accent); font-weight: 600;">+${totalPoints} points awarded</p>` : ''}
            </div>
          </div>
        `;
      }

      return `
        <div class="header">
          <div class="header-content">
            <button class="back-btn" onclick="navigate('shop')">← Continue Shopping</button>
            <div class="logo-section">
              <div class="logo-text">Checkout</div>
            </div>
          </div>
        </div>

        <div class="main-content">
          <div class="two-column-layout">
            <div>
              <h2 class="section-heading">Cart Items (${appState.cart.reduce((t, i) => t + i.quantity, 0)})</h2>

              ${appState.cart.map(item => {
                const product = PRODUCTS.find(p => p.id === item.id);
                return `
                  <div class="cart-item">
                    <div class="item-image">${product.emoji}</div>
                    <div class="item-details">
                      <div class="item-name">${product.name}</div>
                      <div class="item-variant">${product.flavor} &middot; ${product.puffs}</div>
                      <div class="item-price">$${(product.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div class="item-quantity">
                      <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                      <div style="font-weight: 600; min-width: 24px; text-align: center;">${item.quantity}</div>
                      <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="sticky-sidebar">
              <div class="summary-section">
                <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">Order Summary</h3>
                <div class="summary-row">
                  <span class="summary-label">Subtotal</span>
                  <span class="summary-value">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Tax (${(STORE.taxRate * 100).toFixed(2)}%)</span>
                  <span class="summary-value">$${tax.toFixed(2)}</span>
                </div>
                <div class="summary-row summary-total">
                  <span class="summary-label">Total</span>
                  <span class="summary-value">$${total.toFixed(2)}</span>
                </div>

                ${customer ? `
                  <div style="background: var(--bg-lighter); border-radius: 12px; padding: 16px; margin-top: 16px; text-align: center;">
                    <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 4px;">Points to earn</div>
                    <div style="font-size: 28px; font-weight: 800; color: ${bankLinked ? 'var(--accent)' : 'var(--primary)'};">
                      +${totalPoints}
                    </div>
                    ${bankLinked ? '<div style="font-size: 12px; color: var(--accent); font-weight: 600;">2x Bank Bonus Active</div>' : ''}
                  </div>
                ` : ''}
              </div>

              ${terminalStatusHTML}

              ${appState.terminalStatus === 'idle' || appState.terminalStatus === 'phone-entered' ? `
                <div class="checkout-actions">
                  <button class="btn btn-primary checkout-btn-large" onclick="sendToTerminal('card')">
                    💳 Send to Card Reader
                  </button>
                  ${bankLinked ? `
                    <button class="btn btn-ach checkout-btn-large" onclick="sendToTerminal('ach')">
                      🏦 Process ACH Payment
                    </button>
                  ` : `
                    <button class="btn btn-disabled checkout-btn-large" disabled title="Customer must link bank account to use ACH">
                      🏦 ACH (Bank Not Linked)
                    </button>
                  `}
                </div>
              ` : ''}

              ${appState.terminalStatus === 'complete' ? `
                <div class="checkout-actions">
                  <button class="btn btn-primary checkout-btn-large" onclick="resetTransaction()">
                    Start New Transaction
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }

    // ============================================================================
    // TERMINAL BRIDGE
    // ============================================================================

    function sendToTerminal(paymentMethod) {
      if (appState.cart.length === 0) return;

      const subtotal = calculateTotal();
      const tax = subtotal * STORE.taxRate;
      const total = subtotal + tax;

      const transaction = {
        id: 'txn_' + Date.now(),
        items: appState.cart.map(item => {
          const product = PRODUCTS.find(p => p.id === item.id);
          return {
            id: item.id,
            name: product.name,
            flavor: product.flavor,
            price: product.price,
            quantity: item.quantity,
            emoji: product.emoji
          };
        }),
        subtotal: subtotal,
        tax: tax,
        total: total,
        paymentMethod: paymentMethod,
        customer: appState.transactionCustomer || null,
        timestamp: new Date().toISOString()
      };

      // Write to localStorage - terminal listens for this
      localStorage.setItem('terminal_transaction', JSON.stringify(transaction));
      appState.terminalStatus = 'pending';
      render();
    }

    function handleStorageEvent(event) {
      if (event.key === 'terminal_phone_entry') {
        const data = JSON.parse(event.newValue);
        if (data && data.phone) {
          // Look up or register the customer
          let customer = lookupCustomerByPhone(data.phone);
          if (!customer) {
            customer = registerCustomer(data.phone);
          }
          appState.transactionCustomer = customer;
          appState.terminalStatus = 'phone-entered';

          // Write customer data back so terminal can read it
          localStorage.setItem('terminal_customer_data', JSON.stringify(customer));
          render();
        }
      }

      if (event.key === 'terminal_status') {
        const data = JSON.parse(event.newValue);
        if (data) {
          appState.terminalStatus = data.status;
          render();
        }
      }

      if (event.key === 'terminal_result') {
        const data = JSON.parse(event.newValue);
        if (data) {
          appState.terminalResult = data;
          appState.terminalStatus = 'complete';

          // Award points if approved and customer exists
          if (data.status === 'approved' && appState.transactionCustomer) {
            const basePoints = appState.cart.reduce((t, i) => t + i.quantity, 0) * STORE.purchaseBonusPoints;
            const bankLinked = appState.transactionCustomer.bankLinked || false;
            const totalPoints = bankLinked ? basePoints * 2 : basePoints;
            appState.transactionCustomer = updateCustomerPoints(appState.transactionCustomer.id, totalPoints);
          }
          render();
        }
      }
    }

    function resetTransaction() {
      appState.transactionCustomer = null;
      appState.terminalStatus = 'idle';
      appState.terminalResult = null;
      appState.cart = [];
      localStorage.removeItem('terminal_transaction');
      localStorage.removeItem('terminal_phone_entry');
      localStorage.removeItem('terminal_result');
      localStorage.removeItem('terminal_customer_data');
      localStorage.removeItem('terminal_status');
      navigate('shop');
    }

    // ============================================================================
    // HANDLERS
    // ============================================================================

    function handleAgeVerify() {
      const dob = document.getElementById('dob').value;
      const checkbox = document.getElementById('ageCheck');

      if (!dob || !checkbox.classList.contains('checked')) {
        alert('Please complete all fields');
        return;
      }

      const age = calculateAge(dob);
      if (age < 21) {
        alert('You must be 21 or older to access this system');
        return;
      }

      saveAgeVerification();
      navigate('shop');
    }

    function handleSearch(event) {
      appState.searchQuery = event.target.value;
      render();
    }

    function setCategory(category) {
      appState.currentCategory = category;
      render();
    }

    function handleAddToCart(productId) {
      const existing = appState.cart.find(item => item.id === productId);
      if (existing) {
        existing.quantity++;
      } else {
        appState.cart.push({ id: productId, quantity: 1 });
      }
      render();
    }

    function updateQuantity(productId, newQty) {
      if (newQty <= 0) {
        appState.cart = appState.cart.filter(item => item.id !== productId);
      } else {
        const item = appState.cart.find(i => i.id === productId);
        if (item) item.quantity = newQty;
      }
      if (appState.cart.length === 0 && appState.currentView === 'checkout') {
        navigate('shop');
        return;
      }
      render();
    }

    // ============================================================================
    // UTILITIES
    // ============================================================================

    function navigate(view) {
      const validViews = ['age-gate', 'shop', 'checkout'];
      if (!validViews.includes(view)) view = 'shop';
      appState.currentView = view;
      if (view === 'shop') {
        appState.searchQuery = '';
      }
      render();
    }

    function calculateTotal() {
      return appState.cart.reduce((total, item) => {
        const product = PRODUCTS.find(p => p.id === item.id);
        return total + (product.price * item.quantity);
      }, 0);
    }

    function calculateAge(dob) {
      const parts = dob.split('/');
      if (parts.length !== 3) return 0;
      const birthDate = new Date(parts[2], parts[0] - 1, parts[1]);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      return age;
    }

    function toggleCheckbox(id) {
      const checkbox = document.getElementById(id);
      if (checkbox.classList.contains('checked')) {
        checkbox.classList.remove('checked');
        checkbox.innerHTML = '';
      } else {
        checkbox.classList.add('checked');
        checkbox.innerHTML = '✓';
      }
    }

    function render() {
      const app = document.getElementById('app');
      let content = '';

      switch (appState.currentView) {
        case 'age-gate': content = AgeGateView(); break;
        case 'shop': content = ShopView(); break;
        case 'checkout': content = CheckoutView(); break;
        default: content = ShopView(); break;
      }

      app.innerHTML = content;
    }

    // ============================================================================
    // INIT
    // ============================================================================

    function init() {
      appState.ageVerified = loadAgeVerification();

      if (!appState.ageVerified) {
        appState.currentView = 'age-gate';
      } else {
        appState.currentView = 'shop';
      }

      // Listen for terminal bridge events
      window.addEventListener('storage', handleStorageEvent);

      // Clean up any stale terminal data
      localStorage.removeItem('terminal_transaction');
      localStorage.removeItem('terminal_phone_entry');
      localStorage.removeItem('terminal_result');
      localStorage.removeItem('terminal_customer_data');
      localStorage.removeItem('terminal_status');

      render();
    }

    init();
