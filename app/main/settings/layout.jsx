"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
// import Sidebar from "../component/Sidebar";
import LogoutModal from "../../component/LogOut";
// import MobileNav from "../component/MobileNav";
import Image from "next/image";
// import { getData } from "../utils/useful";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../utils/AuthWrapper";
import Cookies from "js-cookie";
import { MdVerified } from "react-icons/md";

export default function SettingLayout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChildrenHidden, setIsChildrenHidden] = useState(false);
  const { data, setAuth, setData } = useAuthContext();

  const router = useRouter();
  
  const handleLogout = () => {
    setIsModalOpen(false);

    // Add your logout logic here
  };

  const deleteCookies = () => {
    Cookies.remove(`access_token`);
    Cookies.remove(`refresh_token`);
    setAuth(false);
    setTimeout(() => {
      setData("");
    }, 3000);
    router.push("/login");
  };

  (() => {
    if (
      typeof window !== "undefined" &&
      window.history &&
      window.history.pushState
    ) {
      window.addEventListener("popstate", function () {
        if (typeof setIsChildrenHidden === "function") {
          setIsChildrenHidden(false);
        }
      });
    } else {
      console.warn("History API is not supported by this browser");
    }
  })();

  return (
    <>
      <div className="w-[100%] h-[100vh] bg-white dark:bg-bluedark flex pn:max-md:justify-center ">
        <div className=" pn:max-md:h-[100vh] h-screen overflow-auto scrollbar-hide select-none md:min-w-[390px] lg:w-[360px] flex flex-col items-center md:border-r-2 border-[#f7f7f7] self-end w-full">
          <div
            className="w-[100%] h-[50px] dark:bg-bluedark bg-slate-100
           flex flex-row px-5 justify-between items-center pn:max-md:h-[50px]"
          >
            <div className="text-[24px] text-black dark:text-white font-sans font-semibold">
              Settings
            </div>
          </div>

          <div
            className={`md:col-span-1  w-full sm:col-span-2 h-[90%] bg-maincolor max-h-screen ${
              isChildrenHidden ? "pn:max-sm:hidden" : " pn:max-sm:w-full"
            }`}
          >
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-3 dark:bg-maincolor dark:border dark:border-border sm:max-md:p-2 p-4 rounded-xl">
                <div>
                  {data?.dp && (
                    <img
                      src={data?.dp}
                      width={60}
                      height={60}
                      className="w-[45px] h-[45px] object-cover rounded-[20px]"
                      alt="profile"
                    />
                  )}
                </div>
                <div>
                  <div className=" font-semibold">
                    {" "}
                    <div className="flex items-center gap-2">
                      <div className="text-[16px]"> {data?.fullname}</div>
                      {data?.isverified && (
                        <div>
                          <MdVerified className="text-blue-900 " />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="font-medium text-[14px]">
                    {data?.username}
                  </div>
                </div>
              </div>
              <a
                target="_blank"
                href={`https://prosite.grovyo.com/lwozxip?id=${encodeURIComponent(
                  data?.id
                )}&temp=1`}
                className="text-base rounded-xl focus:bg-[#f9f9f9] dark:hover:bg-[#3d4654] dark:focus:bg-[#3d4654] hover:bg-[#f9f9f9] my-2 sm:max-md:p-2 p-4 py-3  font-semibold"
              >
                Customize Your Prosite
              </a>
              <a
                target="_blank"
                href={`https://workspace.grovyo.com/aybdhw?zyxxpht=${data?.id}&path=/main/dashboard`}
                className="text-base rounded-xl focus:bg-[#f9f9f9] dark:hover:bg-[#3d4654] dark:focus:bg-[#3d4654] hover:bg-[#f9f9f9] my-2 sm:max-md:p-2 p-4 py-3  font-semibold"
              >
                View Community Analytics
              </a>
              {/* <div className="text-base p-2 py-3  py-4 font-semibold">
  											Help And Support
  										</div> */}
              <a
                target="_blank"
                href={`http://localhost:3001/alginsf?zray=${data?.id}`}
                // href={`https://ads.grovyo.com/alginsf?zray=${data?.id}`}
                className="text-base rounded-xl focus:bg-[#f9f9f9] dark:hover:bg-[#3d4654] dark:focus:bg-[#3d4654] hover:bg-[#f9f9f9] my-2 sm:max-md:p-2 p-4 py-3  font-semibold"
              >
                Create Your Ad
              </a>
              <a
                target="_blank"
                href={`https://workspace.grovyo.com/aybdhw?zyxxpht=${data?.id}&path=/main/settings`}
                className="text-base rounded-xl focus:bg-[#f9f9f9] dark:hover:bg-[#3d4654] dark:focus:bg-[#3d4654] hover:bg-[#f9f9f9] my-2 sm:max-md:p-2 p-4  py-3  font-semibold"
              >
                Edit Profile
              </a>
              <div
                onClick={() => setIsModalOpen(true)}
                className=" text-base sm:max-md:p-2 p-4 py-3 text-red-700 dark:hover:bg-[#3d4654] dark:focus:bg-[#3d4654] my-1 rounded-xl focus:bg-[#f9f9f9] hover:bg-[#f9f9f9] font-semibold"
              >
                Log Out
              </div>
              <LogoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                // onLogout={handleLogout}
                onLogout={deleteCookies}
              />
            </div>
          </div>
        </div>
        <div className="w-full bg-green-300 pn:max-sm:hidden"> {children}</div>
      </div>
    </>
  );
}
