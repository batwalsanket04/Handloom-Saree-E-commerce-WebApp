import React, { useContext, useState, useMemo } from "react";
import { context } from "../../Context/StoreContext";
import { ShoppingCart } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Collection = () => {
  const { filteredSarees, addToCart, url } = useContext(context);
  const [filter, setFilter] = useState("All");

  /* ---------------- CATEGORY LIST ---------------- */
  const categories = useMemo(() => {
    const cats = filteredSarees.map(s => s.category || "All");
    return ["All", ...new Set(cats)];
  }, [filteredSarees]);

  /* ---------------- FINAL FILTER (SEARCH + CATEGORY) ---------------- */
  const finalSarees = useMemo(() => {
    if (filter === "All") return filteredSarees;
    return filteredSarees.filter(
      s => (s.category || "").toLowerCase() === filter.toLowerCase()
    );
  }, [filter, filteredSarees]);

  const capitalizeFirst = str =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } },
    ],
  };

  return (
    <div className="pt-[100px] bg-gray-50 min-h-screen">

      {/* HERO */}
      <div className="text-center py-12 bg-gradient-to-r from-pink-50 to-pink-100">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-700">
          Our Exclusive Saree Collection
        </h1>
        <p className="text-gray-600 mt-3">
          Elegant silks, trendy cottons, and timeless designs.
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap justify-center gap-4 mt-10 mb-8 px-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full border transition ${
              filter === cat
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-pink-100"
            }`}
          >
            {capitalizeFirst(cat)}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {finalSarees.length === 0 && (
        <p className="text-center text-gray-500">
          No sarees found
        </p>
      )}

      {/* SLIDER */}
      <Slider {...settings}>
        {finalSarees.map(s => (
          <div key={s._id} className="p-2 w-full">
            <div className="relative group bg-white rounded-xl shadow overflow-hidden">
              <img
                src={s.image ? `${url}/images/${s.image}` : "/placeholder.jpg"}
                alt={s.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition"></div>
                <button
                  onClick={() => addToCart(s._id)}
                  className="relative bg-pink-600 p-3 rounded-full text-white hover:bg-pink-800"
                >
                  <ShoppingCart size={20} />
                </button>
              </div>

              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold">{s.name}</h3>
                <p className="text-pink-600 font-bold mt-2">₹{s.price}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Collection;
