"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { MdArrowForwardIos, MdDelete } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { FaGooglePay } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { SiPhonepe, SiVisa } from "react-icons/si";
import { FaLocationDot } from "react-icons/fa6";
import { BsBank } from "react-icons/bs";
import { useAuthContext } from "../../../utils/AuthWrapper";
import axios from "axios";
import { API } from "../../../../Essentials";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

function page() {
  const [data, setData] = useState([]);
  const { data: user } = useAuthContext();
  const [up, setUp] = useState(false);
  const [select, setSelect] = useState(0);
  const params = useSearchParams();
  const addressPopup = params?.get("address");
  const [popUp, setPopUp] = useState(false);
  const router = useRouter();
  const [updateAddress, setUpdateAddress] = useState({
    streetaddress: "A/19 Shanti Nagar Cantt",
    city: "kanpur",
    state: "Uttar Pradesh",
    pincode: 208004,
    landmark: "Pandit Hotel",
    country: "India",
  });
  const [mrpPrice, setMrpPrice] = useState(null);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [actualPrice, setActualPrice] = useState(null);

  const removeItem = async (cardId, productId) => {
    try {
      const res = await axios.post(`
        ${API}/removecartweb/${user?.id}/${cardId}/${productId}
      `);
      if (res?.data?.success) {
        await fetchCart();
      } else {
        console.log("failed");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const changeAddress = async () => {
    try {
      const { city, country, landmark, pincode, state, streetaddress } =
        updateAddress;
      const res = await axios.post(`${API}/changeAddress/${user?.id}`, {
        streetaddress,
        city,
        state,
        pincode,
        landmark,
        country,
      });
      if (res.data.success) {
        router.push("/main/library/Cart");
        setUpdateAddress({
          ...updateAddress,
          streetaddress: res.data?.address?.streetaddress,
          country: res.data?.address?.country,
          city: res.data?.address?.city,
          landmark: res.data?.address?.landmark,
          pincode: res.data?.address?.pincode,
          state: res.data?.address?.state,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlus = async (cartId, quantity) => {
    try {
      const newData = data?.map((d) => {
        if (d?.c?._id === cartId) {
          return {
            ...d,
            c: {
              ...d.c,
              quantity: d.c.quantity + 1,
            },
          };
        } else {
          return d;
        }
      });
      setData(newData);
      const res = await axios.post(
        `${API}/updatequantityweb/${user?.id}/${cartId}`,
        {
          quantity: quantity + 1,
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMinus = async (cartId, quantity) => {
    try {
      if (quantity !== 1) {
        const newData = data?.map((d) => {
          if (d?.c?._id === cartId) {
            return {
              ...d,
              c: {
                ...d.c,
                quantity: d.c.quantity - 1,
              },
            };
          } else {
            return d;
          }
        });
        setData(newData);
        const res = await axios.post(
          `${API}/updatequantityweb/${user?.id}/${cartId}`,
          { quantity: quantity - 1 }
        );
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API}/fetchcart/${user?.id}`);
      // console.log(res.data?.data)
      setData(res.data?.data);
      setUpdateAddress({
        ...updateAddress,
        streetaddress: res.data?.address?.streetaddress,
        country: res.data?.address?.country,
        city: res.data?.address?.city,
        landmark: res.data?.address?.landmark,
        pincode: res.data?.address?.pincode,
        state: res.data?.address?.state,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user?.id) {
      fetchCart();
    }
  }, [user.id]);

  useEffect(() => {
    const obj = data?.map((d) => {
      return {
        quantity: d?.c?.quantity,
        discountedprice: d?.c?.product?.discountedprice,
        price: d?.c?.product?.price,
        discountedPriceCalculated:
          Number(d?.c?.quantity) * Number(d?.c?.product?.discountedprice),
        priceCalculated: Number(d?.c?.quantity) * Number(d?.c?.product?.price),
      };
    });

    const totalDiscountedPrice = obj.reduce((total, item) => {
      return total + item.discountedPriceCalculated;
    }, 0);

    const totalOriginalPrice = obj.reduce((total, item) => {
      return total + item.priceCalculated;
    }, 0);

    setActualPrice(totalDiscountedPrice);
    setDiscountedPrice(totalOriginalPrice - totalDiscountedPrice);
    setMrpPrice(totalOriginalPrice);
  }, [data, actualPrice, discountedPrice, mrpPrice]);

  const placeOrderWithCash = async () => {
    try {
      const productId = data.map((d) => {
        return d?.c?.product?._id;
      });
      const res = await axios.post(`${API}/cod/${user?.id}`, {
        deliverycharges: 28,
        productId,
      });

      if (res.data.success) {
        toast.success("Order Placed!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {addressPopup && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="flex flex-col items-center justify-center h-5/6 bg-white dark:bg-bluedark w-2/5 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Address</h2>
            <div className="space-y-4 w-3/4">
              <input
                type="text"
                value={updateAddress.streetaddress}
                onChange={(e) =>
                  setUpdateAddress({
                    ...updateAddress,
                    streetaddress: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Street Address"
              />
              <input
                type="text"
                value={updateAddress.city}
                onChange={(e) =>
                  setUpdateAddress({ ...updateAddress, city: e.target.value })
                }
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City"
              />
              <input
                type="text"
                value={updateAddress.state}
                onChange={(e) =>
                  setUpdateAddress({ ...updateAddress, state: e.target.value })
                }
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="State"
              />
              <input
                type="text"
                value={updateAddress.country}
                onChange={(e) =>
                  setUpdateAddress({
                    ...updateAddress,
                    country: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Country"
              />
              <input
                type="number"
                value={updateAddress.pincode}
                onChange={(e) =>
                  setUpdateAddress({
                    ...updateAddress,
                    pincode: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pincode"
              />
              <input
                type="text"
                value={updateAddress.landmark}
                onChange={(e) =>
                  setUpdateAddress({
                    ...updateAddress,
                    landmark: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Landmark"
              />
            </div>
            <div className="flex justify-between w-[70%] mt-4">
              <Link
                href={"/main/library/Cart"}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Cancel
              </Link>
              <button
                onClick={changeAddress}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="md:flex  dark:bg-[#ododod] h-[85.5vh]">
        {data.length !== 0 ? (
          <div className="sm:h-[100%] py-1 border-r dark:border-[#3e3e3e] pn:max-md:w-[100%] md:min-w-[390px] pn:max-sm:pt-40 bg-[#f4f4f4] dark:bg-bluedark flex items-center flex-col  h-[100vh] pn:max-md:fixed">
            {/* Shipping details */}
            <div
              onClick={() => {
                setUp(false);
              }}
              className="h-[150px] w-[100%] justify-evenly flex flex-col  items-center"
            >
              <div
                className="text-black  dark:text-white
               font-semibold pl-2 w-[100%] text-[14px] flex items-start"
              >
                Shipping details
              </div>
              <div className="w-[96%] h-[110px] py-1 justify-between px-2 dark:border dark:border-[#323d4e] bg-white dark:bg-bluedark flex rounded-lg items-center">
                <div className="w-[10%] h-[70%] flex  justify-center">
                  <FaLocationDot color="#00AB56" />
                </div>
                <div className="w-[65%] h-[85%]  justify-evenly flex flex-col">
                  <div className="text-[14px] text-[#28282B]  dark:text-white">
                    To
                  </div>

                  <div className="text-[13px] text-[#28282B]  dark:text-white">
                    {updateAddress?.streetaddress}
                  </div>
                  <div className="text-[13px] text-[#28282B]  dark:text-white truncate">
                    {updateAddress.city}, {updateAddress?.state}
                  </div>
                </div>
                <Link
                  href={"/main/library/Cart?address=true"}
                  className="w-[25%] h-[90%] items-center justify-evenly flex flex-row"
                >
                  <div className="text-[#0000FF] text-[14px]">Change</div>
                  <MdArrowForwardIos color="#0000FF" />
                </Link>
              </div>
            </div>
            <div
              onClick={() => {
                setUp(false);
              }}
              className=" w-[98%] px-2 justify-between flex items-center"
            >
              <div
                className="text-black  dark:text-white
               font-semibold text-[14px]"
              >
                Order Summary
              </div>
              <div className="text-[12px] font-medium ">
                {data?.length} items
              </div>
            </div>
            {/* product */}
            {data.map((d, e) => (
              // <Cart d={d} key={e} id={user?.id} data={data} removeItem={removeItem} />
              <div className="w-[96%] h-[110px] py-1 justify-center mt-2 bg-white dark:border-2 dark:border-[#323d4e] dark:bg-bluedark flex flex-col  rounded-lg items-center">
                <div className="w-[95%] h-[100%] bg-white dark:bg-bluedark mt-2 flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <img
                      alt="image"
                      src={d?.image}
                      className="bg-contain h-[90px] w-[90px] bg-[#f9f9f9]"
                    />
                    <div
                      className="flex flex-col text-black  dark:text-white
                     px-2 "
                    >
                      <div className="text-[14px] truncate max-w-[200px] font-semibold">
                        {d?.c?.product?.name}
                      </div>
                      <div className="text-[10px] font-semibold py-1">
                        Sold by {d?.c?.product?.sellername}
                      </div>
                      <div className="flex flex-row  font-semibold items-center">
                        <div className="text-[14px]">
                          {d?.c?.product?.discountedprice}
                        </div>
                        <strike className="text-[12px] text-[#A1A1A1] px-1">
                          {d?.c?.product?.price}
                        </strike>
                        <div className="text-[8px] text-[#B858ED] px-1">
                          {d?.c?.product?.percentoff}% Off
                        </div>
                      </div>
                      <div className="flex flex-row justify-between px-2 items-center rounded-lg bg-[#F6F6F6] dark:bg-transparent h-[30px] w-[120px]">
                        <div
                          onClick={() => handleMinus(d?.c?._id, d?.c?.quantity)}
                          className="bg-[#fefefe] dark:bg-transparent dark:border dark:border-[#323d4e] rounded-md text-black  dark:text-white
                           text-[20px] h-[20px] flex justify-center items-center w-[20px]"
                        >
                          -
                        </div>
                        <div
                          className=" text-black  dark:text-white
                         text-[14px]"
                        >
                          {d?.c?.quantity}
                        </div>
                        <div
                          onClick={() => handlePlus(d?.c?._id, d?.c?.quantity)}
                          className="bg-[#fefefe] dark:bg-transparent dark:border dark:border-[#323d4e] rounded-md text-black  dark:text-white
                           text-[20px] h-[20px] flex justify-center items-center w-[20px]"
                        >
                          +
                        </div>
                      </div>
                    </div>
                  </div>
                  <MdDelete
                    onClick={() => removeItem(d?.c?._id, d?.c?.product?._id)}
                    className="h-6 w-6 text-[#3e3e3e]"
                    color="#737373"
                  />
                </div>
              </div>
            ))}

            {/* button for bill */}
            <div
              className="bg-white md:hidden sm:max-md:w-[80%] shadow-3xl sm:max-md:rounded-xl fixed bottom-14 w-full py-4 px-4 rounded-t-xl flex justify-between items-center
           "
            >
              <div className="font-bold text-[16px]">Total Price: ₹</div>

              <div
                onClick={() => {
                  placeOrderWithCash();
                }}
                className="py-2 flex justify-center items-center bg-[#171717] text-[#171717] rounded-xl px-6"
              >
                Place order
              </div>
            </div>
            <div
              className={` ${
                up
                  ? "h-[100%] shadow-xl ring-1 ring-[#f1f1f1] rounded-t-lg bg-[#4a3fe748] md:hidden justify-center items-center sm:max-md:w-[90%] shadow-3xl w-full absolute bottom-0"
                  : "h-[100%] rounded-t-lg bg-[#fff] md:hidden  sm:max-md:w-[90%] shadow-3xl w-full absolute -bottom-[100vh]"
              }`}
            >
              <div
                className={`duration-75 ${
                  up
                    ? "h-[50px] w-[100%] rounded-full mt-40  md:hidden shadow-3xl flex justify-center items-center"
                    : "rounded-t-lg bg-[#fff] md:hidden shadow-3xl w-full"
                }`}
              >
                <div
                  onClick={() => {
                    setUp(false);
                  }}
                  className={`duration-75 ${
                    up
                      ? "h-[50px] w-[50px] shadow-xl rounded-full bg-[#dbdbdba2] md:hidden shadow-3xl text-[#fff] flex justify-center items-center"
                      : "rounded-t-lg bg-[#fff] md:hidden shadow-3xl w-full"
                  }`}
                >
                  <RxCross1 />
                </div>
              </div>
              <div
                className={`duration-75 ${
                  up
                    ? "h-[70%] shadow-xl ring-1 ring-[#f1f1f1] rounded-t-lg bg-[#fff] md:hidden  sm:max-md:w-[90%] shadow-3xl w-full absolute bottom-0"
                    : "h-[70%] rounded-t-lg bg-[#fff] md:hidden  sm:max-md:w-[90%] shadow-3xl w-full absolute -bottom-[100vh]"
                }`}
              >
                <div
                  className="w-[100%] md:hidden bg-white rounded-t-lg
             flex flex-col items-center justify-evenly h-[100%] "
                >
                  {/* No charges */}
                  <div className="w-[80%] h-[10%] bg-[#ffa4a4] rounded-lg flex flex-row items-center justify-center">
                    <div className="text-[18px] text-[#2D2D2D] px-1">Yay!</div>
                    <div className="text-[18px] text-[#2D2D2D]  font-semibold">
                      No Delivery Charge
                    </div>
                    <div className="text-[18px] text-[#2D2D2D] px-1">
                      on this order
                    </div>
                  </div>

                  {/* Price details*/}
                  <div className="w-[60%] h-[55%] bg-red-500 flex flex-col justify-between">
                    <div className="text-[16px] font-semibold text-black">
                      PRICE DETAILS{" "}
                      {data.map((d, i) => (
                        <div key={i}>{d?.length}</div>
                      ))}
                    </div>
                    {/* MRP */}
                    <div className="flex flex-row justify-between items-center">
                      <div className="text-[#737373] text-[14px]">
                        Total MRP
                      </div>
                      <div className="text-black text-[14px]">
                        Rs. {mrpPrice}
                      </div>
                    </div>

                    {/* Discount */}
                    <div className="flex flex-row justify-between items-center">
                      <div className="text-[#737373] text-[14px]">
                        Discount on MRP
                      </div>
                      <div className="text-[#2DC071] text-[14px]">
                        -Rs. {discountedPrice}
                      </div>
                    </div>

                    {/* Coupon Discount */}
                    <div className="flex flex-row justify-between items-center">
                      <div className="text-[#737373] text-[14px]">
                        Coupon Discount
                      </div>
                      <div className="text-black text-[14px]">Rs. 0</div>
                    </div>

                    {/* delivery charge */}
                    <div className="flex flex-row justify-between items-center">
                      <div className="text-[#737373] text-[14px]">
                        Delivery Charge
                      </div>
                      <div className="text-[#2DC071] text-[14px]">Free</div>
                    </div>

                    {/* Total charge */}
                    <div className="border-t-2 flex flex-row justify-between items-center py-2 bg">
                      <div className="text-[#737373] text-[14px]">
                        Total Amount
                      </div>
                      <div className="text-black font-bold text-[14px]">
                        Rs. {actualPrice}
                        {/* {d?.c?.product?.discountedprice} */}
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        setPopUp(false);
                      }}
                      className="bg-black rounded-lg flex flex-row justify-center items-center py-3"
                    >
                      <div className="text-white text-[14px]">Continue</div>
                    </div>
                  </div>
                  {/* PopUp */}
                  <div
                    className={` ${
                      popUp
                        ? "h-[100%] shadow-xl ring-1 ring-[#f1f1f1] rounded-t-lg bg-[#4e4e4e48] flex sm:max-md:w-[90%] shadow-3xl w-[100%] absolute bottom-0 left-0 right-0 top-0 z-40"
                        : "h-[100%] rounded-t-lg bg-[#272727] sm:max-md:w-[90%] shadow-3xl absolute bottom-0 hidden"
                    }`}
                  >
                    <div className="p-2 w-[100%] bg-white rounded-2xl px-2 pt-4">
                      <div className="flex justify-between items-center px-2">
                        <div className="w-[100%] font-medium ">
                          Shipping details
                        </div>
                        <RxCross1
                          onClick={() => {
                            setPopUp(false);
                          }}
                        />
                      </div>
                      <div className="px-2">
                        <div className="w-[100%] mt-2 bg-[#f9f9f9]  p-2 rounded-2xl">
                          <div className="">To</div>
                          <div>guyghu.gyguyg.gggui</div>
                          <div className="text-[#569aff] font-medium w-full text-right">
                            Change..
                          </div>
                        </div>
                      </div>
                      <div className="w-[100%] font-medium mt-4">
                        SELECT PAYMENT OPTION
                      </div>
                      <div className="px-4">
                        <div
                          onClick={() => {
                            setSelect(1);
                          }}
                          className="w-[100%] mt-2 bg-[#f9f9f9] p-2 rounded-2xl flex justify-between px-4 items-center"
                        >
                          <div className="flex gap-2 items-center">
                            <div
                              className={`${
                                select === 1
                                  ? "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-blue-600 flex justify-center items-center"
                                  : "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-white flex justify-center items-center"
                              }`}
                            >
                              <div className="ring-5 ring-blue-600 h-2 w-2 bg-white rounded-full"></div>
                            </div>{" "}
                            <div>Cash On Delivery</div>{" "}
                          </div>
                          <TbTruckDelivery className="text-green-500" />
                        </div>
                        <div
                          onClick={() => {
                            setSelect(2);
                          }}
                          className="w-[100%] mt-2 bg-[#f9f9f9] p-2 rounded-2xl flex justify-between px-4 items-center"
                        >
                          <div className="flex gap-2 items-center">
                            <div
                              className={`${
                                select === 2
                                  ? "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-blue-600 flex justify-center items-center"
                                  : "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-white flex justify-center items-center"
                              }`}
                            >
                              <div className="ring-5 ring-blue-600 h-2 w-2 bg-white rounded-full"></div>
                            </div>{" "}
                            <div>PhonePay/Google Pay/BHIM UPI </div>{" "}
                          </div>
                          <div className="gap-2 flex">
                            <FaGooglePay />
                            <SiPhonepe className="text-purple-600" />
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setSelect(3);
                          }}
                          className="w-[100%] mt-2 bg-[#f9f9f9] p-2 rounded-2xl flex justify-between px-4 items-center"
                        >
                          <div className="flex gap-2 items-center">
                            <div
                              className={`${
                                select === 3
                                  ? "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-blue-600 flex justify-center items-center"
                                  : "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-white flex justify-center items-center"
                              }`}
                            >
                              <div className="ring-5 ring-blue-600 h-2 w-2 bg-white rounded-full"></div>
                            </div>{" "}
                            <div>Net Banking</div>{" "}
                          </div>
                          <BsBank className="text-blue-300" />
                        </div>
                        <div
                          onClick={() => {
                            setSelect(4);
                          }}
                          className="w-[100%] mt-2 bg-[#f9f9f9] p-2 rounded-2xl px-4 "
                        >
                          <div className="flex justify-between items-center w-full">
                            <div className="flex gap-2 items-center">
                              <div
                                className={`${
                                  select === 4
                                    ? "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-blue-600 flex justify-center items-center"
                                    : "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-white flex justify-center items-center"
                                }`}
                              >
                                <div className="ring-5 ring-blue-600 h-2 w-2 bg-white rounded-full"></div>
                              </div>{" "}
                              <div>Credit/Debit Card</div>{" "}
                            </div>
                            <SiVisa className="text-purple-600" />
                          </div>
                          <div className="w-full px-4">
                            <input
                              placeholder="Card Number"
                              className="bg-[#fff] w-full mt-2 h-10 rounded-xl pl-2"
                            />
                            <input
                              placeholder="Name on Card"
                              className="bg-[#fff] w-full mt-2 h-10 rounded-xl pl-2"
                            />
                            <div className="flex justify-between w-full mt-2 items-center">
                              <input
                                placeholder="MM/YY"
                                className="bg-[#fff] w-[45%] h-10 rounded-xl pl-2"
                              />
                              <input
                                placeholder="CVV"
                                className="bg-[#fff] w-[45%] h-10 rounded-xl pl-2"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-[#171717] rounded-2xl py-2 text-white flex justify-center items-center mt-4">
                          {" "}
                          Continue
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pn:max-md:w-[100%] md:min-w-[390px] pn:max-md:h-[100%] bg-[#ffffff] dark:bg-bluedark border-r-2 dark:border-[#3e3e3e] border-[#f9f9f9] flex items-center flex-col">
            <div className="h-[100%] w-[100%] flex items-center flex-col justify-center ">
              {/* <Image
              alt="cart"
              src={cart}
              className="h-[250px] w-[250px] mt-10"
            /> */}
              <div className="text-black dark:text-white text-[27px] font-sans font-bold mt-2 mb-2">
                Your Cart is Empty
              </div>
              <div className="text-[#9E9E9E] text-[16px] font-sans ">
                Looks like you haven’t added
              </div>
              <div className="text-[#9E9E9E] text-[16px] font-sans ">
                anything to your cart yet
              </div>
              <div className="text-white p-2 text-[14px] mt-3 px-4 bg-[#307EF4] rounded-3xl flex justify-center items-center">
                Go Shop
              </div>
            </div>
          </div>
        )}
        {/* out */}

        <div
          className="w-[100%] pn:max-md:hidden dark:bg-red-900 absolute dark:bg-bluedark bg-white
	   flex flex-col items-center justify-center "
        >
          <div
            className="pn:max-md:hidden dark:bg-bluelight  bg-[#f9f9f9]
	   flex flex-col items-center justify-evenly m-2 p-4 w-[80%] rounded-2xl h-[80%] "
          >
            {/* No charges */}
            <div className="w-[80%] h-[10%] bg-[#f9f9f9] dark:bg-bluelight rounded-lg flex flex-row items-center justify-center">
              <div className="text-[18px] text-[#2D2D2D]  dark:text-white px-1">
                Yay!
              </div>
              <div className="text-[18px] text-[#2D2D2D]  dark:text-white  font-semibold">
                No Delivery Charge
              </div>
              <div className="text-[18px] text-[#2D2D2D]  dark:text-white px-1">
                on this order
              </div>
            </div>
            {/* Apply coupon */}
            {/* <div className="w-[60%] h-[15%] flex flex-col items-center justify-center">
              <div className="w-[100%] h-[50%] font-bold text-black dark:text-white text-[18px] bg-[#f9f9f9] dark:bg-bluelight flex items-center">
                Have a Coupon?
              </div>

              <div className="w-[100%] h-[50%] font-bold text-black dark:text-white text-[20px] bg-[#f3f3f3] dark:bg-bluelight rounded-lg flex flex-row">
                <div className="w-[10%] h-[100%] flex items-center  justify-center "></div>

                <input
                  placeholder="Enter Coupon Code"
                  maxLength={"6"}
                  className=" text-3xl dark:bg-[#323d4e] px-3 dark:rounded-lg font-sans outline-none w-[70%] h-[100%] text-[16px] font-thin bg-[#f3f3f3] "
                />
                <div className="text-[#0075FF] w-[20%] h-[100%] text-[16px] flex items-center justify-center ">
                  APPLY
                </div>
              </div>
            </div> */}
            {/* Price details*/}
            <div className="w-[60%] h-[55%] bg-[#f9f9f9] dark:bg-bluelight flex flex-col justify-between">
              <div className="text-[16px] font-semibold text-black dark:text-white">
                PRICE DETAILS{" "}
                {data.map((d, i) => (
                  <div key={i}>{d?.length}</div>
                ))}
                {/* ({d?.c?.quantity} items) */}
              </div>
              {/* MRP */}
              <div className="flex flex-row justify-between items-center">
                <div className="text-[#737373] dark:text-white text-[14px]">
                  Total MRP
                </div>
                <div className="text-black dark:text-white text-[14px]">
                  Rs. {mrpPrice}
                  {/* {d?.c?.product?.price} */}
                </div>
              </div>
              {/* Discount */}
              <div className="flex flex-row justify-between items-center">
                <div className="text-[#737373] dark:text-white text-[14px]">
                  Discount on MRP
                </div>
                <div className="text-[#2DC071] text-[14px]">
                  -Rs. {discountedPrice}
                </div>
              </div>
              {/* Coupon Discount */}
              <div className="flex flex-row justify-between items-center">
                <div className="text-[#737373] dark:text-white text-[14px]">
                  Coupon Discount
                </div>
                <div className="text-black dark:text-white text-[14px]">
                  Rs. 0
                </div>
              </div>
              {/* delivery charge */}
              <div className="flex flex-row justify-between items-center">
                <div className="text-[#737373] dark:text-white text-[14px]">
                  Delivery Charge
                </div>
                <div className="text-[#2DC071] text-[14px]">Free</div>
              </div>
              {/* Total charge */}
              <div className="border-t-2 flex flex-row justify-between items-center py-2 bg">
                <div className="text-[#737373] dark:text-white text-[14px]">
                  Total Amount
                </div>
                <div className="text-black dark:text-white font-bold text-[14px]">
                  Rs. {actualPrice}
                  {/* {d?.c?.product?.discountedprice} */}
                </div>
              </div>
              <div
                onClick={() => {
                  placeOrderWithCash();
                }}
                className="bg-black rounded-lg flex flex-row justify-center items-center py-3"
              >
                <div className="text-white text-[14px]">PLACE ORDER</div>
              </div>
            </div>
          </div>
          {/* PopUp */}
          <div
            className={` ${
              popUp
                ? "h-[100%] shadow-xl ring-1 ring-[#f1f1f1] rounded-t-lg bg-[#4e4e4e48] flex justify-center items-center sm:max-md:w-[90%] shadow-3xl w-[100%] absolute bottom-0 left-0 right-0 top-0 z-40"
                : "h-[100%] rounded-t-lg bg-[#272727] sm:max-md:w-[90%] shadow-3xl absolute bottom-0 hidden"
            }`}
          >
            <div className="p-2 w-[30%] bg-white min-w-[349px] rounded-2xl px-2 pt-4">
              <div className="flex justify-between items-center px-2">
                <div className="w-[100%] font-medium ">Shipping details</div>
                <RxCross1
                  onClick={() => {
                    setPopUp(false);
                  }}
                />
              </div>
              <div className="px-4">
                <div className="w-[100%] mt-2 bg-[#f9f9f9]  p-2 rounded-2xl">
                  <div className="">To</div>
                  <div>guyghu.gyguyg.gggui</div>
                  <div className="text-[#569aff] font-medium w-full text-right">
                    Change..
                  </div>
                </div>
              </div>
              <div className="w-[100%] font-medium mt-4">
                SELECT PAYMENT OPTION
              </div>
              <div className="px-4">
                <div
                  onClick={() => {
                    setSelect(1);
                  }}
                  className="w-[100%] mt-2 bg-[#f9f9f9] p-2 rounded-2xl flex justify-between px-4 items-center"
                >
                  <div className="flex gap-2 items-center">
                    <div
                      className={`${
                        select === 1
                          ? "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-blue-600 flex justify-center items-center"
                          : "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-white flex justify-center items-center"
                      }`}
                    >
                      <div className="ring-5 ring-blue-600 h-2 w-2 bg-white rounded-full"></div>
                    </div>{" "}
                    <div>Cash On Delivery</div>{" "}
                  </div>
                  <TbTruckDelivery className="text-green-500" />
                </div>
                <div
                  onClick={() => {
                    setSelect(2);
                  }}
                  className="w-[100%] mt-2 bg-[#f9f9f9] p-2 rounded-2xl flex justify-between px-4 items-center"
                >
                  <div className="flex gap-2 items-center">
                    <div
                      className={`${
                        select === 2
                          ? "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-blue-600 flex justify-center items-center"
                          : "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-white flex justify-center items-center"
                      }`}
                    >
                      <div className="ring-5 ring-blue-600 h-2 w-2 bg-white rounded-full"></div>
                    </div>{" "}
                    <div>PhonePay/Google Pay/BHIM UPI </div>{" "}
                  </div>
                  <div className="gap-2 flex">
                    <FaGooglePay />
                    <SiPhonepe className="text-purple-600" />
                  </div>
                </div>
                <div
                  onClick={() => {
                    setSelect(3);
                  }}
                  className="w-[100%] mt-2 bg-[#f9f9f9] p-2 rounded-2xl flex justify-between px-4 items-center"
                >
                  <div className="flex gap-2 items-center">
                    <div
                      className={`${
                        select === 3
                          ? "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-blue-600 flex justify-center items-center"
                          : "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-white flex justify-center items-center"
                      }`}
                    >
                      <div className="ring-5 ring-blue-600 h-2 w-2 bg-white rounded-full"></div>
                    </div>{" "}
                    <div>Net Banking</div>{" "}
                  </div>
                  <BsBank className="text-blue-300" />
                </div>
                <div
                  onClick={() => {
                    setSelect(4);
                  }}
                  className="w-[100%] mt-2 bg-[#f9f9f9] p-2 rounded-2xl px-4 "
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2 items-center">
                      <div
                        className={`${
                          select === 4
                            ? "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-blue-600 flex justify-center items-center"
                            : "h-4 w-4 rounded-full ring-1 ring-[#f5f5f5] bg-white flex justify-center items-center"
                        }`}
                      >
                        <div className="ring-5 ring-blue-600 h-2 w-2 bg-white rounded-full"></div>
                      </div>{" "}
                      <div>Credit/Debit Card</div>{" "}
                    </div>
                    <SiVisa className="text-purple-600" />
                  </div>
                  <div className="w-full px-4">
                    <input
                      placeholder="Card Number"
                      className="bg-[#fff] w-full mt-2 h-10 rounded-xl pl-2"
                    />
                    <input
                      placeholder="Name on Card"
                      className="bg-[#fff] w-full mt-2 h-10 rounded-xl pl-2"
                    />
                    <div className="flex justify-between w-full mt-2 items-center">
                      <input
                        placeholder="MM/YY"
                        className="bg-[#fff] w-[45%] h-10 rounded-xl pl-2"
                      />
                      <input
                        placeholder="CVV"
                        className="bg-[#fff] w-[45%] h-10 rounded-xl pl-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full bg-[#171717] rounded-2xl py-2 text-white flex justify-center items-center mt-4">
                  {" "}
                  Continue
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
