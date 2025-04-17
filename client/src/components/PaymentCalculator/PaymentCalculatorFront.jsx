import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PieChart, Pie, Cell, Label as RechartsLabel, Tooltip } from "recharts";
import { AlertCircle } from "lucide-react";

// Helper to format term in months to "X Years Y Months"
const formatLoanTerm = (term) => {
  const months = Number(term) || 0;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  let result = "";
  if (years > 0) result += `${years} ${years === 1 ? "Year" : "Years"}`;
  if (remainingMonths > 0) {
    if (result) result += " ";
    result += `${remainingMonths} ${remainingMonths === 1 ? "Month" : "Months"}`;
  }
  return result || "0 Months";
};

export default function PaymentCalculatorFront({ propertyData }) {
  const [selectedOption, setSelectedOption] = useState("1");
  const [includeAllFees, setIncludeAllFees] = useState(false);

  // Theme colors
  const themeColors = {
    primary: "#3f4f24",     // --primary (green)
    primaryLight: "#f4f7ee", // --primary-50
    primaryMid: "#d1dfb9",  // --primary-200
    
    secondary: "#324c48",   // --secondary (teal)
    secondaryLight: "#f0f5f4", // --secondary-50
    secondaryMid: "#a2c3be", // --secondary-300
    
    accent: "#D4A017",      // --accent (gold)
    accentLight: "#fcf7e8", // --accent-50
    accentMid: "#f0cd75",   // --accent-300
    
    text: "#030001",        // --text
    background: "#FDF8F2",  // --background
    
    // Vibrant colors for chart segments
    hoaColor: "#01783e",    // Bright green
    feeColor: "#d03c0b",    // Vibrant orange-red
    taxColor: "#ffa500",    // Bright orange
  };

  // Pick data based on selected option, including loanAmount
  const { interest, monthlyPayment, downPayment, loanAmount } = useMemo(() => {
    switch (selectedOption) {
      case "2":
        return {
          interest: propertyData.interestTwo,
          monthlyPayment: propertyData.monthlyPaymentTwo,
          downPayment: propertyData.downPaymentTwo,
          loanAmount: propertyData.loanAmountTwo,
        };
      case "3":
        return {
          interest: propertyData.interestThree,
          monthlyPayment: propertyData.monthlyPaymentThree,
          downPayment: propertyData.downPaymentThree,
          loanAmount: propertyData.loanAmountThree,
        };
      default:
        // "1"
        return {
          interest: propertyData.interestOne,
          monthlyPayment: propertyData.monthlyPaymentOne,
          downPayment: propertyData.downPaymentOne,
          loanAmount: propertyData.loanAmountOne,
        };
    }
  }, [selectedOption, propertyData]);

  // Calculate monthly tax (yearly tax divided by 12)
  const monthlyTax = (propertyData.tax || 0) / 12;

  // Parse numeric values and ensure they're not NaN
  const parsedMonthlyPayment = parseFloat(monthlyPayment) || 0;
  const parsedMonthlyTax = parseFloat(monthlyTax) || 0;
  const parsedHoaMonthly = parseFloat(propertyData.hoaMonthly) || 0;
  const parsedServiceFee = parseFloat(propertyData.serviceFee) || 0;

  // Calculate total monthly payment
  const baseMonthlyPayment = parsedMonthlyPayment;
  const totalAdditionalFees = parsedMonthlyTax + parsedHoaMonthly + parsedServiceFee;
  const totalMonthlyPayment = baseMonthlyPayment + (includeAllFees ? totalAdditionalFees : 0);

  // Prepare chart data based on toggle state
  const chartData = includeAllFees 
    ? [
        { name: "Principal & Interest", value: parsedMonthlyPayment, fill: themeColors.primary },
        { name: "Tax", value: parsedMonthlyTax, fill: themeColors.taxColor },
        { name: "HOA", value: parsedHoaMonthly, fill: themeColors.hoaColor },
        { name: "Service Fee", value: parsedServiceFee, fill: themeColors.feeColor }
      ].filter(item => item.value > 0) // Only include items with values > 0
    : [
        { name: "Principal & Interest", value: parsedMonthlyPayment, fill: themeColors.secondary }
      ];

  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg w-full max-w-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold" style={{ color: "#030001" }}>
          Payment Calculator
        </CardTitle>
        <CardDescription className="text-sm" style={{ color: "#576756" }}>
          <span>Compare Payment Plans For This Property</span>
          <div>
            <Label className="text-sm font-semibold mb-3 block" style={{ color: themeColors.text }}>
              Choose a Payment Plan
            </Label>
            
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { id: "option1", value: "1", label: "Plan 1" },
                { id: "option2", value: "2", label: "Plan 2" },
                { id: "option3", value: "3", label: "Plan 3" }
              ].map((option) => (
                <div 
                  key={option.id}
                  className={`
                    relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer
                    ${selectedOption === option.value 
                      ? 'ring-2 ring-offset-1' 
                      : 'hover:shadow-md'}
                  `}
                  style={{
                    backgroundColor: selectedOption === option.value ? themeColors.primaryLight : 'white',
                    borderColor: selectedOption === option.value ? themeColors.primary : '#e2e8f0',
                    ringColor: themeColors.primary,
                    boxShadow: selectedOption === option.value ? '0 1px 3px rgba(0,0,0,0.12)' : 'none'
                  }}
                  onClick={() => setSelectedOption(option.value)}
                >
                  {/* Hidden radio input */}
                  <input
                    type="radio"
                    id={option.id}
                    value={option.value}
                    checked={selectedOption === option.value}
                    onChange={() => setSelectedOption(option.value)}
                    className="sr-only"
                  />
                  
                  {/* Content */}
                  <div className="p-3 text-center relative">
                    {/* Selected indicator dot */}
                    {selectedOption === option.value && (
                      <div 
                        className="absolute top-2 right-2 w-2 h-2 rounded-full"
                        style={{ backgroundColor: themeColors.primary }}
                      />
                    )}
                    
                    <div 
                      className={`font-medium text-sm mb-1 ${selectedOption === option.value ? 'text-primary' : 'text-gray-500'}`}
                      style={{ color: selectedOption === option.value ? themeColors.primary : '#4b5563' }}
                    >
                      {option.label}
                    </div>
                    
                    {/* add pricing info here */}
                    <div 
                      className="text-xs"
                      style={{ color: themeColors.secondary }}
                    >
                      {selectedOption === option.value ? 'Selected' : 'Click to select'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Left Column: Donut Chart */}
          <div className="sm:w-1/2 flex items-center justify-center">
            <div className="w-[300px] h-[300px]">
              <PieChart width={300} height={300}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={78}
                  outerRadius={100}
                  strokeWidth={3}
                  stroke="#FDF8F2" // Background color for gaps
                  // paddingAngle={1} // This creates gaps between segments
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill} 
                    />
                  ))}
                  <RechartsLabel
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="text-2xl font-bold"
                              style={{ fill: themeColors.primary }}
                            >
                              ${totalMonthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 22}
                              className="text-sm"
                              style={{ fill: themeColors.secondary }}
                            >
                              /mo
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`} />
              </PieChart>
            </div>
          </div>

          {/* Right Column: Payment Summary */}
          <div className="sm:w-1/2 space-y-6">
            {/* Fee Warning/Info Banner with Toggle */}
            <div className={`p-3 rounded-lg mb-4 flex flex-col gap-2 text-sm ${!includeAllFees ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>
                  {includeAllFees 
                    ? "Monthly payment includes tax, HOA fees, and service fees."
                    : "Monthly payment only shows principal and interest."}
                </p>
              </div>
              
              {/* Fee Toggle */}
              <div className="flex items-center space-x-2 mt-1 ml-7">
                <Switch 
                  id="include-fees" 
                  checked={includeAllFees} 
                  onCheckedChange={setIncludeAllFees}
                  className={`${includeAllFees ? 'bg-[#3f4f24]' : 'bg-[#8A8B7F]'} 
                              transition-colors data-[state=checked]:bg-[#3f4f24]`}
                  style={{
                    backgroundColor: includeAllFees ? themeColors.primary : '#8A8B7F'
                  }}
                />
                <Label htmlFor="include-fees" className="cursor-pointer" style={{ color: themeColors.text }}>
                  Include Tax, HOA & Service Fee
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Principal & Interest */}
              <div>
                <Label className="block text-sm font-semibold mb-1" style={{ color: themeColors.text }}>
                 Monthly Payment
                </Label>
                <div className="text-xl font-bold" style={{ color: themeColors.secondary }}>
                  ${parsedMonthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}/mo
                </div>
              </div>

              {/* Total Monthly Payment (only when toggle is on) */}
              {includeAllFees && totalAdditionalFees > 0 && (
                <div>
                  <Label className="block text-sm font-semibold mb-1" style={{ color: "#030001" }}>
                    Total Monthly Payment
                  </Label>
                  <div className="text-xl font-bold" style={{ color: themeColors.secondary }}>
                    ${totalMonthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}/mo
                  </div>
                </div>
              )}

              {/* Loan Amount */}
              <div>
                <Label className="block text-sm font-semibold mb-1" style={{ color: "#030001" }}>
                  Loan Amount
                </Label>
                <div className="text-base" style={{ color: themeColors.text }}>
                  ${loanAmount?.toLocaleString() || 0}
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <Label className="block text-sm font-semibold mb-1" style={{ color: "#030001" }}>
                  Down Payment
                </Label>
                <div className="text-base" style={{ color: "#030001" }}>
                  ${downPayment?.toLocaleString() || 0}
                </div>
              </div>

              {/* Property Tax */}
              <div>
                <Label className="block text-sm font-semibold mb-1" style={{ color: "#030001" }}>
                  Property Tax
                </Label>
                <div className="text-base" style={{ color: "#030001" }}>
                  ${parsedMonthlyTax.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}/mo
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <Label className="block text-sm font-semibold mb-1" style={{ color: "#030001" }}>
                  Interest Rate
                </Label>
                <div className="text-base" style={{ color: "#030001" }}>
                  {interest || 0}% APR
                </div>
              </div>

              {/* HOA Fees - Show if available */}
              {parsedHoaMonthly > 0 && (
                <div>
                  <Label className="block text-sm font-semibold mb-1" style={{ color: "#030001" }}>
                    HOA Fee
                  </Label>
                  <div className="text-base" style={{ color: "#030001" }}>
                    ${parsedHoaMonthly.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}/mo
                  </div>
                </div>
              )}

              {/* Loan Term */}
              <div>
                <Label className="block text-sm font-semibold mb-1" style={{ color: "#030001" }}>
                  Loan Term
                </Label>
                <div className="text-base" style={{ color: "#030001" }}>
                  {propertyData.term} Months
                </div>
              </div>

              {/* Service Fee */}
              {parsedServiceFee > 0 && (
                <div>
                  <Label className="block text-sm font-semibold mb-1" style={{ color: "#030001" }}>
                    Service Fee
                  </Label>
                  <div className="text-base" style={{ color: "#030001" }}>
                    ${parsedServiceFee.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}/mo
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="text-xs" style={{ color: themeColors.secondary }}>
          You may pay off the property at any time with no pre-payment penalty. Closing Costs: Buyer pays all closing costs
        </div>
      </CardFooter>
    </Card>
  );
}