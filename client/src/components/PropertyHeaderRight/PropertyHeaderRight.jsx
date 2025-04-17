"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { useVipBuyer } from "@/utils/VipBuyerContext";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";

// Function to assign status colors
function getStatusClasses(status) {
  switch (status) {
    case "Available":
      return { circle: "bg-green-500", text: "text-green-500" };
    case "Pending":
      return { circle: "bg-yellow-500", text: "text-yellow-500" };
    case "Not Available":
    case "Sold":
      return { circle: "bg-red-500", text: "text-red-500" };
    case "Testing":
      return { circle: "bg-blue-500", text: "text-blue-500" };
    default:
      return { circle: "bg-gray-400", text: "text-gray-400" };
  }
}

export default function PropertyHeaderRight({ propertyData }) {
  const { isAuthenticated } = useAuth0();
  const { isVipBuyer } = useVipBuyer();
  const navigate = useNavigate();
  
  // State for email dialog
  const [showDialog, setShowDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const {
    status,
    disPrice,
    askingPrice,
    acre,
    streetAddress,
    city,
    state,
    zip,
  } = propertyData || {};

  const { circle, text } = getStatusClasses(status);

  // Determine which price to show as main price
  const mainPrice = isVipBuyer && disPrice ? disPrice : askingPrice;

  // Email validation function
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Show dialog for discount
  const handleDiscountClick = () => {
    setShowDialog(true);
  };

  // Handle dialog submission
  const handleDialogSubmit = () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setShowDialog(false);
    // Navigate to subscription page with email parameter
    navigate(`/subscription?email=${encodeURIComponent(email)}`);
  };

  return (
    <Card className="border-0 bg-transparent shadow-none p-0">
      {/* Top Row: Status */}
      <div className="flex items-center gap-2 mb-6">
        <span className={`w-3 h-3 rounded-full animate-pulse-slow ${circle}`} />
        <span className={`text-lg capitalize ${text}`}>
          {status || "Unknown Status"}
        </span>
      </div>

      {/* Price Row (All prices aligned in one line) */}
      <div className="flex items-center text-3xl font-bold text-gray-900 whitespace-nowrap mb-4">
        {/* Main Price */}
        {mainPrice ? `$${mainPrice.toLocaleString()}` : "$0"}

        {/* Show discount price differently based on authentication and VIP status */}
        {!isAuthenticated && disPrice && (
          <span className="relative ml-6 inline-flex items-center">
            {/* Overlay Button (Triggers Email Dialog) */}
            <button
              className="
                absolute inset-0 z-10 bg-transparent text-sm font-semibold
                hover:bg-gray-200 transition-colors px-2 py-1 rounded-md
                flex items-center justify-center w-full h-full whitespace-nowrap
              "
              onClick={handleDiscountClick}
            >
              Login For Discount
            </button>

            {/* Blurred Discount Price (Behind the button) */}
            <span className="filter blur-[2px] text-3xl text-gray-400 font-thin ml-2">
              ${disPrice.toLocaleString()}
            </span>
          </span>
        )}

        {/* For logged in but non-VIP users, show subscribe option */}
        {isAuthenticated && !isVipBuyer && disPrice && (
          <span className="relative ml-6 inline-flex items-center">
            {/* Overlay Button (Triggers Email Dialog) */}
            <button
              className="
                absolute inset-0 z-10 bg-transparent text-sm font-semibold
                hover:bg-gray-200 transition-colors px-2 py-1 rounded-md
                flex items-center justify-center w-full h-full whitespace-nowrap
                text-gray-900
              "
              onClick={handleDiscountClick}
            >
              Subscribe For Discount
            </button>

            {/* Blurred Discount Price (Behind the button) */}
            <span className="filter blur-[2px] text-3xl text-gray-400 font-thin ml-2">
              ${disPrice.toLocaleString()}
            </span>
          </span>
        )}

        {/* Crossed Out Original Price (Only for VIP users with a discount) */}
        {isVipBuyer && disPrice && (
          <span className="text-gray-500 line-through text-xl ml-3">
            ${askingPrice?.toLocaleString()}
          </span>
        )}
      </div>

      {/* Acre Row */}
      {acre && (
        <div className="text-2xl font-normal text-gray-500 mb-4">
          {acre} Acre Lot
        </div>
      )}

      {/* Address Row */}
      {(streetAddress || city || state || zip) && (
        <div className="text-lg text-gray-700 mt-1">
          {streetAddress}, {city}, {state} {zip}
        </div>
      )}

      {/* Email Request Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white p-6 rounded-lg border border-[#324c48]/20 shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#3f4f24]">
              Enter Your Email
            </DialogTitle>
            <DialogDescription className="text-[#324c48] mt-2">
              Please provide your email address to join our exclusive VIP buyers list
              and access special property discounts.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-4 text-[#3f4f24] border border-[#324c48] rounded-md focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
            />
            {error && (
              <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
          </div>

          <DialogFooter className="mt-6 flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-[#324c48] text-[#324c48]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDialogSubmit}
              className="bg-[#324c48] text-white hover:bg-[#3f4f24]"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}