import React, { useState, useRef, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import useProperties from "../../components/hooks/useProperties.js";

export default function FinancingSlider() {
  const { data = [], isError, isLoading } = useProperties(); // Ensure data has a default value
  const scrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({ showLeft: false, showRight: false });

  // Filter properties where financing is available
  const financingProperties = data.filter((property) => property.financing === "Available");

  // Function to update scroll state
  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      setScrollState({
        showLeft: scrollLeft > 0,
        showRight: scrollLeft + clientWidth < scrollWidth,
      });
    }
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => {
      window.removeEventListener("resize", updateScrollState);
    };
  }, [data]);

  // Scroll Handlers
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
      setTimeout(updateScrollState, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
      setTimeout(updateScrollState, 300);
    }
  };

  if (isError) return <div className="text-center text-red-500 py-4">Error fetching data</div>;
  if (isLoading) return <div className="text-center py-4">Loading properties...</div>;

  return (
    <div className="w-full py-6 bg-[#FDF8F2]">
      <div className="max-w-screen-xl mx-auto relative">
      <h2 className="text-3xl md:text-4xl font-medium text-[#3f4f24] max-w-2xl mx-auto">
         Discover Land with Flexible Financing
      </h2>
      <p className="mt-4 mb-6 mx-auto max-w-2xl text-center text-lg text-gray-600">
      Budget-friendly monthly financing plans.
      </p>

      {/* Left Scroll Button */}
      {scrollState.showLeft && (
        <button
          onClick={scrollLeft}
          className="hidden sm:block absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      )}

      {/* Scrollable Row */}
      <div className="px-2 py-4 overflow-x-auto no-scrollbar" ref={scrollRef} onScroll={updateScrollState}>
      <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-20">
          {financingProperties.length > 0 ? (
            financingProperties.map((property) => (
              <div key={property.id} className="w-72 flex-shrink-0 transition hover:scale-105">
                <PropertyCard card={property} />
              </div>
            ))
          ) : (
            <div className="text-center w-full text-gray-500">No properties available with financing.</div>
          )}
        </div>
      </div>

      {/* Right Scroll Button */}
      {scrollState.showRight && (
        <button
          onClick={scrollRight}
          className="hidden sm:block absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      )}
    </div>
</div>
  );
}
