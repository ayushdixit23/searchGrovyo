"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DarkModeToggle from "./darkMode";
import Search from "../component/Search";
import Home from "../assets/Home";
import Chat from "../assets/Chat";
import Library from "../assets/Lib";
import Sarch from "../assets/Search";
import Setting from "../assets/Setting";
import { useAuthContext } from "../utils/AuthWrapper";
import { ModeToggle } from "./ModeToggle";

function Sidebar() {
  const { data } = useAuthContext();
  const [sear, setSear] = useState(false);
  const [color, setColor] = useState(1);

  const Map = [
    {
      name: "Home",
      id: 0,
      img: <Home  color={color} />,
      path: "/main/feed/newForYou",
      change: 1,
    },
    {
      name: "Chats",
      id: 1,
      img: <Chat color={color} />,
      path: "/main/chat",
      change: 2,
    },
    {
      name: "Library",
      id: 2,
      img: <Library color={color} />,
      path: "/main/library",
      change: 3,
    },
  ];

  useEffect(() => {
    // Wrap the sessionStorage code in a client-side useEffect hook.
    const storedColor =
      JSON.parse(sessionStorage.getItem("selectedColor")) || 1;
    setColor(storedColor);
  }, []); // This should run only in the browser.

  const handleColor = (i) => {
    setColor(i);
    sessionStorage.setItem("selectedColor", JSON.stringify(i));
  };

  return (
    <div className="h-screen w-[60px] bg-[#ffffff] dark:bg-bluedark flex flex-col justify-center items-start">
      {/* Image */}
      <div className="h-screen w-[60px] ring-[#f5f5f5] bg-[#f2f2f2] dark:bg-bluedark dark:border-[#273142] border-[#d4d4d4] 
      border-r-2 absolute flex flex-col justify-evenly items-center">
        {data?.dp !== null ? (
          <Link href="/prosite">
            <img
              className="h-[40px] w-[40px] rounded-[18px] ring-1 ring-white dark:ring-[#273142] bg-white dark:bg-bluedark "
              src={data?.dp}
              //alt="pix"
            />
          </Link>
        ) : (
          <div className="h-[40px] w-[40px] rounded-[18px] bg-[#f5f5f5] ring-1 ring-white shadow-sm animate-pulse "></div>
        )}

        <div className="flex flex-col py-28 w-[100%] h-[80%] justify-between items-center md:max-sm:hidden">
          {Map.map((d) => (
            <Link
              key={d.id}
              onClick={() => {
                setSear(false);
                handleColor(d.change);
              }}
              href={d.path}
              className={`flex justify-center items-center flex-col ${
                color === d.change
                  ? "bg-slate-200 dark:bg-selectdark   h-[50px] rounded-full w-[50px] "
                  : " h-[50px] hover:bg-blue-50   hover:rounded-full hover:h-[50px] hover:w-[50px]  rounded-full w-[50px] "
              }`}
            >
              <div className="my-1 ">{d.img}</div>
              <div
                className={`font-medium ${
                  color === d.change
                    ? "text-[10px] dark:text-white  text-[#569FF5]"
                    : "text-[10px] dark:text-white  text-[#333]"
                }`}
              >
                {d.name}
              </div>
            </Link>
          ))}
          <div
            onClick={() => {
              setSear(!sear);
              handleColor(4);
            }}
            className={`flex justify-center items-center flex-col ${
              color === 4
                ? "bg-slate-200  dark:bg-selectdark h-[50px] rounded-full w-[50px] "
                : " h-[50px] rounded-full w-[50px] hover:bg-blue-50 hover:rounded-full hover:h-[50px] hover:w-[50px] "
            }`}
          >
            <div className="my-1 h-5 w-5 flex justify-center items-center">
              <Sarch color={color} setColor={setColor} />
            </div>
            <div
              className={`font-medium ${
                color === 4
                  ? "text-[10px] dark:text-white text-[#569FF5]"
                  : "text-[10px] dark:text-white text-[#333]"
              }`}
            >
              Search
            </div>
          </div>
          <Link
            onClick={() => {
              setSear(false);
              handleColor(5);
            }}
            href="/main/settings"
            className={`flex justify-center items-center flex-col  ${
              color === 5
                ? "bg-slate-200  dark:bg-selectdark h-[50px] rounded-full w-[50px] "
                : " h-[50px] rounded-full w-[50px] hover:bg-blue-50 hover:rounded-full hover:h-[50px] hover:w-[50px] "
            }`}
          >
            <Setting color={color} />
            <div
              className={`font-medium ${
                color === 5
                  ? "text-[10px] dark:text-white text-blue-300 "
                  : "text-[10px] dark:text-white text-[#333]  "
              }`}
            >
              Settings
            </div>
          </Link>
        </div>
        <div className="">
          {/* <DarkModeToggle /> */}
          <ModeToggle />
        </div>
      </div>
      <div
        className={`bg-blue-700 border-r-2 border-[#f9f9f9] dark:border-[#171717] md:min-w-[390px] md:[360px] duration-1000 h-screen  ${
          sear ? "absolute z-0 left-[60px]" : "absolute z-0 -left-[100vh]"
        }`}
      >
        <Search />
      </div>
    </div>
  );
}

export default Sidebar;
