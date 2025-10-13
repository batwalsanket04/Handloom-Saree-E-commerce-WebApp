import axios from 'axios';
import { FaTrash } from "react-icons/fa";

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const List = () => {
  const url = "http://localhost:4000";
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/saree/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Axios error:", error);
      toast.error(error.response?.data?.message || error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const removeS=async(sareeId)=>{
   const response= await axios.delete(`${url}/api/saree/remove/${sareeId}`)
   await fetchList();
   if(response.data.success){
    toast.success( response.data.message);

   }else{
      toast.error("Error")
   }
  

  }

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
            {list.map((val, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-4 items-center p-4 border-b border-gray-100 hover:bg-pink-50 transition"
              >
                <img
                  src={`${url}/images/${val.image}`}
                  alt={val.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <p className="text-gray-700 font-medium">{val.name}</p>
                <p className="text-gray-500">{val.category}</p>
                <p className="text-gray-700 font-semibold">₹{val.price}</p>
                <button   onClick={()=>removeS(val._id)} className="text-pink-500 hover:text-red-700 p-1 rounded-full transition">
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
