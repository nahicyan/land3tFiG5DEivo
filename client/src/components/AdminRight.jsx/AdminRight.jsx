import React from "react";
import PropertiesTable from "../PropertiesTable/PropertiesTable";

export default function PropertyDetailsRight({ propertyData }) {
    return (
      <div className="bg-transparent">
        {/* <PropertyTable propertyData={propertyData} /> */}
        <PropertiesTable propertyData={propertyData} /> 
      </div>
    );
  }
  