import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SimProvider } from './context/SimContext';
import TopBar from './components/TopBar';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CustomerApp from './pages/CustomerApp';
import RestaurantPanel from './pages/RestaurantPanel';
import RiderPanel from './pages/RiderPanel';
import MLPrediction from './pages/MLPrediction';
import LiveSignals from './pages/LiveSignals';
import Notifications from './pages/Notifications';
import Offers from './pages/Offers';
import Analytics from './pages/Analytics';
import Scorecard from './pages/Scorecard';
import PRD from './pages/PRD';

function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customer" element={<CustomerApp />} />
        <Route path="restaurant" element={<RestaurantPanel />} />
        <Route path="rider" element={<RiderPanel />} />
        <Route path="ml" element={<MLPrediction />} />
        <Route path="signals" element={<LiveSignals />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="offers" element={<Offers />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="scorecard" element={<Scorecard />} />
        <Route path="prd" element={<PRD />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SimProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app/*" element={<Protected><AppShell /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SimProvider>
    </AuthProvider>
  );
}
