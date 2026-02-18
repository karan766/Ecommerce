import React from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";

function DiagnosticPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Diagnostic Page</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">URL Information</h2>
            <p><strong>Full URL:</strong> {window.location.href}</p>
            <p><strong>Pathname:</strong> {location.pathname}</p>
            <p><strong>Search:</strong> {location.search}</p>
            <p><strong>Hash:</strong> {location.hash}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">Route Parameters</h2>
            <pre>{JSON.stringify(params, null, 2)}</pre>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">Search Parameters</h2>
            <pre>{JSON.stringify(Object.fromEntries(searchParams), null, 2)}</pre>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">Environment Variables</h2>
            <p><strong>REACT_APP_STRIPE_PUBLISHABLE_KEY:</strong> {process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Not set'}</p>
            <p><strong>REACT_APP_API_URL:</strong> {process.env.REACT_APP_API_URL || 'Not set'}</p>
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">Browser Information</h2>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Cookies Enabled:</strong> {navigator.cookieEnabled ? 'Yes' : 'No'}</p>
            <p><strong>Local Storage Available:</strong> {typeof(Storage) !== "undefined" ? 'Yes' : 'No'}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">Console Logs</h2>
            <p>Check the browser console for any JavaScript errors.</p>
            <button 
              onClick={() => console.log('Test log from diagnostic page')}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Test Console Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticPage;