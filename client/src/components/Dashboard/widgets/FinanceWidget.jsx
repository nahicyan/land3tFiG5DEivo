// client/src/components/Dashboard/widgets/FinanceWidget.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, BarChart } from "@/components/ui/charts"; // You'll need to create these components

export default function FinanceWidget({ isLoading, dateRange, fullSize = false }) {
  // Sample data
  const revenueData = [
    { name: "Jan", value: 45000 },
    { name: "Feb", value: 52000 },
    { name: "Mar", value: 48000 },
    { name: "Apr", value: 61000 },
    { name: "May", value: 55000 },
    { name: "Jun", value: 67000 },
    { name: "Jul", value: 72000 },
    { name: "Aug", value: 85000 },
    { name: "Sep", value: 78000 },
    { name: "Oct", value: 86000 },
    { name: "Nov", value: 92000 },
    { name: "Dec", value: 98000 },
  ];

  const profitData = [
    { name: "Jan", value: 12000 },
    { name: "Feb", value: 18000 },
    { name: "Mar", value: 15000 },
    { name: "Apr", value: 23000 },
    { name: "May", value: 21000 },
    { name: "Jun", value: 28000 },
    { name: "Jul", value: 32000 },
    { name: "Aug", value: 38000 },
    { name: "Sep", value: 35000 },
    { name: "Oct", value: 42000 },
    { name: "Nov", value: 45000 },
    { name: "Dec", value: 52000 },
  ];

  return (
    <Card className={fullSize ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle>Financial Performance</CardTitle>
        <CardDescription>
          Track revenue, profits, and sales performance over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revenue">
          <TabsList className="mb-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="asset">Asset</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <LineChart 
                  data={revenueData} 
                  index="name"
                  categories={["value"]}
                  colors={["#3f4f24"]}
                  valueFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
                />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-[#f4f7ee] p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#3f4f24]">$748,000</p>
                  </div>
                  <div className="bg-[#f0f5f4] p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Growth</p>
                    <p className="text-2xl font-bold text-[#324c48]">+24.6%</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="profit">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <BarChart 
                  data={profitData} 
                  index="name"
                  categories={["value"]}
                  colors={["#D4A017"]}
                  valueFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
                />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-[#fcf7e8] p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Profit</p>
                    <p className="text-2xl font-bold text-[#D4A017]">$361,000</p>
                  </div>
                  <div className="bg-[#f4f7ee] p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Profit Margin</p>
                    <p className="text-2xl font-bold text-[#3f4f24]">48.2%</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sales">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <p className="text-center py-12">Sales data visualization will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}