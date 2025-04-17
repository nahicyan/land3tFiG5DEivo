import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getDealById } from "@/utils/api";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PuffLoader } from "react-spinners";
import {
  ArrowLeft,
  User,
  Home,
  Calendar,
  CircleDollarSign,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import PaymentList from "./PaymentList";

export default function DealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch deal data
  const { data: deal, isLoading, isError } = useQuery(
    ["deal", id],
    () => getDealById(id),
    { refetchOnWindowFocus: false }
  );
  
  // Format currency
  const formatCurrency = (value) => {
    return value ? `$${Number(value).toLocaleString()}` : "N/A";
  };
  
  // Format percentage
  const formatPercent = (value) => {
    return value ? `${value}%` : "N/A";
  };
  
  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DEFAULTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#3f4f24" />
      </div>
    );
  }
  
  if (isError || !deal) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">Error Loading Deal</h2>
        <p className="text-gray-500 mb-4">Failed to load deal data.</p>
        <Button onClick={() => navigate("/admin/deals")}>
          Back to Deals
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
        onClick={() => navigate("/admin/deals")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Deals
      </Button>
      
      {/* Header card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {deal.property.title || deal.property.streetAddress}
              </CardTitle>
              <CardDescription>
                Deal #{id.slice(0, 8)} • Started {format(new Date(deal.startDate), "MMMM d, yyyy")}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={getStatusBadge(deal.status)}
            >
              {deal.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Buyer Info */}
            <div className="space-y-2">
              <div className="flex items-center text-[#324c48] font-medium">
                <User className="h-5 w-5 mr-2" />
                Buyer
              </div>
              <div className="pl-7">
                <p className="font-medium">{deal.buyer.firstName} {deal.buyer.lastName}</p>
                <p className="text-sm text-gray-500">{deal.buyer.email}</p>
                <p className="text-sm text-gray-500">{deal.buyer.phone}</p>
                <Badge className="mt-1" variant="outline">
                  {deal.buyer.buyerType}
                </Badge>
              </div>
            </div>
            
            {/* Property Info */}
            <div className="space-y-2">
              <div className="flex items-center text-[#324c48] font-medium">
                <Home className="h-5 w-5 mr-2" />
                Property
              </div>
              <div className="pl-7">
                <p className="font-medium">{deal.property.title || "Property"}</p>
                <p className="text-sm">{deal.property.streetAddress}</p>
                <p className="text-sm text-gray-500">
                  {deal.property.city}, {deal.property.state} {deal.property.zip}
                </p>
              </div>
            </div>
            
            {/* Timeline Info */}
            <div className="space-y-2">
              <div className="flex items-center text-[#324c48] font-medium">
                <Calendar className="h-5 w-5 mr-2" />
                Timeline
              </div>
              <div className="pl-7">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Start:</span>
                  <span className="font-medium">
                    {format(new Date(deal.startDate), "MMM d, yyyy")}
                  </span>
                </div>
                {deal.completionDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Completed:</span>
                    <span className="font-medium">
                      {format(new Date(deal.completionDate), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Term:</span>
                  <span className="font-medium">
                    {deal.term} months
                  </span>
                </div>
              </div>
            </div>
            
            {/* Financial Summary */}
            <div className="space-y-2">
              <div className="flex items-center text-[#324c48] font-medium">
                <CircleDollarSign className="h-5 w-5 mr-2" />
                Financial
              </div>
              <div className="pl-7">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Sale Price:</span>
                  <span className="font-medium">
                    {formatCurrency(deal.salePrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Monthly:</span>
                  <span className="font-medium">
                    {formatCurrency(deal.monthlyPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Interest Rate:</span>
                  <span className="font-medium">
                    {formatPercent(deal.interestRate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/deals/${id}/payments`)}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Schedule
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/deals/${id}/summary`)}
          >
            <CircleDollarSign className="h-4 w-4 mr-2" />
            Financial Summary
          </Button>
          <Button
            onClick={() => navigate(`/admin/deals/${id}/edit`)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Edit Deal
          </Button>
        </CardFooter>
      </Card>
      
      {/* Tabs section */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="details">Deal Details</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notes">Notes & Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column - Primary details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Sale Price</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(deal.salePrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Purchase Price</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(deal.purchasePrice)}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Down Payment</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(deal.downPayment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Loan Amount</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(deal.loanAmount)}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="font-medium text-lg">
                        {formatPercent(deal.interestRate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Term</p>
                      <p className="font-medium text-lg">
                        {deal.term} months
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Monthly Payment</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(deal.monthlyPayment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Financing Type</p>
                      <p className="font-medium text-lg">
                        {deal.financingType || "Owner"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Right column - Additional details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Payments Received</p>
                      <p className="font-medium text-lg">
                        {deal.paymentsReceived} / {deal.term}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Paid On Time</p>
                      <p className="font-medium text-lg">
                        {deal.paymentsOnTime} / {deal.paymentsReceived}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Closing Costs</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(deal.closingCosts)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transfer Taxes</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(deal.transferTaxes)}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Appraisal Value</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(deal.appraisalValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Loan Origination Fee</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(deal.loanOriginationFee)}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Paid To Date</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(deal.totalPaidToDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Profit/Loss</p>
                      <p className={`font-medium text-lg ${deal.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(deal.profitLoss)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Deal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-[#324c48] h-4 rounded-full"
                    style={{ width: `${(deal.paymentsReceived / deal.term) * 100}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Payments Progress</p>
                    <p className="font-bold text-xl">
                      {Math.round((deal.paymentsReceived / deal.term) * 100)}%
                    </p>
                    <p className="text-sm">
                      {deal.paymentsReceived} of {deal.term} payments
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <div className="font-bold text-xl flex items-center justify-center">
                      {deal.paymentsLate > 0 ? (
                        <>
                          <AlertCircle className="h-5 w-5 text-yellow-500 mr-1" />
                          <span className="text-yellow-500">
                            {deal.paymentsLate} Late
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-1" />
                          <span className="text-green-500">Current</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm">
                      {deal.paymentsOnTime} on-time payments
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Remaining Time</p>
                    <p className="font-bold text-xl">
                      {deal.term - deal.paymentsReceived} months
                    </p>
                    <p className="text-sm">
                      {Math.round(((deal.term - deal.paymentsReceived) / 12) * 10) / 10} years
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentList dealId={id} payments={deal.payments} />
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes & Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Deal Notes</h3>
                  {deal.notes ? (
                    <p className="p-4 border rounded-md bg-gray-50">
                      {deal.notes}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">No notes available for this deal.</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Documents</h3>
                  {deal.documents && deal.documents.length > 0 ? (
                    <div className="space-y-2">
                      {deal.documents.map((doc, index) => (
                        <div 
                          key={index}
                          className="p-3 border rounded-md flex items-center justify-between hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-[#324c48]" />
                            <span>{doc}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No documents attached to this deal.</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button variant="outline">
                Upload Document
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}