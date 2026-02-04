# AllPuffs Card Terminal Display

Pure terminal screen for card reader hardware integration.

## Files

- `card-terminal.html` - Full terminal display (open in browser)
- `index.html` - Customer web app
- `pos.html` - POS checkout display

## Quick Start

1. **Test on PC:**
```bash
# Just open in browser
open card-terminal.html

# Press F11 for fullscreen
```

2. **Deploy to Card Reader:**
- Load `card-terminal.html` onto your card reader device
- Configure to open on boot
- Connect payment hardware APIs

## How to Fix the "P" Logo

The logo SVG is on **lines 258-270** in `card-terminal.html`.

### Current SVG (simplified P shape):
```svg
<svg class="logo-p" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
  <path d="M 30 20 Q 30 10 40 10 L 70 10 Q 90 10 95 30 Q 100 50 95 70 Q 90 85 70 85 L 50 85 L 50 60 L 65 60 Q 75 60 78 50 Q 80 40 75 32 Q 70 25 60 25 L 45 25 L 45 135" 
        fill="#39FF14"/>
  <path d="M 60 40 Q 68 40 70 48 Q 72 56 68 64 Q 64 70 56 70" 
        fill="#0A0A0A"/>
</svg>
```

### To Fix:

**Option 1: Upload Your Logo PNG**
Replace the SVG with an `<img>` tag:

```html
<img src="your-allpuffs-logo.png" class="logo-p" alt="AllPuffs">
```

**Option 2: Use Your Exact SVG**
If you have the SVG file from your designer:
1. Open the SVG file in a text editor
2. Copy the `<path>` elements
3. Replace lines 259-265 in `card-terminal.html`

**Option 3: Keep it Simple**
Just use the text logo:

```html
<!-- Delete the SVG, just use text -->
<div class="brand-text">ALL PUFFS</div>
```

## Logo Location in Code

Search for this in `card-terminal.html`:

```html
<div class="logo-p-container">
  <svg class="logo-p" viewBox="0 0 120 140">
    <!-- YOUR SVG PATHS HERE -->
  </svg>
</div>
```

This appears **7 times** (once per screen state). You can:
- **Find/Replace All** to update everywhere at once
- Or just update the first one and copy/paste to the others

## Transaction Flow

1. **Phone Entry** 📱 - Collect rewards number (skippable)
2. **Payment Method** - Choose Bank (ACH) or Card
3. **Card Swipe/PIN** - If card selected
4. **Processing** - Payment processing
5. **Approved/Declined** - Final result

## Test Controls

Bottom-right panel has:
- Full flow test
- Jump to any state
- Approve/decline buttons
- Hide controls option

## Integration Points

Replace these demo functions with real APIs:

```javascript
// Line ~850
function processPayment() {
  // Call your payment processor API
  // Dwolla for ACH, card reader for cards
}

// Line ~870
function approveTransaction() {
  // Process successful payment
  // Award points, update database
}
```

## Customization

**Colors** (lines 17-24):
```css
--primary: #39FF14;        /* Neon green */
--bg-darker: #050505;      /* Background */
```

**Amounts** (line ~640):
```javascript
transactionData = {
  amount: 38.95,  // Change default amount
}
```

**Points** (line ~910):
```javascript
// ACH gets 2x points
points: paymentMethod === 'ach' ? 40 : 20
```

## Production Deployment

1. Remove test controls panel (lines 625-640)
2. Connect payment hardware APIs
3. Load onto card reader device
4. Configure fullscreen/kiosk mode
5. Test complete transaction flow

---

**Ready to deploy!** Just fix the logo and you're good to go. 🚀
