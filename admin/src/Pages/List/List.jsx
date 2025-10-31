import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const List = () => {
  const url = "http://localhost:4000"; // Backend URL
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all sarees from backend
  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/saree/list`);
      if (res.data.success) setList(res.data.data);
      else toast.error(res.data.message || "Error fetching list");
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Delete a saree by ID
  const removeItem = async (_id) => {
    try {
      const res = await axios.delete(`${url}/api/saree/remove/${_id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchList(); // Refresh list after deletion
      } else {
        toast.error("Failed to delete item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="mt-24 px-4 sm:px-6 md:px-10">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">All Sarees</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : list.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[700px] bg-white rounded-2xl shadow-lg">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 font-medium text-gray-600">
              <span>Image</span>
              <span>Name</span>
              <span>Category</span>
              <span>Price</span>
              <span>Action</span>
            </div>

            {/* Table Rows */}
            {list.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-4 items-center p-4 border-b border-gray-100 hover:bg-pink-50 transition"
              >
                <img
                  src={`${url}/images/${item.image}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <p className="text-gray-700 font-medium">{item.name}</p>
                <p className="text-gray-500">{item.category}</p>
                <p className="text-gray-700 font-semibold">₹{item.price}</p>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-pink-500 hover:text-red-700 p-2 rounded-full transition"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
