"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Classification({ formData, handleChange }) {
  const landTypeOptions = [
    "Infill Lot",
    "Buildable Lot",
    "Mobile Home Friendly Lot",
    "Acreage Lot",
    "Raw Land",
    "Rural Lot",
    "Waterfront Lot",
    "Timberland",
    "Recreational Lot",
    "Industrial Lot",
    "Mixed-Use Lot",
    "Undeveloped Lot",
    "Investment Lot",
  ];

  const [landTypeOpen, setLandTypeOpen] = React.useState(false);
  const [selectedLandTypes, setSelectedLandTypes] = React.useState(
    formData.landType || []
  );

  // Initialize landType in formData if not already set
  useEffect(() => {
    if (!formData.landType) {
      handleChange({
        target: {
          name: "landType",
          value: []
        }
      });
    }
  }, []);

  // Updated to properly update the parent formData
  const handleLandTypeChange = (value) => {
    let updatedSelection;
    
    if (selectedLandTypes.includes(value)) {
      // Remove the value if already selected
      updatedSelection = selectedLandTypes.filter((type) => type !== value);
    } else {
      // Add the value if not already selected
      updatedSelection = [...selectedLandTypes, value];
    }
    
    setSelectedLandTypes(updatedSelection);
    
    // Update the parent form data
    handleChange({
      target: {
        name: "landType",
        value: updatedSelection
      }
    });
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Property Classification & Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Type (Non-editable) */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Type</Label>
          <Input
            type="text"
            value="Land"
            disabled
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
          />
        </div>

        {/* Land Type (Multi-select) */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Land Type</Label>
          <Popover open={landTypeOpen} onOpenChange={setLandTypeOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <button
                  type="button"
                  className={cn(
                    "w-full flex min-h-10 px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-1 focus:ring-[#324c48] border-gray-300",
                    !selectedLandTypes.length && "text-gray-400"
                  )}
                >
                  <div className="flex flex-wrap gap-1 overflow-hidden">
                    {selectedLandTypes.length > 0 ? (
                      selectedLandTypes.map((type) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className="bg-gray-100 text-gray-800 mr-1 mb-1"
                        >
                          {type}
                          <button
                            className="ml-1 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLandTypeChange(type);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span>Select Land Types</span>
                    )}
                  </div>
                  <div className="absolute right-3 top-3">
                    <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                  </div>
                </button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search land types..." />
                <CommandEmpty>No type found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {landTypeOptions.map((type) => (
                    <CommandItem
                      key={type}
                      value={type}
                      onSelect={() => {
                        handleLandTypeChange(type);
                      }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedLandTypes.includes(type)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span>{type}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Zoning */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Zoning</Label>
          <Select
            name="zoning"
            value={formData.zoning}
            onValueChange={(value) => handleChange({ target: { name: "zoning", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Zoning" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Residential",
                "Commercial",
                "Industrial",
                "Agricultural",
                "Mixed-Use",
                "Special Purpose",
              ].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Restrictions */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Restrictions</Label>
          <Select
            name="restrictions"
            value={formData.restrictions}
            onValueChange={(value) => handleChange({ target: { name: "restrictions", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Restrictions" />
            </SelectTrigger>
            <SelectContent>
              {[
                "No Known Restriction(s)",
                "Zoning",
                "Deed",
                "Environmental",
                "Easement",
                "Setback",
                "Extraterritorial Jurisdiction",
              ].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Survey */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Survey</Label>
          <Select
            name="survey"
            value={formData.survey}
            onValueChange={(value) => handleChange({ target: { name: "survey", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Survey" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Not Available">Not Available</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Legal Description */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Legal Description</Label>
          <Input
            type="text"
            name="legalDescription"
            value={formData.legalDescription}
            onChange={handleChange}
            placeholder="Enter Legal Description"
          />
        </div>

        {/* Mobile Home Friendly */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Mobile Home Friendly</Label>
          <Select
            name="mobileHomeFriendly"
            value={formData.mobileHomeFriendly}
            onValueChange={(value) => handleChange({ target: { name: "mobileHomeFriendly", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Verify">Verify</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}