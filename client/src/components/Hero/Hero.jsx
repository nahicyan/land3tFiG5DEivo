import React from "react";
import SearchGlobalWithTracking from  "../SearchGlobal/SearchGlobalWithTracking";

const Hero = () => {
  return (
    <div className="bg-[#FDF8F2]">
      <section className="pt-12 pb-12 sm:pb-16 lg:pt-8">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
            {/* Left Content */}
            <div>
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-semibold leading-tight text-[#3f4f24] sm:text-5xl lg:text-5xl">
                We Help Buyers Secure Off-Market Land
                </h1>
                <p className="mt-4 text-lg text-[#324c48] sm:mt-6">
                  Discover unbeatable land deals across Texas with prime
                  locations and great prices. Secure your perfect property today
                  before it's gone!
                </p>
                <SearchGlobalWithTracking />
              </div>
              {/* Statsss */}
              <div className="flex items-center justify-center mt-8 space-x-6 lg:justify-start sm:space-x-8">
                <div className="flex items-center">
                  <p className="text-3xl font-semibold text-[#3f4f24] sm:text-4xl">
                    100+
                  </p>
                  <p className="ml-3 text-sm text-[#3f4f24]">
                    Prime <br />
                    Listings
                  </p>
                </div>

                <div className="hidden sm:block">
                  <svg
                    className="text-[#D4A017]"
                    width="16"
                    height="39"
                    viewBox="0 0 16 39"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="0.72265"
                      y1="10.584"
                      x2="15.7226"
                      y2="0.583975"
                    ></line>
                    <line
                      x1="0.72265"
                      y1="17.584"
                      x2="15.7226"
                      y2="7.58398"
                    ></line>
                    <line
                      x1="0.72265"
                      y1="24.584"
                      x2="15.7226"
                      y2="14.584"
                    ></line>
                    <line
                      x1="0.72265"
                      y1="31.584"
                      x2="15.7226"
                      y2="21.584"
                    ></line>
                    <line
                      x1="0.72265"
                      y1="38.584"
                      x2="15.7226"
                      y2="28.584"
                    ></line>
                  </svg>
                </div>

                <div className="flex items-center">
                  <p className="text-3xl font-semibold text-[#3f4f24] sm:text-4xl">
                    $10M+
                  </p>
                  <p className="ml-3 text-sm text-[#3f4f24]">
                    Lands <br />
                    Sold
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image with Fade Effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[#FDF8F2] via-[#FDF8F2]/50 to-transparent"></div>
              <img
                src="./banner1.jpg"
                alt="Texas Land"
                className="relative w-full object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
