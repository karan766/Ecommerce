# Render Deployment Guide

## Critical Login Issues Fixed

### 1. Cookie Configuration
- Added `secure: true` for production
- Added `sameSite: 'none'` for cross-origin requests
- Proper cookie settings for HTTPS deployment

### 2. CORS Configuration
- Dynamic origin validation
- Support for multiple allowed origins
- Proper credentials handling

### 3. Environment Variables
- Added validation for required variables
- Proper fallbacks for development
- Production-ready configurations

## Required Environment Variables

### Backend (Server)
```
NODE_ENV=production
MONGO_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=https://your-frontend-url.onrender.com
EMAIL_PASSWORD=your_email_password
EMAIL_ID=your_email@gmail.com
```

### Frontend (Client)
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Deployment Steps

### 1. Backend Deployment
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add all required environment variables
6. Deploy

### 2. Frontend Deployment
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set build command: `cd client && npm install && npm run build`
4. Set publish directory: `client/build`
5. Add environment variables
6. Deploy

### 3. Update CORS Origins
After deployment, update the `CLIENT_URL` environment variable in your backend with the actual frontend URL.

## Common Issues and Solutions

### 1. Login Not Working
- **Issue**: Cookies not being set
- **Solution**: Ensure `secure: true` and `sameSite: 'none'` in production

### 2. CORS Errors
- **Issue**: Cross-origin requests blocked
- **Solution**: Add your frontend URL to allowed origins

### 3. Environment Variables Not Loading
- **Issue**: Variables not accessible
- **Solution**: Restart the service after adding variables

### 4. Database Connection Issues
- **Issue**: MongoDB connection fails
- **Solution**: Whitelist Render's IP addresses in MongoDB Atlas

## Testing After Deployment

1. **Health Check**: Visit `https://your-backend-url.onrender.com/health`
2. **Login Test**: Try logging in with test credentials
3. **Payment Test**: Use Stripe test cards
4. **CORS Test**: Check browser console for CORS errors

## Monitoring

- Check Render logs for errors
- Monitor response times
- Set up uptime monitoring
- Check database connections

## Security Considerations

- Use strong JWT secrets
- Enable HTTPS only
- Secure cookie settings
- Validate all environment variables
- Regular security updates