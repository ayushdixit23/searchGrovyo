"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Search from "../component/Search";
import Home from "../assets/Home";
import Chat from "../assets/Chat";
import Library from "../assets/Lib";
import Sarch from "../assets/Search";
import Setting from "../assets/Setting";
import { useAuthContext } from "../utils/AuthWrapper";
import { ModeToggle } from "./ModeToggle";
import { usePathname } from "next/navigation";

function Sidebar() {
  const { data } = useAuthContext();
  const [sear, setSear] = useState(false);
  const [color, setColor] = useState(1);
  const path = usePathname()

  // const Map = [
  //   {
  //     name: "Home",
  //     id: 0,
  //     img: <Home color={(path.startsWith("/main/feed/newForYou") || path.startsWith("/main/feed/community")) ? 1 : 0} />,
  //     path: "/main/feed/newForYou",
  //     change: 1,
  //   },
  //   {
  //     name: "Chats",
  //     id: 1,
  //     img: <Chat color={(path.startsWith("/main/chat")) ? 2 : 0} />,
  //     path: "/main/chat",
  //     change: 2,
  //   },
  //   {
  //     name: "Library",
  //     id: 2,
  //     img: <Library color={(path.startsWith("/main/library")) ? 3 : 0} />,
  //     path: "/main/library",
  //     change: 3,
  //   },
  // ];

  return (
    <div className="h-screen w-[60px] bg-[#ffffff] dark:bg-[#0D0F10] flex flex-col justify-center items-start">
      {/* Image */}
      <div className="h-screen w-[60px] ring-[#f5f5f5] bg-[#f2f2f2] dark:bg-bluedark border-[#f7f7f7] dark:border-[#131619]
      border-r-2 absolute flex flex-col justify-evenly items-center">
        {data?.dp !== null ? (
          <div className="h-[40px] w-[40px] ">
            <Link href={`/${data?.username}`} className="w-full h-full">
              <img
                className="w-full h-full object-cover rounded-[18px] ring-1 ring-white dark:ring-[#273142] bg-white dark:bg-bluedark "
                src={data?.dp}
              //alt="pix"
              />
            </Link>
          </div>
        ) : (
          <div className="h-[40px] w-[40px] rounded-[18px] bg-[#f5f5f5] ring-1 ring-white shadow-sm animate-pulse "></div>
        )}

        <div className="flex flex-col py-28 w-[100%] h-[80%] justify-between items-center md:max-sm:hidden">

          <Link
            onClick={() => {
              setSear(false);

            }}
            href={"/main/feed/newForYou"}
            className={`flex justify-center items-center ${path.startsWith("/main/feed/newForYou") || path.startsWith("/main/feed/community")
              ? "bg-slate-200 dark:bg-selectdark h-[50px] rounded-full w-[50px]"
              : "h-[50px] hover:dark:bg-[#323d4e] hover:rounded-full hover:h-[50px] hover:w-[50px] rounded-full w-[50px]"
              } flex-col`}
          >
            <div className="my-1 ">
              <Home color={(path.startsWith("/main/feed/newForYou") || path.startsWith("/main/feed/community")) ? 1 : 0} />
            </div>
            <div
              className={`font-medium ${path.startsWith("/main/feed/newForYou") || path.startsWith("/main/feed/community")
                ? "text-[10px] dark:text-[#569FF5] text-[#569FF5]"
                : "text-[10px] dark:text-white  text-[#333]"
                }`}
            >
              Home
            </div>
          </Link>
          <Link
            onClick={() => {
              setSear(false);
            }}
            href={"/main/chat"}
            className={`flex justify-center items-center ${path.startsWith("/main/chat")
              ? "bg-slate-200 dark:bg-selectdark h-[50px] rounded-full w-[50px]"
              : "h-[50px] hover:dark:bg-[#323d4e] hover:rounded-full hover:h-[50px] hover:w-[50px] rounded-full w-[50px]"
              } flex-col`}
          >
            <div className="my-1 ">
              <Chat color={(path.startsWith("/main/chat")) ? 2 : 0} />
            </div>
            <div
              className={`font-medium ${path.startsWith("/main/chat")
                ? "text-[10px] dark:text-[#569FF5] text-[#569FF5]"
                : "text-[10px] dark:text-white  text-[#333]"
                }`}
            >
              Chats
            </div>
          </Link>
          <Link
            onClick={() => {
              setSear(false);

            }}
            href={"/main/library"}
            className={`flex justify-center items-center ${path.startsWith("/main/library")
              ? "bg-slate-200 dark:bg-selectdark h-[50px] rounded-full w-[50px]"
              : "h-[50px] hover:dark:bg-[#323d4e] hover:rounded-full hover:h-[50px] hover:w-[50px] rounded-full w-[50px]"
              } flex-col`}
          >
            <div className="my-1 ">
              <Library color={(path.startsWith("/main/library")) ? 3 : 0} />
            </div>
            <div
              className={`font-medium ${path.startsWith("/main/library")
                ? "text-[10px]  text-[#569FF5]"
                : "text-[10px] dark:text-white  text-[#333]"
                }`}
            >Library
            </div>
          </Link>

          <div
            onClick={() => {
              setSear(!sear);

            }}
            className={`flex justify-center items-center flex-col ${color === 4
              ? "bg-slate-200  dark:bg-selectdark h-[50px] rounded-full w-[50px] "
              : " h-[50px] rounded-full w-[50px] hover:dark:bg-[#323d4e]  hover:rounded-full hover:h-[50px] hover:w-[50px] "
              }`}
          >
            <div className="my-1 h-5 w-5 flex justify-center items-center">
              <Sarch color={color} setColor={setColor} />
            </div>
            <div
              className={`font-medium ${color === 4
                ? "text-[10px] text-[#569FF5]"
                : "text-[10px] dark:text-white text-[#333]"
                }`}
            >
              Search
            </div>
          </div>
          <Link
            onClick={() => {
              setSear(false);

            }}
            href="/main/settings"
            className={`flex justify-center items-center flex-col  ${path.startsWith("/main/settings")
              ? "bg-slate-200  dark:bg-selectdark h-[50px] rounded-full w-[50px] "
              : " h-[50px] rounded-full w-[50px] hover:dark:bg-[#323d4e]  hover:rounded-full hover:h-[50px] hover:w-[50px] "
              }`}
          >
            <Setting color={path.startsWith("/main/settings") ? 5 : 0} />
            <div
              className={`font-medium ${path.startsWith("/main/settings")
                ? "text-[10px] text-blue-300 "
                : "text-[10px] dark:text-white text-[#333]  "
                }`}
            >
              Settings
            </div>
          </Link>
        </div>
        <div className="dark:bg-[#171717]">
          {/* <DarkModeToggle /> */}
          <ModeToggle />
        </div>
      </div>
      <div
        className={`bg-blue-700 border-r-2 border-[#f9f9f9] dark:border-[#171717] md:min-w-[390px] md:[360px] duration-1000 h-screen  ${sear ? "absolute z-0 left-[60px]" : "absolute z-0 -left-[100vh]"
          }`}
      >
        <Search />
      </div>
    </div >
  );
}

export default Sidebar;
