import Image from "next/image";
import React from "react";
import chat1 from "../../assets/chat1.png";
import chat2 from "../../assets/chat2.png";
import chat3 from "../../assets/chat3.png";
import chat4 from "../../assets/chat4.png";
import chat5 from "../../assets/chat5.png";
import chat6 from "../../assets/chat6.png";

const page = () => {
  return (
    <>
      <div className="md:h-[80vh] h-[100vh] relative">
        <div className="md:bg-chats bg-mobilechats bg-center bg-no-repeat bg-cover h-full"></div>
        <div className="absolute w-full z-10 h-full top-0 left-0">
          <div className="flex flex-col gap-5 pn:max-sm:relative pn:max-sm:-top-5 justify-end items-center md:justify-center h-full">
            <div className="md:text-3xl text-2xl font-bold dark:text-[#1c0e0d] text-center leading-snug w-[80%] md:w-[50%] lg:w-[40%]">
              Enhance your Grovyo experience with powerful chat features:
            </div>
            <div className="font-medium dark:text-[#1c0e0d]">
              Stay Connected & Informed
            </div>
            <div className="sm:mt-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.grovyomain&hl=en_IN&gl=US"
                target="_blank"
                className="bg-white dark:text-[#1c0e0d] p-3 px-7 text-sm sm:text-base font-medium rounded-full"
              >
                Download Grovyo Now
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#1A1A1A] p-5 pb-8 h-auto">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="grid pp:grid-cols-2 sm:grid-cols-3 gap-7 md:w-[90%] lg:w-[75%]">
            <div className="bg-[#303030] text-white p-3 rounded-2xl flex flex-col justify-center items-center gap-2">
              <div>
                <Image src={chat1} className="pp:max-w-[300px]" />
              </div>
              <div className="sm:text-xl text-lg text-center font-semibold">
                Hide Chats
              </div>
              <div className="text-center text-sm">
                Hide Chats: Keep conversations confidential with the ability to
                hide chats from your main view.
              </div>
            </div>

            <div className="bg-[#303030] text-white p-3 rounded-2xl flex flex-col justify-center items-center gap-2">
              <div>
                <Image src={chat2} className="pp:max-w-[300px]" />
              </div>
              <div className="sm:text-xl text-lg text-center font-semibold">
                Share Seamlessly
              </div>
              <div className="text-center text-sm">
                Share posts from your communities, links, and files within chats
                for easy collaboration.
              </div>
            </div>

            <div className="bg-[#303030] text-white p-3 rounded-2xl flex flex-col justify-center items-center gap-2">
              <div>
                <Image src={chat3} className="pp:max-w-[300px]" />
              </div>
              <div className="sm:text-xl text-lg text-center font-semibold">
                Direct Message
              </div>
              <div className="text-center text-sm">
                Reach out to any user directly, regardless of their membership
                status.
              </div>
            </div>

            <div className="bg-[#303030] text-white p-3 rounded-2xl flex flex-col justify-center items-center gap-2">
              <div>
                <Image src={chat4} className="pp:max-w-[300px]" />
              </div>
              <div className="sm:text-xl text-lg text-center font-semibold">
                Web to Mobile
              </div>
              <div className="text-center text-sm">
                Start a chat on the web and pick it up on your mobile device,
                and vice versa, for ultimate convenience.tial with the ability
                to hide chats from your main view.
              </div>
            </div>

            <div className="bg-[#303030] text-white p-3 rounded-2xl flex flex-col justify-center items-center gap-2">
              <div>
                <Image src={chat5} className="pp:max-w-[300px]" />
              </div>
              <div className="sm:text-xl text-lg text-center font-semibold">
                Video Calls
              </div>
              <div className="text-center text-sm">
                Face-to-face interaction is just a click away with built-in
                video calling functionality
              </div>
            </div>

            <div className="bg-[#303030] text-white p-3 rounded-2xl flex flex-col justify-center items-center gap-2">
              <div>
                <Image src={chat6} className="pp:max-w-[300px]" />
              </div>
              <div className="sm:text-xl text-lg text-center font-semibold">
                Order Notifications in Chat:
              </div>
              <div className="text-center text-sm">
                Never miss a sale! Get real-time notifications within chats
                whenever you receive a new order through your Grovyo Store.
              </div>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col bg-[#202020] text-white sm:h-[130px] w-full rounded-2xl gap-5 p-3 mt-12 sm:px-12 sm:justify-between sm:items-center md:w-[90%] lg:w-[75%]">
            <div className="text-lg font-semibold">
              Stay connected, informed, and in <br /> control with Grovyo Chats!
            </div>
            <div>
              <a
                href="https://play.google.com/store/apps/details?id=com.grovyomain&hl=en_IN&gl=US"
                className="bg-[#0A7CFF] p-2 px-4 rounded-lg"
              >
                Download Grovyo
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
