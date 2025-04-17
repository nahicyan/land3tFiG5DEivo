// client/src/components/Dashboard/widgets/OffersWidget.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatPrice } from "@/utils/format";
import { format } from "date-fns";
import { 
  DollarSign, 
  Check,
  X,
  Clock,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OffersWidget({ isLoading }) {
  const navigate = useNavigate();

  // Sample offers data
  const offers = [
    {
      id: "offer-1",
      buyer: { name: "John Smith", initials: "JS" },
      property: { id: "prop-1", title: "Modern Ranch Land" },
      amount: 345000,
      askingPrice: 350000,
      status: "pending",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: "offer-2",
      buyer: { name: "Sarah Johnson", initials: "SJ" },
      property: { id: "prop-2", title: "Lakefront Property" },
      amount: 500000,
      askingPrice: 495000,
      status: "accepted",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: "offer-3",
      buyer: { name: "Michael Brown", initials: "MB" },
      property: { id: "prop-1", title: "Modern Ranch Land" },
      amount: 330000,
      askingPrice: 350000,
      status: "rejected",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: "offer-4",
      buyer: { name: "Jessica Chen", initials: "JC" },
      property: { id: "prop-3", title: "Development Land" },
      amount: 815000,
      askingPrice: 825000,
      status: "countered",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      id: "offer-5",
      buyer: { name: "David Wilson", initials: "DW" },
      property: { id: "prop-4", title: "Mountain View Acreage" },
      amount: 280000,
      askingPrice: 275000,
      status: "accepted",
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    }
  ];

  const getStatusIcon = (status) => {
    const iconMap = {
      pending: <Clock className="h-4 w-4 text-yellow-500" />,
      accepted: <Check className="h-4 w-4 text-green-500" />,
      rejected: <X className="h-4 w-4 text-red-500" />,
      countered: <RefreshCw className="h-4 w-4 text-blue-500" />
    };
    return iconMap[status] || <Clock className="h-4 w-4 text-gray-500" />;
  };

  const getStatusClass = (status) => {
    const classMap = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      countered: "bg-blue-100 text-blue-800"
    };
    return classMap[status] || "bg-gray-100 text-gray-800";
  };

  // Calculate total and average offers
  const totalOffers = offers.length;
  const totalAmount = offers.reduce((sum, offer) => sum + offer.amount, 0);
  const averageOffer = totalOffers > 0 ? totalAmount / totalOffers : 0;
  const acceptanceRate = totalOffers > 0 
    ? (offers.filter(o => o.status === "accepted").length / totalOffers) * 100 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Offers</CardTitle>
        <CardDescription>
          Track incoming offers and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, idx) => (
              <div key={idx} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-[#f4f7ee] p-2 rounded-lg">
                <p className="text-xs text-gray-500">Total Offers</p>
                <p className="text-lg font-bold text-[#3f4f24]">{totalOffers}</p>
              </div>
              <div className="bg-[#f0f5f4] p-2 rounded-lg">
                <p className="text-xs text-gray-500">Avg. Offer</p>
                <p className="text-lg font-bold text-[#324c48]">${formatPrice(averageOffer)}</p>
              </div>
              <div className="bg-[#fcf7e8] p-2 rounded-lg">
                <p className="text-xs text-gray-500">Acceptance Rate</p>
                <p className="text-lg font-bold text-[#D4A017]">{acceptanceRate.toFixed(1)}%</p>
              </div>
            </div>
            
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {offers.map((offer) => (
                  <div 
                    key={offer.id} 
                    className="flex items-center gap-3 p-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#324c48] text-white">
                        {offer.buyer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium truncate">{offer.buyer.name}</p>
                        <Badge className={`ml-2 ${getStatusClass(offer.status)}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(offer.status)}
                            <span className="capitalize">{offer.status}</span>
                          </span>
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        on {offer.property.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(offer.date, "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium flex items-center justify-end">
                        <DollarSign className="h-3 w-3 inline-block mr-1" />
                        {formatPrice(offer.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {offer.amount >= offer.askingPrice ? "Above" : "Below"} asking
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => navigate("/properties")}
        >
          View All Offers
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}