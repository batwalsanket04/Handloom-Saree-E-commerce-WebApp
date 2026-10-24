import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      console.log("Fetching orders with token:", token ? "Token exists" : "No token");
      
      if (!token) {
        setError("No authentication token found. Please login.");
        setLoading(false);
        return;
      }

      // Fixed: Use /api/orders/list (plural) to match backend route
      const response = await axios.get(`${url}/api/orders/list`, { 
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }); 
      
      console.log("Orders response:", response.data);
      
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch orders");
        toast.error(response.data.message || "Failed to fetch orders!");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      console.error("Error response:", error.response);
      
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        toast.error("Please login again");
      } else if (error.response?.status === 403) {
        setError("Admin access required.");
        toast.error("Admin access required");
      } else {
        setError(error.response?.data?.message || "Server error while fetching orders");
        toast.error(error.response?.data?.message || "Server error while fetching orders!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      
      // Fixed: Use /api/orders/update (plural) to match backend route
      const response = await axios.post(`${url}/api/orders/update/${orderId}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        toast.success("Order status updated!");
        fetchAllOrders(); // refresh list
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Server error while updating status!");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) {
    return (
      <div className="mt-[120px] px-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-[120px] px-6 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-semibold text-pink-700 mb-6 border-b pb-3">
            All Orders
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            <button 
              onClick={fetchAllOrders}
              className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[120px] px-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-pink-700 mb-6 border-b pb-3">
          All Orders ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No orders available yet.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-pink-200 rounded-xl p-5 hover:shadow-md transition bg-pink-50/40"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-800">
                    Order ID:{" "}
                    <span className="text-pink-600">{order._id}</span>
                  </h3>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      order.payment
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.payment ? "Paid" : "Unpaid"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Amount:</span> ₹{order.amount}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-700 text-sm">
                    Status:
                  </span>
                  <select
                    value={order.status || "Order Processing"}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-pink-400 focus:outline-none"
                  >
                    <option value="Order Processing">Order Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Date:</span>{" "}
                  {order.date
                    ? new Date(order.date).toLocaleDateString()
                    : "N/A"}
                </p>

                {order.items && order.items.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Items:
                    </h4>
                    <ul className="text-sm text-gray-600 list-disc pl-6 space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity} — ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
