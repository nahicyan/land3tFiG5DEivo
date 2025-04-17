// client/src/components/PropertyManagement/PropertyFilters.jsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Filter, SlidersHorizontal } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PropertyFilters({ onFilterChange, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    status: "all",
    area: "all",
    priceRange: [0, 5000000],
    minPriceDisplay: "0",
    maxPriceDisplay: "5,000,000",
    ownerId: "",
    squareFeet: [0, 500000],
    minSqftDisplay: "0",
    maxSqftDisplay: "500,000",
    financing: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialFilters
  });

  const [activeFilters, setActiveFilters] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    const newFilters = {
      ...filters,
      [type]: value
    };
    setFilters(newFilters);
    
    // Notify parent component of filter changes
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Handle price range changes
  const handlePriceRangeChange = (value) => {
    const newFilters = {
      ...filters,
      priceRange: value,
      minPriceDisplay: formatNumber(value[0]),
      maxPriceDisplay: formatNumber(value[1])
    };
    setFilters(newFilters);
    
    // Notify parent component of filter changes
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Handle square footage range changes
  const handleSqftRangeChange = (value) => {
    const newFilters = {
      ...filters,
      squareFeet: value,
      minSqftDisplay: formatNumber(value[0]),
      maxSqftDisplay: formatNumber(value[1])
    };
    setFilters(newFilters);
    
    // Notify parent component of filter changes
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Remove a specific filter
  const removeFilter = (type) => {
    let newFilters = { ...filters };
    
    switch(type) {
      case 'priceRange':
        newFilters = {
          ...newFilters,
          priceRange: [0, 5000000],
          minPriceDisplay: "0",
          maxPriceDisplay: "5,000,000"
        };
        break;
      case 'squareFeet':
        newFilters = {
          ...newFilters,
          squareFeet: [0, 500000],
          minSqftDisplay: "0",
          maxSqftDisplay: "500,000"
        };
        break;
      case 'ownerId':
        newFilters = {
          ...newFilters,
          ownerId: ""
        };
        break;
      default:
        newFilters = {
          ...newFilters,
          [type]: "all"
        };
    }
    
    setFilters(newFilters);
    
    // Notify parent component of filter changes
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Reset all filters
  const clearAllFilters = () => {
    const defaultFilters = {
      status: "all",
      area: "all",
      priceRange: [0, 5000000],
      minPriceDisplay: "0",
      maxPriceDisplay: "5,000,000",
      ownerId: "",
      squareFeet: [0, 500000],
      minSqftDisplay: "0",
      maxSqftDisplay: "500,000",
      financing: "all",
      sortBy: "createdAt",
      sortOrder: "desc"
    };
    
    setFilters(defaultFilters);
    
    // Notify parent component of filter changes
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  // Update active filters for display
  React.useEffect(() => {
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
        label: `Price: $${formatNumber(filters.priceRange[0])} - $${formatNumber(filters.priceRange[1])}` 
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

  return (
    <div className="space-y-4">
      {/* Desktop Filter Button */}
      <div className="hidden md:flex justify-between items-center">
        <h3 className="text-lg font-medium">Filters & Sorting</h3>
        <div className="flex space-x-2">
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

                {/* Sort options */}
                <div className="space-y-2">
                  <Label htmlFor="sort-by">Sort By</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger id="sort-by">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date Added</SelectItem>
                      <SelectItem value="askingPrice">Price</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="sqft">Square Footage</SelectItem>
                      <SelectItem value="area">Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort-order">Sort Order</Label>
                  <Select
                    value={filters.sortOrder}
                    onValueChange={(value) => handleFilterChange('sortOrder', value)}
                  >
                    <SelectTrigger id="sort-order">
                      <SelectValue placeholder="Sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
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
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden w-full">
        <Button 
          variant="outline" 
          className="w-full border-[#324c48] text-[#324c48]"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters & Sorting
        </Button>
      </div>

      {/* Mobile Filters Accordion */}
      {showMobileFilters && (
        <div className="md:hidden bg-white rounded-lg shadow p-4 space-y-4">
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

            <AccordionItem value="sort">
              <AccordionTrigger>Sort Options</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mob-sort-by">Sort By</Label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) => handleFilterChange('sortBy', value)}
                    >
                      <SelectTrigger id="mob-sort-by">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Date Added</SelectItem>
                        <SelectItem value="askingPrice">Price</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="sqft">Square Footage</SelectItem>
                        <SelectItem value="area">Area</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mob-sort-order">Sort Order</Label>
                    <Select
                      value={filters.sortOrder}
                      onValueChange={(value) => handleFilterChange('sortOrder', value)}
                    >
                      <SelectTrigger id="mob-sort-order">
                        <SelectValue placeholder="Sort order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
                onClick={() => removeFilter(filter.type)}
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
    </div>
  );
}