// client/src/components/Dashboard/widgets/VisitorsWidget.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, AreaChart } from "@/components/ui/charts"; // You'll need to create these components

export default function VisitorsWidget({ isLoading, dateRange }) {
  // Sample data
  const visitorData = [
    { date: "Apr 1", visitors: 1240 },
    { date: "Apr 2", visitors: 1350 },
    { date: "Apr 3", visitors: 1480 },
    { date: "Apr 4", visitors: 1390 },
    { date: "Apr 5", visitors: 1590 },
    { date: "Apr 6", visitors: 1720 },
    { date: "Apr 7", visitors: 1630 },
    { date: "Apr 8", visitors: 1820 },
    { date: "Apr 9", visitors: 1960 },
    { date: "Apr 10", visitors: 2100 },
    { date: "Apr 11", visitors: 2240 },
    { date: "Apr 12", visitors: 2380 },
    { date: "Apr 13", visitors: 2520 },
    { date: "Apr 14", visitors: 2650 },
  ];

  const conversionData = [
    { date: "Apr 1", rate: 2.1 },
    { date: "Apr 2", rate: 2.3 },
    { date: "Apr 3", rate: 2.5 },
    { date: "Apr 4", rate: 2.2 },
    { date: "Apr 5", rate: 2.6 },
    { date: "Apr 6", rate: 2.8 },
    { date: "Apr 7", rate: 3.1 },
    { date: "Apr 8", rate: 3.0 },
    { date: "Apr 9", rate: 3.2 },
    { date: "Apr 10", rate: 3.5 },
    { date: "Apr 11", rate: 3.8 },
    { date: "Apr 12", rate: 3.6 },
    { date: "Apr 13", rate: 3.9 },
    { date: "Apr 14", rate: 4.2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Traffic</CardTitle>
        <CardDescription>
          Monitor visitor analytics and conversion rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visitors">
          <TabsList className="mb-4">
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visitors">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <AreaChart 
                  data={visitorData} 
                  index="date"
                  categories={["visitors"]}
                  colors={["#324c48"]}
                  valueFormatter={(value) => value.toLocaleString()}
                />
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="bg-[#f0f5f4] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Total Visitors</p>
                    <p className="text-xl font-bold text-[#324c48]">27,842</p>
                  </div>
                  <div className="bg-[#f4f7ee] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Avg. Daily</p>
                    <p className="text-xl font-bold text-[#3f4f24]">1,986</p>
                  </div>
                  <div className="bg-[#fcf7e8] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Growth</p>
                    <p className="text-xl font-bold text-[#D4A017]">+18.3%</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="conversion">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <LineChart 
                  data={conversionData} 
                  index="date"
                  categories={["rate"]}
                  colors={["#D4A017"]}
                  valueFormatter={(value) => `${value.toFixed(1)}%`}
                />
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="bg-[#fcf7e8] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Avg. Conversion</p>
                    <p className="text-xl font-bold text-[#D4A017]">3.2%</p>
                  </div>
                  <div className="bg-[#f0f5f4] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Leads Generated</p>
                    <p className="text-xl font-bold text-[#324c48]">892</p>
                  </div>
                  <div className="bg-[#f4f7ee] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Improvement</p>
                    <p className="text-xl font-bold text-[#3f4f24]">+0.8%</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sources">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <p className="text-center py-12">Traffic sources visualization will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}