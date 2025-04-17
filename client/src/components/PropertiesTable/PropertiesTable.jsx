// PropertiesTable.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PuffLoader } from "react-spinners";
import useProperties from "../../components/hooks/useProperties.js";
import { columns } from "../DataTable/Columns";
import { DataTable } from "../DataTable/DataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter, SlidersHorizontal } from "lucide-react";

export default function PropertiesTable({ propertyData }) {
  const { data, isError, isLoading } = useProperties();
  // Generic search query
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: "all",
    area: "all",
    priceRange: [0, 5000000], // Default price range from 0 to 5,000,000
    minPriceDisplay: "0", // For display purposes
    maxPriceDisplay: "5,000,000", // For display purposes
    ownerId: "",
    squareFeet: [0, 500000], // Default square feet range
    minSqftDisplay: "0",
    maxSqftDisplay: "500,000",
    ownershipType: "",
    financing: "all",
  });

  // For mobile filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Parse filtered data
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter((property) => {
      // General search query filtering
      const searchFields = [
        property.title,
        property.streetAddress,
        property.state,
        property.zip,
        property.area,
        property.apnOrPin,
        property.ltag,
        property.rtag,
        property.city,
        property.county
      ];
      
      const matchesSearchQuery = !searchQuery || searchFields.some(field => 
        field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Advanced filters
      const matchesStatus = filters.status === "all" || property.status === filters.status;
      const matchesArea = filters.area === "all" || property.area === filters.area;
      const matchesOwner = !filters.ownerId || property.ownerId?.toString() === filters.ownerId;
      const matchesFinancing = filters.financing === "all" || property.financing === filters.financing;
      
      // Price range filtering
      const propertyPrice = parseFloat(property.askingPrice || 0);
      const withinPriceRange = propertyPrice >= filters.priceRange[0] && 
                               propertyPrice <= filters.priceRange[1];
      
      // Square footage filtering
      const propertySqft = parseFloat(property.sqft || 0);
      const withinSqftRange = propertySqft >= filters.squareFeet[0] && 
                              propertySqft <= filters.squareFeet[1];
      
      return matchesSearchQuery && 
             matchesStatus && 
             matchesArea && 
             withinPriceRange && 
             matchesOwner &&
             withinSqftRange &&
             matchesFinancing;
    });
  }, [data, searchQuery, filters]);

  // Update active filters for display
  useEffect(() => {
    const newActiveFilters = [];
    
    if (filters.status && filters.status !== "all") {
      newActiveFilters.push({ 
        type: 'status', 
        value: filters.status, 
        label: `Status: ${filters.status}` 
      });
    }
    
    if (filters.area && filters.area !== "all") {
      newActiveFilters.push({ 
        type: 'area', 
        value: filters.area, 
        label: `Area: ${filters.area}` 
      });
    }
    
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000000) {
      newActiveFilters.push({ 
        type: 'priceRange', 
        value: filters.priceRange, 
        label: `Price: ${formatNumber(filters.priceRange[0])} - ${formatNumber(filters.priceRange[1])}` 
      });
    }
    
    if (filters.ownerId) {
      newActiveFilters.push({ 
        type: 'ownerId', 
        value: filters.ownerId, 
        label: `Owner ID: ${filters.ownerId}` 
      });
    }
    
    if (filters.squareFeet[0] > 0 || filters.squareFeet[1] < 500000) {
      newActiveFilters.push({ 
        type: 'squareFeet', 
        value: filters.squareFeet, 
        label: `Size: ${formatNumber(filters.squareFeet[0])} - ${formatNumber(filters.squareFeet[1])} sqft` 
      });
    }

    if (filters.financing && filters.financing !== "all") {
      newActiveFilters.push({ 
        type: 'financing', 
        value: filters.financing, 
        label: `Financing: ${filters.financing}` 
      });
    }
    
    setActiveFilters(newActiveFilters);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Handle price range changes
  const handlePriceRangeChange = (value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value,
      minPriceDisplay: formatNumber(value[0]),
      maxPriceDisplay: formatNumber(value[1])
    }));
  };

  // Handle square footage range changes
  const handleSqftRangeChange = (value) => {
    setFilters(prev => ({
      ...prev,
      squareFeet: value,
      minSqftDisplay: formatNumber(value[0]),
      maxSqftDisplay: formatNumber(value[1])
    }));
  };

  // Remove a specific filter
  const removeFilter = (type, value) => {
    if (type === 'priceRange') {
      setFilters(prev => ({
        ...prev,
        priceRange: [0, 5000000],
        minPriceDisplay: "0",
        maxPriceDisplay: "5,000,000"
      }));
    } else if (type === 'squareFeet') {
      setFilters(prev => ({
        ...prev,
        squareFeet: [0, 500000],
        minSqftDisplay: "0",
        maxSqftDisplay: "500,000"
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [type]: type === "ownerId" ? "" : "all"
      }));
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({
      status: "all",
      area: "all",
      priceRange: [0, 5000000],
      minPriceDisplay: "0",
      maxPriceDisplay: "5,000,000",
      ownerId: "",
      squareFeet: [0, 500000],
      minSqftDisplay: "0",
      maxSqftDisplay: "500,000",
      ownershipType: "",
      financing: "all",
    });
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h2 className="text-red-600 text-xl font-semibold">Error fetching data.</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#404040" />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FDF8F2] rounded-lg p-4 sm:p-6">
      <div className="space-y-4">
        {/* Main Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Search Input */}
          <div className="w-full lg:flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by title, address, state, zip, area, APN, tags, city, or county"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Desktop Filter Button */}
          <div className="hidden lg:flex">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-[#324c48] text-[#324c48] hover:bg-[#324c48] hover:text-white"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> 
                  Advanced Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-4">
                <h3 className="font-medium text-lg mb-4">Filter Properties</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Status filter */}
                  <div className="space-y-2">
                    <Label htmlFor="status-filter">Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger id="status-filter">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                        <SelectItem value="Testing">Testing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Area filter */}
                  <div className="space-y-2">
                    <Label htmlFor="area-filter">Area</Label>
                    <Select
                      value={filters.area}
                      onValueChange={(value) => handleFilterChange('area', value)}
                    >
                      <SelectTrigger id="area-filter">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Areas</SelectItem>
                        <SelectItem value="DFW">DFW</SelectItem>
                        <SelectItem value="Austin">Austin</SelectItem>
                        <SelectItem value="Houston">Houston</SelectItem>
                        <SelectItem value="San Antonio">San Antonio</SelectItem>
                        <SelectItem value="Other Areas">Other Areas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Financing filter */}
                  <div className="space-y-2">
                    <Label htmlFor="financing-filter">Financing</Label>
                    <Select
                      value={filters.financing}
                      onValueChange={(value) => handleFilterChange('financing', value)}
                    >
                      <SelectTrigger id="financing-filter">
                        <SelectValue placeholder="Select financing option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Options</SelectItem>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Not-Available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Owner ID filter */}
                  <div className="space-y-2">
                    <Label htmlFor="owner-filter">Owner ID</Label>
                    <Input
                      id="owner-filter"
                      type="text"
                      value={filters.ownerId}
                      onChange={(e) => handleFilterChange('ownerId', e.target.value)}
                      placeholder="Enter owner ID"
                    />
                  </div>

                  {/* Price Range filter */}
                  <div className="space-y-2 col-span-2">
                    <div className="flex justify-between items-center">
                      <Label>Price Range</Label>
                      <div className="flex space-x-2 text-sm">
                        <span>${filters.minPriceDisplay}</span>
                        <span>-</span>
                        <span>${filters.maxPriceDisplay}</span>
                      </div>
                    </div>
                    <Slider
                      defaultValue={[0, 5000000]}
                      value={filters.priceRange}
                      min={0}
                      max={5000000}
                      step={10000}
                      onValueChange={handlePriceRangeChange}
                      className="mt-2"
                    />
                  </div>

                  {/* Square Footage filter */}
                  <div className="space-y-2 col-span-2">
                    <div className="flex justify-between items-center">
                      <Label>Square Footage</Label>
                      <div className="flex space-x-2 text-sm">
                        <span>{filters.minSqftDisplay}</span>
                        <span>-</span>
                        <span>{filters.maxSqftDisplay} sqft</span>
                      </div>
                    </div>
                    <Slider
                      defaultValue={[0, 500000]}
                      value={filters.squareFeet}
                      min={0}
                      max={500000}
                      step={1000}
                      onValueChange={handleSqftRangeChange}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4 space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={clearAllFilters}
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                  <Button 
                    onClick={() => document.body.click()}
                    className="bg-[#324c48] hover:bg-[#3f4f24]"
                  >
                    Apply Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden w-full">
            <Button 
              variant="outline" 
              className="w-full border-[#324c48] text-[#324c48]"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Mobile Filters Accordion */}
        {showMobileFilters && (
          <div className="lg:hidden bg-white rounded-lg shadow p-4 space-y-4">
            <h3 className="font-medium text-lg">Filters</h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="status">
                <AccordionTrigger>Status</AccordionTrigger>
                <AccordionContent>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                      <SelectItem value="Not Available">Not Available</SelectItem>
                      <SelectItem value="Testing">Testing</SelectItem>
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="area">
                <AccordionTrigger>Area</AccordionTrigger>
                <AccordionContent>
                  <Select
                    value={filters.area}
                    onValueChange={(value) => handleFilterChange('area', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      <SelectItem value="DFW">DFW</SelectItem>
                      <SelectItem value="Austin">Austin</SelectItem>
                      <SelectItem value="Houston">Houston</SelectItem>
                      <SelectItem value="San Antonio">San Antonio</SelectItem>
                      <SelectItem value="Other Areas">Other Areas</SelectItem>
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="financing">
                <AccordionTrigger>Financing</AccordionTrigger>
                <AccordionContent>
                  <Select
                    value={filters.financing}
                    onValueChange={(value) => handleFilterChange('financing', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select financing option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Options</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Not-Available">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span>${filters.minPriceDisplay}</span>
                      <span>-</span>
                      <span>${filters.maxPriceDisplay}</span>
                    </div>
                    <Slider
                      defaultValue={[0, 5000000]}
                      value={filters.priceRange}
                      min={0}
                      max={5000000}
                      step={10000}
                      onValueChange={handlePriceRangeChange}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sqft">
                <AccordionTrigger>Square Footage</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span>{filters.minSqftDisplay}</span>
                      <span>-</span>
                      <span>{filters.maxSqftDisplay} sqft</span>
                    </div>
                    <Slider
                      defaultValue={[0, 500000]}
                      value={filters.squareFeet}
                      min={0}
                      max={500000}
                      step={1000}
                      onValueChange={handleSqftRangeChange}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner">
                <AccordionTrigger>Owner ID</AccordionTrigger>
                <AccordionContent>
                  <Input
                    type="text"
                    value={filters.ownerId}
                    onChange={(e) => handleFilterChange('ownerId', e.target.value)}
                    placeholder="Enter owner ID"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex space-x-2 pt-2">
              <Button 
                variant="outline" 
                onClick={clearAllFilters}
                className="flex-1 text-red-500 border-red-500 hover:bg-red-50"
              >
                Clear All
              </Button>
              <Button 
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 bg-[#324c48] hover:bg-[#3f4f24]"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {activeFilters.map((filter, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="bg-[#f0f5f4] text-[#324c48] border-[#324c48] py-1 px-3 flex items-center gap-1"
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.type, filter.value)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-[#324c48] hover:text-red-500 hover:bg-red-50 text-xs h-6"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {filteredData.length} {filteredData.length === 1 ? "result" : "results"} found
          </p>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <DataTable columns={columns} data={filteredData} />
        </div>
      </div>
    </div>
  );
}