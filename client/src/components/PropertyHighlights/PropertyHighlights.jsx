import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { 
  ArrowsPointingOutIcon, 
  MapIcon, 
  MapPinIcon, 
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";

export default function QuickFacts({ propertyData }) {
  return (
    <>
    <h2 className="text-xl font-semibold text-gray-800 mb-6">
    Property Highlights
  </h2>
    <div className="flex flex-wrap gap-4 bg-transparent mb-8">
      {/* Card 1: Sq Ft */}
      <Card
        className="
          w-full sm:w-48
          p-1
          rounded-xl
          bg-[#D4A017]/10
          text-[#030001]
          text-center
          shadow
          hover:shadow-xl
          hover:scale-105
          transition-transform
          duration-300
        "
      >
        <CardHeader className="flex flex-col items-center p-2 pb-0">
          <ArrowsPointingOutIcon  className="w-6 h-6 text-[#3f4f24]" />
          <CardTitle className="text-base font-semibold text-[#3f4f24]">
            Size
          </CardTitle>
{/*           <CardDescription className="text-sm text-[#324c48]">
            Square Feet
          </CardDescription> */}
        </CardHeader>
        <CardContent className="pt-1 pb-2">
          <p className="text-xl text-tighter font-base text-[#324c48]">
            {propertyData.sqft?.toLocaleString()}{" sq ft"}
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Zoning */}
      <Card
        className="
          w-full sm:w-48
          p-1
          rounded-xl
          bg-[#D4A017]/10
          text-[#030001]
          text-center
          shadow
          hover:shadow-xl
          hover:scale-105
          transition-transform
          duration-300
        "
      >
        <CardHeader className="flex flex-col items-center p-2 pb-0">
          <MapIcon className="w-6 h-6 text-[#3f4f24] " />
          <CardTitle className="text-base font-semibold text-[#3f4f24]">
            Zoning
          </CardTitle>
          {/* <CardDescription className="text-sm text-[#324c48]">
            Land Use
          </CardDescription> */}
        </CardHeader>
        <CardContent className="pt-1 pb-2">
          <p className="text-xl text-tight font-base text-[#324c48]">
            {propertyData.zoning ?? "N/A"}
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Area */}
      <Card
        className="
          w-full sm:w-48
          p-1
          rounded-xl
          bg-[#D4A017]/10
          text-[#030001]
          text-center
          shadow
          hover:shadow-xl
          hover:scale-105
          transition-transform
          duration-300
        "
      >
        <CardHeader className="flex flex-col items-center p-2 pb-0">
          <MapPinIcon className="w-6 h-6 text-[#3f4f24] " />
          <CardTitle className="text-base font-semibold text-[#3f4f24]">
            Survey
          </CardTitle>
          {/* <CardDescription className="text-sm text-[#324c48]">
            Located In
          </CardDescription> */}
        </CardHeader>
        <CardContent className="pt-1 pb-2">
          <p className="text-xl text-tight font-base text-[#324c48]">
            {propertyData.survey?.toLocaleString() ?? "Not Available"}
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Monthly Payment */}
      <Card
        className="
          w-full sm:w-48
          p-1
          rounded-xl
          bg-[#D4A017]/10
          text-[#030001]
          text-center
          shadow
          hover:shadow-xl
          hover:scale-105
          transition-transform
          duration-300
        "
      >
        <CardHeader className="flex flex-col items-center p-2 pb-0">
          <CurrencyDollarIcon className="w-6 h-6 text-[#3f4f24] " />
          <CardTitle className="text-base font-semibold text-[#3f4f24]">
            Financing
          </CardTitle>
          {/* <CardDescription className="text-sm text-[#324c48]">
            Monthly Payment
          </CardDescription> */}
        </CardHeader>
        <CardContent className="pt-1 pb-2">
          <p className="text-xl text-tight font-base text-[#324c48]">
          {propertyData.financing?.toLocaleString() ?? "Not Available"}
          </p>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
