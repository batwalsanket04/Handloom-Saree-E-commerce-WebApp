import React, { useContext, useState } from "react";
import { context } from "../../Context/StoreContext";
import { ShoppingCart } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Collection = () => {
  const { sarees, addToCart, url } = useContext(context);
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...new Set(sarees.map(s => s.category || "All"))];
  const filteredSarees = filter === "All" 
    ? sarees 
    : sarees.filter(s => (s.category || "").toLowerCase() === filter.toLowerCase());

  const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="pt-[100px] bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="text-center py-12 bg-gradient-to-r from-pink-50 to-pink-100">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-700">Our Exclusive Saree Collection</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Elegant silks, trendy cottons, and timeless designs.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mt-10 mb-8 px-6">
        {categories.map(cat => (
          <button
            key={cat}
            className={`px-6 py-2 rounded-full border transition ${
              filter === cat ? "bg-pink-600 text-white border-pink-600" : "bg-white text-gray-700 border-gray-300 hover:bg-pink-100"
            }`}
            onClick={() => setFilter(cat)}
          >
            {capitalizeFirst(cat)}
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <Slider {...settings}>
          {filteredSarees.map(s => (
            <div key={s._id} className="p-2">
              <div className="relative group bg-white rounded-xl shadow overflow-hidden">
                <img
                  src={s.image ? `${url}/images/${s.image}` : "/placeholder.jpg"}
                  alt={s.name}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity opacity-0 group-hover:opacity-50 rounded-xl"></div>
                  <button
                    onClick={() => addToCart(s._id)}
                    className="relative bg-pink-600 p-3 rounded-full text-white hover:bg-pink-800 transition"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">{s.name}</h3>
                  <p className="text-pink-600 font-bold mt-2">₹{s.price}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Collection;
