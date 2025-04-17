// client/src/components/Dashboard/widgets/EmailReportWidget.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, LineChart } from "@/components/ui/charts";
import { format, subDays } from "date-fns";
import { 
  Mail, 
  Send, 
  Eye, 
  MousePointer, 
  Clock,
  BookOpen
} from "lucide-react";

export default function EmailReportWidget({ isLoading }) {
  // Sample email campaign data
  const campaigns = [
    {
      id: "email-1",
      name: "April Featured Properties",
      subject: "New Exclusive Land Listings Just Released",
      date: subDays(new Date(), 5),
      stats: {
        sent: 1248,
        delivered: 1220,
        opened: 732,
        clicked: 367,
        unsubscribed: 12
      }
    },
    {
      id: "email-2",
      name: "March Newsletter",
      subject: "Latest Market Updates and Special Financing Options",
      date: subDays(new Date(), 16),
      stats: {
        sent: 1350,
        delivered: 1322,
        opened: 848,
        clicked: 425,
        unsubscribed: 8
      }
    },
    {
      id: "email-3",
      name: "Special Offer Announcement",
      subject: "Limited Time: Exclusive Discount on Premium Properties",
      date: subDays(new Date(), 23),
      stats: {
        sent: 965,
        delivered: 944,
        opened: 682,
        clicked: 402,
        unsubscribed: 5
      }
    }
  ];

  // Generate email performance data for charting
  const currentMonth = new Date().getMonth();
  const months = Array(6).fill(0).map((_, i) => {
    const month = new Date();
    month.setMonth(currentMonth - 5 + i);
    return format(month, 'MMM');
  });

  const emailPerformanceData = months.map(month => ({
    month,
    "Open Rate": Math.round(40 + Math.random() * 30),
    "Click Rate": Math.round(15 + Math.random() * 20)
  }));

  const emailVolumeData = months.map(month => ({
    month,
    "Sent": Math.round(800 + Math.random() * 800),
    "Opened": Math.round(500 + Math.random() * 400),
    "Clicked": Math.round(200 + Math.random() * 300)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Marketing</CardTitle>
        <CardDescription>
          Email campaign performance and analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="campaigns">
          <TabsList className="mb-4">
            <TabsTrigger value="campaigns">Recent Campaigns</TabsTrigger>
            <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
            <TabsTrigger value="volume">Email Volume</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns">
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, idx) => (
                  <div key={idx} className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="space-y-3">
                    <div>
                      <h4 className="font-medium">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">"{campaign.subject}"</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Sent {format(campaign.date, "MMM d, yyyy")}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#f0f5f4] p-2 rounded-lg text-center min-w-[70px]">
                          <div className="text-lg font-bold text-[#324c48]">{campaign.stats.sent}</div>
                          <div className="text-xs text-gray-500 flex items-center justify-center">
                            <Send className="h-3 w-3 mr-1" />
                            Sent
                          </div>
                        </div>
                        
                        <div className="bg-[#f4f7ee] p-2 rounded-lg text-center min-w-[70px]">
                          <div className="text-lg font-bold text-[#3f4f24]">
                            {Math.round((campaign.stats.opened / campaign.stats.delivered) * 100)}%
                          </div>
                          <div className="text-xs text-gray-500 flex items-center justify-center">
                            <Eye className="h-3 w-3 mr-1" />
                            Opens
                          </div>
                        </div>
                        
                        <div className="bg-[#fcf7e8] p-2 rounded-lg text-center min-w-[70px]">
                          <div className="text-lg font-bold text-[#D4A017]">
                            {Math.round((campaign.stats.clicked / campaign.stats.opened) * 100)}%
                          </div>
                          <div className="text-xs text-gray-500 flex items-center justify-center">
                            <MousePointer className="h-3 w-3 mr-1" />
                            Clicks
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-[#324c48]"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                    </div>
                    
                    {/* Progress bars for engagement */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Delivered</span>
                        <span>{Math.round((campaign.stats.delivered / campaign.stats.sent) * 100)}%</span>
                      </div>
                      <Progress value={(campaign.stats.delivered / campaign.stats.sent) * 100} className="h-1" />
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Opened</span>
                        <span>{Math.round((campaign.stats.opened / campaign.stats.delivered) * 100)}%</span>
                      </div>
                      <Progress value={(campaign.stats.opened / campaign.stats.delivered) * 100} className="h-1" />
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Clicked</span>
                        <span>{Math.round((campaign.stats.clicked / campaign.stats.opened) * 100)}%</span>
                      </div>
                      <Progress value={(campaign.stats.clicked / campaign.stats.opened) * 100} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="metrics">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <LineChart 
                  data={emailPerformanceData} 
                  index="month"
                  categories={["Open Rate", "Click Rate"]}
                  colors={["#3f4f24", "#D4A017"]}
                  valueFormatter={(value) => `${value}%`}
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-[#f4f7ee] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Average Open Rate</p>
                    <p className="text-xl font-bold text-[#3f4f24]">54.8%</p>
                    <p className="text-xs text-green-600">+3.2% vs previous period</p>
                  </div>
                  <div className="bg-[#fcf7e8] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Average Click Rate</p>
                    <p className="text-xl font-bold text-[#D4A017]">26.4%</p>
                    <p className="text-xs text-green-600">+1.8% vs previous period</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="volume">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <BarChart 
                  data={emailVolumeData} 
                  index="month"
                  categories={["Sent", "Opened", "Clicked"]}
                  colors={["#324c48", "#3f4f24", "#D4A017"]}
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-[#f0f5f4] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Total Sent</p>
                    <p className="text-xl font-bold text-[#324c48]">7,562</p>
                  </div>
                  <div className="bg-[#f4f7ee] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Total Opened</p>
                    <p className="text-xl font-bold text-[#3f4f24]">4,153</p>
                  </div>
                  <div className="bg-[#fcf7e8] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Total Clicked</p>
                    <p className="text-xl font-bold text-[#D4A017]">2,107</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          className="w-full"
          onClick={() => window.open("/admin/email-campaigns", "_blank")}
        >
          <Mail className="mr-2 h-4 w-4" />
          Create New Campaign
        </Button>
      </CardFooter>
    </Card>
  );
}