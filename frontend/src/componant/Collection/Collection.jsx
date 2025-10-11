import React, { useContext, useState } from "react";
import { context } from "../../Context/StoreContext";
import { ShoppingCart } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Collection = () => {
  const { SareeList2, addToCart } = useContext(context);
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...new Set(SareeList2.map((s) => s.category))];
  const displayedCategories = categories.slice(0, categories.length - 1);

  const filteredSarees =
    filter === "All"
      ? SareeList2
      : SareeList2.filter((saree) => saree.category === filter);

  const capitalizeFirst = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // Carousel settings for horizontal autoplay scroll
  const settings = {
    dots: false, // remove dots
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true, // enable autoplay
    autoplaySpeed: 2000, // scroll every 2 seconds
    cssEase: "linear", // smooth continuous scroll
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="pt-[100px] bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-pink-50 to-pink-100">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-700">
          Our Exclusive Saree Collection
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Discover a variety of handpicked sarees, curated just for you. Choose
          from elegant silks, trendy cottons, and timeless designs.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mt-10 mb-8 px-6">
        {displayedCategories.map((cat) => (
          <button
            key={cat}
            className={`px-6 py-2 rounded-full border transition ${
              filter === cat
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-pink-100"
            }`}
            onClick={() => setFilter(cat)}
          >
            {capitalizeFirst(cat)}
          </button>
        ))}
      </div>

      {/* Carousel Section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <Slider {...settings}>
          {filteredSarees.map((saree) => (
            <div key={saree.id} className="p-2">
              <div className="relative group bg-white rounded-xl shadow overflow-hidden">
                <img
                  src={saree.img}
                  alt={saree.name}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity opacity-0 group-hover:opacity-50 rounded-xl"></div>
                  <button
                    onClick={() => addToCart(saree.id)}
                    className="relative bg-pink-600 p-3 rounded-full text-white hover:bg-pink-800 transition"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>

                {/* Info Section */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {saree.name}
                  </h3>
                  <p className="text-pink-600 font-bold mt-2">
                    {saree.price}
                  </p>
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
