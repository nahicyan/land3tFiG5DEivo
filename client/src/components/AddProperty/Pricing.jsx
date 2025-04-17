"use client";

import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function Pricing({ formData, handleChange }) {
  // Calculate hoaMonthly whenever hoaFee or hoaPaymentTerms changes
  useEffect(() => {
    if (formData.hoaPoa === "Yes" && formData.hoaFee && formData.hoaPaymentTerms) {
      // Parse the hoaFee to a number, removing any commas
      const feeValue = parseFloat(formData.hoaFee.toString().replace(/,/g, ""));
      
      if (!isNaN(feeValue)) {
        let monthlyValue;
        
        // Calculate monthly value based on payment terms
        switch (formData.hoaPaymentTerms) {
          case "Annually":
            monthlyValue = feeValue / 12;
            break;
          case "Semi-Annually":
            monthlyValue = feeValue / 6;
            break;
          case "Quarterly":
            monthlyValue = feeValue / 3;
            break;
          case "Monthly":
            monthlyValue = feeValue;
            break;
          default:
            monthlyValue = feeValue / 12; // Default to annual
        }
        
        // Format the monthly value with commas
        const formattedMonthly = monthlyValue.toLocaleString("en-US");
        
        // Update hoaMonthly in formData
        handleChange({
          target: { 
            name: "hoaMonthly", 
            value: formattedMonthly
          }
        });
      }
    } else {
      // If HOA is No or fee/terms are missing, set hoaMonthly to empty or 0
      handleChange({
        target: { 
          name: "hoaMonthly", 
          value: ""
        }
      });
    }
  }, [formData.hoaPoa, formData.hoaFee, formData.hoaPaymentTerms]);

  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Asking Price */}
        <div>
          <Label className="text-sm font-semibold text-gray-700">Asking Price</Label>
          <Input
            type="text"
            placeholder="Enter asking price"
            name="askingPrice"
            value={formData.askingPrice}
            onChange={handleChange}
            className="w-full border-gray-300 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            The initial price you're listing the property for.
          </p>
        </div>

        {/* Discount Price */}
        <div>
          <Label className="text-sm font-semibold text-gray-700">Discount Price</Label>
          <Input
            type="text"
            placeholder="Enter discount price"
            name="disPrice"
            value={formData.disPrice}
            onChange={handleChange}
            className="w-full border-gray-300 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            The special price available for logged in buyers.
          </p>
        </div>

        {/* Minimum Price */}
        <div>
          <Label className="text-sm font-semibold text-gray-700">Minimum Price</Label>
          <Input
            type="text"
            placeholder="Enter minimum price"
            name="minPrice"
            value={formData.minPrice}
            onChange={handleChange}
            className="w-full border-gray-300 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            The lowest amount you are willing to accept for this property.
          </p>
        </div>
        {/* Yearly Tax */}
        <div>
          <Label className="text-sm font-semibold text-gray-700">Yearly Tax</Label>
          <Input
            type="text"
            placeholder="Enter Yearly Tax"
            name="tax"
            value={formData.tax}
            onChange={handleChange}
            className="w-full border-gray-300 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
           Monthly Tax Will Be Calculated Automatically From This Yearly Tax
          </p>
        </div>
        
        {/* HOA / POA */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">HOA / POA</Label>
          <Select
            name="hoaPoa"
            value={formData.hoaPoa}
            onValueChange={(value) => handleChange({ target: { name: "hoaPoa", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conditionally Render HOA Fee & Terms */}
        {formData.hoaPoa === "Yes" && (
          <div className="grid grid-cols-2 gap-3">

            <div className="flex flex-col space-y-1 mb-4">
              <Label className="text-gray-700 font-semibold">HOA Payment Terms</Label>
              <Select
                name="hoaPaymentTerms"
                value={formData.hoaPaymentTerms}
                onValueChange={(value) => handleChange({ target: { name: "hoaPaymentTerms", value } })}
              >
                <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {["Annually", "Semi-Annually", "Quarterly", "Monthly"].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1 mb-4">
              <Label className="text-gray-700 font-semibold">HOA Fee</Label>
              <Input
                type="text"
                name="hoaFee"
                value={formData.hoaFee}
                onChange={handleChange}
                placeholder="Enter HOA Fee"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}