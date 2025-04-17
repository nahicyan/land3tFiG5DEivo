"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import UserSubmit from "@/components/AddProperty/UserSubmit"; 

export default function SystemInfoCard({ formData, handleChange }) {
  return (
    <Card className="mb-6 shadow-sm border border-gray-200 w-full">
      <CardHeader>
        <CardTitle>System Information</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Please fill out the following details.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Display the authenticated user information */}
        <UserSubmit />

        {/* Owner ID */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="ownerId" className="text-gray-700 font-semibold">
            Owner ID
          </Label>
          <Input
            id="ownerId"
            name="ownerId"
            value={formData.ownerId}
            onChange={handleChange}
            placeholder="Enter Owner ID"
          />
        </div>

        {/* Area Selection */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="area" className="text-gray-700 font-semibold">
            Area
          </Label>
          <Select
            name="area"
            value={formData.area}
            onValueChange={(value) => handleChange({ target: { name: "area", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DFW">DFW</SelectItem>
              <SelectItem value="Austin">Austin</SelectItem>
              <SelectItem value="Houston">Houston</SelectItem>
              <SelectItem value="San Antonio">San Antonio</SelectItem>
              <SelectItem value="Other Areas">Other Areas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Selection */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="status" className="text-gray-700 font-semibold">
            Status
          </Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value) => handleChange({ target: { name: "status", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
              <SelectItem value="Not Available">Not Available</SelectItem>
              <SelectItem value="Testing">Testing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Selection */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="featured" className="text-gray-700 font-semibold">
            Featured
          </Label>
          <Select
            name="featured"
            value={formData.featured}
            onValueChange={(value) => handleChange({ target: { name: "featured", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Featured Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Featured">Featured</SelectItem>
              <SelectItem value="Not Featured">Not Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Weight Selection */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="featuredWeight" className="text-gray-700 font-semibold">
            Featured Weight
          </Label>
          <Select
            name="featuredWeight"
            value={formData.featuredWeight}
            onValueChange={(value) => handleChange({ target: { name: "featuredWeight", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Featured Weight" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(21).keys()].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}