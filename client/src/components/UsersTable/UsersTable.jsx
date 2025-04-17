// UsersTable.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PuffLoader } from "react-spinners";
import useUsers from "@/components/hooks/useUsers.js";
import { columns } from "@/components/UserColumns/UserColumns";
import { DataTable } from "@/components/DataTable/DataTable";
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
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter, SlidersHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function UsersTable() {
  const { data, isError, isLoading } = useUsers();
  // Generic search query
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    role: "all",
  });

  // For mobile filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Parse filtered data
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter((user) => {
      // General search query filtering
      const searchFields = [
        user.name,
        user.email,
      ];
      
      const matchesSearchQuery = !searchQuery || searchFields.some(field => 
        field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Role filter
      const matchesRole = filters.role === "all" || user.role === filters.role;
      
      return matchesSearchQuery && matchesRole;
    });
  }, [data, searchQuery, filters]);

  // Update active filters for display
  useEffect(() => {
    const newActiveFilters = [];
    
    if (filters.role && filters.role !== "all") {
      newActiveFilters.push({ 
        type: 'role', 
        value: filters.role, 
        label: `Role: ${filters.role}` 
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

  // Remove a specific filter
  const removeFilter = (type) => {
    setFilters(prev => ({
      ...prev,
      [type]: "all"
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({
      role: "all",
    });
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h2 className="text-red-600 text-xl font-semibold">Error fetching users.</h2>
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
                placeholder="Search by name or email"
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
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4">
                <h3 className="font-medium text-lg mb-4">Filter Users</h3>
                <div className="space-y-4">
                  {/* Role filter */}
                  <div className="space-y-2">
                    <Label htmlFor="role-filter">Role</Label>
                    <Select
                      value={filters.role}
                      onValueChange={(value) => handleFilterChange('role', value)}
                    >
                      <SelectTrigger id="role-filter">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
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

        {/* Mobile Filters Dropdown */}
        {showMobileFilters && (
          <div className="lg:hidden bg-white rounded-lg shadow p-4 space-y-4">
            <h3 className="font-medium text-lg">Filters</h3>
            
            <div className="space-y-2">
              <Label htmlFor="mobile-role-filter">Role</Label>
              <Select
                value={filters.role}
                onValueChange={(value) => handleFilterChange('role', value)}
              >
                <SelectTrigger id="mobile-role-filter">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
            {filteredData.length} {filteredData.length === 1 ? "user" : "users"} found
          </p>
          <Button 
            onClick={() => window.location.href = "/admin/users/new"}
            className="bg-[#324c48] hover:bg-[#3f4f24] text-white"
          >
            Add New User
          </Button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <DataTable columns={columns} data={filteredData} />
        </div>
      </div>
    </div>
  );
}