# E-Commerce Setup Guide

## 🚀 Local Development Setup

### 1. Start Backend Server
```bash
cd server
npm install
npm run dev
```
The backend will run on `http://localhost:8080`

### 2. Start Frontend
```bash
cd client
npm install
npm start
```
The frontend will run on `http://localhost:3000`

### 3. Seed Database (First Time Only)
```bash
cd server
npm run seed
```

This will add:
- 5 Brands (Apple, Samsung, Sony, Nike, Adidas)
- 5 Categories (Electronics, Smartphones, Laptops, Clothing, Shoes)
- 7 Makes (Standard, Premium, Deluxe, Professional, Basic, Advanced, Custom)
- 5 Test Products with images and details

### 4. Check Database Contents
```bash
cd server
npm run check
```

## 🌐 Environment Variables

### Local Development
- Frontend: Uses `.env.development` → API calls go to `http://localhost:8080`
- Backend: Uses `server/.env` → MongoDB connection and secrets

### Production (Render)
- Frontend: Uses `.env.production` → API calls use relative paths (same domain)
- Backend: Environment variables set in Render dashboard

## 📝 Available Scripts

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with test data
- `npm run check` - Check what's in the database

### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🔧 Troubleshooting

### Products not showing?
1. Make sure backend is running on port 8080
2. Run `npm run seed` in server directory
3. Check database with `npm run check`
4. Restart both frontend and backend

### CORS errors in production?
- Backend CORS is configured to allow your frontend domain
- Make sure `CLIENT_URL` is set in Render environment variables

### Login not working locally?
- Make sure `REACT_APP_API_URL=http://localhost:8080` in client/.env
- Restart the frontend after changing .env files

## 📦 Test Products Included

1. **iPhone 15 Pro** - $999
2. **Samsung Galaxy S24 Ultra** - $1,199
3. **Sony WH-1000XM5 Headphones** - $399
4. **Nike Air Max 270** - $150
5. **MacBook Pro 14-inch M3** - $1,599

All products include:
- High-quality images from Unsplash
- Multiple colors and sizes
- Detailed descriptions
- Stock quantities and ratings
