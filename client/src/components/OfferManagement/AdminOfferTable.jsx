// client/src/components/OfferManagement/AdminOfferTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import OfferActions from './OfferActions';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

// Helper function to get status badge color based on offerStatus
const getStatusBadgeClass = (status) => {
  switch(status) {
    case "ACCEPTED":
      return "bg-green-100 text-green-700 border-green-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "REJECTED":
      return "bg-red-100 text-red-700 border-red-200";
    case "COUNTERED":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "EXPIRED":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const AdminOfferTable = ({ offers, isLoading, onUpdateOffer }) => {
  const navigate = useNavigate();

  const handleViewProperty = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Offer Management</CardTitle>
          <CardDescription>Loading offers...</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Offer Management</CardTitle>
        <CardDescription>
          {offers.length} offer{offers.length !== 1 ? 's' : ''} found
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Offer Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <TableRow
                    key={offer.id}
                    className="hover:bg-gray-100 transition"
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>
                          {offer.property 
                            ? offer.property.title 
                            : `Property ID: ${offer.propertyId.substring(0, 6)}...`}
                        </span>
                        {offer.property && (
                          <span className="text-xs text-gray-500">
                            {offer.property.streetAddress}, {offer.property.city}
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 p-0 h-6 text-xs text-blue-600"
                          onClick={() => handleViewProperty(offer.propertyId)}
                        >
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>
                          {offer.buyer?.firstName} {offer.buyer?.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {offer.buyer?.email}
                        </span>
                        {offer.buyer?.phone && (
                          <span className="text-xs text-gray-500">
                            {offer.buyer.phone}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      ${parseFloat(offer.offeredPrice).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getStatusBadgeClass(offer.offerStatus || "PENDING")}
                      >
                        {offer.offerStatus || "PENDING"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(offer.timestamp), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <OfferActions 
                        offer={offer} 
                        onUpdateOffer={onUpdateOffer} 
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="6"
                    className="text-center text-gray-500 py-8"
                  >
                    No offers found matching the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminOfferTable;