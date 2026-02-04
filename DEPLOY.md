# Netlify Deployment Guide

## 🚀 Quick Deploy

### Option 1: Drag & Drop (Fastest)

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire project folder onto the page
3. Your site is live! ✨

### Option 2: GitHub Integration (Recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/allpuffs.git
git push -u origin main
```

2. **Connect to Netlify:**
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository
   - Click "Deploy site"

3. **Done!** Netlify will automatically:
   - Deploy your site
   - Give you a URL: `https://your-site-name.netlify.app`
   - Set up HTTPS
   - Auto-deploy on every git push

### Option 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

---

## ⚙️ Configuration

### Custom Domain

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `allpuffs.com`)
4. Follow DNS configuration instructions

### Environment Variables

If you add a backend API later:

1. Go to **Site settings** → **Environment variables**
2. Add your variables:
   - `PLAID_PUBLIC_KEY`
   - `API_BASE_URL`
   - etc.

### Build Settings

Already configured in `netlify.toml`:
- ✅ Static site (no build needed)
- ✅ SPA routing configured
- ✅ Security headers set
- ✅ Asset caching optimized

---

## 🔧 Post-Deployment Setup

### 1. Update Store Name

Edit `js/app.js`:
```javascript
const STORE = {
  id: 'your-store-id',
  name: 'Your Store Name',  // Change this
  address: 'Your Address',   // Change this
  // ...
};
```

### 2. Configure Products

Edit `js/app.js` to add/modify products:
```javascript
const PRODUCTS = [
  {
    id: 'p1',
    name: 'Product Name',
    category: 'Disposables',
    price: 12.99,
    // ...
  },
  // Add more products...
];
```

### 3. Test Age Verification

The age gate is session-based. Test by:
1. Open incognito/private window
2. Enter a DOB that makes you 21+
3. Check that it persists during the session
4. Close browser and reopen - should ask again

### 4. Test Full Flow

1. ✅ Age verification
2. ✅ Browse products
3. ✅ Create account
4. ✅ View rewards
5. ✅ Link bank (demo mode)
6. ✅ Add to cart
7. ✅ Checkout

---

## 🔌 Adding Backend API

When ready to connect real payments:

### 1. Update API Calls

In `js/app.js`, change demo handlers to real API calls:

```javascript
// Before (demo):
function handleBankLink(bankName) {
  setTimeout(() => {
    // Mock response
  }, 2000);
}

// After (production):
async function handleBankLink(bankName) {
  const response = await fetch(`${API_BASE_URL}/api/plaid/link`, {
    method: 'POST',
    body: JSON.stringify({ bankName })
  });
  const data = await response.json();
  // Handle real Plaid flow
}
```

### 2. Configure API Proxy in netlify.toml

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-backend.herokuapp.com/api/:splat"
  status = 200
  force = true
```

### 3. Add Plaid SDK

In `index.html`, add before closing `</head>`:
```html
<script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
```

---

## 📊 Analytics

### Add Google Analytics

In `index.html`, add before closing `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🐛 Troubleshooting

### Site not loading?
- Check Netlify deploy logs
- Verify all files uploaded correctly
- Check browser console for errors

### CSS not loading?
- Clear browser cache
- Check file paths in HTML
- Verify CSS files in `/css` folder

### JavaScript errors?
- Open browser developer tools (F12)
- Check Console tab
- Look for specific error messages

### Age gate not working?
- Uses sessionStorage - check browser privacy settings
- Try different browser
- Check JavaScript console for errors

---

## 🔒 Security Checklist

- [ ] HTTPS enabled (automatic with Netlify)
- [ ] Security headers configured (in netlify.toml)
- [ ] Age verification implemented
- [ ] Input validation on all forms
- [ ] No sensitive data in client code
- [ ] API keys in environment variables (not in code)

---

## 📱 Testing on Mobile

1. **Get Netlify URL** from your dashboard
2. **Open on phone** - scan QR code or type URL
3. **Test all features:**
   - Age gate on first visit
   - Account creation
   - Product browsing
   - Cart functionality
   - Checkout flow

---

## 🎯 Performance

Your site scores:
- ✅ Static HTML/CSS/JS
- ✅ No build process
- ✅ CDN delivery (Netlify)
- ✅ Asset caching
- ✅ Fast load times

Run Lighthouse audit:
1. Open site in Chrome
2. F12 → Lighthouse tab
3. Click "Generate report"
4. Should score 90+ on all metrics

---

## 📞 Support

**Netlify Issues:**
- Docs: https://docs.netlify.com
- Support: https://answers.netlify.com

**This Project:**
- Check README.md
- Review INTEGRATION.md for backend setup
- Open GitHub issue

---

## ✨ You're Live!

Your AllPuffs site is now deployed at:
`https://your-site-name.netlify.app`

Next steps:
1. ✅ Test all functionality
2. ✅ Update branding/products
3. ✅ Add custom domain
4. ✅ Connect backend APIs
5. ✅ Start accepting orders!

🎉 **Congratulations!**
