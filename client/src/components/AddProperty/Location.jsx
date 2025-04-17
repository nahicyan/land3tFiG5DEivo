"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddressAutocomplete from "@/components/AddressAutocomplete/AddressAutocomplete";

export default function Location({ formData, handleChange, setFormData }) {
  // A helper to handle checkboxes (if not already in handleChange)
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "landId") {
      setFormData({ ...formData, [name]: checked ? "included" : false });
    } else {
      setFormData({ ...formData, [name]: checked });
    }
  };
  

  return (
    <Card className="border border-gray-200 shadow-md rounded-lg w-full">
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-xl font-bold text-gray-800">
          Location & Identification
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 space-y-2">
        {/* Search Property Box (Autocomplete) */}
        <div className="flex flex-col">
          <AddressAutocomplete formData={formData} setFormData={setFormData} />
        </div>

        {/* Full Row: Street Address (auto-populated but editable) */}
        <div className="flex flex-col">
          <Label htmlFor="streetAddress" className="text-sm font-semibold text-gray-700">
            Street Address
          </Label>
          <Input
            id="streetAddress"
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            placeholder="Enter street address"
            className="mt-1"
          />
        </div>

        {/* City & County */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex flex-col">
            <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
              City
            </Label>
            <Input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="mt-1"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="county" className="text-sm font-semibold text-gray-700">
              County
            </Label>
            <Input
              id="county"
              type="text"
              name="county"
              value={formData.county}
              onChange={handleChange}
              placeholder="Enter county"
              className="mt-1"
            />
          </div>
        </div>

        {/* ZIP & State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex flex-col">
            <Label htmlFor="zip" className="text-sm font-semibold text-gray-700">
              ZIP Code
            </Label>
            <Input
              id="zip"
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              placeholder="Enter ZIP code"
              className="mt-1"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="state" className="text-sm font-semibold text-gray-700">
              State
            </Label>
            <Input
              id="state"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
              className="mt-1"
            />
          </div>
        </div>

        {/* Latitude & Longitude (if needed) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex flex-col">
            <Label htmlFor="latitude" className="text-sm font-semibold text-gray-700">
              Latitude
            </Label>
            <Input
              id="latitude"
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Enter latitude"
              className="mt-1"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="longitude" className="text-sm font-semibold text-gray-700">
              Longitude
            </Label>
            <Input
              id="longitude"
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Enter longitude"
              className="mt-1"
            />
          </div>
        </div>

        {/* APN or PIN */}
        <div className="flex flex-col">
          <Label htmlFor="apnOrPin" className="text-sm font-semibold text-gray-700">
            APN or PIN
          </Label>
          <Input
            id="apnOrPin"
            type="text"
            name="apnOrPin"
            value={formData.apnOrPin}
            onChange={handleChange}
            placeholder="Enter APN or PIN"
            className="mt-1"
          />
        </div>

        {/* New Row: Land ID Checkbox and Land ID Link Field */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="landId"
              checked={formData.landId || false}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <Label className="text-sm font-semibold text-gray-700">
              Include Land ID
            </Label>
          </div>
          {formData.landId && (
            <div className="flex flex-col">
              <Label htmlFor="landIdLink" className="text-sm font-semibold text-gray-700">
                Land ID Link
              </Label>
              <Input
                id="landIdLink"
                type="text"
                name="landIdLink"
                value={formData.landIdLink || ""}
                onChange={handleChange}
                placeholder="Enter Land ID Link"
                className="mt-1"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
