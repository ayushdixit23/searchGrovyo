"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Home from "../assets/Home";
import Chat from "../assets/Chat";
import Library from "../assets/Lib";
import { IoSettingsSharp } from "react-icons/io5";

function Tabbar() {

  const [sear, setSear] = useState(false);
  const [color, setColor] = useState(1);

  const Map = [
    {
      name: "Home",
      id: 0,
      img: <Home color={color} />,
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
    {
      name: "Settings",
      id: 3,
      img: <IoSettingsSharp color={color} className="text-xl text-black" />,
      path: "/main/settings",
      change: 4,
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
    <div className="w-screen h-[60px] border-t-2 border-[#f5f5f5] bg-white dark:bg-[#0D0F10] flex flex-row fixed bottom-0 justify-evenly">
      {Map.map((d) => (
        <Link
          key={d.id}
          onClick={() => {
            setSear(false);
            handleColor(d.change);
          }}
          href={d.path}
          className="flex  justify-center items-center flex-col "
        >
          <div className="my-1">{d.img}</div>
          <div
            className={`font-medium ${color === d.change
              ? "text-[14px] text-[#569FF5]"
              : "text-[14px] dark:text-white  text-[#333]"
              }`}
          >
            {d.name}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Tabbar;
