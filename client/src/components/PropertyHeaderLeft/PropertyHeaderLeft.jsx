import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PropertyHeaderLeft({ propertyData }) {
  return (
    <div className="w-full">
      {/* No longer sticky */}
      <Card className="rounded-none border-0 shadow-none bg-transparent">
        <CardHeader className="px-4 py-2">
          {/* First Line: County - City - State - Zip */}
          {/* <CardDescription className="text-lg text-gray-500 subpixel-antialiased font-thin">
            {propertyData.county} County{" "}
            <span className="mx-1 text-gray-400">·</span>
            {" "}{propertyData.city},{" "}{propertyData.state}{" "}{propertyData.zip}
          </CardDescription> */}

          {/* Second Line: Title (Rich Text) */}
          <CardTitle
            className="text-xl sm:text-2xl text-gray-800 subpixel-antialiased font-normal"
            dangerouslySetInnerHTML={{ __html: propertyData.title }}
          />
        </CardHeader>
      </Card>

      {/* Tags */}
      {(propertyData.ltag || propertyData.rtag) && (
        <div className="flex items-center gap-3 px-4 py-2">
          {propertyData.ltag && (
            <Badge
              className="
                bg-[#d03c0b]
                text-white
                px-3
                py-2
                text-xs
                font-semibold
                uppercase
                rounded-full
                shadow-md
                hover:bg-[#b5310a]
                transition-shadow
              "
            >
              {propertyData.ltag}
            </Badge>
          )}
          {propertyData.rtag && (
            <Badge
              className="
                bg-[#01783e]
                text-white
                px-3
                py-2
                text-xs
                font-semibold
                uppercase
                rounded-full
                shadow-md
                hover:shadow-lg
                transition-shadow
              "
            >
              {propertyData.rtag}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
