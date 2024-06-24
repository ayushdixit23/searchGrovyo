"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Switcher() {
  const [click, setClick] = useState(false);

  useEffect(() => {
    const savedClick = sessionStorage.getItem("click");
    setClick(savedClick === "true");

    const body = document.querySelector("body");
    if (savedClick === "true") {
      body.classList.add("click");
    } else {
      body.classList.remove("click");
    }
  }, []);
  useEffect(() => {
    sessionStorage.setItem("click", click.toString());

    const body = document.querySelector("body");
    if (click) {
      body.classList.add("click");
    } else {
      body.classList.remove("click");
    }
  }, [click]);

  const toggle = () => {
    setClick(!click);
  };
  return (
    <div className="pn:max-sm:h-[6vh] h-[8vh] bg-white dark:bg-bluedark shadow-sm z-10 pn:max-sm:items-center 
     pn:max-sm:w-[100%] pn:max-sm:mt-[6vh] sm:max-md:px-1 sm:max-md:rounded-r-3xl md:w-[388px] pn:max-md:justify-start absolute md:fixed flex flex-row items-center">
      {/* // New for you */}
      <motion.div
        //initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href={"/main/feed/newForYou"}
          onClick={() => {
            setClick(false);
          }}
          className={`${
            click === false
              ? "text-[14px] pn:max-sm:text-[12px] dark:text-white  text-[#171717] dark:bg-graydark p-3 bg-[#f5f5f5] rounded-xl font-semibold mx-2 hover:text-black transition-all duration-300"
              : "text-[14px] pn:max-sm:text-[12px] text-[#727272] dark:hover:text-white font-medium mx-2 hover:text-black border-b-0 transition-all duration-300"
          }`}
        >
          New for you
        </Link>
      </motion.div>
      {/* //Community */}
      <motion.div
        // initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href={"/main/feed/community"}
          onClick={() => {
            setClick(true);
          }}
          className={`${
            click === true
              ? "text-[14px] pn:max-sm:text-[12px] p-3 dark:text-white  dark:bg-graydark  bg-[#f5f5f5] rounded-xl text-[#171717] font-semibold mx-2 hover:text-black  transition-all duration-300"
              : "text-[14px] pn:max-sm:text-[12px] text-[#727272] dark:hover:text-white  font-medium mx-2 hover:text-black border-b-0 transition-all duration-300"
          }`}
        >
          Community
        </Link>
      </motion.div>
    </div>
  );
}

export default Switcher;
