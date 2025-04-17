// client/src/components/Dashboard/widgets/DealsWidget.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getAllDeals } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Home, Plus, TrendingUp, TrendingDown, CalendarDays, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function DealsWidget({ isLoading, fullSize = false }) {
  const navigate = useNavigate();
  
  // Fetch latest deals (limit to 5)
  const { data, isError } = useQuery(
    "dashboardDeals",
    () => getAllDeals({ page: 1, limit: 5, sort: "startDate", order: "desc" }),
    { 
      enabled: !isLoading,
      refetchOnWindowFocus: false
    }
  );
  
  // Format currency
  const formatCurrency = (value) => {
    return value ? `$${Number(value).toLocaleString()}` : "N/A";
  };
  
  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DEFAULTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  // Use an empty array if deals are not available yet
  const deals = data?.deals || [];
  
  return (
    <Card className={fullSize ? "col-span-full" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Deals</CardTitle>
          <CardDescription>
            Latest financing deals and their status
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/admin/deals")}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loading placeholders
          Array(5).fill(0).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3 mb-4 pb-4 border-b">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-[120px] mb-2" />
                <Skeleton className="h-3 w-[180px]" />
              </div>
              <Skeleton className="h-8 w-[80px]" />
            </div>
          ))
        ) : (
          <div className="space-y-1">
            {deals.length > 0 ? (
              deals.map((deal) => (
                <div 
                  key={deal.id} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/deals/${deal.id}`)}
                >
                  <div className="h-10 w-10 rounded-full bg-[#324c48] text-white flex items-center justify-center font-medium">
                    {deal.buyer?.firstName?.[0] || ''}
                    {deal.buyer?.lastName?.[0] || ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium leading-none">
                        {deal.buyer?.firstName} {deal.buyer?.lastName}
                      </p>
                      <Badge
                        variant="outline"
                        className={getStatusBadge(deal.status)}
                      >
                        {deal.status}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1">
                      <CalendarDays className="h-3 w-3 mr-1 text-gray-500" />
                      <p className="text-xs text-muted-foreground truncate">
                        {format(new Date(deal.startDate), "MMM d, yyyy")}
                      </p>
                      <DollarSign className="h-3 w-3 ml-2 mr-1 text-gray-500" />
                      <p className="text-xs text-muted-foreground truncate">
                        {formatCurrency(deal.monthlyPayment)}/mo
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(deal.salePrice)}
                    </p>
                    <p className={`text-xs flex items-center justify-end ${
                      deal.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {deal.profitLoss >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {formatCurrency(Math.abs(deal.profitLoss || 0))}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-2">No deals found</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/admin/deals/create")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Deal
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/admin/deals/create")}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      </CardFooter>
    </Card>
  );
}