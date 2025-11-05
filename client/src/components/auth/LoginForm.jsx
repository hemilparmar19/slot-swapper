import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Input from "../common/Input";
import Button from "../common/Button";

const LoginForm = ({ onSwitchMode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);
      login(data.token, { id: data._id, name: data.name, email: data.email });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Welcome Back</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" disabled={loading} fullWidth>
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={onSwitchMode}
          className="text-indigo-600 hover:underline font-medium"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
