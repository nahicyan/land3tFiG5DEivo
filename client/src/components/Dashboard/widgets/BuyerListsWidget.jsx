// client/src/components/Dashboard/widgets/BuyerListsWidget.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Mail, 
  MapPin, 
  Tag, 
  ArrowRight,
  UserPlus
} from "lucide-react";

export default function BuyerListsWidget({ isLoading }) {
  const navigate = useNavigate();

  // Sample buyer lists data
  const buyerLists = [
    {
      id: "list-1",
      name: "VIP Cash Buyers",
      description: "High-priority cash buyers",
      memberCount: 48,
      emailStats: { sent: 126, opened: 98, clicked: 73 },
      criteria: {
        areas: ["DFW", "Austin"],
        buyerTypes: ["CashBuyer"],
        isVIP: true
      },
      lastEmailDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: "list-2",
      name: "Houston Investors",
      description: "Investors interested in Houston area",
      memberCount: 72,
      emailStats: { sent: 215, opened: 156, clicked: 102 },
      criteria: {
        areas: ["Houston"],
        buyerTypes: ["Investor", "Developer"],
        isVIP: false
      },
      lastEmailDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },
    {
      id: "list-3",
      name: "Real Estate Professionals",
      description: "Realtors and brokers network",
      memberCount: 93,
      emailStats: { sent: 187, opened: 143, clicked: 95 },
      criteria: {
        areas: ["DFW", "Austin", "Houston", "San Antonio"],
        buyerTypes: ["Realtor"],
        isVIP: false
      },
      lastEmailDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
    },
    {
      id: "list-4",
      name: "Developers Network",
      description: "Land developers and builders",
      memberCount: 31,
      emailStats: { sent: 64, opened: 48, clicked: 29 },
      criteria: {
        areas: ["Austin", "San Antonio"],
        buyerTypes: ["Developer", "Builder"],
        isVIP: false
      },
      lastEmailDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buyer Lists</CardTitle>
        <CardDescription>
          Segmented buyer audiences for targeted marketing
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {buyerLists.map((list) => (
              <div 
                key={list.id} 
                className="p-3 border rounded-lg hover:border-[#324c48] transition-colors cursor-pointer"
                onClick={() => navigate("/admin/buyer-lists")}
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-medium flex items-center">
                      {list.name}
                      {list.criteria.isVIP && (
                        <Badge className="ml-2 bg-[#D4A017] text-white">VIP</Badge>
                      )}
                    </h4>
                    <p className="text-xs text-muted-foreground">{list.description}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="flex items-center bg-[#f0f5f4]"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {list.memberCount}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2 mb-3">
                  {list.criteria.areas.map((area, idx) => (
                    <Badge key={idx} variant="outline" className="bg-[#f4f7ee] text-xs">
                      <MapPin className="h-2 w-2 mr-1" />
                      {area}
                    </Badge>
                  ))}
                  {list.criteria.buyerTypes.map((type, idx) => (
                    <Badge key={idx} variant="outline" className="bg-[#fcf7e8] text-xs">
                      <Tag className="h-2 w-2 mr-1" />
                      {type}
                    </Badge>
                  ))}
                </div>
                
                {/* Email engagement stats */}
                <div className="text-xs text-gray-600 mb-1">
                  Email engagement ({Math.round((list.emailStats.opened / list.emailStats.sent) * 100)}% open rate)
                </div>
                <Progress 
                  value={(list.emailStats.opened / list.emailStats.sent) * 100} 
                  className="h-1 bg-gray-100" 
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/buyer-lists")}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Create List
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/buyer-lists")}
        >
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </Button>
      </CardFooter>
    </Card>
  );
}