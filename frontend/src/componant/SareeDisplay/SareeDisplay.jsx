import React, { useContext } from "react";
import { context } from "../../Context/StoreContext";
import SareeItem from "../SareeItem/SareeItem";

const SareeDisplay = ({ category }) => {
  const { sarees } = useContext(context);

  // ✅ Filter sarees by selected category
  const filteredSarees =
    category === "All"
      ? sarees
      : sarees.filter(
          (s) => s.category?.toLowerCase() === category.toLowerCase()
        );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {filteredSarees.length > 0 ? (
        filteredSarees.map((s) => (
          <SareeItem
            key={s._id}
            _id={s._id}
            name={s.name}
            price={s.price}
            description={s.description}
            image={s.image}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-4 mt-10">
          No items found in this category.
        </p>
      )}
    </div>
  );
};

export default SareeDisplay;
