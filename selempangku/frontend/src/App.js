// ============================================================
// APP.JS - Main Application Component
// src/App.js
// ============================================================

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Router
import AppRoutes from './router/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        {/* Main Routes */}
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
