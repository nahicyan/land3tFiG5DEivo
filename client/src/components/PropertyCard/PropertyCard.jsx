import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "../../utils/format";
import { useVipBuyer } from "@/utils/VipBuyerContext";
const serverURL = import.meta.env.VITE_SERVER_URL;

export default function SlickPropertyCard({ card }) {
  const navigate = useNavigate();
  const { isVipBuyer } = useVipBuyer();

  // Guard clause to handle undefined card prop
  if (!card) {
    return null; // Return nothing if card is undefined
  }

  // Safe access to imageUrls
  const images = (() => {
    try {
      // If card.imageUrls is already an array, use it; otherwise try to parse it
      if (!card.imageUrls) return [];
      
      return Array.isArray(card.imageUrls)
        ? card.imageUrls
        : JSON.parse(card.imageUrls);
    } catch (error) {
      console.error("Error parsing imageUrls:", error);
      return [];
    }
  })();

  const firstImage =
    images.length > 0 ? `${serverURL}/${images[0]}` : "/default-image.jpg";

  // Safe formatted price
  const formattedPrice = card.askingPrice 
    ? formatPrice(card.askingPrice) 
    : "0";

  // Safe formatted discount price
  const formattedDisPrice = card.disPrice 
    ? formatPrice(card.disPrice) 
    : null;

  // Safely calculate minimum monthly payment
  const getMonthlyPayment = () => {
    if (!card.financing || card.financing !== "Available") return null;

    const payments = [
      card.monthlyPaymentOne,
      card.monthlyPaymentTwo,
      card.monthlyPaymentThree
    ].filter(payment => payment && !isNaN(payment));

    if (payments.length === 0) return null;

    return formatPrice(Math.min(...payments));
  };

  const monthlyPayment = getMonthlyPayment();

  return (
    <Card
      onClick={() => navigate(`/properties/${card.id}`)}
      className="
        w-[350px]
        rounded-2xl
        overflow-hidden
        shadow-lg
        hover:shadow-2xl
        transition-all
        cursor-pointer
        bg-white
        backdrop-blur-lg
        border border-gray-200
      "
    >
      {/* Top Image Section */}
      <div className="relative">
        <img
          src={firstImage}
          alt="Property"
          className="w-full h-56 object-cover rounded-t-2xl"
        />

        {/* Left Tag */}
        {card.ltag && (
          <span className="absolute top-3 left-3 bg-[#d03c0b] text-white text-xs px-3 py-1 rounded-full shadow-md">
            {card.ltag}
          </span>
        )}

        {/* Right Tag */}
        {card.rtag && (
          <span className="absolute top-3 right-3 bg-[#3c5d58] text-white text-xs px-3 py-1 rounded-full shadow-md">
            {card.rtag}
          </span>
        )}
      </div>

      {/* Content Section (Modified Layout) */}
      <CardContent className="py-2 px-3 flex">
        {/* Left Section (2/3 of the card) */}
        <div className="w-full basis-[73%]">
          {/* Acre and Address */}
          <div className="flex flex-col">
            <span className="text-gray-600 text-base font-normal mb-1">
              {card.acre || "0"} Acres
            </span>
            <p className="text-base font-semibold text-gray-800 mb-1">
              {card.streetAddress || "Address unavailable"}
            </p>
            <p className="text-xs text-gray-500">
              {card.city || ""}, {card.state || ""} {card.zip || ""}
            </p>
          </div>
        </div>

        {/* Right Section (1/3 of the card) */}
        <div className="w-full basis-[27%] flex flex-col items-end justify-start">
          {/* Price - Show discount price for VIP buyers if available */}
          {isVipBuyer && formattedDisPrice ? (
            <div className="flex flex-wrap items-center justify-end">
              <span className="text-gray-500 text-sm line-through mr-2">
                ${formattedPrice}
              </span>
              <span className="text-[#517b75] text-lg font-semibold">
                ${formattedDisPrice}
              </span>
            </div>
          ) : (
            <span className="text-[#517b75] text-lg font-semibold tracking-tight">
              ${formattedPrice}
            </span>
          )}
          
          {card.financing === "Available" && monthlyPayment && (
            <span className="mt-1 text-[#D4A017] text-base font-medium tracking-tighter">
              ${monthlyPayment}/mo
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}