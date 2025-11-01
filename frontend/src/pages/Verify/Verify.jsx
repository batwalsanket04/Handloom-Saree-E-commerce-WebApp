import React, { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { context } from "../../Context/StoreContext";
import axios from "axios";
import { useEffect } from "react";
import Verify from "./pages/Verify/Verify";


const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(context);
  const navigate=useNavigate();

  const verifyPayment=async()=>{
    const response=await axios.post(url+"/api/order/verify",{success,orderId})
    if(response.data.success){
     navigate("/myorders");
    }
    else{
        navigate("/")
    }
  }
  useEffect(()=>{
   verifyPayment();
  },[])

  return (
    <div className="flex items-center justify-center h-screen bg-pink-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          {/* Spinner */}
          <div className="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

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
  );
};

export default Verify;
