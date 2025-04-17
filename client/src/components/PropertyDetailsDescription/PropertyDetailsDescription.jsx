"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PropertyDetailsDescription({ propertyData }) {
  const [showFull, setShowFull] = React.useState(false);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  const contentRef = React.useRef(null);
  const hiddenRef = React.useRef(null);

  React.useEffect(() => {
    if (!hiddenRef.current) return;

    // Calculate the number of lines in the hidden element
    const lineHeight = parseFloat(
      window.getComputedStyle(hiddenRef.current).lineHeight
    );
    const totalLines = hiddenRef.current.scrollHeight / lineHeight;

    // If total lines > 4, then we allow "Show more/less" toggling
    setIsOverflowing(totalLines > 4);
  }, [propertyData.description]);

  const toggleShowFull = () => {
    setShowFull((prev) => !prev);
  };

  return (
    <Card className="bg-transparent border-0 shadow-none text-[var(--text)]">
      {/* Title */}
      <CardHeader className="pt-4 pr-4 pb-4 pl-0">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Property Description
        </CardTitle>
      </CardHeader>

      <div className="relative pt-4 pr-4 pb-4 pl-0">
        {/* Hidden element to measure total lines */}
        <div
          ref={hiddenRef}
          className="absolute invisible h-auto w-full overflow-auto p-0 m-0 leading-relaxed pointer-events-none z-[-1]"
          dangerouslySetInnerHTML={{ __html: propertyData.description }}
        />

        {/* Actual content container with line-clamp */}
        <div className="relative overflow-hidden">
          <div
            ref={contentRef}
            className={`leading-relaxed transition-all duration-300 ${
              showFull ? "line-clamp-none" : "line-clamp-4"
            }`}
            dangerouslySetInnerHTML={{ __html: propertyData.description }}
          />

          {/* Fading gradient overlay if content is clamped */}
          {!showFull && isOverflowing && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FFF] to-transparent" />
          )}
        </div>

        {/* Show more / Show less button if text is longer than 4 lines */}
        {isOverflowing && (
          <Button
            className="bg-[#324c48] text-[#FFF] hover:bg-[#324c48]/90 mt-4"
            onClick={toggleShowFull}
          >
            {showFull ? "Show less" : "Show more"}
          </Button>
        )}
      </div>
    </Card>
  );
}
