// client/src/components/PropertyManagement/PropertyStats.jsx
import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Home,
  Clock,
  ShoppingBag,
  MapPin,
  DollarSign,
  Star,
  CheckCircle2,
} from "lucide-react";

export default function PropertyStats({ stats }) {
  // Format currency
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "$0";
    return `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Properties */}
      <Card className="bg-[#f4f7ee]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Total Properties</span>
            <Home className="h-5 w-5 text-[#3f4f24]" />
          </div>
          <div className="text-3xl font-bold text-[#3f4f24]">{stats.totalProperties}</div>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Updated today</span>
          </div>
        </CardContent>
      </Card>

      {/* Properties by Status */}
      <Card className="bg-[#f0f5f4]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Available</span>
            <CheckCircle2 className="h-5 w-5 text-[#324c48]" />
          </div>
          <div className="text-3xl font-bold text-[#324c48]">{stats.availableProperties}</div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-blue-600">
              <span className="font-medium">Pending: {stats.pendingProperties}</span>
            </div>
            <div className="text-xs text-green-600">
              <span className="font-medium">Sold: {stats.soldProperties}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Price */}
      <Card className="bg-[#fcf7e8]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Average Price</span>
            <DollarSign className="h-5 w-5 text-[#D4A017]" />
          </div>
          <div className="text-3xl font-bold text-[#D4A017]">
            {formatCurrency(stats.averagePrice)}
          </div>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <span>Based on all listed properties</span>
          </div>
        </CardContent>
      </Card>

      {/* Featured Properties */}
      <Card className="bg-[#fcf7e8]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Featured Properties</span>
            <Star className="h-5 w-5 text-[#D4A017]" />
          </div>
          <div className="text-3xl font-bold text-[#D4A017]">
            {stats.featuredProperties}
          </div>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <span>{((stats.featuredProperties / stats.totalProperties) * 100 || 0).toFixed(1)}% of total</span>
          </div>
        </CardContent>
      </Card>

      {/* By Area Stats (Extended) */}
      {Object.keys(stats.byArea).length > 0 && (
        <Card className="sm:col-span-2 lg:col-span-4 bg-white">
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">Properties by Area</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.byArea).map(([area, count]) => (
                <div key={area} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-[#324c48] mb-2" />
                  <div className="text-xl font-bold text-[#324c48]">{count}</div>
                  <div className="text-sm text-gray-500">{area}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}