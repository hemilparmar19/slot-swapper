import React from "react";
import { RefreshCw, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">SlotSwapper</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
