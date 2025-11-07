import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/orders/list`); 
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders!");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Server error while fetching orders!");
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${url}/api/orders/update/${orderId}`, {
        status: newStatus,
      });

      if (response.data.success) {
        toast.success("Order status updated!");
        fetchAllOrders(); // refresh list
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Server error while updating status!");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="mt-[120px] px-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-pink-700 mb-6 border-b pb-3">
          All Orders
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
                    value={order.status}
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
