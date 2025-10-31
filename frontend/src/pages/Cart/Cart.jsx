import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "../../Context/StoreContext";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const nav = useNavigate();
  const { cartItem, sarees, addToCart, removeFromCart, url } = useContext(context);

  // Map cart items to full product details
  const cartProducts = Object.keys(cartItem)
    .map((id) => {
      const product = sarees.find((s) => s._id === id); // use _id
      return product ? { ...product, quantity: cartItem[id] } : null;
    })
    .filter(Boolean);

  // Calculate totals
  const subtotal = cartProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const delivery = subtotal === 0 ? 0 : 180;
  const total = subtotal + delivery;

  return (
    <div className="cart pt-[100px] min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
        <div className="grid grid-cols-6 gap-4 font-semibold border-b-2 border-pink-200 pb-3 text-gray-700">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <div className="divide-y divide-pink-100 mt-3">
          {cartProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500 col-span-6">
              Your cart is empty
            </div>
          ) : (
            cartProducts.map((val) => {
              const itemTotal = val.price * val.quantity;
              return (
                <div
                  key={val._id} // use _id
                  className="grid grid-cols-6 gap-4 items-center py-4 hover:bg-pink-50 rounded-lg transition duration-200"
                >
                  <img
                    src={val.image ? `${url}/images/${val.image}` : "/placeholder.jpg"} // use image
                    alt={val.name}
                    className="w-16 h-16 object-cover rounded-lg border border-pink-100"
                  />
                  <p className="text-gray-800 font-medium">{val.name}</p>
                  <p className="text-gray-600">₹{val.price}</p>

                  <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <button
                      onClick={() => removeFromCart(val._id)} // use _id
                      className="px-2 bg-pink-200 rounded"
                    >
                      -
                    </button>
                    <span>{val.quantity}</span>
                    <button
                      onClick={() => addToCart(val._id)} // use _id
                      className="px-2 bg-pink-200 rounded"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-gray-800 font-semibold">₹{itemTotal}</p>
                  <button
                    className="text-pink-600 font-bold hover:text-pink-800 transition"
                    onClick={() => removeFromCart(val._id)} // use _id
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Cart Details</h2>
          <div className="flex justify-between py-2 text-gray-700">
            <p>SubTotal</p>
            <p>₹{subtotal}</p>
          </div>
          <hr />
          <div className="flex justify-between py-2 text-gray-700">
            <p>Delivery Fee</p>
            <p>₹{delivery}</p>
          </div>
          <hr />
          <div className="flex justify-between py-3 font-semibold text-gray-900 text-lg">
            <p>Total</p>
            <p>₹{total}</p>
          </div>
          <button
            className="w-full bg-pink-600 text-white py-3 rounded-full mt-4 font-medium hover:bg-pink-700 transition"
            onClick={() => nav("/order")}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
