import React from "react";
import store1 from "../../assets/store1.png";
import store2 from "../../assets/store2.png";
import store3 from "../../assets/store3.png";
import store4 from "../../assets/store4.png";
import store5 from "../../assets/store5.png";
import store6 from "../../assets/store6.png";
import Image from "next/image";
import { GoArrowRight } from "react-icons/go";
const page = () => {
  return (
    <>
      <div className="bg-[#222222] h-auto select-none grid grid-cols-1 w-full py-3 pb-[40px] px-2 sm:px-4">
        {/* main */}
        <div className="text-2xl font-semibold text-white px-4">Store</div>

        <div className="grid grid-cols-1 w-full">
          <div className="flex justify-center mt-[40px] text-white items-center">
            <div className="flex justify-center gap-6 flex-col">
              <div className="text-2xl md:text-4xl text-center leading-snug font-semibold ">
                Ever dreamt of turning your passion{" "}
                <br className="sm:block hidden" />
                into profit?{" "}
              </div>
              <div className="text-center">
                Grovyo Store makes it easier than ever to create, manage, and
                grow your online business,
                <br className="sm:block hidden" /> all in one place.
              </div>
              <div className="flex justify-center text-sm  items-center flex-col">
                <a
                  target="_blank"
                  href="https://workspace.grovyo.com"
                  className="bg-[#0A7CFF] p-2 px-4 rounded-lg"
                >
                  Create your store
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-center mt-[30px] items-center">
              <div className="flex justify-center items-center w-full">
                <Image
                  src={store1}
                  className="pn:max-md:w-full md:max-w-[70%]"
                />
              </div>
            </div>
          </div>
        </div>
        {/* main */}

        {/* desc */}
        <div className="flex flex-col justify-center  gap-[95px] items-center my-[20px] sm:my-[50px] w-full h-full">
          <div className="grid sm:grid-cols-2  gap-8 w-[90%] md:w-[80%]">
            <div className="flex ">
              <div className="flex pn:max-sm:flex-col gap-3 min-w-[50%]">
                <div className="flex gap-3">
                  <div className="min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] rounded-full text-xl text-black font-semibold flex justify-center items-center bg-white ">
                    1.
                  </div>
                  <div className="text-2xl sm:hidden text-white font-semibold">
                    Effortless Product Management :
                  </div>
                </div>
                <div className="sm:hidden text-white flex flex-col font-medium gap-2 leading-7 justify-center items-center max-w-[400px]">
                  <div>
                    No coding required! Set up your store in minutes with a
                    user-friendly interface.
                  </div>
                  <div>
                    Add Your Products: Showcase your unique offerings with
                    detailed descriptions, high-quality images, and variants
                    (sizes, colors).
                  </div>
                </div>
                <div className="text-white pn:max-sm:hidden flex flex-col gap-2  ">
                  <div className="text-2xl text-white font-semibold">
                    Effortless Product Management :
                  </div>
                  <div className="flex flex-col font-medium gap-2 leading-7 justify-center items-center max-w-[400px]">
                    <div>
                      No coding required! Set up your store in minutes with a
                      user-friendly interface.
                    </div>
                    <div>
                      Add Your Products: Showcase your unique offerings with
                      detailed descriptions, high-quality images, and variants
                      (sizes, colors).
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-[50%] flex justify-center items-center">
              <Image
                src={store2}
                className="sm:max-w-[70%] sm:min-w-[400px] max-h-full"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8  w-[90%] md:w-[80%]">
            <div className="flex ">
              <div className="flex pn:max-sm:flex-col gap-3 min-w-[50%]">
                <div className="flex pn:max-sm:items-center gap-3">
                  <div className="min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] rounded-full text-xl font-semibold text-black flex justify-center items-center bg-white ">
                    2.
                  </div>
                  <div className="text-2xl sm:hidden text-white font-semibold">
                    Seamless Selling:
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="font-medium max-w-[80%] text-white sm:hidden leading-7">
                    Manage Orders: Track your orders, fulfill them with ease,
                    and keep customers informed every step of the way. (Delivery
                    handled by Grovyo's partners)
                  </div>
                  <div className="font-medium max-w-[80%] text-white sm:hidden leading-7">
                    Sell Anywhere: Reach a wider audience! Your store is
                    accessible not only on the Grovyo app but also through a
                    dedicated web page.
                  </div>
                </div>
                <div className="text-white pn:max-sm:hidden flex flex-col gap-2  ">
                  <div className="text-2xl text-white font-semibold">
                    Seamless Selling:
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="font-medium max-w-[80%]  leading-7">
                      Manage Orders: Track your orders, fulfill them with ease,
                      and keep customers informed every step of the way.
                      (Delivery handled by Grovyo's partners)
                    </div>
                    <div className="font-medium max-w-[80%]  leading-7">
                      Sell Anywhere: Reach a wider audience! Your store is
                      accessible not only on the Grovyo app but also through a
                      dedicated web page.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-[50%] flex justify-center items-center">
              <Image
                src={store3}
                className="sm:max-w-[70%] sm:min-w-[400px] max-h-full"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8  w-[90%] md:w-[80%]">
            <div className="flex ">
              <div className="flex pn:max-sm:flex-col gap-3 min-w-[50%]">
                <div className="flex pn:max-sm:items-center gap-3">
                  <div className="min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] rounded-full text-xl font-semibold text-black flex justify-center items-center bg-white ">
                    3.
                  </div>
                  <div className="text-2xl text-white sm:hidden font-semibold">
                    Powerful Analytics:
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-white sm:hidden">
                  <div className="font-medium max-w-[80%]  leading-7">
                    Gain Insights: Track sales performance, analyze customer
                    behavior, and make data-driven decisions to optimize your
                    offerings.
                  </div>
                  <div className="font-medium max-w-[80%]  leading-7">
                    Stay Informed: View recent orders and manage them
                    efficiently with a clear, organized dashboard.
                  </div>
                </div>

                <div className="text-white pn:max-sm:hidden flex flex-col gap-2  ">
                  <div className="text-2xl text-white font-semibold">
                    Powerful Analytics:
                  </div>

                  <div className="flex flex-col gap-2 text-white pn:max-sm:hidden">
                    <div className="font-medium max-w-[80%]  leading-7">
                      Gain Insights: Track sales performance, analyze customer
                      behavior, and make data-driven decisions to optimize your
                      offerings.
                    </div>
                    <div className="font-medium max-w-[80%]  leading-7">
                      Stay Informed: View recent orders and manage them
                      efficiently with a clear, organized dashboard.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-[50%] flex justify-center items-center">
              <Image
                src={store4}
                className="sm:max-w-[70%] sm:min-w-[400px] max-h-full"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 w-[90%] md:w-[80%]">
            <div className="flex  ">
              <div className="flex pn:max-sm:flex-col gap-3 min-w-[50%]">
                <div className="flex pn:max-sm:items-center gap-3">
                  <div className="min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] rounded-full text-xl font-semibold text-black flex justify-center items-center bg-white ">
                    4.
                  </div>
                  <div className="text-2xl sm:hidden text-white font-semibold">
                    Say Goodbye to Delivery Hassles:
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-white sm:hidden">
                  <div className="font-medium max-w-[80%]  leading-7">
                    Focus on Your Passion: Forget about packing, shipping, and
                    tracking! Grovyo partners with reliable carriers to ensure
                    your products reach customers safely and efficiently.
                  </div>
                  <div className="font-medium max-w-[80%]  leading-7">
                    Reduced Stress: Free up your time and energy to focus on
                    creating, marketing, and growing your business.
                  </div>
                </div>
                <div className="text-white pn:max-sm:hidden flex flex-col gap-2  ">
                  <div className="text-2xl text-white font-semibold">
                    Say Goodbye to Delivery Hassles:
                  </div>

                  <div className="flex flex-col gap-2 text-white pn:max-sm:hidden">
                    <div className="font-medium max-w-[80%]  leading-7">
                      Focus on Your Passion: Forget about packing, shipping, and
                      tracking! Grovyo partners with reliable carriers to ensure
                      your products reach customers safely and efficiently.
                    </div>
                    <div className="font-medium max-w-[80%]  leading-7">
                      Reduced Stress: Free up your time and energy to focus on
                      creating, marketing, and growing your business.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-[50%] flex justify-center items-center">
              <Image
                src={store5}
                className="sm:max-w-[70%] sm:min-w-[400px] max-h-full"
              />
            </div>
          </div>
        </div>
        {/* desc */}

        <div className="flex  justify-center mt-[50px] items-center">
          <div className="flex flex-col pp:flex-row justify-between py-8 px-6 rounded-xl text-white bg-[#202020] md:w-[80%]">
            <div className="flex flex-col justify-center gap-6 lg:w-[40%]">
              <div className="text-2xl sm:text-3xl font-semibold">
                Ready to turn your dreams into reality?
              </div>
              <div>
                Sign up for Grovyo today and unlock the power of your own online
                store!
              </div>

              <div className="flex sm:mt-0 mt-4 items-center">
                <a
                  className="bg-[#0A7CFF] flex justify-center gap-2 items-center text-white p-2 px-5 font-semibold rounded-lg"
                  target="_blank"
                  href="https://workspace.grovyo.com/"
                >
                  <div>Get Started</div>
                  <div>
                    <GoArrowRight />
                  </div>
                </a>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Image
                src={store6}
                className="md:min-w-[350px] pn:max-sm:w-full md:max-w-[550px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
