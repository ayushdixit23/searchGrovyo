"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Logo from "./assets/Logo.png";
import axios from "axios";
import Link from "next/link";
import aesjs from "aes-js";
import { MdOutlineClose } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { BiSearchAlt } from "react-icons/bi";
import Commu from "./assets/Commu.png";
import Chat from "./assets/Chat.png";
import Prosit from "./assets/Prosit.png";
import Ads from "./assets/Ads.png";
import Sell from "./assets/Sell.png";
import Topic from "./assets/Topic.png";
import A from "./assets/a.png";
import Car from "./assets/Car.png";
import Contact from "./assets/Contact.png";
import { key } from "./utils/key";
import { MdVerified } from "react-icons/md";
import dynamic from "next/dynamic";
const VideoCall = dynamic(() => import("./component/VideoCall"));
// import { VideoCall } from "./component/VideoCall";

function page() {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [recentSearch, setRecentSearch] = useState([]);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(1);
  const [cimage, setCimage] = useState({
    p1: "",
    p2: "",
    p3: "",
    p4: "",
    p5: "",
    p6: "",
    p7: "",
    p8: "",
    p9: "",
    p10: "",
  });

  const [popup, setPopup] = useState(false);
  const encryptaes = (data) => {
    try {
      const textBytes = aesjs.utils.utf8.toBytes(data);
      const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
      const encryptedBytes = aesCtr.encrypt(textBytes);
      const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
      return encryptedHex;
    } catch (e) {
      console.log(e);
    }
  };

  const handleSearch = async (t) => {
    if (!t) {
      setData([]);
    }
    setText(t);
    try {
      if (t) {
        const res = await axios.post(
          `https://back.grovyo.xyz/api/searchpros?query=${t}`
        );
        if (res?.data?.data?.success) {
          const pros = res?.data?.data?.pros;
          const dp = res?.data?.data?.dps;
          const merge = pros?.map((p, i) => ({ p, dps: dp[i] }));
          setData(merge);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getCommunity = async () => {
    try {
      const res = await axios.get("https://work.grovyo.xyz/api/v1/fetchCom");

      setCimage({
        ...cimage,
        p1: res.data.community[0].image,
        p2: res.data.community[1].image,
        p3: res.data.community[2].image,
        p4: res.data.community[3].image,
        p5: res.data.community[4].image,
        p6: res.data.community[5].image,
        p7: res.data.community[6].image,
        p8: res.data.community[7].image,
        p9: res.data.community[8].image,
        p10: res.data.community[9].image,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommunity();
  }, []);

  const handSave = (id) => {
    const getids = localStorage.getItem("ids");
    let setids;
    if (getids) {
      const parseIds = JSON.parse(getids);
      if (parseIds.includes(encryptaes(id))) {
        const filterArr = parseIds.filter((d) => d !== encryptaes(id));
        const newArr = [encryptaes(id), ...filterArr];
        localStorage.setItem("ids", JSON.stringify(newArr));
        return;
      }
      if (parseIds.length <= 5) {
        setids = [encryptaes(id), ...parseIds];
      } else {
        parseIds.pop();
        setids = [encryptaes(id), ...parseIds];
      }
    } else {
      setids = [encryptaes(id)];
    }
    localStorage.setItem("ids", JSON.stringify(setids));
  };

  const changeOrder = (id) => {
    const getids = localStorage.getItem("ids");
    if (getids) {
      const parseIds = JSON.parse(getids);
      const filterArr = parseIds.filter((d) => d !== encryptaes(id));
      const newArr = [encryptaes(id), ...filterArr];
      localStorage.setItem("ids", JSON.stringify(newArr));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (window !== undefined) {
        const getids = localStorage.getItem("ids");
        if (getids) {
          const parseIds = JSON.parse(getids) || [];
          const filteredIds = parseIds.filter(
            (id) => id !== null && id !== undefined
          );

          if (filteredIds.length > 0) {
            try {
              const res = await axios.post(
                `https://work.grovyo.xyz/api/web/recentSearch`,
                filteredIds
              );
              setRecentSearch(res.data.users);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          }
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setPopup(true);
    }, 1300);
  }, []);

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`duration-700  ${
          open ? "right-0 z-50" : "-right-[1000px] -z-10"
        } w-screen  fixed h-screen `}
      >
        {/* popup */}
        <div
          className={`flex justify-center duration-700 sm:rounded-l-3xl bg-[#f9f9f9] text-black sm:text-white shadow-lg shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-35 ring-1 ring-[#f4f4f452] py-2 h-full absolute w-full sm:w-[300px] items-centerduration-700 ${
            open
              ? "right-0 pn:max-sm:top-0 pn:max-sm:rounded-t-sm"
              : "pn:max-sm:rounded-t-3xl -pn:max-sm:top-[1000px] -right-[1000px]"
          }`}
        >
          <div className="flex flex-col pn:max-sm:text-lg justify-center items-center w-full gap-8 font-semibold">
            <Link
              className="min-w-[110px] hover:underline text-center"
              href={"/about"}
            >
              About
            </Link>
            <Link
              className="min-w-[110px] hover:underline text-center"
              href={"/cancellation"}
            >
              Cancellation Policy
            </Link>
            <Link
              className="min-w-[110px] hover:underline text-center"
              href={"/contact"}
            >
              Contact
            </Link>
            <Link
              className="min-w-[110px] hover:underline text-center"
              href={"/deleterequest"}
            >
              Deleterequest
            </Link>
            <Link
              className="min-w-[110px] hover:underline text-center"
              href={"/privacy"}
            >
              Privacy Policy
            </Link>
            <Link
              className="min-w-[110px] hover:underline text-center"
              href={"/requestdata"}
            >
              Request Data
            </Link>
            <Link
              className="min-w-[110px] hover:underline text-center"
              href={"/return"}
            >
              Return Policy
            </Link>
            <Link
              className="min-w-[110px] hover:underline text-center"
              href={"/shipping"}
            >
              Shipping Policy
            </Link>
            <Link
              className="min-w-[110px] hover:underline text-center"
              href={"/terms"}
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>

      <div
        className={` h-screen w-screen bg-gradient-to-r from-[#000000] via-[#111827] to-[#000000] ${
          state === 1 ? "pn:max-md:h-screen fixed" : "pn:max-md:h-auto "
        }`}
      >
        {/* Header */}
        <div className="h-[60px] justify-center items-center w-[100%] flex ">
          <div className="h-[50px] w-full flex justify-between items-center px-2 ">
            <div className="h-[55px] flex text-[#fff] items-center justify-center rounded-3xl ">
              <div className="h-[55px] w-[55px]  rounded-3xl">
                <Image src={Logo} className="rounded-3xl" />
              </div>
            </div>
            <div
              className="flex p-1 ml-36 bg-[#f9f9f9] px-4 rounded-full relative pn:max-sm:hidden text-white shadow-lg shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ring-1 ring-[#f4f4f452] py-2
  "
            >
              <div
                onClick={() => {
                  setState(1);
                }}
                className={`flex flex-col cursor-pointer justify-center items-center  w-[100px] ${
                  state === 1 ? "" : ""
                }`}
              >
                <div
                  onClick={() => {
                    setState(1);
                  }}
                  className={`${
                    state === 1
                      ? "text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-white"
                      : "text-[#8C96A8]"
                  }`}
                >
                  Search
                </div>
                <div
                  className={`${
                    state === 1
                      ? "h-[2px] w-[20px] bg-white rounded-t-md"
                      : "hidden"
                  }`}
                ></div>
              </div>
              <div
                onClick={() => {
                  setState(2);
                }}
                className={`flex flex-col cursor-pointer justify-start items-start pl-3 w-[100px] ${
                  state === 2 ? "" : ""
                }`}
              >
                <div
                  onClick={() => {
                    setState(2);
                  }}
                  className={`${
                    state === 2
                      ? "text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-white"
                      : "text-[#8C96A8]"
                  }`}
                >
                  Features
                </div>
                <div
                  className={`${
                    state === 2
                      ? "h-[2px] w-[20px] bg-white rounded-t-md ml-6"
                      : "hidden"
                  }`}
                ></div>
              </div>
              <div
                onClick={() => {
                  setState(3);
                }}
                className={`flex flex-col cursor-pointer justify-center items-center w-[100px] ${
                  state === 3 ? "" : ""
                }`}
              >
                <div
                  className={`${
                    state === 3
                      ? " text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-white"
                      : " text-[#8C96A8]"
                  }`}
                >
                  For Business
                </div>
                <div
                  className={`${
                    state === 3
                      ? "h-[2px] w-[20px] bg-white rounded-t-md"
                      : "hidden"
                  }`}
                ></div>
              </div>
              {/* <a
                  target="_blank"
                  href={`https://app.grovyo.com/login`}
                  className={`flex flex-col cursor-pointer justify-center items-center w-[100px] `}
                >
                  <div
                    className={`
                     text-[#8C96A8] shadow-white
                    `}
                  >
                    Web App
                  </div>

                </a> */}
            </div>
            <div className="flex justify-center items-center px-5 gap-2 sm:gap-4">
              <a
                target="_blank"
                href="https://play.google.com/store/apps/details?id=com.grovyomain&hl=en_IN&gl=US"
                className="bg-[#0A7CFF] shadow-lg shadow-blue-500/50 text-white px-4 py-2 font-semibold rounded-full"
              >
                Download now
              </a>
              <div className="text-2xl z-50 font-semibold text-white">
                {open ? (
                  <MdOutlineClose className="" onClick={() => setOpen(false)} />
                ) : (
                  <RxHamburgerMenu onClick={() => setOpen(true)} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="pn:max-sm:h-[100%] h-[90%] justify-center items-center pn:max-sm:overflow-auto ">
          {/* Search */}
          <div
            className={`${
              state === 1
                ? "h-[100%] w-full flex flex-col bg-center justify-start  sm:justify-center pn:max-sm:pt-10 bg-no-repeat items-center"
                : "hidden"
            }`}
          >
            <div
              className={`w-[49%] flex-col sm:max-md:w-[70%] pn:max-sm:w-[90%] ${
                recentSearch.length > 0
                  ? "pn:max-pp:mt-10"
                  : "md:mb-36 pn:max-pp:mt-14"
              }  flex items-center justify-center`}
            >
              <div
                className={`lg:text-[37px] md:text-[32px] duration-75 sm:text-[27px] vs:text-[22px] pn:text-[17px] select-none text-center font-bold text-white`}
              >
                Discover The Perfect Prosites With An Effortless Search And
                Selection
              </div>
              <div className="w-full flex relative flex-col mt-2 justify-center items-center">
                <div className="flex w-[80%] pn:max-sm:w-[100%] mt-2 h-[50px] rounded-full justify-center items-center bg-white text-white shadow-lg shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ring-1 ring-[#f4f4f452] py-2 ">
                  <div className="w-[50px] h-[50px] flex justify-center items-center">
                    <BiSearchAlt className="w-[30px] h-[30px] " />
                  </div>
                  <input
                    value={text}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full rounded-r-full outline-none  font-semibold bg-transparent "
                    placeholder="Search Prosite "
                  />
                </div>

                {data.length > 0 && (
                  <div className="absolute top-[65px] transition duration-1000 w-full left-0 flex justify-center items-center">
                    <div
                      className={`flex left-0 w-[80%] flex-col z-30 pn:max-sm:w-[100%] ${
                        data.length > 1 && " overflow-y-scroll no-scrollbar"
                      }  mt-2 ${
                        data.length === 1 && "h-[70px]"
                      } h-[235px] bg-[#f9f9f9] px-4 relative text-white shadow-lg shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ring-1 ring-[#f4f4f452] ${
                        data.length > 1 && "py-2"
                      } rounded-2xl `}
                    >
                      {data.map((d, i, arr) => (
                        <Link
                          key={i}
                          onClick={() => handSave(d?.p._id)}
                          href={`/${d?.p.username}`}
                          className={`flex items-center ${
                            i != arr.length - 1
                              ? "border-b-2 border-[#0000001e]"
                              : null
                          }  gap-2 p-3`}
                        >
                          <img
                            className="h-[50px] w-[50px] rounded-[20px] "
                            src={d?.dps}
                            alt="image"
                          />
                          <div className="flex flex-col">
                            <div className="font-semibold flex gap-1 items-center">
                              <div>{d?.p.fullname} </div>
                              {d?.p?.isverified && (
                                <MdVerified className="text-blue-700" />
                              )}
                            </div>
                            <div className="text-[12px]">{d?.p.username}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tag */}
            {/* <div className="mt-4 w-[49%] flex text-white items-center">
  <div className="font-semibold  select-none">Top Search:</div>
  <div className="ring-2 p-2 flex text-[14px] m-2 ring-white rounded-full">
    <div className="select-none">Best Community</div>
    <Image src={Arrow} className="w-[20px]" />
  </div>
  <div className="ring-2 p-2 flex text-[14px] m-2 ring-white rounded-full">
    <div className="select-none">Best Community</div>
    <Image src={Arrow} className="w-[20px]" />
  </div>
  <div className="ring-2 p-2 flex text-[14px] m-2 ring-white rounded-full">
    <div className="select-none">Best Community</div>
    <Image src={Arrow} className="w-[20px]" />
  </div>
  <div className="ring-2 p-2 flex text-[14px] m-2 ring-white rounded-full">
    <div className="select-none">Best Community</div>
    <Image src={Arrow} className="w-[20px]" />
  </div>
  </div> */}
            {/* Resent */}
            {recentSearch.length > 0 && (
              <div className=" md:w-[49%] max-w-full mt-2 flex flex-col pn:max-sm:w-full text-white flex-wrap ">
                <div className="font-semibold select-none p-2">
                  Recent Search:
                </div>
                <div className="mt-1 flex items-center gap-5 flex-wrap md:gap-4 justify-center md:items-center">
                  {recentSearch.map((d, i) => (
                    // <div
                    //   key={d?.id}
                    //   href={`/${d?.id}`}
                    //   onClick={() => changeOrder(d?.id)}
                    //   className={`flex flex-col items-center w-[150px] justify-center bg-[#121212] ring-1 rounded-2xl p-3`}
                    // >
                    //   <img
                    //     className="h-[50px] w-[50px] rounded-2xl bg-slate-50"
                    //     src={d?.dp}
                    //     alt="image"
                    //   />

                    //   <div className="font-semibold mt-1 text-sm">{d?.fullname}</div>
                    //   <div className="text-[12px]">{d?.username}</div>
                    // </div>
                    <Link
                      key={d?.id}
                      href={`/${d?.username}`}
                      onClick={() => changeOrder(d?.id)}
                      className={`flex flex-col items-center sm:w-[150px] justify-center bg-[#f9f9f9] sm:px-4 relative text-white shadow-lg shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ring-1 ring-[#f4f4f452] sm:py-2 rounded-[24px] p-2`}
                    >
                      <img
                        className="h-[50px] w-[50px] rounded-[20px] bg-slate-50"
                        src={d?.dp}
                        alt="image"
                      />

                      <div className="font-semibold flex items-center mt-1 pn:max-sm:hidden text-sm">
                        <div className="pr-[2px]">
                          {d?.fullname.length > 12
                            ? `${d?.fullname.slice(0, 10)}...`
                            : d?.fullname}{" "}
                        </div>
                        {d?.isverified && (
                          <MdVerified className="text-blue-700" />
                        )}
                      </div>
                      <div className="text-[12px] pn:max-sm:hidden">
                        {d?.username}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* {popup && */}
            <div className="fixed sm:bottom-0 bottom-12 left-0 w-full">
              <div className="w-full animate-popup text-black z-50 relative py-2 justify-center items-center text-sm px-3 flex">
                <div className="bg-white flex justify-between items-center w-full py-4 rounded-xl px-3 h-full">
                  {/* <a href="https://web.grovyo.com/login" target="_blank" className="font-medium">
                        Web App !
                      </a> */}
                  <div>
                    <div className="font-semibold text-lg">Web App</div>

                    <div className="text-slate-600 font-medium">
                      Now your community is on web
                    </div>
                  </div>
                  <div className="z-40">
                    <Link
                      href={"/main/feed/newForYou"}
                      className="bg-blue-800 p-2 px-5 cursor-pointer rounded-xl text-white"
                    >
                      Visit Now
                    </Link>
                  </div>
                </div>

                {/* <div className="absolute right-12 top-0  flex items-center h-full">
                      <RxCross2 className="text-xl" onClick={() => { setPopup(false); console.log("cli") }} />
                    </div> */}
              </div>
            </div>
            {/* } */}
          </div>
          {/* Feature */}
          <div
            className={`${
              state === 2
                ? "pn:max-sm:h-auto h-full text-black w-full flex justify-evenly items-center"
                : "hidden"
            }`}
          >
            <div className="h-full xl:max-txl:w-[80%]  pb-10 w-[70%] pn:max-sm:w-[100%] flex justify-evenly flex-wrap items-center">
              <Link
                href="/features/community"
                className="flex flex-col z-40 justify-center hover:scale-110 pn:max-sm:hover:scale-95 pn:max-lg:scale-90 duration-100 items-center "
              >
                <div className="font-bold  text-white rotate-12 text-[34px]">
                  Communities
                </div>
                <div className="h-[200px] w-[360px] bg-red-200 rounded-2xl flex items-center">
                  <div className="h-[90%] w-[50%] p-2">
                    <Image src={Commu} />
                  </div>
                  <div className="h-[90%] w-[50%] p-2">
                    <div className="text-[14px] font-bold">
                      👥 Create Communities:
                    </div>
                    <div className="text-[12px] font-medium">
                      "Create and discover communities tailored to your
                      interests. Whether you're into technology, art,
                      literature, or fitness, there's a community for you"
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                href={"/features/chats"}
                className="flex flex-col z-40 justify-center items-center pn:max-sm:hover:scale-95 pn:max-lg:scale-90 hover:scale-110 duration-100 "
              >
                <div className="font-bold text-white -rotate-12 text-[34px]">
                  Chats
                </div>
                <div className="h-[200px] w-[360px] bg-[#FFD8AA] rounded-2xl flex items-center">
                  <div className="h-[90%] w-[50%] p-2">
                    <Image src={Chat} />
                  </div>
                  <div className="h-[90%] w-[50%] p-2">
                    <div className="text-[14px] font-bold">💬 Chats</div>
                    <div className="text-[12px] font-medium">
                      "Connect with new friends, businesses, and creators while
                      exploring exciting new chatting features on our dynamic
                      platform"
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                href={"/features/prosite"}
                className="flex flex-col z-40 justify-center items-center pn:max-sm:hover:scale-95 pn:max-lg:scale-90 hover:scale-110 duration-100 "
              >
                <div className="font-bold text-white rotate-12 text-[34px]">
                  Prosite
                </div>
                <div className="h-[200px] w-[360px] bg-[#BFF9EA] rounded-2xl flex items-center">
                  <div className="h-[90%] w-[50%] p-2">
                    <Image src={Prosit} />
                  </div>
                  <div className="h-[90%] w-[50%] p-2">
                    <div className="text-[14px] font-bold">
                      🏞️Create your Prosite:
                    </div>
                    <div className="text-[12px] font-medium">
                      "Unlock the power of your online persona with ProSite.
                      Build your profile website and create a memorable landing
                      experience for your audience"
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                href={"/features/earnwithus"}
                className="flex flex-col z-40 justify-center items-center pn:max-sm:hover:scale-95 pn:max-lg:scale-90 hover:scale-110 duration-100 "
              >
                <div className="font-bold text-white -rotate-12 text-[34px]">
                  Earn with us
                </div>
                <div className="h-[200px] w-[360px] bg-[#FFFD63] rounded-2xl flex items-center">
                  <div className="h-[90%] w-[50%] p-2">
                    <Image src={Ads} />
                  </div>
                  <div className="h-[90%] w-[50%] p-2">
                    <div className="text-[14px] font-bold">
                      💰 Earn with us:
                    </div>
                    <div className="text-[12px] font-medium">
                      Earn on your terms! Sell products, display ads, & offer
                      paid topics in your thriving Grovyo community.
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                href={"/features/store"}
                className="flex flex-col justify-center items-center z-40 pn:max-sm:hover:scale-95 pn:max-lg:scale-90 hover:scale-110 duration-100 "
              >
                <div className="font-bold text-white rotate-12 text-[34px]">
                  Buy and sell
                </div>
                <div className="h-[200px] w-[360px] bg-[#F4F0E4] rounded-2xl flex items-center">
                  <div className="h-[90%] w-[50%] p-2">
                    <Image src={Sell} />
                  </div>
                  <div className="h-[90%] w-[50%] p-2">
                    <div className="text-[14px] font-bold">🛒Create store:</div>
                    <div className="text-[12px] font-medium">
                      Sell and buy product with trustable stores across India
                      and local stores, with fastest Delivery Experience.
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                href="/features/topics"
                className="flex flex-col justify-center z-40 items-center pn:max-sm:hover:scale-95 pn:max-lg:scale-90 hover:scale-110 duration-100 "
              >
                <div className="font-bold text-white -rotate-12 text-[34px]">
                  Topics
                </div>
                <div className="h-[200px] w-[360px] bg-[#C7D0FF] rounded-2xl flex items-center">
                  <div className="h-[90%] w-[50%] p-2">
                    <Image src={Topic} />
                  </div>
                  <div className="h-[90%] w-[50%] p-2">
                    <div className="text-[14px] font-bold">
                      📚Create Topics:
                    </div>
                    <div className="text-[12px] font-medium">
                      Share Your Knowledge & Grow: Create in-depth topics to
                      engage your community, establish yourself as an expert,
                      and potentially earn income
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          {/* For Business */}
          <div
            className={`${
              state === 3
                ? "h-[90%] py-[5%] w-full text-black pn:max-sm:pb-[20%] pn:max-sm:h-[100%]  flex flex-col justify-center items-center"
                : "hidden"
            }`}
          >
            <div className="w-[60%] pn:max-sm:w-[90%]">
              <div className="text-white font-bold lg:text-[37px] md:text-[32px] duration-75 sm:text-[27px] vs:text-[22px] pn:text-[17px] text-center">
                Looking to join us? Get in touch!
              </div>
              <div className="text-white text-[16px] sm:text-[18px] text-center">
                Explore our exciting career opportunities, connect with us, and
                check out our latest ads. Plus, we offer guides and articles
                packed with invaluable tips and best practices.
              </div>
            </div>
            <div className="flex gap-4 pn:max-sm:flex-col mt-4 justify-center items-center">
              <a
                href="https://ads.grovyo.com"
                className="h-[360px] hover:scale-110 duration-100 hover:skew-y-3 w-[230px] rounded-2xl p-2 bg-[#EDCBCC]"
              >
                <div className="h-[50%] w-full">
                  <Image src={A} />
                </div>
                <div className="h-[50%] w-full flex-col flex justify-center items-center">
                  <div className="text-[24px] font-bold"> Grovyo ads</div>
                  <div className="text-center text-[14px]">
                    Streamlining Your Advertising Process. Save yourself from
                    the chaos of an unstructured ad process with Grovyo Ads.
                  </div>
                </div>
              </a>
              <a
                href="https://grovyo.com/careers"
                className="h-[360px] hover:scale-110 duration-100 hover:skew-y-3 w-[230px] rounded-2xl p-2 bg-[#F4F0E4]"
              >
                <div className="h-[50%] w-full">
                  <Image src={Car} />
                </div>
                <div className="h-[50%] w-full flex-col flex justify-center items-center">
                  <div className="text-[24px] font-bold"> Careers</div>
                  <div className="text-center text-[14px]">
                    Discover your next career move with us. Explore our diverse
                    range of career opportunities and take the next step towards
                    a rewarding and fulfilling career. Join us in shaping the
                    future!
                  </div>
                </div>
              </a>
              <a
                href="https://ads.grovyo.com/contact"
                className="h-[360px] hover:scale-110 duration-100 hover:skew-y-3 w-[230px] rounded-2xl p-2 bg-[#E7D472]"
              >
                <div className="h-[50%] w-full">
                  <Image src={Contact} />
                </div>
                <div className="h-[50%] w-full pt-4 flex-col flex justify-center items-center">
                  <div className="text-[24px] font-bold">Contact Us</div>
                  <div className="text-center text-[14px]">
                    Contact us to start the conversation. We're here to answer
                    your questions, hear your feedback, or just to say hello.
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        {/* foot */}
        <div className="h-[50px] w-full flex z-40 justify-between sm:hidden items-center bottom-0 fixed ">
          <div
            className="flex p-1 bg-[#f9f9f9] w-full justify-center items-center px-4 rounded-t-2xl text-white shadow-lg shadow-white-500/5
      bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ring-1 ring-[#f4f4f452] py-2"
          >
            <div
              onClick={() => {
                setState(1);
              }}
              className={`flex flex-col cursor-pointer justify-center items-center w-[100px] ${
                state === 1 ? "" : ""
              }`}
            >
              <div
                onClick={() => {
                  setState(1);
                }}
                className={`${
                  state === 1
                    ? "text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-white"
                    : "text-[#8C96A8]"
                }`}
              >
                Search
              </div>
              <div
                className={`${
                  state === 1
                    ? "h-[2px] w-[20px] bg-white rounded-t-md"
                    : "hidden"
                }`}
              ></div>
            </div>
            <div
              onClick={() => {
                setState(2);
              }}
              className={`flex flex-col cursor-pointer justify-start items-start pl-3 w-[100px] ${
                state === 2 ? "" : ""
              }`}
            >
              <div
                onClick={() => {
                  setState(2);
                }}
                className={`${
                  state === 2
                    ? "text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-white"
                    : "text-[#8C96A8]"
                }`}
              >
                Features
              </div>
              <div
                className={`${
                  state === 2
                    ? "h-[2px] w-[20px] bg-white rounded-t-md ml-6"
                    : "hidden"
                }`}
              ></div>
            </div>
            <div
              onClick={() => {
                setState(3);
              }}
              className={`flex flex-col cursor-pointer justify-center items-center w-[100px] ${
                state === 3 ? "" : ""
              }`}
            >
              <div
                className={`${
                  state === 3
                    ? " text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-white"
                    : " text-[#8C96A8]"
                }`}
              >
                For Business
              </div>
              <div
                className={`${
                  state === 3
                    ? "h-[2px] w-[20px] bg-white rounded-t-md"
                    : "hidden"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // return (
  //   <>
  //     <VideoCall />
  //   </>
  // );
}

export default page;
