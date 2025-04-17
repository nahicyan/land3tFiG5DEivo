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
import { Badge } from "@/components/ui/badge";

export const columns = [
  {
    accessorKey: "image",
    header: "Avatar",
    cell: ({ row }) => {
      const user = row.original;
      const imageSrc = user.image || "/default-avatar.jpg";
      return (
        <img
          src={imageSrc}
          alt={user.name || "User"}
          className="w-10 h-10 object-cover rounded-full"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <span>{row.original.name || "No Name"}</span>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const bgColor = role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800";
      
      return (
        <Badge className={`px-2 py-1 ${bgColor}`}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "ownedCount",
    header: "Properties",
    cell: ({ row }) => {
      const count = row.original.ownedResidencies?.length || 0;
      return count;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => window.location.href = `/admin/users/${user.id}`}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `/admin/users/${user.id}/edit`}>
              Edit
            </DropdownMenuItem>
            {/* Only show delete option for non-admin users */}
            {user.role !== "ADMIN" && (
              <DropdownMenuItem onClick={() => console.log("Delete", user.id)} className="text-red-600">
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];