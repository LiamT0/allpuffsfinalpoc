# Card Reader Deployment Guide

Complete guide for deploying AllPuffs terminal to card reader hardware.

---

## 📦 Supported Hardware

### **Recommended Devices:**
- **Ingenico Desk/5000** - Most common retail terminal
- **Verifone VX520/VX680** - Widely supported
- **PAX A920/A80** - Android-based, easiest integration
- **Clover Mini/Flex** - Built-in app platform
- **Stripe Terminal** - Modern cloud-connected

### **Minimum Requirements:**
- Display: 480x800 or larger
- Touch screen support
- Card reader (swipe/chip/tap)
- Network connectivity (WiFi or Ethernet)
- 512MB RAM minimum

---

## 🚀 Deployment Methods

### **Method 1: Android-Based Terminals (Easiest)**

For PAX, Clover, or other Android devices:

1. **Enable Developer Mode:**
```
Settings → About → Tap "Build Number" 7 times
Settings → Developer Options → Enable USB Debugging
```

2. **Install Files:**
```bash
# Connect via USB
adb connect <device-ip>

# Push files
adb push allpuffs-payment-system /sdcard/AllPuffs/

# Install as kiosk app
adb shell am start -n com.android.chrome --es "url" "file:///sdcard/AllPuffs/card-terminal.html"
```

3. **Set as Kiosk:**
- Install **Kiosk Browser** from Play Store
- Point to: `file:///sdcard/AllPuffs/card-terminal.html`
- Enable fullscreen + auto-start

---

### **Method 2: Linux-Based Terminals**

For Ingenico, Verifone running Linux:

1. **Access Terminal:**
```bash
# SSH into terminal (if enabled)
ssh root@<terminal-ip>

# Or use manufacturer's deployment tool
```

2. **Install Files:**
```bash
# Create app directory
mkdir -p /opt/allpuffs/

# Copy files
scp -r allpuffs-payment-system/* root@<terminal-ip>:/opt/allpuffs/

# Set permissions
chmod +x /opt/allpuffs/card-terminal.html
```

3. **Configure Boot:**
```bash
# Create startup script
cat > /etc/init.d/allpuffs << 'EOF'
#!/bin/sh
chromium-browser --kiosk --disable-pinch \
  --overscroll-history-navigation=0 \
  file:///opt/allpuffs/card-terminal.html
EOF

chmod +x /etc/init.d/allpuffs
update-rc.d allpuffs defaults
```

---

### **Method 3: Web-Based Terminals**

For cloud-connected devices (Stripe, Square):

1. **Host Files:**
```bash
# Upload to your server
scp card-terminal.html user@yourserver.com:/var/www/terminal/

# Or use Netlify
netlify deploy --prod --dir=.
```

2. **Configure Terminal:**
```
Terminal Settings → App URL
Enter: https://terminal.allpuffs.com/card-terminal.html
```

3. **Enable Kiosk Mode:**
- Lock terminal to URL
- Disable back button
- Enable auto-reload on disconnect

---

## 🔧 Hardware Integration

### **Card Reader Integration**

Replace demo code with real hardware calls:

**File:** `card-terminal.html` (line ~850)

```javascript
// BEFORE (demo):
function processPayment() {
  setState('stateProcessing');
  setTimeout(() => approveTransaction(), 3000);
}

// AFTER (production):
async function processPayment() {
  setState('stateProcessing');
  
  try {
    // Connect to card reader hardware
    const reader = await TerminalSDK.getCardReader();
    
    // Process based on payment method
    if (transactionData.paymentMethod === 'ach') {
      // ACH/Bank payment
      const result = await fetch('/api/ach/process', {
        method: 'POST',
        body: JSON.stringify({
          amount: transactionData.amount,
          phone: transactionData.phone,
          customerId: lookupCustomerByPhone(transactionData.phone)
        })
      });
      
      if (result.ok) {
        const data = await result.json();
        transactionData.authCode = data.authCode;
        approveTransaction();
      } else {
        declineTransaction();
      }
      
    } else {
      // Card payment
      const cardData = await reader.readCard({
        amount: transactionData.amount,
        requirePin: true
      });
      
      const result = await fetch('/api/card/process', {
        method: 'POST',
        body: JSON.stringify({
          ...cardData,
          amount: transactionData.amount,
          phone: transactionData.phone
        })
      });
      
      if (result.ok) {
        const data = await result.json();
        transactionData.authCode = data.authCode;
        approveTransaction();
      } else {
        declineTransaction();
      }
    }
    
  } catch (error) {
    console.error('Payment failed:', error);
    declineTransaction();
  }
}
```

### **PIN Pad Integration**

```javascript
// Replace keypad clicks with hardware PIN pad
async function getPinFromHardware() {
  const pinPad = await TerminalSDK.getPinPad();
  
  // Show "Enter PIN" on device
  await pinPad.displayMessage("Enter PIN");
  
  // Get encrypted PIN block
  const encryptedPin = await pinPad.getEncryptedPin();
  
  return encryptedPin;
}

// Update submitPin():
async function submitPin() {
  const pin = await getPinFromHardware();
  // Send encrypted PIN to processor
  processPayment();
}
```

### **Receipt Printer**

```javascript
function printReceipt(transaction) {
  const printer = TerminalSDK.getPrinter();
  
  printer.print([
    { type: 'image', data: 'allpuffs-logo.png', align: 'center' },
    { type: 'text', data: 'ALL PUFFS', size: 'large', align: 'center' },
    { type: 'text', data: 'Vape & Smoke Shop', align: 'center' },
    { type: 'line' },
    { type: 'text', data: `Amount: $${transaction.amount}` },
    { type: 'text', data: `Auth: ${transaction.authCode}` },
    { type: 'text', data: `Card: ****${transaction.cardLast4}` },
    { type: 'text', data: `Date: ${new Date().toLocaleString()}` },
    { type: 'line' },
    { type: 'text', data: `Points Earned: +${transaction.points}`, bold: true },
    { type: 'text', data: 'Thank you!', align: 'center', size: 'large' },
    { type: 'feed', lines: 3 }
  ]);
}
```

---

## 🔌 API Integration

### **Backend Endpoints Needed:**

**1. Customer Lookup:**
```
GET /api/customer?phone=5551234567
Response: { id, name, points, bankLinked }
```

**2. Process ACH Payment:**
```
POST /api/ach/process
Body: { customerId, amount }
Response: { success, authCode, pointsEarned }
```

**3. Process Card Payment:**
```
POST /api/card/process
Body: { cardData, amount, customerId }
Response: { success, authCode, pointsEarned }
```

**4. Award Points:**
```
POST /api/points/award
Body: { customerId, points, transactionId }
Response: { newBalance }
```

### **Example Integration:**

Create `terminal-api.js`:

```javascript
const API_BASE = 'https://api.allpuffs.com';

class TerminalAPI {
  static async lookupCustomer(phone) {
    const res = await fetch(`${API_BASE}/api/customer?phone=${phone}`);
    return res.json();
  }
  
  static async processACH(customerId, amount) {
    const res = await fetch(`${API_BASE}/api/ach/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, amount })
    });
    return res.json();
  }
  
  static async processCard(cardData, amount, customerId) {
    const res = await fetch(`${API_BASE}/api/card/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardData, amount, customerId })
    });
    return res.json();
  }
  
  static async awardPoints(customerId, points, transactionId) {
    const res = await fetch(`${API_BASE}/api/points/award`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, points, transactionId })
    });
    return res.json();
  }
}
```

---

## 📱 Device-Specific Setup

### **PAX A920 (Android)**

1. **Install Chrome:**
```bash
adb install chrome.apk
```

2. **Create Launcher:**
```bash
# Create /sdcard/allpuffs-launcher.html
cat > launcher.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=card-terminal.html">
</head>
</html>
EOF
```

3. **Set Default App:**
- Settings → Apps → Default Apps
- Browser: Chrome
- Home: Kiosk Browser

### **Ingenico Desk/5000**

1. **Use Telium SDK:**
```c
// Include Ingenico SDK
#include "TlvTree.h"
#include "GTL_Convert.h"

// Launch web view
TLV_TREE_NODE appNode;
GTL_Convert_DumpTlvTree(appNode, "/mnt/storage/allpuffs/card-terminal.html");
```

2. **Package as Telium App:**
```bash
# Use Ingenico SDK tools
ingenico-package --input card-terminal.html --output AllPuffs.sgn
```

### **Verifone VX520**

1. **Use Verix SDK:**
```bash
# Compile for Verix OS
verix-compiler card-terminal.html -o allpuffs.vxo

# Deploy via VeriFone Central
verifone-deploy --app allpuffs.vxo --terminal <terminal-id>
```

### **Clover Mini/Flex**

1. **Create Clover App:**
```xml
<!-- AndroidManifest.xml -->
<activity android:name=".TerminalActivity">
  <intent-filter>
    <action android:name="android.intent.action.MAIN"/>
    <category android:name="android.intent.category.LAUNCHER"/>
  </intent-filter>
</activity>
```

2. **WebView Integration:**
```java
WebView webView = findViewById(R.id.webview);
webView.loadUrl("file:///android_asset/card-terminal.html");
```

---

## 🔒 Security Checklist

Before deployment:

- [ ] Remove test controls panel (lines 625-640)
- [ ] Enable HTTPS for all API calls
- [ ] Implement PIN encryption
- [ ] Add transaction logging
- [ ] Set up error monitoring
- [ ] Configure auto-update mechanism
- [ ] Enable remote management
- [ ] Implement offline fallback
- [ ] Add tamper detection
- [ ] Configure firewall rules

---

## 🧪 Testing

### **Pre-Deployment Tests:**

1. **Hardware Test:**
```bash
# Test card reader
./test-card-reader.sh

# Test PIN pad
./test-pin-pad.sh

# Test printer
./test-printer.sh
```

2. **Network Test:**
```bash
# Check API connectivity
curl https://api.allpuffs.com/health

# Test payment processing
curl -X POST https://api.allpuffs.com/api/test/payment
```

3. **Full Transaction Flow:**
- Phone entry → skip/submit
- Payment method selection
- Card swipe/tap/insert
- PIN entry
- Processing
- Receipt print
- Points awarded
- Auto-reset

---

## 📊 Monitoring

### **Logs to Track:**

```javascript
// Add logging to card-terminal.html
function logEvent(event, data) {
  fetch('/api/terminal/log', {
    method: 'POST',
    body: JSON.stringify({
      terminalId: TERMINAL_ID,
      event: event,
      data: data,
      timestamp: new Date().toISOString()
    })
  });
}

// Log key events
logEvent('transaction_started', { amount: 38.95 });
logEvent('payment_method_selected', { method: 'ach' });
logEvent('transaction_completed', { authCode: '123456' });
```

---

## 🔄 Updates

### **Remote Update System:**

```javascript
// Check for updates every hour
setInterval(async () => {
  const response = await fetch('/api/terminal/version');
  const { version } = await response.json();
  
  if (version > CURRENT_VERSION) {
    // Download and install update
    await downloadUpdate();
    location.reload();
  }
}, 3600000);
```

---

## 📞 Support

**Device Issues:**
- PAX: support.pax.com
- Ingenico: ingenico.com/support
- Verifone: verifone.com/support
- Clover: clover.com/help

**Integration Help:**
- Review TERMINAL-README.md
- Check terminal-config.json
- Test with control panel first

---

## ✅ Quick Deployment Checklist

1. [ ] Choose hardware device
2. [ ] Install files to device
3. [ ] Configure kiosk mode
4. [ ] Connect card reader SDK
5. [ ] Set up API endpoints
6. [ ] Test full transaction flow
7. [ ] Remove test controls
8. [ ] Enable auto-start
9. [ ] Configure monitoring
10. [ ] Deploy to production

---

**Ready to deploy!** Start with Method 1 (Android) for easiest setup. 🚀
