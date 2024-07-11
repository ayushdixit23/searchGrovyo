"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Home from "../assets/Home";
import Chat from "../assets/Chat";
import Library from "../assets/Lib";
import { IoSettingsSharp } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { PiCardsFill } from "react-icons/pi";
import { MdCampaign } from "react-icons/md";

function Tabbar() {
  const path = usePathname()
  // const [sear, setSear] = useState(false);

  const router = useRouter()

  // const Map = [
  //   {
  //     name: "Home",
  //     id: 0,
  //     img: <Home color={color} />,
  //     path: "/main/feed/newForYou",
  //     change: 1,
  //   },
  //   {
  //     name: "Chats",
  //     id: 1,
  //     img: <Chat color={color} />,
  //     path: "/main/chat",
  //     change: 2,
  //   },
  //   {
  //     name: "Library",
  //     id: 2,
  //     img: <Library color={color} />,
  //     path: "/main/library",
  //     change: 3,
  //   },
  //   {
  //     name: "Settings",
  //     id: 3,
  //     img: <IoSettingsSharp color={color} className="text-xl text-black" />,
  //     path: "/main/settings",
  //     change: 4,
  //   },
  // ];
  return (
    // <div className="w-screen h-[60px] border-t-2 border-[#f5f5f5] bg-white dark:bg-[#0D0F10] flex flex-row fixed bottom-0 justify-evenly">
    //   {Map.map((d) => (
    //     <Link
    //       key={d.id}
    //       onClick={() => {
    //         setSear(false);
    //         handleColor(d.change);
    //       }}
    //       href={d.path}
    //       className="flex  justify-center items-center flex-col "
    //     >
    //       <div className="my-1">{d.img}</div>
    //       <div
    //         className={`font-medium ${color === d.change
    //           ? "text-[14px] text-[#569FF5]"
    //           : "text-[14px] dark:text-white  text-[#333]"
    //           }`}
    //       >
    //         {d.name}
    //       </div>
    //     </Link>
    //   ))}
    // </div>


    <div style={{ marginTop: "10rem" }} class="fixed bottom-0 sm:hidden left-0 z-40 w-full h-16 bg-white border-t border-gray-200 dark:bg-black dark:border-gray-600">
      <div class="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        <button onClick={() => router.push("/main/feed/newForYou")} type="button" class="inline-flex flex-col  gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 items-center justify-center px-5  group">
          {/* <svg
          className="w-5 h-5 mb-1"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg> */}
          {/* <PiCardsThreeFill /> */}
          <Home color={path.startsWith("/main/feed/newForYou") || path.startsWith("/main/feed/community") ? 1 : 0} className={`w-5 h-5 mb-1 ${path.startsWith("/main/feed/newForYou") || path.startsWith("/main/feed/community") ? "text-[#2d9aff]" : "text-gray-500 dark:text-gray-400 "}`} />
          <span class={`text-xs  ${path.startsWith("/main/feed/newForYou") || path.startsWith("/main/feed/community") ? "text-[#2d9aff]" : "text-gray-500 dark:text-gray-400 "} `}>Home</span>
        </button>


        <button onClick={() => router.push("/main/chat")} type="button" class={`inline-flex flex-col gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 items-center justify-center px-5  group`}>

          <Chat color={path.startsWith("/main/chat") ? 2 : 0} class={`w-5 h-5 mb-1 ${path.startsWith("/main/chat") ? "text-[#2d9aff]" : "text-gray-500 dark:text-gray-400 "}`} />
          <span class={`text-xs  ${path.startsWith("/main/chat") ? "text-[#2d9aff]" : "text-gray-500 dark:text-gray-400 "} `}>Chats</span>
        </button>
        <button onClick={() => router.push("/main/library")} type="button" class="inline-flex flex-col gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 items-center justify-center px-5  group">

          <Library color={path.startsWith("/main/library") ? 3 : 0} class={`w-5 h-5 mb-1 ${path.startsWith("/main/library") ? "text-[#2d9aff]" : "text-gray-500 dark:text-gray-400 "}`} />

          <span class={`text-xs ${path === "/main/library" ? "text-[#2d9aff]" : "text-gray-500 dark:text-gray-400 "} `}>Library</span>
        </button>
        <button onClick={() => router.push("/main/settings")} type="button" class="inline-flex flex-col hover:bg-gray-50 dark:hover:bg-gray-800 items-center justify-center px-5  group">
          <svg class={`w-5 h-5 mb-1 ${path.startsWith("/main/settings") ? "text-[#2d9aff]" : "text-gray-500 dark:text-gray-400 "}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
          </svg>
          <span class={`text-sm  ${path.startsWith("/main/settings") ? "text-[#2d9aff]" : "text-gray-500 dark:text-gray-400 "} `}>Settings</span>
        </button>
      </div>
    </div>
  );
}

export default Tabbar;
