"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import axios from "axios";
import { API } from "@/Essentials";

function Switcher() {
  const path = usePathname()
  const [data, setData] = useState([])

  const calculateDif = (a, b) => {
    const dif = Number(b) - Number(a);
    const per = Math.ceil((dif / b) * 100);
    return per;
  };

  useEffect(() => {
    axios.get(`${API}/web/products`).then((res) => {
      // axios.get(`http://192.168.1.6:7190/api/web/products`).then((res) => {
      console.log(res.data, "data")
      setData(res.data?.products)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  return (
    // <div className="pn:max-sm:h-[8vh] h-[10vh] bg-white dark:bg-[#0D0F10] shadow-sm z-10 pn:max-sm:items-center 
    //  pn:max-sm:w-[100%] pn:max-sm:mt-[8vh] overflow-hidden sm:max-md:rounded-r-3xl w-[25.8%] md:px-2 pn:max-md:justify-start absolute md:fixed flex flex-row items-center">
    //   <motion.div
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.5 }}
    //   >
    //     <Link
    //       href={"/main/feed/newForYou"}
    //       className={`${path.startsWith("/main/feed/newForYou")
    //         ? "text-[14px] pn:max-sm:text-[12px] dark:text-white dark:bg-[#121212] text-[#171717] p-3 bg-[#f5f5f5] rounded-xl font-semibold mx-2 hover:text-black transition-all duration-300"
    //         : "text-[14px] pn:max-sm:text-[12px] text-[#727272] dark:hover:text-white font-medium mx-2 hover:text-black border-b-0 transition-all duration-300"
    //         }`}
    //     >
    //       New for you
    //     </Link>
    //   </motion.div>

    //   <motion.div
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.5 }}
    //   >
    //     <Link
    //       href={"/main/feed/community"}

    //       className={`${path.startsWith("/main/feed/community")
    //         ? "text-[14px] pn:max-sm:text-[12px] dark:bg-[#121212] p-3 dark:text-white  bg-[#f5f5f5] rounded-xl text-[#171717] font-semibold mx-2 hover:text-black  transition-all duration-300"
    //         : "text-[14px] pn:max-sm:text-[12px] text-[#727272] dark:hover:text-white  font-medium mx-2 hover:text-black border-b-0 transition-all duration-300"
    //         }`}
    //     >
    //       Community
    //     </Link>
    //   </motion.div>
    // </div>

    // dark:bg-[#0D0F10]

    <div className="h-[50vh] bg-white dark:bg-[#0D0F10] w-[25.8%] absolute md:fixed pn:max-sm:mt-[8vh] z-10 shadow-sm pn:max-sm:items-center 
     pn:max-sm:w-[100%] flex flex-col justify-between py-4">

      <div className="flex flex-col h-full w-full">

        <div className="flex h-[15%] ">
          {/* <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          > */}
          <div>
            <Link
              href={"/main/feed/newForYou"}
              className={`${path.startsWith("/main/feed/newForYou")
                ? "text-[14px] pn:max-sm:text-[12px] dark:text-white dark:bg-[#121212] text-[#171717] p-3 bg-[#f5f5f5] rounded-xl font-semibold mx-2 hover:text-black transition-all duration-300"
                : "text-[14px] pn:max-sm:text-[12px] text-[#727272] dark:hover:text-white font-medium mx-2 hover:text-black border-b-0 transition-all duration-300"
                }`}
            >
              New for you
            </Link>
          </div>
          {/* </motion.div> */}

          {/* <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          > */}
          <div>
            <Link
              href={"/main/feed/community"}

              className={`${path.startsWith("/main/feed/community")
                ? "text-[14px] pn:max-sm:text-[12px] dark:bg-[#121212] p-3 dark:text-white  bg-[#f5f5f5] rounded-xl text-[#171717] font-semibold mx-2 hover:text-black  transition-all duration-300"
                : "text-[14px] pn:max-sm:text-[12px] text-[#727272] dark:hover:text-white  font-medium mx-2 hover:text-black border-b-0 transition-all duration-300"
                }`}
            >
              Community
            </Link>
          </div>
          {/* </motion.div> */}

        </div>
        <div className=" flex h-[85%] py-1 z-50 w-full">
          <div className="md:flex gap-2 w-full grid h-full max-h-full grid-cols-2 p-3 items-center md:justify-center">
            {data.map((d, i) => (
              <div
                key={i}
                className="flex flex-col justify-center border-[2px] dark:border-[#1A1D21] light:border-[#f9f9f9] rounded-xl w-full p-2 "
              >
                <div className="bg-[#f9f9f9] w-full dark:bg-bluedark dark:text-white flex-wrap flex justify-center items-center rounded-lg py-2">
                  <div className="w-full h-[90px] flex justify-center items-center ">
                    <img
                      src={`${d?.productImage}`}
                      alt="img"
                      className=" w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-lg font-medium">
                  <div className="text-[12px] dark:text-white font-semibold ">
                    {d?.name?.length > 20 ? `${d?.name.slice(0, 20)}...` : d?.name}
                  </div>
                  {/* <div className="text-[#737373] text-[14px]">
                  sold by {d?.brandname}
                </div> */}
                  <div className="text-[12px] dark:text-white flex gap-1 items-center font-bold">
                    <div>₹ {d?.isvariant ? d?.variants[0].category[0]?.discountedprice : d?.discountedprice}</div>
                    {d?.isvariant ?
                      <span className="text-sm dark:text-white font-semibold text-[#5585FF]">
                        {calculateDif(d?.variants[0].category[0]?.discountedprice, d?.variants[0].category[0]?.price)}% off
                      </span> :
                      <span className="text-sm font-semibold text-[#5585FF]">
                        {calculateDif(d?.discountedprice, d?.price)}% off
                      </span>
                    }
                  </div>
                  <div className="font-semibold dark:text-white text-[12px]">
                    M.R.P:
                    <del className="font-semibold px-2 text-[#FF0000]">
                      ₹{d?.isvariant ? d?.variants[0].category[0].price : d?.price}
                    </del>
                  </div>
                </div>


                <Link
                  href={`/product/${d?._id}`}
                  className="text-black ring-1 ring-black bg-white rounded-2xl flex justify-center items-center space-x-2 p-2 w-full"
                >
                  View
                </Link>

              </div>
            ))}
          </div >
        </div>

      </div>
    </div >
  );
}

export default Switcher;
