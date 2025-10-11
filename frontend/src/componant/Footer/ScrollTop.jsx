import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollTop = () => {
  const [visible, setVisible] = useState(false);

  // Show button after scrolling 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {visible && (
        <button
          onClick={scrollTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform duration-300 z-50 animate-bounce"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default ScrollTop;
