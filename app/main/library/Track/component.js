"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
// import area from "../../../assets/Images/Livearea.png";
// import fromm from "../../../assets/Images/from.png";
import { useSearchParams } from "next/navigation";
// import Tick from "../../../assets/Images/tick.png";
// import Illustration from "../../../assets/Images/Illustration.png";
import { useAuthContext } from "../../../utils/AuthWrapper";
import { MdArrowForwardIos } from "react-icons/md";
import axios from "axios";
import { API } from "../../../../Essentials";
import { HiMiniBuildingStorefront } from "react-icons/hi2";
import { FaLocationDot } from "react-icons/fa6";

function page() {
  const search = useSearchParams();
  const { data: user } = useAuthContext();
  const [value, setValue] = useState(1);
  const data = search.get("data");
  const pids = search.get("pids");
  const quantity = search.get("quantity");
  const address = search.get("address");
  const load = search.get("load");
  const total = search.get("total");
  const dataa = search.get("dataa");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/fetchorders/${user?.id}`);
      console.log(res.data);
      setOrders(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user.id) {
      fetchOrders();
    }
  }, [user.id]);

  console.log(data?.length);
  return (
    <div className="md:flex h-[85.5vh]">
      <div className="w-[520px]  px-4 overflow-y-auto scrollbar-hide dark:bg-[#171717] border-r-2 border-[#dcdcdc] flex items-center pt-6 flex-col">
        <div className="text-[#27272A] dark:text-white text-[14px] font-semibold flex justify-start w-[100%] ">
          General info
        </div>

        {/* Order */}
        <div className=" w-[100%]  rounded-lg flex flex-col bg-[#f4f4f4] mt-2">
          <div className="w-[100%] h-[50%] py-2 flex flex-row justify-between items-start px-2">
            {/* Order id */}
            <div className="text-[#27272A] dark:text-white text-[12px]  font-sans">
              Order ID
            </div>
            <div className="text-[#27272A] dark:text-white text-[12px]  font-sans">
              247-96024
            </div>
          </div>
          {/* order date */}
          <div className="w-[100%] h-[50%] py-2 flex flex-row justify-between items-start px-2 border-t-2">
            <div className="text-[#27272A] dark:text-white text-[12px] font-bold font-sans">
              Order date
            </div>
            <div className="text-[#27272A] dark:text-white text-[12px]  font-sans font-bold">
              20/04/2020, 04:20
            </div>
          </div>
        </div>

        {/*  Shipping details */}
        <div className="text-[#27272A] mt-3 dark:text-white font-semibold t w-[100%] text-[14px] flex   py-1">
          Shipping details
        </div>

        <div className="py-1 w-[100%] rounded-lg flex flex-col bg-[#f4f4f4]">
          {/* from */}
          <div className="h-[50%] w-[100%]   flex flex-row justify-evenly items-center py-1">
            <div className="w-[10%] h-[80%] flex justify-center ">
              <HiMiniBuildingStorefront color="#1A94FF" />
            </div>
            {/* Address */}
            <div className="w-[90%] h-[80%]  flex flex-col justify-evenly ">
              <div className="text-[12px] text-[#2D2D2D] ">From store</div>
              <div className="text-[11px] text-[#2D2D2D] py-0.5 font-bold">
                13 Han Thuyen, D.1, HCM city
              </div>
            </div>
          </div>
          {/* To */}
          <div className="h-[50%] w-[100%] border-t-2  flex flex-row justify-center items-center py-1">
            <div className="w-[10%] h-[80%] flex justify-center ">
              <FaLocationDot color="#00AB56" />
            </div>
            {/* Address */}
            <div className="w-[90%] h-[80%]  flex flex-col justify-evenly">
              <div className="text-[12px] text-[#2D2D2D] ">To</div>
              <div className="text-[11px] text-[#2D2D2D] py-0.5 font-bold">
                13 Han Thuyen, D.1, HCM city
              </div>
            </div>
          </div>
        </div>

        <div className="text-[#27272A] mt-3 dark:text-white font-semibold t w-[100%] text-[14px] flex   py-1">
          Product Details
        </div>

        {/* Products */}
        {/* <div className="w-[80%] py-1 rounded-lg bg-white dark:bg-[#000] mt-2 flex flex-row">
          <img
            src={data?.image}
            alt="image"
            className="bg-contain h-[90px] w-[90px] "
          />
          <div className="flex flex-col text-black bg-white px-2">
            <div className="text-[14px]">{data?.c?.product?.brandname}</div>
            <div className="text-[8px] py-1">{data?.c?.product?.name}</div>
            <div className="flex flex-row justify-center items-center">
              <div className="text-[14px]">
                {data?.c?.product?.discountedprice}
              </div>
              <div className="text-[12px] text-[#A1A1A1] px-1">
                {data?.c?.price}
              </div>
              <div className="text-[8px] text-[#A1A1A1] px-1">70% Off</div>
            </div>
            <div className="flex flex-row justify-between px-2 items-center rounded-lg bg-[#F6F6F6] h-[30px] w-[120px]">
              <div className="bg-white text-black text-[30px] h-[20px] flex justify-center items-center w-[20px]">
                -
              </div>
              <div className=" text-black text-[14px]">{data?.c?.quantity}</div>
              <div className="bg-white text-black text-[24px] h-[20px] w-[20px] flex justify-center items-center">
                +
              </div>
            </div>
          </div>
        </div> */}

        {orders.map((d, i) => (
          <div
            key={i}
            className="py-1 w-[100%] rounded-lg  bg-[#f4f4f4] mb-4 dark:bg-[#000] mt-2 flex flex-row"
          >
            <div className="w-[22%] h-[100%] flex items-center justify-center px-2">
              <img
                src={d?.image}
                alt="image"
                className="bg-contain h-[70px] w-[70px] rounded-lg "
              />
            </div>

            <div className="flex w-[78%] h-[100%] flex-col text-black px-2">
              <div className="text-[12px] truncate font-medium">
                {d?.orders?.productId?.[0].name}
              </div>
              <div className="text-[9px] font-light">
                By{" "}
                <span className="font-light">
                  {d?.orders?.productId?.[0].brandname}
                </span>
              </div>
              <div className="flex flex-row ">
                <div className="text-[14px]">
                  {data?.c?.product?.discountedprice}
                </div>
                <div className="text-[12px] text-[#A1A1A1] px-1">
                  {data?.c?.price}
                </div>
                <div className="text-[8px] text-[#A1A1A1] px-1">70% Off</div>
              </div>
              <div className="flex flex-row  justify-between px-2 items-center rounded-lg  h-[30px] w-[100%]">
                {/* <div className="bg-white text-black text-[30px] h-[20px] flex justify-center items-center w-[20px]">
                    -
                  </div> */}
                <div className="text-[14px] font-bold">₹{d?.orders?.total}</div>
                <div className=" text-black text-[12px]">
                  Qty: {d?.orders?.quantity}
                </div>
                {/* <div className="bg-white text-black text-[24px] h-[20px] w-[20px] flex justify-center items-center">
                    +
                  </div> */}
                <div
                  className={`text-[12px] bg-green-200 py-1 px-2 rounded-xl ${
                    d?.orders?.currentStatus === "cancelled"
                      ? "bg-red-500"
                      : "bg-green-400"
                  }`}
                >
                  Status: {d?.orders?.currentStatus}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Right side */}
      <div className=" bg-green pn:max-md:hidden w-[100%] h-[100%] flex space-y-10 flex-col items-center  ">
        <div className="flex text-blue-500 text-[30px] font-semibold items-center space-x-2 ">
          {" "}
          <div>Confirmed</div>
          {/* <Image src={Tick} alt="tick" className="h-[30px] w-[30px]" /> */}
        </div>
        <div className="text-[30px] font-medium">THANK YOU FOR YOUR ORDER!</div>
        <div className="text-[20px] font-medium">Order Id: 56089</div>
        {/* <Image alt="ill" src={Illustration} className="h-[200px] w-[400px]" /> */}

        <div className="text-[20px]">Estimated Delivery </div>
        <div className="text-[20px]">Monday, 09th January, 2023</div>
        <div className="bg-[#171717] text-white py-3 px-40 rounded-2xl ">
          Continue Shopping
        </div>
      </div>
    </div>
  );
}

export default page;
