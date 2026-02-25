import React from "react";
import { SareeList } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="w-[99%] m-auto">
      <h1 className="text-2xl p-3 w-full sm:text-2xl sm:mt-[50px] md:text-6xl md:mt-[20px] lg:text-4xl xl:text-5xl xl:mt-20 font-bold text-pink-600 drop-shadow-lg 2xl:text-7xl">
        Explore our collection
      </h1>

      <p className="text-base sm:text-lg max-w-[100%] mx-auto mb-6 leading-relaxed text-justify p-3 text-gray-700">
        Explore our collection of crafted pieces made to match your style and story.
      </p>

      <div className="explore-list flex gap-5 px-6 py-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">

  {/* 🔹 ALL BUTTON */}
  <div
    onClick={() => setCategory("All")}
    className={`flex-shrink-0 w-[180px] h-[230px]   bg-white shadow rounded-2xl overflow-hidden cursor-pointer snap-center transition-transform duration-300 hover:scale-105 ${
      category === "All" ? "border-2 border-pink-600 shadow-lg" : ""
    }`}
  >
    <div className="w-full h-[140px] flex items-center justify-center bg-pink-50">
      <span className="text-4xl font-bold text-pink-600">All</span>
    </div>
    <div className="p-2 flex justify-center items-center h-[90px]">
      <p className="font-semibold text-lg text-gray-800">All Sarees</p>
    </div>
  </div>

  {/* 🔹 CATEGORY BUTTONS */}
  {SareeList.map((val, index) => (
    <div
      key={index}
      onClick={() =>
        setCategory(prev =>
          prev === val.category ? "All" : val.category
        )
      }
      className={`flex-shrink-0 w-[180px] h-[230px]   bg-white shadow rounded-2xl overflow-hidden cursor-pointer snap-center transition-transform duration-300 hover:scale-105 ${
        category === val.category ? "border-2 border-pink-600 shadow-lg" : ""
      }`}
    >
      <img
        src={val.Menuimg}
        alt={val.menuName}
        className="w-full h-[140px] object-cover"
      />
      <div className="p-2 flex justify-center items-center h-[90px]">
        <p className="font-semibold text-lg text-gray-800">
          {val.menuName}
        </p>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default ExploreMenu;
