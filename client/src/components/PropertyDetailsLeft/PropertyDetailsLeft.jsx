import React from "react";
import PropertyHighlights from "../PropertyHighlights/PropertyHighlights";
import PropertyDetailsDescription from "../PropertyDetailsDescription/PropertyDetailsDescription";
import PropertyDetailsDetails from "../PropertyDetailsDetails/PropertyDetailsDetails"; // <-- Import here
import PropertyDisclaimer from "../PropertyDisclaimer/PropertyDisclaimer";
import PropertyCarousel from "../../components/PropertyCarousel/PropertyCarousel";
import PropertyHeaderRight from "../../components/PropertyHeaderRight/PropertyHeaderRight";


export default function PropertyDetailsLeft({ propertyData }) {
  return (
    <div className="p-4 rounded shadow-sm">


      {/* Property Carousel */}
      <div className="mb-2">
        <PropertyCarousel propertyData={propertyData} />
      </div>
      {/* Right Section */}
      <div className="w-full my-6">
        <PropertyHeaderRight propertyData={propertyData} />
      </div>

      {/* Quick Facts Card Group */}
      <PropertyHighlights propertyData={propertyData} />

      {/* Rich-text property description */}
      <div className="w-full md:w-4/5 md:ml-0">
        <PropertyDetailsDescription propertyData={propertyData} />
      </div>

      {/* Additional property details (two-column tables + accordion) */}
      <div className="mt-6">
        <PropertyDetailsDetails propertyData={propertyData} />
      </div>
      {/* Property Details */}
      <div className="mt-6 bg-[#FFF]">
        <PropertyDisclaimer propertyData={propertyData} />
      </div>
    </div>
  );
}
