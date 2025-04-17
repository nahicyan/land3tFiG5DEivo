import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function PropertyMap({ propertyData }) {
  // Construct Google Maps link based on available data
  const googleMapsUrl =
    propertyData.latitude && propertyData.longitude
      ? `https://www.google.com/maps?q=${propertyData.latitude},${propertyData.longitude}&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(
          `${propertyData.streetAddress}, ${propertyData.city}, ${propertyData.state}`
        )}&output=embed`;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="relative w-full p-0">
        {propertyData.landId === "included" ? (
          <div className="relative w-full aspect-[3/2]">
            <iframe
              loading="lazy"
              frameBorder="0"
              src={propertyData.landIdLink.replace("/share/", "/embed/")}
              className="absolute top-0 left-0 w-full h-full border-none rounded-lg"
            />
          </div>
        ) : (
          <div className="w-full aspect-[3/2] rounded-lg overflow-hidden">
            <iframe
              loading="lazy"
              src={googleMapsUrl}
              className="w-full h-full border-none rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
