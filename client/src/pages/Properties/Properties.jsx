"use client";

import React, { useState, useRef, useEffect } from "react";
import { PuffLoader } from "react-spinners";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useSearchParams, useNavigate } from "react-router-dom";
import useProperties from "../../components/hooks/useProperties.js";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import SearchWithTracking from "@/components/Search/SearchWithTracking";

// Helper function to determine if an element has horizontal overflow
function hasHorizontalOverflow(element) {
  if (!element) return false;
  return element.scrollWidth > element.clientWidth;
}

export default function Properties() {
  const { data, isError, isLoading } = useProperties();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Track scroll state for each area: { [area]: { showLeft, showRight } }
  const [scrollStates, setScrollStates] = useState({});

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setSearchQuery(searchFromUrl);
  }, [searchParams]);

  // Ref object to hold references to each horizontal scroll container
  const scrollRefs = useRef({});

  // Define the locations you want separate sections for
  const areas = ["DFW", "Austin", "Houston", "San Antonio", "Other Areas"];

  // Scroll Left
  const handleScrollLeft = (area) => {
    const container = scrollRefs.current[area];
    if (container) {
      container.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  // Scroll Right
  const handleScrollRight = (area) => {
    const container = scrollRefs.current[area];
    if (container) {
      container.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  // Update the scroll state for a given area, but only if values have changed
  const updateScrollState = (area) => {
    const container = scrollRefs.current[area];
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const newShowLeft = scrollLeft > 0;
      const newShowRight = scrollLeft + clientWidth < scrollWidth;
      setScrollStates((prev) => {
        if (
          prev[area] &&
          prev[area].showLeft === newShowLeft &&
          prev[area].showRight === newShowRight
        ) {
          return prev;
        }
        return { ...prev, [area]: { showLeft: newShowLeft, showRight: newShowRight } };
      });
    }
  };

  // Check scroll state for all areas on layout changes and window resize
  const checkAllScrollStates = () => {
    const updatedStates = {};
    areas.forEach((area) => {
      const container = scrollRefs.current[area];
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        updatedStates[area] = {
          showLeft: scrollLeft > 0,
          showRight: scrollLeft + clientWidth < scrollWidth,
        };
      }
    });
    setScrollStates(updatedStates);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAllScrollStates();
    }, 0);

    window.addEventListener("resize", checkAllScrollStates);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkAllScrollStates);
    };
  }, [data]);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h2 className="text-red-600 text-xl font-semibold">
          Error fetching data.
        </h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#404040" />
      </div>
    );
  }

  // Filter properties using OR logic across multiple fields
  const filteredData = data.filter((property) => {
    const query = searchQuery.toLowerCase();
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
  });

  return (
    <div className="bg-[#FDF8F2] min-h-screen py-12 text-[#4b5b4d]">
      {/* Hero Section */}
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Title, Subtitle & Search */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Find Your Dream Property
          </h1>
          <p className="text-lg mb-6">
            Browse through a wide selection of properties with detailed filters
            to help you find the perfect fit.
          </p>
          <SearchWithTracking
            query={searchQuery}
            setQuery={setSearchQuery}
            context="properties"
          />
        </div>

        {/* Small Separating Line */}
        <hr className="my-8 border-t border-[#4b5b4d]/20" />

        {/* Location Sections */}
        {areas.map((area) => {
          // Filter properties for the current area
          const areaProperties = filteredData.filter(
            (property) => property.area === area
          );
          // Skip section if no properties for that area
          if (areaProperties.length === 0) return null;

          return (
            <div key={area} className="my-12">
              {/* Section Title */}
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                Properties in {area}
              </h2>

              {/* Scrollable Container (Horizontal on Desktop, Column on Mobile) */}
              <div className="relative">
                {/* Left Button: Only show on desktop and if there's content to scroll left */}
                {scrollStates[area]?.showLeft && (
                  <button
                    onClick={() => handleScrollLeft(area)}
                    className="hidden sm:block sm:absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                )}

                <div
                  className="px-2 py-4 overflow-y-auto overflow-x-hidden sm:overflow-x-auto sm:overflow-y-hidden no-scrollbar"
                  ref={(el) => {
                    scrollRefs.current[area] = el;
                  }}
                  onScroll={() => updateScrollState(area)}
                >
                  <div className="flex flex-col items-start space-y-6 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-20">
                    {areaProperties.map((card) => (
                      <div
                        key={card.id}
                        className="w-72 flex-shrink-0 transition hover:scale-105"
                      >
                        <PropertyCard card={card} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Button: Only show on desktop and if there's content to scroll right */}
                {scrollStates[area]?.showRight && (
                  <button
                    onClick={() => handleScrollRight(area)}
                    className="hidden sm:block sm:absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* No matching properties */}
        {filteredData.length === 0 && (
          <p className="text-center text-gray-600 py-4">
            No properties found.
          </p>
        )}
      </div>
    </div>
  );
}
