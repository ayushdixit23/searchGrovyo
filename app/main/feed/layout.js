"use client";
import { useSelector } from "react-redux";
import Switcher from "./Component/Switcher";

export default function PostLayout({ children }) {
  const hide = useSelector((state) => state.remember.hide);
  return (
    <div className=" w-[100%] ">
      {hide === false && (
        <div className=" z-40 pn:max-md:w-[100%] bg-white">
          <Switcher />
        </div>
      )}

      {/* Header */}
      <div className="w-[100%] h-[100vh] z-0 flex">{children}</div>

      {/*Posts*/}
    </div>
  );
}
