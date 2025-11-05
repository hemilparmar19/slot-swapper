import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { RefreshCw } from "lucide-react";

const AuthPage = () => {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <RefreshCw className="w-8 h-8 text-indigo-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">SlotSwapper</h1>
        </div>

        {mode === "login" ? (
          <LoginForm onSwitchMode={() => setMode("signup")} />
        ) : (
          <SignupForm onSwitchMode={() => setMode("login")} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
