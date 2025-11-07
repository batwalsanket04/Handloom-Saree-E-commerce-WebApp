import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
       <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        toastStyle={{
          backgroundColor: "#fff0f6",
          color: "#b91c1c",
          border: "1px solid #f9a8d4",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: "500",
          padding: "12px 18px",
          boxShadow: "0 2px 8px rgba(255, 105, 180, 0.2)",
        }}
        progressStyle={{
          background: "linear-gradient(to right, #ec4899, #db2777)",
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
