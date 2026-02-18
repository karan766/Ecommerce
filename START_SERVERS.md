# How to Start Both Servers

## The Problem
Your frontend is trying to connect to the backend at `localhost:8080`, but the backend server isn't running.

## Solution: Start Both Servers

### 1. Start Backend Server (Terminal 1)
```bash
cd server
npm install  # if you haven't installed dependencies
npm start
```

You should see something like:
```
Server is running on port 8080
Connected to MongoDB
```

### 2. Start Frontend Server (Terminal 2)
```bash
cd client
npm start
```

You should see:
```
Local:            http://localhost:3000
```

## ✅ Both Servers Should Be Running:
- **Backend**: http://localhost:8080 (API server)
- **Frontend**: http://localhost:3000 (React app)

## 🔧 If Backend Won't Start:
Check if you have all environment variables in `server/.env`:
```
MONGO_URL=mongodb+srv://...
SECRET_KEY=aacha
STRIPE_SECRET_KEY=sk_test_...
EMAIL_ID=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLIENT_URL=http://localhost:3000
```

## 🔧 If You Get Port Conflicts:
If port 8080 is busy, you can change it:
1. Add `PORT=3001` to `server/.env`
2. Update `client/.env` to `REACT_APP_API_URL=http://localhost:3001`

## ✅ Test the Connection:
1. Start both servers
2. Go to http://localhost:3000
3. Try to login - should work without connection errors!