import React, { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetCartAsync } from "../features/cart/cartSlice";
import { resetOrder } from "../features/order/orderSlice";

function OrderSuccessPageSimple() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  const paymentIntent = searchParams.get('payment_intent');
  const isStripePayment = !!paymentIntent;

  useEffect(() => {
    // Reset cart and order when order success page loads
    const resetCartAndOrder = async () => {
      try {
        await dispatch(resetCartAsync()).unwrap();
        dispatch(resetOrder());
        console.log('Cart and order reset successfully');
      } catch (error) {
        console.error('Error resetting cart/order:', error);
      }
    };

    resetCartAndOrder();
  }, [dispatch]);

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
      </div>
    </div>
  );
}

export default OrderSuccessPageSimple;