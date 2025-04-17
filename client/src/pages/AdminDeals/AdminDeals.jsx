// client/src/components/AdminDeals.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { getAllDeals } from "@/utils/api";
import { format } from "date-fns";

// Import Deal components
import DealDetail from "@/components/Deal/DealDetail";
import CreateDealForm from "@/components/Deal/CreateDealForm";
import PaymentList from "@/components/Deal/PaymentList";
import DealFinancialSummary from "@/components/Deal/DealFinancialSummary";

// Import UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PuffLoader } from "react-spinners";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Clock,
  Calendar,
  Plus,
  CheckCircle2,
  FileText
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminDeals() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Determine which tab should be active based on URL
  const getInitialTab = () => {
    if (location.pathname.includes("/create")) return "create";
    if (location.pathname.includes("/payments")) return "payments";
    if (id) return "details";
    return "overview";
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  // Update active tab when route changes
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname, id]);

  // Fetch all deals for stats and list
  const { data, isLoading, isError } = useQuery(
    "allDeals",
    () => getAllDeals({ limit: 100 }),
    { refetchOnWindowFocus: false }
  );

  // Format currency
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "$0";
    return `$${Number(value).toLocaleString()}`;
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!data || !data.deals) return {
      totalDeals: 0,
      activeDeals: 0,
      completedDeals: 0,
      revenue: 0,
      avgMonthlyPayment: 0
    };

    const deals = data.deals;
    const active = deals.filter(d => d.status === "ACTIVE").length;
    const completed = deals.filter(d => d.status === "COMPLETED").length;
    
    // Calculate total revenue and average payment
    let totalRevenue = 0;
    let totalMonthlyPayment = 0;
    deals.forEach(deal => {
      if (deal.totalPaidToDate) totalRevenue += Number(deal.totalPaidToDate);
      if (deal.monthlyPayment) totalMonthlyPayment += Number(deal.monthlyPayment);
    });

    return {
      totalDeals: deals.length,
      activeDeals: active,
      completedDeals: completed,
      revenue: totalRevenue,
      avgMonthlyPayment: deals.length > 0 ? totalMonthlyPayment / deals.length : 0
    };
  };

  const stats = calculateStats();

  // Handle navigation
  const handleCreate = () => {
    navigate("/admin/deals/create");
  };

  // Handle deal selection
  const handleDealSelect = (dealId) => {
    if (dealId) {
      navigate(`/admin/deals/${dealId}`);
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#324c48] mb-2">Financing Deals</h1>
            <p className="text-[#324c48] mb-2">
              Manage property financing deals, payment schedules, and financial summaries
            </p>
          </div>
          <Button 
            className="bg-[#324c48] hover:bg-[#3f4f24] text-white"
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Deal
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="bg-[#f4f7ee]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Total Deals</span>
                <FileText className="h-5 w-5 text-[#3f4f24]" />
              </div>
              <div className="text-3xl font-bold text-[#3f4f24]">{stats.totalDeals}</div>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>All time</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#f0f5f4]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Active Deals</span>
                <CheckCircle2 className="h-5 w-5 text-[#324c48]" />
              </div>
              <div className="text-3xl font-bold text-[#324c48]">{stats.activeDeals}</div>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Currently active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#f0f5f4]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Completed</span>
                <CheckCircle2 className="h-5 w-5 text-[#324c48]" />
              </div>
              <div className="text-3xl font-bold text-[#324c48]">{stats.completedDeals}</div>
              <div className="flex items-center mt-2 text-xs text-blue-600">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                <span>Fully paid</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fcf7e8]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Total Revenue</span>
                <DollarSign className="h-5 w-5 text-[#D4A017]" />
              </div>
              <div className="text-3xl font-bold text-[#D4A017]">
                {formatCurrency(stats.revenue)}
              </div>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>All payments</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fcf7e8]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Avg. Payment</span>
                <CreditCard className="h-5 w-5 text-[#D4A017]" />
              </div>
              <div className="text-3xl font-bold text-[#D4A017]">
                {formatCurrency(stats.avgMonthlyPayment)}
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Per month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content based on URL */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <>
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <PuffLoader size={60} color="#3f4f24" />
                </div>
              ) : isError ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-red-500 mb-4">Failed to load deals data.</p>
                    <Button 
                      onClick={() => window.location.reload()}
                      className="bg-[#324c48] text-white"
                    >
                      Reload Page
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardHeader className="pb-2 bg-[#f0f5f4] border-b">
                      <div className="flex justify-between items-center">
                        <CardTitle>All Financing Deals</CardTitle>
                        {/* <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCreate}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          New Deal
                        </Button> */}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {data && data.deals && data.deals.length > 0 ? (
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-4">Buyer</th>
                              <th className="text-left p-4">Property</th>
                              <th className="text-left p-4">Date</th>
                              <th className="text-left p-4">Sale Price</th>
                              <th className="text-left p-4">Monthly</th>
                              <th className="text-left p-4">Status</th>
                              <th className="text-right p-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.deals.map((deal) => (
                              <tr 
                                key={deal.id} 
                                className="border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleDealSelect(deal.id)}
                              >
                                <td className="p-4">
                                  <div className="font-medium">
                                    {deal.buyer?.firstName} {deal.buyer?.lastName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {deal.buyer?.buyerType || 'Builder'}
                                  </div>
                                </td>
                                <td className="p-4 max-w-[200px] truncate">
                                  {deal.property?.title || deal.property?.streetAddress || 'Property'}
                                </td>
                                <td className="p-4">
                                  {deal.startDate ? format(new Date(deal.startDate), "MMM d, yyyy") : 'N/A'}
                                </td>
                                <td className="p-4 font-medium">
                                  {formatCurrency(deal.salePrice)}
                                </td>
                                <td className="p-4">
                                  {formatCurrency(deal.monthlyPayment)}
                                </td>
                                <td className="p-4">
                                  <Badge className={`
                                    ${deal.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''}
                                    ${deal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    ${deal.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : ''}
                                    ${deal.status === 'DEFAULTED' ? 'bg-red-100 text-red-800' : ''}
                                  `}>
                                    {deal.status || 'ACTIVE'}
                                  </Badge>
                                </td>
                                <td className="p-4 text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDealSelect(deal.id);
                                    }}
                                  >
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500 mb-4">No deals found. Get started by creating your first deal.</p>
                          <Button 
                            onClick={handleCreate}
                            className="bg-[#324c48] hover:bg-[#3f4f24] text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Deal
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t p-4 flex justify-between">
                      <div className="text-sm text-gray-500">
                        Showing {data?.deals?.length || 0} deals
                      </div>
                    </CardFooter>
                  </Card>

                  {/* Recent Activity Section */}
                  {data?.deals?.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Recent Deal Activity</CardTitle>
                        <CardDescription>Latest payments and status changes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {data.deals.slice(0, 3).map((deal) => (
                            <div 
                              key={deal.id} 
                              className="flex items-start gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleDealSelect(deal.id)}
                            >
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-[#324c48] text-white">
                                  {deal.buyer?.firstName?.[0] || ''}
                                  {deal.buyer?.lastName?.[0] || ''}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <div className="font-medium">
                                    {deal.buyer?.firstName} {deal.buyer?.lastName}
                                  </div>
                                  <Badge className={`
                                    ${deal.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''}
                                    ${deal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  `}>
                                    {deal.status}
                                  </Badge>
                                </div>
                                <p className="text-sm">{deal.property?.title || deal.property?.streetAddress}</p>
                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                  <div>
                                    <Calendar className="h-3 w-3 inline mr-1" />
                                    {format(new Date(deal.startDate), "MMM d, yyyy")}
                                  </div>
                                  <div>
                                    <DollarSign className="h-3 w-3 inline mr-1" />
                                    {formatCurrency(deal.monthlyPayment)}/month
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === "details" && (
            <>
              {id ? <DealDetail /> : <Card className="p-8 text-center"><p className="text-gray-500">Please select a deal to view details</p></Card>}
            </>
          )}

          {activeTab === "payments" && (
            <>
              {id ? <PaymentList dealId={id} /> : <Card className="p-8 text-center"><p className="text-gray-500">Please select a deal to view payments</p></Card>}
            </>
          )}

          {activeTab === "create" && (
            <>
              <CreateDealForm />
            </>
          )}
        </div>
      </div>
    </div>
  );
}