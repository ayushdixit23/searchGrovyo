"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Logo from "../assets/Logo.png";
import styles from "../CustomScrollbarComponent.module.css";
import Image from "next/image";
import Link from "next/link";
import { MdVerified } from "react-icons/md";
import Bio from "../component/Bio";
import Community from "../component/Community";
import Store from "../component/Store";
import { useAuthContext } from "../utils/AuthWrapper";
import { IoIosChatbubbles } from "react-icons/io";
import { API } from "@/Essentials";
import toast from "react-hot-toast";
import Loader from "../component/Loader";

const page = ({ params }) => {
  const [coms, setComs] = useState([]);
  const { data, auth } = useAuthContext();
  const [bio, setBio] = useState(null);
  const [product, setProduct] = useState([]);
  const [user, setUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState("");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Prosite",
    name: bio?.fullname,
    image: bio?.dp,
    username: bio?.username,
    url: `https://grovyo.com/${params?.id}`, // Add your website URL here if relevant
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        // `https://work.grovyo.xyz/api/v1/getprositedetails/${params.id}`
        `${API}/v1/getprositedetails/${params.id}`
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

  const createChatRequest = async () => {
    try {
      if (auth) {
        setLoading(true);
        const res = await axios.post(`${API}/createmessagereqs`, {
          sender: data?.id,
          reciever: bio?.id,
        });

        if (res.data.success) {
          toast.success("Chat Request Send!");
        } else {
          toast.error("Something Went Wrong!");
        }
      } else {
        toast.error("You are Not Login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [params.id]);

  // console.log(bio, "bio");
  // console.log(coms, "coms");
  // console.log(product, "product");

  if (loading) {
    return (
      <>
        <div className="fixed w-screen h-screen backdrop-blur-sm bg-black opacity-50 inset-0">
          <Loader />
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <div className="h-screen w-full">
          <div
            className={`h-full w-full ${styles.customScrollbar} overflow-y-scroll`}
          >
            {/* header */}
            <div className="flex w-full justify-between items-center dark:bg-[#0D0D0D] px-2 sm:px-5">
              <div className="flex items-center mt-4 py-3 rounded-3xl px-2 bg-slate-200 dark:bg-[#0D0D0D] text-white shadow-md shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-15 ring-1 dark:ring-[#1A1D21] ring-[#f4f4f452] ">
                <div className="h-[45px] w-[45px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse ring-2 dark:ring-0  ring-[#fff] rounded-2xl"></div>
                <div className="px-2 flex flex-col gap-2 -mt-1 pr-4 ">
                  <div className="text-[16px] flex items-center  text-[#fcfcfc] font-bold">
                    <div className=" w-[80px] h-[10px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse ring-2 dark:ring-0  ring-[#fff] rounded-2xl"></div>
                  </div>
                  <div className=" w-[65px] h-[8px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse ring-2 dark:ring-0  ring-[#fff] rounded-2xl"></div>
                </div>
              </div>
              <div className="w-[60px] h-[34px] shadow-sm bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-xl"></div>
            </div>

            {/* prosite body */}
            <div className="h-[80vh] pn:max-sm:mt-[7%] bg-white dark:bg-[#0D0D0D] w-full pn:max-sm:flex-col flex items-center justify-between">
              <div className="h-full w-[50%] pn:max-sm:h-[50%] px-7 sm:px-10 flex flex-col justify-center gap-2 items-start pn:max-sm:w-full">
                <div className="h-[100px] w-full shadow-sm bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-xl"></div>
                <div className="h-[28px] w-[90%] sm:w-[85%] shadow-sm bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-xl"></div>
                <div className="h-[28px] w-[90%] sm:w-[85%] shadow-sm bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-xl"></div>

                <div className="h-[40px] w-[130px] bg-slate-200 dark:bg-[#1A1D21] mt-4 animate-pulse rounded-xl"></div>
              </div>
              <div className="h-full pn:max-sm:h-[50%] w-[50%] px-7 sm:px-10 flex flex-col justify-center gap-2 items-center pn:max-sm:w-full">
                <div className="sm:h-[400px] w-[95%] h-[95%] sm:w-[400px] shadow-sm bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-xl"></div>
              </div>
            </div>

            {/* bio */}
            <div className="flex flex-col gap-2 justify-center items-center w-full">
              <div
                style={{ fontFamily: "Nunito" }}
                className=" text-black dark:text-white text-[26px] font-bold"
              >
                About
              </div>
              <div
                className={`bg-[#f9f9f9] dark:bg-[#0d0d0d] border dark:border-[#1A1D21] flex flex-col  space-y-3 sm:w-[80%] w-[97%] rounded-2xl md:rounded-[35px] pn:max-sm:p-5 sm:p-10 ${
                  isLoading ? "animate-pulse" : ""
                }`}
              >
                <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] w-28 rounded-lg animate-pulse"></div>
                <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] w-32 rounded-lg animate-pulse"></div>
                <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] w-60 rounded-lg animate-pulse"></div>
                <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] w-48 rounded-lg animate-pulse"></div>
                <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] w-20 rounded-lg animate-pulse"></div>
                <div className="flex gap-3 w-full text-black dark:text-white items-center flex-wrap">
                  <div className="flex justify-between h-8 w-32 items-center space-x-2 bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-lg">
                    {" "}
                  </div>
                  <div className="flex justify-between h-8 w-32 items-center space-x-2 bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-lg">
                    {" "}
                  </div>
                  <div className="flex justify-between h-8 w-32 items-center space-x-2 bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-lg">
                    {" "}
                  </div>
                  <div className="flex justify-between h-8 w-32 items-center space-x-2 bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-lg">
                    {" "}
                  </div>
                  <div className="flex justify-between h-8 w-32 items-center space-x-2 bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-lg">
                    {" "}
                  </div>
                </div>
              </div>
            </div>

            {/* community */}
            <div
              id="community"
              className="flex flex-col w-[100%] mt-3 py-4 md:h-[80vh] space-y-2 items-center"
            >
              <div
                style={{ fontFamily: "Nunito" }}
                className=" text-black dark:text-white text-[26px] font-bold"
              >
                Communities
              </div>
              <div className="flex flex-col sm:h-[70%] h-full bg-white dark:bg-[#0D0D0D] justify-center md:gap-7 pn:max-md:gap-5 pn:max-md:px-[7%] px-6 items-center">
                <div className="flex pn:max-sm:flex-col bg-white dark:bg-[#0D0D0D] justify-center md:gap-7 pn:max-md:gap-5 pn:max-md:px-[7%] px-6 items-center gap-2 mt-8">
                  <div className="flex flex-col items-center sm:max-w-[470px] max-w-[350px] h-[400px] min-w-[340px] border-[1px] md:max-lg:w-[400px] gap-3 dark:border-[#1A1D21] border-[#D4D2E3] rounded-3xl py-3">
                    <div className="w-[90px] h-[90px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-[40px] shadow-md ring-1 dark:ring-[#1A1D21] ring-white"></div>
                    <div className="text-2xl text-center  bg-slate-200 dark:bg-[#1A1D21] animate-pulse w-28 rounded-xl h-10 font-semibold my-2"></div>

                    <div className="flex items-center">
                      <div className="flex flex-row justify-start z-0 w-[100%] items-center h-full">
                        <>
                          <div className="h-[35px] w-[35px] rounded-2xl z-30 bg-slate-200 dark:bg-[#1A1D21] animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-20 -ml-[10px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-10 -ml-[10px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-0 -ml-[10px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse " />
                        </>
                      </div>
                      <div className=" bg-slate-200 dark:bg-[#1A1D21] animate-pulse w-16 h-4 rounded-md"></div>
                    </div>
                    <div className="w-[85%] -space-y-[0.1px]">
                      <div className="font-medium w-28 bg-slate-200 dark:bg-[#1A1D21] rounded-lg text-[#3e3e3e]"></div>
                      <div className="text-[16px] text-center pt-2 h-28 bg-slate-200 dark:bg-[#1A1D21] text-ellipsis overflow-hidden  rounded-2xl  my-[14px]"></div>
                    </div>
                    <button className="text-white rounded-full bg-slate-200 dark:bg-[#1A1D21] animate-pulse w-[85%] h-[50px]"></button>
                  </div>
                  <div className="flex flex-col items-center sm:max-w-[470px] max-w-[350px] h-[400px] min-w-[340px] border-[1px] md:max-lg:w-[400px] gap-3 dark:border-[#1A1D21] border-[#D4D2E3] rounded-3xl py-3">
                    <div className="w-[90px] h-[90px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-[40px] shadow-md ring-1 dark:ring-[#1A1D21] ring-white"></div>
                    <div className="text-2xl text-center  bg-slate-200 dark:bg-[#1A1D21] animate-pulse w-28 rounded-xl h-10 font-semibold my-2"></div>

                    <div className="flex items-center">
                      <div className="flex flex-row justify-start z-0 w-[100%] items-center">
                        <>
                          <div className="h-[35px] w-[35px] rounded-2xl z-30 bg-slate-200 dark:bg-[#1A1D21] animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-20 -ml-[10px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-10 -ml-[10px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-0 -ml-[10px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse " />
                        </>
                      </div>
                      <div className=" bg-slate-200 dark:bg-[#1A1D21] animate-pulse w-16 h-4 rounded-md"></div>
                    </div>
                    <div className="w-[85%] -space-y-[0.1px]">
                      <div className="font-medium w-28 bg-slate-200 dark:bg-[#1A1D21] rounded-lg text-[#3e3e3e]"></div>
                      <div className="text-[16px] text-center pt-2 h-28 bg-slate-200 dark:bg-[#1A1D21] text-ellipsis overflow-hidden  rounded-2xl  my-[14px]"></div>
                    </div>
                    <button className="text-white rounded-full bg-slate-200 dark:bg-[#1A1D21] animate-pulse w-[85%] h-[50px]"></button>
                  </div>
                  <div className="flex flex-col pn:max-lg:hidden items-center sm:max-w-[470px] max-w-[350px] h-[400px] min-w-[340px] border-[1px] md:max-lg:w-[400px] gap-3 dark:border-[#1A1D21] border-[#D4D2E3] rounded-3xl py-3">
                    <div className="w-[90px] h-[90px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse rounded-[40px] shadow-md ring-1 dark:ring-[#1A1D21] ring-white"></div>
                    <div className="text-2xl text-center  bg-slate-200 dark:bg-[#1A1D21] animate-pulse w-28 rounded-xl h-10 font-semibold my-2"></div>

                    <div className="flex items-center">
                      <div className="flex flex-row justify-start z-0 w-[100%] items-center">
                        <>
                          <div className="h-[35px] w-[35px] rounded-2xl z-30 bg-slate-200 dark:bg-[#1A1D21] animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-20 -ml-[10px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-10 -ml-[10px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse " />
                          <div className="h-[35px] w-[35px] rounded-2xl z-0 -ml-[10px] bg-slate-200 dark:bg-[#1A1D21] animate-pulse " />
                        </>
                      </div>
                      <div className=" bg-slate-200 dark:bg-[#1A1D21] animate-pulse w-16 h-4 rounded-md"></div>
                    </div>
                    <div className="w-[85%] -space-y-[0.1px]">
                      <div className="font-medium w-28 bg-slate-200 dark:bg-[#1A1D21] rounded-lg text-[#3e3e3e]"></div>
                      <div className="text-[16px] text-center pt-2 h-28 bg-slate-200 dark:bg-[#1A1D21] text-ellipsis overflow-hidden  rounded-2xl  my-[14px]"></div>
                    </div>
                    <button className="text-white rounded-full bg-slate-200 dark:bg-[#1A1D21] animate-pulse w-[85%] h-[50px]"></button>
                  </div>
                </div>
              </div>
            </div>

            {/* store */}
            <div
              id="store"
              className="flex flex-col py-4 w-[100% justify-evenly items-center gap-2"
            >
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
              />
              <div
                style={{ fontFamily: "Nunito" }}
                className=" text-black dark:text-white text-[26px] font-bold"
              >
                Store
              </div>

              <div className="flex justify-center items-center w-full">
                <div className="sm:w-[80%] w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 w-full items-center sm:gap-6 gap-3">
                    <div className="flex flex-col sm:hidden justify-center gap-3 border-[2px] dark:border-[#1A1D21] light:border-[#f9f9f9]  rounded-xl w-full sm:max-w-[400px] p-2 ">
                      <div className=" flex-wrap flex justify-center px-3 items-center rounded-lg py-3">
                        <div className="sm:w-[170px] rounded-xl animate-pulse bg-slate-200 dark:bg-[#1A1D21] w-full h-[170px] "></div>
                      </div>
                      <div className="flex gap-2 items-center  my-2 text-lg font-medium">
                        <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] w-[70%] rounded-lg animate-pulse"></div>
                        <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] w-[70%] rounded-lg animate-pulse"></div>
                      </div>
                      <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] w-[85%] rounded-lg animate-pulse"></div>
                      <div className="text-black bg-slate-200 dark:bg-[#1A1D21] w-full animate-pulse rounded-full flex justify-center items-center gap-2 h-9"></div>
                    </div>
                    <div className="flex flex-col justify-center gap-3 border-[2px] dark:border-[#1A1D21] light:border-[#f9f9f9]  rounded-xl w-full sm:max-w-[400px] p-2 ">
                      <div className=" flex-wrap flex justify-center px-3 items-center rounded-lg py-3">
                        <div className="sm:w-[170px] rounded-xl animate-pulse bg-slate-200 dark:bg-[#1A1D21] w-full h-[170px] "></div>
                      </div>
                      <div className="flex gap-2 items-center  my-2 text-lg font-medium">
                        <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] w-[70%] rounded-lg animate-pulse"></div>
                        <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] w-[70%] rounded-lg animate-pulse"></div>
                      </div>
                      <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] w-[85%] rounded-lg animate-pulse"></div>
                      <div className="text-black bg-slate-200 dark:bg-[#1A1D21] w-full animate-pulse rounded-full flex justify-center items-center gap-2 h-9"></div>
                    </div>
                    <div className="flex flex-col justify-center gap-3 border-[2px] dark:border-[#1A1D21] light:border-[#f9f9f9]  rounded-xl w-full sm:max-w-[400px] p-2 ">
                      <div className=" flex-wrap flex justify-center px-3 items-center rounded-lg py-3">
                        <div className="sm:w-full rounded-xl animate-pulse bg-slate-200 dark:bg-[#1A1D21] w-full h-[180px] "></div>
                      </div>
                      <div className="flex gap-2 items-center  my-2 text-lg font-medium">
                        <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] sm:w-[160px] w-[70%] rounded-lg animate-pulse"></div>
                        <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] sm:w-[160px]  w-[70%] rounded-lg animate-pulse"></div>
                      </div>
                      <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] md:w-[250px]  w-[85%] rounded-lg animate-pulse"></div>
                      <div className="text-black bg-slate-200 dark:bg-[#1A1D21] w-full animate-pulse rounded-full flex justify-center items-center gap-2 h-9"></div>
                    </div>
                    <div className="flex flex-col justify-center gap-3 border-[2px] dark:border-[#1A1D21] light:border-[#f9f9f9]  rounded-xl w-full sm:max-w-[400px] p-2 ">
                      <div className=" flex-wrap flex justify-center px-3 items-center rounded-lg py-3">
                        <div className="sm:w-full rounded-xl animate-pulse bg-slate-200 dark:bg-[#1A1D21] w-full h-[180px] "></div>
                      </div>
                      <div className="flex gap-2 items-center  my-2 text-lg font-medium">
                        <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] sm:w-[160px] w-[70%] rounded-lg animate-pulse"></div>
                        <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] sm:w-[160px]  w-[70%] rounded-lg animate-pulse"></div>
                      </div>
                      <div className="h-5 bg-slate-200 dark:bg-[#1A1D21] md:w-[250px]  w-[85%] rounded-lg animate-pulse"></div>
                      <div className="text-black bg-slate-200 dark:bg-[#1A1D21] w-full animate-pulse rounded-full flex justify-center items-center gap-2 h-9"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* footer */}

            <div className=" flex justify-center pt-2 items-center px-4">
              <div className=" w-[100%] h-[1px] rounded-full"></div>
            </div>
            <div className="py-2 items-center  justify-between  pn:max-sm:justify-center px-2 w-[100%] mt-4 flex flex-row">
              <div className="flex flex-row items-center pn:max-sm:hidden gap-2">
                <Image src={Logo} className="h-[35px] w-[35px] rounded-2xl" />
                <div className="text-black dark:text-white text-[18px] font-bold font-sans">
                  Grovyo
                </div>
              </div>
              <div className="text-black dark:text-white text-[12px] text-center font-sans">
                Copyright © 2023 Grovyo Templates | All Rights Reserved
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
    <>
      <div className="h-screen w-screen flex flex-col items-center justify-center no-scrollbar overflow-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div
          className={`text-black  dark:text-white overflow-auto no-scrollbar relative w-full h-full `}
        >
          {/* header */}
          <div className=" w-full flex justify-between absolute h-[100px] items-center px-2 sm:px-5">
            <div className="flex px-2  rounded-3xl relative bg-[#545454] text-white shadow-lg shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-15 ring-1 ring-[#f4f4f452] py-2">
              <div className="h-[45px] w-[45px] ring-2 ring-[#fff] rounded-2xl">
                <img
                  src={`${bio?.dp}`}
                  alt="dp"
                  className="rounded-2xl h-[45px] w-[45px] "
                />
              </div>
              <div className="px-2 pr-4 ">
                <div className="text-[16px] flex items-center  text-[#fcfcfc] font-bold">
                  <div className=" text-[#ffffff] pr-[2px] [text-shadow:1px_1px_2px_var(--tw-shadow-color)]">
                    {bio?.fullname}{" "}
                  </div>
                  {bio?.isverified && <MdVerified className="text-blue-700" />}
                </div>
                <div className="text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] text-[14px] font-medium">
                  @{bio?.username}
                </div>
              </div>
            </div>

            <>
              {bio?.useDefaultProsite == false && (
                <>
                  {(bio?.isCommunity || bio?.isStore) && (
                    <div
                      className={`flex ${
                        bio?.isAbout && (product.length > 0 || coms.length > 0)
                          ? "p-1 py-2 px-4"
                          : "p-0"
                      }  -ml-36 bg-[#545454] rounded-full relative pn:max-sm:hidden text-white shadow-lg shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ring-1 ring-[#f4f4f452] `}
                    >
                      {bio?.isAbout &&
                        (product.length > 0 || coms.length > 0) && (
                          <Link
                            href={"#about"}
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
                              className={`font-semibold ${
                                state === 1
                                  ? "text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-white"
                                  : "text-black dark:text-white"
                              }`}
                            >
                              About
                            </div>
                            <div
                              className={`font-semibold ${
                                state === 1
                                  ? "h-[2px] w-[20px] bg-white rounded-t-md"
                                  : "hidden"
                              }`}
                            ></div>
                          </Link>
                        )}
                      {bio?.isCommunity && coms.length > 0 && (
                        <Link
                          href={"#community"}
                          onClick={() => {
                            setState(2);
                          }}
                          className={`flex flex-col ${
                            !(bio?.isStore && product.length > 0) && "mr-6"
                          } cursor-pointer justify-start items-start pl-3 w-[100px] ${
                            state === 2 ? "" : ""
                          }`}
                        >
                          <div
                            onClick={() => {
                              setState(2);
                            }}
                            className={`font-semibold  ${
                              state === 2
                                ? "text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-white"
                                : "text-black dark:text-white"
                            }`}
                          >
                            Community
                          </div>
                          <div
                            className={`${
                              state === 2
                                ? "h-[2px] w-[20px] bg-white rounded-t-md ml-6"
                                : "hidden"
                            }`}
                          ></div>
                        </Link>
                      )}
                      {bio?.isStore && product.length > 0 && (
                        <Link
                          href={"#store"}
                          onClick={() => {
                            setState(3);
                          }}
                          className={`flex flex-col cursor-pointer justify-center items-center w-[100px] ${
                            state === 3 ? "" : ""
                          }`}
                        >
                          <div
                            className={`font-semibold ${
                              state === 3
                                ? " text-[#ffffff] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-white"
                                : " text-black dark:text-white"
                            }`}
                          >
                            Store
                          </div>
                          <div
                            className={`${
                              state === 3
                                ? "h-[2px] w-[20px] bg-white rounded-t-md"
                                : "hidden"
                            }`}
                          ></div>
                        </Link>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
            <div
              onClick={createChatRequest}
              className="p-2 cursor-pointer text-sm px-5 bg-blue-500 text-white rounded-2xl"
            >
              Chat
            </div>
            {/* <a
              target="_blank"
              href={"https://login.grovyo.com/"}
              className="p-2 px-5 bg-blue-500 text-white rounded-2xl"
            >
              Sign up
            </a> */}
          </div>
          {/* prosite */}
          <div>
            {(bio?.temp || bio?.temp1) && bio?.useDefaultProsite === false ? (
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
              <div className="flex pn:max-md:flex-col-reverse items-center h-full w-[100%]">
                <div className="flex bg-defaultprositelight bg-cover dark:bg-defaultprositedark flex-col items-center w-[100%] h-[80vh]">
                  <div className="h-full w-full flex flex-col gap-10 mt-4 justify-center items-center">
                    <div className="md:text-5xl text-2xl sm:text-3xl font-semibold dark:text-white text-black">
                      {data?.id == bio?.id
                        ? `Hii, ${data?.fullname?.split(" ")[0]}`
                        : "Hii, Buddy 👋"}
                    </div>
                    <div className="w-[95%] sm:w-[550px] flex flex-col justify-center items-center gap-6 bg-[#FAFAFA] dark:bg-[#1C1C1C] rounded-2xl p-5">
                      <div className="text-lg mt-3 font-semibold">
                        {data?.id !== bio?.id
                          ? "Exploring new features on Grovyo"
                          : "Be the first one to use the most unique feature"}
                      </div>
                      <div className="flex justify-center mb-3 items-center w-[96%]">
                        {data?.id == bio?.id ? (
                          <button className="p-2 px-4 w-full text-sm rounded-xl bg-white text-black dark:bg-black dark:text-white ">
                            Customize your prosite
                          </button>
                        ) : (
                          <button
                            onClick={createChatRequest}
                            className="p-2 px-4 w-full flex justify-center items-center gap-2 text-sm rounded-xl bg-white text-black dark:bg-black dark:text-white "
                          >
                            <div>
                              <IoIosChatbubbles />
                            </div>
                            <div>Chat Now</div>
                            <div>
                              <IoIosChatbubbles />
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* about */}
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
              className=" text-black dark:text-white text-[26px] pb-3 font-bold"
            >
              About
            </div>
            <div
              className={`bg-[#f9f9f9] dark:bg-[#121212] flex flex-col min-h-full space-y-3 sm:w-[80%] w-[97%] rounded-2xl md:rounded-[35px] pn:max-sm:p-5 sm:p-10 `}
            >
              <div className="flex flex-col justify-center  items-center sm:w-[100%] w-[100%] ">
                <Bio bio={bio} />
              </div>
            </div>
          </div>

          <div className="flex flex-col ">
            {/* community */}
            <div>
              {coms.length > 0 ? (
                <div
                  id="community"
                  className="flex flex-col w-[100%] justify-center py-4 space-y-2 items-center"
                >
                  {" "}
                  <div
                    style={{ fontFamily: "Nunito" }}
                    className=" text-black dark:text-white text-[26px] font-bold"
                  >
                    Communities
                  </div>
                  <Community coms={coms} />
                </div>
              ) : (
                <></>
              )}
            </div>

            {/* Store section */}

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
                  className=" text-black dark:text-white text-[26px] font-bold"
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
          </div>

          <div className=" flex justify-center  pt-2 items-center px-4">
            <div className=" w-[100%] h-[1px] rounded-full"></div>
          </div>
          <div className="py-2 items-center  justify-between  pn:max-sm:justify-center px-2 w-[100%] mt-4 flex flex-row">
            <div className="flex flex-row items-center pn:max-sm:hidden gap-2">
              <Image src={Logo} className="h-[35px] w-[35px] rounded-2xl" />
              <div className="text-black dark:text-white text-[18px] font-bold font-sans">
                Grovyo
              </div>
            </div>
            <div className="text-black dark:text-white text-[12px] text-center font-sans">
              Copyright © 2023 Grovyo Templates | All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
