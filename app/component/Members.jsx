import { API } from "@/Essentials";
import axios from "axios";
import React, { useEffect, useState } from "react";
import memberspic from "../assets/members.png";
import Image from "next/image";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Link from "next/link";

const Members = ({ id, comId, dash }) => {
  const [members, setMembers] = useState([]);
  const [admin, setAdmin] = useState({
    dp: "",
    fullname: "",
    username: "",
  });

  useEffect(() => {
    if (id && comId)
      axios.get(`${API}/web/getallmembers/${id}/${comId}`).then((res) => {
        setAdmin({
          dp: res.data?.admindp,
          fullname: res.data.admin.fullname,
          username: res.data.admin.username,
        });
        setMembers(res.data.members);
      });
  }, [id, comId]);

  return (
    <>
      <div className="flex flex-col justify-start bg-white   dark:text-white text-black dark:bg-[#0D0F10] w-full rounded-t-xl  h-full gap-4">
        <div className="flex justify-between bg-[#DEE1E5] dark:bg-[#1A1D21] rounded-t-xl items-center w-full">
          <div className=" flex w-full items-center gap-1 font-bold">
            <div
              className="
		  relative top-2"
            >
              <Image src={memberspic} className="w-[50px] h-[50px]" />
            </div>
            <div>Members</div>
          </div>
          <div className="text-[#686B6E] text-3xl">
            <Link href={`/main/feed/${dash}/${comId}`}>
              <MdKeyboardDoubleArrowRight />
            </Link>
          </div>
        </div>
        <div className="flex flex-col p-2 px-4 gap-4">
          <div className="flex flex-col gap-2">
            <div className="font-bold text-[15px]">Admin</div>
            <div className="mt-3">
              <div className="flex justify-start items-center gap-2">
                <div className="w-[45px] h-[45px] rounded-2xl">
                  <img src={admin?.dp} className="w-full h-full rounded-2xl" />
                </div>
                <div className="flex dark:text-white text-black  flex-col -mt-1 gap-1">
                  <div className="text-sm font-semibold">{admin.fullname}</div>
                  <div className="text-xs">@{admin.username}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-bold text-[15px]">
              {members.length > 1 ? "Members" : "Member"}
            </div>
            <div>
              {members.map((d, i) => (
                <div key={i} className="mt-4">
                  <div className="flex justify-start items-center gap-2">
                    <div className="w-[45px] h-[45px] rounded-2xl">
                      <img src={d?.dp} className="w-full h-full rounded-2xl" />
                    </div>
                    <div className="flex dark:text-white text-black  flex-col -mt-1 gap-1">
                      <div className="text-sm font-semibold">
                        {d?.c?.fullname}
                      </div>
                      <div className="text-xs">@{d?.c?.username}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Members;
