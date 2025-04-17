"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function Utilities({ formData, handleChange }) {
  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Utilities, Infrastructure & Environmental Factors
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Water */}
        <div className="mb-4">
          <Label className="text-gray-700 font-semibold">Water</Label>
          <Select
            name="water"
            value={formData.water}
            onValueChange={(value) => handleChange({ target: { name: "water", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Water Option" />
            </SelectTrigger>
            <SelectContent>
              {["Available", "Unavailable", "Well Needed", "Unknown", "Active Well"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sewer */}
        <div className="mb-4">
          <Label className="text-gray-700 font-semibold">Sewer</Label>
          <Select
            name="sewer"
            value={formData.sewer}
            onValueChange={(value) => handleChange({ target: { name: "sewer", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Sewer Option" />
            </SelectTrigger>
            <SelectContent>
              {["Available", "Unavailable", "Septic Needed", "Unknown", "Active Septic"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Electric */}
        <div className="mb-4">
          <Label className="text-gray-700 font-semibold">Electric</Label>
          <Select
            name="electric"
            value={formData.electric}
            onValueChange={(value) => handleChange({ target: { name: "electric", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Electric Option" />
            </SelectTrigger>
            <SelectContent>
              {["Available", "Unavailable", "Unknown", "On Property"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Road Condition */}
        <div className="mb-4">
          <Label className="text-gray-700 font-semibold">Road Condition</Label>
          <Select
            name="roadCondition"
            value={formData.roadCondition}
            onValueChange={(value) => handleChange({ target: { name: "roadCondition", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Road Condition" />
            </SelectTrigger>
            <SelectContent>
              {["Paved Road", "Dirt Road", "No Access", "Gravel"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Floodplain */}
        <div className="mb-4">
          <Label className="text-gray-700 font-semibold">Floodplain</Label>
          <Select
            name="floodplain"
            value={formData.floodplain}
            onValueChange={(value) => handleChange({ target: { name: "floodplain", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Floodplain Option" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Yes",
                "No",
                "100-Year Floodplain",
                "100-Year Floodway",
                "Coastal-100 Year Floodplain",
                "Coastal 100 Year Floodway",
                "100-Year Partial Floodplain",
                "500 Year-Floodplain",
                "Wetlands",
              ].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
