import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { getBuyerById, getPropertyOffers } from "@/utils/api";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export default function BuyerOffers() {
  const { buyerId } = useParams();
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(null);
  const [offers, setOffers] = useState([]);
  const [propertiesMap, setPropertiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuyerAndOffers = async () => {
      try {
        setLoading(true);
        // Fetch buyer data
        const buyerData = await getBuyerById(buyerId);
        setBuyer(buyerData);
        
        // Create a map to store property details for each offer
        const propertyDetails = {};
        
        // For each property this buyer has made an offer on, fetch the property details
        if (buyerData.offers && buyerData.offers.length > 0) {
          // Get unique property IDs
          const uniquePropertyIds = [...new Set(buyerData.offers.map(offer => offer.propertyId))];
          
          // Fetch property details for each property
          for (const propertyId of uniquePropertyIds) {
            try {
              const propertyData = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/residency/${propertyId}`);
              if (propertyData.ok) {
                const property = await propertyData.json();
                propertyDetails[propertyId] = property;
              } else {
                propertyDetails[propertyId] = { title: "Property Not Found", streetAddress: "N/A" };
              }
            } catch (err) {
              console.error(`Error fetching property ${propertyId}:`, err);
              propertyDetails[propertyId] = { title: "Error Loading Property", streetAddress: "N/A" };
            }
          }
        }
        
        setPropertiesMap(propertyDetails);
        setOffers(buyerData.offers || []);
      } catch (err) {
        console.error("Error fetching buyer data:", err);
        setError("Failed to load buyer offers");
      } finally {
        setLoading(false);
      }
    };

    if (buyerId) {
      fetchBuyerAndOffers();
    }
  }, [buyerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#3f4f24" />
      </div>
    );
  }

  if (error || !buyer) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center text-red-800">
              <h2 className="text-xl font-semibold mb-2">Error Loading Offers</h2>
              <p>{error || "Buyer not found"}</p>
              <Button 
                onClick={() => navigate("/admin/buyers")}
                variant="outline" 
                className="mt-4"
              >
                Back to Buyers List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => navigate(`/admin/buyers/${buyerId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Buyer Profile
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#324c48]">
              Offers by {buyer.firstName} {buyer.lastName}
            </h1>
            <p className="text-gray-600">
              View all offers made by this buyer
            </p>
          </div>
          
          <Badge 
            className={`
              mt-2 sm:mt-0 px-4 py-2 text-sm self-start sm:self-auto
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
        </div>
      </div>

      <Card className="border-[#324c48]/20 shadow-md">
        <CardHeader className="bg-[#f0f5f4] border-b">
          <CardTitle>Offer History</CardTitle>
          <CardDescription>
            {offers.length} {offers.length === 1 ? 'offer' : 'offers'} made by this buyer
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          {offers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Offered Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => {
                  const property = propertiesMap[offer.propertyId] || {};
                  return (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">
                        {format(new Date(offer.timestamp), 'MMM d, yyyy')}
                        <div className="text-xs text-gray-500">
                          {format(new Date(offer.timestamp), 'h:mm a')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {property?.title || "Property Not Found"}
                      </TableCell>
                      <TableCell>
                        {property?.streetAddress ? (
                          <span>
                            {property.streetAddress}
                            {property.city && property.state ? (
                              <span className="text-xs text-gray-500 block">
                                {property.city}, {property.state} {property.zip}
                              </span>
                            ) : null}
                          </span>
                        ) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${offer.offeredPrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/properties/${offer.propertyId}`)}
                        >
                          View Property
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-gray-500">
              This buyer has not made any offers yet.
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-gray-50 border-t py-4 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(`/admin/buyers/${buyerId}`)}
          >
            Back to Buyer Profile
          </Button>
          
          <Button
            onClick={() => navigate("/admin/buyers")}
            variant="outline"
          >
            Buyers List
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}