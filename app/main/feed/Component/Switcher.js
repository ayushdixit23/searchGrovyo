"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

function Switcher() {
  const path = usePathname()

  return (
    <div className="pn:max-sm:h-[6vh] h-[10vh] bg-white dark:bg-[#0D0F10] shadow-sm z-10 pn:max-sm:items-center 
     pn:max-sm:w-[100%] pn:max-sm:mt-[6vh] overflow-hidden sm:max-md:rounded-r-3xl w-[25.8%] px-2 pn:max-md:justify-start absolute md:fixed flex flex-row items-center">
      {/* // New for you */}
      <motion.div
        //initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href={"/main/feed/newForYou"}

          className={`${path.startsWith("/main/feed/newForYou")
            ? "text-[14px] pn:max-sm:text-[12px] dark:text-white dark:bg-[#121212] text-[#171717] p-3 bg-[#f5f5f5] rounded-xl font-semibold mx-2 hover:text-black transition-all duration-300"
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
            ? "text-[14px] pn:max-sm:text-[12px] dark:bg-[#121212] p-3 dark:text-white  bg-[#f5f5f5] rounded-xl text-[#171717] font-semibold mx-2 hover:text-black  transition-all duration-300"
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
