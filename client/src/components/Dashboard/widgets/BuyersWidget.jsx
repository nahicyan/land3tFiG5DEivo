// client/src/components/Dashboard/widgets/BuyersWidget.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, TrendingUp, Eye, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BuyersWidget({ isLoading, fullSize = false }) {
  const navigate = useNavigate();

  // Sample buyers data
  const buyers = [
    {
      id: "buyer-1",
      name: "John Smith",
      email: "john@example.com",
      type: "CashBuyer",
      activity: 85,
      lastOffer: "$485,000",
      profit: "+$35,000"
    },
    {
      id: "buyer-2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      type: "Investor",
      activity: 92,
      lastOffer: "$650,000",
      profit: "+$42,000"
    },
    {
      id: "buyer-3",
      name: "Michael Brown",
      email: "michael@example.com",
      type: "Developer",
      activity: 76,
      lastOffer: "$1,200,000",
      profit: "+$80,000"
    },
    {
      id: "buyer-4",
      name: "Jessica Chen",
      email: "jessica@example.com",
      type: "Realtor",
      activity: 88,
      lastOffer: "$520,000",
      profit: "+$28,000"
    }
  ];

  const getBuyerTypeClass = (type) => {
    const classes = {
      CashBuyer: "bg-green-100 text-green-800",
      Investor: "bg-blue-100 text-blue-800",
      Developer: "bg-purple-100 text-purple-800",
      Realtor: "bg-orange-100 text-orange-800",
      Builder: "bg-yellow-100 text-yellow-800",
      Wholesaler: "bg-indigo-100 text-indigo-800"
    };
    return classes[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className={fullSize ? "col-span-full" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Top Buyers</CardTitle>
          <CardDescription>
            Most active buyers with highest profit potential
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/admin/buyers")}
        >
          <Eye className="mr-2 h-4 w-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          Array(4).fill(0).map((_, idx) => (
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
            {buyers.map((buyer) => (
              <div 
                key={buyer.id} 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#324c48] text-white">
                    {buyer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none">{buyer.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{buyer.email}</p>
                  <div className="flex items-center mt-1">
                    <Badge className={`mr-2 ${getBuyerTypeClass(buyer.type)}`}>
                      {buyer.type}
                    </Badge>
                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          buyer.activity >= 80 ? 'bg-green-500' :
                          buyer.activity >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${buyer.activity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{buyer.lastOffer}</p>
                  <p className="text-xs text-green-600 flex items-center justify-end">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {buyer.profit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/admin/buyers/create")}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Buyer
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/buyers")}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email All
        </Button>
      </CardFooter>
    </Card>
  );
}