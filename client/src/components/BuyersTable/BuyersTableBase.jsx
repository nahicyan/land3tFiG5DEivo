// client/src/components/BuyersTable/BuyersTableBase.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getAllBuyers, getProperty } from "@/utils/api";
import { format } from "date-fns";
import { formatPrice } from "@/utils/format";

import {
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Edit, 
  Eye, 
  Filter, 
  Search, 
  DollarSign, 
  TrendingUp, 
  BadgeDollarSign,
  Mail,
  PlusCircle, 
  Trash2, 
  Download, 
  MoreVertical, 
  FileUp
} from "lucide-react";

// Import constants - if not already defined, create them locally
const AREAS = [
  { id: 'DFW', label: 'Dallas Fort Worth', value: 'dfw' },
  { id: 'Austin', label: 'Austin', value: 'austin' },
  { id: 'Houston', label: 'Houston', value: 'houston' },
  { id: 'San Antonio', label: 'San Antonio', value: 'san antonio' },
  { id: 'Other Areas', label: 'Other Areas', value: 'other areas' }
];

const BUYER_TYPES = [
  { id: 'CashBuyer', label: 'Cash Buyer' },
  { id: 'Builder', label: 'Builder' },
  { id: 'Developer', label: 'Developer' },
  { id: 'Realtor', label: 'Realtor' },
  { id: 'Investor', label: 'Investor' },
  { id: 'Wholesaler', label: 'Wholesaler' }
];

const getBuyerTypeClass = (type) => {
  switch(type) {
    case 'CashBuyer': return 'bg-green-50 text-green-600 border-green-200';
    case 'Builder': return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'Developer': return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'Realtor': return 'bg-orange-50 text-orange-600 border-orange-200';
    case 'Investor': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
    case 'Wholesaler': return 'bg-rose-50 text-rose-600 border-rose-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

export default function BuyersTableBase({
  filteredBuyers = [],
  buyers = [],
  selectedBuyers = [],
  searchQuery = "",
  setSearchQuery = () => {},
  areaFilter = "all",
  setAreaFilter = () => {},
  buyerTypeFilter = "all",
  setBuyerTypeFilter = () => {},
  sourceFilter = "all",
  setSourceFilter = () => {},
  onSelectBuyer = () => {},
  onSelectAll = () => {},
  onDeleteSelected = () => {},
  setEmailDialogOpen = () => {},
  setBulkImportOpen = () => {},
  onExport = () => {},
  onViewActivity = () => {},
  navigate = null,
}) {
  const routerNavigate = useNavigate();
  const navigateTo = navigate || routerNavigate;
  const [propertyDetails, setPropertyDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [internalBuyerData, setInternalBuyerData] = useState([]);
  const [internalFilteredBuyers, setInternalFilteredBuyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  // Check if props were provided or we need to fetch data internally
  const usingProvidedData = buyers.length > 0 || filteredBuyers.length > 0;

  // Fetch all buyers data if not provided through props
  const { data: fetchedBuyers, isError } = useQuery(
    ["buyers"],
    getAllBuyers,
    {
      refetchOnWindowFocus: false,
      enabled: !usingProvidedData,
    }
  );

  useEffect(() => {
    // If using provided data
    if (usingProvidedData) {
      // Use the buyers passed in props 
      const buyersToUse = filteredBuyers.length > 0 ? filteredBuyers : buyers;
      
      // Get property details for profit calculation
      fetchPropertyDetailsForBuyers(buyersToUse);
      setIsLoading(false);
    } 
    // Otherwise use fetched data
    else if (fetchedBuyers && Array.isArray(fetchedBuyers)) {
      setInternalBuyerData(fetchedBuyers);
      
      // Filter the fetched buyers based on internal state
      const filtered = fetchedBuyers.filter(buyer => {
        const searchMatch = 
          searchTerm === "" ||
          buyer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          buyer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          buyer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          buyer.phone?.includes(searchTerm);
        
        const typeMatch = filterType === "" || buyer.buyerType === filterType;
        
        return searchMatch && typeMatch;
      });
      
      setInternalFilteredBuyers(filtered);
      
      // Get property details for profit calculation
      fetchPropertyDetailsForBuyers(fetchedBuyers);
      setIsLoading(false);
    }
  }, [fetchedBuyers, usingProvidedData, buyers, filteredBuyers, searchTerm, filterType]);

  // Helper function to fetch property details for offers
  const fetchPropertyDetailsForBuyers = async (buyersArray) => {
    const propertyIds = new Set();
    
    buyersArray.forEach(buyer => {
      if (buyer.offers && buyer.offers.length > 0) {
        buyer.offers.forEach(offer => {
          propertyIds.add(offer.propertyId);
        });
      }
    });
    
    // Fetch details for each property to get purchase prices
    const details = {};
    for (const id of propertyIds) {
      try {
        const property = await getProperty(id);
        details[id] = property;
      } catch (error) {
        console.error(`Error fetching property ${id}:`, error);
      }
    }
    
    setPropertyDetails(details);
  };

  // Use either the provided buyers or our internal ones
  const buyersToDisplay = usingProvidedData ? filteredBuyers : internalFilteredBuyers;
  const allBuyers = usingProvidedData ? buyers : internalBuyerData;

  // Calculate profit for an offer
  const calculateProfit = (offer) => {
    if (!offer || !propertyDetails[offer.propertyId]) return null;
    
    const property = propertyDetails[offer.propertyId];
    const purchasePrice = property.purchasePrice || 0;
    const sellingPrice = offer.offeredPrice || 0;
    
    return sellingPrice - purchasePrice;
  };

  // Format profit with color and sign
  const formatProfit = (profit) => {
    if (profit === null) return "-";
    
    const formattedValue = formatPrice(Math.abs(profit));
    const isPositive = profit > 0;
    
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />}
        {isPositive ? '+' : '-'}${formattedValue}
      </span>
    );
  };
  
  // Get activity score for a buyer
  const getActivityScore = (buyer) => {
    // For VIP buyers with auth0Id, we assume they have actual activity data
    if (buyer.auth0Id) {
      // Return a score based on their auth0Id to ensure consistency
      // In a real implementation, this would be replaced with actual data
      const idStr = buyer.id || '';
      const hash = Array.from(idStr).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return Math.min(100, Math.max(20, hash % 100));
    }
    
    // For non-VIP buyers, calculate a basic score based on offers
    if (buyer.offers && buyer.offers.length > 0) {
      return Math.min(85, 30 + (buyer.offers.length * 15));
    }
    
    // Default low score for buyers without activity
    return 25;
  };

  if (isError) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500">Failed to load buyers data. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <p>Loading buyer data...</p>
      </div>
    );
  }

  return (
    <>
      <CardHeader className="bg-[#f0f5f4] border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Buyers List</CardTitle>
          
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-[#324c48] text-[#324c48]"
              onClick={() => navigateTo("/admin/buyers/create")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Buyer
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="border-[#324c48] text-[#324c48]"
              onClick={() => setBulkImportOpen(true)}
            >
              <FileUp className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="border-[#324c48] text-[#324c48]"
              onClick={onExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Search and Filters */}
        <div className="p-4 border-b grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email, or phone"
              value={usingProvidedData ? searchQuery : searchTerm}
              onChange={(e) => usingProvidedData ? setSearchQuery(e.target.value) : setSearchTerm(e.target.value)}
              className="pl-9 border-[#324c48]/30"
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="w-1/2">
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger className="border-[#324c48]/30">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Area" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {AREAS.map(area => (
                    <SelectItem key={area.id} value={area.id}>{area.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-1/2">
              <Select value={usingProvidedData ? buyerTypeFilter : filterType} onValueChange={usingProvidedData ? setBuyerTypeFilter : setFilterType}>
                <SelectTrigger className="border-[#324c48]/30">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {BUYER_TYPES.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="border-[#324c48]/30">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Source" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="VIP Buyers List">VIP Buyers List</SelectItem>
                <SelectItem value="Manual Entry">Manual Entry</SelectItem>
                <SelectItem value="Property Offer">Property Offer</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="CSV Import">CSV Import</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Bulk Actions */}
        {selectedBuyers.length > 0 && (
          <div className="p-3 bg-[#f0f5f4] border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-[#324c48]">
              {selectedBuyers.length} buyers selected
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-[#324c48] text-white"
                onClick={() => setEmailDialogOpen(true)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Selected
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={onDeleteSelected}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        )}
        
        {/* Buyers Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedBuyers.length === buyersToDisplay.length && buyersToDisplay.length > 0}
                    onCheckedChange={onSelectAll}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Areas</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Latest Offer</TableHead>
                <TableHead>Profit Potential</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buyersToDisplay.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    {(searchQuery || searchTerm || areaFilter !== "all" || buyerTypeFilter !== "all" || sourceFilter !== "all") 
                      ? "No buyers found matching your filters." 
                      : "No buyers found. Add your first buyer to get started!"}
                  </TableCell>
                </TableRow>
              ) : (
                buyersToDisplay.map((buyer) => {
                  const activityScore = getActivityScore(buyer);
                  
                  // Get the most recent offer
                  const latestOffer = buyer.offers && buyer.offers.length > 0
                    ? buyer.offers[0] // Already sorted by descending date
                    : null;
                  
                  // Calculate potential profit
                  const profit = calculateProfit(latestOffer);
                  
                  return (
                    <TableRow key={buyer.id} className="group">
                      <TableCell>
                        <Checkbox
                          checked={selectedBuyers.includes(buyer.id)}
                          onCheckedChange={() => onSelectBuyer(buyer.id)}
                          aria-label={`Select ${buyer.firstName}`}
                          className="translate-y-[2px]"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {buyer.firstName} {buyer.lastName}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{buyer.email}</div>
                          <div className="text-xs text-gray-500">{buyer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {buyer?.preferredAreas && Array.isArray(buyer.preferredAreas) && buyer.preferredAreas.length > 0 ? (
                            buyer.preferredAreas.map((area, idx) => (
                              <Badge key={idx} variant="outline" className="bg-[#f0f5f4] text-xs">
                                {area}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">None specified</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getBuyerTypeClass(buyer.buyerType)}
                        >
                          {buyer.buyerType || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center">
                          <div className="w-full h-2 bg-gray-200 rounded-full mb-1">
                            <div 
                              className={`h-full rounded-full ${
                                activityScore >= 80 ? 'bg-green-500' :
                                activityScore >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${activityScore}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge 
                              variant="outline" 
                              className="text-xs cursor-pointer hover:bg-gray-100"
                              onClick={() => onViewActivity(buyer)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {latestOffer ? (
                          <div className="flex flex-col">
                            <div className="text-sm font-medium flex items-center">
                              <DollarSign className="w-3.5 h-3.5 mr-1" />
                              {formatPrice(latestOffer.offeredPrice)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(latestOffer.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No offers</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {latestOffer ? (
                          <div className="flex flex-col">
                            {formatProfit(profit)}
                            {propertyDetails[latestOffer?.propertyId]?.purchasePrice && (
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <BadgeDollarSign className="w-3 h-3 mr-1" />
                                Cost: ${formatPrice(propertyDetails[latestOffer.propertyId].purchasePrice)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {buyer?.source === 'VIP Buyers List' ? (
                          <Badge className="bg-[#D4A017] text-white">VIP</Badge>
                        ) : (
                          <span className="text-sm">{buyer?.source || 'Unknown'}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {buyer.createdAt ? (
                          format(new Date(buyer.createdAt), 'MMM d, yyyy')
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigateTo(`/admin/buyers/${buyer.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigateTo(`/admin/buyers/${buyer.id}/edit`)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigateTo(`/admin/buyers/${buyer.id}/offers`)}>
                              View Offers
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onViewActivity(buyer)}>
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                onSelectBuyer(buyer.id);
                                setTimeout(() => onDeleteSelected(), 100);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="justify-between py-4 border-t">
        <div className="text-sm text-gray-500">
          Showing {buyersToDisplay.length} of {allBuyers.length} buyers
        </div>
        <Button 
          variant="outline" 
          className="border-[#324c48] text-[#324c48]"
          onClick={() => navigateTo("/admin/buyers/create")}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Buyer
        </Button>
      </CardFooter>
    </>
  );
}