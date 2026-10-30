import React, { useEffect, useState } from "react";
import { Categories } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const About = () => {
  const nav = useNavigate();
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get("/about");
        if (response.data.success && response.data.about) {
          setAbout(response.data.about);
          setError(null);
        } else {
          throw new Error(response.data.message || "Invalid response format");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load About content");
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) return <section className="pt-[100px] pb-20 text-center"><h2 className="text-2xl font-semibold text-gray-600">Loading About...</h2></section>;
  if (error) return <section className="pt-[100px] pb-20 text-center"><h2 className="text-2xl font-semibold text-red-600 mb-4">Failed to Load About</h2><p className="text-gray-600 mb-4">{error}</p><button onClick={() => window.location.reload()} className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition">Retry</button></section>;
  if (!about) return <section className="pt-[100px] pb-20 text-center"><h2 className="text-2xl font-semibold text-gray-600">No About content available</h2></section>;

  return (
    <section className="pt-[100px] pb-20 bg-gradient-to-b from-pink-50 to-rose-100" id="about">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <img src={about.image ? `${about.image}?t=${Date.now()}` : Categories.aboutus} alt={about.title || "Elegant Drapes Saree Collection"} className="rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500 w-full max-w-md" />
        </div>
        <div className="text-gray-800">
          {about.subtitle && <h3 className="text-xl font-medium text-pink-600 mb-2">{about.subtitle}</h3>}
          <h2 className="text-5xl font-extrabold text-pink-700 mb-6">{about.title || "About Us"}</h2>
          <div className="space-y-4">
            {about.description1 && <p className="text-lg leading-relaxed">{about.description1}</p>}
            {about.description2 && <p className="text-lg leading-relaxed">{about.description2}</p>}
            {about.description3 && <p className="text-lg leading-relaxed">{about.description3}</p>}
            {about.description4 && <p className="text-lg leading-relaxed">{about.description4}</p>}
          </div>
          {about.buttonText && about.buttonLink && <button className="mt-8 bg-pink-600 text-white px-10 py-3 rounded-full shadow-md hover:bg-pink-700 hover:shadow-lg transition-all duration-300" onClick={() => nav(about.buttonLink)}>{about.buttonText}</button>}
        </div>
      </div>
    </section>
  );
};
export default About;