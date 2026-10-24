import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { context } from "../../Context/StoreContext";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(context);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const res = await axios.post(`${url}/api/orders/verify`, {
        success: success === "true",
        orderId,
      });

      res.data.success ? navigate("/myorders") : navigate("/");
    } catch (error) {
      console.error("Payment verification error:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-pink-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          {success === "true"
            ? "Verifying your order..."
            : "Something went wrong..."}
        </h2>
        {orderId && (
          <p className="text-gray-500 text-sm">
            Order ID: <span className="font-medium text-pink-600">{orderId}</span>
          </p>
        )}
      </div>
    </div>
  </div>
  );
};

export default Verify;
