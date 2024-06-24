"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Logo from "../assets/Logo.png";
// import comm from "../assets/comm.jpg";
// import stor from "../assets/stor.png";
import axios from "axios";
import Bio from "../component/Bio";
import Community from "../component/Community";
import Store from "../component/Store";
import Link from "next/link";
import { MdVerified } from "react-icons/md";

function page({ params }) {
  const [coms, setComs] = useState([]);

  const [bio, setBio] = useState();
  const [product, setProduct] = useState([]);
  const [user, setUser] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`https://work.grovyo.xyz/api/v1/getprositedetails/${params.id}`
      );
      setBio(res.data.data.userDetails);
      setComs(res.data.data.communitywithDps);
      setProduct(res.data.data.productsWithDps);
      setIsLoading(false);

      if (!res.data.success) {
        setUser(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [params.id]);

  if (!user) {
    return (
      <>
        <section className="relative z-10 flex select-none flex-col justify-center w-full  items-center bg-black h-screen py-[120px]">
          <div className="container w-full">
            <div className="w-full flex">
              <div className="w-full px-4">
                <div className="w-full text-center">
                  <h2 className="mb-2 text-[50px] font-bold leading-none text-white sm:text-[80px] md:text-[100px]">
                    404
                  </h2>
                  <h4 className="mb-3 text-[22px] font-semibold leading-tight text-white">
                    Oops! That page can't be found
                  </h4>
                  <p className="mb-8 text-lg text-white">
                    The page you are looking for it maybe deleted
                  </p>
                  <a
                    href="/"
                    className="inline-block rounded-lg border border-white px-8 py-3 text-center text-base font-semibold text-white transition hover:bg-blue-400 hover:text-primary"
                  >
                    Go To Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center no-scrollbar overflow-auto">
      <div className=" text-black overflow-auto no-scrollbar relative w-full h-full">

        {/* Header */}
        <div className=" justify-center items-center w-[100%] absolute flex h-[100px]">
          <div className=" w-full flex justify-between  items-center px-2 sm:px-5">
            {isLoading ?

              <div className="flex items-center px-3 rounded-3xl bg-slate-200 text-white shadow-md shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-15 ring-1 ring-[#f4f4f452] py-2">
                <div className="h-[45px] w-[45px] bg-slate-200 animate-pulse ring-2 ring-[#fff] rounded-2xl">

                </div>
                <div className="px-2 flex flex-col gap-2 -mt-1 pr-4 ">
                  <div className="text-[16px] flex items-center  text-[#fcfcfc] font-bold">

                    <div className=" w-[80px] h-[10px] bg-slate-200 animate-pulse ring-2 ring-[#fff] rounded-2xl"></div>


                  </div>
                  <div className=" w-[65px] h-[8px] bg-slate-200 animate-pulse ring-2 ring-[#fff] rounded-2xl">

                  </div>
                </div>
              </div>
              : <div className="flex px-2  rounded-3xl relative bg-[#545454] text-white shadow-lg shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-15 ring-1 ring-[#f4f4f452] py-2">
                <div className="h-[45px] w-[45px] ring-2 ring-[#fff] rounded-2xl">
                  <img
                    src={`${bio?.dp}`}
                    alt="dp"
                    className="rounded-2xl h-[45px] w-[45px] "
                  />
                </div>
                <div className="px-2 pr-4 ">
                  <div className="text-[16px] flex items-center  text-[#fcfcfc] font-bold">

                    <div className=" text-[#ffffff] pr-[2px] [text-shadow:1px_1px_2px_var(--tw-shadow-color)]">{bio?.fullname} </div>
                    {bio?.isverified && <MdVerified className="text-blue-700" />}

                  </div>
                  <div className="text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] text-[14px] font-medium">
                    @{bio?.username}
                  </div>
                </div>
              </div>}


            {(bio?.isCommunity || bio?.isStore) && (
              <div className={`flex ${(bio?.isAbout && (product.length > 0 || coms.length > 0)) ? "p-1 py-2 px-4" : "p-0"}  -ml-36 bg-[#545454] rounded-full relative pn:max-sm:hidden text-white shadow-lg shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ring-1 ring-[#f4f4f452] `}>
                {(bio?.isAbout && (product.length > 0 || coms.length > 0)) && (
                  <Link
                    href={"#about"}
                    onClick={() => {
                      setState(1);
                    }}
                    className={`flex flex-col cursor-pointer justify-center items-center  w-[100px] ${state === 1 ? "" : ""
                      }`}
                  >
                    <div
                      onClick={() => {
                        setState(1);
                      }}
                      className={`font-semibold ${state === 1
                        ? "text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-white"
                        : "text-black"
                        }`}
                    >
                      About
                    </div>
                    <div
                      className={`font-semibold ${state === 1
                        ? "h-[2px] w-[20px] bg-white rounded-t-md"
                        : "hidden"
                        }`}
                    ></div>
                  </Link>
                )}
                {(bio?.isCommunity && coms.length > 0) && (
                  <Link
                    href={"#community"}
                    onClick={() => {
                      setState(2);
                    }}
                    className={`flex flex-col cursor-pointer justify-start items-start pl-3 w-[100px] ${state === 2 ? "" : ""
                      }`}
                  >
                    <div
                      onClick={() => {
                        setState(2);
                      }}
                      className={`font-semibold ${state === 2
                        ? "text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-white"
                        : "text-black"
                        }`}
                    >
                      Community
                    </div>
                    <div
                      className={`${state === 2
                        ? "h-[2px] w-[20px] bg-white rounded-t-md ml-6"
                        : "hidden"
                        }`}
                    ></div>
                  </Link>
                )}
                {(bio?.isStore && product.length > 0) && (
                  <Link
                    href={"#store"}
                    onClick={() => {
                      setState(3);
                    }}
                    className={`flex flex-col cursor-pointer justify-center items-center w-[100px] ${state === 3 ? "" : ""
                      }`}
                  >
                    <div
                      className={`font-semibold ${state === 3
                        ? " text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-white"
                        : " text-black"
                        }`}
                    >
                      Store
                    </div>
                    <div
                      className={`${state === 3
                        ? "h-[2px] w-[20px] bg-white rounded-t-md"
                        : "hidden"
                        }`}
                    ></div>
                  </Link>
                )}
              </div>
            )}
            <a
              target="_blank"
              href={"https://login.grovyo.com/"}
              className="p-2 px-5 bg-blue-500 text-white rounded-2xl"
            >
              Sign up
            </a>
          </div>
        </div>
        <div>
          {isLoading ? (
            <div className="sm:h-[90vh] h-[80vh]  pn:max-sm:mt-[20%] bg-white w-full pn:max-sm:flex-col flex items-center justify-between">
              <div className="h-full w-[50%] pn:max-sm:h-[50%]  px-10 flex flex-col justify-center gap-2 items-start pn:max-sm:w-full">
                <div className="h-[100px] w-full shadow-sm bg-slate-200 animate-pulse rounded-xl"></div>
                <div className="h-[28px] w-[90%] sm:w-[85%] shadow-sm bg-slate-200 animate-pulse rounded-xl"></div>
                <div className="h-[28px] w-[90%] sm:w-[85%] shadow-sm bg-slate-200 animate-pulse rounded-xl"></div>
                {/* <div className="h-[18px] w-full shadow-sm bg-slate-200 animate-pulse rounded-xl"></div>
                <div className="h-[18px] w-full shadow-sm bg-slate-200 animate-pulse rounded-xl"></div> */}
                {/* <div className="h-[10px] w-full shadow-sm bg-slate-200 animate-pulse rounded-xl"></div>
                <div className="h-[10px] w-full shadow-sm bg-slate-200 animate-pulse rounded-xl"></div> */}
                <div className="h-[40px] w-[130px] bg-slate-200 mt-4 animate-pulse rounded-xl"></div>
              </div>
              <div className="h-full pn:max-sm:h-[50%] w-[50%] px-10 flex flex-col justify-center gap-2 items-center pn:max-sm:w-full">
                <div className="sm:h-[400px] w-[95%] h-[95%] sm:w-[400px] shadow-sm bg-slate-200 animate-pulse rounded-xl"></div>
              </div>
            </div>
          ) : (
            <>
              {((bio?.temp || bio?.temp1) && bio?.useDefaultProsite === false) ? (
                <>
                  {bio?.temp != "undefined" && (
                    <div
                      className="w-full h-[95vh] bg-white pn:max-sm:hidden"
                      dangerouslySetInnerHTML={{ __html: bio?.temp }}
                    ></div>
                  )}
                  {bio?.temp1 != "undefined" && (
                    <div
                      className="w-full h-[95vh] sm:hidden"
                      dangerouslySetInnerHTML={{ __html: bio?.temp1 }}
                    ></div>
                  )}
                </>
              ) : (
                <div className="flex justify-center pn:max-md:flex-col-reverse items-center w-[100%] h-[90vh]">
                  <div className="flex flex-col items-center justify-center w-[100%] bg-bggg bg-cover h-[80%] pn:max-sm:h-[100%]">

                    <div
                      id="about"
                      className="flex flex-col justify-center h-full items-center select-none"
                    >
                      <div
                        className={` ${isLoading ? "animate-pulse" : ""
                          }`}
                      >
                        {isLoading ? (
                          <div
                            className={`bg-[#f9f9f9] flex flex-col  space-y-3   sm:w-[80%] w-[97%] rounded-2xl md:rounded-[35px] pn:max-sm:p-5 sm:p-10 ${isLoading ? "animate-pulse" : ""
                              }`}
                          >
                            <div className="h-5 bg-slate-200 w-28 rounded-lg animate-pulse"></div>
                            <div className="h-5 bg-slate-200 w-32 rounded-lg animate-pulse"></div>
                            <div className="h-5 bg-slate-200 w-60 rounded-lg animate-pulse"></div>
                            <div className="h-5 bg-slate-200 w-48 rounded-lg animate-pulse"></div>
                            <div className="h-5 bg-slate-200 w-20 rounded-lg animate-pulse"></div>
                            <div className="flex w-full text-black items-center flex-wrap">
                              <div className="flex justify-between h-8 w-32 m-2 items-center space-x-2 bg-slate-200 animate-pulse rounded-lg">
                                {" "}
                              </div>
                              <div className="flex justify-between h-8 w-32 m-2 items-center space-x-2 bg-slate-200 animate-pulse rounded-lg">
                                {" "}
                              </div>
                              <div className="flex justify-between h-8 w-32 m-2 items-center space-x-2 bg-slate-200 animate-pulse rounded-lg">
                                {" "}
                              </div>
                              <div className="flex justify-between h-8 w-32 m-2 items-center space-x-2 bg-slate-200 animate-pulse rounded-lg">
                                {" "}
                              </div>
                              <div className="flex justify-between h-8 w-32 m-2 items-center space-x-2 bg-slate-200 animate-pulse rounded-lg">
                                {" "}
                              </div>
                            </div>
                          </div>
                        ) : (

                          <div className="bg-[#f9f9f9] px-4 w-[90vw] justify-center items-center relative text-[#424242] shadow-lg shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ring-1 ring-[#f4f4f452] flex flex-col space-y-3 rounded-2xl md:rounded-[35px] pn:max-sm:p-5 sm:p-10">
                            <Bio bio={bio} />
                          </div>

                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* About section */}
          {/* correct krna hai */}
          {/* {((bio?.temp || bio?.temp1) && bio?.useDefaultProsite === false) && ( */}
          <div
            id="about"
            className="flex flex-col justify-center py-4 items-center select-none"
          >
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
            />
            <div
              style={{ fontFamily: "Nunito" }}
              className=" text-black text-[26px] pb-3 font-bold"
            >
              About
            </div>
            <div
              className={`bg-[#f9f9f9] flex flex-col min-h-full space-y-3 sm:w-[80%] w-[97%] rounded-2xl md:rounded-[35px] pn:max-sm:p-5 sm:p-10 ${isLoading ? "animate-pulse" : ""
                }`}
            >
              {isLoading ? (
                <div
                  className={`bg-[#f9f9f9] flex flex-col  space-y-3   sm:w-[80%] w-[97%] rounded-2xl md:rounded-[35px] pn:max-sm:p-5 sm:p-10 ${isLoading ? "animate-pulse" : ""
                    }`}
                >
                  <div className="h-5 bg-slate-200 w-full rounded-lg animate-pulse"></div>
                  <div className="h-5 bg-slate-200 w-full sm:w-[90%] rounded-lg animate-pulse"></div>
                  <div className="h-5 bg-slate-200 w-full sm:w-[80%] rounded-lg animate-pulse"></div>
                  <div className="h-5 bg-slate-200 w-48 rounded-lg animate-pulse"></div>
                  <div className="h-5 bg-slate-200 w-20 rounded-lg animate-pulse"></div>
                  <div className="flex w-full text-black items-center flex-wrap">
                    <div className="flex justify-between h-8 sm:w-32 m-2 items-center space-x-2 bg-slate-200 animate-pulse rounded-lg">
                      {" "}
                    </div>
                    <div className="flex justify-between h-8 sm:w-32 m-2 items-center space-x-2 bg-slate-200 animate-pulse rounded-lg">
                      {" "}
                    </div>
                    <div className="flex justify-between h-8 sm:w-32 m-2 items-center space-x-2 bg-slate-200 animate-pulse rounded-lg">
                      {" "}
                    </div>
                    <div className="flex justify-between h-8 sm:w-32 m-2 items-center space-x-2 bg-slate-200 animate-pulse rounded-lg">
                      {" "}
                    </div>
                    <div className="flex justify-between h-8 sm:w-32 m-2 items-center space-x-2 bg-slate-200 animate-pulse rounded-lg">
                      {" "}
                    </div>
                  </div>
                </div>
              ) : (

                <div className="flex flex-col justify-center  items-center sm:w-[100%] w-[100%] ">
                  <Bio bio={bio} />
                </div>

              )}
            </div>
          </div>
          {/* correct krna hai */}
          {/* )} */}
          <div className="h-[1px] w-[90%] flex self-center border-dotted border-b-2 border-light-blue-500"></div>
          {/* community section*/}


          <div className="flex flex-col ">

            {isLoading ? (
              <div
                id="community"
                className="flex flex-col w-[100%] py-4 h-full md:h-[80vh] space-y-2 items-center"
              >
                <div
                  style={{ fontFamily: "Nunito" }}
                  className=" text-black text-[26px] font-bold"
                >
                  Communities
                </div>
                <div className="flex flex-col sm:h-[70%] bg-white justify-center md:gap-7 pn:max-md:gap-5 pn:max-md:px-[7%] px-6 items-center">
                  <div className="flex pn:max-sm:flex-col bg-white justify-center md:gap-7 pn:max-md:gap-5 pn:max-md:px-[7%] px-6 items-center gap-2 mt-8">
                    <div className="flex flex-col items-center max-w-[470px] h-[400px] min-w-[340px] border-[1px] md:max-lg:w-[400px] space-y-3 border-[#D4D2E3] rounded-3xl py-3">
                      <div className="w-[90px] h-[90px] bg-slate-200 animate-pulse rounded-[40px] shadow-md ring-1 ring-white"></div>
                      <div className="text-2xl text-center  bg-slate-200 animate-pulse w-28 rounded-xl h-10 font-semibold my-2"></div>

                      <div className="flex items-center">
                        <div className="flex flex-row justify-start z-0 w-[100%] items-center">
                          <>
                            <div className="h-[35px] w-[35px] rounded-2xl z-30 bg-slate-200 animate-pulse " />
                            <div className="h-[35px] w-[35px] rounded-2xl z-20 -ml-[10px] bg-slate-200 animate-pulse " />
                            <div className="h-[35px] w-[35px] rounded-2xl z-10 -ml-[10px] bg-slate-200 animate-pulse " />
                            <div className="h-[35px] w-[35px] rounded-2xl z-0 -ml-[10px] bg-slate-200 animate-pulse " />
                          </>
                        </div>
                        <div className=" bg-slate-200 animate-pulse w-16 h-4 rounded-md"></div>
                      </div>
                      <div className="w-[85%] -space-y-[0.1px]">
                        <div className="font-medium w-28 bg-slate-200 rounded-lg text-[#3e3e3e]"></div>
                        <div className="text-[16px] text-center pt-2 h-28 bg-slate-200 text-ellipsis overflow-hidden  rounded-2xl  my-[14px]"></div>
                      </div>
                      <button className="text-white rounded-full bg-slate-200 animate-pulse w-[85%] h-[50px]"></button>
                    </div>
                    <div className="flex flex-col items-center max-w-[470px] h-[400px] min-w-[340px] border-[1px] md:max-lg:w-[400px] space-y-3 border-[#D4D2E3] rounded-3xl py-3">
                      <div className="w-[90px] h-[90px] bg-slate-200 animate-pulse rounded-[40px] shadow-md ring-1 ring-white"></div>
                      <div className="text-2xl text-center  bg-slate-200 animate-pulse w-28 rounded-xl h-10 font-semibold my-2"></div>

                      <div className="flex items-center">
                        <div className="flex flex-row justify-start z-0 w-[100%] items-center">
                          <>
                            <div className="h-[35px] w-[35px] rounded-2xl z-30 bg-slate-200 animate-pulse " />
                            <div className="h-[35px] w-[35px] rounded-2xl z-20 -ml-[10px] bg-slate-200 animate-pulse " />
                            <div className="h-[35px] w-[35px] rounded-2xl z-10 -ml-[10px] bg-slate-200 animate-pulse " />
                            <div className="h-[35px] w-[35px] rounded-2xl z-0 -ml-[10px] bg-slate-200 animate-pulse " />
                          </>
                        </div>
                        <div className=" bg-slate-200 animate-pulse w-16 h-4 rounded-md"></div>
                      </div>
                      <div className="w-[85%] -space-y-[0.1px]">
                        <div className="font-medium w-28 bg-slate-200 rounded-lg text-[#3e3e3e]"></div>
                        <div className="text-[16px] text-center pt-2 h-28 bg-slate-200 text-ellipsis overflow-hidden  rounded-2xl  my-[14px]"></div>
                      </div>
                      <button className="text-white rounded-full bg-slate-200 animate-pulse w-[85%] h-[50px]"></button>
                    </div>
                    <div className="flex flex-col pn:max-lg:hidden items-center max-w-[470px] h-[400px] min-w-[340px] border-[1px] md:max-lg:w-[400px] space-y-3 border-[#D4D2E3] rounded-3xl py-3">
                      <div className="w-[90px] h-[90px] bg-slate-200 animate-pulse rounded-[40px] shadow-md ring-1 ring-white"></div>
                      <div className="text-2xl text-center  bg-slate-200 animate-pulse w-28 rounded-xl h-10 font-semibold my-2"></div>

                      <div className="flex items-center">
                        <div className="flex flex-row justify-start z-0 w-[100%] items-center">
                          <>
                            <div className="h-[35px] w-[35px] rounded-2xl z-30 bg-slate-200 animate-pulse " />
                            <div className="h-[35px] w-[35px] rounded-2xl z-20 -ml-[10px] bg-slate-200 animate-pulse " />
                            <div className="h-[35px] w-[35px] rounded-2xl z-10 -ml-[10px] bg-slate-200 animate-pulse " />
                            <div className="h-[35px] w-[35px] rounded-2xl z-0 -ml-[10px] bg-slate-200 animate-pulse " />
                          </>
                        </div>
                        <div className=" bg-slate-200 animate-pulse w-16 h-4 rounded-md"></div>
                      </div>
                      <div className="w-[85%] -space-y-[0.1px]">
                        <div className="font-medium w-28 bg-slate-200 rounded-lg text-[#3e3e3e]"></div>
                        <div className="text-[16px] text-center pt-2 h-28 bg-slate-200 text-ellipsis overflow-hidden  rounded-2xl  my-[14px]"></div>
                      </div>
                      <button className="text-white rounded-full bg-slate-200 animate-pulse w-[85%] h-[50px]"></button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {coms.length > 0 ? (
                  <div
                    id="community"
                    className="flex flex-col w-[100%] justify-center py-4 space-y-2 items-center"
                  >
                    {" "}
                    <div
                      style={{ fontFamily: "Nunito" }}
                      className=" text-black text-[26px] font-bold"
                    >
                      Communities
                    </div>
                    <Community coms={coms} />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}

            {/* Store section */}

            {isLoading ? (
              <div
                id="store"
                className="flex flex-col py-4 w-[100%] justify-evenly items-center space-y-2"
              >
                <link
                  rel="stylesheet"
                  href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
                />
                <div
                  style={{ fontFamily: "Nunito" }}
                  className=" text-black text-[26px] font-bold"
                >
                  Store
                </div>
                {/* <div className="flex pn:max-sm:flex-col gap-2">
                  <div className="flex flex-col items-center max-w-[470px] h-[400px] min-w-[340px] border-[1px] md:max-lg:w-[400px] space-y-3 border-[#D4D2E3] rounded-3xl py-3">
                    <div className="w-[90px] h-[90px] bg-slate-200 animate-pulse rounded-[40px] shadow-md ring-1 ring-white"></div>
                    <div className="text-2xl text-center  bg-slate-200 animate-pulse w-28 rounded-xl h-10 font-semibold my-2"></div>

                    <div className="flex items-center">
                      <div className="flex flex-row justify-start z-0 w-[100%] items-center">
                        <>
                          <div className="h-[35px] w-[35px] rounded-2xl z-30 bg-slate-200 animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-20 -ml-[10px] bg-slate-200 animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-10 -ml-[10px] bg-slate-200 animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-0 -ml-[10px] bg-slate-200 animate-pulse " />
                        </>
                      </div>
                      <div className=" bg-slate-200 animate-pulse w-16 h-4 rounded-md"></div>
                    </div>
                    <div className="w-[85%] -space-y-[0.1px]">
                      <div className="font-medium w-28 bg-slate-200 rounded-lg text-[#3e3e3e]"></div>
                      <div className="text-[16px] text-center pt-2 h-28 bg-slate-200 text-ellipsis overflow-hidden  rounded-2xl  my-[14px]"></div>
                    </div>
                    <button className="text-white rounded-full bg-slate-200 animate-pulse w-[85%] h-[50px]"></button>
                  </div>
                  <div className="flex flex-col items-center max-w-[470px] h-[400px] min-w-[340px] border-[1px] md:max-lg:w-[400px] space-y-3 border-[#D4D2E3] rounded-3xl py-3">
                    <div className="w-[90px] h-[90px] bg-slate-200 animate-pulse rounded-[40px] shadow-md ring-1 ring-white"></div>
                    <div className="text-2xl text-center  bg-slate-200 animate-pulse w-28 rounded-xl h-10 font-semibold my-2"></div>

                    <div className="flex items-center">
                      <div className="flex flex-row justify-start z-0 w-[100%] items-center">
                        <>
                          <div className="h-[35px] w-[35px] rounded-2xl z-30 bg-slate-200 animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-20 -ml-[10px] bg-slate-200 animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-10 -ml-[10px] bg-slate-200 animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-0 -ml-[10px] bg-slate-200 animate-pulse " />
                        </>
                      </div>
                      <div className=" bg-slate-200 animate-pulse w-16 h-4 rounded-md"></div>
                    </div>
                    <div className="w-[85%] -space-y-[0.1px]">
                      <div className="font-medium w-28 bg-slate-200 rounded-lg text-[#3e3e3e]"></div>
                      <div className="text-[16px] text-center pt-2 h-28 bg-slate-200 text-ellipsis overflow-hidden  rounded-2xl  my-[14px]"></div>
                    </div>
                    <button className="text-white rounded-full bg-slate-200 animate-pulse w-[85%] h-[50px]"></button>
                  </div>
                  <div className="flex flex-col items-center max-w-[470px] h-[400px] min-w-[340px] border-[1px] md:max-lg:w-[400px] space-y-3 border-[#D4D2E3] rounded-3xl py-3">
                    <div className="w-[90px] h-[90px] bg-slate-200 animate-pulse rounded-[40px] shadow-md ring-1 ring-white"></div>
                    <div className="text-2xl text-center  bg-slate-200 animate-pulse w-28 rounded-xl h-10 font-semibold my-2"></div>

                    <div className="flex items-center">
                      <div className="flex flex-row justify-start z-0 w-[100%] items-center">
                        <>
                          <div className="h-[35px] w-[35px] rounded-2xl z-30 bg-slate-200 animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-20 -ml-[10px] bg-slate-200 animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-10 -ml-[10px] bg-slate-200 animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-0 -ml-[10px] bg-slate-200 animate-pulse " />
                        </>
                      </div>
                      <div className=" bg-slate-200 animate-pulse w-16 h-4 rounded-md"></div>
                    </div>
                    <div className="w-[85%] -space-y-[0.1px]">
                      <div className="font-medium w-28 bg-slate-200 rounded-lg text-[#3e3e3e]"></div>
                      <div className="text-[16px] text-center pt-2 h-28 bg-slate-200 text-ellipsis overflow-hidden  rounded-2xl  my-[14px]"></div>
                    </div>
                    <button className="text-white rounded-full bg-slate-200 animate-pulse w-[85%] h-[50px]"></button>
                  </div>
                </div> */}

                <div className="flex justify-center items-center w-full">
                  <div className="sm:w-[80%] w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-3 w-full items-center sm:gap-6 gap-3">
                      <div

                        className="flex flex-col sm:hidden justify-center gap-3 border-[2px] border-[#f9f9f9] pn:max-sm:min-w-[180px] rounded-xl w-full sm:max-w-[400px] p-2 "
                      >
                        <div className=" flex-wrap flex justify-center px-3 items-center rounded-lg py-3">

                          <div

                            className="sm:w-[170px] rounded-xl animate-pulse bg-slate-200 w-full h-[170px] "
                          ></div>

                        </div>
                        <div className="flex gap-2 items-center  my-2 text-lg font-medium">
                          <div className="h-5 bg-slate-200 w-[70%] rounded-lg animate-pulse">

                          </div>
                          <div className="h-5 bg-slate-200 w-[70%] rounded-lg animate-pulse">

                          </div>

                        </div>
                        <div className="h-5 bg-slate-200 w-[85%] rounded-lg animate-pulse">

                        </div>
                        <div

                          className="text-black bg-slate-200 w-full animate-pulse rounded-full flex justify-center items-center gap-2 h-9"
                        >

                        </div>

                      </div>
                      <div

                        className="flex flex-col justify-center gap-3 border-[2px] border-[#f9f9f9] pn:max-sm:min-w-[180px] rounded-xl w-full sm:max-w-[400px] p-2 "
                      >
                        <div className=" flex-wrap flex justify-center px-3 items-center rounded-lg py-3">

                          <div

                            className="sm:w-full rounded-xl animate-pulse bg-slate-200 w-full h-[180px] "
                          ></div>

                        </div>
                        <div className="flex gap-2 items-center  my-2 text-lg font-medium">
                          <div className="h-5 bg-slate-200 sm:w-[160px] w-[70%] rounded-lg animate-pulse">

                          </div>
                          <div className="h-5 bg-slate-200 sm:w-[160px]  w-[70%] rounded-lg animate-pulse">

                          </div>

                        </div>
                        <div className="h-5 bg-slate-200 md:w-[250px]  w-[85%] rounded-lg animate-pulse">

                        </div>
                        <div

                          className="text-black bg-slate-200 w-full animate-pulse rounded-full flex justify-center items-center gap-2 h-9"
                        >

                        </div>

                      </div>
                      <div

                        className="flex flex-col justify-center gap-3 border-[2px] border-[#f9f9f9] pn:max-sm:min-w-[180px] rounded-xl w-full sm:max-w-[400px] p-2 "
                      >
                        <div className=" flex-wrap flex justify-center px-3 items-center rounded-lg py-3">

                          <div

                            className="sm:w-full rounded-xl animate-pulse bg-slate-200 w-full h-[180px] "
                          ></div>

                        </div>
                        <div className="flex gap-2 items-center  my-2 text-lg font-medium">
                          <div className="h-5 bg-slate-200 sm:w-[160px] w-[70%] rounded-lg animate-pulse">

                          </div>
                          <div className="h-5 bg-slate-200 sm:w-[160px]  w-[70%] rounded-lg animate-pulse">

                          </div>

                        </div>
                        <div className="h-5 bg-slate-200 md:w-[250px]  w-[85%] rounded-lg animate-pulse">

                        </div>
                        <div

                          className="text-black bg-slate-200 w-full animate-pulse rounded-full flex justify-center items-center gap-2 h-9"
                        >

                        </div>

                      </div>
                      <div

                        className="flex flex-col justify-center gap-3 border-[2px] border-[#f9f9f9] pn:max-sm:min-w-[180px] rounded-xl w-full sm:max-w-[400px] p-2 "
                      >
                        <div className=" flex-wrap flex justify-center px-3 items-center rounded-lg py-3">

                          <div

                            className="sm:w-full rounded-xl animate-pulse bg-slate-200 w-full h-[180px] "
                          ></div>

                        </div>
                        <div className="flex gap-2 items-center  my-2 text-lg font-medium">
                          <div className="h-5 bg-slate-200 sm:w-[160px] w-[70%] rounded-lg animate-pulse">

                          </div>
                          <div className="h-5 bg-slate-200 sm:w-[160px]  w-[70%] rounded-lg animate-pulse">

                          </div>

                        </div>
                        <div className="h-5 bg-slate-200 md:w-[250px]  w-[85%] rounded-lg animate-pulse">

                        </div>
                        <div

                          className="text-black bg-slate-200 w-full animate-pulse rounded-full flex justify-center items-center gap-2 h-9"
                        >

                        </div>

                      </div>

                    </div>
                  </div>
                </div>




              </div>
            ) : (
              <>
                {product.length > 0 ? (
                  <div
                    id="store"
                    className="flex flex-col py-4 w-[100%] justify-center items-center space-y-2"
                  >
                    <link
                      rel="stylesheet"
                      href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
                    />
                    <div
                      style={{ fontFamily: "Nunito" }}
                      className=" text-black text-[26px] font-bold"
                    >
                      Store
                    </div>
                    <div className="flex justify-center w-full items-center">
                      <Store product={product} isStore={bio.isStore} />
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </>
            )}

          </div>

          <div className=" flex justify-center pt-2 items-center px-4">
            <div className=" w-[100%] h-[1px] rounded-full"></div>
          </div>
          <div className="py-2 items-center  justify-between  pn:max-sm:justify-center px-2 w-[100%] mt-4 flex flex-row">
            <div className="flex flex-row items-center pn:max-sm:hidden gap-2">
              <Image src={Logo} className="h-[35px] w-[35px] rounded-2xl" />
              <div className="text-black text-[18px] font-bold font-sans">
                Grovyo
              </div>
            </div>
            <div className="text-black text-[12px] text-center font-sans">
              Copyright © 2023 Grovyo Templates | All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default page;
