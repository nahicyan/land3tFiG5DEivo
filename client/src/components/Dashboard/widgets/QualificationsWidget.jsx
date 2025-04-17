// client/src/components/Dashboard/widgets/QualificationsWidget.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  ArrowRight,
  BarChart,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/format";

export default function QualificationsWidget({ isLoading }) {
  const navigate = useNavigate();

  // Sample qualification data
  const qualifications = [
    {
      id: "qual-1",
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      property: {
        id: "prop-1",
        title: "Modern Ranch Land",
        price: 350000
      },
      qualified: true,
      loanAmount: 280000,
      downPayment: 70000,
      interestRate: 5.2,
      monthlyPayment: 1650
    },
    {
      id: "qual-2",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      property: {
        id: "prop-2",
        title: "Lakefront Property",
        price: 495000
      },
      qualified: true,
      loanAmount: 400000,
      downPayment: 95000,
      interestRate: 5.1,
      monthlyPayment: 2350
    },
    {
      id: "qual-3",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael@example.com",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      property: {
        id: "prop-3",
        title: "Development Land",
        price: 825000
      },
      qualified: false,
      disqualificationReason: "Insufficient credit score and income"
    },
    {
      id: "qual-4",
      firstName: "David",
      lastName: "Wilson",
      email: "david@example.com",
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      property: {
        id: "prop-4",
        title: "Mountain View Acreage",
        price: 275000
      },
      qualified: true,
      loanAmount: 220000,
      downPayment: 55000,
      interestRate: 5.15,
      monthlyPayment: 1285
    },
    {
      id: "qual-5",
      firstName: "Jessica",
      lastName: "Chen",
      email: "jessica@example.com",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      property: {
        id: "prop-1",
        title: "Modern Ranch Land",
        price: 350000
      },
      qualified: false,
      disqualificationReason: "Unstable employment history"
    }
  ];

  // Calculate qualification metrics
  const totalApplications = qualifications.length;
  const qualifiedCount = qualifications.filter(q => q.qualified).length;
  const qualificationRate = Math.round((qualifiedCount / totalApplications) * 100);
  const averageLoanAmount = qualifications
    .filter(q => q.qualified)
    .reduce((sum, q) => sum + q.loanAmount, 0) / qualifiedCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financing Applications</CardTitle>
        <CardDescription>
          Recent qualification applications and approval status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            {Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Qualification rate: {qualificationRate}%</span>
                <span>{qualifiedCount} of {totalApplications} qualified</span>
              </div>
              <Progress 
                value={qualificationRate} 
                className="h-2"
              />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-[#f4f7ee] p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Average Loan</p>
                  <p className="text-xl font-bold text-[#3f4f24]">${formatPrice(averageLoanAmount)}</p>
                </div>
                <div className="bg-[#fcf7e8] p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Average Rate</p>
                  <p className="text-xl font-bold text-[#D4A017]">5.15%</p>
                </div>
              </div>
            </div>
            
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {qualifications.map((qual) => (
                  <div 
                    key={qual.id}
                    className="flex items-start gap-3 p-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Avatar className="h-10 w-10 mt-1">
                      <AvatarFallback className="bg-[#324c48] text-white">
                        {qual.firstName.charAt(0)}{qual.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium">{qual.firstName} {qual.lastName}</p>
                        <Badge className={`ml-2 ${qual.qualified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {qual.qualified ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Qualified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              Not Qualified
                            </span>
                          )}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Applied for: {qual.property.title}
                      </p>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Property price: ${formatPrice(qual.property.price)}
                      </div>
                      {qual.qualified && (
                        <div className="text-xs text-green-600 mt-1">
                          Loan: ${formatPrice(qual.loanAmount)} | Payment: ${formatPrice(qual.monthlyPayment)}/mo
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-right text-gray-500">
                      {format(qual.date, "MMM d, yyyy")}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button 
          variant="outline"
          onClick={() => navigate("/admin/qualifications")}
        >
          <FileText className="mr-2 h-4 w-4" />
          View Applications
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate("/admin/qualifications")}
        >
          <BarChart className="mr-2 h-4 w-4" />
          Analytics
        </Button>
      </CardFooter>
    </Card>
  );
}