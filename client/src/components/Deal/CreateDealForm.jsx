import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getAllBuyers, getAllProperties, createDeal } from "@/utils/api";
import { toast } from "react-toastify";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DateInput } from "@/components/ui/date-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreateDealForm() {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        buyerId: "",
        propertyId: "",
        purchasePrice: "",
        salePrice: "",
        downPayment: "",
        interestRate: "",
        term: "",
        monthlyPayment: "",
        closingCosts: "",
        transferTaxes: "",
        appraisalValue: "",
        loanOriginationFee: "",
        financingType: "Owner",
        startDate: new Date(),
        notes: "",
    });

    // Fetch buyers and properties
    const { data: buyers, isLoading: buyersLoading } = useQuery(
        "allBuyers",
        getAllBuyers
    );

    const { data: properties, isLoading: propertiesLoading } = useQuery(
        "availableProperties",
        async () => {
            const allProps = await getAllProperties();
            // Filter for only available properties
            return allProps.filter(prop => prop.status === "Available");
        }
    );

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle select changes
    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // If property is selected, pre-fill related data
        if (name === "propertyId" && value) {
            const property = properties.find(p => p.id === value);
            if (property) {
              // Format numbers as strings with commas
              const formatNumber = (num) => {
                if (num === undefined || num === null) return '';
                return num.toLocaleString('en-US');
              };
              
              setFormData(prev => ({
                ...prev,
                purchasePrice: formatNumber(property.purchasePrice),
                salePrice: formatNumber(property.askingPrice),
                appraisalValue: formatNumber(property.askingPrice)
              }));
            }
          }
    };

    // Handle date change
    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            startDate: date
        }));
    };

    // Format currency input
    const formatCurrency = (e) => {
        const { name, value } = e.target;
        const numericValue = value.replace(/[^0-9.]/g, '');

        if (numericValue) {
            const formattedValue = Number(numericValue).toLocaleString('en-US');
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Parse currency string to number
    const parseCurrency = (value) => {
        if (!value) return 0;
        // Convert to string first to ensure compatibility
        return parseFloat(String(value).replace(/,/g, ''));
      };


    // Calculate loan amount and monthly payment
    useEffect(() => {
        const salePrice = parseCurrency(formData.salePrice);
        const downPayment = parseCurrency(formData.downPayment);
        const interestRate = parseFloat(formData.interestRate);
        const term = parseInt(formData.term);

        if (salePrice && downPayment && !isNaN(downPayment) && downPayment < salePrice) {
            const loanAmount = salePrice - downPayment;

            // Calculate monthly payment if we have interest rate and term
            if (interestRate && term && !isNaN(interestRate) && !isNaN(term)) {
                const monthlyRate = interestRate / 100 / 12;
                const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

                setFormData(prev => ({
                    ...prev,
                    monthlyPayment: monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }));
            }
        }
    }, [formData.salePrice, formData.downPayment, formData.interestRate, formData.term]);

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!formData.buyerId || !formData.propertyId || !formData.salePrice ||
            !formData.downPayment || !formData.interestRate || !formData.term) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
                // Parse currency values to numbers
                const dealData = {
                  ...formData,
                  purchasePrice: parseCurrency(formData.purchasePrice),
                  salePrice: parseCurrency(formData.salePrice),
                  downPayment: parseCurrency(formData.downPayment),
                  monthlyPayment: parseCurrency(formData.monthlyPayment),
                  closingCosts: parseCurrency(formData.closingCosts || 0),
                  transferTaxes: parseCurrency(formData.transferTaxes || 0),
                  appraisalValue: parseCurrency(formData.appraisalValue || 0),
                  loanOriginationFee: parseCurrency(formData.loanOriginationFee || 0),
                  interestRate: parseFloat(formData.interestRate),
                  term: parseInt(formData.term),
                };
            console.log("Submitting deal data:", dealData);

            // Create the deal
            const response = await createDeal(dealData);

            toast.success("Deal created successfully!");
            navigate(`/admin/deals/${response.deal.id}`);
        } catch (error) {
            console.error("Error creating deal:", error);
            toast.error("Failed to create deal");
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Create New Deal</CardTitle>
                <CardDescription>
                    Create a new financing deal between a buyer and a property
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid grid-cols-3 mb-4">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="financial">Financial Details</TabsTrigger>
                            <TabsTrigger value="additional">Additional Details</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            {/* Buyer Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="buyerId">Buyer</Label>
                                <Select
                                    value={formData.buyerId}
                                    onValueChange={(value) => handleSelectChange("buyerId", value)}
                                >
                                    <SelectTrigger id="buyerId">
                                        <SelectValue placeholder="Select a buyer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {!buyersLoading && buyers && buyers.map(buyer => (
                                            <SelectItem key={buyer.id} value={buyer.id}>
                                                {buyer.firstName} {buyer.lastName} ({buyer.buyerType})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Property Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="propertyId">Property</Label>
                                <Select
                                    value={formData.propertyId}
                                    onValueChange={(value) => handleSelectChange("propertyId", value)}
                                >
                                    <SelectTrigger id="propertyId">
                                        <SelectValue placeholder="Select a property" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {!propertiesLoading && properties && properties.map(property => (
                                            <SelectItem key={property.id} value={property.id}>
                                                {property.title || property.streetAddress} - ${property.askingPrice?.toLocaleString()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Start Date */}
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <DateInput
                                    date={formData.startDate}
                                    setDate={handleDateChange}
                                />
                            </div>

                            {/* Financing Type */}
                            <div className="space-y-2">
                                <Label htmlFor="financingType">Financing Type</Label>
                                <Select
                                    value={formData.financingType}
                                    onValueChange={(value) => handleSelectChange("financingType", value)}
                                >
                                    <SelectTrigger id="financingType">
                                        <SelectValue placeholder="Select financing type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Owner">Owner Financing</SelectItem>
                                        <SelectItem value="Bank">Bank Financing</SelectItem>
                                        <SelectItem value="Cash">Cash</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        <TabsContent value="financial" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Purchase Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="purchasePrice">
                                        Purchase Price (Your Cost)
                                    </Label>
                                    <Input
                                        id="purchasePrice"
                                        name="purchasePrice"
                                        value={formData.purchasePrice}
                                        onChange={handleInputChange}
                                        onBlur={formatCurrency}
                                        placeholder="0.00"
                                    />
                                </div>

                                {/* Sale Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="salePrice">
                                        Sale Price (To Buyer) *
                                    </Label>
                                    <Input
                                        id="salePrice"
                                        name="salePrice"
                                        value={formData.salePrice}
                                        onChange={handleInputChange}
                                        onBlur={formatCurrency}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                {/* Down Payment */}
                                <div className="space-y-2">
                                    <Label htmlFor="downPayment">
                                        Down Payment *
                                    </Label>
                                    <Input
                                        id="downPayment"
                                        name="downPayment"
                                        value={formData.downPayment}
                                        onChange={handleInputChange}
                                        onBlur={formatCurrency}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                {/* Interest Rate */}
                                <div className="space-y-2">
                                    <Label htmlFor="interestRate">
                                        Interest Rate (%) *
                                    </Label>
                                    <Input
                                        id="interestRate"
                                        name="interestRate"
                                        value={formData.interestRate}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                {/* Term */}
                                <div className="space-y-2">
                                    <Label htmlFor="term">
                                        Term (Months) *
                                    </Label>
                                    <Input
                                        id="term"
                                        name="term"
                                        type="number"
                                        value={formData.term}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        required
                                    />
                                </div>

                                {/* Monthly Payment (Calculated) */}
                                <div className="space-y-2">
                                    <Label htmlFor="monthlyPayment">
                                        Monthly Payment (Calculated)
                                    </Label>
                                    <Input
                                        id="monthlyPayment"
                                        name="monthlyPayment"
                                        value={formData.monthlyPayment}
                                        readOnly
                                        placeholder="0.00"
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="additional" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Closing Costs */}
                                <div className="space-y-2">
                                    <Label htmlFor="closingCosts">
                                        Closing Costs
                                    </Label>
                                    <Input
                                        id="closingCosts"
                                        name="closingCosts"
                                        value={formData.closingCosts}
                                        onChange={handleInputChange}
                                        onBlur={formatCurrency}
                                        placeholder="0.00"
                                    />
                                </div>

                                {/* Transfer Taxes */}
                                <div className="space-y-2">
                                    <Label htmlFor="transferTaxes">
                                        Transfer Taxes
                                    </Label>
                                    <Input
                                        id="transferTaxes"
                                        name="transferTaxes"
                                        value={formData.transferTaxes}
                                        onChange={handleInputChange}
                                        onBlur={formatCurrency}
                                        placeholder="0.00"
                                    />
                                </div>

                                {/* Appraisal Value */}
                                <div className="space-y-2">
                                    <Label htmlFor="appraisalValue">
                                        Appraisal Value
                                    </Label>
                                    <Input
                                        id="appraisalValue"
                                        name="appraisalValue"
                                        value={formData.appraisalValue}
                                        onChange={handleInputChange}
                                        onBlur={formatCurrency}
                                        placeholder="0.00"
                                    />
                                </div>

                                {/* Loan Origination Fee */}
                                <div className="space-y-2">
                                    <Label htmlFor="loanOriginationFee">
                                        Loan Origination Fee
                                    </Label>
                                    <Input
                                        id="loanOriginationFee"
                                        name="loanOriginationFee"
                                        value={formData.loanOriginationFee}
                                        onChange={handleInputChange}
                                        onBlur={formatCurrency}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">
                                    Notes
                                </Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Additional notes about this deal..."
                                    rows={4}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-6 flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/admin/deals")}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Create Deal</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}