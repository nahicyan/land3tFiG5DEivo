import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MainContent() {
  return (
    <section className="bg-[#FDF8F2] py-12">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Single Card Covering Text & Image */}
        <Card className="overflow-hidden rounded-2xl bg-[#e8efdc] p-8 shadow-lg">
          {/* Two-Column Layout inside the Card */}
          <CardContent className="grid grid-cols-1 items-center gap-8 p-0 md:grid-cols-2">
            {/* Left Column: Text & CTA */}
            <div className="p-8">
              <h2 className="mb-8 text-center text-4xl font-medium leading-tight text-[#384620] sm:text-4xl">
                Your Path To Land Ownership
              </h2>

              <p className="mb-6 text-lg font-medium text-gray-600 tracking-tighter text-justify">
                At Landivo, we’re committed to making land ownership accessible
                through seller financing. For most of our off-market properties,
                we offer flexible terms without the hassle of traditional bank
                loans. Depending on the deal, some transactions may involve a
                quick credit check to ensure the best fit—but our focus remains
                on your ability to own land.
              </p>
              {/* <Button className="rounded-full bg-green-600 px-6 py-2 text-white hover:bg-green-700">
                Learn More
              </Button> */}
            </div>

            {/* Right Column: Image (fully inside the card) */}
            <div>
              <img
                src="./mainfinance.jpg"
                alt="Land financing example"
                className="h-full w-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
