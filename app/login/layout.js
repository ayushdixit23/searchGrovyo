"use client";
import React, { useEffect, useState } from "react";
import Sign from "../login/number/page";
// import coms from "../assets/Images/coms.png";
// import prosit from "../assets/Images/prosit.png";
// import topic from "../assets/Images/topic.png";
import Image from "next/image";

export default function loginLayout({ children }) {
  const [activeSlide, setActiveSlide] = useState(0);
  // const slides = [{ img: coms }, { img: prosit }, { img: topic }];

  // const nextSlide = () => {
  //   setActiveSlide((prevSlide) => (prevSlide + 1) % slides.length);
  // };

  // useEffect(() => {
  //   const interval = setInterval(nextSlide, 3000); // Auto-play every 3 seconds

  //   return () => {
  //     clearInterval(interval); // Cleanup on unmount
  //   };
  // }, []);

  return (
    <div className="h-screen w-screen bg-white flex pn:max-sm:flex-col">
      <div className="w-[50%] h-full flex py-20 justify-end items-center pn:max-sm:hidden">
        {/* <div className="overflow-hidden w-full bg-[#0075FF] h-screen pt-36">
          <div
            className="relative flex transition-transform duration-500 transform"
            style={{
              transform: `translateX(-${activeSlide * 100}%)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="h-50vh w-full flex-shrink-0 bg-lightgray flex items-center justify-center text-black text-2xl"
              >
                <Image priority src={slide.img} alt="hlo" />
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-24">
            {slides.map((_, index) => (
              <div
                key={index}
                className={` mx-2 ring-2 ring-white p-1 rounded-full shadow-lg duration-100 ${index === activeSlide ? "bg-[#ffffff00] " : "bg-white"
                  }`}
              >
                <div
                  key={index}
                  className={`h-1 rounded-full duration-100 ${index === activeSlide ? "bg-[#ffffff] w-4" : "bg-white w-2"
                    }`}
                ></div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
      <div className="w-[50%] h-[100%] flex justify-center items-center pn:max-sm:w-[100%] pn:max-sm:h-[100%]">
        {children}
      </div>
    </div>
  );
}
