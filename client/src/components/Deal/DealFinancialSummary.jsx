import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getDealFinancialSummary } from "@/utils/api";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PuffLoader } from "react-spinners";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  FileText,
} from "lucide-react";

export default function DealFinancialSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch financial summary
  const { data: summary, isLoading, isError } = useQuery(
    ["dealSummary", id],
    () => getDealFinancialSummary(id),
    { refetchOnWindowFocus: false }
  );
  
  // Format currency
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "N/A";
    return `$${Number(value).toLocaleString()}`;
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#3f4f24" />
      </div>
    );
  }
  
  if (isError || !summary) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">Error Loading Financial Summary</h2>
        <p className="text-gray-500 mb-4">Failed to load deal financial data.</p>
        <Button onClick={() => navigate(`/admin/deals/${id}`)}>
          Back to Deal
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl py-6">
      {/* Back button */}
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(`/admin/deals/${id}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Deal
      </Button>
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#324c48]">
          Financial Summary
        </h1>
        <p className="text-gray-500">
          Detailed financial overview and projections for this deal
        </p>
      </div>
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Deal Value</CardTitle>
            <CardDescription>Total value of the deal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#324c48]">
              {formatCurrency(summary.salePrice)}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">Purchase Price:</span>
              <span>{formatCurrency(summary.purchasePrice)}</span>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span className="text-gray-500">Down Payment:</span>
              <span>{formatCurrency(summary.downPayment)}</span>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span className="text-gray-500">Loan Amount:</span>
              <span>{formatCurrency(summary.loanAmount)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Returns</CardTitle>
            <CardDescription>Revenue collected to date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#324c48]">
              {formatCurrency(summary.currentRevenue)}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">Principal Paid:</span>
              <span>{formatCurrency(summary.principalPaid)}</span>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span className="text-gray-500">Interest Paid:</span>
              <span>{formatCurrency(summary.interestPaid)}</span>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span className="text-gray-500">Down Payment:</span>
              <span>{formatCurrency(summary.downPayment)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profit/Loss</CardTitle>
            <CardDescription>Current financial position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${summary.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(summary.profitLoss)}
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-gray-500 mr-2">Current ROI:</span>
              <span className={`flex items-center ${summary.currentROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.currentROI >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(summary.currentROI).toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center mt-1 text-sm">
              <span className="text-gray-500 mr-2">Projected ROI:</span>
              <span className={`flex items-center ${summary.projectedROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.projectedROI >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(summary.projectedROI).toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress & Timeline */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Deal Progress & Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  {summary.paidPayments} of {summary.totalPayments} payments complete ({Math.round((summary.paidPayments / summary.totalPayments) * 100)}%)
                </span>
                <span className="text-sm text-gray-500">
                  {summary.remainingPayments} payments remaining
                </span>
              </div>
              <Progress value={(summary.paidPayments / summary.totalPayments) * 100} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Start Date
                </div>
                <div className="font-medium">
                  {formatDate(summary.startDate)}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Last Payment
                </div>
                <div className="font-medium">
                  {formatDate(summary.lastPaymentDate)}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Projected Completion
                </div>
                <div className="font-medium">
                  {formatDate(summary.projectedCompletionDate)}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Actual Completion
                </div>
                <div className="font-medium">
                  {summary.completionDate ? formatDate(summary.completionDate) : "In Progress"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Financial Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Down Payment</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(summary.downPayment)}
                  </span>
                </div>
                <Progress 
                  value={(summary.downPayment / summary.totalExpectedRevenue) * 100} 
                  className="h-2 bg-gray-100"
                  indicatorClassName="bg-blue-500"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Principal</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(summary.loanAmount)}
                  </span>
                </div>
                <Progress 
                  value={(summary.loanAmount / summary.totalExpectedRevenue) * 100} 
                  className="h-2 bg-gray-100"
                  indicatorClassName="bg-green-500"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Interest</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(summary.totalExpectedRevenue - summary.downPayment - summary.loanAmount)}
                  </span>
                </div>
                <Progress 
                  value={((summary.totalExpectedRevenue - summary.downPayment - summary.loanAmount) / summary.totalExpectedRevenue) * 100} 
                  className="h-2 bg-gray-100"
                  indicatorClassName="bg-purple-500"
                />
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between text-[#324c48]">
                  <span className="font-medium">Total Expected Revenue</span>
                  <span className="font-bold">
                    {formatCurrency(summary.totalExpectedRevenue)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Investment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Investment</span>
                <span className="font-medium">
                  {formatCurrency(summary.purchasePrice)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Return</span>
                <span className="font-medium">
                  {formatCurrency(summary.currentRevenue)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Projected Total Return</span>
                <span className="font-medium">
                  {formatCurrency(summary.totalExpectedRevenue)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Current ROI</span>
                <span className={`font-medium flex items-center ${summary.currentROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.currentROI >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(summary.currentROI).toFixed(2)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Projected Final ROI</span>
                <span className={`font-medium flex items-center ${summary.projectedROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.projectedROI >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(summary.projectedROI).toFixed(2)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Remaining Balance</span>
                <span className="font-medium">
                  {formatCurrency(summary.remainingBalance)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Actions Footer */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/deals/${id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Deal
        </Button>
        
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/deals/${id}/payments`)}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Manage Payments
          </Button>
          
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
}