// client/src/components/Dashboard/widgets/StatCards.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Home, BadgeDollarSign, FileText } from "lucide-react";

export default function StatCards({ isLoading }) {
  const stats = [
    {
      title: "Total Users",
      value: "216",
      change: "+15%",
      icon: <Users className="h-5 w-5 text-[#324c48]" />,
      trend: "up",
    },
    {
      title: "Active Buyers",
      value: "847",
      change: "+5%",
      icon: <Users className="h-5 w-5 text-[#3f4f24]" />,
      trend: "up",
    },
    {
      title: "Listed Properties",
      value: "153",
      change: "+12%",
      icon: <Home className="h-5 w-5 text-[#D4A017]" />,
      trend: "up",
    },
    {
      title: "Monthly Revenue",
      value: "$86,452",
      change: "+24%",
      icon: <BadgeDollarSign className="h-5 w-5 text-green-600" />,
      trend: "up",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center rounded-full w-10 h-10 bg-muted">
                {stat.icon}
              </div>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-6 w-[60px]" />
                </div>
              ) : (
                <div className="w-full flex flex-col items-end">
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </div>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <span
                      className={`ml-2 text-xs font-medium ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}