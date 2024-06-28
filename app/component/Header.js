"use client";
import React, { useEffect, useState } from "react";
// import search from "../assets/Images/Searchhhh.png";
// import notify from "../assets/Images/Notify.png";
import Image from "next/image";
import Link from "next/link";
import { useAuthContext } from "../utils/AuthWrapper";

function Header() {
  const { data } = useAuthContext();

  useEffect(() => { }, []);
  return (
    <div className="w-full h-[6vh] flex flex-row bg-white dark:bg-bluedark items-center py-1  ">
      <div className="w-[15%] h-[100%] flex justify-center items-center">
        <div className=" bg-[#f5f5f5] ring-1 rounded-xl ring-white shadow-sm">
          {/* <div className="h-[40px] w-[40px] rounded-2xl bg-[#f5f5f5] ring-1 ring-white shadow-sm animate-pulse "></div> */}
          <img
            src={data?.dp}
            className="h-[35px] w-[35px] bg-[#f5f5f5] ring-1 ring-white shadow-sm rounded-2xl  "
            alt={data?.fullname}
          />
        </div>
      </div>
      <div className="w-[55%] h-[100%] "></div>
      <div className="w-[30%] h-[100%] flex flex-row justify-center items-center">
        <Link href="../../phone/Search">
          {/* <Image src={search} alt="icons" className="h-[40px] w-[40px]" /> */}
        </Link>
      </div>
    </div>
  );
}

export default Header;
