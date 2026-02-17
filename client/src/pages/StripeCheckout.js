

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { selectCurrentOrder } from "../features/order/orderSlice";
import { useSelector } from "react-redux";

import CheckoutForm from "../pages/CheckoutForm";
import CompletePage from "../pages/CompletePage";
import "../pages/Stripe.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe("pk_test_51QWIz6Kg2O7KK8gXGXy226ZqBZ4SxhP5pXP5M3CEQcnbewgLB62t0hwXWdSwjFuzsBuS89BE3HGoLOU4yYeWvTUz00dWV16Cmq");

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const [dpmCheckerLink, setDpmCheckerLink] = useState("");
  const [currentPage, setCurrentPage] = useState("checkout"); // State to control the page
  const currentOrder = useSelector(selectCurrentOrder);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalAmount: currentOrder.totalAmount }),
      meta:{
        order_id: currentOrder.id // Pass the order ID
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        // [DEV] For demo purposes only
        setDpmCheckerLink(data.dpmCheckerLink);
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
      {clientSecret && (
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
    </div>
  );
}
