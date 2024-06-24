"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../../../../Essentials";
import { useAuthContext } from "../../../utils/AuthWrapper";

const page = () => {
  const [sub, setSub] = useState([]);
  const { data } = useAuthContext();

  const fetchSubscription = async () => {
    try {
      const res = await axios.get(`${API}/fetchallsubscriptions/${data?.id}`);
      console.log(res.data);
      if (res.data.success) {
        setSub(res.data.merged);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data.id) {
      fetchSubscription();
    }
  }, [data?.id]);

  return (
    <div className="md:flex h-[85.5vh]">
      <div className="md:w-[390px] pn:max-md:pt-[20vh] pn:max-md:w-[100%] border-r-2  px-4 overflow-y-auto scrollbar-hide">
        {sub.map((d, i) => (
          <div
            key={i}
            className="py-1 rounded-lg  bg-[#f4f4f4] mb-4 dark:bg-[#000] mt-2 flex flex-row items-center"
          >
            <div className="w-[15%] h-[100%]  items-center justify-center flex px-2">
              <img
                src={d?.status?.dp}
                className="h-[100%] w-[100%] rounded-lg resize"
              />
            </div>
            <div className="w-[50%] h-[100%] justify-evenly flex flex-col px-2 py-2">
              <div className="flex text-[12px] font-semibold truncate">
                Topic {d?.status?.topic}
              </div>
              <div className="flex text-[10px] font-normal truncate">
                Community {d?.status?.community}
              </div>
            </div>
            {/* Status */}
            <div className="w-[35%] h-[100%]  justify-evenly items-center flex flex-col px-2 py-2">
              <div className="flex text-[12px] font-semibold justify-center">
                Status :
                <span
                  className={`${d?.status?.validity === "Expired"
                    ? "text-red-600"
                    : "text-green-800"
                    }`}
                >
                  {" "}
                  {d?.status?.validity}
                </span>
              </div>
              <div className="flex justify-center text-[9px] font-normal">
                Bought On : 18/03/2024
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
