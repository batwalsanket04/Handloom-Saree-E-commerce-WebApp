import React, { useContext } from "react";
import { context } from "../../Context/StoreContext";
import { FaPlus, FaMinus, FaStar, FaStarHalfAlt } from "react-icons/fa";

const SareeItem = ({ _id, name, price, description, image }) => {
  const { cartItem, addToCart, removeFromCart, url } = useContext(context);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
      <div className="relative w-full h-60">
        <img
          src={image ? `${url}/images/${image}` : "/placeholder.jpg"}
          alt={name}
          className="w-full h-full object-cover"
        />

        {!cartItem[_id] ? (
          <button
            className="absolute bottom-2 right-2 bg-white text-gray-500 p-2 rounded-full shadow-md hover:bg-gray-200 transition"
            onClick={() => addToCart(_id)}
          >
            <FaPlus />
          </button>
        ) : (
          <div className="absolute bottom-2 right-2 bg-white rounded-full shadow-md flex items-center gap-3 px-3 py-1">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => removeFromCart(_id)}
            >
              <FaMinus />
            </button>
            <p>{cartItem[_id]}</p>
            <button
              className="text-green-500 hover:text-green-700"
              onClick={() => addToCart(_id)}
            >
              <FaPlus />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <div className="flex items-center space-x-1 text-yellow-400 mt-2">
          <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
        </div>
        <p className="text-sm text-gray-600 mt-2 flex-1">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-pink-600">₹{price}</span>
        </div>
      </div>
    </div>
  );
};

export default SareeItem;
