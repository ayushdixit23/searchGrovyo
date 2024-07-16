"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CiShoppingCart, CiShoppingBasket } from "react-icons/ci";
import { MdOutlineSubscriptions } from "react-icons/md";
import { usePathname } from "next/navigation";

export default function LibraryLayout({ children }) {

  const path = usePathname()

  return (
    <div className="flex flex-row bg-white dark:bg-bluedark h-[100%] w-[100%]">
      {/* chats */}
      <div className="h-[100vh] pn:max-md:h-[100vh] select-none pn:max-sm:w-[100%] w-[100%] flex flex-col items-start  md:border-r-2 border-[#f7f7f7]  ">
        {/* header */}
        <div className="md:h-[15vh] py-2 gap-1 sm:gap-0 border-b-2 bg-white border-r-2 w-[100%] dark:bg-[#0D0D0D] dark:bg-bluedark dark:border-[#1d1d1d] dark:border-r-2 dark:text-[#fff] bg-rink-300 pn:max-sm:fixed top-14 md:min-w-[390px]  pn:max-md:w-[100%] flex flex-col pn:max-md:z-10">
          <div
            className="h-[50%] w-[100%] 
           flex flex-col  text-[20px] font-bold px-4 py-2 justify-end"
          >
            Library
          </div>
          <div className="h-[50%] w-[100%] text-black px-4 gap-2 flex flex-row justify-start items-center">
            <Link
              href={{
                pathname: "../../main/library/Cart",
              }}

              className={`font-medium gap-1 sm:gap-2 flex justify-center items-center ${path === "/main/library" || path === "/main/library/Cart"
                ? "py-2 bg-[#0075FF] text-white rounded-2xl text-[10px] sm:text-[12px] px-3 pp:px-4"
                : "text-[#3e3e3e] py-2 bg-[#f9f9f9] dark:bg-[#323d4e] dark:text-[#fff] rounded-2xl text-[10px] sm:text-[12px] px-3 pp:px-4"
                }`}
            >
              <CiShoppingCart className="text-[20px]" />
              <div>Cart</div>
            </Link>
            <Link
              href={{
                pathname: "../../main/library/Track",
              }}

              className={`font-medium gap-1 sm:gap-2 ${path.startsWith("/main/library/Track")
                ? "flex justify-center items-center py-2 bg-[#0075FF] text-white rounded-2xl text-[10px] sm:text-[12px] px-3 pp:px-4"
                : "flex justify-center text-[#3e3e3e] items-center py-2 bg-[#f9f9f9] dark:bg-[#323d4e] dark:text-[#fff] rounded-2xl text-[10px] sm:text-[12px] px-3 pp:px-4"
                }`}
            >
              <CiShoppingBasket className="text-[20px]" />
              <div>Track Order</div>
            </Link>
            <Link
              href="../../main/library/Subscription"

              className={`font-medium gap-1 sm:gap-2 ${path.startsWith("/main/library/Subscription")
                ? "flex justify-center items-center py-2 bg-[#0075FF] text-white  rounded-2xl text-[10px] sm:text-[12px] px-3 pp:px-4"
                : "flex justify-center text-[#3e3e3e] items-center py-2 bg-[#f9f9f9] dark:bg-[#323d4e] dark:text-[#fff] rounded-2xl text-[10px] sm:text-[12px] px-3 pp:px-4"
                }`}
            >
              <MdOutlineSubscriptions className="text-[20px]" />
              <div>Subscription</div>
            </Link>
            {/* <Link
              href="../../main/library/Address"
              onClick={() => {
                setValue(3);
              }}
              className={`font-medium ${
                value === 3
                  ? "flex justify-center items-center py-2 bg-[#0075FF] text-white  rounded-2xl text-[10px] sm:text-[12px] px-3 pp:px-4"
                  : "flex justify-center text-[#3e3e3e] items-center py-2 bg-[#f9f9f9] dark:bg-[#323d4e] dark:text-[#fff] rounded-2xl text-[10px] sm:text-[12px] px-3 pp:px-4"
              }`}
            >
              Order History
            </Link> */}
          </div>
        </div>
        <div className="h-[89vh] w-[100%] ">{children}</div>
      </div>
    </div >
  );
}
