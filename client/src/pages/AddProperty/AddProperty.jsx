"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResidencyWithFiles } from "@/utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/hooks/useAuth"; // Import useAuth instead of UserContext
import { motion, AnimatePresence } from "framer-motion";

// Import subcomponents
import SystemInfo from "@/components/AddProperty/SystemInfo";
import ListingDetails from "@/components/AddProperty/ListingDetails";
import Classification from "@/components/AddProperty/Classification";
import Location from "@/components/AddProperty/Location";
import Dimension from "@/components/AddProperty/Dimension";
import Pricing from "@/components/AddProperty/Pricing";
import Financing from "@/components/AddProperty/Financing";
import Utilities from "@/components/AddProperty/Utilities";
import MediaTags from "@/components/AddProperty/MediaTags";

// OPTIONAL: A small icon for completed steps (from Lucide)
import { Check } from "lucide-react";

export default function AddProperty() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Use Auth hook instead of UserContext

  // Current step index
  const [step, setStep] = useState(0);

  // Dialog state for alert after submission
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("success"); // "success" or "warning"

  // Form data state
  const [formData, setFormData] = useState({
    // System Information
    ownerId: "",
    status: "",
    area: "",
    featured: "",
    featuredWeight: "",

    // Listing Details
    title: "",
    description: "",
    notes: "",

    // Classification
    type: "",
    landType: [], // Now an array
    legalDescription: "",
    zoning: "",
    restrictions: "",
    mobileHomeFriendly: "",
    hoaPoa: "",
    hoaPaymentTerms: "",
    hoaFee: "",
    survey: "",

    // Address and Location
    direction: "",
    streetAddress: "",
    city: "",
    county: "",
    state: "",
    zip: "",
    latitude: "",
    longitude: "",
    apnOrPin: "",
    landId: "",
    landIdLink: "",

    // Dimensions
    sqft: "",
    acre: "",

    // Pricing and Financing
    askingPrice: "",
    minPrice: "",
    disPrice: "",

    // Financing and Payment Calculation
    financing: "",
    tax: "",
    hoaMonthly: "",
    serviceFee: "35",
    term: "",
    interestOne: "",
    interestTwo: "",
    interestThree: "",
    monthlyPaymentOne: "",
    monthlyPaymentTwo: "",
    monthlyPaymentThree: "",
    downPaymentOne: "",
    downPaymentTwo: "",
    downPaymentThree: "",
    loanAmountOne: "",
    loanAmountTwo: "",
    loanAmountThree: "",
    purchasePrice: "",
    financedPrice: "",

    // Utilities and Infrastructure
    water: "",
    sewer: "",
    electric: "",
    roadCondition: "",
    floodplain: "",

    //Media & Tags
    ltag: "",
    rtag: "",
    imageUrls: "",
  });

  // If you need to store images in the parent:
  const [uploadedImages, setUploadedImages] = useState([]);

  // Numeric fields formatting, etc.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev };
      const numericFields = [
        // Physical Attributes
        "sqft",
        "acre",

        // Pricing and Financing
        "askingPrice",
        "minPrice",
        "disPrice",
        "hoaFee",

        // Financing and Payment Calculation
        "tax",
        "hoaMonthly",
        "serviceFee",
        //"term",
        "interestOne",
        "interestTwo",
        "interestThree",
        "monthlyPaymentOne",
        "monthlyPaymentTwo",
        "monthlyPaymentThree",
        "downPaymentOne",
        "downPaymentTwo",
        "downPaymentThree",
        "loanAmountOne",
        "loanAmountTwo",
        "loanAmountThree",
        "purchasePrice",
        "financedPrice",
      ];

      if (numericFields.includes(name)) {
        const noCommas = value.replace(/,/g, "");
        const numberVal = parseFloat(noCommas);
        if (!isNaN(numberVal)) {
          updated[name] = numberVal.toLocaleString("en-US");
          if (name === "sqft") {
            updated.acre = (numberVal / 43560).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          }
        } else {
          updated[name] = "";
          if (name === "sqft") updated.acre = "";
        }
      } else {
        updated[name] = value;
      }
      return updated;
    });
  };

  // Handle form submission
  const handleSubmitForm = async (e) => {
    if (e) e.preventDefault();

    try {
      const numericFields = [
        // Physical Attributes
        "sqft",
        "acre",

        // Pricing and Financing
        "askingPrice",
        "minPrice",
        "disPrice",
        "hoaFee",

        // Financing and Payment Calculation
        "tax",
        "hoaMonthly",
        "serviceFee",
        //"term",
        "interestOne",
        "interestTwo",
        "interestThree",
        "monthlyPaymentOne",
        "monthlyPaymentTwo",
        "monthlyPaymentThree",
        "downPaymentOne",
        "downPaymentTwo",
        "downPaymentThree",
        "loanAmountOne",
        "loanAmountTwo",
        "loanAmountThree",
        "purchasePrice",
        "financedPrice",
      ];

      const multipartForm = new FormData();
      for (let key in formData) {
        if (key === "imageUrls") continue; // skip imageUrls here
        
        let val = formData[key];
        
        if (numericFields.includes(key) && typeof val === "string") {
          val = val.replace(/,/g, "");
        }
        
        // Special handling for landType array
        if (key === "landType" && Array.isArray(val)) {
          multipartForm.append(key, JSON.stringify(val));
        } else {
          multipartForm.append(key, val);
        }
      }

      // If existing images
      let existingImages = [];
      if (formData.imageUrls && formData.imageUrls.trim() !== "") {
        try {
          existingImages = JSON.parse(formData.imageUrls);
          if (!Array.isArray(existingImages)) existingImages = [];
        } catch (err) {
          existingImages = [];
        }
      }
      multipartForm.append("imageUrls", JSON.stringify(existingImages));

      // Append newly uploaded files
      uploadedImages.forEach((file) => multipartForm.append("images", file));

      await createResidencyWithFiles(multipartForm);

      setDialogMessage("Property added successfully!");
      setDialogType("success");
      setDialogOpen(true);
    } catch (error) {
      console.error("Error creating property:", error);
      // Attempt to extract a detailed error message from the response
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error";
      setDialogMessage(`Failed to create property: ${errorMsg}`);
      setDialogType("warning");
      setDialogOpen(true);
    }
  };

  // Empty form handler to prevent default behavior
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Form submission is handled explicitly by buttons
  };

  // Steps navigation
  const nextStep = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // Define steps array with all necessary props passed to each component
  const steps = [
    {
      title: "System Info",
      component: <SystemInfo formData={formData} handleChange={handleChange} />,
    },
    {
      title: "Listing Details",
      component: (
        <ListingDetails
          formData={formData}
          handleTitleChange={(val) =>
            setFormData((prev) => ({ ...prev, title: val }))
          }
          handleDescriptionChange={(val) =>
            setFormData((prev) => ({ ...prev, description: val }))
          }
          handleNotesChange={(val) =>
            setFormData((prev) => ({ ...prev, notes: val }))
          }
        />
      ),
    },
    {
      title: "Classification",
      component: (
        <Classification formData={formData} handleChange={handleChange} />
      ),
    },
    {
      title: "Location",
      component: (
        <Location
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
        />
      ),
    },
    {
      title: "Dimensions",
      component: <Dimension formData={formData} handleChange={handleChange} />,
    },
    {
      title: "Pricing",
      component: <Pricing formData={formData} handleChange={handleChange} />,
    },
    {
      title: "Financing",
      component: (
        <Financing
          formData={formData}
          handleChange={handleChange}
          updateFormData={(updatedData) => setFormData(updatedData)}
        />
      ),
    },
    {
      title: "Utilities",
      component: <Utilities formData={formData} handleChange={handleChange} />,
    },
    {
      title: "Media & Tags",
      component: (
        <MediaTags
          formData={formData}
          handleChange={handleChange}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
        />
      ),
    },
  ];

  // Improved Step Indicator - Display all steps without scrolling
  const StepIndicator = ({ currentStep }) => {
    return (
      <div className="w-full flex items-center justify-between mb-8 px-2">
        {steps.map((item, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <React.Fragment key={index}>
              {/* Circle with number or check */}
              <div className="flex flex-col items-center">
                <div
                  className={
                    "w-8 h-8 flex items-center justify-center rounded-full border-2 " +
                    (isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : isActive
                      ? "border-blue-500 bg-blue-100 text-blue-700"
                      : "border-gray-300 bg-white text-gray-500")
                  }
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>

                {/* Step title - shown underneath in small text */}
                <span
                  className={
                    "text-xs mt-1 text-center " +
                    (isCompleted || isActive
                      ? "font-semibold text-gray-900"
                      : "text-gray-500")
                  }
                >
                  {item.title}
                </span>
              </div>

              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="w-full h-[2px] bg-gray-300 mx-1"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Step Indicator */}
      <StepIndicator currentStep={step} />

      {/* Form with explicit onSubmit handler to prevent default behavior */}
      <form onSubmit={handleFormSubmit} className="w-full">
        {/* Current Step Content - Only show the active step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 border border-gray-200 rounded-xl shadow-lg max-w-xl mx-auto min-h-[640px]"
          >
            {steps[step].component}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between w-full mt-6 max-w-2xl mx-auto">
          <div>
            {/* Left container */}
            {step > 0 && (
              <Button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Previous
              </Button>
            )}
          </div>

          <div>
            {/* Right container */}
            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-[#324c48] text-white px-4 py-2 rounded-md"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button" // Make this a button not a submit
                onClick={handleSubmitForm} // Use our explicit submit handler
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* ShadCN Alert Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white text-gray-900 border border-gray-300 shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle
              className={
                dialogType === "success" ? "text-green-600" : "text-red-600"
              }
            >
              {dialogType === "success" ? "Success" : "Warning"}
            </DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setDialogOpen(false);
                if (dialogType === "success") {
                  navigate("/properties");
                }
              }}
              className="bg-[#324c48] text-white"
            >
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}