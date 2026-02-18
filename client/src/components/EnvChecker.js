import React from 'react';

const EnvChecker = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  const nodeEnv = process.env.NODE_ENV;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Environment Check</h4>
      <p><strong>NODE_ENV:</strong> {nodeEnv}</p>
      <p><strong>API_URL:</strong> {apiUrl || 'Not set'}</p>
      <p><strong>Stripe Key:</strong> {stripeKey ? 'Set' : 'Not set'}</p>
      <p><strong>Current URL:</strong> {window.location.origin}</p>
    </div>
  );
};

export default EnvChecker;