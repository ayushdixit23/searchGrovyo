"use client";
import Header from "./components/Header/Header";
import Image from "next/image";
import logo from "./assets/more/logo.png";
import Nav from "./components/Header/Nav";

export default function Home() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Banner Section */}
      <section
        className="h-screen bg-cover bg-center mobile-banner pt-10"
        style={{
          background:
            "linear-gradient(90deg, #000000 0%, #111827 50%, #000000 100%)",
        }}
      >
        <div className="flex flex-col mt-10 pt-10 bg-banner bg-cover w-full bg-center md:mt-0 items-center md:justify-center h-full text-center text-white  px-20 banner">
          <div className="px-10 pt-10 md:pt-0">
            <Image
              src={logo}
              alt="Banner Image"
              width={280}
              height={59}
              quality={100}
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 mt-10 md:px-10 leading-[30px]">
            India’s first Peer to Peer Social Commerce Platform
          </h1>
          <p className="text-xl md:text-2xl mb-6 md:px-10 md:mx-10">
            Create communities, gather your audience, and showcase your products
            - all in one dynamic space.
          </p>
        </div>
      </section>

      <Nav />
    </div>
  );
}
