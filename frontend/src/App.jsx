import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/ui/Toast';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { Inventory } from './pages/public/Inventory';
import { CarDetails } from './pages/public/CarDetails';
import { Brands } from './pages/public/Brands';
import { Services } from './pages/public/Services';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';

// Unified Dashboard (Single route for both Admin and Normal Users)
import { UnifiedDashboard } from './pages/dashboard/UnifiedDashboard';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Showroom Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/:id" element={<CarDetails />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Unified Dashboard (Role-Based for both Admin & Normal User) */}
          <Route path="/dashboard" element={<UnifiedDashboard />} />

          {/* Legacy Route Redirects to Unified Dashboard */}
          <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />
          <Route path="/customer/*" element={<Navigate to="/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          <Route path="/customer" element={<Navigate to="/dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Notification Layer */}
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
