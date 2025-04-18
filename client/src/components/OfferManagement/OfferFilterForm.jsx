// client/src/components/OfferManagement/OfferFilterForm.jsx
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from 'lucide-react';

const OfferFilterForm = ({ filters, setFilters, onApplyFilters, onResetFilters }) => {
  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-md shadow mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Filter Offers</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Any Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="COUNTERED">Countered</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="search">Search (Name, Email, Property)</Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        
        <div>
          <Label htmlFor="dateRange">Date Range</Label>
          <div className="flex space-x-2">
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-1/2"
            />
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-1/2"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4 space-x-2">
        <Button
          variant="outline"
          onClick={onResetFilters}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button
          onClick={onApplyFilters}
          className="bg-[#324c48] hover:bg-[#3f4f24] text-white"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default OfferFilterForm;