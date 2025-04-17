// src/pages/Profile/BuyerOffersTable.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getBuyerOffers, getProperty } from '@/utils/api';
import { useVipBuyer } from '@/utils/VipBuyerContext';
import { formatCurrency, getStatusColors, formatDate } from './profileUtils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuyerOffersTable = () => {
    const { vipBuyerData } = useVipBuyer();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [propertyDetails, setPropertyDetails] = useState({});
    const navigate = useNavigate();

    // Fetch the buyer's offers
    useEffect(() => {
        const fetchOffers = async () => {
            if (!vipBuyerData?.id) return;

            try {
                setLoading(true);

                // Log the buyer ID for debugging
                console.log("Fetching offers with buyer ID:", vipBuyerData.id);

                // Validate the buyer ID is a string
                if (typeof vipBuyerData.id !== 'string') {
                    console.error('Invalid buyer ID format:', vipBuyerData.id);

                    // If ID is invalid, try to use the email as a fallback
                    if (vipBuyerData.email) {
                        console.log("Using email as fallback:", vipBuyerData.email);
                        const data = await getBuyerOffers({ email: vipBuyerData.email });
                        setOffers(data.offers || []);

                        // Fetch property details for each offer
                        // ... rest of the property fetching code
                    } else {
                        setError("Invalid buyer ID format and no email available");
                    }
                } else {
                    // Use the ID directly if it's valid
                    const data = await getBuyerOffers(vipBuyerData.id); // Pass just the ID string
                    setOffers(data.offers || []);

                    // Fetch property details for each offer
                    const propertyDetailsMap = {};
                    for (const offer of data.offers || []) {
                        try {
                            const property = await getProperty(offer.propertyId);
                            propertyDetailsMap[offer.propertyId] = property;
                        } catch (error) {
                            console.error(`Error fetching property ${offer.propertyId}:`, error);
                            propertyDetailsMap[offer.propertyId] = { title: "Unknown Property" };
                        }
                    }

                    setPropertyDetails(propertyDetailsMap);
                }
            } catch (error) {
                console.error("Error fetching offers:", error);
                setError("Failed to load your offers. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [vipBuyerData]);

    // We're now using the shared formatCurrency helper from profileUtils.js

    // Handle click to view property details
    const handleViewProperty = (propertyId) => {
        navigate(`/properties/${propertyId}`);
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Offers</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full mb-2" />
                    <Skeleton className="h-10 w-full mb-2" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Offers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-red-500">{error}</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Offers</CardTitle>
            </CardHeader>
            <CardContent>
                {offers.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">You haven't made any offers yet.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead>Offer Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offers.map((offer) => (
                                <TableRow key={offer.id}>
                                    <TableCell>
                                        {propertyDetails[offer.propertyId]?.streetAddress ? (
                                            <span>
                                                {propertyDetails[offer.propertyId].streetAddress}
                                                {propertyDetails[offer.propertyId]?.city && (
                                                    <span>, {propertyDetails[offer.propertyId].city}</span>
                                                )}
                                            </span>
                                        ) : "N/A"}
                                    </TableCell>
                                    <TableCell className="font-medium text-green-600">
                                        {formatCurrency(offer.offeredPrice)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(offer.timestamp)}
                                    </TableCell>
                                    <TableCell>
                                        {(() => {
                                            const status = offer.status || "Pending";
                                            const colors = getStatusColors(status);
                                            return (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                                                    {status}
                                                </span>
                                            );
                                        })()}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewProperty(offer.propertyId)}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default BuyerOffersTable;