import React from "react";
import PropertyDetailsLeft from "../PropertyDetailsLeft/PropertyDetailsLeft";
import Offer from "../Offer/Offer";
import PropertyDetailsRight from "../PropertyDetailsRight/PropertyDetailsRight";

export default function PropertyDetails({ propertyData }) {
  return (
    <div className="w-full bg-white">
      <div className="max-w-screen-xl mx-auto px-4 pb-6 pt-2 flex flex-col lg:flex-row gap-2">
        
        {/* Left Section */}
        <div className="w-full lg:basis-[70%]">
          <PropertyDetailsLeft propertyData={propertyData} />
        </div>

        {/* Right Section (Sticky) */}
        <div className="w-full lg:basis-[30%]">
          {/* Sticky wrapper */}
          <div className="sticky top-[10%]">
            <PropertyDetailsRight propertyData={propertyData} />
          </div>
        </div>
      </div>
    </div>
  );
}
