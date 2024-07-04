"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { auth, database } from "../../../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ref, set, onValue, remove } from "firebase/database";
import axios from "axios";
import { API } from "../../../Essentials";
import { CgSpinner } from "react-icons/cg";
import Cookies from "js-cookie";
import { useAuthContext } from "../../utils/AuthWrapper";
import { QRCodeSVG } from "qrcode.react";
import { RiLoader4Line, RiLockPasswordLine } from "react-icons/ri";
import { decryptaes } from "@/app/utils/useful";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdOutlineMailOutline } from "react-icons/md";
import dynamic from "next/dynamic";
const DynamicOtpInput = dynamic(() => import("otp-input-react"), {
  ssr: false,
});

function page() {
  const [otp, setOtp] = useState("");
  const otpElementRef = useRef(null);
  const router = useRouter();
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [come, setCome] = useState(0);
  const { f } = useAuthContext();
  const otpInputRef = useRef(null);
  const [change, setChange] = useState(1);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  // const [email, setEmail] = useState("memerdevgamer23@gmail.com");
  // const [pass, setPass] = useState("12345678");
  const [load, setLoad] = useState(false);
  const [loadingqr, setLoadingqr] = useState(false);
  const [qrCodeValue, setQRCodeValue] = useState("");
  const newRandomString = generateRandomString(17);
  const starCountRef = ref(database, `/qr/`);
  const strignref = useRef(null);

  const handleOtpChange = (otp) => {
    try {
      setOtp(otp);
    } catch (error) {
      toast.error("Something Went Wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    let interval;
    if (seconds === 0) {
      setSeconds(0);
      setIsActive(true);
      setCome(come + 1);
    }
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      if (seconds === 0) {
        setSeconds(0);
        setCome(1);
      }
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => {
    onSignup();
    setSeconds(30);
  };

  function generateRandomString(length) {
    const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return randomString;
  }

  const writeUserData = useCallback(async (newRandomString) => {
    set(ref(database, `/qr/${newRandomString}/`), { data: "null" });
  }, []);

  const updateRandomString = useCallback(() => {
    strignref.current = newRandomString;
    setQRCodeValue(newRandomString);
    writeUserData(newRandomString);
  }, []);

  useEffect(() => {
    updateRandomString();
    const unsub = onValue(starCountRef, async (snapshot) => {
      const data = snapshot.val();
      if (
        strignref?.current &&
        data[strignref?.current]?.data !== "null" &&
        loading === false
      ) {
        const fd = decryptaes(data[strignref?.current]?.data);

        setLoadingqr(true);
        if (fd) {
          const dataforSend = JSON.parse(fd);

          const res = await axios.post(`${API}/webcheckqr`, {
            id: dataforSend?.id,
          });
          if (res.data?.success) {
            setTimeout(async () => {
              await cookiesSetter(res);
              setTimeout(() => {
                const reref = ref(database, `/qr/${strignref?.current}/`);
                remove(reref)
                  .then(() => {
                    setLoadingqr(false);
                  })
                  .catch((error) => {
                    console.error("Error deleting data:", error.message);
                  });
              }, 1000);
            }, 2000);
          }
        }
      }
    });

    return () => {
      unsub();
    };
  }, []);

  const cookiesSetter = async (res) => {
    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      Cookies.set("access_token", res.data.access_token, {
        expires: expirationDate,
      });
      Cookies.set("refresh_token", res.data.refresh_token, {
        expires: expirationDate,
      });

      const token = Cookies.get("access_token");

      await f(token);
      toast.success("Login Successfull!");
      router.push("/main/feed/newForYou");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchid = async () => {
    await axios
      .post(`${API}/webapplogin`, { phone: "91" + number })
      .then(async function (res) {
        if (res.data.success === true) {
          if (res.data.userexists) {
            await cookiesSetter(res);
          } else {
            toast.error("Seems like you don't have an account in the app.");
            router.push(`/login/singUp?no=${number}`);
          }
        } else {
          toast.error("Something went wrong...");
        }
      })
      .catch(function (error) {
        console.log(error, "fetchid");
        toast.error("Something went wrong...");
      });
  };

  function onCaptchaVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        }
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchaVerify();
    setSeconds(30);
    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+91" + number;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("Successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        setLoading(false);
        fetchid();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  const handleCreate = async () => {
    setLoad(true);

    try {
      const res = await axios.post(`${API}/webcheckemail`, {
        email,
        password: pass,
      });
      if (res.data.success) {
        if (res.data.userexists) {
          await cookiesSetter(res);
        } else {
          toast.apply("Seems like you don't have an account in the app.");
          router.push("../login/singUp");
        }
      } else {
        toast.error("Wrong Details");
      }
    } catch (e) {
      console.log(e);
      setLoad(false);
    }
    setLoad(false);
  };

  useEffect(() => {
    let otpCapture = document.getElementById("send-otp");
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (number.length === 10) {
          onSignup();
        }
      }
    };

    if (otpCapture) {
      otpCapture.addEventListener("keypress", handleKeyPress);
    }
    return () => {
      if (otpCapture) {
        otpCapture.removeEventListener("keypress", handleKeyPress);
      }
    };
  }, [number]);

  useEffect(() => {
    const verifyOtp = otpInputRef.current;
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (otp.length === 6) {
          onOTPVerify();
        }
      }
    };

    if (verifyOtp) {
      verifyOtp.addEventListener("keypress", handleKeyPress);
    }

    return () => {
      if (verifyOtp) {
        verifyOtp.removeEventListener("keypress", handleKeyPress);
      }
    };
  }, [otp, otpInputRef]);

  return (
    <div
      className="min-w-full flex justify-center
	items-center sm:h-screen h-full"
    >
      <div
        className={`${
          loadingqr
            ? "fixed inset-0 w-screen z-50 bg-black/60 h-screen flex justify-center items-center backdrop-blur-md"
            : "hidden -z-50"
        } `}
      >
        <div className="animate-spin">
          <RiLoader4Line className="text-3xl" />
        </div>
      </div>
      <Toaster toastOptions={{ duration: 4000 }} />

      <div id="recaptcha-container"></div>

      <div className="lg:w-[55%] pn:max-sm:mt-6 md:w-[80%] sm:bg-[#E9E9E9] sm:dark:bg-[#242729f3] p-5 rounded-xl">
        <div className="h-full flex flex-col">
          <div className="mb-5 flex gap-3  justify-center  items-center flex-col">
            <div className="relative bg-white border-2 border-[#f3f3f3] dark:border-white p-3 rounded-lg">
              <QRCodeSVG
                style={{
                  width: "200px",
                  height: "200px",
                }}
                className="w-[180px] h-[180px]"
                value={qrCodeValue}
              />
            </div>
            <div className="flex flex-col gap-3 justify-center items-center">
              <div className="max-w-[70%] text-sm font-medium text-black dark:text-[#E4E4E4] text-center">
                Use your phone camera to scan this code to log in instanly
              </div>
            </div>
            <div className="text-xl font-semibold">Sign in with QR code</div>

            <div className="flex  items-center justify-center w-full">
              <hr className="flex-grow border-t text-[#686B6E] border-[#363A3D] " />
              <span className="px-3  text-sm font-medium text-[#686B6E] bg-transparent ">
                or Sign in with
              </span>
              <hr className="flex-grow border-t text-[#686B6E] border-[#363A3D]" />
            </div>

            <div className="w-full flex justify-center flex-col items-center">
              <div className="flex justify-center items-center gap-2 w-full sm:w-[90%]">
                <div
                  onClick={() => setChange(1)}
                  className={`flex justify-center items-center  ${
                    change == 1
                      ? "bg-[#000000] text-white"
                      : "dark:bg-[#1A1D21] bg-[#DEE1E5] text-[#686B6E]"
                  } rounded-xl  text-sm p-2  w-full gap-3`}
                >
                  <div>
                    <FaPhoneAlt />
                  </div>
                  <div>Phone Number</div>
                </div>
                <div
                  onClick={() => setChange(2)}
                  className={`flex justify-center ${
                    change == 2
                      ? "bg-[#000000] text-white"
                      : "dark:bg-[#1A1D21] bg-[#DEE1E5] text-[#686B6E]"
                  }  text-sm p-2 items-center rounded-xl w-full gap-3`}
                >
                  <div>
                    <MdEmail />
                  </div>
                  <div>Email</div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-2 w-full sm:w-[90%]">
                {/* phone */}

                {showOTP ? (
                  <div className="mt-2 w-full flex flex-col gap-4 justify-center  items-center">
                    <div
                      ref={otpInputRef}
                      className=" w-full flex gap-4 ml-[20px] justify-center   items-center"
                    >
                      <DynamicOtpInput
                        value={otp}
                        onChange={handleOtpChange}
                        OTPLength={6}
                        otpType="number"
                        // ref={otpInputRef}
                        disabled={false}
                        autoFocus
                        className="opt-container sm:mt-3"
                      ></DynamicOtpInput>
                    </div>
                    <div
                      //onClick={onSignup}
                      onClick={onOTPVerify}
                      className="h-[50px] w-full select-none cursor-pointer bg-[#0066ff] flex items-center justify-center rounded-2xl text-white "
                    >
                      {loading && (
                        <CgSpinner size={20} className="m-1 animate-spin" />
                      )}
                      <span className={`${loading ? "hidden" : ""} `}>
                        Continue
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${
                      change === 1
                        ? "flex justify-start flex-col w-full mt-2 items-start  py-4"
                        : "hidden"
                    }`}
                  >
                    <div className="w-full dark:bg-[#1A1D21] bg-[#DEE1E5] flex items-center rounded-2xl">
                      <div className="dark:text-white pl-2">+91</div>
                      <div className="h-[20px] ml-2 border-r border-[#acafb2]" />
                      <input
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            onSignup();
                          }
                        }}
                        type="tel"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Phone no."
                        className="h-[50px] w-full text-black dark:text-[#fff] outline-none dark:bg-[#1A1D21] bg-[#DEE1E5] rounded-r-2xl px-2 p-2 "
                      />
                    </div>
                    <div
                      className={`w-full ${change === 1 ? "py-3" : "hidden"} `}
                    >
                      <div
                        onClick={onSignup}
                        // onClick={fetchid}
                        className="h-[50px] w-full select-none cursor-pointer bg-[#0066ff] flex items-center justify-center rounded-2xl text-white "
                      >
                        {loading && (
                          <CgSpinner size={20} className="m-1 animate-spin" />
                        )}
                        <span className={`${loading ? "hidden" : ""} `}>
                          Continue
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* email */}
                <div
                  className={`w-full flex flex-col mt-4 gap-2 ${
                    change === 2 ? "" : "hidden"
                  }`}
                >
                  <div className="flex items-center rounded-2xl px-3 dark:bg-[#1A1D21] bg-[#DEE1E5]">
                    <div className="">
                      <MdOutlineMailOutline />
                    </div>
                    <input
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          // onSignup();
                          handleCreate();
                        }
                      }}
                      type="email"
                      className=" w-full text-black dark:text-[#fff] placeholder:text-sm outline-none rounded-2xl dark:bg-[#1A1D21] bg-[#DEE1E5] p-3 px-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex items-center rounded-2xl px-3 dark:bg-[#1A1D21] bg-[#DEE1E5]">
                    <div className="">
                      <RiLockPasswordLine />
                    </div>
                    <input
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          // onSignup();
                          handleCreate();
                        }
                      }}
                      type="password"
                      className=" w-full text-black dark:text-[#fff] placeholder:text-sm outline-none rounded-2xl dark:bg-[#1A1D21] bg-[#DEE1E5] p-3 px-2"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="py-5 ">
                    <div
                      //onClick={onSignup}
                      onClick={handleCreate}
                      className="h-[50px] w-full select-none cursor-pointer bg-[#0066ff] flex items-center justify-center rounded-2xl text-white "
                    >
                      {loading && (
                        <CgSpinner size={20} className="m-1 animate-spin" />
                      )}
                      <span className={`${loading ? "hidden" : ""} `}>
                        Continue
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
