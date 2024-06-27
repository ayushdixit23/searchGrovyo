"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

function Switcher() {
  const path = usePathname()

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

          className={`${path.startsWith("/main/feed/newForYou")
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

          className={`${path.startsWith("/main/feed/community")
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
