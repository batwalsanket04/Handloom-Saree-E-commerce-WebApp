import React, { useContext } from 'react';
import { context } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";


const Cart = () => {
  const nav=useNavigate();
  const { cartItem, SareeList2, removeFromCart,getTotalCartAmount} = useContext(context);

  return (
    <div className="cart pt-[100px] min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
        {/* Header row */}
        <div className="grid grid-cols-6 gap-4 font-semibold border-b-2 border-pink-200 pb-3 text-gray-700">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        {/* Cart items */}
        <div className="divide-y divide-pink-100 mt-3">
          {SareeList2.map((val) => {
            const quantity = Number(cartItem[val.id]) || 0;
                        console.log(quantity);

            if (quantity === 0) return null;
            const total = val.price * quantity;
         

            return (
              <div
                key={val.id}
                className="grid grid-cols-6 gap-4 items-center py-4 hover:bg-pink-50 rounded-lg transition duration-200"
              >
                <img
                  src={val.img}
                  alt={val.name}
                  className="w-16 h-16 object-cover rounded-lg border border-pink-100"
                />
                <p className="text-gray-800 font-medium">{val.name}</p>
                <p className="text-gray-600">{val.price}</p>
                <p className="text-gray-700 font-semibold">{quantity}</p>
                <p className="text-gray-800 font-semibold">₹{total}</p>
                <button
                  className="text-pink-600 font-bold hover:text-pink-800 transition"
                  onClick={() => removeFromCart(val.id)}
                >
                  <i className="fa-solid fa-trash"><FaTrash/></i>
                </button>
              </div>
            );
          })}
        </div>
        {/* Empty cart message */}
        {SareeList2.filter(val => Number(cartItem[val.id]) > 0).length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Your cart is empty
          </div>
        )}
         
      </div>
      {/* Cart Bottom Section */}
<div className="max-w-6xl mx-auto mt-8">
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
            <p>₹{getTotalCartAmount()===0?0:180}</p>
          </div>
          <hr />
          <div className="flex justify-between py-3 font-semibold text-gray-900 text-lg">
            <p>Total</p>
            <p>₹{getTotalCartAmount()==0?0:getTotalCartAmount()+180}</p>
          </div>

    <button className="w-full bg-pink-600 text-white py-3 rounded-full mt-4 font-medium hover:bg-pink-700 transition" onClick={()=>nav('/order')}>
      PROCEED TO CHECK
    </button>
  </div>
</div>

{/* Promo Code Section */}
<div className="max-w-6xl mx-auto mt-6">
  <div className="p-6 bg-white shadow-md rounded-xl">
    <p className="text-gray-700 mb-3 font-medium">
      If you have a promo code, enter it here:
    </p>
    <div className="flex gap-3">
      <input
        type="text"
        placeholder="Enter promo code"
        className="flex-1 border border-pink-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-pink-400"
      />
      <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition">
        Apply
      </button>
    </div>
  </div>
</div>

       
    </div>
  );
};

export default Cart;
