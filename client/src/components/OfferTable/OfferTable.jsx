"use client";

import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

const fetchOffers = async (propertyId) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/api/buyer/offers/property/${propertyId}`
  );
  return data;
};

export default function OfferTable() {
  const { propertyId } = useParams(); // Get property ID from URL
  const { data, isLoading, isError } = useQuery(
    ["offers", propertyId],
    () => fetchOffers(propertyId),
    {
      enabled: !!propertyId,
    }
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Offers on Property</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert className="bg-red-100 border-red-500 text-red-700">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load offers. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Offers on Property</CardTitle>
        <p className="text-gray-500 text-sm">
          Total Offers: {data.totalOffers}
        </p>
      </CardHeader>
      <CardContent>
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>Buyer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Offer Price</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.offers.length > 0 ? (
              data.offers.map((offer) => (
                <TableRow
                  key={offer.id}
                  className="hover:bg-gray-100 transition"
                >
                  <TableCell>
                    {offer.buyer.firstName} {offer.buyer.lastName}
                  </TableCell>
                  <TableCell>{offer.buyer.email}</TableCell>
                  <TableCell>{offer.buyer.phone || "N/A"}</TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    {typeof offer.offeredPrice === "number"
                      ? `$${offer.offeredPrice.toLocaleString("en-US")}`
                      : "N/A"}
                  </TableCell>

                  <TableCell>
                    {format(new Date(offer.timestamp), "PPpp")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan="5"
                  className="text-center text-gray-500 py-4"
                >
                  No offers yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
