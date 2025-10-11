 import React, { createContext, useEffect, useState } from 'react'
 import { SareeList2 } from '../assets/assets'
 
 export const context=createContext(null)

 const StoreContext = ({children}) => {

  const [cartItem,setCartItem]=useState({});

  const addToCart=(itemId)=>
  {
    if(!cartItem[itemId]){
      setCartItem((prev)=>({...prev,[itemId]:1}))
    }else
    {
      setCartItem((prev=>({...prev,[itemId]:prev[itemId]+1})))
    }
  }

  const removeFromCart=(itemId)=>
  {
    setCartItem((prev)=>({...prev,[itemId]:prev[itemId]-1}))
  }

  const getTotalCartAmount=()=>
  {
    let totalAmount=0;

    for(const item in cartItem)
    {
      if(cartItem[item]>0)
      {
      let iteminfo=SareeList2.find((product)=>product.id===(item))
      totalAmount += (iteminfo.price) * cartItem[item];
       
      }
  }
  return totalAmount;

  }

    const contextValue={
      SareeList2,
      cartItem,
      setCartItem,
      addToCart,
      removeFromCart,
      getTotalCartAmount
    }
  
  useEffect(()=>{
    console.log(cartItem);
    console.log(typeof(cartItem))
  },[cartItem])

   return (
     <div>
        <context.Provider value={contextValue}>
              {children}
        </context.Provider>
       
     </div>
   )
 }
 
 export default StoreContext
 