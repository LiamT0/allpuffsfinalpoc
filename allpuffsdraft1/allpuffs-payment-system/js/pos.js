const PRODUCTS = [
      { id: 'p1', name: 'Puff Bar Plus', flavor: 'Strawberry Banana', price: 12.99, emoji: '🍓' },
      { id: 'p2', name: 'Elf Bar BC5000', flavor: 'Blue Razz Ice', price: 15.99, emoji: '🫐' }
    ];

    let cart = [
      { id: 'p1', quantity: 1 },
      { id: 'p2', quantity: 1 }
    ];

    let customer = null;
    let selectedPayment = 'bank';
    let processingState = 'idle'; // idle, processing, success

    function POSView() {
      const subtotal = calculateTotal();
      const tax = subtotal * 0.0825;
      const total = subtotal + tax;

      return `
        <div class="pos-header">
          <div class="store-info">
            <div class="store-logo">💨</div>
            <div class="store-name">AllPuffs</div>
          </div>
          <div class="pos-status">
            <div class="status-dot"></div>
            <span>System Online</span>
          </div>
        </div>

        <div class="pos-main">
          <div class="cart-section">
            <div class="cart-header">
              <div class="cart-title">Current Transaction</div>
              <div class="cart-subtitle">${cart.length} item${cart.length !== 1 ? 's' : ''}</div>
            </div>

            <div class="cart-items">
              ${cart.map(item => {
                const product = PRODUCTS.find(p => p.id === item.id);
                return `
                  <div class="cart-item">
                    <div class="item-emoji">${product.emoji}</div>
                    <div class="item-details">
                      <div class="item-name">${product.name}</div>
                      <div class="item-flavor">${product.flavor}</div>
                    </div>
                    <div class="item-price">$${product.price.toFixed(2)}</div>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="cart-total">
              <div class="total-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Tax (8.25%)</span>
                <span>$${tax.toFixed(2)}</span>
              </div>
              <div class="total-row grand">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="payment-section">
            <div class="customer-lookup">
              <div class="lookup-title">Customer Lookup (Optional)</div>
              ${!customer ? `
                <div class="lookup-input">
                  <input type="tel" class="phone-input" id="phoneInput" placeholder="Phone number">
                  <button class="lookup-btn" onclick="lookupCustomer()">Lookup</button>
                </div>
              ` : `
                <div class="customer-info">
                  <div class="customer-avatar">${customer.name.charAt(0)}</div>
                  <div class="customer-details">
                    <div class="customer-name">${customer.name}</div>
                    <div class="customer-points">💎 ${customer.points} points available</div>
                  </div>
                </div>
              `}
            </div>

            <div class="payment-prompt">
              <div class="payment-icon">💳</div>
              <div class="payment-title">Select Payment Method</div>
              <div class="payment-subtitle">Choose how customer will pay</div>
            </div>

            <div class="info-banner">
              <div class="info-banner-icon">ℹ️</div>
              <div class="info-banner-text">
                <strong>Bank payment recommended:</strong> Credit card processors often decline vape transactions. Bank payment ensures successful checkout.
              </div>
            </div>

            <div class="payment-method ${selectedPayment === 'bank' ? 'selected' : ''}" 
                 onclick="selectPayment('bank')">
              <div class="payment-method-header">
                <div class="method-icon">🏦</div>
                <div style="flex: 1;">
                  <div class="method-name">
                    Pay by Bank
                    <span class="method-badge">Recommended</span>
                  </div>
                </div>
              </div>
              <div class="method-desc">Customer pays directly from bank account - reliable & secure</div>
            </div>

            <div class="payment-method ${selectedPayment === 'card' ? 'selected' : ''}" 
                 onclick="selectPayment('card')">
              <div class="payment-method-header">
                <div class="method-icon">💳</div>
                <div class="method-name">Credit/Debit Card</div>
              </div>
              <div class="method-desc">May be declined by card processor for vape products</div>
            </div>

            <button class="checkout-btn" onclick="processCheckout()">
              ${selectedPayment === 'bank' ? 'Process Bank Payment' : 'Process Card Payment'}
              ($${total.toFixed(2)})
            </button>
          </div>
        </div>

        <div class="processing-overlay ${processingState !== 'idle' ? 'active' : ''}" id="processingOverlay">
          ${processingState === 'processing' ? `
            <div class="processing-content">
              <div class="processing-spinner"></div>
              <div class="processing-title">Processing Payment...</div>
              <div class="processing-subtitle">Please wait</div>
            </div>
          ` : processingState === 'success' ? `
            <div class="processing-content">
              <div class="success-check">✓</div>
              <div class="processing-title">Payment Successful!</div>
              <div class="processing-subtitle">Transaction complete</div>
            </div>
          ` : ''}
        </div>
      `;
    }

    function calculateTotal() {
      return cart.reduce((total, item) => {
        const product = PRODUCTS.find(p => p.id === item.id);
        return total + (product.price * item.quantity);
      }, 0);
    }

    function selectPayment(method) {
      selectedPayment = method;
      render();
    }

    function lookupCustomer() {
      const phone = document.getElementById('phoneInput').value.trim();
      if (phone) {
        // Demo: Simulate customer lookup
        customer = {
          name: 'Demo User',
          phone: phone,
          points: 310
        };
        render();
      }
    }

    function processCheckout() {
      processingState = 'processing';
      render();

      setTimeout(() => {
        processingState = 'success';
        render();

        setTimeout(() => {
          // Reset for next transaction
          cart = [];
          customer = null;
          selectedPayment = 'bank';
          processingState = 'idle';
          render();
        }, 2000);
      }, 2000);
    }

    function render() {
      document.getElementById('app').innerHTML = POSView();
    }

    render();