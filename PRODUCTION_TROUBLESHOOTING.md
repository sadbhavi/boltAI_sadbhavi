# Production 500 Error Troubleshooting Guide

## Problem
Getting "API Error: 500 Internal Server Error" when loading blog posts on production.

## Diagnostic Steps

### 1. Check Backend Logs
Your hosting platform should have logs. Check them for error messages:

**Railway:**
```bash
railway logs
```

**Render:**
- Dashboard → Your Service → Logs tab

**Vercel:**
```bash
vercel logs [deployment-url]
```

**Look for:**
- MongoDB connection errors
- "MongooseServerSelectionError"
- "Authentication failed"
- Any stack traces

### 2. Verify Environment Variables
In your hosting platform dashboard, confirm these are set:

```
MONGODB_URI=mongodb+srv://sadbhavi:Mahendrasingh2%40@sadbhavi.wctjeuk.mongodb.net/sadbhavi?retryWrites=true&w=majority&appName=sadbhavi
PORT=[your-platform-port]
```

**Common mistakes:**
- Password not URL-encoded (`@` must be `%40`)
- Missing database name `/sadbhavi`
- Copy-paste added extra spaces

### 3. Check MongoDB IP Whitelist
1. Go to MongoDB Atlas → Network Access
2. Check if your production server IP is allowed
3. **Quick fix:** Add `0.0.0.0/0` (allows all IPs) - less secure but works
4. **Better fix:** Add your specific production server IP

**How to find your production server IP:**
- Railway/Render: Check deployment logs or settings
- Or temporarily allow all IPs to test

### 4. Test Production API Directly
```bash
curl -v 'https://your-production-url.com/api/blogs?status=published&limit=1'
```

This will show:
- If the endpoint exists
- The exact error response
- HTTP headers

### 5. Verify Database Has Data
Your production database might be empty. Seed it:

**Option A: Run seed script on production**
SSH into your server (if possible) or add seed to deployment:
```bash
cd server && node seed.js
```

**Option B: Connect to production DB locally**
Update your local `server/.env` temporarily:
```
MONGODB_URI=mongodb+srv://sadbhavi:Mahendrasingh2%40@sadbhavi.wctjeuk.mongodb.net/sadbhavi?retryWrites=true&w=majority&appName=sadbhavi
```
Then run:
```bash
cd server && node seed.js
```

### 6. Add More Logging
Update `server/server.js` to log more details:

```javascript
// Add at top of /api/blogs route
app.get('/api/blogs', async (req, res) => {
  console.log('📥 Received request:', req.query);
  console.log('🔗 MongoDB Status:', mongoose.connection.readyState); // 1 = connected
  try {
    // ... existing code
    console.log('✅ Found posts:', posts.length);
  } catch (error) {
    console.error('❌ ERROR:', error);
    // ... existing error handling
  }
});
```

Redeploy and check logs again.

## Most Likely Causes

1. **MongoDB IP not whitelisted** (90% of cases)
   - Fix: Add production server IP to MongoDB Atlas

2. **Environment variables not set**
   - Fix: Set MONGODB_URI in hosting dashboard

3. **Database not seeded**
   - Fix: Run seed script on production database

4. **Wrong connection string**
   - Fix: Verify format matches exactly

## Quick Checklist
- [ ] Backend logs checked
- [ ] MONGODB_URI environment variable confirmed in hosting platform
- [ ] MongoDB Atlas IP whitelist includes production server (or 0.0.0.0/0)
- [ ] Production database has been seeded
- [ ] Tested API endpoint directly with curl
- [ ] Added logging and redeployed

## Need More Help?
Share:
1. Your hosting platform (Railway/Render/Vercel/etc.)
2. The backend logs (last 20-30 lines)
3. Result of: `curl https://your-prod-url.com/api/blogs?status=published&limit=1`
