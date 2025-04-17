"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { PuffLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import useProperties from "../../components/hooks/useProperties.js";

// Simple variants for fade-up animation
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export const Lands = () => {
  const { data, isError, isLoading } = useProperties();
  const navigate = useNavigate();

  // NEW: Ref and state for Featured Properties scroll buttons
  const featuredScrollRef = useRef(null);
  const [featuredScrollState, setFeaturedScrollState] = useState({
    showLeft: false,
    showRight: false,
  });

  // Function to update scroll state for the featured container
  const updateFeaturedScrollState = () => {
    if (featuredScrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = featuredScrollRef.current;
      setFeaturedScrollState({
        showLeft: scrollLeft > 0,
        showRight: scrollLeft + clientWidth < scrollWidth,
      });
    }
  };

  useEffect(() => {
    updateFeaturedScrollState();
    window.addEventListener("resize", updateFeaturedScrollState);
    return () => {
      window.removeEventListener("resize", updateFeaturedScrollState);
    };
  }, [data]);

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <Typography variant="h6" color="error">
          Error While Fetching Data
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <PuffLoader size={80} color="#D4A017" />
      </Box>
    );
  }

  // Filter featured properties and group by featuredWeight
  const featuredByWeight = data
    .filter((property) => property.featured === "Featured")
    .reduce((acc, property) => {
      const weight = Number(property.featuredWeight);
      // If no property for this weight or current property has a later updatedAt, update the group
      if (!acc[weight] || new Date(property.updatedAt) > new Date(acc[weight].updatedAt)) {
        acc[weight] = property;
      }
      return acc;
    }, {});

  // Convert the grouped properties into an array and sort them by weight in ascending order
  const featuredProperties = Object.values(featuredByWeight).sort(
    (a, b) => Number(a.featuredWeight) - Number(b.featuredWeight)
  );

  // NEW: Scroll handlers for Featured Properties
  const handleFeaturedScrollLeft = () => {
    if (featuredScrollRef.current) {
      featuredScrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
      setTimeout(updateFeaturedScrollState, 300);
    }
  };

  const handleFeaturedScrollRight = () => {
    if (featuredScrollRef.current) {
      featuredScrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
      setTimeout(updateFeaturedScrollState, 300);
    }
  };

  return (
    <>
      {/* First Section: Find The Best Land In Your Area */}
      <motion.section
        className="py-12 bg-[#FDF8F2]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Section Title */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#3f4f24]">
              Find The Best Land In Your Area
            </h2>
            <p className="text-sm md:text-base text-[#324c48]">
              Browse By Area
            </p>
          </div>

          {/* 5 Categories Grid (DFW, Austin, Houston, San Antonio, Others) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {/* DFW */}
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-light mb-2 text-[#324c48]">Dallas Fort Worth</h3>
              <div className="relative group w-full aspect-w-16 aspect-h-10 
                              rounded-lg shadow-md overflow-hidden 
                              transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                <img
                  src="./dfw.jpg"
                  alt="DFW"
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center 
                                opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => navigate("/DFW")} className="bg-white text-[#324c48] font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg">
                    Lands in DFW
                  </button>
                </div>
              </div>
            </div>

            {/* Austin */}
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-light mb-2 text-[#324c48]">Austin</h3>
              <div className="relative group w-full aspect-w-16 aspect-h-10 
                              rounded-lg shadow-md overflow-hidden 
                              transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                <img
                  src="./austin.jpg"
                  alt="Austin"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center 
                                opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => navigate("/Austin")} className="bg-white text-[#324c48] font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg">
                    Lands in Austin
                  </button>
                </div>
              </div>
            </div>

            {/* Houston */}
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-light mb-2 text-[#324c48]">Houston</h3>
              <div className="relative group w-full aspect-w-16 aspect-h-10 
                              rounded-lg shadow-md overflow-hidden 
                              transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                <img
                  src="./houston.jpg"
                  alt="Houston"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center 
                                opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => navigate("/Houston")} className="bg-white text-[#324c48] font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg">
                    Lands in Houston
                  </button>
                </div>
              </div>
            </div>

            {/* San Antonio */}
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-light mb-2 text-[#324c48]">San Antonio</h3>
              <div className="relative group w-full aspect-w-16 aspect-h-10 
                              rounded-lg shadow-md overflow-hidden 
                              transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                <img
                  src="./sanantonio.jpg"
                  alt="San Antonio"
                  className="w-full h-full object-cover"
                />
                <div onClick={() => navigate("/SanAntonio")} className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center 
                                opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white text-[#324c48] font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg">
                    Lands in San Antonio
                  </button>
                </div>
              </div>
            </div>

            {/* Others */}
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-light mb-2 text-[#324c48]">Others</h3>
              <div className="relative group w-full aspect-w-16 aspect-h-10 
                              rounded-lg shadow-md overflow-hidden 
                              transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                <img
                  src="./others.jpg"
                  alt="Others"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center 
                                opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => navigate("/OtherLands")} className="bg-white text-[#324c48] font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg">
                    Other Lands
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Second Section: Featured Properties */}
      <motion.section
        className="py-12 bg-[#FDF8F2]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Title & Subtext */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2 text-[#3f4f24]">
              Featured Properties
            </h2>
            {/* Decorative line under the heading */}
            <div className="mx-auto w-20 h-1 bg-[#D4A017] mb-2"></div>
            <p className="text-[#324c48]/80">
              Discover our top picks for this week
            </p>
          </div>

          {/* NEW: Scrollable Container with left/right buttons */}
          <div className="relative">
            {/* Left Scroll Button */}
            {featuredScrollState.showLeft && (
              <button
                onClick={handleFeaturedScrollLeft}
                className="hidden sm:block sm:absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            )}

            <div
              className="px-2 py-4 overflow-y-auto overflow-x-hidden sm:overflow-x-auto sm:overflow-y-hidden no-scrollbar"
              ref={featuredScrollRef}
              onScroll={updateFeaturedScrollState}
            >
              <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-20">
                {featuredProperties.map((property) => (
                  <div
                    key={property.id}
                    className="w-72 flex-shrink-0 transition hover:scale-105"
                  >
                    <PropertyCard card={property} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Scroll Button */}
            {featuredScrollState.showRight && (
              <button
                onClick={handleFeaturedScrollRight}
                className="hidden sm:block sm:absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Browse All Properties Button */}
          <div className="mt-8 flex justify-end">
            <a
              href="/properties"
              className="inline-block bg-[#324c48] text-white font-semibold py-2 px-6 rounded-md shadow hover:bg-[#3f4f24] transition-colors"
            >
              Browse All Properties
            </a>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default Lands;
