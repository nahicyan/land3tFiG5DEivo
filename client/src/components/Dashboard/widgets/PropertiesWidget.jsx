// client/src/components/Dashboard/widgets/PropertiesWidget.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Home, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/format";

export default function PropertiesWidget({ isLoading, fullSize = false }) {
  const navigate = useNavigate();

  // Sample properties data
  const properties = [
    {
      id: "prop-1",
      title: "Modern Ranch Land",
      address: "123 Country Road, Austin, TX",
      price: 350000,
      status: "Active",
      views: 248,
      offers: 3,
      image: "https://shinyhomes.net/wp-content/uploads/2025/02/land1.jpg"
    },
    {
      id: "prop-2",
      title: "Lakefront Property",
      address: "456 Lake View, Houston, TX",
      price: 495000,
      status: "Active",
      views: 312,
      offers: 5,
      image: "https://shinyhomes.net/wp-content/uploads/2025/02/land2.jpg"
    },
    {
      id: "prop-3",
      title: "Development Land",
      address: "789 Commercial Ave, Dallas, TX",
      price: 825000,
      status: "Pending",
      views: 186,
      offers: 2,
      image: "https://shinyhomes.net/wp-content/uploads/2025/02/land3.jpg"
    },
    {
      id: "prop-4",
      title: "Mountain View Acreage",
      address: "101 Mountain Road, San Antonio, TX",
      price: 275000,
      status: "Active",
      views: 203,
      offers: 1,
      image: "https://shinyhomes.net/wp-content/uploads/2025/02/land4.jpg"
    }
  ];

  const getStatusClass = (status) => {
    const classes = {
      Active: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Sold: "bg-blue-100 text-blue-800",
      Expired: "bg-red-100 text-red-800"
    };
    return classes[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className={fullSize ? "col-span-full" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Properties</CardTitle>
          <CardDescription>
            Latest property listings and performance metrics
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/properties")}
        >
          <Eye className="mr-2 h-4 w-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          Array(4).fill(0).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3 mb-4 pb-4 border-b">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="flex-1">
                <Skeleton className="h-4 w-[150px] mb-2" />
                <Skeleton className="h-3 w-[200px] mb-2" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
              <Skeleton className="h-8 w-[80px]" />
            </div>
          ))
        ) : (
          <div className="space-y-3">
            {properties.map((property) => (
              <div 
                key={property.id} 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={() => navigate(`/properties/${property.id}`)}
              >
                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none">{property.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{property.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusClass(property.status)}>
                      {property.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {property.views} views
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {property.offers} offers
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${formatPrice(property.price)}</p>
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
          onClick={() => navigate("/admin/add-property")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/properties")}
        >
          <Home className="mr-2 h-4 w-4" />
          All Properties
        </Button>
      </CardFooter>
    </Card>
  );
}