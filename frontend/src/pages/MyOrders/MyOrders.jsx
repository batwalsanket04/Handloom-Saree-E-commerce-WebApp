import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { context } from "../../Context/StoreContext";

const MyOrders = () => {
  const { url, token } = useContext(context);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      setData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

 useEffect(() => {
  if (!token) return;

  fetchOrders(); // initial load

  const interval = setInterval(() => {
    fetchOrders(); // auto refresh every 5s
  }, 2000);

  return () => clearInterval(interval); // cleanup
}, [token]);

  //  Possible order status steps
  const steps = ["Pending", "Shipped", "Out for Delivery", "Delivered"];

  // Helper function to get index of current step
  const getStepIndex = (status) => steps.indexOf(status);

  return (
    <div className="min-h-screen bg-pink-50 pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-pink-700 mb-6 border-b pb-2">
          My Orders
        </h2>

        {data.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            You have no orders yet.
          </p>
        ) : (
          <div className="space-y-5">
            {data.map((order) => (
              <div
                key={order._id}
                className="border border-pink-200 rounded-xl p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">
                    Order ID:{" "}
                    <span className="text-pink-600">{order._id}</span>
                  </h3>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Total:</span> ₹{order.amount}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.date).toLocaleDateString()}
                </p>

                {/* 🧭 Order tracking bar */}
                <div className="flex justify-between relative mt-3 mb-1">
                  {steps.map((step, index) => (
                    <div
                      key={step}
                      className="flex-1 flex flex-col items-center text-center"
                    >
                      {/* circle */}
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${
                          index <= getStepIndex(order.status)
                            ? "bg-pink-600 border-pink-600"
                            : "border-gray-300"
                        }`}
                      ></div>
                      <p
                        className={`text-xs mt-1 ${
                          index <= getStepIndex(order.status)
                            ? "text-pink-700 font-medium"
                            : "text-gray-400"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  ))}

                  {/* progress line */}
                  <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200 z-0">
                    <div
                      className="h-0.5 bg-pink-500 transition-all duration-500"
                      style={{
                        width: `${
                          (getStepIndex(order.status) /
                            (steps.length - 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
