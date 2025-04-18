// client/src/components/OfferManagement/OfferStats.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';

const OfferStats = ({ stats }) => {
  if (!stats) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-700">#</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats.trend && stats.trend.length > 0
              ? `${stats.trend[stats.trend.length - 1]?.total || 0} new this week`
              : "No recent data"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
          <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="h-4 w-4 text-yellow-700" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byStatus?.PENDING || 0}</div>
          <p className="text-xs text-muted-foreground">Awaiting response</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Accepted Offers</CardTitle>
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-green-700" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.byStatus?.ACCEPTED || 0}</div>
          <p className="text-xs text-muted-foreground">Successfully closed</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Countered/Rejected</CardTitle>
          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-blue-700" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {(stats.byStatus?.COUNTERED || 0) + (stats.byStatus?.REJECTED || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.byStatus?.COUNTERED || 0} countered, {stats.byStatus?.REJECTED || 0} rejected
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferStats;