import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import {context} from "../../Context/StoreContext";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";



const SareeItem = ({ id, name, price, description, img, category }) => {
 
  const {cartItem,addToCart,removeFromCart}=useContext(context);
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative w-full h-60">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover" 
        />
        {
          !cartItem[id]?(
            <button className="absolute bottom-2 right-2 bg-white text-gray-500 p-2 rounded-full shadow-md hover:bg-gray-200 transition" 
            onClick={()=>addToCart(id)}><i className="fa-solid fa-plus"><FaPlus/></i></button>
          ):(
            <div  className="absolute bottom-2 right-2 bg-white rounded-full shadow-md flex items-center gap-3 px-3 py-1">
              
            <button className="text-red-500 hover:text-red-700" onClick={()=>removeFromCart(id)}><i className="fa-solid fa-minus"><FaMinus/></i></button>
            <p>{cartItem[id]}</p>
            <button  className="text-green-500 hover:text-green-700" onClick={()=>addToCart(id)}><i className="fa-solid fa-plus"><FaPlus/></i></button>
            </div>
          )
        }
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name + Category */}
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        {/* <p className="text-sm text-pink-600 font-medium">{category}</p> */}

        {/* Rating */}
       <div className="flex items-center space-x-1 text-yellow-400 mt-2">
  <FaStar />
  <FaStar />
  <FaStar />
  <FaStar />
  <FaStarHalfAlt />
</div>


        {/* Description */}
        <p className="text-sm text-gray-600 mt-2 flex-1">{description}</p>

        {/* Price + Button */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-pink-600">{price}</span>
          
         
        </div>
      </div>
    </div>
  );
};

export default SareeItem;
