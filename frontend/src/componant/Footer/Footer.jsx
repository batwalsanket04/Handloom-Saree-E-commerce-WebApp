import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 mt-10" id="contact">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {/* Left Section */}
        <div>
          <h1 className="text-pink-500 ">Handloom sarees</h1>
          <p className="text-sm leading-6 text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
            numquam ab consequatur optio reprehenderit ipsam.
          </p>
          <div className="flex gap-4 mt-6 text-2xl">
            <NavLink
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500 transition-colors duration-300"
            >
              <i className="fa-brands fa-facebook"></i>
            </NavLink>
            <NavLink
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500 transition-colors duration-300"
            >
              <i className="fa-brands fa-github"></i>
            </NavLink>
            <NavLink
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500 transition-colors duration-300"
            >
              <i className="fa-brands fa-linkedin-in"></i>
            </NavLink>
          </div>
        </div>

        {/* Center Section */}
        <div>
          <h2 className="font-semibold mb-4 text-white text-lg tracking-wide">
            SHOP
          </h2>
          <ul className="space-y-3">
            <li>
              <NavLink
                to="/"
                className="hover:text-pink-500 transition-colors duration-300"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="hover:text-pink-500 transition-colors duration-300"
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/delivery"
                className="hover:text-pink-500 transition-colors duration-300"
              >
                Delivery
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/privacy"
                className="hover:text-pink-500 transition-colors duration-300"
              >
                Privacy Policy
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <h2 className="font-semibold mb-4 text-white text-lg tracking-wide">
            GET IN TOUCH
          </h2>
          <ul className="space-y-3 text-gray-400">
            <li className="hover:text-pink-500 transition-colors duration-300">
              📞 +91 8805857546
            </li>
            <li className="hover:text-pink-500 transition-colors duration-300">
              📧 batwalsanket@gmail.com
            </li>
          </ul>
          <NavLink
            href="https://wa.me/918805857546" // Replace with your number
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center  mt-4 gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2 rounded-full text-white text-sm font-medium shadow-md hover:scale-105 transition-transform"
          >
            <i className="fa-brands fa-whatsapp text-lg"></i>
            WhatsApp Us
          </NavLink>
        </div>
      </div>

      {/* Footer Bottom */}
      <hr className="border-gray-700" />
      <p className="text-center py-5 text-gray-400 text-sm hover:text-pink-500 transition-colors duration-300">
        © {new Date().getFullYear()} All Rights Reserved | Designed by Sanket
        Batwal
      </p>
    </footer>
  );
};

export default Footer;
