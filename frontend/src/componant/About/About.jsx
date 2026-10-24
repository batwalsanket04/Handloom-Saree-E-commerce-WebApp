import React from "react";
import { Categories } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const About = () => {
const nav=useNavigate();

  return (
    <section className="pt-[100px] pb-20 bg-gradient-to-b from-pink-50 to-rose-100" id="about">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Image */}
        <div className="flex justify-center">
          <img
            src={Categories.aboutus}
            alt="Elegant Drapes Saree Collection"
            className="rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Text */}
        <div className="text-gray-800">
          <h2 className="text-5xl font-extrabold text-pink-700 mb-6">
            About <span className="text-pink-700">Us</span>
          </h2>

          <p className="text-lg leading-relaxed mb-4">
            Welcome to <strong>Elegant Drapes</strong> — where every thread tells
            a story of tradition, artistry, and timeless elegance.
          </p>

          <p className="text-lg leading-relaxed mb-4">
            Our passion lies in celebrating India’s rich weaving heritage. Each saree in our
            collection is handpicked from skilled artisans who blend{" "}
            <strong>age-old craftsmanship</strong> with{" "}
            <strong>modern sophistication</strong>.
          </p>

          <p className="text-lg leading-relaxed mb-4">
            From vibrant <strong>Paithanis</strong> to graceful silks and
            minimal cottons — every drape we offer reflects culture,
            confidence, and class.
          </p>

          <p className="text-lg leading-relaxed">
            We’re on a mission to empower local weavers and promote
            <strong> sustainable fashion</strong> — ensuring that every saree you
            wear carries a legacy of beauty and purpose. ✨
          </p>

          <button className="mt-8 bg-pink-600 text-white px-10 py-3 rounded-full shadow-md hover:bg-pink-700 hover:shadow-lg transition-all duration-300" onClick={()=>nav('/collection')}>
            Explore Collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
