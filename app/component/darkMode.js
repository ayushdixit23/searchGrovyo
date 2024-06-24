import Image from "next/image";
import { useEffect, useState } from "react";
// import Sun from "../assets/Images/sun.png";
// import Moon from "../assets/Images/moon.png";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = sessionStorage.getItem("dark");

    setDarkMode(savedDarkMode === "true");

    const body = document.querySelector("body");
    if (savedDarkMode === "true") {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("dark", darkMode.toString());

    const body = document.querySelector("body");
    if (darkMode) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      onClick={toggleDarkMode}
      className={`duration-200 select-none ${
        darkMode
          ? "h-4 w-8 rounded-full flex items-center pl-[40%] bg-white "
          : "h-4 w-8 rounded-full flex items-center bg-[#3e3e3e]"
      }`}
    >
      <div
        className={`duration-200 m-[1px] ${
          darkMode
            ? "h-5 w-5 rounded-full flex justify-center items-center bg-[#3e3e3e]"
            : "h-5 w-5 rounded-full flex justify-center items-center bg-[#fff]"
        }`}
      >
        {/* {darkMode ? (
          <Image src={Moon} alt="moon" className="h-5 w-5 rounded-full" />
        ) : (
          <Image src={Sun} alt="sun" className="h-5 w-5 rounded-full" />
        )} */}
      </div>
    </div>
  );
};

export default DarkModeToggle;
