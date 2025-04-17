// client/src/pages/Austin/Austin.jsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import { PuffLoader } from "react-spinners";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import useProperties from "../../components/hooks/useProperties.js";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import SearchAreaWithTracking from "@/components/SearchArea/SearchAreaWithTracking";
import { Button } from "@/components/ui/button";

export default function AustinProperty() {
  const { data, isError, isLoading } = useProperties();
  // Use areaQuery for both tracking and filtering
  const [areaQuery, setAreaQuery] = useState("");
  const scrollRef = useRef(null);

  // State to track whether there is scrollable content on the left/right
  const [scrollState, setScrollState] = useState({
    showLeft: false,
    showRight: false,
  });

  // Function to update the scrollState based on the container's measurements
  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      setScrollState({
        showLeft: scrollLeft > 0,
        showRight: scrollLeft + clientWidth < scrollWidth,
      });
    }
  };

  // Check scroll state on mount and on window resize
  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => {
      window.removeEventListener("resize", updateScrollState);
    };
  }, [data]);

  // Update scroll state when filtered results change
  useEffect(() => {
    updateScrollState();
  }, [areaQuery]);

  // Error State
  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h2 className="text-red-600 text-xl font-semibold">
          Error fetching properties.
        </h2>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#404040" />
      </div>
    );
  }

  // Filter properties to only include those in "Austin"
  const austinProperties = data.filter(
    (property) => property.area === "Austin"
  );

  // Apply search filter to Austin properties
  const filteredAustinProperties = austinProperties.filter(
    (property) => {
      const query = areaQuery.toLowerCase();
      if (!query) return true; // If no query, return all Austin properties
      
      return (
        property.title?.toLowerCase().includes(query) ||
        property.streetAddress?.toLowerCase().includes(query) ||
        property.state?.toLowerCase().includes(query) ||
        property.zip?.toLowerCase().includes(query) ||
        property.area?.toLowerCase().includes(query) ||
        property.apnOrPin?.toLowerCase().includes(query) ||
        property.ltag?.toLowerCase().includes(query) ||
        property.rtag?.toLowerCase().includes(query) ||
        property.city?.toLowerCase().includes(query) ||
        property.county?.toLowerCase().includes(query)
      );
    }
  );

  // Apply search filter to all properties (for fallback case)
  const filteredAllProperties = data.filter(
    (property) => {
      const query = areaQuery.toLowerCase();
      if (!query) return true; // If no query, return all properties
      
      return (
        property.title?.toLowerCase().includes(query) ||
        property.streetAddress?.toLowerCase().includes(query) ||
        property.state?.toLowerCase().includes(query) ||
        property.zip?.toLowerCase().includes(query) ||
        property.area?.toLowerCase().includes(query) ||
        property.apnOrPin?.toLowerCase().includes(query) ||
        property.ltag?.toLowerCase().includes(query) ||
        property.rtag?.toLowerCase().includes(query) ||
        property.city?.toLowerCase().includes(query) ||
        property.county?.toLowerCase().includes(query)
      );
    }
  );

  // Set the current area for the tracking component
  const currentArea = "Austin";

  // Determine which properties to display:
  // 1. If filtered Austin properties exist, show them
  // 2. If no Austin properties (or no matching filtered ones), show filtered all properties
  const displayProperties =
    filteredAustinProperties.length > 0
      ? filteredAustinProperties
      : filteredAllProperties;

  // Set header text based on whether we're showing just "Austin" or all properties
  const headerText =
    filteredAustinProperties.length > 0
      ? "Properties in Austin"
      : "All Properties";

  // Determine subtitle text
  const subtitleText = filteredAustinProperties.length > 0
    ? "Browse through properties available in Austin."
    : austinProperties.length > 0 
      ? `No Austin properties match "${areaQuery}". Showing all matching properties instead.`
      : "Sorry! We sold through everything in Austin! Maybe you would be interested in these properties:";

  // Handlers for horizontal scrolling
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
      // Update state after a short delay for smooth scrolling
      setTimeout(updateScrollState, 300);
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
      setTimeout(updateScrollState, 300);
    }
  };

  return (
    <div className="bg-[#FDF8F2] min-h-screen py-12 text-[#4b5b4d]">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Title, Subtitle & Search */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{headerText}</h1>
          <p className="text-lg mb-6">
            {subtitleText}
          </p>
          <SearchAreaWithTracking
            query={areaQuery}
            setQuery={setAreaQuery}
            placeholder="Search in this area"
            area={currentArea}
            filteredData={filteredAustinProperties}
          />
        </div>

        {displayProperties.length > 0 ? (
          // Display properties in a horizontal slider (on desktop; vertical on mobile)
          <div className="relative">
            {/* Left Scroll Button: Only appears if there's content to scroll left */}
            {scrollState.showLeft && (
              <button
                onClick={handleScrollLeft}
                className="hidden sm:block sm:absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            )}

            {/* Scrollable Container */}
            <div
              className="px-2 py-4 overflow-y-auto overflow-x-hidden sm:overflow-x-auto sm:overflow-y-hidden no-scrollbar"
              ref={scrollRef}
              onScroll={updateScrollState}
            >
              <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-20">
                {displayProperties.map((card) => (
                  <div
                    key={card.id}
                    className="w-72 flex-shrink-0 transition hover:scale-105"
                  >
                    <PropertyCard card={card} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Scroll Button: Only appears if there's content to scroll right */}
            {scrollState.showRight && (
              <button
                onClick={handleScrollRight}
                className="hidden sm:block sm:absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-4">No properties found matching your search.</p>
        )}

        {/* "All Properties" Button */}
        <div className="mt-10 text-center">
          <Button
            onClick={() => (window.location.href = "/properties")}
            className="bg-[#324c48] hover:bg-[#3f4f24] text-white px-6 py-3 text-lg font-semibold rounded-lg shadow transition transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#3f4f24] focus:ring-offset-2"
          >
            All Properties
          </Button>
        </div>
      </div>
    </div>
  );
}