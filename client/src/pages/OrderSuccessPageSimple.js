import React from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

function OrderSuccessPageSimple() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  
  const paymentIntent = searchParams.get('payment_intent');
  const isStripePayment = !!paymentIntent;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isStripePayment ? 'Payment Successful!' : 'Order Placed!'}
          </h1>
          
          <p className="text-xl text-gray-600 mb-4">
            Order #{params?.id || 'Unknown'}
          </p>
          
          {isStripePayment && (
            <p className="text-green-600 mb-4">
              ✓ Your payment has been processed successfully
            </p>
          )}
          
          <p className="text-gray-600 mb-8">
            Thank you for your order! You will receive a confirmation email shortly.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              View My Orders
            </Link>
          </div>
        </div>

        {/* Debug info */}
        <div className="mt-8 p-4 bg-gray-100 rounded text-left text-sm">
          <strong>Debug Info:</strong><br/>
          Order ID: {params?.id}<br/>
          Payment Intent: {paymentIntent || 'None'}<br/>
          URL: {window.location.href}
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPageSimple;