import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../Componants/AuthContext/AuthContext";

const Login = ({ url }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${url}/api/user/admin-login`, { email, password });
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
      console.error(err);
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <input 
          className="w-full p-2 mb-3 border rounded" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          className="w-full p-2 mb-3 border rounded" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
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
