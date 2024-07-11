"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../Essentials";
import { useAuthContext } from "../../utils/AuthWrapper";
import Chats from "./../../component/Chats";
import { useDispatch, useSelector } from "react-redux";
import { setVisible } from "../../redux/slice/anotherSlice";
import { useSearchParams } from "next/navigation";
import { IoCheckmark, IoChevronBack } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import Convs from "@/app/component/Convs";
import styles from "../../CustomScrollbarComponent.module.css";
import { setData } from "@/app/redux/slice/lastMessage";
import ShimmerChat from "@/app/component/ShimmerChat";
import toast from "react-hot-toast";
import { setHide } from "@/app/redux/slice/remember";

export default function ChatLayout({ children }) {
  const [checkRequest, setCheckRequest] = useState(false);
  const [request, setRequest] = useState([]);
  const data = useSelector((state) => state.lastmessage.data)
  const { data: user } = useAuthContext();
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();
  const params = useSearchParams();
  const id = params.get("id");
  const con = params.get("con");

  const handleMuting = async (currectconvId) => {
    try {
      const res = await axios.post(`${API}/muting`, {
        convId: currectconvId,
        id: user?.id,
      });

      if (res.data.success) {
        const newData = data.map((f) =>
          f?.convid === currectconvId ? { ...f, ismuted: !f?.ismuted } : f
        );
        dispatch(setData(newData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   dispatch(setVisible(true));
  // }, []);

  const fetchallChats = async () => {
    try {
      const res = await axios.get(`${API}/fetchallchatsnew/${user?.id}`);
      if (res.data.success) {
        dispatch(setData(res.data.conv))
        setLoading(false)

      } else {
        setTimeout(() => {
          toast.error("Error In Fetching Chats")
        }, 10000)
      }

      // setLastMessage(res.data.conv.length - 1[res.data.conv.length - 1]?.)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  // accept or reject
  const handleStatus = async (index, status, d) => {
    try {
      const res = await axios.post(`${API}/acceptorrejectmesgreq`, {
        reciever: user.id,
        sender: d?.req?.id?._id,
        status: status,
      });
      // nav.goBack();
      if (res?.data?.success) {
        if (status === "accept") {
          const updatedData = request.filter((_, i) => i !== index);
          setRequest(updatedData);
        } else {
          const updatedData = request.filter((_, i) => i !== index);
          setRequest(updatedData);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const removingchat = async (currectconvId) => {
    try {
      const res = await axios.post(`${API}/removeconversation/${user?.id}`, {
        convId: currectconvId,
      });

      if (res?.data?.success) {
        const newData = data.filter((f) => f?.convid !== currectconvId);
        dispatch(setData(newData));
      }
    } catch (e) {
      detecterror({ e });
      console.log(e, "error in covn api removal");
    }
  };

  // fetch Requests
  const fetchreqs = async () => {
    try {
      const res = await axios.get(`${API}/fetchallmsgreqs/${user.id}`);

      if (res?.data?.success) {
        const d = res?.data?.dps;
        const r = res?.data?.reqs;
        const merg = d?.map((dp, i) => ({
          dp,
          req: r[i],
        }));
        setRequest(merg || []);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!params.get("id")) {
      dispatch(setHide(false));
    }
  }, [params, id]);

  useEffect(() => {
    if (id) {
      dispatch(setHide(true));
    }
  }, [params, id]);

  useEffect(() => {
    if (user.id) {
      fetchreqs();
      fetchallChats();
    }
  }, [user]);

  return (
    // if no data
    <div className="h-[100vh] w-[100%] bg-white dark:bg-bluedark flex sm:flex-row flex-col pn:max-md:justify-center ">
      {/* chats */}

      {/* mobile */}
      {!id && !con && (
        <div className="h-[100vh] sm:hidden select-none pn:max-md:w-[100%] bg-white dark:bg-[#0D0D0D] md:min-w-[390px] relative md:[360px] flex flex-col items-center pb-20  md:border-r-2 dark:border-none border-[#f7f7f7] overflow-auto scrollbar-hide ">
          {/* Chat header */}
          <div
            className={`w-[100%] h-[70px] border-b dark:border-[#131619] flex justify-between absolute dark:bg-bluedark bg-slate-50 items-center px-2`}
          >
            <div className="text-[24px] text-black dark:text-white font-semibold">Chats</div>
            <div
              onClick={() => setCheckRequest(true)}
              className="text-[14px] text-black dark:text-white font-medium light:hover:bg-slate-100 rounded-2xl  w-20 flex justify-center items-center hover:animate-pulse"
            >
              Request <span className="text-[#1A85FF]"> ({request.length}) </span>
            </div>
          </div>
          {/* messages */}
          <div className="w-[100%] pt-[60px] flex flex-col ">
            {/* one chat */}
            <>
              {
                loading ? <div className="mt-4 w-full h-full">
                  <ShimmerChat />
                </div> : <div className="mt-4 w-full h-full">
                  {data.map((d, i) => (
                    <Convs
                      key={i}
                      d={d}
                      handleVisible={() => {
                        const newData = data.map((f) =>
                          f?.convid === d?.convid ? { ...f, unread: 0 } : f
                        );
                        setTimeout(() => {
                          dispatch(setData(newData))
                        }, 1000)
                        dispatch(setHide(false));
                      }}
                      href={`/main/chat?id=${d?.id}&con=${d?.convid}`}
                      handleMuting={handleMuting}
                      removingchat={removingchat}
                    />
                  ))}
                </div>
              }
            </>
            {/* <div className="w-[100%] rounded-xl my-1 bg-slate-100 animate-pulse h-[70px] px-4 flex flex-row "></div>
            <div className="h-[1px] w-[80%] rounded-full flex self-center bg-[#f9f9f9]"></div>
            <div className="w-[100%] rounded-xl my-1 bg-slate-100 animate-pulse h-[70px] px-4 flex flex-row "></div>
            <div className="h-[1px] w-[80%] rounded-full flex self-center bg-[#f9f9f9]"></div>
            <div className="w-[100%] rounded-xl my-1 bg-slate-100 animate-pulse h-[70px] px-4 flex flex-row "></div>
            <div className="h-[1px] w-[80%] rounded-full flex self-center bg-[#f9f9f9]"></div>
            <div className="w-[100%] rounded-xl my-1 bg-slate-100 animate-pulse h-[70px] px-4 flex flex-row "></div>
            <div className="h-[1px] w-[80%] rounded-full flex self-center bg-[#f9f9f9]"></div>
            <div className="w-[100%] rounded-xl my-1 bg-slate-100 animate-pulse h-[70px] px-4 flex flex-row "></div>
            <div className="h-[1px] w-[80%] rounded-full flex self-center bg-[#f9f9f9]"></div> */}
          </div>
        </div>
      )}

      {/* web */}
      {checkRequest === false && (
        <div
          className={`h-[100vh] pn:max-sm:hidden select-none pn:max-md:w-[100%]
				 bg-white dark:bg-[#0D0D0D] md:min-w-[390px] relative md:[360px] flex flex-col items-center pn:max-sm:pt-16
			 md:border-r-2  border-b dark:border-[#131619] border-[#f7f7f7] overflow-auto ${styles.customScrollbar}`}
        >
          {/* Chat header */}
          <div className="w-[100%] h-[60px]  flex justify-between absolute dark:bg-bluedark bg-slate-50 items-center px-2">
            <div className="text-[22px] text-black dark:text-white font-semibold ">
              Chats
            </div>
            <div
              onClick={() => setCheckRequest(true)}
              className="text-[14px] dark:text-white text-black font-medium rounded-2xl  w-20 flex justify-center items-center "
            >
              Request <span className="text-[#1A85FF] pl-[3px]" > ({request.length}) </span>
            </div>
          </div>
          {/* messages */}
          <div className="w-[100%] pt-[60px] dark:bg-graydark gap-1 px-2 flex flex-col ">
            {/* one chat */}
            <>
              {loading ?
                <ShimmerChat />
                : <>
                  {data.map((d, i) => (
                    <Convs
                      key={i}
                      handleVisible={() => {
                        const newData = data.map((f) =>
                          f?.convid === d?.convid ? { ...f, unread: 0 } : f
                        );
                        setTimeout(() => {
                          dispatch(setData(newData))
                        }, 1000)
                      }}
                      d={d}
                      href={`/main/chat/${d?.id}/${d?.convid}`}
                      handleMuting={handleMuting}
                      removingchat={removingchat}
                    />
                  ))}
                </>
              }
            </>


          </div>
        </div>
      )}

      {checkRequest && (
        <div
          className="h-[100vh] pn:max-sm:hidden select-none pn:max-md:w-[100%]
					 bg-white dark:bg-[#0D0D0D] md:min-w-[390px] relative md:[360px] flex flex-col items-center  md:border-r-2 border-[#f7f7f7] overflow-auto scrollbar-hide "
        >
          {/* Chat header */}

          {/* messages */}
          <div className="w-[100%] h-full flex flex-col ">
            <div className="text-xl px-2 p-3 flex items-center gap-1 font-semibold border-b mb-2">
              <div>
                <IoChevronBack
                  onClick={() => setCheckRequest(false)}
                  className="text-2xl"
                />
              </div>
              <div>Requests</div>
            </div>
            {/* one chat */}
            {request.length > 0 &&
              request.map((d, i) => (
                <>
                  <div className="w-[100%] gap-2 py-2 px-2 pn:max-sm:hidden duration-200A hover:bg-slate-100 h-[55px]  flex flex-row justify-between items-center ">
                    <div className=" gap-2 py-2 flex flex-row justify-start items-center ">
                      <div>
                        <img
                          src={d?.dp}
                          className="h-[40px] w-[40px] rounded-[17px] ring-1 ring-white bg-white "
                        />
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold">
                          {d?.req?.id?.fullname}
                        </div>
                        <div className="text-[14px]">
                          {d?.req?.id?.username}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      <div onClick={() => handleStatus(i, "reject", d)}>
                        <RxCross2 className="text-red-600 font-semibold" />
                      </div>
                      <div onClick={() => handleStatus(i, "accept", d)}>
                        <IoCheckmark className="text-green-600 font-semibold" />
                      </div>
                    </div>
                  </div>

                  <div className="w-[99%] border-b-[0.5px] "></div>
                </>
              ))}

            {request.length <= 0 && (
              <div className="flex justify-center h-full items-center ">
                No Requests!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat */}
      <div className="w-full h-full pn:max-sm:hidden"> {children}</div>

      {id && con && (
        <div className="w-full h-full sm:hidden">
          <Chats con={con} id={id} setVisible={setVisible} />
        </div>
      )}
    </div>
  );

}

