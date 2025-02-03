import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import './styles/index.css';
import App from './App';
import { AuthProvider } from "./context/AuthContext"; // Import the AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot for React 18
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap your app with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
