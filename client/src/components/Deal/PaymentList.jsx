// client/src/components/Deal/PaymentList.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { recordPayment } from "@/utils/api";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateInput } from "@/components/ui/date-input";
import { DollarSign, CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react";

export default function PaymentList({ dealId, payments = [] }) {
    const queryClient = useQueryClient();
    const [recordDialogOpen, setRecordDialogOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentDate, setPaymentDate] = useState(new Date());
    const [paymentAmount, setPaymentAmount] = useState("");
    const [lateFee, setLateFee] = useState("");

    // Filter state
    const [filter, setFilter] = useState("all");

    // Payment recording mutation
    const recordPaymentMutation = useMutation(
        (paymentData) => recordPayment(paymentData),
        {
            onSuccess: () => {
                // Invalidate and refetch deal query
                queryClient.invalidateQueries(["deal", dealId]);
                toast.success("Payment recorded successfully");
                setRecordDialogOpen(false);
                resetForm();
            },
            onError: (error) => {
                console.error("Error recording payment:", error);
                toast.error("Failed to record payment");
            }
        }
    );

    // Format currency
    const formatCurrency = (value) => {
        if (!value) return "$0.00";
        return `$${Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    // Handle payment recording
    const handleRecordPayment = (e) => {
        e.preventDefault();

        if (!selectedPayment || !paymentDate) {
            toast.error("Please select a payment date");
            return;
        }

        // If no custom amount is provided, use the payment's standard amount
        const amount = paymentAmount ? parseFloat(paymentAmount.replace(/[^0-9.]/g, '')) : selectedPayment.amount;

        const paymentData = {
            dealId,
            paymentNumber: selectedPayment.paymentNumber,
            paymentDate: paymentDate.toISOString(),
            amount,
            lateFee: lateFee ? parseFloat(lateFee.replace(/[^0-9.]/g, '')) : 0
        };

        recordPaymentMutation.mutate(paymentData);
    };

    // Reset the form
    const resetForm = () => {
        setSelectedPayment(null);
        setPaymentDate(new Date());
        setPaymentAmount("");
        setLateFee("");
    };

    // Open the dialog with a specific payment
    const openRecordDialog = (payment) => {
        setSelectedPayment(payment);
        setPaymentDate(new Date());
        setPaymentAmount(formatCurrency(payment.amount).replace("$", ""));
        setLateFee("");
        setRecordDialogOpen(true);
    };

    // Format currency input on blur
    const formatCurrencyInput = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        if (value) {
            const formatted = Number(value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            if (e.target.name === "paymentAmount") {
                setPaymentAmount(formatted);
            } else if (e.target.name === "lateFee") {
                setLateFee(formatted);
            }
        }
    };

    // Get payment status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case "PAID":
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                    </Badge>
                );
            case "LATE":
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Late
                    </Badge>
                );
            case "MISSED":
                return (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center">
                        <XCircle className="h-3 w-3 mr-1" />
                        Missed
                    </Badge>
                );
            case "PENDING":
            default:
                return (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                    </Badge>
                );
        }
    };

    // Filter payments
    const filteredPayments = payments.filter(payment => {
        if (filter === "all") return true;
        if (filter === "paid") return payment.status === "PAID";
        if (filter === "late") return payment.status === "LATE";
        if (filter === "pending") return payment.status === "PENDING";
        if (filter === "missed") return payment.status === "MISSED";
        return true;
    });

    // Group payments by year/month for easier visualization
    const groupedPayments = filteredPayments.reduce((groups, payment) => {
        const dueDate = new Date(payment.dueDate);
        const year = dueDate.getFullYear();
        const month = dueDate.getMonth();
        const key = `${year}-${month}`;

        if (!groups[key]) {
            groups[key] = {
                label: format(dueDate, "MMMM yyyy"),
                payments: []
            };
        }

        groups[key].payments.push(payment);
        return groups;
    }, {});

    // Convert to array and sort
    const sortedGroups = Object.values(groupedPayments).sort((a, b) => {
        const dateA = new Date(a.payments[0].dueDate);
        const dateB = new Date(b.payments[0].dueDate);
        return dateA - dateB;
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Payment Schedule</CardTitle>
                        <CardDescription>
                            Track and record payments for this deal
                        </CardDescription>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className={filter === "all" ? "bg-gray-100" : ""}
                            onClick={() => setFilter("all")}
                        >
                            All
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className={filter === "paid" ? "bg-green-100" : ""}
                            onClick={() => setFilter("paid")}
                        >
                            Paid
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className={filter === "pending" ? "bg-gray-100" : ""}
                            onClick={() => setFilter("pending")}
                        >
                            Pending
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className={filter === "late" ? "bg-yellow-100" : ""}
                            onClick={() => setFilter("late")}
                        >
                            Late
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {sortedGroups.length > 0 ? (
                    <div className="space-y-6">
                        {sortedGroups.map((group, groupIndex) => (
                            <div key={groupIndex}>
                                <h3 className="text-lg font-medium mb-2">{group.label}</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Payment #</TableHead>
                                            <TableHead>Due Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Principal</TableHead>
                                            <TableHead>Interest</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Payment Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {group.payments.map((payment) => (
                                            <TableRow key={payment.paymentNumber}>
                                                <TableCell>{payment.paymentNumber}</TableCell>
                                                <TableCell>
                                                    {format(new Date(payment.dueDate), "MMM d, yyyy")}
                                                </TableCell>
                                                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                                <TableCell>{formatCurrency(payment.principal)}</TableCell>
                                                <TableCell>{formatCurrency(payment.interest)}</TableCell>
                                                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                                <TableCell>
                                                    {payment.paymentDate
                                                        ? format(new Date(payment.paymentDate), "MMM d, yyyy")
                                                        : "—"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {payment.status === "PENDING" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openRecordDialog(payment)}
                                                        >
                                                            Record
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-6 text-center">
                        <p className="text-gray-500">No payments matching the selected filter.</p>
                    </div>
                )}
            </CardContent>

            {/* Record Payment Dialog */}
            <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                        <DialogDescription>
                            {selectedPayment && (
                                <>
                                    Record payment #{selectedPayment.paymentNumber} due on{" "}
                                    {format(new Date(selectedPayment.dueDate), "MMMM d, yyyy")}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleRecordPayment}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="paymentDate" className="text-right">
                                    Payment Date
                                </Label>
                                <div className="col-span-3">
                                    <DateInput
                                        date={paymentDate}
                                        setDate={setPaymentDate}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="paymentAmount" className="text-right">
                                    Amount
                                </Label>
                                <div className="col-span-3 relative">
                                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="paymentAmount"
                                        name="paymentAmount"
                                        className="pl-8"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        onBlur={formatCurrencyInput}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="lateFee" className="text-right">
                                    Late Fee
                                </Label>
                                <div className="col-span-3 relative">
                                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="lateFee"
                                        name="lateFee"
                                        className="pl-8"
                                        value={lateFee}
                                        onChange={(e) => setLateFee(e.target.value)}
                                        onBlur={formatCurrencyInput}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setRecordDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={recordPaymentMutation.isLoading}
                            >
                                {recordPaymentMutation.isLoading ? "Recording..." : "Record Payment"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}