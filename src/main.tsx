
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Get Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_ZnJhbmstcHVtYS03Ny5jbGVyay5hY2NvdW50cy5kZXYk';

// If no Clerk key is provided, show setup instructions
if (!PUBLISHABLE_KEY) {
  const setupInstructions = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <img 
            src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" 
            alt="MCP Now Logo" 
            className="h-12 w-12 mx-auto mb-4" 
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Setup Required</h1>
          <p className="text-gray-600 dark:text-gray-300">Authentication setup is needed to continue</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Missing Clerk Configuration</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              To use MCP Now with authentication, you need to set up a Clerk account and configure the publishable key.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Setup Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>Visit <a href="https://go.clerk.com/lovable" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://go.clerk.com/lovable</a> to create a Clerk account</li>
              <li>Create a new application in your Clerk dashboard</li>
              <li>Copy your publishable key from the Clerk dashboard</li>
              <li>Set the environment variable <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> to your key</li>
              <li>Restart your development server</li>
            </ol>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>Tip:</strong> For a quick start without authentication, you can temporarily disable auth by commenting out the ClerkProvider wrapper in main.tsx
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      {setupInstructions()}
    </React.StrictMode>
  );
} else {
  // Clear any potentially cached routes on initial page load
  if (window.location.pathname === '/' || window.location.pathname === '/index') {
    sessionStorage.clear();
    localStorage.removeItem('lastVisitedRoute');
  }

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
