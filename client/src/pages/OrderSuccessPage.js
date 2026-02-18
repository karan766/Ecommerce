

import { useEffect, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { resetCartAsync } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { resetOrder } from "../features/order/orderSlice";
import NavBar from "../features/navbar/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function OrderSuccessPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentIntent = searchParams.get('payment_intent');
      const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
      
      if (paymentIntent && paymentIntentClientSecret) {
        // This is a Stripe redirect, verify payment status
        setPaymentStatus('processing');
        
        try {
          const stripe = await stripePromise;
          if (stripe) {
            const { paymentIntent: retrievedPaymentIntent } = await stripe.retrievePaymentIntent(paymentIntentClientSecret);
            
            if (retrievedPaymentIntent) {
              setPaymentStatus(retrievedPaymentIntent.status);
              
              if (retrievedPaymentIntent.status === 'succeeded') {
                toast.success("Payment completed successfully!");
              } else if (retrievedPaymentIntent.status === 'processing') {
                toast.info("Payment is being processed...");
              } else {
                toast.error("Payment was not successful");
                setPaymentError("Payment failed or was cancelled");
              }
            }
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          setPaymentError("Could not verify payment status");
          toast.error("Could not verify payment status");
        }
      } else {
        // Regular order success (cash payment)
        setPaymentStatus('succeeded');
        toast.success("Order Placed successfully");
      }
    };

    verifyPayment();

    // Reset cart and current order
    dispatch(resetCartAsync());
    dispatch(resetOrder());
  }, [dispatch, searchParams]);

  if (!params.id) {
    return <Navigate to="/" replace={true} />;
  }

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'succeeded':
        return searchParams.get('payment_intent') ? 'Payment & Order Completed!' : 'Order Successfully Placed';
      case 'processing':
        return 'Processing Payment...';
      case 'requires_payment_method':
        return 'Payment Failed';
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'succeeded':
        return 'text-green-600';
      case 'processing':
        return 'text-amber-600';
      case 'requires_payment_method':
        return 'text-red-600';
      default:
        return 'text-amber-600';
    }
  };

  return (
    <>
      <NavBar>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            {paymentStatus === 'processing' ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className={`text-base font-semibold ${getStatusColor()}`}>
                  {getStatusMessage()}
                </p>
              </>
            ) : (
              <>
                <p className={`text-base font-semibold ${getStatusColor()}`}>
                  {getStatusMessage()}
                </p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Order Number #{params?.id}
                </h1>
                {paymentStatus === 'succeeded' && searchParams.get('payment_intent') && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ Payment processed successfully
                  </p>
                )}
                {paymentError && (
                  <p className="mt-2 text-sm text-red-600">
                    ⚠ {paymentError}
                  </p>
                )}
                <p className="mt-6 text-base leading-7 text-gray-600">
                  You can check your order in My Account &gt; My Orders
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    to="/"
                    className="rounded-md bg-amber-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                  >
                    Go back home
                  </Link>
                  <Link
                    to="/orders"
                    className="rounded-md bg-gray-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    View Orders
                  </Link>
                </div>
                {paymentStatus === 'requires_payment_method' && (
                  <div className="mt-6">
                    <Link
                      to="/checkout"
                      className="rounded-md bg-red-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-600"
                    >
                      Try Payment Again
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </NavBar>
    </>
  );
}

export default OrderSuccessPage;
