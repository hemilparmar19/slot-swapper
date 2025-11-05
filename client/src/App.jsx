import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./components/auth/AuthPage";
import AppLayout from "./components/layout/AppLayout";
import MyCalendar from "./components/calendar/MyCalendar";
import Marketplace from "./components/marketplace/Marketplace";
import Notifications from "./components/notifications/Notifications";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // if not logged in, show the AuthPage
    return <AuthPage />;
  }

  // Logged-in routes
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MyCalendar />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/requests" element={<Notifications />} />
        {/* Redirect any unknown routes to calendar */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
