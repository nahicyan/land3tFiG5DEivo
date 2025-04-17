import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getAllDeals } from "@/utils/api";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PuffLoader } from "react-spinners";
import {
  Search,
  Plus,
  Filter,
  FileText,
  DollarSign,
  CreditCard,
} from "lucide-react";

export default function DealsList() {
  const navigate = useNavigate();
  
  // Filters state
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    Dealstatus: "all", // Changed from empty string to "all"
    search: "",
    sort: "startDate",
    order: "desc"
  });
  
  // Fetch deals with filters
  const { data, isLoading, isError, refetch } = useQuery(
    ["deals", filters],
    () => getAllDeals(filters),
    { keepPreviousData: true }
  );
  
  // Handle search input
  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 1 // Reset to first page on new search
    }));
  };
  
  // Handle status filter change
  const handleStatusChange = (value) => {
    setFilters(prev => ({
      ...prev,
      status: value === "all" ? "" : value, // Convert "all" back to empty string for API
      page: 1
    }));
  };
  
  // Handle sort change
  const handleSortChange = (value) => {
    const [sort, order] = value.split("-");
    setFilters(prev => ({
      ...prev,
      sort,
      order
    }));
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };
  
  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DEFAULTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return value ? `$${Number(value).toLocaleString()}` : "N/A";
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#3f4f24" />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">Error Loading Deals</h2>
        <p className="text-gray-500 mb-4">Failed to load deals data.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }
  
  const deals = data?.deals || [];
  const pagination = data?.pagination || {};
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-[#f0f5f4] border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Financing Deals</CardTitle>
          
          <Button
            className="bg-[#324c48] text-white"
            onClick={() => navigate("/admin/deals/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Deal
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Filters */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search deals by buyer or property..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-9 border-[#324c48]/30"
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={filters.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[160px] border-[#324c48]/30">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="DEFAULTED">Defaulted</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={`${filters.sort}-${filters.order}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px] border-[#324c48]/30">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Sort By" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startDate-desc">Newest First</SelectItem>
                <SelectItem value="startDate-asc">Oldest First</SelectItem>
                <SelectItem value="salePrice-desc">Price (High to Low)</SelectItem>
                <SelectItem value="salePrice-asc">Price (Low to High)</SelectItem>
                <SelectItem value="monthlyPayment-desc">Payment (High to Low)</SelectItem>
                <SelectItem value="monthlyPayment-asc">Payment (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Deals Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Sale Price</TableHead>
                <TableHead>Monthly Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.length > 0 ? (
                deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell>
                      <div className="font-medium">
                        {deal.buyer.firstName} {deal.buyer.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {deal.buyer.buyerType}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {deal.property.title || deal.property.streetAddress}
                      </div>
                      <div className="text-xs text-gray-500">
                        {deal.property.city}, {deal.property.state}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(deal.startDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(deal.salePrice)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(deal.monthlyPayment)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadge(deal.status)}
                      >
                        {deal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => navigate(`/admin/deals/${deal.id}`)}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => navigate(`/admin/deals/${deal.id}/payments`)}
                        >
                          <CreditCard className="h-4 w-4" />
                          <span className="sr-only">Payments</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => navigate(`/admin/deals/${deal.id}/summary`)}
                        >
                          <DollarSign className="h-4 w-4" />
                          <span className="sr-only">Financial Summary</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {filters.search || filters.status ? (
                      <div>
                        <p>No deals match your search criteria.</p>
                        <Button 
                          variant="link" 
                          onClick={() => setFilters({
                            page: 1,
                            limit: 10,
                            status: "",
                            search: "",
                            sort: "startDate",
                            order: "desc"
                          })}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p>No deals found. Get started by creating your first deal.</p>
                        <Button 
                          variant="link" 
                          onClick={() => navigate("/admin/deals/create")}
                        >
                          Create Deal
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {deals.length} of {pagination.totalCount} deals
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}