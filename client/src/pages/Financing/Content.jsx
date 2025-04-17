import React from "react";
import { FaBolt, FaChartBar, FaWallet } from "react-icons/fa";

export default function Content() {
  return (
    <section className="bg-[#FDF8F2] py-16">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Outer Card */}
        <div className="rounded-xl bg-[#e8efdc] p-8 shadow sm:p-12">
          {/* Top Row: 2 columns */}
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
            {/* Left Column: Label + Heading */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#3f4f24]">
                Our Financing
              </p>
              <h2 className="mt-3 text-4xl font-medium leading-tight text-[#384620] sm:text-4xl">
                Why Choose Seller Financing with Landivo?
              </h2>
            </div>

            {/* Right Column: Paragraph */}
            <div className="flex items-center">
              <p className="text-lg leading-relaxed text-gray-600">
                We make it easy to buy land with flexible terms. Access your
                property quickly, with minimal checks or waiting.
              </p>
            </div>
          </div>

          {/* Bottom Row: Three Bullet Points */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* 1) Quick Financing Approvals */}
            <div className="flex flex-col items-start">
              <FaBolt className="mb-3 text-6xl text-[#3f4f24]" />
              <h3 className="text-2xl font-medium text-gray-800 tracking-tighter">
                Flexible Options
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Minimal credit checks for most deals, with tailored terms for
                all buyers
              </p>
            </div>

            {/* 2) Detailed Payment Insights */}
            <div className="flex flex-col items-start">
              <FaChartBar className="mb-3 text-6xl text-[#3f4f24]" />
              <h3 className="text-2xl font-medium text-gray-800 tracking-tighter">
                Affordable Payments
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Low down payments and competitive rates keep land within reach.{" "}
              </p>
            </div>

            {/* 3) Low Down Payments */}
            <div className="flex flex-col items-start">
              <FaWallet className="mb-3 text-6xl text-[#3f4f24]" />
              <h3 className="text-2xl font-medium text-gray-800 tracking-tighter">
                Full Control
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Own your land outright once payments are complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
