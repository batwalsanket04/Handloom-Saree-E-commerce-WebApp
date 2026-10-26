import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../Componants/AuthContext/AuthContext";
import api from "../../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/user/admin-login", { email, password });
      if (res.data.success && res.data.user) {
        if (res.data.user.role !== "admin") {
          toast.error("Admin access required");
          return;
        }
        
        // Use AuthContext login function
        login(res.data.user, res.data.token);
        toast.success("Logged in as admin");
        
        // Navigate to dashboard after successful login
        navigate("/list");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Admin login failed:", err);
      const validationErrors = err.response?.data?.errors;

      if (validationErrors && typeof validationErrors === "object") {
        setErrors(validationErrors);
      } else if (err.response?.status === 401) {
        setErrors({ password: "Invalid email or password" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <input
          type="email"
          className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : ""}`}
          placeholder="Email" 
          value={email} 
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((current) => ({ ...current, email: "" }));
          }}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "admin-email-error" : undefined}
        />
        {errors.email && (
          <p id="admin-email-error" className="mb-3 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
        <input
          type="password" 
          className={`w-full p-2 border rounded ${errors.password ? "border-red-500" : ""}`}
          placeholder="Password" 
          value={password} 
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((current) => ({ ...current, password: "" }));
          }}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "admin-password-error" : undefined}
        />
        {errors.password && (
          <p id="admin-password-error" className="mb-3 text-sm text-red-600" role="alert">
            {errors.password}
          </p>
        )}
        <button 
          disabled={loading} 
          className="w-full bg-pink-600 text-white py-2 rounded"
        >
          {loading ? "Logging..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
