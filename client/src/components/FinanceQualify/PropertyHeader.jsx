import React from "react";

const PropertyHeader = ({ propertyData }) => {
  if (!propertyData) return null;
  
  return (
    <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h1 
        className="text-lg font-semibold text-[#3f4f24]"
        dangerouslySetInnerHTML={{ __html: propertyData.title }}
      />
      <div className="flex items-center justify-between mt-2">
        <p className="text-gray-600">
          {propertyData.streetAddress}, {propertyData.city}, {propertyData.state}
        </p>
        <p className="font-semibold text-[#D4A017]">
          ${propertyData.askingPrice?.toLocaleString() || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default PropertyHeader;