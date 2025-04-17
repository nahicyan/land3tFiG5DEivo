// src/pages/Profile/BuyerQualificationsTable.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getAllQualifications } from '@/utils/api';
import { useVipBuyer } from '@/utils/VipBuyerContext';
import { useAuth0 } from '@auth0/auth0-react';
import { formatCurrency, getStatusColors, getStatusLabel, formatDate } from './profileUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const BuyerQualificationsTable = () => {
  const { vipBuyerData } = useVipBuyer();
  const { user } = useAuth0();
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch the buyer's qualifications based on email
  useEffect(() => {
    const fetchQualifications = async () => {
      if (!vipBuyerData?.email && !user?.email) return;
      
      try {
        setLoading(true);
        // Use the search parameter to find qualifications by email
        const email = vipBuyerData?.email || user?.email;
        const data = await getAllQualifications(1, 100, { search: email });
        
        // Filter to ensure we only get qualifications for this specific user
        // This is an additional check since the search might return partial matches
        const filteredQualifications = data.qualifications.filter(
          q => q.email.toLowerCase() === email.toLowerCase()
        );
        
        setQualifications(filteredQualifications);
      } catch (error) {
        console.error("Error fetching qualifications:", error);
        setError("Failed to load your qualification applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQualifications();
  }, [vipBuyerData, user]);

  // We're now using the shared formatCurrency helper from profileUtils.js

  // View qualification details
  const handleViewQualification = (qualification) => {
    setSelectedQualification(qualification);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Finance Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Finance Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Finance Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {qualifications.length === 0 ? (
            <p className="text-center text-gray-500 py-4">You haven't submitted any finance applications yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Monthly Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualifications.map((qualification) => (
                  <TableRow key={qualification.id}>
                    <TableCell>
                      {qualification.propertyAddress ? 
                        `${qualification.propertyAddress}, ${qualification.propertyCity || ''}` : 
                        "N/A"}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(qualification.propertyPrice)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(qualification.monthlyPayment)}
                    </TableCell>
                    <TableCell>
                      {formatDate(qualification.createdAt)}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const colors = getStatusColors(qualification.qualified);
                        return (
                          <Badge className={`${colors.bg} ${colors.text}`}>
                            {getStatusLabel(qualification.qualified)}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewQualification(qualification)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Qualification Details Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Finance Application Details
            </DialogTitle>
            <DialogDescription>
              Submitted on {selectedQualification ? 
                formatDate(selectedQualification.createdAt) : 
                ""}
            </DialogDescription>
          </DialogHeader>

          {selectedQualification && (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="mb-2">
                {(() => {
                  const colors = getStatusColors(selectedQualification.qualified);
                  return (
                    <Badge
                      className={`text-base py-1 px-3 ${colors.bg} ${colors.text}`}
                    >
                      {selectedQualification.qualified ? "QUALIFIED" : "NOT QUALIFIED"}
                    </Badge>
                  );
                })()}

                {!selectedQualification.qualified && selectedQualification.disqualificationReason && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-md">
                    <h3 className="font-semibold text-red-700">Disqualification Reason:</h3>
                    <p className="text-red-700">{selectedQualification.disqualificationReason}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Property Information */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Property Information</h3>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Address:</p>
                      <p>{selectedQualification.propertyAddress || 'N/A'}</p>
                      {selectedQualification.propertyCity && (
                        <p>{selectedQualification.propertyCity}, {selectedQualification.propertyState} {selectedQualification.propertyZip}</p>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Property Price:</p>
                      <p>{formatCurrency(selectedQualification.propertyPrice)}</p>
                    </div>
                  </div>
                </div>

                {/* Financing Information */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Financing Details</h3>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Monthly Payment:</p>
                      <p>{formatCurrency(selectedQualification.monthlyPayment)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Down Payment:</p>
                      <p>{formatCurrency(selectedQualification.downPayment)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Interest Rate:</p>
                      <p>{selectedQualification.interestRate ? `${selectedQualification.interestRate}%` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Term:</p>
                      <p>{selectedQualification.term ? `${selectedQualification.term} months` : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Survey Responses */}
                <div className="border rounded-md p-4 md:col-span-2">
                  <h3 className="font-semibold mb-2">Your Survey Responses</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Home Usage:</p>
                      <p>{selectedQualification.homeUsage || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Real Estate Agent:</p>
                      <p>{selectedQualification.realEstateAgent || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Purchase Timing:</p>
                      <p>{selectedQualification.homePurchaseTiming || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Current Home:</p>
                      <p>{selectedQualification.currentHomeOwnership || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Current on Payments:</p>
                      <p>{selectedQualification.currentOnAllPayments || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Employment Status:</p>
                      <p>{selectedQualification.employmentStatus || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Credit Score:</p>
                      <p>{selectedQualification.currentCreditScore || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BuyerQualificationsTable;