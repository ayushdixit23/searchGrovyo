"use client";
import React, { useEffect, useState } from "react";
// import bluesearch from "../assets/Images/bluesearch.png";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useAuthContext } from "../utils/AuthWrapper";
import { API } from "../../Essentials";
import { MdVerified } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

function page() {
  const [text, setText] = useState("");
  const [toast, setToast] = useState(false);
  const [data, setData] = useState([]);
  const [dataa, setDataa] = useState([]);
  const [recentSearchPro, setRecentSearchPro] = useState([]);
  const [recentSearchCom, setRecentSearchCom] = useState([]);
  const [load, setLoad] = useState(false);
  const [timeout, setTimeout] = useState("");
  const [active, setActive] = useState("prosites");
  const key = process.env.NEXT_PUBLIC_KEY;
  const { data: user } = useAuthContext();
  const [click, setClick] = useState(1);
  //const href = `/defprosite?dd=${data}`;
  // search

  // const encryptaes = (data) => {
  //   try {
  //     const textBytes = aesjs.utils.utf8.toBytes(data);
  //     const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  //     const encryptedBytes = aesCtr.encrypt(textBytes);
  //     const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  //     return encryptedHex;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const handSave = (id) => {
  //   const getids = localStorage.getItem("ids");
  //   let setids;
  //   if (getids) {
  //     const parseIds = JSON.parse(getids);
  //     if (parseIds.includes(encryptaes(id))) {
  //       const filterArr = parseIds.filter((d) => d !== encryptaes(id));
  //       const newArr = [encryptaes(id), ...filterArr];
  //       localStorage.setItem("ids", JSON.stringify(newArr));
  //       return;
  //     }
  //     if (parseIds.length <= 5) {
  //       setids = [encryptaes(id), ...parseIds];
  //     } else {
  //       parseIds.pop();
  //       setids = [encryptaes(id), ...parseIds];
  //     }
  //   } else {
  //     setids = [encryptaes(id)];
  //   }
  //   localStorage.setItem("ids", JSON.stringify(setids));
  // };

  // const changeOrder = (id) => {
  //   const getids = localStorage.getItem("ids");
  //   if (getids) {
  //     const parseIds = JSON.parse(getids);
  //     const filterArr = parseIds.filter((d) => d !== encryptaes(id));
  //     const newArr = [encryptaes(id), ...filterArr];
  //     localStorage.setItem("ids", JSON.stringify(newArr));
  //   }
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (window !== undefined) {
  //       const getids = localStorage.getItem("ids");
  //       console.log(getids)
  //       if (getids.length > 0) {
  //         const parseIds = JSON.parse(getids) || [];
  //         const filteredIds = parseIds.filter(id => id !== null && id !== undefined);
  //         if (filteredIds.length > 0) {
  //           try {

  //             const res = await axios.post(
  //               `${API}/webapprecentsearchpro`,
  //               filteredIds
  //             );
  //             setRecentSearch(res.data.users);
  //           } catch (error) {
  //             console.error("Error fetching data:", error);
  //           }
  //         }
  //       }
  //     }
  //   };
  //   fetchData();
  // }, []);

  const recentSearchs = async () => {
    try {
      const res = await axios.get(`${API}/webmobileSearch/${user?.id}`);
      if (res.data.success) {
        setRecentSearchCom(res.data?.recentSearchesCommunity);
        setRecentSearchPro(res.data?.recentSearchesProsites);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    setActive("prosites"), setClick(1);
    const res = await axios.post(`${API}/searchpros?query=${text}`);
    if (res?.data?.data?.success) {
      const pros = res?.data?.data?.pros;
      const dp = res?.data?.data?.dps;
      const merge = pros?.map((p, i) => ({ p, dps: dp[i] }));
      setData(merge);
      setLoad(true);
      console.log(merge);
    }
  };

  const comm = async () => {
    setActive("communities"), setClick(2);
    const res = await axios.post(`${API}/searchcoms/${user?.id}?query=${text}`);
    if (res?.data?.success) {
      const pros = res?.data?.data?.coms;
      const dp = res?.data?.data?.dps;
      const c = res?.data?.data?.creatordps;
      const merge = pros?.map((p, i) => ({
        p,
        dps: dp[i],
        creatordps: c[i],
      }));
      setDataa(merge);
      setLoad(true);
    }
  };

  const addSearchCom = async (sId) => {
    try {
      const res = await axios.post(`${API}/addRecentCommunity/${user?.id}`, {
        sId,
      });
      if (res.data.success) {
        recentSearchs();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addSearchPro = async (sId) => {
    try {
      const res = await axios.post(`${API}/addRecentProsite/${user?.id}`, {
        sId,
      });
      if (res.data.success) {
        recentSearchs();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const removeSearchCom = async (sId) => {
    try {
      const res = await axios.post(
        `${API}/removeRecentSrcCommunity/${user?.id}`,
        { sId }
      );
      if (res.data.success) {
        recentSearchs();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeSearchPro = async (sId) => {
    try {
      const res = await axios.post(
        `${API}/removeRecentSrcProsite/${user?.id}`,
        { sId }
      );
      if (res.data.success) {
        recentSearchs();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (text && active === "prosites") {
      handleSearch();
    }

    if (text && active === "communities") {
      comm();
    }
  }, [text]);

  useEffect(() => {
    if (user.id) {
      recentSearchs();
    }
  }, [user.id]);

  return (
    <div className="pn:max-md:w-[100%] md:min-w-[390px] h-screen :bg-[#000] bg-white dark:bg-bluelight flex flex-col">
      <div className="flex flex-row justify-around  mt-2 bg-white dark:bg-bluelight items-center p-2 h-[6%] w-[100%]">
        <input
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          value={text}
          className="ring-1 ring-[#E2E8F0] dark:ring-slate-500 :ring-[#000] dark:text-white dark:bg-bluelight :bg-[#3e3e3e] :text-[#fff] rounded-xl p-2 w-[100%] outline-none text-black"
          placeholder="Search"
          onChange={(t) => setText(t.target.value)}
        />
        {/* <Image
          // onClick={handleSearch}
          src={bluesearch}
          alt="icons"
          className="h-[40px] w-[40px] "
        /> */}
      </div>

      {/* Options */}
      <div className=" w-[100%] px-2 flex flex-row py-2 select-none ">
        <div
          // onClick={handleSearch}
          onClick={() => setActive("prosites")}
          className={`${active === "prosites"
            ? " text-[12px] text-white  font-medium bg-blue-500 rounded-lg mx-1 px-2 py-1 flex justify-center items-center"
            : "text-[12px] text-[#717171] font-medium :bg-[#171717] :text-white bg-[#f7f7f7] rounded-lg mx-1 px-2 py-1 flex justify-center items-center"
            }`}
        >
          Prosite
        </div>
        <div
          onClick={() => setActive("communities")}
          className={`${active === "communities"
            ? "text-[12px] text-white  font-medium bg-blue-500 rounded-lg mx-1 px-2 py-1 flex justify-center items-center"
            : "text-[12px] text-[#717171] font-medium :bg-[#171717] :text-white bg-[#f7f7f7] rounded-lg mx-1 px-2 py-1 flex justify-center items-center"
            }`}
        >
          Communities
        </div>
      </div>

      <div className=" w-[100%] px-10">
        <div className="w-[100%] bg-[#f6f6f6] dark:bg-bluelight :bg-[#171717] h-[1px]"></div>
      </div>
      {/* People */}
      <div className="overflow-auto scrollbar-hide ">
        {active === "prosites" ? (
          <>
            {data?.length > 0 ? (
              <div className="">
                {data.map((d, i) => (
                  <div
                    className="flex flex-row items-center :bg-[#171717] pt-1 bg-[#f7f7f7] dark:bg-bluelight px-2 justify-between"
                  >
                    <a onClick={() => addSearchPro(d?.p?._id)}
                      target="_blank"
                      href={`https://grovyo.com/${d?.p?.username}`} className="flex items-center">
                      <img
                        src={d?.dps}
                        className="h-[45px] w-[45px] bg-[#fff] rounded-[20px]"
                      />
                      <div className="px-2 py-2 :text-white text-black dark:text-white text-[14px] font-bold ">
                        <div className="flex items-center gap-1">
                          <div>{d?.p?.fullname}</div>
                          {d?.p?.isverified && (
                            <div>
                              <MdVerified className="text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="text-[11px] dark:text-white">{d?.p?.username}</div>
                      </div>
                    </a>
                    {/* <div>
                      <RxCross2 onClick={() => removeSearchPro(d?.id)} />
                    </div> */}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {recentSearchPro.map((d) => (
                  <div
                    className="flex flex-row items-center :bg-[#171717] dark:bg-bluelight bg-[#f7f7f7] px-2 justify-between"
                  >
                    <a target="_blank"
                      href={`https://grovyo.com/${d?.username}`} className="flex items-center">
                      <img
                        src={d?.dp}
                        className="h-[45px] w-[45px] bg-[#fff] rounded-[20px]"
                      />
                      <div className="px-2 py-2 :text-white text-black dark:text-white text-[14px] font-bold ">
                        <div className="flex items-center gap-1">
                          <div >{d?.fullname}</div>
                          {d?.isverified && (
                            <div>
                              <MdVerified className="text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="text-[11px] dark:text-[#f8f8f8] font-normal">{d?.username}</div>
                      </div>
                    </a>
                    <div>
                      <RxCross2 onClick={() => removeSearchPro(d?.id)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {dataa.length > 0 ? (
              <div className="">
                {dataa.map((d, i) => (
                  <Link
                    href={`/main/feed/newForYou/${d?.p?._id}`}
                    // href={`/main/feed/community/${d?.p?._id}`}
                    className="flex flex-row items-center :bg-[#171717] pt-1 bg-[#f7f7f7] dark:bg-bluelight  px-2 justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={d?.dps}
                        className="h-[45px] w-[45px] bg-[#fff] dark:bg-bluelight   rounded-[20px]"
                      />
                      <div className="px-2 :text-white py-2  dark:text-white text-black ">
                        <div className="text-[14px] font-bold ">
                          {d?.p?.title}
                        </div>
                        <div className="text-[11px] dark:text-white">{d?.p?.memberscount}{d?.p?.memberscount>1?" members":" member"}</div>
                      </div>
                    </div>
                    {/* <div>
                      <RxCross2 onClick={() => removeSearchCom(d?.p?._id)} />
                    </div> */}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="">
                {recentSearchCom.map((d, i) => (
                  <Link
                    href={`/main/feed/community/${d?.id}`}
                    className="flex flex-row items-center :bg-[#171717] pt-1 dark:bg-bluelight  bg-[#f7f7f7] px-2 justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={d?.dp}
                        className="h-[45px] w-[45px] dark:bg-bluelight  bg-[#fff] rounded-[20px]"
                      />
                      <div className="px-2 :text-white py-2 text-black  ">
                        <div className="text-[14px] font-bold ">{d?.title}</div>
                        <div className="text-[11px]">{d?.member}{d?.member>1?" members":" member"}</div>
                      </div>
                    </div>
                    <div>
                      <RxCross2 onClick={() => removeSearchCom(d?.p?._id)} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div >
  );
}

export default page;
