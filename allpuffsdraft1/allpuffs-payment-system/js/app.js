// ============================================================================
    // DATA & STATE
    // ============================================================================
    
    const STORE = {
      id: 'allpuffs',
      name: 'AllPuffs',
      address: '123 Main St',
      signupBonusPoints: 100,
      purchaseBonusPoints: 10
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
      currentUser: null,
      cart: [],
      currentCategory: 'All',
      searchQuery: ''
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

    function loadUser() {
      const data = localStorage.getItem('allpuffsUser');
      return data ? JSON.parse(data) : null;
    }

    function saveUser(user) {
      localStorage.setItem('allpuffsUser', JSON.stringify(user));
      appState.currentUser = user;
    }

    // ============================================================================
    // FILTERS
    // ============================================================================
    
    function getFilteredProducts() {
      let filtered = PRODUCTS;

      // Category filter
      if (appState.currentCategory !== 'All') {
        filtered = filtered.filter(p => p.category === appState.currentCategory);
      }

      // Search filter
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
            <p class="age-subtitle">You must be 21 or older to enter this site</p>

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
              By entering this site, you certify that you are of legal age to purchase tobacco products in your jurisdiction. Federal law prohibits the sale of tobacco and vape products to persons under 21 years of age.
            </p>
          </div>
        </div>
      `;
    }

    function ShopView() {
      const user = appState.currentUser;
      const showFlag = !user;
      const filteredProducts = getFilteredProducts();
      const featuredProducts = getFeaturedProducts();
      const categories = ['All', 'Disposables', 'Pods', 'E-Liquid', 'Devices'];

      return `
        <div class="header">
          <div class="header-content">
            <div class="logo-section">
              <div class="logo-icon">💨</div>
              <div class="logo-text">${STORE.name}</div>
            </div>
            <div class="header-actions">
              <div class="user-menu" onclick="handleUserMenu()">
                👤
                ${user ? `<div class="points-badge">${user.points}</div>` : ''}
              </div>
            </div>
          </div>
          ${showFlag ? `
            <div class="points-flag" onclick="navigate('signup')">
              <div class="points-flag-icon">🎁</div>
              <div>Create account to earn ${STORE.signupBonusPoints} points!</div>
            </div>
          ` : ''}
        </div>

        <div class="main-content">
          ${user ? `<p style="color: var(--text-secondary); margin-bottom: 24px;">Welcome back, ${user.name}!</p>` : ''}

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
                <p>Check out our most popular items</p>
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
          <div class="cart-float" onclick="navigate('cart')">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 24px;">🛒</div>
              <div style="font-weight: 600;">View Cart (${appState.cart.length})</div>
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
              ${inCart ? '✓' : '+'}
            </button>
          </div>
        </div>
      `;
    }

    function SignUpView() {
      return `
        <div class="header">
          <div class="header-content">
            <button class="back-btn" onclick="navigate('shop')">← Back to Shop</button>
          </div>
        </div>

        <div class="main-content">
          <div style="max-width: 500px; margin: 0 auto;">
            <h1 class="section-heading text-center">Create Account</h1>
            <p class="text-center" style="color: var(--text-secondary); margin-bottom: 32px;">
              Earn ${STORE.signupBonusPoints} points just for signing up!
            </p>

            <div class="card">
              <button class="btn" style="background: white; color: var(--text-primary); border: 1px solid var(--border-medium); margin-bottom: 12px;" onclick="handleGoogleSignUp()">
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                  <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9.001c0 1.452.348 2.827.957 4.041l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <button class="btn" style="background: black; color: white; margin-bottom: 12px;" onclick="handleAppleSignUp()">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.476 15.394c-.571.905-1.197 1.81-2.159 1.829-.904.019-1.196-.533-2.234-.533-1.037 0-1.367.514-2.233.552-.923.038-1.644-.98-2.215-1.885-1.159-1.848-2.044-5.222-0.856-7.507.59-1.139 1.645-1.867 2.795-1.886.865-.019 1.692.59 2.234.59.533 0 1.54-.723 2.595-.618.438.01 1.673.18 2.462 1.34-.063.038-1.473.866-1.454 2.585.019 2.044 1.787 2.728 1.806 2.738-.019.057-.285.98-.933 1.938m-2.357-11.394c.476-.59.799-1.387.71-2.195-.685.028-1.512.466-2.006 1.036-.437.514-.827 1.33-.723 2.1.761.058 1.54-.39 2.019-.941z"/>
                </svg>
                Continue with Apple
              </button>

              <div style="display: flex; align-items: center; gap: 16px; margin: 24px 0;">
                <div style="flex: 1; height: 1px; background: var(--border-light);"></div>
                <span style="color: var(--text-muted); font-size: 14px;">or</span>
                <div style="flex: 1; height: 1px; background: var(--border-light);"></div>
              </div>

              <div class="form-group">
                <label class="form-label">First Name</label>
                <input type="text" class="form-input" id="firstName" placeholder="Enter your name">
              </div>

              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-input" id="phone" placeholder="(555) 123-4567">
              </div>

              <div class="form-group">
                <label class="form-label">Email (Optional)</label>
                <input type="email" class="form-input" id="email" placeholder="your@email.com">
              </div>

              <button class="btn btn-primary" onclick="handleSignUp()">
                Create Account & Earn ${STORE.signupBonusPoints} Points
              </button>

              <p style="font-size: 12px; color: var(--text-muted); text-align: center; margin-top: 16px; line-height: 1.5;">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      `;
    }

    function RewardsView() {
      const user = appState.currentUser;
      const bankLinked = user.bankLinked || false;
      
      return `
        <div class="header">
          <div class="header-content">
            <div class="logo-section">
              <div class="logo-icon">💨</div>
              <div class="logo-text">${STORE.name}</div>
            </div>
            <div class="header-actions">
              <div class="user-menu" onclick="handleUserMenu()">
                👤
                <div class="points-badge">${user.points}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="main-content">
          <p style="color: var(--text-secondary); margin-bottom: 16px;">Welcome, ${user.name}</p>
          
          <div class="wallet-card">
            <div class="wallet-stats">
              <div>
                <div class="wallet-stat-value">
                  <span>💎</span>
                  <span>${user.points}</span>
                </div>
                <div class="wallet-stat-label">Points Balance</div>
              </div>
              <div>
                <div class="wallet-stat-value">
                  <span>🎟️</span>
                  <span>${user.entries || 0}</span>
                </div>
                <div class="wallet-stat-label">Monthly Entries</div>
              </div>
            </div>
          </div>

          ${!bankLinked ? `
            <div style="background: linear-gradient(135deg, rgba(255, 107, 44, 0.1), rgba(255, 107, 44, 0.05)); border: 2px solid var(--orange); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                <div style="width: 56px; height: 56px; background: var(--orange); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 28px; color: white;">🎁</div>
                <div style="flex: 1;">
                  <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 4px; color: var(--text-primary);">Unlock Bonus Rewards!</h3>
                  <p style="font-size: 14px; color: var(--text-secondary);">Link your bank to earn 2x points on every purchase</p>
                </div>
              </div>
              <div style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 20px;">⚡</span>
                    <span style="font-weight: 600;">2x Points on All Purchases</span>
                  </div>
                  <span style="color: var(--accent); font-weight: 700;">+${STORE.purchaseBonusPoints} Extra</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 20px;">🎟️</span>
                    <span style="font-weight: 600;">Exclusive Monthly Giveaways</span>
                  </div>
                  <span style="color: var(--accent); font-weight: 700;">VIP Access</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 20px;">💎</span>
                    <span style="font-weight: 600;">Instant Bonus Points</span>
                  </div>
                  <span style="color: var(--accent); font-weight: 700;">+50 Now</span>
                </div>
              </div>
              <button class="btn btn-primary" onclick="navigate('link-bank')">
                Link Bank & Unlock Rewards
              </button>
            </div>
          ` : `
            <div style="background: linear-gradient(135deg, rgba(0, 196, 140, 0.1), rgba(0, 196, 140, 0.05)); border: 2px solid var(--accent); border-radius: 16px; padding: 20px; margin-bottom: 32px; display: flex; align-items: center; gap: 16px;">
              <div style="width: 48px; height: 48px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white;">✓</div>
              <div style="flex: 1;">
                <div style="font-weight: 700; margin-bottom: 4px;">Bank Linked - Bonus Rewards Active!</div>
                <div style="font-size: 14px; color: var(--text-secondary);">You're earning 2x points on every purchase</div>
              </div>
            </div>
          `}

          <h2 class="section-heading">Earn More Points</h2>

          <div class="card" style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">🛍️</div>
            <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Shop to Earn</h3>
            <p style="color: var(--text-secondary); margin-bottom: 24px;">
              Earn ${bankLinked ? STORE.purchaseBonusPoints * 2 : STORE.purchaseBonusPoints} points with every purchase
            </p>
            <button class="btn btn-primary" onclick="navigate('shop')">
              Start Shopping
            </button>
          </div>
        </div>
      `;
    }

    function LinkBankView() {
      const banks = [
        { name: 'Chase', logo: '🏦' },
        { name: 'Bank of America', logo: '🏦' },
        { name: 'Wells Fargo', logo: '🏦' },
        { name: 'Citibank', logo: '🏦' },
        { name: 'Capital One', logo: '🏦' },
        { name: 'US Bank', logo: '🏦' },
        { name: 'PNC Bank', logo: '🏦' },
        { name: 'TD Bank', logo: '🏦' },
        { name: 'Truist', logo: '🏦' },
        { name: 'Other Bank', logo: '🔍' }
      ];

      return `
        <div class="header">
          <div class="header-content">
            <button class="back-btn" onclick="navigate('rewards')">← Back</button>
            <div class="logo-section">
              <div class="logo-text">Link Your Bank</div>
            </div>
          </div>
        </div>

        <div class="main-content">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="font-size: 72px; margin-bottom: 16px;">🔒</div>
              <h1 style="font-size: 28px; font-weight: 800; margin-bottom: 12px;">Unlock Bonus Rewards</h1>
              <p style="color: var(--text-secondary); font-size: 16px;">
                Securely link your bank account to earn 2x points on every purchase
              </p>
            </div>

            <div style="background: linear-gradient(135deg, rgba(255, 107, 44, 0.1), rgba(255, 107, 44, 0.05)); border: 2px solid var(--orange); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
              <h3 style="font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 24px;">🎁</span>
                What You'll Get
              </h3>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 40px; height: 40px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">⚡</div>
                  <div style="flex: 1;">
                    <div style="font-weight: 600;">2x Points on All Purchases</div>
                    <div style="font-size: 13px; color: var(--text-secondary);">Double your rewards instantly</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 40px; height: 40px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">💎</div>
                  <div style="flex: 1;">
                    <div style="font-weight: 600;">Instant 50 Point Bonus</div>
                    <div style="font-size: 13px; color: var(--text-secondary);">Added as soon as you link</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 40px; height: 40px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🎟️</div>
                  <div style="flex: 1;">
                    <div style="font-weight: 600;">Exclusive Monthly Giveaways</div>
                    <div style="font-size: 13px; color: var(--text-secondary);">VIP-only prize drawings</div>
                  </div>
                </div>
              </div>
            </div>

            <div style="background: var(--secondary); border: 1px solid var(--primary); border-left: 4px solid var(--primary); border-radius: 12px; padding: 16px 20px; margin-bottom: 32px; display: flex; gap: 12px;">
              <div style="font-size: 20px; flex-shrink: 0;">🔒</div>
              <div>
                <div style="font-weight: 600; margin-bottom: 4px;">Bank-Level Security</div>
                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
                  256-bit encryption • Read-only access • Your credentials are never stored • Powered by Plaid
                </div>
              </div>
            </div>

            <h3 style="font-weight: 700; margin-bottom: 16px;">Select Your Bank</h3>

            <div class="form-group">
              <input 
                type="text" 
                class="form-input" 
                placeholder="Search banks..."
                style="margin-bottom: 16px;"
              >
            </div>

            <div style="display: grid; gap: 12px; max-height: 400px; overflow-y: auto;">
              ${banks.map(bank => `
                <div class="card" style="padding: 16px; margin: 0; cursor: pointer; transition: all 0.2s;" 
                     onmouseover="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 4px 12px rgba(0, 102, 255, 0.15)';"
                     onmouseout="this.style.borderColor='var(--border-light)'; this.style.boxShadow='none';"
                     onclick="handleBankLink('${bank.name}')">
                  <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 48px; height: 48px; background: var(--bg-lighter); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">
                      ${bank.logo}
                    </div>
                    <div style="flex: 1;">
                      <div style="font-weight: 600; font-size: 16px;">${bank.name}</div>
                    </div>
                    <div style="color: var(--text-muted);">›</div>
                  </div>
                </div>
              `).join('')}
            </div>

            <p style="font-size: 12px; color: var(--text-muted); text-align: center; margin-top: 24px; line-height: 1.5;">
              By continuing, you agree to share your bank information with ${STORE.name} via Plaid. Your credentials are encrypted and never stored.
            </p>
          </div>
        </div>
      `;
    }

    function CartView() {
      const user = appState.currentUser;
      const subtotal = calculateTotal();
      const tax = subtotal * 0.0825;
      const total = subtotal + tax;
      const bankLinked = user?.bankLinked || false;
      const basePoints = appState.cart.length * STORE.purchaseBonusPoints;
      const bonusPoints = bankLinked ? basePoints : 0;
      const totalPoints = basePoints + bonusPoints;

      return `
        <div class="header">
          <div class="header-content">
            <button class="back-btn" onclick="navigate('shop')">← Continue Shopping</button>
            <div class="logo-section">
              <div class="logo-text">Your Cart</div>
            </div>
          </div>
        </div>

        <div class="main-content">
          <div class="two-column-layout">
            <div>
              <h2 class="section-heading">Cart Items (${appState.cart.length})</h2>
              
              ${appState.cart.map(item => {
                const product = PRODUCTS.find(p => p.id === item.id);
                return `
                  <div class="cart-item">
                    <div class="item-image">${product.emoji}</div>
                    <div class="item-details">
                      <div class="item-name">${product.name}</div>
                      <div class="item-variant">${product.flavor} • ${product.puffs}</div>
                      <div class="item-price">$${product.price.toFixed(2)}</div>
                    </div>
                    <div class="item-quantity">
                      <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                      <div style="font-weight: 600; min-width: 24px; text-align: center;">${item.quantity}</div>
                      <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                  </div>
                `;
              }).join('')}

              <h2 class="section-heading" style="margin-top: 48px;">Payment Method</h2>
              
              ${!bankLinked && user ? `
                <div style="background: linear-gradient(135deg, rgba(0, 196, 140, 0.1), rgba(0, 196, 140, 0.05)); border: 2px solid var(--accent); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
                  <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <div style="width: 48px; height: 48px; background: var(--accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white;">⚡</div>
                    <div style="flex: 1;">
                      <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">Link Your Bank & Get 2x Points!</div>
                      <div style="font-size: 14px; color: var(--text-secondary);">Earn ${totalPoints} points instead of ${basePoints} on this order</div>
                    </div>
                  </div>
                  <button class="btn btn-primary" style="width: 100%;" onclick="navigate('link-bank')">
                    Link Bank Account Now
                  </button>
                </div>
              ` : ''}
              
              <div class="payment-methods">
                <div class="payment-option ${bankLinked ? 'selected' : ''}" onclick="${bankLinked ? '' : 'showBankPrompt()'}">
                  <div class="payment-icon">🏦</div>
                  <div class="payment-content">
                    <div class="payment-title">
                      Bank Payment
                      ${bankLinked ? '<span style="margin-left: 8px; background: var(--accent); color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 700;">2x POINTS</span>' : '<span style="margin-left: 8px; background: var(--orange); color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 700;">LOCKED</span>'}
                    </div>
                    <div class="payment-desc">
                      ${bankLinked ? 'Secure bank payment • Earn double rewards' : 'Link your bank to unlock 2x points'}
                    </div>
                  </div>
                </div>

                <div class="payment-option ${!bankLinked ? 'selected' : ''}" style="opacity: ${bankLinked ? '0.6' : '1'};">
                  <div class="payment-icon">💳</div>
                  <div class="payment-content">
                    <div class="payment-title">Credit/Debit Card</div>
                    <div class="payment-desc">Standard rewards only</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="sticky-sidebar">
              <div class="summary-section">
                <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">Order Summary</h3>
                <div class="summary-row">
                  <span class="summary-label">Subtotal</span>
                  <span class="summary-value">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Tax (8.25%)</span>
                  <span class="summary-value">$${tax.toFixed(2)}</span>
                </div>
                <div class="summary-row summary-total">
                  <span class="summary-label">Total</span>
                  <span class="summary-value">$${total.toFixed(2)}</span>
                </div>

                ${user ? `
                  <div style="background: ${bankLinked ? 'linear-gradient(135deg, rgba(0, 196, 140, 0.1), rgba(0, 196, 140, 0.05))' : 'var(--bg-lighter)'}; border: ${bankLinked ? '2px solid var(--accent)' : '1px solid var(--border-light)'}; padding: 16px; border-radius: 12px; margin-top: 20px; text-align: center;">
                    <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">You'll Earn</div>
                    <div style="font-size: 32px; font-weight: 800; color: ${bankLinked ? 'var(--accent)' : 'var(--primary)'}; margin-bottom: 4px;">
                      +${totalPoints} Points
                    </div>
                    ${bankLinked ? `
                      <div style="font-size: 12px; color: var(--accent); font-weight: 600;">🎉 2x Bonus Active!</div>
                    ` : `
                      <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
                        <span style="color: var(--orange); font-weight: 600;">+${bonusPoints} bonus points</span> if you link your bank
                      </div>
                    `}
                  </div>
                ` : ''}

                <button class="btn btn-primary" style="margin-top: 20px;" onclick="handleCheckout()">
                  ${user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
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
        alert('You must be 21 or older to access this site');
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

    function handleSignUp() {
      const firstName = document.getElementById('firstName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      
      if (!firstName || !phone) {
        alert('Please fill in required fields');
        return;
      }

      const user = {
        id: 'user_' + Date.now(),
        name: firstName,
        phone: phone,
        email: document.getElementById('email').value.trim(),
        points: STORE.signupBonusPoints,
        entries: 0,
        bankLinked: false,
        createdAt: new Date().toISOString()
      };

      saveUser(user);
      navigate('rewards');
    }

    function handleGoogleSignUp() {
      // Demo: In production, this would use Google OAuth
      const user = {
        id: 'user_' + Date.now(),
        name: 'Demo User',
        phone: '',
        email: 'demo@gmail.com',
        points: STORE.signupBonusPoints,
        entries: 0,
        bankLinked: false,
        createdAt: new Date().toISOString()
      };

      saveUser(user);
      navigate('rewards');
    }

    function handleAppleSignUp() {
      // Demo: In production, this would use Sign in with Apple
      const user = {
        id: 'user_' + Date.now(),
        name: 'Demo User',
        phone: '',
        email: 'demo@icloud.com',
        points: STORE.signupBonusPoints,
        entries: 0,
        bankLinked: false,
        createdAt: new Date().toISOString()
      };

      saveUser(user);
      navigate('rewards');
    }

    function handleBankLink(bankName) {
      if (!appState.currentUser) {
        navigate('signup');
        return;
      }

      // Demo: Show loading state
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'loading-screen';
      loadingDiv.innerHTML = `
        <div style="text-align: center;">
          <div class="spinner"></div>
          <div style="font-size: 18px; color: var(--text-secondary); margin-top: 16px;">
            Connecting to ${bankName}...
          </div>
          <div style="font-size: 14px; color: var(--text-muted); margin-top: 8px;">
            This would open Plaid Link in production
          </div>
        </div>
      `;
      document.body.appendChild(loadingDiv);

      setTimeout(() => {
        // Award bonus points and mark as linked
        appState.currentUser.bankLinked = true;
        appState.currentUser.points += 50; // Link bonus
        saveUser(appState.currentUser);
        
        loadingDiv.remove();
        navigate('rewards');
      }, 2000);
    }

    function showBankPrompt() {
      if (!appState.currentUser) {
        navigate('signup');
        return;
      }
      
      if (!appState.currentUser.bankLinked) {
        if (confirm('Link your bank to unlock 2x points on all purchases!\n\nYou\'ll also get:\n• Instant 50 point bonus\n• Exclusive giveaways\n• Double rewards forever\n\nLink now?')) {
          navigate('link-bank');
        }
      }
    }

    function handleUserMenu() {
      if (appState.currentUser) {
        navigate('rewards');
      } else {
        navigate('signup');
      }
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
      render();
    }

    function handleCheckout() {
      if (!appState.currentUser) {
        navigate('signup');
        return;
      }

      // Demo: In production, this would integrate with Plaid + payment processor
      alert('Demo: Payment Processing\n\nIn production:\n1. Plaid Link (if bank linked) or Card Reader\n2. Process payment via Dwolla/Stripe\n3. Award points automatically\n4. Sync with POS system');
      
      // Award points (2x if bank linked)
      const bankLinked = appState.currentUser.bankLinked || false;
      const basePoints = appState.cart.length * STORE.purchaseBonusPoints;
      const bonusPoints = bankLinked ? basePoints : 0;
      const totalPoints = basePoints + bonusPoints;
      
      appState.currentUser.points += totalPoints;
      appState.currentUser.entries = (appState.currentUser.entries || 0) + 1;
      saveUser(appState.currentUser);
      
      // Clear cart
      appState.cart = [];
      navigate('rewards');
    }

    // ============================================================================
    // UTILITIES
    // ============================================================================
    
    function navigate(view) {
      appState.currentView = view;
      appState.searchQuery = ''; // Reset search on navigation
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
        case 'signup': content = SignUpView(); break;
        case 'rewards': content = RewardsView(); break;
        case 'link-bank': content = LinkBankView(); break;
        case 'cart': content = CartView(); break;
      }

      app.innerHTML = content;
    }

    // ============================================================================
    // INIT
    // ============================================================================
    
    function init() {
      appState.ageVerified = loadAgeVerification();
      appState.currentUser = loadUser();

      if (!appState.ageVerified) {
        appState.currentView = 'age-gate';
      } else {
        appState.currentView = 'shop';
      }

      render();
    }

    init();