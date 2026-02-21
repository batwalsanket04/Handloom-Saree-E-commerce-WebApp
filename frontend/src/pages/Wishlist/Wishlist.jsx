import React, { useContext } from "react";
import { context } from "../../Context/StoreContext";
import SareeItem from "../../componant/SareeItem/SareeItem";

const Wishlist = () => {
  const { wishlist } = useContext(context);

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>
      {wishlist && wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((s) => (
            <SareeItem
              key={s._id || s}
              _id={s._id || s}
              name={s.name}
              price={s.price}
              description={s.description}
              image={s.image}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;
