import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getBuyerById } from "@/utils/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  ArrowLeft,
  Mail,
  Phone,
  Tag,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import BuyerDetailTabs from "./BuyerDetailTabs";

export default function BuyerDetail() {
  const { buyerId } = useParams();
  const navigate = useNavigate();
  const [deletingBuyer, setDeletingBuyer] = useState(false);

  // Fetch buyer data
  const { data: buyer, isLoading, isError, error } = useQuery(
    ["buyer", buyerId],
    () => getBuyerById(buyerId),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  // Generate avatar initials from name
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "??";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, "");
    
    // Format according to length
    if (digitsOnly.length === 10) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    } else if (digitsOnly.length === 11 && digitsOnly.charAt(0) === "1") {
      return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
    }
    
    // Return original if can't format
    return phone;
  };

  // Get buyer type badge class
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

  // Handle buyer deletion
  const handleDeleteBuyer = async () => {
    if (confirm("Are you sure you want to delete this buyer? This action cannot be undone.")) {
      setDeletingBuyer(true);
      
      try {
        // In a real app, this would be an API call to delete the buyer
        // await deleteBuyer(buyerId);
        alert("Buyer deleted successfully");
        navigate("/admin/buyers");
      } catch (error) {
        console.error("Error deleting buyer:", error);
        alert("Failed to delete buyer. Please try again.");
        setDeletingBuyer(false);
      }
    }
  };

  if (isError) {
    return (
      <div className="container py-10">
        <div className="mb-4">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/admin/buyers")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Buyers
          </Button>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Buyer</AlertTitle>
          <AlertDescription>
            {error?.message || "There was a problem loading this buyer's information."}
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={() => navigate("/admin/buyers")}
          className="bg-[#324c48] hover:bg-[#283e3a]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Buyers List
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/admin/buyers")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Buyers
      </Button>

      {/* Buyer Profile Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Buyer Avatar and Basic Info */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center pb-2">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Skeleton className="h-20 w-20 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <Avatar className="h-20 w-20 mx-auto mb-4 text-xl">
                  <AvatarFallback className="bg-[#324c48] text-white">
                    {getInitials(buyer?.firstName, buyer?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">
                  {buyer?.firstName} {buyer?.lastName}
                </CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-2 justify-center mt-1">
                    <Badge 
                      variant="outline" 
                      className={getBuyerTypeClass(buyer?.buyerType)}
                    >
                      {buyer?.buyerType || 'Unknown Type'}
                    </Badge>
                    {buyer?.source === 'VIP Buyers List' && (
                      <Badge className="bg-[#D4A017] text-white">VIP</Badge>
                    )}
                  </div>
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <a href={`mailto:${buyer?.email}`} className="text-blue-600 hover:underline">
                    {buyer?.email}
                  </a>
                </div>
                
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <a href={`tel:${buyer?.phone}`} className="hover:underline">
                    {formatPhoneNumber(buyer?.phone)}
                  </a>
                </div>
                
                <div className="flex items-start text-sm">
                  <Tag className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Source: </span>
                    {buyer?.source || 'Unknown'}
                  </div>
                </div>
                
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Preferred Areas: </span>
                    {buyer?.preferredAreas && Array.isArray(buyer.preferredAreas) && buyer.preferredAreas.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {buyer.preferredAreas.map((area, idx) => (
                          <Badge key={idx} variant="outline" className="bg-[#f0f5f4] text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">None specified</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <span className="font-medium">Added on: </span>
                    {buyer?.createdAt 
                      ? new Date(buyer.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) 
                      : 'Unknown date'}
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full bg-[#324c48] hover:bg-[#283e3a]"
              onClick={() => navigate(`/admin/buyers/${buyerId}/edit`)}
              disabled={isLoading}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Buyer
            </Button>
            
            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleDeleteBuyer}
              disabled={isLoading || deletingBuyer}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deletingBuyer ? "Deleting..." : "Delete Buyer"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Tabs for buyer details and activity */}
        <div className="md:col-span-2 space-y-6">
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <BuyerDetailTabs buyer={buyer} />
          )}
        </div>
      </div>
    </div>
  );
}