"use client";
import { useSelector } from "react-redux";
import Header from "../component/Header";
import Siderbar from "../component/Siderbar";
import Tabbar from "../component/Tabbar";

export default function MainLayout({ children }) {
  const visible = useSelector((state) => state.another.visible);
  const hide = useSelector((state) => state.remember.hide);

  return (
    <div className="flex flex-row w-[100%] pn:max-sm:flex-col">
      <div className="pn:max-sm:hidden bg-red-800 w-[60px] z-10  ">
        <Siderbar />
      </div>
      {hide === false && (
        <div
          className={` ${visible ? "z-10 top-0 sm:hidden w-full fixed" : "hidden"
            }  `}
        >
          <Header />
        </div>
      )}
      <div className="h-screen z-0 sm:w-[calc(100%-60px)] pn:max-md:w-full">{children}</div>
      {hide === false && (
        <div className={`${visible ? "md:hidden bg-gray-200" : "hidden"} `}>
          <Tabbar />
        </div>
      )}
    </div>
  );
}
