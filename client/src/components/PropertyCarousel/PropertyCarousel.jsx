"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Camera } from "lucide-react"; // Ensure this import is correct
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio"; // Import the AspectRatio component

function ImageModal({ images, currentIndex, onClose, onNext, onPrev }) {
  if (!images.length) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 bg-white/30 p-2 rounded hover:bg-white/50 transition"
        onClick={onClose}
      >
        ✕
      </button>

      {/* Prev Arrow */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow hover:shadow-xl transition hidden sm:block"
        onClick={onPrev}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* Main Image */}
      <img
        src={images[currentIndex]}
        alt={`Zoomed ${currentIndex + 1}`}
        className="max-h-[80vh] object-contain mx-4"
        onClick={onClose}
      />

      {/* Next Arrow */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow hover:shadow-xl transition hidden sm:block"
        onClick={onNext}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {/* Image count (bottom-left with camera icon) */}//
      <span className="absolute bottom-4 left-4 text-sm bg-black/70 text-white px-4 py-2 rounded-full flex items-center space-x-2">
        <Camera className="w-4 h-4" />
        <span>
          {currentIndex + 1}/{images.length}
        </span>
      </span>
    </div>
  );
}

export default function PropertyCarousel({ propertyData }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (propertyData?.imageUrls) {
      try {
        const parsedImages = Array.isArray(propertyData.imageUrls)
          ? propertyData.imageUrls
          : JSON.parse(propertyData.imageUrls);
        const fullUrls = parsedImages.map(
          (img) => `${import.meta.env.VITE_SERVER_URL}/${img}`
        );
        setImages(fullUrls);
      } catch (error) {
        console.error("Failed to parse image data:", error);
      }
    }
  }, [propertyData]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const modalNext = () => nextImage();
  const modalPrev = () => prevImage();

  if (!images.length) {
    return (
      <div className="text-center text-gray-500 py-4">
        No images available for this property.
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-md">
      {/* Use the AspectRatio component to enforce a 16:9 ratio */}
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={openModal}
          />
        </div>
      </AspectRatio>

      {/* Desktop Left Arrow */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black text-white p-3 rounded-full shadow hover:shadow-xl transition hidden sm:block"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* Desktop Right Arrow */}
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black text-white p-3 rounded-full shadow hover:shadow-xl transition hidden sm:block"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {/* Desktop Slide Counter (bottom-left with camera icon) */}
      <div className="absolute bottom-2 left-2 z-10 hidden sm:block">
        <span className="bg-black/70 text-white text-sm px-4 py-2 rounded-full flex items-center space-x-2">
          <Camera className="w-4 h-4" />
          <span>{currentIndex + 1}/{images.length}</span>
        </span>
      </div>

      {/* Mobile Controls */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-between space-x-4 sm:hidden">
        <Button
          onClick={prevImage}
          variant="ghost"
          className="bg-black text-white p-2 rounded-full shadow hover:shadow-xl transition"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>
        <span className="bg-black/70 text-white text-sm px-4 py-2 rounded-full flex items-center space-x-2">
          <Camera className="w-4 h-4" />
          <span>{currentIndex + 1}/{images.length}</span>
        </span>
        <Button
          onClick={nextImage}
          variant="ghost"
          className="bg-black text-white p-2 rounded-full shadow hover:shadow-xl transition"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Zoomed-In Modal */}
      {showModal && (
        <ImageModal
          images={images}
          currentIndex={currentIndex}
          onClose={closeModal}
          onNext={modalNext}
          onPrev={modalPrev}
        />
      )}
    </div>
  );
}
