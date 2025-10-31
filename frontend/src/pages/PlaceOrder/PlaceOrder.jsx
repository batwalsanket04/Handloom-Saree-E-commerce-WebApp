import React, { useContext, useState, useEffect } from "react";
import { context } from "../../Context/StoreContext";
import axios from "axios"
  import {toast} from "react-toastify"
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, sarees, cartItem, url } =
    useContext(context);

  const [delivery, setDelivery] = useState({
    fname: "",
    lname: "",
    uemail: "",
    street: "",
    city: "",
    state: "",
    code: "",
    country: "",
    phone: "",
  });

    const [paymentMethod, setPaymentMethod] = useState("stripe");
  const navigate = useNavigate();

  // Redirect to /cart if user not logged in OR cart empty
  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  const handleDelivery = (e) => {
    const { name, value } = e.target;
    setDelivery((prev) => ({ ...prev, [name]: value }));
  };

 const submitDelivery = async (e) => {
  e.preventDefault();

  try {
    // Build order items
    let orderItems = sarees
      .filter((val) => cartItem[val._id] > 0)
      .map((val) => ({
        ...val,
        quantity: cartItem[val._id],
      }));

    let orderData = {
      userId: localStorage.getItem("userId"),
      address: delivery,
      items: orderItems,
      amount: getTotalCartAmount() + 180,
      paymentMethod,
    };

    if (paymentMethod === "stripe") {
      //  STRIPE PAYMENT
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        toast.error("Error placing Stripe order")
      }
    } else if (paymentMethod === "cod") {
      //  CASH ON DELIVERY
      const response = await axios.post(`${url}/api/order/cod`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success("COD order placed successfully!");
        navigate("/myorders");
      } else {
        toast.error("Error placing COD order");
      }
    } else {
      toast.warning("Please select a payment method.");
    }
  } catch (error) {
    console.error("Error during order placement:", error);
    toast.error("Something went wrong. Please try again.");
  }
};

  return (
    <form
      className="place-order pt-[100px] px-4 md:px-6 bg-gray-50 min-h-screen"
      onSubmit={submitDelivery}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Left - Delivery Information */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <p className="text-xl font-semibold text-gray-800 mb-6">
            Delivery Information
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="fname"
              value={delivery.fname}
              required
              onChange={handleDelivery}
              placeholder="First Name"
              className="border border-pink-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              name="lname"
              required
              value={delivery.lname}
              onChange={handleDelivery}
              placeholder="Last Name"
              className="border border-pink-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <input
            type="email"
            name="uemail"
            required
            value={delivery.uemail}
            onChange={handleDelivery}
            placeholder="Email Address"
            className="w-full border border-pink-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <input
            type="text"
            name="street"
            required
            value={delivery.street}
            onChange={handleDelivery}
            placeholder="Street"
            className="w-full border border-pink-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="city"
              value={delivery.city}
              required
              onChange={handleDelivery}
              placeholder="City"
              className="border border-pink-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              name="state"
              required
              value={delivery.state}
              onChange={handleDelivery}
              placeholder="State"
              className="border border-pink-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="code"
              required
              value={delivery.code}
              onChange={handleDelivery}
              placeholder="Zip-code"
              className="border border-pink-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              name="country"
              required
              value={delivery.country}
              onChange={handleDelivery}
              placeholder="Country"
              className="border border-pink-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <input
            type="text"
            placeholder="Phone"
            name="phone"
            required
            value={delivery.phone}
            onChange={handleDelivery}
            className="w-full border border-pink-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Right - Cart Summary */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Cart Details
          </h2>

          <div className="flex justify-between py-2 text-gray-700">
            <p>SubTotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="flex justify-between py-2 text-gray-700">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : 180}</p>
          </div>
          <hr />
          <div className="flex justify-between py-3 font-semibold text-gray-900 text-lg">
            <p>Total</p>
            <p>
              ₹
              {getTotalCartAmount() === 0
                ? 0
                : getTotalCartAmount() + 180}
            </p>
          </div>
 <div className="bg-white p-4 rounded-xl shadow-md mb-4">
  <h2 className="text-lg font-semibold text-gray-800 mb-3">
    Payment Method
  </h2>
  <div className="flex flex-col gap-3">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="payment"
        value="stripe"
        checked={paymentMethod === "stripe"}
        onChange={() => setPaymentMethod("stripe")}
      />
      <span>Pay with Card (Stripe)</span>
    </label>
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="payment"
        value="cod"
        checked={paymentMethod === "cod"}
        onChange={() => setPaymentMethod("cod")}
      />
      <span>Cash on Delivery</span>
    </label>
  </div>
</div>


          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-full mt-4 font-medium hover:bg-pink-700 transition"
          >
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
