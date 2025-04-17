"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ImageUploadPreview from "@/components/ImageUploadPreview/ImageUploadPreview";

export default function MediaTags({ formData, handleChange, uploadedImages, setUploadedImages }) {
  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Media & Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Left Tag */}
        <div className="mb-4">
          <Label htmlFor="ltag" className="text-gray-700 font-semibold">
            Left Tag
          </Label>
          <Input
            id="ltag"
            type="text"
            name="ltag"
            value={formData.ltag}
            onChange={handleChange}
            placeholder="Enter left tag"
            className="border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]"
          />
        </div>

        {/* Right Tag */}
        <div className="mb-4">
          <Label htmlFor="rtag" className="text-gray-700 font-semibold">
            Right Tag
          </Label>
          <Input
            id="rtag"
            type="text"
            name="rtag"
            value={formData.rtag}
            onChange={handleChange}
            placeholder="Enter right tag"
            className="border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]"
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label className="text-gray-700 font-semibold">Upload Images</Label>
          <ImageUploadPreview
            existingImages={[]}               // No pre-existing images when adding a property.
            newImages={uploadedImages}
            onExistingChange={() => {}}        // No-op since there are no existing images.
            onNewChange={setUploadedImages}    // Use parent's state updater
          />
        </div>
      </CardContent>
    </Card>
  );
}
