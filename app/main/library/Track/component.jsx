"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../../utils/AuthWrapper";
import axios from "axios";
import { API } from "../../../../Essentials";
import styles from "../../../CustomScrollbarComponent.module.css";
import { RxCross2 } from "react-icons/rx";

function page() {
  const { data: user } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);

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

  return (
    <div className="md:flex h-[85.5vh]">
      <div
        className={`md:min-w-[390px] md:max-w-[390px] ${styles.customScrollbar} px-2 overflow-y-auto dark:bg-bluedark border-r-2 border-[#1d1d1d] flex items-center pt-6 pn:max-sm:pt-40 flex-col`}
      >
        <div className="flex flex-col gap-5 w-full">
          {orders.map((d, i) => (
            <>
              <div
                key={i}
                className="w-full flex flex-col gap-4 dark:bg-[#0D0F10] bg-[#fafafa] p-4 rounded-xl mt-4"
              >
                <div
                  className={`flex justify-between border-b pb-3 items-center w-full `}
                >
                  <div className="text-sm font-medium">{d?.orders?.timing}</div>
                  <div
                    className={`bg-green-200 py-1 rounded-xl px-2  text-[12px]  ${
                      d?.orders?.currentStatus === "cancelled"
                        ? "bg-red-500"
                        : "bg-green-400"
                    }`}
                  >
                    Status: {d?.orders?.currentStatus}
                  </div>
                </div>
                <div className="flex flex-col border-b pb-3 gap-5 w-full">
                  {d?.orders?.productId?.map((f, k) => (
                    <div key={k} className="flex items-center w-full gap-2">
                      <div className="min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px]">
                        <img
                          className="w-full h-full object-cover rounded-xl"
                          src={
                            process.env.NEXT_PUBLIC_PRODUCT_URL +
                            f?.images[0]?.content
                          }
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col w-full gap-1">
                        <div className="text-[12px] truncate font-medium">
                          {f?.name.length > 40
                            ? `${f?.name.slice(0, 40)}...`
                            : f?.name}
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <div className=" text-black w-full  dark:text-white text-[12px]">
                            Qty: {d?.orders?.data?.[k]?.qty}
                          </div>
                          <div className=" text-black dark:text-white text-[12px]">
                            ₹
                            {Number(d?.orders?.data?.[k]?.price) *
                              Number(d?.orders?.data?.[k]?.qty)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="border-r text-sm font-medium  pr-2">
                      {d?.orders?.quantity} Items
                    </div>
                    <div className="text-sm font-medium">
                      ₹{d?.orders?.total}
                    </div>
                  </div>
                  <div
                    onClick={() => setOrder(d)}
                    className="text-xs bg-[#1A1D21] cursor-pointer text-[#9B9C9E] p-2 px-4 rounded-xl font-medium"
                  >
                    View
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      {/* Right side */}
      {order && (
        <div className=" bg-green pn:max-sm:hidden w-[100%] h-[100%] flex flex-col items-center">
          <div className="min-w-[75%] mt-0 flex flex-col gap-4">
            <div className="flex flex-col  rounded-xl dark:bg-[#121212]">
              <div className="flex justify-between p-2 items-center w-full ">
                <div>Items in order</div>
                <div>{order.orders?.quantity} Item</div>
              </div>
              <div className="flex flex-col pb-3 px-3 gap-5 w-full">
                {order?.orders?.productId?.map((f, k) => (
                  <div key={k} className="flex items-center w-full gap-2">
                    <div className="min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px]">
                      <img
                        className="w-full h-full object-cover rounded-xl"
                        src={
                          process.env.NEXT_PUBLIC_PRODUCT_URL +
                          f?.images[0]?.content
                        }
                        alt=""
                      />
                      {console.log(f)}
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <div className="text-[12px] truncate font-medium">
                        {f?.name.length > 40
                          ? `${f?.name.slice(0, 40)}...`
                          : f?.name}
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className=" text-black w-full  dark:text-white text-[12px]">
                          Qty: {order?.orders?.data?.[k]?.qty}
                        </div>
                        <div className=" text-black dark:text-white text-[12px]">
                          ₹
                          {Number(order?.orders?.data?.[k].price) *
                            Number(order?.orders?.data?.[k]?.qty)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col  rounded-xl dark:bg-[#121212]">
              <div className="flex justify-between p-2 border-b px-3 items-center w-full ">
                <div>Items in order</div>
                <div>{order?.orders?.quantity} Item</div>
              </div>
              <div className="flex flex-col text-sm pb-3 mt-3 gap-5 w-full">
                <div className="flex justify-between  px-3 items-center gap-2">
                  <div>Item total</div>
                  <div>₹ {order?.orders?.total}</div>
                </div>
                <div className="flex justify-between  px-3 items-center gap-2">
                  <div>Handling Charges</div>
                  {/* <div>₹ 50</div> */}
                  <div>Free</div>
                </div>
                <div className="flex justify-between  px-3 items-center gap-2">
                  <div>Delivery Charges</div>
                  <div>Free</div>
                </div>
                <div className="flex justify-between  px-3 items-center gap-2">
                  <div>Bill total</div>
                  <div>₹ {order?.orders?.quantity}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col  rounded-xl dark:bg-[#121212]">
              <div className="flex justify-between p-2 border-b px-3 items-center w-full ">
                <div>Order details</div>
                <div>{order?.orders?.quantity} Item</div>
              </div>
              <div className="flex flex-col text-sm pb-3 mt-3 gap-5 w-full">
                <div className="flex justify-between  px-3 items-center gap-2">
                  <div>Order ID</div>
                  <div>{order?.orders?.orderId}</div>
                </div>
                {/* <div className="flex justify-between  px-3 items-center gap-2">
                  <div>Order Placed</div>
                  <div>₹ 50</div>
                </div> */}
                <div className="flex justify-between  px-3 items-center gap-2">
                  <div>Payment</div>
                  <div>{order?.orders?.paymentMode}</div>
                </div>
                {/* <div className="flex justify-between  px-3 items-center gap-2">
                  <div>Deliver to </div>
                  <div>₹ 50</div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="sm:hidden">
        {order && (
          <div className="fixed inset-0 w-screen z-40 flex justify-center items-center">
            <div className="  w-[100%] h-[100%] pn:max-sm:pt-48 flex flex-col items-center">
              <div className="min-w-[75%] mt-0 bg-white dark:bg-[#0D0F10] p-4 rounded-xl flex flex-col gap-4">
                <div className="flex justify-end items-center w-full">
                  <div onClick={() => setOrder(null)}>
                    <RxCross2 />
                  </div>
                </div>
                <div className="flex flex-col  rounded-xl dark:bg-[#121212]">
                  <div className="flex justify-between p-2 items-center w-full ">
                    <div>Items in order</div>
                    <div>{order.orders?.quantity} Item</div>
                  </div>
                  <div className="flex flex-col pb-3 px-3 gap-5 w-full">
                    {order?.orders?.productId?.map((f, k) => (
                      <div key={k} className="flex items-center w-full gap-2">
                        <div className="min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px]">
                          <img
                            className="w-full h-full object-cover rounded-xl"
                            src={
                              process.env.NEXT_PUBLIC_PRODUCT_URL +
                              f?.images[0]?.content
                            }
                            alt=""
                          />
                          {console.log(f)}
                        </div>
                        <div className="flex flex-col w-full gap-1">
                          <div className="text-[12px] truncate font-medium">
                            {f?.name.length > 40
                              ? `${f?.name.slice(0, 40)}...`
                              : f?.name}
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <div className=" text-black w-full  dark:text-white text-[12px]">
                              Qty: {order?.orders?.data?.[k]?.qty}
                            </div>
                            <div className=" text-black dark:text-white text-[12px]">
                              ₹
                              {Number(order?.orders?.data?.[k].price) *
                                Number(order?.orders?.data?.[k]?.qty)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col  rounded-xl dark:bg-[#121212]">
                  <div className="flex justify-between p-2 border-b px-3 items-center w-full ">
                    <div>Items in order</div>
                    <div>{order?.orders?.quantity} Item</div>
                  </div>
                  <div className="flex flex-col text-sm pb-3 mt-3 gap-5 w-full">
                    <div className="flex justify-between  px-3 items-center gap-2">
                      <div>Item total</div>
                      <div>₹ {order?.orders?.total}</div>
                    </div>
                    <div className="flex justify-between  px-3 items-center gap-2">
                      <div>Handling Charges</div>
                      {/* <div>₹ 50</div> */}
                      <div>Free</div>
                    </div>
                    <div className="flex justify-between  px-3 items-center gap-2">
                      <div>Delivery Charges</div>
                      <div>Free</div>
                    </div>
                    <div className="flex justify-between  px-3 items-center gap-2">
                      <div>Bill total</div>
                      <div>₹ {order?.orders?.quantity}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col  rounded-xl dark:bg-[#121212]">
                  <div className="flex justify-between p-2 border-b px-3 items-center w-full ">
                    <div>Order details</div>
                    <div>{order?.orders?.quantity} Item</div>
                  </div>
                  <div className="flex flex-col text-sm pb-3 mt-3 gap-5 w-full">
                    <div className="flex justify-between  px-3 items-center gap-2">
                      <div>Order ID</div>
                      <div>{order?.orders?.orderId}</div>
                    </div>
                    {/* <div className="flex justify-between  px-3 items-center gap-2">
                <div>Order Placed</div>
                <div>₹ 50</div>
              </div> */}
                    <div className="flex justify-between  px-3 items-center gap-2">
                      <div>Payment</div>
                      <div>{order?.orders?.paymentMode}</div>
                    </div>
                    {/* <div className="flex justify-between  px-3 items-center gap-2">
                <div>Deliver to </div>
                <div>₹ 50</div>
              </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
