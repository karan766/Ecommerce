# Payment System Testing Guide

## Test Card Numbers for Stripe

Use these test card numbers to test different payment scenarios:

### Successful Payments
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### Declined Payments
- **Card Number**: 4000 0000 0000 0002 (Generic decline)
- **Card Number**: 4000 0000 0000 9995 (Insufficient funds)
- **Card Number**: 4000 0000 0000 9987 (Lost card)

### 3D Secure Authentication
- **Card Number**: 4000 0025 0000 3155 (Requires authentication)

## Testing Steps

1. **Add items to cart**
2. **Go to checkout**
3. **Fill in shipping details**
4. **Select "Card" as payment method**
5. **Click "Order Now"** - This should redirect to Stripe checkout
6. **Enter test card details**
7. **Click "Pay now"**
8. **Verify redirect to order success page**

## Environment Variables Required

### Client (.env)
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Server (.env)
```
STRIPE_SECRET_KEY=sk_test_...
```

## Common Issues and Solutions

1. **"Stripe publishable key is not configured"**
   - Ensure REACT_APP_STRIPE_PUBLISHABLE_KEY is set in client/.env
   - Restart the client development server

2. **"Failed to create payment intent"**
   - Check server logs for errors
   - Ensure STRIPE_SECRET_KEY is set in server/.env
   - Verify the order has a valid totalAmount

3. **Payment not redirecting properly**
   - Check that return_url is correctly set to your domain
   - Ensure order-success route is properly configured

4. **CORS issues**
   - Ensure credentials: 'include' is set in all API calls
   - Verify CORS is configured with credentials: true on server