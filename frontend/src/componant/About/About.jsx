import React, { useEffect, useState } from "react";
import { Categories } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const About = () => {

  const nav = useNavigate();

  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchAbout = async () => {

      try {

        const response = await axios.get(
          "http://localhost:4000/api/about"
        );

        console.log("ABOUT DATA:", response.data.data);

        setAbout(response.data.data);

      } catch (error) {

        console.log(
          "About Fetch Error:",
          error.response?.data || error.message
        );

      } finally {

        setLoading(false);

      }

    };


    fetchAbout();

  }, []);



  if (loading) {
    return (
      <section className="pt-[100px] pb-20 text-center">
        <h2 className="text-2xl font-semibold">
          Loading About...
        </h2>
      </section>
    );
  }



  return (

    <section
      className="pt-[100px] pb-20 bg-gradient-to-b from-pink-50 to-rose-100"
      id="about"
    >

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">


        {/* LEFT IMAGE */}

        <div className="flex justify-center">

          <img

            src={
              about?.image
                ? `${about.image}?t=${Date.now()}`
                : Categories.aboutus
            }

            alt="Elegant Drapes Saree Collection"

            className="
              rounded-2xl 
              shadow-xl 
              hover:scale-105 
              transition-transform 
              duration-500
              w-full
              max-w-md
            "

          />

        </div>



        {/* RIGHT CONTENT */}

        <div className="text-gray-800">


          <h2 className="text-5xl font-extrabold text-pink-700 mb-6">

            {about?.title || "About Us"}

          </h2>



          <p className="text-lg leading-relaxed mb-4">

            {about?.paragraph1}

          </p>



          <p className="text-lg leading-relaxed mb-4">

            {about?.paragraph2}

          </p>



          <p className="text-lg leading-relaxed mb-4">

            {about?.paragraph3}

          </p>



          <p className="text-lg leading-relaxed">

            {about?.paragraph4}

          </p>




          <button

            className="
              mt-8 
              bg-pink-600 
              text-white 
              px-10 
              py-3 
              rounded-full 
              shadow-md 
              hover:bg-pink-700 
              hover:shadow-lg 
              transition-all 
              duration-300
            "

            onClick={() => nav("/collection")}

          >

            Explore Collection

          </button>



        </div>


      </div>


    </section>

  );

};


export default About;