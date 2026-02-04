/**
 * AllPuffs Terminal Hardware Integration
 * 
 * This file provides templates for integrating with card reader hardware.
 * Replace the demo functions with actual SDK calls for your device.
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const TERMINAL_CONFIG = {
  // Terminal identification
  terminalId: 'ALLPUFFS_001',
  merchantId: 'YOUR_MERCHANT_ID',
  storeId: 'STORE_001',
  
  // API endpoints
  apiBase: 'https://api.allpuffs.com',
  
  // Hardware settings
  cardReader: {
    type: 'auto', // 'swipe', 'chip', 'tap', 'auto'
    timeout: 30000,
    retries: 3
  },
  
  pinPad: {
    encrypted: true,
    timeout: 60000
  },
  
  printer: {
    enabled: true,
    paperWidth: 80, // mm
    encoding: 'UTF-8'
  },
  
  // Display settings
  display: {
    timeout: 30000, // Return to idle after 30s
    brightness: 80
  },
  
  // Points multiplier
  rewards: {
    achMultiplier: 2,
    cardMultiplier: 1,
    basePoints: 10
  }
};

// =============================================================================
// HARDWARE ABSTRACTION LAYER
// =============================================================================

class TerminalHardware {
  
  // ---------------------------------------------------------------------------
  // CARD READER
  // ---------------------------------------------------------------------------
  
  /**
   * Initialize card reader
   */
  static async initCardReader() {
    try {
      // REPLACE WITH YOUR SDK:
      // await YourSDK.CardReader.initialize();
      
      console.log('Card reader initialized');
      return true;
    } catch (error) {
      console.error('Card reader init failed:', error);
      return false;
    }
  }
  
  /**
   * Read card data
   * @param {number} amount - Transaction amount
   * @returns {Promise<Object>} Card data
   */
  static async readCard(amount) {
    try {
      // DEMO MODE - Remove in production
      await this.simulateDelay(2000);
      
      // REPLACE WITH YOUR SDK:
      // const cardData = await YourSDK.CardReader.read({
      //   amount: amount,
      //   timeout: TERMINAL_CONFIG.cardReader.timeout
      // });
      
      // DEMO RESPONSE
      const cardData = {
        track1: 'B4242424242424242^DOE/JOHN^2512101',
        track2: '4242424242424242=2512101',
        cardNumber: '4242424242424242',
        expiryMonth: '12',
        expiryYear: '25',
        cardholderName: 'JOHN DOE',
        cardType: 'VISA',
        entryMode: 'chip', // 'swipe', 'chip', 'tap'
        encrypted: false
      };
      
      return cardData;
      
    } catch (error) {
      console.error('Card read failed:', error);
      throw error;
    }
  }
  
  /**
   * Cancel card read operation
   */
  static async cancelCardRead() {
    // REPLACE WITH YOUR SDK:
    // await YourSDK.CardReader.cancel();
    console.log('Card read cancelled');
  }
  
  // ---------------------------------------------------------------------------
  // PIN PAD
  // ---------------------------------------------------------------------------
  
  /**
   * Get PIN from hardware PIN pad
   * @returns {Promise<string>} Encrypted PIN block
   */
  static async getPinEntry() {
    try {
      // DEMO MODE
      await this.simulateDelay(3000);
      
      // REPLACE WITH YOUR SDK:
      // const pinData = await YourSDK.PinPad.getPin({
      //   prompt: 'Enter PIN',
      //   encrypted: true,
      //   timeout: TERMINAL_CONFIG.pinPad.timeout
      // });
      
      // DEMO RESPONSE - In production, this would be encrypted
      const pinData = {
        encrypted: true,
        pinBlock: 'ENCRYPTED_PIN_BLOCK_HERE',
        ksn: 'KEY_SERIAL_NUMBER_HERE'
      };
      
      return pinData;
      
    } catch (error) {
      console.error('PIN entry failed:', error);
      throw error;
    }
  }
  
  /**
   * Cancel PIN entry
   */
  static async cancelPinEntry() {
    // REPLACE WITH YOUR SDK:
    // await YourSDK.PinPad.cancel();
    console.log('PIN entry cancelled');
  }
  
  // ---------------------------------------------------------------------------
  // PRINTER
  // ---------------------------------------------------------------------------
  
  /**
   * Print receipt
   * @param {Object} transaction - Transaction data
   */
  static async printReceipt(transaction) {
    if (!TERMINAL_CONFIG.printer.enabled) {
      console.log('Printer disabled');
      return;
    }
    
    try {
      // REPLACE WITH YOUR SDK:
      // await YourSDK.Printer.print(receiptData);
      
      const receipt = this.formatReceipt(transaction);
      console.log('Printing receipt:', receipt);
      
      // DEMO: Just log to console
      console.log(receipt);
      
    } catch (error) {
      console.error('Print failed:', error);
      // Don't throw - receipt print failure shouldn't block transaction
    }
  }
  
  /**
   * Format receipt data
   */
  static formatReceipt(transaction) {
    const lines = [];
    
    // Header
    lines.push({ text: 'ALL PUFFS', align: 'center', size: 'large', bold: true });
    lines.push({ text: 'Vape & Smoke Shop', align: 'center' });
    lines.push({ text: '123 Main St', align: 'center' });
    lines.push({ text: '(555) 123-4567', align: 'center' });
    lines.push({ type: 'line' });
    
    // Transaction details
    lines.push({ text: `Date: ${new Date().toLocaleString()}` });
    lines.push({ text: `Terminal: ${TERMINAL_CONFIG.terminalId}` });
    lines.push({ type: 'line' });
    
    // Payment info
    lines.push({ text: `Amount: $${transaction.amount.toFixed(2)}`, size: 'large' });
    lines.push({ text: `Method: ${transaction.paymentMethod === 'ach' ? 'Bank (ACH)' : 'Card'}` });
    
    if (transaction.cardLast4) {
      lines.push({ text: `Card: ****${transaction.cardLast4}` });
    }
    
    lines.push({ text: `Auth: ${transaction.authCode}` });
    lines.push({ type: 'line' });
    
    // Rewards
    if (transaction.phone) {
      lines.push({ text: `Phone: ${transaction.phone}` });
      lines.push({ text: `Points Earned: +${transaction.pointsEarned}`, bold: true });
      lines.push({ text: `New Balance: ${transaction.pointsBalance} pts` });
      lines.push({ type: 'line' });
    }
    
    // Footer
    lines.push({ text: 'Thank you!', align: 'center', size: 'large', bold: true });
    lines.push({ text: 'allpuffs.com', align: 'center' });
    lines.push({ type: 'feed', lines: 3 });
    
    return lines;
  }
  
  // ---------------------------------------------------------------------------
  // DISPLAY
  // ---------------------------------------------------------------------------
  
  /**
   * Display message on terminal screen
   * @param {string} message - Message to display
   */
  static displayMessage(message) {
    // REPLACE WITH YOUR SDK:
    // await YourSDK.Display.showMessage(message);
    console.log('Display:', message);
  }
  
  /**
   * Set display brightness
   * @param {number} level - Brightness level (0-100)
   */
  static setDisplayBrightness(level) {
    // REPLACE WITH YOUR SDK:
    // await YourSDK.Display.setBrightness(level);
    console.log('Display brightness:', level);
  }
  
  // ---------------------------------------------------------------------------
  // UTILITIES
  // ---------------------------------------------------------------------------
  
  /**
   * Simulate delay (for demo mode)
   */
  static simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Play beep sound
   */
  static beep() {
    // REPLACE WITH YOUR SDK:
    // await YourSDK.Audio.beep();
    console.log('Beep!');
  }
  
  /**
   * Get terminal status
   */
  static async getStatus() {
    // REPLACE WITH YOUR SDK:
    // const status = await YourSDK.getStatus();
    
    return {
      online: true,
      cardReaderReady: true,
      pinPadReady: true,
      printerReady: true,
      batteryLevel: 100
    };
  }
}

// =============================================================================
// API CLIENT
// =============================================================================

class TerminalAPI {
  
  /**
   * Lookup customer by phone
   */
  static async lookupCustomer(phone) {
    const response = await fetch(`${TERMINAL_CONFIG.apiBase}/api/customer?phone=${phone}`, {
      headers: {
        'X-Terminal-ID': TERMINAL_CONFIG.terminalId,
        'X-Merchant-ID': TERMINAL_CONFIG.merchantId
      }
    });
    
    if (!response.ok) {
      throw new Error('Customer lookup failed');
    }
    
    return response.json();
  }
  
  /**
   * Process ACH payment
   */
  static async processACH(customerId, amount) {
    const response = await fetch(`${TERMINAL_CONFIG.apiBase}/api/ach/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Terminal-ID': TERMINAL_CONFIG.terminalId,
        'X-Merchant-ID': TERMINAL_CONFIG.merchantId
      },
      body: JSON.stringify({
        customerId,
        amount,
        terminalId: TERMINAL_CONFIG.terminalId
      })
    });
    
    if (!response.ok) {
      throw new Error('ACH processing failed');
    }
    
    return response.json();
  }
  
  /**
   * Process card payment
   */
  static async processCard(cardData, amount, customerId = null) {
    const response = await fetch(`${TERMINAL_CONFIG.apiBase}/api/card/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Terminal-ID': TERMINAL_CONFIG.terminalId,
        'X-Merchant-ID': TERMINAL_CONFIG.merchantId
      },
      body: JSON.stringify({
        cardData,
        amount,
        customerId,
        terminalId: TERMINAL_CONFIG.terminalId
      })
    });
    
    if (!response.ok) {
      throw new Error('Card processing failed');
    }
    
    return response.json();
  }
  
  /**
   * Award points to customer
   */
  static async awardPoints(customerId, points, transactionId) {
    const response = await fetch(`${TERMINAL_CONFIG.apiBase}/api/points/award`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Terminal-ID': TERMINAL_CONFIG.terminalId
      },
      body: JSON.stringify({
        customerId,
        points,
        transactionId
      })
    });
    
    if (!response.ok) {
      throw new Error('Points award failed');
    }
    
    return response.json();
  }
  
  /**
   * Log transaction
   */
  static async logTransaction(transaction) {
    await fetch(`${TERMINAL_CONFIG.apiBase}/api/terminal/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Terminal-ID': TERMINAL_CONFIG.terminalId
      },
      body: JSON.stringify({
        ...transaction,
        terminalId: TERMINAL_CONFIG.terminalId,
        timestamp: new Date().toISOString()
      })
    });
  }
}

// =============================================================================
// EXPORT FOR USE IN card-terminal.html
// =============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TerminalHardware,
    TerminalAPI,
    TERMINAL_CONFIG
  };
}
