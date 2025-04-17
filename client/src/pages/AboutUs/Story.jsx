import React from "react";

export default function Story() {
  return (
    <section className="bg-[#FDF8F2] py-20">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:gap-16">
        {/* LEFT COLUMN */}
        <div>
          {/* Small label */}
          <p className="mb-2 text-lg font-semibold uppercase tracking-wide text-[#D4A017]">
            Our Story
          </p>

          {/* Large Thin Heading */}
          <h2 className="mb-6 text-5xl font-semibold leading-tighter text-[#3f4f24] sm:text-5xl">
            Landivo Was Born From A Vision To Rethink How Land Changes Hands
          </h2>

          {/* Main paragraphs (Landivo content) */}
          <div className="space-y-5 text-base leading-relaxed text-[#324c48] sm:text-lg">
            <p>
              Landivo was born from a vision to rethink how land changes hands.
              Tired of seeing buyers boxed out by high prices and rigid
              financing, we set out to create a better way. Today, we’re proud
              to serve buyers across Texas, Arkansas and other states delivering wholesale land deals that turn possibilities
              into realities.
            </p>
            <p>
              Whether you’re a first-time buyer or a seasoned investor, we’re
              here to help you find and own the perfect lot. Explore our
              properties, pre-qualify for financing, and join the Landivo
              family—where land ownership starts with you.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Stats with lines */}
        <div className="flex flex-col justify-center">
          {/* Stat 1 */}
          <div className="flex items-start justify-center border-b border-[#324c48]/30 pb-4 mb-4">
            <span className="mr-4 text-4xl font-light text-[#3f4f24]">5</span>
            <span className="text-sm text-[#324c48]">
              States <br /> Served
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex items-start justify-center border-b border-[#324c48]/30 pb-4 mb-4">
            <span className="mr-4 text-4xl font-light text-[#3f4f24]">6</span>
            <span className="text-sm text-[#324c48]">
              Years <br /> in Business
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex items-start justify-center border-b border-[#324c48]/30 pb-4 mb-4">
            <span className="mr-4 text-4xl font-light text-[#3f4f24]">25+</span>
            <span className="text-sm text-[#324c48]">
              Passionate <br /> Employees
            </span>
          </div>

          {/* Stat 4 */}
          <div className="flex items-start justify-center border-b border-[#324c48]/30 pb-4 mb-4">
            <span className="mr-4 text-4xl font-light text-[#3f4f24]">
              500+
            </span>
            <span className="text-sm text-[#324c48]">
              Thriving <br /> Land Owners
            </span>
          </div>

          {/* Stat 5 */}
          <div className="flex items-start justify-center border-b border-[#324c48]/30 pb-4 mb-4">
            <span className="mr-4 text-4xl font-light text-[#3f4f24]">30</span>
            <span className="text-sm text-[#324c48]">
              Monthly <br /> Deals
            </span>
          </div>

          {/* Stat 6 */}
          <div className="flex items-start justify-center border-b border-[#324c48]/30 pb-4 mb-4">
            <span className="mr-4 text-4xl font-light text-[#3f4f24]">$5M</span>
            <span className="text-sm text-[#324c48]">
              Financed <br /> to Date
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
