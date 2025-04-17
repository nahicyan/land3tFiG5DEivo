import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Choose() {
  return (
    <section className="w-full bg-[#243834] py-16 text-[#FDF8F2]">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Large heading */}
        <h2 className="mb-3 text-5xl font-medium leading-tight md:text-5xl">
          How It Works?
        </h2>
        {/* Small label like the reference image */}
        <span className="text-xl uppercase tracking-tight text-white/70">
          Get Your Land in 3 Easy Steps
        </span>

        {/* Three cards in a row (stacked on mobile) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* CARD 1 */}
          <Card className="bg-[#2a413d] p-12 text-white/90 border-none shadow-sm shadow-black/30">
            <CardHeader className="p-0">
              {/* Faded step number */}
              <CardTitle className="mb-1 text-8xl font-light leading-none bg-gradient-to-b from-white/50 to-white/0 bg-clip-text text-transparent">
                1
              </CardTitle>
              {/* Step title */}
              <p className="text-3xl font-normal leadting-tight text-white mb-4">
                Find Your Land
              </p>
              {/* Step details */}
              <CardDescription className="text-lg font-thin leading-tight text-white/70">
                Explore our exclusive off-market properties
              </CardDescription>
            </CardHeader>
          </Card>

          {/* CARD 2 */}
          <Card className="bg-[#2a413d] p-12 text-white/90 border-none shadow-sm shadow-black/30">
            <CardHeader className="p-0">
              {/* Faded step number */}
              <CardTitle className="mb-1 text-8xl font-light leading-none bg-gradient-to-b from-white/50 to-white/0 bg-clip-text text-transparent">
                2
              </CardTitle>
              {/* Step title */}
              <p className="text-3xl font-normal leadting-tight text-white mb-4">
                Set Your Terms
              </p>
              {/* Step details */}
              <CardDescription className="text-lg font-thin leading-tight text-white/70">
                We customize down payments and monthly plans to match your
                budget
              </CardDescription>
            </CardHeader>
          </Card>

          {/* CARD 3 */}
          <Card className="bg-[#2a413d] p-12 text-white/90 border-none shadow-sm shadow-black/30">
            <CardHeader className="p-0">
              {/* Faded step number */}
              <CardTitle className="mb-1 text-8xl font-light leading-none bg-gradient-to-b from-white/50 to-white/0 bg-clip-text text-transparent">
                3
              </CardTitle>
              {/* Step title */}
              <p className="text-3xl font-normal leadting-tight text-white mb-4">
                Start Owning
              </p>
              {/* Step details */}
              <CardDescription className="text-lg font-thin leading-tight text-white/70">
                Move forward with or without a credit check, based on the deal,
                and take control of your land
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
