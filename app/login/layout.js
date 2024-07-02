"use client";
import React, { useEffect, useState } from "react";
import login1 from "../assets/login-1.png"
import login2 from "../assets/login-2.png"
import login3 from "../assets/login-3.png"
import Image from "next/image";
import Link from "next/link";

export default function loginLayout({ children }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [{ msg: "Build, Engage, Earn: A Step-by-Step Guide to Build Your Thriving Grovyo Community", img: login1 }, { msg: "Build, Engage, Earn: A Step-by-Step Guide to Build Your Thriving Grovyo Community", img: login2 }, { msg: "Build, Engage, Earn: A Step-by-Step Guide to Build Your Thriving Grovyo Community", img: login3 }];

  const nextSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-screen w-screen dark:bg-loginbg dark:bg-contain dark:bg-center bg-lightlogin dark:bg-[#131619] flex flex-row-reverse pn:max-sm:flex-col">
      <div className="w-[50%] h-full flex py-20 justify-end items-center pn:max-sm:hidden">
        <div className="overflow-hidden w-[100%] bg-lightpiclogin dark:bg-piclogin bg-center bg-cover rounded-xl flex justify-center items-center flex-col h-[100vh] pt-36">
          <div
            className="relative  flex transition-transform duration-500 transform"
            style={{
              transform: `translateX(-${activeSlide * 100}%)`,
            }}
          >
            {slides.map((slide, index) => (

              <div
                key={index}
                className="h-[50vh] w-full flex-col flex-shrink-0 flex items-center justify-center text-black text-2xl"
              >
                {/* <div className="mb-10 font-semibold text-3xl max-w-[80%] leading-snug text-center text-white">{slide.msg}</div> */}
                <div className="flex justify-center items-center">

                  <Image priority src={slide.img} alt="hlo" className={` ${index === 0 ? "relative -left-12" : ""} ${index === 2 ? "max-w-[400px]" : "max-w-[600px]"}`} />

                </div>
              </div>

            ))}
          </div>

          <div className="flex justify-center pt-[130px]">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 duration-500 rounded-full mx-2 ${index === activeSlide ? 'bg-blue-500' : 'bg-white'
                  }`}
              ></div>
            ))}
          </div>

        </div>
      </div>
      <div className="w-[50%] h-[100%] pn:max-sm:w-[100%] pn:max-sm:h-[100%]">
        {children}
      </div>
      <div className="flex absolute bottom-0 sm:bottom-2 w-[100%] flex-wrap md:justify-end justify-start items-center dark:text-white text-[#414141] gap-4 text-[12px] select-none">
        <div className="flex sm:bottom-3 px-6 pn:max-sm:w-full flex-wrap justify-center items-center  dark:text-white text-[#414141] gap-4 text-[12px] select-none">
          <Link href={"../terms"}>T&C</Link>
          <Link href={"../privacy"}>Privacy</Link>
          <Link href={"../contact"}>Contact Us</Link>
          <Link href={"/about"}>About</Link>
          <Link href={"/requestdata"}>Request Data</Link>
          <Link href={"/deleterequest"}>Delete Request</Link>
          <Link href={"../shipping"}>Shipping</Link>
          <div title="Coming soon ..." className="cursor-pointer">Request API Access</div>
          <Link href={"../cancellation"}>Cancellation</Link>
          <Link href={"../return"}>Return Policy</Link>
        </div>
      </div>
    </div>
  );
}
