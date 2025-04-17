import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  UserPlus, 
  FileUp, 
  RefreshCw 
} from "lucide-react";
import { toast } from "react-toastify";

// Define buyer types
const BUYER_TYPES = [
  { id: 'CashBuyer', label: 'Cash Buyer' },
  { id: 'Builder', label: 'Builder' },
  { id: 'Developer', label: 'Developer' },
  { id: 'Realtor', label: 'Realtor' },
  { id: 'Investor', label: 'Investor' },
  { id: 'Wholesaler', label: 'Wholesaler' }
];

export default function AddBuyersDialog({ 
  open, 
  onOpenChange, 
  selectedList,
  availableBuyers,
  onAddBuyers,
  onImportCsv 
}) {
  // State for search and filters
  const [searchQuery, setBuyerSearchQuery] = useState("");
  const [buyerTypeFilter, setBuyerTypeFilter] = useState("all");
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [selectedBuyers, setSelectedBuyers] = useState([]);

  // Filter available buyers when search/filter changes
  useEffect(() => {
    if (!open) return;
    
    let filtered = [...availableBuyers];
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(buyer => 
        buyer.firstName.toLowerCase().includes(query) ||
        buyer.lastName.toLowerCase().includes(query) ||
        buyer.email.toLowerCase().includes(query) ||
        buyer.phone.includes(query)
      );
    }
    
    // Apply buyer type filter
    if (buyerTypeFilter !== "all") {
      filtered = filtered.filter(buyer => buyer.buyerType === buyerTypeFilter);
    }
    
    setFilteredBuyers(filtered);
  }, [open, availableBuyers, searchQuery, buyerTypeFilter]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setBuyerSearchQuery("");
      setBuyerTypeFilter("all");
      setSelectedBuyers([]);
    } else {
      setFilteredBuyers(availableBuyers);
    }
  }, [open, availableBuyers]);

  // Handle selecting/deselecting a buyer
  const handleSelectBuyer = (buyerId) => {
    setSelectedBuyers(prev => {
      if (prev.includes(buyerId)) {
        return prev.filter(id => id !== buyerId);
      } else {
        return [...prev, buyerId];
      }
    });
  };

  // Handle selecting/deselecting all visible buyers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBuyers(filteredBuyers.map(buyer => buyer.id));
    } else {
      setSelectedBuyers([]);
    }
  };

  // Handle submitting the form
  const handleSubmit = async () => {
    if (selectedBuyers.length === 0) {
      toast.error("No buyers selected");
      return;
    }

    try {
      await onAddBuyers(selectedBuyers);
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the onAddBuyers function
      console.error("Add buyers error:", error);
    }
  };

  // Handle resetting filters
  const handleResetFilters = () => {
    setBuyerSearchQuery("");
    setBuyerTypeFilter("all");
    setFilteredBuyers(availableBuyers);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Buyers to List</DialogTitle>
          <DialogDescription>
            {selectedList && (
              <>
                Select buyers to add to the {selectedList.name} list.
                Currently showing available buyers.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search buyers..."
                value={searchQuery}
                onChange={(e) => setBuyerSearchQuery(e.target.value)}
                className="pl-9 border-[#324c48]/30"
              />
            </div>
            
            <div className="w-full sm:w-40">
              <Select
                value={buyerTypeFilter}
                onValueChange={setBuyerTypeFilter}
              >
                <SelectTrigger className="border-[#324c48]/30">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {BUYER_TYPES.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#324c48] text-[#324c48]"
                onClick={onImportCsv}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="border-[#324c48] text-[#324c48]"
                onClick={handleResetFilters}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          
          {selectedBuyers.length > 0 && (
            <div className="bg-[#f0f5f4] mb-4 p-3 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-[#324c48]">
                {selectedBuyers.length} buyers selected
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-red-600"
                onClick={() => setSelectedBuyers([])}
              >
                Clear Selection
              </Button>
            </div>
          )}
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedBuyers.length > 0 && selectedBuyers.length === filteredBuyers.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Areas</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuyers.length > 0 ? (
                  filteredBuyers.map((buyer) => (
                    <TableRow key={buyer.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedBuyers.includes(buyer.id)}
                          onCheckedChange={() => handleSelectBuyer(buyer.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {buyer.firstName} {buyer.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{buyer.email}</div>
                        <div className="text-xs text-gray-500">{buyer.phone}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${buyer.buyerType === 'CashBuyer' ? 'bg-green-100 text-green-800' : ''}
                            ${buyer.buyerType === 'Investor' ? 'bg-blue-100 text-blue-800' : ''}
                            ${buyer.buyerType === 'Realtor' ? 'bg-purple-100 text-purple-800' : ''}
                            ${buyer.buyerType === 'Builder' ? 'bg-orange-100 text-orange-800' : ''}
                            ${buyer.buyerType === 'Developer' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${buyer.buyerType === 'Wholesaler' ? 'bg-indigo-100 text-indigo-800' : ''}
                          `}
                        >
                          {buyer.buyerType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {buyer.preferredAreas && buyer.preferredAreas.map((area, idx) => (
                            <Badge key={idx} variant="outline" className="bg-[#f0f5f4] text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {buyer.source === 'VIP Buyers List' ? (
                          <Badge className="bg-[#D4A017] text-white">VIP</Badge>
                        ) : (
                          buyer.source
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No buyers match the current search/filter criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#324c48] text-white"
            disabled={selectedBuyers.length === 0}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add {selectedBuyers.length} Buyers to List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}