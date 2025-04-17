// client/src/components/Dashboard/DashboardPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker"; // You'll need to create this component
import { Download, Filter, RefreshCw, Plus } from "lucide-react";

// Import dashboard widgets
import DealsWidget from "./widgets/DealsWidget";
import StatCards from "./widgets/StatCards";
import FinanceWidget from "./widgets/FinanceWidget";
import ActivityWidget from "./widgets/ActivityWidget";
// import OffersWidget from "./widgets/OffersWidget";
import PropertiesWidget from "./widgets/PropertiesWidget";
import BuyersWidget from "./widgets/BuyersWidget";
import BuyerListsWidget from "./widgets/BuyerListsWidget";
import EmailReportWidget from "./widgets/EmailReportWidget";
import QualificationsWidget from "./widgets/QualificationsWidget";
import VisitorsWidget from "./widgets/VisitorsWidget";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() });

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#324c48] tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Landivo admin dashboard.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <CalendarDateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <Button variant="outline" size="sm" className="ml-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="buyers">Buyers</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <StatCards isLoading={isLoading} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FinanceWidget isLoading={isLoading} dateRange={dateRange} />
            <VisitorsWidget isLoading={isLoading} dateRange={dateRange} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <DealsWidget isLoading={isLoading} />
            <ActivityWidget isLoading={isLoading} />
            {/* <OffersWidget isLoading={isLoading} /> */}
            <PropertiesWidget isLoading={isLoading} />
          </div>
        </TabsContent>
        
        <TabsContent value="finance" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FinanceWidget isLoading={isLoading} dateRange={dateRange} fullSize />
            <QualificationsWidget isLoading={isLoading} />
          </div>
        </TabsContent>
        
        <TabsContent value="buyers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BuyersWidget isLoading={isLoading} fullSize />
            <BuyerListsWidget isLoading={isLoading} />
          </div>
          <EmailReportWidget isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="properties" className="space-y-4">
          <PropertiesWidget isLoading={isLoading} fullSize />
        </TabsContent>
      </Tabs>
    </div>
  );
}