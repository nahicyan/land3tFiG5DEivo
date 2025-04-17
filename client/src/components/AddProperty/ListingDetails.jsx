"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";

export default function ListingDetails({
  formData,
  handleTitleChange,
  handleDescriptionChange,
  handleNotesChange,
}) {
  return (
    <Card className="border border-gray-200 shadow-sm w-full">
      <CardHeader className="px-2 py-1">
        <CardTitle className="text-lg font-bold text-gray-800">
          Listing Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 space-y-4">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Enter property title..."
            className="border border-gray-300 w-full"
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Enter property description..."
            className="border border-gray-300 w-full"
          />
        </div>

        {/* Notes Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Notes
          </label>
          <RichTextEditor
            value={formData.notes}
            onChange={handleNotesChange}
            placeholder="Enter any additional notes..."
            className="border border-gray-300 w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
