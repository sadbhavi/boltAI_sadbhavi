# Sadbhavi - Mental Wellness Platform

A modern mental wellness platform offering meditation, mindfulness, and emotional support resources.

## Project Structure

```
sadbhavi/
├── frontend/          # React + Vite frontend application
├── backend/           # Node.js + Express API server
├── scripts/           # Utility scripts (seeding, deployment)
└── docs/              # Project documentation
```

## Quick Start

### Development (Both Frontend & Backend)
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies  
cd ../backend && npm install

# Run both servers concurrently
cd ..
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001

### Frontend Only
```bash
cd frontend
npm run dev
```

### Backend Only
```bash
cd backend
npm run dev
```

### Seed Database
```bash
npm run seed
```

## Environment Setup

### Frontend (.env in `/frontend`)
```
VITE_OPENAI_API_KEY=your_key_here
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend (.env in `/backend`)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority
PORT=5001
NODE_ENV=development
```

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **Auth**: Firebase Authentication

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Firebase Admin SDK

## Deployment

### Frontend
Deploy to Vercel, Netlify, or any static hosting:
```bash
cd frontend
npm run build
```

### Backend
Deploy to Railway, Render, or any Node.js hosting:
```bash
cd backend
npm start
```

## Documentation
- [Technical Architecture](./docs/TECHNICAL_ARCHITECTURE.md)
- [MongoDB Setup Guide](./MONGODB_SETUP.md)
- [Production Troubleshooting](./PRODUCTION_TROUBLESHOOTING.md)

## License
Private - All Rights Reserved
