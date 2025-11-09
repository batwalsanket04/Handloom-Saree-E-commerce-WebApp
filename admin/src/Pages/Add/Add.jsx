import React, { useState } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Add = () => {
  const url = "http://localhost:4000";

  const [formData, setFormData] = useState({
    Pname: "",
    price: "",
    description: "",
    category: "All-Over",
    imageFile: null,
    imagePreview: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Pname || !formData.price) {
      return alert("Product Name and Price are required!");
    }

    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("name", formData.Pname);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("category", formData.category);
      if (formData.imageFile) payload.append("image", formData.imageFile);

      const response = await axios.post(`${url}/api/saree/add`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          Pname: "",
          price: "",
          description: "",
          category: "All-Over",
          imageFile: null,
          imagePreview: null,
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-24">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Add New Item
        </h2>

        <div className="flex flex-col items-center">
          <p className="text-gray-600 text-sm mb-1">Upload Image</p>
          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-pink-300 rounded-lg cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition overflow-hidden">
            {formData.imagePreview ? (
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-pink-400">
                <Plus className="w-6 h-6 mb-1" />
                <span className="text-xs">Click to upload</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <input
          type="text"
          name="Pname"
          value={formData.Pname}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          min={0}
          onKeyDown={(e) => e.key === "-" && e.preventDefault()}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
        >
          <option value="All-Over">Brocade</option>
          <option value="Muniya">Muniya</option>
          <option value="Lehenga">Lehenga</option>
          <option value="Butti">Butti</option>
          <option value="Dupatta">Dupatta</option>
          <option value="BlausPiece">Blaus Piece</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className={`bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition font-medium text-sm ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default Add;
