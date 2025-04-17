import React from "react";
import Offer from "../Offer/Offer";

export default function PropertyDetailsRight({ propertyData }) {
    return (
      <div className="bg-transparent">
        <Offer propertyData={propertyData} />
      </div>
    );
  }
  