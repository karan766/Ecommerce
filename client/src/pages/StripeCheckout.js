

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { selectCurrentOrder } from "../features/order/orderSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import CheckoutForm from "../pages/CheckoutForm";
import CompletePage from "../pages/CompletePage";
import "../pages/Stripe.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const [dpmCheckerLink, setDpmCheckerLink] = useState("");
  const [currentPage, setCurrentPage] = useState("checkout"); // State to control the page
  const [error, setError] = useState(null);
  const currentOrder = useSelector(selectCurrentOrder);

  useEffect(() => {
    if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
      setError("Stripe publishable key is not configured");
      return;
    }

    if (!currentOrder || !currentOrder.totalAmount) {
      setError("No order found or invalid order amount");
      return;
    }

    // Create PaymentIntent as soon as the page loads
    fetch(`${process.env.REACT_APP_API_URL || ''}/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalAmount: currentOrder.totalAmount }),
      credentials: 'include',
      meta:{
        order_id: currentOrder.id // Pass the order ID
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to create payment intent');
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        // [DEV] For demo purposes only
        setDpmCheckerLink(data.dpmCheckerLink);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
        setError("Failed to initialize payment. Please try again.");
      });
  }, [currentOrder]);

  const appearance = {
    theme: "stripe",
  };
  const loader = "auto";

  const navigateToComplete = () => {
    setCurrentPage("complete"); // Switch to the Complete page
  };

  return (
    <div className="Stripe">
      {error && (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Link 
              to="/checkout" 
              className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
            >
              Back to Checkout
            </Link>
          </div>
        </div>
      )}
      {!error && clientSecret && (
        <Elements
          options={{ clientSecret, appearance, loader }}
          stripe={stripePromise}
        >
          {currentPage === "checkout" ? (
            <CheckoutForm
              dpmCheckerLink={dpmCheckerLink}
              onComplete={navigateToComplete} // Pass the navigation handler
            />
          ) : (
            <CompletePage />
          )}
        </Elements>
      )}
      {!error && !clientSecret && (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="spinner"></div>
            <p className="mt-4">Loading payment...</p>
          </div>
        </div>
      )}
    </div>
  );
}
