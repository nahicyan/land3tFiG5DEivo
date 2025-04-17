import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// If you're using lucide-react icons with shadcn:
import { ArrowRight } from "lucide-react";

export default function Action() {
  return (
    <section className="w-full py-12 bg-[#FDF8F2]">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Large, rounded, dark card */}
        <Card className="rounded-[2rem] bg-[#546930] text-white shadow-lg shadow-black/20 p-8 md:flex md:items-center md:justify-between md:p-20">
          
          {/* Left side: small label, big headline, subtext */}
          <div className="md:max-w-[60%]">
            <p className="text-xs uppercase tracking-wide text-white/70">
              TRY IT NOW
            </p>
            <h2 className="mt-2 text-3xl font-normal sm:leading-snug sm:text-5xl">
              Ready To Own Your Land With Seller Financing?
            </h2>
            <p className="mt-4 text-sm text-white/80 sm:text-lg sm:tracking-tight">
              See if you qualify for seller financing—takes just minutes.
            </p>
          </div>

          {/* Right side: two buttons */}
          <div className="mt-6 flex items-center gap-4 md:mt-0">
            {/* Primary button: white background, teal text */}
            <Button className="bg-[#d1dfb9] text-[#0A2F3C] hover:bg-white/90 text-lg">
              Get Started Now
            </Button>

            {/* Secondary button: outline style with arrow */}
            <Button
              variant="outline"
              className="bg-=[#384620] text-white hover:bg-white/30 text-lg"
            >
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
