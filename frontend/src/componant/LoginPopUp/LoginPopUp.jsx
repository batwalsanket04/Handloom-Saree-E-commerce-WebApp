// src/components/LoginPopUp.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
 import { context } from "../../Context/StoreContext";
import { FaXmark } from "react-icons/fa6";

const LoginPopUp = ({ setShowLogine }) => {
  const { setToken, url } = useContext(context);
  const [currState, setCurrState] = useState("Sign Up");
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const toggleForm = () => setCurrState(currState === "Sign Up" ? "Sign In" : "Sign Up");

  const formHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = currState === "Sign Up" ? `${url}/api/user/register` : `${url}/api/user/login`;
      const res = await axios.post(endpoint, data);

      if (res.data.success) {
  setToken(res.data.token);  
  localStorage.setItem("token", res.data.token); // persist
  setShowLogine(false);
} else {
        window.alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      window.alert("Error connecting to backend.");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-3xl w-full max-w-md p-8 md:p-10 relative">
        <button onClick={() => setShowLogine(false)} className="absolute top-4 right-4 text-gray-500 hover:text-pink-600">
          <FaXmark />
        </button>

        <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">{currState}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {currState === "Sign Up" && (
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={formHandle}
                id="name"
                placeholder="Enter your name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={formHandle}
              id="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={formHandle}
              id="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 rounded-full font-semibold text-lg hover:scale-105 transition-transform">
            {currState === "Sign Up" ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          {currState === "Sign Up" ? "Already have an account?" : "Don't have an account?"}{" "}
          <button type="button" onClick={toggleForm} className="text-pink-600 font-medium hover:underline">
            {currState === "Sign Up" ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPopUp;
