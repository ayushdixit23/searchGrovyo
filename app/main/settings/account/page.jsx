"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/utils/AuthWrapper";
import Cookies from "js-cookie";
import { FaCamera, FaLink, FaPen } from "react-icons/fa";
import axios from "axios";
import { API } from "@/Essentials";
import toast from "react-hot-toast";
import { LiaToggleOffSolid, LiaToggleOnSolid } from "react-icons/lia";

const page = () => {
  const { data: user } = useAuthContext();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [loading2, setLoading2] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState({
    insta: "",
    snap: "",
    youtube: "",
    linkedin: "",
    x: "",
  });
  const [profile, setProfile] = useState({
    fullname: "",
    username: "",
    date: "",
    image: "",
    email: "",
    phone: "",
    bio: "",
  });

  const formatDatetime = (datetimeString) => {
    const datetimeObject = new Date(datetimeString);
    return (
      ("0" + datetimeObject.getDate()).slice(-2) +
      "/" +
      ("0" + (datetimeObject.getMonth() + 1)).slice(-2) +
      "/" +
      datetimeObject.getFullYear()
    );
  };

  const formatDatetimereverse = (datetimeString) => {
    const date = datetimeString?.split("/");
    const revrsedDate = date?.reverse();
    const year = revrsedDate?.[0];
    const month = revrsedDate?.[1];
    const day = revrsedDate?.[2];
    return `${year}-${month}-${day}`;
  };

  const sendDetails = async (e) => {
    e.preventDefault();
    const stringDate = formatDatetime(profile.date);
    try {
      setLoading2(true);
      const data = new FormData();
      data.append("name", profile.fullname);
      data.append("phone", profile.phone);
      data.append("email", profile.email);
      data.append("username", profile.username);
      data.append("date", stringDate);
      data.append("image", profile.image);
      data.append("bio", profile.bio);

      const response = await axios.post(
        `${API}/webprofileinfo/${user?.id}`,
        data
      );

      if (response.data?.success) {
        await resetCookies(response.data);
        router.refresh();
        setLoading2(false);
        toast.success("Changes Saved!");
      } else {
        toast.error(response.error.message);
      }
    } catch (e) {
      setLoading2(false);
      console.log(e);
    } finally {
      setLoading2(false);
    }
  };

  const resetCookies = async (data) => {
    try {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      Cookies.set("access_token", data.access_token, {
        expires: expirationDate,
      });
      Cookies.set("refresh_token", data.refresh_token, {
        expires: expirationDate,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`${API}/webgetprofileinfo/${user?.id}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user?.id]);

  useEffect(() => {
    setLoading(true);
    setProfile({
      ...profile,
      fullname: data?.data?.name,
      phone: data?.data?.phone == "91" ? "" : data?.data?.phone?.substring(2),
      email: data?.data?.email,
      username: data?.data?.username,
      image: data?.data?.image,
      bio: data?.data?.bio,
      date: formatDatetimereverse(data?.data?.date?.toString()),
    });
    setLoading(false);
  }, [user?.id, data]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfile({
      ...profile,
      image: file,
    });
  };

  const logout = () => {
    try {
      Cookies.remove(excktn);
      Cookies.remove(frhktn);
      setOpen(false);
      router.push("/login");
      setTimeout(() => {
        dispatch(sendData(""));
      }, 2500);
    } catch (error) {
      console.log(error);
    }
  };

  const isProfileChanged = () => {
    return (
      profile.fullname !== data?.data?.name ||
      profile.phone !== data?.data?.phone ||
      profile.email !== data?.data?.email ||
      profile.username !== data?.data?.username ||
      profile.image !== data?.data?.image ||
      profile.date !== formatDatetimereverse(data?.data?.date?.toString()) ||
      profile.bio !== data?.data?.bio
    );
  };

  const isProfileChangedAnswer = isProfileChanged();
  return (
    <>
      <div className="p-4 px-7 flex flex-col dark:bg-[#0D0D0D] h-screen gap-5">
        <div className="h-full flex flex-col gap-8 overflow-y-scroll no-scrollbar">
          <div className="dark:bg-[#0D0F10] bg-[#fafafa] rounded-xl p-6 pb-10">
            <div>
              <div className="text-sm font-semibold">Basic details</div>
              <div className="pl-16 mt-5">
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex items-center">
                      {data?.data?.image ? (
                        <label
                          htmlFor="settings"
                          className="relative light:border max-h-[100px] sm:z-30 rounded-[30px] max-w-[100px]"
                        >
                          <img
                            className="w-full h-full object-cover min-h-[100px] min-w-[100px] bg-cover rounded-[30px] max-h-[100px] max-w-[100px]"
                            src={
                              typeof profile.image === "string"
                                ? data?.data?.image
                                : profile.image
                                ? URL.createObjectURL(profile.image)
                                : ""
                            }
                            alt=""
                          />
                          <div className="absolute -bottom-1 right-1">
                            <div
                              htmlFor="settings"
                              className="w-9 h-9 cursor-pointer text-white flex justify-center items-center rounded-full bg-[#5570F1] "
                            >
                              <FaPen />
                            </div>
                          </div>

                          <input
                            id="settings"
                            name="image"
                            accept="image/*"
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      ) : (
                        <>
                          <label
                            htmlFor="settings"
                            className="w-[100px] relative mb-2 dark:bg-transparent dark:border  dark:border-dashed dark:border-[#555555] p-1 bg-[#ECECEE] items-center justify-center h-[100px] rounded-[30px] light:border-2 flex flex-col"
                          >
                            {!profile.image ? (
                              <div className=" w-full h-full flex justify-center dark:bg-transparent bg-[#ECECEE] items-center rounded-[30px]">
                                <div className="flex justify-center flex-col items-center">
                                  <FaCamera className="text-2xl" />
                                </div>
                              </div>
                            ) : (
                              <>
                                <img
                                  className="w-full h-full object-cover bg-cover rounded-[30px] max-h-[100px] max-w-[100px]"
                                  src={URL.createObjectURL(profile.image)}
                                  alt=""
                                />
                                <div className="absolute bottom-0 -right-7">
                                  <div
                                    htmlFor="settings"
                                    className="w-6 h-6 z-30 cursor-pointer text-white flex justify-center items-center rounded-full bg-[#5570F1] "
                                  >
                                    <FaPen className="text-sm" />
                                  </div>
                                </div>
                              </>
                            )}
                          </label>
                          <input
                            id="settings"
                            name="image"
                            accept="image/*"
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-[80%] flex flex-col gap-6">
                    <div className="flex p-2 px-4 flex-col rounded-xl  border dark:border-[#1F2228]">
                      <div className="w-full text-[#6C737F] text-xs">
                        Full Name
                      </div>
                      <div className="flex justify-center items-center bg-transparent pt-1 rounded-xl dark:border-none  w-full">
                        <input
                          type="text"
                          onChange={(e) =>
                            setProfile({ ...profile, fullname: e.target.value })
                          }
                          value={profile.fullname}
                          className="w-full outline-none text-sm rounded-xl bg-transparent placeholder:text-sm  "
                          placeholder="Charlene Reed"
                        />
                      </div>
                    </div>

                    <div className="flex p-2 px-4 flex-col rounded-xl  border dark:border-[#1F2228]">
                      <div className="w-full text-[#6C737F] text-xs">
                        Email Address
                      </div>
                      <div className="flex justify-center items-center bg-transparent pt-1 rounded-xl dark:border-none  w-full">
                        <input
                          type="email"
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          placeholder="charlenereed@gmail.com  "
                          value={profile.email}
                          className="w-full outline-none text-sm rounded-xl bg-transparent placeholder:text-sm  "
                        />
                      </div>
                    </div>

                    <div className="flex p-2 px-4 flex-col rounded-xl  border dark:border-[#1F2228]">
                      <div className="w-full text-[#6C737F] text-xs">
                        Username
                      </div>
                      <div className="flex justify-center items-center bg-transparent pt-1 rounded-xl dark:border-none  w-full">
                        <input
                          type="text"
                          onChange={(e) =>
                            setProfile({ ...profile, username: e.target.value })
                          }
                          placeholder="@charlenereed"
                          value={profile.username}
                          className="w-full outline-none text-sm rounded-xl bg-transparent placeholder:text-sm  "
                        />
                      </div>
                    </div>

                    <div className="flex p-2 px-4 flex-col rounded-xl  border dark:border-[#1F2228]">
                      <div className="w-full text-[#6C737F] text-xs">
                        Mobile Number
                      </div>
                      <div className="flex justify-center items-center bg-transparent pt-1 rounded-xl dark:border-none  w-full">
                        <div className="border-r dark:border-[#1F2228] text-sm bg-transparent pr-2 flex justify-center items-center">
                          +91
                        </div>
                        <input
                          type="tel"
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          value={profile.phone}
                          className="w-full outline-none pl-1 text-sm rounded-xl bg-transparent placeholder:text-sm  "
                          placeholder=" "
                        />
                      </div>
                    </div>

                    <div className="flex p-2 px-4 flex-col rounded-xl  border dark:border-[#1F2228]">
                      <div className="w-full text-[#6C737F] text-xs">Bio</div>
                      <div className="flex justify-center items-center bg-transparent pt-1 rounded-xl dark:border-none  w-full">
                        <textarea
                          type="text"
                          onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                          }
                          value={profile.bio}
                          className="w-full outline-none min-h-[80px] max-h-[200px] text-sm bg-transparent placeholder:text-sm  "
                          placeholder="Enter Your Bio"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dark:bg-[#0D0F10] bg-[#fafafa] flex flex-col gap-5  p-5 rounded-xl">
            <div className="font-semibold text-sm">Public profile</div>
            <div className="flex justify-between items-center gap-2">
              <div className=" font-medium text-sm">
                Make Contact Info Public
              </div>
              <div>
                <LiaToggleOffSolid className="text-2xl" />
                {/* <LiaToggleOnSolid /> */}
              </div>
            </div>

            <div className="font-medium text-sm ">
              Means that anyone viewing your profile will be able to see your
              contacts details.
            </div>
          </div>

          <div className="dark:bg-[#0D0F10] bg-[#fafafa] flex flex-col gap-5  p-5 rounded-xl">
            <div className="font-semibold text-sm">Social Media Links</div>

            <div className="font-medium text-sm ">Social accounts</div>
            <div className="w-[80%] flex flex-col gap-6">
              <div className="flex items-center gap-3 w-full">
                <FaLink />
                <div className="flex p-2 px-4 flex-col rounded-xl  w-full border dark:border-[#1F2228]">
                  <div className="w-full text-[#6C737F] text-xs">Instagram</div>
                  <div className="flex justify-center items-center bg-transparent pt-1 rounded-xl dark:border-none  w-full">
                    <input
                      type="text"
                      onChange={(e) =>
                        setLinks({ ...links, insta: e.target.value })
                      }
                      value={links.insta}
                      className="w-full outline-none text-sm rounded-xl bg-transparent placeholder:text-sm  "
                      placeholder="Paste Link here"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full">
                <FaLink />
                <div className="flex p-2 px-4 flex-col rounded-xl  w-full border dark:border-[#1F2228]">
                  <div className="w-full text-[#6C737F] text-xs">Snapchat</div>
                  <div className="flex justify-center items-center bg-transparent pt-1 rounded-xl dark:border-none  w-full">
                    <input
                      type="text"
                      onChange={(e) =>
                        setLinks({ ...links, snap: e.target.value })
                      }
                      value={links.snap}
                      className="w-full outline-none text-sm rounded-xl bg-transparent placeholder:text-sm  "
                      placeholder="Paste Link here"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full">
                <FaLink />
                <div className="flex p-2 px-4 flex-col rounded-xl  w-full border dark:border-[#1F2228]">
                  <div className="w-full text-[#6C737F] text-xs">Youtube</div>
                  <div className="flex justify-center items-center bg-transparent pt-1 rounded-xl dark:border-none  w-full">
                    <input
                      type="text"
                      onChange={(e) =>
                        setLinks({ ...links, youtube: e.target.value })
                      }
                      value={links.youtube}
                      className="w-full outline-none text-sm rounded-xl bg-transparent placeholder:text-sm  "
                      placeholder="Paste Link here"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full">
                <FaLink />
                <div className="flex p-2 px-4 flex-col rounded-xl  w-full border dark:border-[#1F2228]">
                  <div className="w-full text-[#6C737F] text-xs">LinkedIn</div>
                  <div className="flex justify-center items-center bg-transparent pt-1 rounded-xl dark:border-none  w-full">
                    <input
                      type="text"
                      onChange={(e) =>
                        setLinks({ ...links, linkedin: e.target.value })
                      }
                      value={links.linkedin}
                      className="w-full outline-none text-sm rounded-xl bg-transparent placeholder:text-sm  "
                      placeholder="Paste Link here"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full">
                <FaLink />
                <div className="flex p-2 px-4 flex-col rounded-xl  w-full border dark:border-[#1F2228]">
                  <div className="w-full text-[#6C737F] text-xs">X</div>
                  <div className="flex justify-center items-center bg-transparent pt-1 rounded-xl dark:border-none  w-full">
                    <input
                      type="text"
                      onChange={(e) =>
                        setLinks({ ...links, x: e.target.value })
                      }
                      value={links.x}
                      className="w-full outline-none text-sm rounded-xl bg-transparent placeholder:text-sm  "
                      placeholder="Paste Link here"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
