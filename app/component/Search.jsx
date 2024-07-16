"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuthContext } from "../utils/AuthWrapper";
import { API } from "../../Essentials";
import { MdVerified } from "react-icons/md";
import styles from "../CustomScrollbarComponent.module.css";
import { RxCross2 } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import searchlottie from "../assets/search.json";
import searchblack from "../assets/searchblack.json";
import { useTheme } from "next-themes";

function Search({ setShow }) {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [dataa, setDataa] = useState([]);
  const [recentSearchPro, setRecentSearchPro] = useState([]);
  const [recentSearchCom, setRecentSearchCom] = useState([]);
  const [load, setLoad] = useState(false);
  const [posts, setPosts] = useState([]);
  const { theme } = useTheme();

  const [all, setAll] = useState({
    prosites: [],
    community: [],
    posts: [],
  });

  const [active, setActive] = useState("all");

  const { data: user } = useAuthContext();
  const [click, setClick] = useState(1);

  const searchAll = async () => {
    try {
      const res = await axios.post(
        `${API}/websearchforall/${user?.id}?query=${text}`
      );
      if (res.data.success) {
        setAll({
          prosites: res.data?.mergedpros,
          community: res.data?.mergedcoms,
          posts: res.data?.mergedposts,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchforposts = async () => {
    try {
      const res = await axios.post(`${API}/websearchforposts?query=${text}`);
      if (res.data.success) {
        console.log(res.data, "posts");
        setPosts(res.data.posts);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

    if (text && active === "all") {
      searchAll();
    }

    if (text && active === "posts") {
      searchforposts();
    }
  }, [text]);

  useEffect(() => {
    if (user.id) {
      recentSearchs();
    }
  }, [user.id]);

  return (
    <div className="pn:max-pp:w-[100%] pp:w-[390px] z-50 h-screen bg-white dark:bg-[#0D0F10] flex flex-col">
      <div className="flex justify-between items-center my-2 py-2 gap-2 px-2">
        <div className="text-2xl font-semibold">Search</div>
        <div className="flex justify-center items-center gap-2">
          <div className="sm:block hidden">
            <IoIosSearch className="text-xl" />
          </div>
          <div className="block sm:hidden">
            <RxCross2 className="text-xl" onClick={() => setShow(false)} />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-around bg-white dark:bg-transparent items-center px-2 w-[100%]">
        <input
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          value={text}
          className=" border dark:border-[#1F2228] dark:text-white dark:bg-bluelight :bg-[#3e3e3e] px-3 :text-[#fff] rounded-xl p-1.5 w-[100%] outline-none text-black"
          placeholder="Search"
          onChange={(t) => setText(t.target.value)}
        />
      </div>

      <div className="flex justify-center mt-3 px-2 items-center gap-2">
        <div
          onClick={() => {
            setActive("all");
            if (text) {
              searchAll();
            }
          }}
          className={`w-full text-center rounded-xl cursor-pointer ${
            active === "all"
              ? "bg-[#5585FF] dark:bg-white text-white dark:text-black"
              : " border border-[#1f2228]"
          }  p-2 text-sm`}
        >
          All
        </div>
        <div
          onClick={() => {
            setActive("prosites");
            if (text) {
              handleSearch();
            }
          }}
          className={`w-full text-center rounded-xl cursor-pointer ${
            active === "prosites"
              ? "bg-[#5585FF] dark:bg-white text-white dark:text-black"
              : " border border-[#1f2228]"
          } p-2 text-sm`}
        >
          Prosite
        </div>
        <div
          onClick={() => {
            setActive("communities");
            if (text) {
              comm();
            }
          }}
          className={`w-full text-center rounded-xl cursor-pointer ${
            active === "communities"
              ? "bg-[#5585FF] dark:bg-white text-white dark:text-black"
              : " border border-[#1f2228]"
          } p-2 text-sm`}
        >
          Communities
        </div>
        <div
          onClick={() => {
            setActive("posts");
            if (text) {
              searchforposts();
            }
          }}
          className={`w-full text-center rounded-xl cursor-pointer ${
            active === "posts"
              ? "bg-[#5585FF] dark:bg-white text-white dark:text-black"
              : "border border-[#1f2228]"
          }  p-2 text-sm`}
        >
          Posts
        </div>
      </div>

      {active === "all" && (
        <>
          {all.prosites.length > 0 ||
          all.community.length > 0 ||
          all.posts.length > 0 ? (
            <div
              className={`p-2 mt-4 flex flex-col gap-5 overflow-y-scroll ${styles.customScrollbar}`}
            >
              {/* prosites */}
              <div>
                <div className="dark:bg-[#171717] bg-[#f1f1f1] rounded-xl flex justify-between items-center p-2 px-4">
                  <div className="font-semibold">
                    Prosite{" "}
                    <span className="text-[#5585FF]">
                      ({all.prosites?.length})
                    </span>
                  </div>
                  <div className="text-sm underline text-[#555555]">
                    view all
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-2 mt-3">
                  {all.prosites?.map((d, i) => (
                    <a
                      href={`https://grovyo.com/${d?.username}`}
                      target="_blank"
                      key={i}
                      className="flex flex-row items-center py-1 bg-[#f7f7f7] rounded-lg dark:bg-[#0D0D0D] px-3 justify-between"
                    >
                      <div className="flex justify-center items-center">
                        <div className="h-[45px] w-[45px]">
                          <img
                            src={d?.dps}
                            className="w-full h-full object-cover bg-[#fff] rounded-[20px]"
                          />
                        </div>
                        <div className="px-2 py-2 :text-white text-black dark:text-white text-[14px] font-bold ">
                          <div className="flex items-center gap-1">
                            <div>{d?.fullname}</div>

                            {d?.isverified && (
                              <div>
                                <MdVerified className="text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div className="text-[11px] dark:text-white">
                            {d?.username}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm underline">view</div>
                    </a>
                  ))}
                </div>
              </div>

              {/* community */}
              <div>
                <div className="dark:bg-[#171717] bg-[#f1f1f1] rounded-xl flex justify-between items-center p-2 px-4">
                  <div className="font-semibold">
                    Community
                    <span className="text-[#5585FF]">
                      ({all.community?.length})
                    </span>
                  </div>
                  <div className="text-sm underline text-[#555555]">
                    view all
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-2 mt-3">
                  {all.community?.map((d, i) => (
                    <a
                      href={`https://grovyo.com/main/feed/newForYou/${d?._id}`}
                      target="_blank"
                      key={i}
                      className="flex flex-row items-center py-1 bg-[#f7f7f7] rounded-lg dark:bg-[#0D0D0D] px-3 justify-between"
                    >
                      <div className="flex justify-center items-center">
                        <div className="h-[45px] w-[45px]">
                          <img
                            src={d?.img}
                            className="w-full h-full object-cover bg-[#fff] rounded-[20px]"
                          />
                        </div>
                        <div className="px-2 py-2 :text-white text-black dark:text-white text-[14px] font-bold ">
                          <div className="flex items-center gap-1">
                            <div>{d?.title}</div>
                          </div>
                          <div className="text-[11px] dark:text-white">
                            {d?.memberscount}{" "}
                            {Number(d?.memberscount) > 1 ? "members" : "member"}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm underline">view</div>
                    </a>
                  ))}
                </div>
              </div>

              {/* posts */}
              <div>
                <div className="dark:bg-[#171717] bg-[#f1f1f1] rounded-xl flex justify-between items-center p-2 px-4">
                  <div className="font-semibold">
                    Posts{" "}
                    <span className="text-[#5585FF]">
                      ({all.posts?.length})
                    </span>
                  </div>
                  <div className="text-sm underline text-[#555555]">
                    view all
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-2 mt-3">
                  {all.posts?.map((d, i) => (
                    <a
                      href={`https://grovyo.com/main/feed/newForYou/${d?.community?._id}#${d?._id}`}
                      target="_blank"
                      key={i}
                      className="flex flex-row items-center py-1 bg-[#f7f7f7] rounded-lg dark:bg-[#0D0D0D] px-3 justify-between"
                    >
                      <div className="flex justify-center items-center">
                        <div className="h-[45px] w-[45px]">
                          <img
                            src={d?.img}
                            className="w-full h-full min-h-[45px] min-w-[45px] max-h-[45px] max-w-[45px] object-cover bg-[#fff] rounded-[20px]"
                          />
                        </div>
                        <div className="px-2 py-2 flex flex-col gap-1 text-black dark:text-white text-[14px] font-bold ">
                          <div className="flex items-center gap-1">
                            <div className="text-[#CFCDDE] ">
                              {d?.title?.length > 32
                                ? `${d?.title?.substring(0, 32)}...`
                                : d?.title}
                            </div>
                          </div>
                          <div className="text-[11px] max-w-[90%] dark:text-white">
                            {d?.desc && d?.desc?.length > 49
                              ? `${d?.desc?.substring(0, 49)}...`
                              : d?.desc}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm underline">view</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[100%] flex justify-center items-start">
              <div className="flex justify-center items-center h-full max-h-[400px]">
                {theme === "dark" ? (
                  <Lottie animationData={searchlottie} size={100} loop={true} />
                ) : (
                  <Lottie animationData={searchblack} size={100} loop={true} />
                )}
              </div>
            </div>
          )}
        </>
      )}

      {active === "posts" && (
        <>
          {posts.length > 0 ? (
            <div
              className={`p-2 mt-4 flex flex-col gap-5 overflow-y-scroll ${styles.customScrollbar}`}
            >
              <div>
                <div className="dark:bg-[#171717] bg-[#f1f1f1] rounded-xl flex justify-between items-center p-2 px-4">
                  <div className="font-semibold">
                    Posts{" "}
                    <span className="text-[#5585FF]">({posts?.length})</span>
                  </div>
                  <div className="text-sm underline text-[#555555]">
                    view all
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-2 mt-3">
                  {posts?.map((d, i) => (
                    <a
                      href={`https://grovyo.com/main/feed/newForYou/${d?.community?._id}#${d?._id}`}
                      target="_blank"
                      key={i}
                      className="flex flex-row items-center py-1 bg-[#f7f7f7] rounded-lg dark:bg-[#0D0D0D] px-3 justify-between"
                    >
                      <div className="flex justify-center items-center">
                        <div className="h-[45px] w-[45px]">
                          <img
                            src={d?.img}
                            className="w-full h-full min-h-[45px] min-w-[45px] max-h-[45px] max-w-[45px] object-cover bg-[#fff] rounded-[20px]"
                          />
                        </div>
                        <div className="px-2 py-2 flex flex-col gap-1 text-black dark:text-white text-[14px] font-bold ">
                          <div className="flex items-center gap-1">
                            <div className="text-[#CFCDDE] ">
                              {d?.title?.length > 32
                                ? `${d?.title?.substring(0, 32)}...`
                                : d?.title}
                            </div>
                          </div>
                          <div className="text-[11px] max-w-[90%] dark:text-white">
                            {d?.desc && d?.desc?.length > 49
                              ? `${d?.desc?.substring(0, 49)}...`
                              : d?.desc}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm underline">view</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[100%] flex justify-center items-start">
              <div className="flex justify-center items-center h-full max-h-[400px]">
                {theme === "dark" ? (
                  <Lottie animationData={searchlottie} size={100} loop={true} />
                ) : (
                  <Lottie animationData={searchblack} size={100} loop={true} />
                )}
              </div>
            </div>
          )}
        </>
      )}

      {active === "prosites" && (
        <>
          {data.length > 0 ? (
            <div
              className={`p-2 mt-4 flex flex-col gap-5 overflow-y-scroll ${styles.customScrollbar}`}
            >
              <div>
                <div className="dark:bg-[#171717] bg-[#f1f1f1] rounded-xl flex justify-between items-center p-2 px-4">
                  <div className="font-semibold">
                    Prosite{" "}
                    <span className="text-[#5585FF]">({data?.length})</span>
                  </div>
                  <div className="text-sm underline text-[#555555]">
                    view all
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-2 mt-3">
                  {data?.map((d, i) => (
                    <a
                      href={`https://grovyo.com/${d?.p?.username}`}
                      target="_blank"
                      key={i}
                      className="flex flex-row items-center py-1 bg-[#f7f7f7] rounded-lg dark:bg-[#0D0D0D] px-3 justify-between"
                    >
                      <div className="flex justify-center items-center">
                        <div className="h-[45px] w-[45px]">
                          <img
                            src={d?.dps}
                            className="w-full h-full object-cover bg-[#fff] rounded-[20px]"
                          />
                        </div>
                        <div className="px-2 py-2 :text-white text-black dark:text-white text-[14px] font-bold ">
                          <div className="flex items-center gap-1">
                            <div>{d?.p?.fullname}</div>

                            {d?.p?.isverified && (
                              <div>
                                <MdVerified className="text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div className="text-[11px] dark:text-white">
                            {d?.p?.username}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm underline">view</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`p-2 mt-4 flex flex-col gap-5 overflow-y-scroll ${styles.customScrollbar}`}
            >
              <div>
                <div className="dark:bg-[#171717] bg-[#f1f1f1] rounded-xl flex justify-between items-center p-2 px-4">
                  <div className="font-semibold">
                    Recent Prosite Searches{" "}
                    <span className="text-[#5585FF]">
                      ({recentSearchPro?.length})
                    </span>
                  </div>
                  <div className="text-sm underline text-[#555555]">
                    view all
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-2 mt-3">
                  {recentSearchPro?.map((d, i) => (
                    <div
                      key={i}
                      className="flex flex-row items-center py-1 bg-[#f7f7f7] rounded-lg dark:bg-[#0D0D0D] px-3 justify-between"
                    >
                      <a
                        href={`https://grovyo.com/${d?.username}`}
                        target="_blank"
                        className="flex justify-center items-center"
                      >
                        <div className="h-[45px] w-[45px]">
                          <img
                            src={d?.dp}
                            className="w-full h-full object-cover bg-[#fff] rounded-[20px]"
                          />
                        </div>
                        <div className="px-2 py-2 :text-white text-black dark:text-white text-[14px] font-bold ">
                          <div className="flex items-center gap-1">
                            <div>{d?.fullname}</div>

                            {d?.isverified && (
                              <div>
                                <MdVerified className="text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div className="text-[11px] dark:text-white">
                            {d?.username}
                          </div>
                        </div>
                      </a>
                      <div>
                        <RxCross2 onClick={() => removeSearchPro(d?.id)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {active === "communities" && (
        <>
          {dataa.length > 0 ? (
            <div
              className={`p-2 mt-4 flex flex-col gap-5 overflow-y-scroll ${styles.customScrollbar}`}
            >
              <div>
                <div className="dark:bg-[#171717] bg-[#f1f1f1] rounded-xl flex justify-between items-center p-2 px-4">
                  <div className="font-semibold">
                    Community
                    <span className="text-[#5585FF]">({dataa?.length})</span>
                  </div>
                  <div className="text-sm underline text-[#555555]">
                    view all
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-2 mt-3">
                  {dataa?.map((d, i) => (
                    <a
                      href={`https://grovyo.com/main/feed/newForYou/${d?.p?._id}`}
                      target="_blank"
                      key={i}
                      className="flex flex-row items-center py-1 bg-[#f7f7f7] rounded-lg dark:bg-[#0D0D0D] px-3 justify-between"
                    >
                      <div className="flex justify-center items-center">
                        <div className="h-[45px] w-[45px]">
                          <img
                            src={d?.dps}
                            className="w-full h-full object-cover bg-[#fff] rounded-[20px]"
                          />
                        </div>
                        <div className="px-2 py-2 :text-white text-black dark:text-white text-[14px] font-bold ">
                          <div className="flex items-center gap-1">
                            <div>{d?.p?.title}</div>
                          </div>
                          <div className="text-[11px] dark:text-white">
                            {d?.p?.memberscount}{" "}
                            {Number(d?.p?.memberscount) > 1
                              ? "members"
                              : "member"}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm underline">view</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`p-2 mt-4 flex flex-col gap-5 overflow-y-scroll ${styles.customScrollbar}`}
            >
              <div>
                <div className="dark:bg-[#171717] bg-[#f1f1f1] rounded-xl flex justify-between items-center p-2 px-4">
                  <div className="font-semibold">
                    Recent Community Searches{" "}
                    <span className="text-[#5585FF]">
                      ({recentSearchCom?.length})
                    </span>
                  </div>
                  <div className="text-sm underline text-[#555555]">
                    view all
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-2 mt-3">
                  {recentSearchCom?.map((d, i) => (
                    <div
                      key={i}
                      className="flex flex-row items-center py-1 bg-[#f7f7f7] rounded-lg dark:bg-[#0D0D0D] px-3 justify-between"
                    >
                      <a
                        href={`https://grovyo.com/main/feed/newForYou/${d?._id}`}
                        target="_blank"
                        className="flex justify-center items-center"
                      >
                        <div className="h-[45px] w-[45px]">
                          <img
                            src={d?.dp}
                            className="w-full h-full object-cover bg-[#fff] rounded-[20px]"
                          />
                        </div>
                        <div className="px-2 py-2 :text-white text-black dark:text-white text-[14px] font-bold ">
                          <div className="flex items-center gap-1">
                            <div>{d?.title}</div>
                          </div>
                          <div className="text-[11px] dark:text-white">
                            {d?.memberscount}{" "}
                            {Number(d?.memberscount) > 1 ? "members" : "member"}
                          </div>
                        </div>
                      </a>
                      <div>
                        <RxCross2 onClick={() => removeSearchCom(d?.p?._id)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 
      <div className=" w-[100%] px-2 flex flex-row py-2 select-none ">
        <div

          onClick={() => setActive("prosites")}
          className={`${active === "prosites"
            ? " text-[12px] text-white  font-medium bg-blue-500 rounded-lg mx-1 px-2 py-1 flex justify-center items-center"
            : "text-[12px] text-[#717171] font-medium dark:bg-[#171717] dark:text-white bg-[#f7f7f7] rounded-lg mx-1 px-2 py-1 flex justify-center items-center"
            }`}
        >
          Prosite
        </div>
        <div
          onClick={() => setActive("communities")}
          className={`${active === "communities"
            ? "text-[12px] text-white  font-medium bg-blue-500 rounded-lg mx-1 px-2 py-1 flex justify-center items-center"
            : "text-[12px] text-[#717171] font-medium dark:bg-[#171717] dark:text-white bg-[#f7f7f7] rounded-lg mx-1 px-2 py-1 flex justify-center items-center"
            }`}
        >
          Communities
        </div>
      </div> */}

      {/* <div className=" w-[100%] px-10">
        <div className="w-[100%] bg-[#f6f6f6] dark:bg-bluelight :bg-[#171717] h-[1px]"></div>
      </div> */}

      {/* <div className={`overflow-auto ${styles.customScrollbar
        }`}>
        {active === "prosites" ? (
          <>
            {data?.length > 0 ? (
              <div className="">
                {data.map((d, i) => (
                  <div
                    className="flex flex-row items-center dark:bg-[#171717] pt-1 bg-[#f7f7f7] dark:bg-bluelight px-2 justify-between"
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

                    className="flex flex-row items-center dark:bg-[#171717] pt-1 bg-[#f7f7f7] dark:bg-bluelight px-2 justify-between"
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
                        <div className="text-[11px] dark:text-white">{d?.p?.memberscount}{d?.p?.memberscount > 1 ? " members" : " member"}</div>
                      </div>
                    </div>

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
                      <div className="px-2 :text-white py-2 dark:text-white text-black  ">
                        <div className="text-[14px] font-bold ">{d?.title}</div>
                        <div className="text-[11px]">{d?.member}{d?.member > 1 ? " members" : " member"}</div>
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
      </div> */}
    </div>
  );
}

export default Search;
