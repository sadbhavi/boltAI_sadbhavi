# MongoDB Configuration & Deployment Guide

## Local Development Setup ✅ COMPLETE

The MongoDB connection is now properly configured for local development:

### Connection String
```
mongodb+srv://sadbhavi:Mahendrasingh2%40@sadbhavi.wctjeuk.mongodb.net/sadbhavi?retryWrites=true&w=majority&appName=sadbhavi
```

**Key Changes:**
- Added database name `/sadbhavi` to the connection string
- Password is properly URL-encoded (`@` becomes `%40`)
- Connection verified and working

### Files Updated
- `server/.env` - Local development environment variables
- `server/.env.production` - Production template (see below)

## Running Locally

Start the development environment:
```bash
npm run dev
```

This starts:
- **Frontend** (Vite) on `http://localhost:5173`
- **Backend** (Express + MongoDB) on `http://localhost:5001`

## Production Deployment

### Prerequisites
1. **MongoDB Atlas**: Your cluster is already set up at `sadbhavi.wctjeuk.mongodb.net`
2. **Hosting Platform**: You need to deploy the `/server` folder (e.g., Railway, Render, Vercel, Heroku)

### Deployment Steps

#### 1. Configure MongoDB Atlas IP Whitelist
- Go to MongoDB Atlas → Network Access
- Add your production server's IP address OR use `0.0.0.0/0` (allows all IPs - less secure but easier)

#### 2. Deploy Backend Server
Choose one of these platforms:

**Option A: Railway.app** (Recommended - Free tier available)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
cd server
railway login
railway init
railway up
```

**Option B: Render.com**
1. Create account at render.com
2. New → Web Service
3. Connect your GitHub repo
4. Root directory: `server`
5. Build command: `npm install`
6. Start command: `node server.js`

**Option C: Vercel** (Serverless)
```bash
cd server
vercel deploy --prod
```

#### 3. Set Environment Variables
In your hosting platform dashboard, add:
```
MONGODB_URI=mongodb+srv://sadbhavi:Mahendrasingh2%40@sadbhavi.wctjeuk.mongodb.net/sadbhavi?retryWrites=true&w=majority&appName=sadbhavi
PORT=5001
```
(Or use their default PORT if required)

#### 4. Update Frontend for Production
Once backend is deployed, update your frontend to use the production API URL.

If deployed to Railway/Render, you'll get a URL like:
- `https://your-app.railway.app`
- `https://your-app.onrender.com`

**Update `src/lib/apis/blog.ts`:**
```typescript
const API_URL = import.meta.env.PROD 
  ? 'https://your-production-api.com/api/blogs'  // Your production backend URL
  : '/api/blogs';  // Local development (proxied)
```

#### 5. Verify Production
Test your production API:
```bash
curl https://your-production-api.com/api/blogs?status=published&limit=1
```

Should return JSON with blog posts.

## Troubleshooting

### Local Issues
- **Port 5001 in use**: Run `lsof -ti:5001 | xargs kill -9`
- **MongoDB connection fails**: Check password encoding in `.env`
- **No data**: Run `cd server && node seed.js`

### Production Issues
- **502 Bad Gateway**: Backend not running, check hosting logs
- **Connection timeout**: Check MongoDB IP whitelist
- **Empty response**: Backend deployed but database not seeded

## Security Notes
- Never commit `.env` files to Git
- Use environment variables in production, not hardcoded values
- For production, consider using MongoDB Atlas dedicated cluster instead of shared
- Rotate credentials periodically
