import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import searchImage from '../../assets/Images/search.png';

const Header = () => {
  const { asPath } = useRouter();

  return (
    <header className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left: Logo */}
        <div className="text-white text-xl font-bold">
          <Image
            src="/images/header-logo.png"
            alt="Banner Image"
            width={33}
            height={38}
            quality={100}
          />
        </div>

        {/* Center: Menu */}
        <nav className="hidden md:flex space-x-8 p-4 rounded-[32px]">
          <Link
            href="/web-app"
            className={`${asPath === "/web-app"
              ? "text-white underline"
              : "text-white hover:text-gray-300"
              }`}
          >
            Communities
          </Link>
          <Link
            href="#about"
            className={`${asPath === "#about"
              ? "text-white underline"
              : "text-white hover:text-gray-300"
              }`}
          >
            Features
          </Link>
          <Link
            href="#businesses"
            className={`${asPath === "#businesses"
              ? "text-white underline"
              : "text-white hover:text-gray-300"
              }`}
          >
            For Businesses
          </Link>
        </nav>

        {/* Right: Search and Download Button */}
        <div className="flex items-center space-x-4">
          <button className="text-white bg-transparent pt-4 px-4">
            <Image
              src={searchImage}
              alt="search Image"
              width={65}
              height={65}
              quality={100}
            />
          </button>
          <button className="text-white bg-blue-600 py-2 px-4 rounded-[1.2rem] shadow-md hover:bg-blue-700">
            Download
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
