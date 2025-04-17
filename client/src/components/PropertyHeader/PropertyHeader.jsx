import React from "react";
import PropertyHeaderLeft from "../PropertyHeaderLeft/PropertyHeaderLeft";
import PropertyHeaderRight from "../PropertyHeaderRight/PropertyHeaderRight";

export default function PropertyHeader({ propertyData }) {
  return (
    <header className="flex flex-col lg:flex-row w-full bg-[#FFF]">
      {/* Left Section */}
      {/* <div>
        <PropertyHeaderLeft propertyData={propertyData} />
      </div> */}

      {/* Right Section */}
{/*       <div className="w-full lg:w-1/4">
        <PropertyHeaderRight propertyData={propertyData} />
      </div> */}
    </header>
  );
}
