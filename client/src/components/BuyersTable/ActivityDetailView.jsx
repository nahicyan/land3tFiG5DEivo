// Updated ActivityDetailView.jsx
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MousePointer,
  Navigation,
  Search,
  DollarSign,
  Mail,
  Smartphone,
  Clock,
  ArrowLeft,
  Loader2
} from "lucide-react";
import ActivityDataProvider from "@/services/ActivityDataProvider";

/**
 * Activity Detail View component
 * Displays detailed buyer activity data
 */
const ActivityDetailView = ({ buyer, activityData: initialData = null }) => {
  const [viewMode, setViewMode] = useState("summary");
  const [detailActivity, setDetailActivity] = useState(null);
  const [activityData, setActivityData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch activity data if not provided
  useEffect(() => {
    const fetchActivityData = async () => {
      if (!buyer || !buyer.id) return;
      
      try {
        setLoading(true);
        const data = await ActivityDataProvider.getActivitySummary(buyer.id);
        setActivityData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching activity data:", err);
        setError("Failed to load activity data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!initialData && buyer) {
      fetchActivityData();
    }
  }, [buyer, initialData]);

  // Fetch detailed activity data when a specific view is selected
  const handleViewDetail = async (activityType) => {
    if (!buyer || !buyer.id) return;
    
    try {
      setDetailLoading(true);
      
      // Fetch the specific activity type
      const detailData = await ActivityDataProvider.getDetailedActivity(
        buyer.id, 
        activityType.type,
        { limit: 100 } // Increased from any previous limit to ensure we get all records
      );
      
      setDetailActivity({
        ...activityType,
        data: detailData
      });
      
      setViewMode("detail");
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${activityType.type} data:`, err);
      setError(`Failed to load ${activityType.type} data. Please try again.`);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBackToSummary = () => {
    setDetailActivity(null);
    setViewMode("summary");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#324c48] mb-4" />
        <p className="text-[#324c48]">Loading activity data...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg text-red-800">
        <p className="mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="border-red-300 text-red-600 hover:bg-red-100"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!activityData) {
    return (
      <div className="text-center p-8">
        <p>No activity data available for this buyer.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Buyer Activity Dashboard</CardTitle>
            <CardDescription>
              Detailed tracking of user engagement and behavior
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#324c48] px-3 py-1 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last active: {format(new Date(activityData.lastActive), 'MMM d, yyyy')}</span>
            </Badge>
            <div className="flex items-center">
              <div className="font-bold text-lg mr-2">{activityData.engagementScore}</div>
              <div className="w-16 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    activityData.engagementScore >= 80 ? 'bg-green-500' :
                    activityData.engagementScore >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${activityData.engagementScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "summary" ? (
          <ActivitySummary 
            activity={activityData} 
            onViewDetail={handleViewDetail}
          />
        ) : (
          <ActivityDetail 
            activity={detailActivity} 
            onBack={handleBackToSummary}
            loading={detailLoading}
          />
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Search Analytics Component - Shows analytics for search data
 */
const SearchAnalytics = ({ searchData }) => {
  // Group searches by type
  const byType = {
    global: searchData.filter(s => s.searchType === 'global').length,
    area: searchData.filter(s => s.searchType === 'area').length,
    standard: searchData.filter(s => s.searchType === 'standard').length
  };
  
  // Get common search terms
  const terms = {};
  searchData.forEach(search => {
    terms[search.query] = (terms[search.query] || 0) + 1;
  });
  
  // Sort terms by frequency
  const commonTerms = Object.entries(terms)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="border rounded-md p-4 bg-white">
        <h3 className="text-sm font-medium mb-2">Search Types</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-24">Global</div>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400"
                style={{ width: `${searchData.length ? (byType.global / searchData.length) * 100 : 0}%` }}
              />
            </div>
            <div className="w-8 text-right ml-2">{byType.global}</div>
          </div>
          <div className="flex items-center">
            <div className="w-24">Area</div>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-400"
                style={{ width: `${searchData.length ? (byType.area / searchData.length) * 100 : 0}%` }}
              />
            </div>
            <div className="w-8 text-right ml-2">{byType.area}</div>
          </div>
          <div className="flex items-center">
            <div className="w-24">Standard</div>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-400"
                style={{ width: `${searchData.length ? (byType.standard / searchData.length) * 100 : 0}%` }}
              />
            </div>
            <div className="w-8 text-right ml-2">{byType.standard}</div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-md p-4 bg-white">
        <h3 className="text-sm font-medium mb-2">Common Search Terms</h3>
        {commonTerms.length > 0 ? (
          <div className="space-y-2">
            {commonTerms.map(([term, count]) => (
              <div key={term} className="flex items-center">
                <div className="w-24 truncate" title={term}>"{term}"</div>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-400"
                    style={{ width: `${(count / commonTerms[0][1]) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-right ml-2">{count}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No search data available</div>
        )}
      </div>
    </div>
  );
};

// Updated ActivityDetail component in ActivityDetailView.jsx

/**
 * Activity Detail Component - Shows a detailed breakdown of a specific activity
 */
const ActivityDetail = ({ activity, onBack, loading }) => {
  const activityTypes = {
    propertyViews: {
      title: "Property Views",
      icon: <Eye className="h-5 w-5 text-blue-500" />,
      render: (item) => (
        <div key={item.timestamp || Math.random()} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.propertyTitle}</div>
          <div className="text-sm text-gray-500">{item.propertyAddress}</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</span>
            <span>Duration: {Math.floor(item.duration / 60)}m {item.duration % 60}s</span>
          </div>
          <div className="text-sm italic mt-1">{item.details}</div>
        </div>
      )
    },
    clickEvents: {
      title: "Click Events",
      icon: <MousePointer className="h-5 w-5 text-purple-500" />,
      render: (item) => (
        <div key={item.timestamp || Math.random()} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.element}</div>
          <div className="text-sm text-gray-500">{item.page}</div>
          <div className="text-sm mt-1">{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</div>
        </div>
      )
    },
    pageVisits: {
      title: "Page Visits",
      icon: <Navigation className="h-5 w-5 text-green-500" />,
      render: (item) => (
        <div key={item.timestamp || Math.random()} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.url}</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</span>
            <span>Duration: {Math.floor(item.duration / 60)}m {item.duration % 60}s</span>
          </div>
        </div>
      )
    },
    searchHistory: {
      title: "Search History",
      icon: <Search className="h-5 w-5 text-orange-500" />,
      render: (item) => (
        <div key={item.timestamp || Math.random()} className="border rounded-md p-3 mb-2 bg-white">
          <div className="flex justify-between">
            <div className="font-medium text-[#324c48]">"{item.query}"</div>
            {item.searchType && (
              <Badge variant="outline" className={`
                ${item.searchType === 'global' ? 'bg-blue-50 text-blue-600' : ''}
                ${item.searchType === 'area' ? 'bg-green-50 text-green-600' : ''}
                ${item.searchType === 'standard' ? 'bg-purple-50 text-purple-600' : ''}
              `}>
                {item.searchType}
              </Badge>
            )}
          </div>
          <div className="flex justify-between mt-1 text-sm">
            <span>{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</span>
            <span>{item.results} results</span>
          </div>
          {item.area && (
            <div className="text-xs text-gray-500 mt-1">
              Area: {item.area}
            </div>
          )}
          {item.context && (
            <div className="text-xs text-gray-500 mt-1">
              Context: {item.context}
            </div>
          )}
        </div>
      )
    },
    offerHistory: {
      title: "Offer History",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      render: (item) => (
        <div key={item.id || item.timestamp || Math.random()} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.propertyTitle}</div>
          <div className="text-sm text-gray-500">{item.propertyAddress}</div>
          <div className="flex justify-between mt-1">
            <span className="font-bold">${typeof item.amount === 'number' ? 
              item.amount.toLocaleString() : 
              (typeof item.offeredPrice === 'number' ? 
                item.offeredPrice.toLocaleString() : '0')}</span>
            <Badge className={`
              ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${item.status === 'Accepted' ? 'bg-green-100 text-green-800' : ''}
              ${item.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
              ${item.status === 'Countered' ? 'bg-blue-100 text-blue-800' : ''}
            `}>
              {item.status || 'Pending'}
            </Badge>
          </div>
          <div className="text-sm mt-1">
            {item.timestamp ? format(new Date(item.timestamp), 'MMM d, yyyy h:mm a') : 'Date not available'}
          </div>
        </div>
      )
    },
    emailInteractions: {
      title: "Email Interactions",
      icon: <Mail className="h-5 w-5 text-indigo-500" />,
      render: (item) => (
        <div key={item.emailId || Math.random()} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.subject}</div>
          <div className="flex mt-1 text-sm">
            <span className={`${item.opened ? 'text-green-600' : 'text-gray-500'}`}>
              {item.opened ? 'Opened' : 'Not opened'}
              {item.opened && item.openTimestamp && ` on ${format(new Date(item.openTimestamp), 'MMM d, yyyy h:mm a')}`}
            </span>
          </div>
          {item.clicks?.length > 0 && (
            <div className="mt-2 border-t pt-2">
              <div className="text-sm font-medium">Clicked Links:</div>
              {item.clicks.map((click, idx) => (
                <div key={idx} className="text-sm ml-2">
                  • {click.url} ({click.timestamp ? format(new Date(click.timestamp), 'h:mm a') : 'time unknown'})
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    sessionHistory: {
      title: "Session History",
      icon: <Smartphone className="h-5 w-5 text-gray-500" />,
      render: (item) => {
        // Safely parse dates with fallbacks to avoid invalid date errors
        const loginTime = item.loginTime ? new Date(item.loginTime) : null;
        const logoutTime = item.logoutTime ? new Date(item.logoutTime) : null;
        
        // Validate dates before formatting them
        const isValidDate = (date) => date instanceof Date && !isNaN(date);
        
        const formatSafeDate = (date) => {
          if (!date || !isValidDate(date)) {
            return 'Unknown';
          }
          try {
            return format(date, 'MMM d, yyyy h:mm a');
          } catch (e) {
            console.error('Date formatting error:', e);
            return 'Invalid date';
          }
        };
        
        // Calculate duration safely
        const duration = (loginTime && logoutTime && isValidDate(loginTime) && isValidDate(logoutTime))
          ? Math.floor((logoutTime - loginTime) / (1000 * 60))  // in minutes
          : null;
        
        return (
          <div key={item.loginTime || Math.random()} className="border rounded-md p-3 mb-2 bg-white">
            <div className="font-medium text-[#324c48]">{item.device || 'Unknown device'}</div>
            <div className="text-sm text-gray-500">IP: {item.ipAddress || 'Unknown'}</div>
            <div className="flex justify-between mt-1 text-sm">
              <span>Login: {formatSafeDate(loginTime)}</span>
              <span>Logout: {logoutTime ? formatSafeDate(logoutTime) : 'Session active'}</span>
            </div>
            {duration !== null && (
              <div className="text-sm mt-1">Duration: {duration} min</div>
            )}
          </div>
        );
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#324c48] mb-4" />
        <p className="text-[#324c48]">Loading detailed activity...</p>
      </div>
    );
  }

  // Debugging logs to see what data we have
  console.log(`Displaying ${activity.type} detail view with data:`, activity.data);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          {activityTypes[activity.type]?.icon && (
            <span className="mr-2">{activityTypes[activity.type].icon}</span>
          )}
          {activityTypes[activity.type]?.title || "Activity"}
        </h3>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Summary
        </Button>
      </div>
      
      {activity.type === "searchHistory" && activity.data && activity.data.length > 0 && (
        <SearchAnalytics searchData={activity.data} />
      )}
      
      <div className="space-y-2">
        {activity.data && activity.data.length > 0 ? (
          // Map over the data and render each item
          activity.data.map(item => {
            // Make sure the renderer exists for this activity type
            if (activityTypes[activity.type] && typeof activityTypes[activity.type].render === 'function') {
              return activityTypes[activity.type].render(item);
            }
            // Fallback for unknown activity types
            return (
              <div key={Math.random()} className="border rounded-md p-3 mb-2 bg-white">
                <div className="font-medium text-[#324c48]">Unknown activity type</div>
                <pre className="text-xs overflow-auto mt-2">{JSON.stringify(item, null, 2)}</pre>
              </div>
            );
          })
        ) : (
          <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-500 mb-2">No data available for this activity type.</p>
            <p className="text-sm text-gray-400">This may happen if the buyer has not performed this activity yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Activity Summary Component - Shows an overview of all activity metrics
 */
const ActivitySummary = ({ activity, onViewDetail }) => {
  // Helper to check if data exists for a category
  const hasData = (category) => {
    return Array.isArray(activity[category]) && activity[category].length > 0;
  };
  
  // Get the actual counts for each activity type
  const getActivityCount = (type) => {
    if (!Array.isArray(activity[type])) return 0;
    return activity[type].length;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Eye className="h-4 w-4 mr-2 text-blue-500" />
              Property Engagement
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Properties viewed:</span>
              <Badge variant="outline" className="bg-blue-50">
                {getActivityCount('propertyViews')}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total view time:</span>
              <span className="text-sm font-medium">
                {hasData('propertyViews') 
                  ? `${Math.floor(activity.propertyViews.reduce((total, view) => total + (view.duration || 0), 0) / 60)} minutes`
                  : '0 minutes'
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Most viewed property:</span>
              {hasData('propertyViews') ? (
                <span className="text-sm font-medium truncate max-w-[150px]">
                  {activity.propertyViews[0].propertyTitle}
                </span>
              ) : (
                <span className="text-sm text-gray-500">None</span>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]"
            onClick={() => onViewDetail({
              type: "propertyViews",
              data: activity.propertyViews
            })}
            disabled={!hasData('propertyViews')}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
              Offer Activity
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Offers made:</span>
              <Badge variant="outline" className="bg-green-50">
                {getActivityCount('offerHistory')}
              </Badge>
            </div>
            {hasData('offerHistory') ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Latest offer:</span>
                  <span className="text-sm font-medium">
                    ${activity.offerHistory[0].amount?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Latest status:</span>
                  <Badge className={`
                    ${activity.offerHistory[0].status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${activity.offerHistory[0].status === 'Accepted' ? 'bg-green-100 text-green-800' : ''}
                    ${activity.offerHistory[0].status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                    ${activity.offerHistory[0].status === 'Countered' ? 'bg-blue-100 text-blue-800' : ''}
                  `}>
                    {activity.offerHistory[0].status}
                  </Badge>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 py-2">No offers made yet</div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]" 
            disabled={!hasData('offerHistory')}
            onClick={() => onViewDetail({
              type: "offerHistory",
              data: activity.offerHistory
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <MousePointer className="h-4 w-4 mr-2 text-purple-500" />
              Interaction Data
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Click events:</span>
              <Badge variant="outline" className="bg-purple-50">
                {getActivityCount('clickEvents')}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Page visits:</span>
              <Badge variant="outline" className="bg-green-50">
                {getActivityCount('pageVisits')}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last active:</span>
              <span className="text-sm font-medium">
                {format(new Date(activity.lastActive), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#324c48]"
              disabled={!hasData('clickEvents')}
              onClick={() => onViewDetail({
                type: "clickEvents",
                data: activity.clickEvents
              })}
            >
              Click Details
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#324c48]"
              disabled={!hasData('pageVisits')}
              onClick={() => onViewDetail({
                type: "pageVisits",
                data: activity.pageVisits
              })}
            >
              Visit Details
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Search className="h-4 w-4 mr-2 text-orange-500" />
              Search Activity
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total searches:</span>
              <Badge variant="outline" className="bg-orange-50">
                {getActivityCount('searchHistory')}
              </Badge>
            </div>
            {hasData('searchHistory') ? (
              <>
                <div>
                  <div className="text-sm mb-1">Recent searches:</div>
                  <div className="flex flex-wrap gap-1">
                    {activity.searchHistory.slice(0, 2).map((search, idx) => (
                      <Badge key={idx} variant="outline" className="bg-orange-50">
                        {search.query}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 py-2">No search history</div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]"
            disabled={!hasData('searchHistory')}
            onClick={() => onViewDetail({
              type: "searchHistory",
              data: activity.searchHistory
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Mail className="h-4 w-4 mr-2 text-indigo-500" />
              Email Engagement
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Emails received:</span>
              <Badge variant="outline" className="bg-indigo-50">
                {getActivityCount('emailInteractions')}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Open rate:</span>
              <span className="text-sm font-medium">
                {hasData('emailInteractions') 
                  ? `${Math.round((activity.emailInteractions.filter(e => e.opened).length / activity.emailInteractions.length) * 100)}%`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Click rate:</span>
              <span className="text-sm font-medium">
                {hasData('emailInteractions') 
                  ? `${Math.round((activity.emailInteractions.filter(e => e.clicks && e.clicks.length > 0).length / activity.emailInteractions.length) * 100)}%`
                  : "N/A"}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]"
            disabled={!hasData('emailInteractions')}
            onClick={() => onViewDetail({
              type: "emailInteractions",
              data: activity.emailInteractions
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
              Session Data
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total sessions:</span>
              <Badge variant="outline" className="bg-gray-50">
                {getActivityCount('sessionHistory')}
              </Badge>
            </div>
            {hasData('sessionHistory') ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last login:</span>
                  <span className="text-sm font-medium">
                    {format(new Date(activity.sessionHistory[0].loginTime), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Device:</span>
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {typeof activity.sessionHistory[0].device === 'string' ? 
                      activity.sessionHistory[0].device.split(' ')[0] : 
                      'Unknown'}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 py-2">No session data</div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]"
            disabled={!hasData('sessionHistory')}
            onClick={() => onViewDetail({
              type: "sessionHistory",
              data: activity.sessionHistory
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityDetailView;