import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet /> {/* This is where page content will render */}
      </main>
    </div>
  );
};

export default AppLayout;
