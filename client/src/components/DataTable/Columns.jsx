"use client";

import React from "react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";

const serverURL = import.meta.env.VITE_SERVER_URL;

export const columns = [
  {
    accessorKey: "imageUrls",
    header: "Image",
    cell: ({ row }) => {
      const property = row.original;
      let images = [];
      if (property.imageUrls) {
        images = Array.isArray(property.imageUrls)
          ? property.imageUrls
          : JSON.parse(property.imageUrls);
      }
      const firstImage = images.length ? `${serverURL}/${images[0]}` : "/default-image.jpg";
      return (
        <img
          src={firstImage}
          alt={property.title || "Property"}
          className="w-16 h-16 object-cover rounded-md"
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const property = row.original;
      return property.title ? (
        <span dangerouslySetInnerHTML={{ __html: property.title }} />
      ) : (
        "Untitled Property"
      );
    },
  },
  {
    id: "address",
    header: "Address",
    cell: ({ row }) => {
      const p = row.original;
      return `${p.streetAddress}, ${p.city}, ${p.state} ${p.zip}`;
    },
  },
  {
    accessorKey: "ownerId",
    header: "Owner ID",
    cell: ({ row }) => row.original.ownerId || "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const p = row.original;
      const status = p.status || "N/A";
      const bgColor =
        p.status === "Active" ? "bg-green-100" : p.status === "Expired" ? "bg-red-100" : "bg-gray-100";
      const textColor =
        p.status === "Active" ? "text-green-700" : p.status === "Expired" ? "text-red-700" : "text-gray-700";
      return <span className={`px-2 py-1 text-xs rounded-full ${bgColor} ${textColor}`}>{status}</span>;
    },
  },
  {
    accessorKey: "askingPrice",
    header: "Price",
    cell: ({ row }) => `$${formatPrice(row.original.askingPrice || 0)}`,
  },
  {
    accessorKey: "views",
    header: "Views",
    cell: ({ row }) => row.original.views,
  },
  {
    accessorKey: "maxOffer",
    header: "Max Offer",
    cell: ({ row }) => `$${formatPrice(row.original.maxOffer || 0)}`,
  },
  {
    accessorKey: "numOffers",
    header: "Offers",
    cell: ({ row }) => row.original.numOffers,
  },
  {
    accessorKey: "createdAt",
    header: "Created On",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const p = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => (window.location.href = `/properties/${p.id}/offers`)}>
              Offer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.href = `/edit-property/${p.id}`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Delete", p.id)} className="text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
