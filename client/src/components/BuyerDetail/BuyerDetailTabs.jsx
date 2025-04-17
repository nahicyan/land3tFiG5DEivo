import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { getProperty } from "@/utils/api";
import { formatPrice } from "@/utils/format";
import { format, parseISO } from "date-fns";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Activity,
  TrendingUp,
  DollarSign,
  BadgeDollarSign,
  Calendar,
  Mail,
  Smartphone,
  Clock,
  Eye,
  FileText,
  Loader2,
  Search,
  MousePointer,
  Navigation,
  BarChart4,
  Info,
  MapPin,
} from "lucide-react";

import ActivityDataProvider from "@/services/ActivityDataProvider";

// Component to show engagement score
const EngagementScore = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center">
      <div className="font-bold text-lg mr-2">{score}</div>
      <div className="w-20 h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

// Activity Metrics card component
const ActivityMetric = ({ icon, title, value, className }) => (
  <div className="bg-white rounded-lg border p-4 flex items-center space-x-4">
    <div className={`p-2 rounded-full ${className}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

// Component to show properties viewed activity
const PropertyViews = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No property views recorded
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.slice(0, 3).map((view, idx) => (
        <div key={idx} className="border rounded-md p-3 bg-white">
          <div className="font-medium">{view.propertyTitle || 'Unknown Property'}</div>
          <div className="text-sm text-gray-500">{view.propertyAddress || 'Address not available'}</div>
          <div className="text-xs text-gray-400 mt-1">
            {view.timestamp ? format(new Date(view.timestamp), 'MMM d, yyyy h:mm a') : 'Unknown time'}
          </div>
        </div>
      ))}
      {data.length > 3 && (
        <div className="text-center text-sm text-[#324c48]">
          + {data.length - 3} more property views
        </div>
      )}
    </div>
  );
};

// Component to show search activity
const SearchActivity = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No search activity recorded
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.slice(0, 3).map((search, idx) => (
        <div key={idx} className="border rounded-md p-3 bg-white">
          <div className="flex justify-between">
            <div className="font-medium">"{search.query || 'Unknown search'}"</div>
            {search.searchType && (
              <Badge variant="outline" className={`
                ${search.searchType === 'global' ? 'bg-blue-50 text-blue-600' : ''}
                ${search.searchType === 'area' ? 'bg-green-50 text-green-600' : ''}
                ${search.searchType === 'standard' ? 'bg-purple-50 text-purple-600' : ''}
              `}>
                {search.searchType}
              </Badge>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {search.timestamp ? format(new Date(search.timestamp), 'MMM d, yyyy h:mm a') : 'Unknown time'}
          </div>
        </div>
      ))}
      {data.length > 3 && (
        <div className="text-center text-sm text-[#324c48]">
          + {data.length - 3} more searches
        </div>
      )}
    </div>
  );
};

// Component to show session history
const SessionHistory = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No session data recorded
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.slice(0, 3).map((session, idx) => {
        const loginTime = session.loginTime ? new Date(session.loginTime) : null;
        
        return (
          <div key={idx} className="border rounded-md p-3 bg-white">
            <div className="flex justify-between">
              <div className="font-medium">{session.device || 'Unknown device'}</div>
              <div className="text-sm text-gray-500">
                {loginTime ? format(loginTime, 'MMM d, yyyy') : 'Unknown date'}
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {session.ipAddress || 'Unknown IP'}
            </div>
          </div>
        );
      })}
      {data.length > 3 && (
        <div className="text-center text-sm text-[#324c48]">
          + {data.length - 3} more sessions
        </div>
      )}
    </div>
  );
};

// Main BuyerDetailTabs component
const BuyerDetailTabs = ({ buyer }) => {
  const [activeTab, setActiveTab] = useState("activity");
  const [propertyDetails, setPropertyDetails] = useState({});
  const [activityData, setActivityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activityError, setActivityError] = useState(null);

  // Function to get property details for offers
  const fetchPropertyDetailsForOffers = async () => {
    if (!buyer?.offers || !Array.isArray(buyer.offers) || buyer.offers.length === 0) {
      return;
    }

    const details = {};
    for (const offer of buyer.offers) {
      try {
        const property = await getProperty(offer.propertyId);
        if (property) {
          details[offer.propertyId] = property;
        }
      } catch (error) {
        console.error(`Error fetching property ${offer.propertyId}:`, error);
      }
    }
    setPropertyDetails(details);
  };

  // Fetch property details for offers
  useEffect(() => {
    if (buyer?.id) {
      fetchPropertyDetailsForOffers();
    }
  }, [buyer]);

  // Fetch activity data
  useEffect(() => {
    const fetchActivityData = async () => {
      if (!buyer?.id) return;
      
      setIsLoading(true);
      try {
        const data = await ActivityDataProvider.getActivitySummary(buyer.id);
        setActivityData(data);
        setActivityError(null);
      } catch (err) {
        console.error("Error fetching activity data:", err);
        setActivityError("Failed to load activity data. The activity tracking system may not be available.");
      } finally {
        setIsLoading(false);
      }
    };

    if (buyer?.id) {
      fetchActivityData();
    }
  }, [buyer]);

  // Process transactions from buyer offers
  const transactions = useMemo(() => {
    if (!buyer?.offers || !Array.isArray(buyer.offers)) {
      return [];
    }

    return buyer.offers.map(offer => {
      const property = propertyDetails[offer.propertyId] || {};
      
      // Calculate profit if we have purchase price data
      let profit = null;
      let profitMargin = 0;
      
      if (property.purchasePrice && offer.offeredPrice) {
        profit = offer.offeredPrice - property.purchasePrice;
        profitMargin = property.purchasePrice > 0 
          ? (profit / property.purchasePrice) * 100
          : 0;
      }

      // Determine status based on offer data - in a real app, this would come from the backend
      const status = (() => {
        const daysSinceOffer = Math.floor(
          (new Date() - new Date(offer.timestamp)) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceOffer < 3) return "Pending";
        if (offer.offeredPrice >= (property.askingPrice || 0)) return "Accepted";
        if (property.minPrice && offer.offeredPrice < property.minPrice) return "Rejected";
        
        // For older offers with price between min and asking, randomly assign status
        const statuses = ["Accepted", "Rejected", "Countered", "Closed"];
        return statuses[Math.floor(Math.random() * statuses.length)];
      })();

      return {
        id: offer.id,
        date: new Date(offer.timestamp),
        property,
        offeredPrice: offer.offeredPrice,
        profit,
        profitMargin,
        status
      };
    }).sort((a, b) => b.date - a.date);
  }, [buyer, propertyDetails]);

  // Helper function to get status badge color
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "Accepted": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Countered": return "bg-blue-100 text-blue-800";
      case "Closed": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Helper to format profit with color and sign
  const formatProfit = (profit) => {
    if (profit === null || profit === undefined) return "-";
    
    const formattedValue = formatPrice(Math.abs(profit));
    const isPositive = profit > 0;
    
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 w-4 mr-1 transform rotate-180" />}
        {isPositive ? '+' : '-'}${formattedValue}
      </span>
    );
  };

  // Activity metrics calculations
  const activityMetrics = useMemo(() => {
    if (!activityData) {
      return {
        propertyViews: 0,
        totalSearches: 0,
        clickEvents: 0,
        pageVisits: 0,
        sessionCount: 0,
        lastActive: null,
        engagementScore: 0
      };
    }

    return {
      propertyViews: activityData.propertyViews?.length || 0,
      totalSearches: activityData.searchHistory?.length || 0,
      clickEvents: activityData.clickEvents?.length || 0,
      pageVisits: activityData.pageVisits?.length || 0,
      sessionCount: activityData.sessionHistory?.length || 0,
      lastActive: activityData.lastActive,
      engagementScore: activityData.engagementScore || 0
    };
  }, [activityData]);

  // Transaction metrics
  const transactionMetrics = useMemo(() => {
    if (!transactions || !transactions.length) {
      return {
        totalOffers: 0,
        totalProfit: 0,
        averageProfit: 0,
        successRate: 0,
        highestProfit: 0,
        averageMargin: 0
      };
    }

    const totalOffers = transactions.length;
    const totalProfit = transactions.reduce((sum, t) => sum + (t.profit || 0), 0);
    const averageProfit = totalOffers > 0 ? totalProfit / totalOffers : 0;
    const successRate = transactions.filter(t => 
      t.status === "Accepted" || t.status === "Closed"
    ).length / totalOffers * 100;
    
    const highestProfit = Math.max(...transactions.map(t => t.profit || 0));
    const averageMargin = transactions.reduce((sum, t) => sum + (t.profitMargin || 0), 0) / totalOffers;

    return {
      totalOffers,
      totalProfit,
      averageProfit,
      successRate,
      highestProfit,
      averageMargin
    };
  }, [transactions]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#324c48] mb-4" />
          <p className="text-[#324c48]">Loading buyer activity data...</p>
        </CardContent>
      </Card>
    );
  }

  if (activityError && !activityData) {
    return (
      <Card>
        <CardContent className="py-6">
          <Alert variant="destructive" className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {activityError}
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="offers">
            <TabsList>
              <TabsTrigger value="offers">Offers & Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="offers" className="mt-4">
              <TransactionsView 
                transactions={transactions}
                metrics={transactionMetrics}
                getStatusBadgeClass={getStatusBadgeClass}
                formatProfit={formatProfit}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="activity" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="activity" className="flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Activity
        </TabsTrigger>
        <TabsTrigger value="transactions" className="flex items-center">
          <BadgeDollarSign className="h-4 w-4 mr-2" />
          Transactions
        </TabsTrigger>
        <TabsTrigger value="engagement" className="flex items-center">
          <BarChart4 className="h-4 w-4 mr-2" />
          Engagement
        </TabsTrigger>
      </TabsList>
      
      {/* Activity Overview Tab */}
      <TabsContent value="activity">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>
                  Summary of buyer interactions and behaviors
                </CardDescription>
              </div>
              <Badge className="px-3 py-1 flex items-center bg-[#324c48]">
                <Clock className="h-4 w-4 mr-1" />
                {activityMetrics.lastActive ? (
                  <span>Last active: {format(new Date(activityMetrics.lastActive), 'MMM d, yyyy')}</span>
                ) : (
                  <span>No activity recorded</span>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Activity Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <ActivityMetric 
                icon={<Eye className="h-5 w-5 text-blue-500" />}
                title="Properties Viewed"
                value={activityMetrics.propertyViews}
                className="bg-blue-50"
              />
              <ActivityMetric 
                icon={<Search className="h-5 w-5 text-orange-500" />}
                title="Total Searches"
                value={activityMetrics.totalSearches}
                className="bg-orange-50"
              />
              <ActivityMetric 
                icon={<Smartphone className="h-5 w-5 text-purple-500" />}
                title="Total Sessions"
                value={activityMetrics.sessionCount}
                className="bg-purple-50"
              />
            </div>

            {/* Activity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Views */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-500" />
                    Property Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PropertyViews data={activityData?.propertyViews || []} />
                </CardContent>
              </Card>

              {/* Search Activity */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Search className="h-4 w-4 mr-2 text-orange-500" />
                    Search Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SearchActivity data={activityData?.searchHistory || []} />
                </CardContent>
              </Card>

              {/* Page Interaction */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <MousePointer className="h-4 w-4 mr-2 text-green-500" />
                    Page Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3 bg-white">
                      <div className="text-sm font-medium">Click Events</div>
                      <div className="text-2xl font-bold">{activityMetrics.clickEvents}</div>
                    </div>
                    <div className="border rounded-md p-3 bg-white">
                      <div className="text-sm font-medium">Page Views</div>
                      <div className="text-2xl font-bold">{activityMetrics.pageVisits}</div>
                    </div>
                  </div>
                  {(activityMetrics.clickEvents > 0 || activityMetrics.pageVisits > 0) && (
                    <div className="mt-3 text-sm text-center">
                      <Button variant="outline" size="sm" className="w-full">
                        <Navigation className="h-3.5 w-3.5 mr-1" />
                        View Navigation Details
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Session Data */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Smartphone className="h-4 w-4 mr-2 text-purple-500" />
                    Session Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SessionHistory data={activityData?.sessionHistory || []} />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Transactions Tab */}
      <TabsContent value="transactions">
        <TransactionsView 
          transactions={transactions}
          metrics={transactionMetrics}
          getStatusBadgeClass={getStatusBadgeClass}
          formatProfit={formatProfit}
        />
      </TabsContent>

      {/* Engagement Tab */}
      <TabsContent value="engagement">
        <Card>
          <CardHeader>
            <CardTitle>Buyer Engagement Analysis</CardTitle>
            <CardDescription>
              Detailed metrics about the buyer's engagement level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 border rounded-lg">
              <div>
                <h3 className="text-lg font-semibold">Engagement Score</h3>
                <p className="text-sm text-gray-500">
                  Based on activity level, recency, and interactions
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold">{activityMetrics.engagementScore}</div>
                <div className="w-32 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      activityMetrics.engagementScore >= 80 ? 'bg-green-500' :
                      activityMetrics.engagementScore >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${activityMetrics.engagementScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-[#324c48]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Activity Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div>Property Views</div>
                        <div>{activityMetrics.propertyViews}</div>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-400"
                          style={{ width: `${Math.min(100, activityMetrics.propertyViews * 5)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div>Searches</div>
                        <div>{activityMetrics.totalSearches}</div>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-400"
                          style={{ width: `${Math.min(100, activityMetrics.totalSearches * 5)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div>Offers</div>
                        <div>{transactionMetrics.totalOffers}</div>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-400"
                          style={{ width: `${Math.min(100, transactionMetrics.totalOffers * 20)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[#324c48]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Engagement Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[150px] bg-gray-50 rounded-md border border-dashed">
                    <div className="text-center text-gray-500">
                      <BarChart4 className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm">Timeline visualization coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[#324c48]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Conversion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Views to offers rate:</div>
                      <div className="font-medium">
                        {activityMetrics.propertyViews > 0 
                          ? `${Math.round(transactionMetrics.totalOffers / activityMetrics.propertyViews * 100)}%` 
                          : 'N/A'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Offer success rate:</div>
                      <div className="font-medium">
                        {transactionMetrics.totalOffers > 0 
                          ? `${Math.round(transactionMetrics.successRate)}%` 
                          : 'N/A'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Last activity:</div>
                      <div className="font-medium">
                        {activityMetrics.lastActive 
                          ? format(new Date(activityMetrics.lastActive), 'MMM d, yyyy') 
                          : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

// Separate component for transactions to keep the file organized
const TransactionsView = ({ transactions, metrics, getStatusBadgeClass, formatProfit }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          Complete history of offers and transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Transaction Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Offers</CardDescription>
              <CardTitle className="text-2xl">{metrics.totalOffers}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Success Rate</CardDescription>
              <CardTitle className="text-2xl">{Math.round(metrics.successRate)}%</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Profit</CardDescription>
              <CardTitle className={`text-2xl ${metrics.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${formatPrice(Math.abs(metrics.totalProfit))}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Profit per Offer</CardDescription>
              <CardTitle className={`text-2xl ${metrics.averageProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${formatPrice(Math.abs(metrics.averageProfit))}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Transactions Table */}
        {transactions.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Offered Price</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {format(transaction.date, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {transaction.property.title || transaction.property.streetAddress || `Property ID: ${transaction.property.id?.substring(0, 8) || 'Unknown'}`}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        {transaction.property.city && transaction.property.state ? (
                          <>
                            <MapPin className="h-3 w-3 mr-1" />
                            {transaction.property.city}, {transaction.property.state}
                          </>
                        ) : 'Location unknown'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getStatusBadgeClass(transaction.status)}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        {formatPrice(transaction.offeredPrice)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatProfit(transaction.profit)}
                    </TableCell>
                    <TableCell>
                      <span className={transaction.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {transaction.profitMargin.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="py-24 text-center">
            <BadgeDollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
            <p className="text-gray-500">
              This buyer hasn't made any offers yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuyerDetailTabs;