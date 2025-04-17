"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Dimension({ formData, handleChange }) {
  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Property Size & Dimensions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Square Footage */}
        <div>
          <Label className="text-base font-semibold text-gray-700">
            Square Footage (sqft)
          </Label>
          <Input
            type="text"
            placeholder="Enter square footage"
            name="sqft"
            value={formData.sqft}
            onChange={handleChange}
            className="w-full border-gray-300 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the total square footage of the property.
          </p>
        </div>

        {/* Acreage (Read-Only) */}
        <div>
          <Label className="text-base font-semibold text-gray-700">Acre</Label>
          <Input
            type="text"
            placeholder="Auto-calculated Acre"
            name="acre"
            value={formData.acre}
            readOnly
            className="w-full border-gray-300 bg-gray-100 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            This value is auto-calculated based on square footage.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
