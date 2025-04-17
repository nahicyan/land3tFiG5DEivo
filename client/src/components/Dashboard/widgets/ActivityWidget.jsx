// client/src/components/Dashboard/widgets/ActivityWidget.jsx
import React, { useState, useEffect } from "react";
import { format, formatDistance } from "date-fns";
import ActivityDataProvider from "@/services/ActivityDataProvider";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Eye,
  MousePointer,
  Navigation,
  Search,
  DollarSign,
  Clock,
  Calendar,
  RefreshCw,
  Filter,
  ChevronRight,
  Loader2,
  User,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/utils/format";
import { getAllBuyers } from "@/utils/api";

/**
 * ActivityWidget component
 * Displays recent buyer activity for dashboard
 */
const ActivityWidget = () => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [buyers, setBuyers] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activityCounts, setActivityCounts] = useState({
    property_view: 0,
    search: 0,
    offer: 0,
    page_visit: 0,
    click: 0,
    total: 0
  });

  // Fetch buyers and activity data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all buyers first to get VIP buyers with auth0Id
        const allBuyers = await getAllBuyers();
        
        // Create lookup table for buyers
        const buyersMap = {};
        allBuyers.forEach(buyer => {
          buyersMap[buyer.id] = buyer;
        });
        setBuyers(buyersMap);
        
        // Filter VIP buyers (those with auth0Id)
        const vipBuyers = allBuyers.filter(buyer => buyer.auth0Id);
        
        // Fetch activity for all VIP buyers (limit to top 5 for performance)
        const vipBuyersToFetch = vipBuyers.slice(0, 5);
        
        let allActivities = [];
        const counts = {
          property_view: 0,
          search: 0,
          offer: 0,
          page_visit: 0,
          click: 0,
          total: 0
        };
        
        // For each VIP buyer, fetch their activity and combine it
        for (const buyer of vipBuyersToFetch) {
          try {
            const summary = await ActivityDataProvider.getActivitySummary(buyer.id);
            
            // Combine all activities with buyer information
            const propertyViews = (summary.propertyViews || []).map(item => ({ 
              type: 'property_view', 
              data: item, 
              timestamp: item.timestamp || new Date().toISOString(),
              buyerId: buyer.id 
            }));
            counts.property_view += propertyViews.length;
            
            const searches = (summary.searchHistory || []).map(item => ({ 
              type: 'search', 
              data: item, 
              timestamp: item.timestamp || new Date().toISOString(),
              buyerId: buyer.id 
            }));
            counts.search += searches.length;
            
            const pageVisits = (summary.pageVisits || []).map(item => ({ 
              type: 'page_visit', 
              data: item, 
              timestamp: item.timestamp || new Date().toISOString(),
              buyerId: buyer.id 
            }));
            counts.page_visit += pageVisits.length;
            
            const offers = (summary.offerHistory || []).map(item => ({ 
              type: 'offer', 
              data: item, 
              timestamp: item.timestamp || new Date().toISOString(),
              buyerId: buyer.id 
            }));
            counts.offer += offers.length;
            
            const clicks = (summary.clickEvents || []).map(item => ({ 
              type: 'click', 
              data: item, 
              timestamp: item.timestamp || new Date().toISOString(),
              buyerId: buyer.id 
            }));
            counts.click += clicks.length;
            
            const buyerActivities = [
              ...propertyViews,
              ...searches,
              ...pageVisits,
              ...offers,
              ...clicks
            ];
            
            allActivities = [...allActivities, ...buyerActivities];
          } catch (err) {
            console.warn(`Error fetching activity for buyer ${buyer.id}:`, err);
            // Continue with other buyers even if one fails
          }
        }
        
        counts.total = allActivities.length;
        setActivityCounts(counts);
        
        // Sort by timestamp (newest first) and limit to 5 total per type
        // First sort all activities by timestamp
        allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Get top 5 for each type to ensure we have content for tabs
        const topPropertyViews = allActivities
          .filter(act => act.type === 'property_view')
          .slice(0, 5);
          
        const topSearches = allActivities
          .filter(act => act.type === 'search')
          .slice(0, 5);
          
        const topOffers = allActivities
          .filter(act => act.type === 'offer')
          .slice(0, 5);
          
        const topPageVisits = allActivities
          .filter(act => act.type === 'page_visit')
          .slice(0, 5);
          
        const topClicks = allActivities
          .filter(act => act.type === 'click')
          .slice(0, 5);
        
        // Combine all for the "All" tab, but limit to 5 total
        const sortedActivities = allActivities
          .slice(0, 5);
        
        // Create a lookup map for each activity type
        const activitiesByType = {
          'all': sortedActivities,
          'property_view': topPropertyViews,
          'search': topSearches,
          'offer': topOffers,
          'page_visit': topPageVisits,
          'click': topClicks
        };
        
        console.log(`Fetched activities with counts:`, counts);
        console.log('Activities by type:', {
          all: activitiesByType.all.length,
          property_view: activitiesByType.property_view.length,
          search: activitiesByType.search.length,
          offer: activitiesByType.offer.length
        });
        
        setActivities(allActivities);
        setError(null);
      } catch (err) {
        console.error("Error fetching activity data:", err);
        setError("Failed to load activity data");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    
    fetchData();
  }, [refreshing]);

  // Function to refresh data
  const handleRefresh = () => {
    setRefreshing(true);
  };

  // Function to get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'property_view':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'search':
        return <Search className="h-4 w-4 text-orange-500" />;
      case 'page_visit':
        return <Navigation className="h-4 w-4 text-green-500" />;
      case 'offer':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'click':
        return <MousePointer className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Function to get activity description
  const getActivityDescription = (activity) => {
    const { type, data } = activity;
    
    switch (type) {
      case 'property_view':
        return `Viewed ${data.propertyTitle || 'a property'}`;
      case 'search':
        return `Searched for "${data.query || 'properties'}"`;
      case 'page_visit':
        return `Visited ${data.url || data.path || 'a page'}`;
      case 'offer':
        return `Made an offer of ${formatPrice(data.amount || data.offeredPrice || 0)}`;
      case 'click':
        return `Clicked on ${data.elementType || data.element || 'an element'}`;
      default:
        return 'Performed an action';
    }
  };

  // Function to get secondary text for activity
  const getActivitySecondaryText = (activity) => {
    const { type, data } = activity;
    
    switch (type) {
      case 'property_view':
        return data.propertyAddress || '';
      case 'search':
        return `${data.resultsCount || 0} results`;
      case 'page_visit':
        return data.duration ? `Spent ${Math.floor(data.duration / 60)}m ${data.duration % 60}s` : '';
      case 'offer':
        return data.propertyTitle || data.propertyAddress || '';
      case 'click':
        return data.page || '';
      default:
        return '';
    }
  };

  // Function to get badge color for activity type
  const getActivityBadgeClass = (type) => {
    switch (type) {
      case 'property_view':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'search':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'page_visit':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'offer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'click':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Filter activities based on active tab
  const filteredActivities = activeTab === 'all' 
    ? activities.slice(0, 5) // Limit to 5 for All tab 
    : activities
        .filter(activity => activity.type === activeTab)
        .slice(0, 5); // Limit to 5 for other tabs

  // Loading skeleton
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Buyer Activity</CardTitle>
          <CardDescription>Loading activity feed...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-2 p-2 border rounded-md">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Buyer Activity</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            size="sm"
            disabled={refreshing}
          >
            {refreshing ? 
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 
              <RefreshCw className="h-4 w-4 mr-2" />
            } 
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 bg-[#f0f5f4] border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Recent Buyer Activity</CardTitle>
            <CardDescription>Latest interactions from VIP buyers</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-fit">
              <TabsList className="bg-white">
                <TabsTrigger value="all" className="text-xs">
                  All
                  {activityCounts.total > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-[10px] flex items-center justify-center">
                      {activityCounts.total}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="property_view" className="text-xs">
                  Views
                  {activityCounts.property_view > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-[10px] flex items-center justify-center">
                      {activityCounts.property_view}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="search" className="text-xs">
                  Searches
                  {activityCounts.search > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-[10px] flex items-center justify-center">
                      {activityCounts.search}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="offer" className="text-xs">
                  Offers
                  {activityCounts.offer > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-[10px] flex items-center justify-center">
                      {activityCounts.offer}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 py-3">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            {activeTab === 'all' ? (
              <>
                <p className="mb-2">No recent activity found</p>
                <p className="text-xs">Activity tracking is available for VIP buyers</p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <AlertCircle className="h-6 w-6 text-gray-400 mb-2" />
                <p className="mb-1">No {activeTab.replace('_', ' ')} activity</p>
                <p className="text-xs">
                  {activeTab === 'property_view' && "No recent property views by VIP buyers"}
                  {activeTab === 'search' && "No recent searches by VIP buyers"}
                  {activeTab === 'offer' && "No recent offers by VIP buyers"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity, index) => {
              const buyer = buyers[activity.buyerId] || {};
              const secondaryText = getActivitySecondaryText(activity);
              const initials = buyer.firstName && buyer.lastName 
                ? `${buyer.firstName[0]}${buyer.lastName[0]}`
                : '??';
                
              return (
                <div 
                  key={`${activity.type}-${index}`} 
                  className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors border"
                >
                  <Avatar className="h-8 w-8 bg-[#324c48] text-white">
                    <div className="flex items-center justify-center text-xs font-medium">
                      {initials}
                    </div>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-[#324c48]">
                        {getActivityDescription(activity)}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getActivityBadgeClass(activity.type)}`}
                      >
                        {activity.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    {secondaryText && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {secondaryText}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-xs font-medium">
                        {buyer.firstName} {buyer.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp ? 
                          formatDistance(new Date(activity.timestamp), new Date(), { addSuffix: true }) : 
                          'Unknown time'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <Button 
              variant="ghost" 
              className="w-full mt-2 text-[#324c48]"
              onClick={() => window.location.href = "/admin/buyers"}
            >
              View Buyer Management
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityWidget;