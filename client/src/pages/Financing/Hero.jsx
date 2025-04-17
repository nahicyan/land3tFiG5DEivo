import React from "react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section
      className="w-full py-12"
      style={{
        "--text": "#030001",
        "--background": "#FDF8F2",
        "--primary": "#3f4f24",
        "--secondary": "#324c48",
        "--accent": "#D4A017",
      }}
    >
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Flex container for Left Text + Right Grid */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* LEFT TEXT CONTENT */}
          <div className="mb-8 md:mb-0 md:w-1/2 md:pr-8">
            <p className="text-[var(--primary)] font-semibold uppercase tracking-wide">
            We make owning land simple and affordable
            </p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-[var(--secondary)] md:text-5xl">
              Unlock Your Land with 
              <br />
              {/* with{" "} */}
              <span className="text-[var(--accent)]">Flexible Financing</span>
            </h1>
            <p className="mt-4 text-xl text-gray-600">
             Buy Off-Market Land with Seller Financing {/*– Tailored to You*/}
            </p>
            <div className="mt-6">
              <Button
                size="lg"
                className="bg-[var(--primary)] text-lg text-white hover:bg-[var(--secondary)]"
                onClick={() => {
                  const sliderElement =
                    document.getElementById("financing-slider");
                  if (sliderElement) {
                    sliderElement.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Explore Financing
              </Button>
            </div>
                      {/* Star Ratings */}
            <div className="mt-4 flex items-center">
    
              <div className="flex text-[var(--accent)]">
                <span>⭐⭐⭐⭐⭐</span>
              </div>
              <p className="ml-2 text-sm text-gray-600">
                4.9 from 200+ Buyers{" "}
                {/* <a href="#" className="text-blue-500 underline">
                  Reviews
                </a> */}
              </p>
            </div>
          </div>

          {/* RIGHT 2×2 GRID but with 3 Cards: top card spans 2 columns */}
          <div className="grid w-full grid-cols-1 gap-4 md:w-1/2 md:grid-cols-2">
            {/* 1) TOP CARD (spans 2 columns): Farmland aerial image + tags */}
            <div className="relative col-span-1 rounded-xl bg-gray-100 md:col-span-2 overflow-hidden">
              <img
                src="./finance.jpg"
                className="w-full object-cover"
                style={{ aspectRatio: "16 / 9" }} // Adjust this ratio as needed
              />
            </div>

            {/* THIRD CARD */}
            <div className="relative rounded-xl bg-[#546930] p-6 shadow text-white">
              {/* Top row: Amount + Up Arrow */}
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">Grow Your Savings</span>
                <span className="ml-2 text-xl font-semibold">&#8593;</span>
              </div>

              {/* Label: Saving */}
              <p className="mt-1 text-sm">Build wealth with land ownership</p>

              {/* Line Chart */}
              <div className="mt-4 flex h-20 items-center justify-center">
                <svg
                  viewBox="0 0 100 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-full w-5/6 text-white"
                >
                  {/* Simple upward path */}
                  <path d="M5 40 L20 30 L35 35 L50 20 L65 25 L80 10" />
                </svg>
              </div>
            </div>

            {/* 4) BOTTOM-RIGHT CARD: Growth Revenue */}
            <div className="relative rounded-xl bg-[#e8efdc] p-6 shadow">
              <h3 className="text-2xl font-bold text-[#384620]">
                Multiple Payment Plans
              </h3>
              <p className="mt-2 text-lg text-[#384620]">Starts from $200/mo</p>
              <p className="text-base text-[#546930]">Fits any budget</p>
              {/* Mini bar chart (placeholder) */}
              <div className="mt-4 flex items-end space-x-2">
                <div className="h-4 w-2 rounded bg-[#bacf96]" />
                <div className="h-6 w-2 rounded bg-[#a3bf73]" />
                <div className="h-8 w-2 rounded bg-[#8caf50]" />
                <div className="h-3 w-2 rounded bg-[#bacf96]" />
                <div className="h-5 w-2 rounded bg-[#a3bf73]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
