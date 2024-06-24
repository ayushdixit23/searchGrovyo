"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import FullLogo from "../assets/FullLogo.png";
import anime from "animejs";
import axios from "axios";
import Aos from "aos";
import "aos/dist/aos.css";

function Page({ finishLoading }) {
  const [isMounted, setIsMounted] = useState(false);
  const animate = () => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });
    loader
      .add({
        targets: "#logo",
        delay: 0,
        scale: 1,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo",
        delay: 0,
        scale: 0.25,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo",
        delay: 0,
        scale: 1,
        duration: 500,
        easing: "easeInOutExpo",
      });
  };
  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 20);
    animate();
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    Aos.init();
  }, []);
  const [cimage, setCimage] = useState({
    p1: "",
    p2: "",
    p3: "",
    p4: "",
    p5: "",
    p6: "",
    p7: "",
    p8: "",
    p9: "",
    p10: "",
  });
  const getCommunity = async () => {
    try {
      const res = await axios.get("https://work.grovyo.xyz/api/v1/fetchCom");
      console.log(res.data);
      setCimage({
        ...cimage,
        p1: res.data.community[0].image,
        p2: res.data.community[1].image,
        p3: res.data.community[2].image,
        p4: res.data.community[3].image,
        p5: res.data.community[4].image,
        p6: res.data.community[5].image,
        p7: res.data.community[6].image,
        p8: res.data.community[7].image,
        p9: res.data.community[8].image,
        p10: res.data.community[9].image,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCommunity();
  }, []);
  return (
    <div
      isMounted={isMounted}
      className="  h-screen w-screen bg-gradient-to-r from-[#000000] via-[#111827] to-[#000000]"
    >
      <div
        className={`
          h-[100%] w-full sm:bg-BgC bg-contain flex flex-col bg-center bg-no-repeat items-center
            `}
      >
        <div className="absolute w-full flex h-[100%] sm:grid-cols-2 sm:grid z-0">
          <div className="w-[100%] pn:max-sm:w-[50%] h-[100%] relative">
            <div
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-once="true"
              data-aos-easing="ease-in-out"
              data-aos="zoom-in"
              className="animate-bounce h-[35px] w-[35px] pn:max-sm:hidden scale-125 rounded-xl transition delay-150 duration-300 ease-in-out sm:mt-10 pn:max-sm:ml-[40%] sm:ml-[40%] hover:scale-110 hover:bg-red-400 bg-slate-200"
            >
              <img
                className="w-[35px] pn:max-sm:hidden h-[35px] object-cover scale-125 rounded-2xl"
                alt="dp"
                src={cimage.p1}
              />
            </div>
            <div
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-once="true"
              data-aos-easing="ease-in-out"
              data-aos="zoom-in"
              className="animate-bounce h-[35px] pn:max-sm:hidden w-[35px] rounded-3xl mt-20 ml-[10%] hover:scale-110 hover:bg-red-400 bg-slate-200"
            >
              <img
                className="w-[35px] pn:max-sm:hidden h-[35px] object-cover scale-125 rounded-2xl"
                alt="dp"
                src={cimage.p2}
              />
            </div>
            <div
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-once="true"
              data-aos-easing="ease-in-out"
              data-aos="zoom-in"
              className="animate-bounce h-[35px] pn:max-sm:hidden w-[35px] rounded-3xl mt-20 ml-[20%]  hover:scale-150 scale-125 hover:bg-red-400 bg-slate-200"
            >
              {" "}
              <img
                className="w-[35px] pn:max-sm:hidden h-[35px] object-cover hover:scale-150 scale-125 rounded-2xl"
                alt="dp"
                src={cimage.p3}
              />
            </div>
            <div
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-once="true"
              data-aos-easing="ease-in-out"
              data-aos="zoom-in"
              className="animate-bounce h-[35px] pn:max-sm:hidden w-[35px] rounded-3xl mt-20 ml-[10%] hover:scale-110 hover:bg-red-400 bg-slate-200"
            >
              {" "}
              <img
                className="w-[35px] pn:max-sm:hidden h-[35px] object-cover scale-125 rounded-2xl"
                alt="dp"
                src={cimage.p4}
              />
            </div>
            <div
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-once="true"
              data-aos-easing="ease-in-out"
              data-aos="zoom-in"
              className="animate-bounce h-[35px] pn:max-sm:hidden w-[35px] rounded-3xl sm:mt-20 ml-[37%] hover:scale-110 hover:bg-red-400 bg-slate-200"
            >
              {" "}
              <img
                className="w-[35px] pn:max-sm:hidden h-[35px] object-cover scale-125 rounded-2xl"
                alt="dp"
                src={cimage.p5}
              />
            </div>
          </div>
          <div className="w-[100%] pn:max-sm:w-[50%] relative h-[100%] ">
            <div
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-once="true"
              data-aos-easing="ease-in-out"
              data-aos="zoom-in"
              className="animate-bounce h-[35px] pn:max-sm:hidden w-[35px] rounded-3xl mt-10 ml-[28%] hover:scale-110 hover:bg-red-400 bg-slate-200"
            >
              <img
                className="w-[35px] pn:max-sm:hidden h-[35px] object-cover scale-125 rounded-2xl"
                alt="dp"
                src={cimage.p6}
              />
            </div>
            <div
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-once="true"
              data-aos-easing="ease-in-out"
              data-aos="zoom-in"
              className="animate-bounce h-[35px] pn:max-sm:hidden w-[35px] rounded-3xl mt-20 ml-[60%] hover:scale-110 hover:bg-red-400 bg-slate-200"
            >
              {" "}
              <img
                className="w-[35px] pn:max-sm:hidden h-[35px] object-cover scale-125 rounded-2xl"
                alt="dp"
                src={cimage.p7}
              />
            </div>
            <div
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-once="true"
              data-aos-easing="ease-in-out"
              data-aos="zoom-in"
              className="animate-bounce h-[35px] pn:max-sm:hidden w-[35px] rounded-3xl mt-20 ml-[60%] hover:scale-110 hover:bg-red-400 bg-slate-200"
            >
              {" "}
              <img
                className="w-[35px] pn:max-sm:hidden h-[35px] object-cover scale-125 rounded-2xl"
                alt="dp"
                src={cimage.p8}
              />
            </div>
            <div
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-once="true"
              data-aos-easing="ease-in-out"
              data-aos="zoom-in"
              className="animate-bounce h-[35px] pn:max-sm:hidden w-[35px] rounded-3xl mt-20 ml-[69%] hover:scale-110 hover:bg-red-400 bg-slate-200"
            >
              {" "}
              <img
                className="w-[35px] pn:max-sm:hidden h-[35px] object-cover scale-125 rounded-2xl"
                alt="dp"
                src={cimage.p9}
              />
            </div>
            <div
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-once="true"
              data-aos-easing="ease-in-out"
              data-aos="zoom-in"
              className="animate-bounce h-[35px] pn:max-sm:hidden w-[35px] rounded-3xl mt-10 ml-[29%] hover:scale-110 hover:bg-red-400 bg-slate-200"
            >
              {" "}
              <img
                className="w-[35px] pn:max-sm:hidden h-[35px] object-cover scale-125 rounded-2xl"
                alt="dp"
                src={cimage.p10}
              />
            </div>
          </div>
        </div>
        <div className="flex-col w-full flex justify-center items-center pn:max-sm:p-2 h-[50%] mt-[10%] z-10">
          <div>
            <Image
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-once="true"
              data-aos-easing="ease-in-out"
              data-aos="zoom-in"
              id="logo"
              src={FullLogo}
              className="w-[355px] pn:max-sm:w-[200px]"
            />
          </div>
          <div
            data-aos-delay="0"
            data-aos-duration="500"
            data-aos-once="true"
            data-aos-easing="ease-in-out"
            data-aos="zoom-in"
            className="text-white font-bold lg:text-[37px] md:text-[32px] duration-75 sm:text-[27px] vs:text-[22px] pn:text-[17px] pn:max-sm:w-[100%] w-[40%] text-center leading-normal"
          >
            Transforming Your Ideas Into Reality{" "}
          </div>
          <div
            data-aos-delay="0"
            data-aos-duration="500"
            data-aos-once="true"
            data-aos-easing="ease-in-out"
            data-aos="zoom-in"
            className="text-[#8C96A8] text-[20px] w-[40%] pn:max-sm:w-[100%] text-center"
          >
            Create communities, gather your audience, and showcase your
            products—all in one dynamic space.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
