
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Utility: Format numbers as currency
const formatCurrency = (value) => {
  if (!value || isNaN(value)) return "";
  return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Utility: Format currency for display in input fields
const formatInputCurrency = (value) => {
  if (!value) return "";
  // Remove any non-digit characters except decimal point
  const numericValue = typeof value === 'string' ? value.replace(/[^0-9.]/g, '') : value.toString();
  // Parse to a number and format with commas
  return Number(numericValue).toLocaleString('en-US');
};

// Utility: Parse currency string to number
const parseCurrencyToNumber = (value) => {
  // Remove commas and convert to number
  if (!value) return 0;
  return parseFloat(value.toString().replace(/,/g, ''));
};

// Utility: Format term (in months) into "X Years Y Months"
const formatTerm = (term) => {
  const months = Number(term) || 0;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  let result = "";
  if (years > 0) result += `${years} ${years === 1 ? "Year" : "Years"}`;
  if (remainingMonths > 0) {
    if (result) result += " ";
    result += `${remainingMonths} ${remainingMonths === 1 ? "Month" : "Months"}`;
  }
  return result || "";
};

export default function PaymentCalculatorBack({ formData, handleChange }) {
  // Sorting options state
  const [sortOption, setSortOption] = useState("");

  // Enhanced input handler for currency formatting
  const handleCurrencyInputChange = (e) => {
    const { name, value } = e.target;
    
    // Remove commas for proper numeric handling
    const numericValue = value.replace(/,/g, '');
    
    // Update the display value with comma formatting
    const formattedValue = numericValue ? Number(numericValue).toLocaleString('en-US') : '';
    
    // Update the form with the formatted value for display
    handleChange({ 
      target: { 
        name, 
        value: formattedValue,
        // Store original numeric value as a data attribute for calculations
        dataset: { numericValue }
      } 
    });
  };
  
  // Handle blur for general currency inputs
  const handleCurrencyBlur = () => {
    // Trigger recalculation for all plans to ensure consistency
    recalcPlan("One");
    recalcPlan("Two");
    recalcPlan("Three");
  };

  // For Down Payment manual input with special handling
  const handleDownPaymentChange = (planKey, e) => {
    const { value } = e.target;
    const fieldName = `downPayment${planKey}`;
    
    // Remove commas for calculation
    const numericValue = value.replace(/,/g, '');
    
    // Format for display
    const formattedValue = numericValue ? Number(numericValue).toLocaleString('en-US') : '';
    
    // Update the form data with the formatted value
    handleChange({ target: { name: fieldName, value: formattedValue } });
    
    // Set the source to manual
    handleChange({ target: { name: `downPayment${planKey}Source`, value: "manual" } });
  };
  
  // Handle blur (clicking out) of Down Payment fields
  const handleDownPaymentBlur = (planKey) => {
    // Manually trigger a recalculation for this plan
    recalcPlan(planKey);
  };

  // Helper: Calculate monthly payment using a basic amortization formula
  const calculateMonthlyPayment = (loan, rate, term) => {
    const principal = Number(loan) || 0;
    const annualRate = Number(rate) / 100 || 0;
    const months = Number(term) || 0;
    if (principal <= 0 || annualRate <= 0 || months <= 0) return 0;
    const monthlyRate = annualRate / 12;
    const numerator = monthlyRate * principal;
    const denominator = 1 - Math.pow(1 + monthlyRate, -months);
    return denominator > 0 ? numerator / denominator : 0;
  };

  // Custom handler for Select components
  const handleSelectChange = (name, value) => {
    handleChange({ target: { name, value } });
  };

  // For Sliders: value comes as an array, e.g., [50]
  const handleSliderChange = (name, value) => {
    handleChange({ target: { name, value: value[0] } });
  };

  // Recalculation logic per plan ("One", "Two", "Three")
  // This function is both used by effects and can be called manually
  const recalcPlan = (planKey) => {
    const { term } = formData;
    
    // Parse financing price removing commas
    const financeVal = parseCurrencyToNumber(formData.financingPrice) || 0;

    const downPaymentField = `downPayment${planKey}`;
    const downPaymentPercentField = `downPayment${planKey}Percent`;
    const loanAmountField = `loanAmount${planKey}`;
    const interestRateField = `interest${planKey}`;
    const monthlyPaymentField = `monthlyPayment${planKey}`;
    const sliderField = `downPayment${planKey}Slider`;
    const sourceField = `downPayment${planKey}Source`;

    // Parse the down payment value, removing any commas
    const dpManual = parseCurrencyToNumber(formData[downPaymentField]);
    const dpPercentVal = Number(formData[downPaymentPercentField]) || 5;
    const sliderVal = Number(formData[sliderField]) || 1;
    const interestRateVal = Number(formData[interestRateField]) || 0;

    // Determine new down payment based on the last update source
    let newDownPayment = 0;
    const source = formData[sourceField];
    if (source === "manual") {
      newDownPayment = dpManual || 0;
    } else if (source === "selector") {
      newDownPayment = financeVal * (dpPercentVal / 100);
    } else if (source === "slider") {
      newDownPayment = financeVal * (sliderVal / 100);
    }

    // Calculate Loan Amount = financingPrice - downPayment
    const newLoanAmount = financeVal - newDownPayment;
    
    // Calculate Monthly Payment using the amortization formula
    const newMonthlyPayment = calculateMonthlyPayment(newLoanAmount, interestRateVal, Number(term));

    // Update state with formatted values for display
    handleChange({ 
      target: { 
        name: downPaymentField, 
        value: formatInputCurrency(newDownPayment.toFixed(2)) 
      } 
    });
    
    handleChange({ 
      target: { 
        name: loanAmountField, 
        value: formatInputCurrency(newLoanAmount.toFixed(2)) 
      } 
    });
    
    handleChange({ 
      target: { 
        name: monthlyPaymentField, 
        value: formatInputCurrency(newMonthlyPayment.toFixed(2)) 
      } 
    });
  };

  // Sort plans based on selected criteria
  const sortPlans = () => {
    // Skip if no sort option is selected
    if (!sortOption) return;

    // Create plan data objects to sort
    const planData = [
      {
        key: "One",
        downPayment: parseCurrencyToNumber(formData.downPaymentOne),
        interest: formData.interestOne,
        monthlyPayment: parseCurrencyToNumber(formData.monthlyPaymentOne),
        downPaymentPercent: formData.downPaymentOnePercent,
        downPaymentSlider: formData.downPaymentOneSlider,
        downPaymentSource: formData.downPaymentOneSource || "manual"
      },
      {
        key: "Two",
        downPayment: parseCurrencyToNumber(formData.downPaymentTwo),
        interest: formData.interestTwo,
        monthlyPayment: parseCurrencyToNumber(formData.monthlyPaymentTwo),
        downPaymentPercent: formData.downPaymentTwoPercent,
        downPaymentSlider: formData.downPaymentTwoSlider,
        downPaymentSource: formData.downPaymentTwoSource || "manual"
      },
      {
        key: "Three",
        downPayment: parseCurrencyToNumber(formData.downPaymentThree),
        interest: formData.interestThree,
        monthlyPayment: parseCurrencyToNumber(formData.monthlyPaymentThree),
        downPaymentPercent: formData.downPaymentThreePercent,
        downPaymentSlider: formData.downPaymentThreeSlider,
        downPaymentSource: formData.downPaymentThreeSource || "manual"
      }
    ];

    // Sort based on the selected option
    let sortedPlans = [...planData];
    
    switch (sortOption) {
      case "highToLowMonthly":
        sortedPlans.sort((a, b) => b.monthlyPayment - a.monthlyPayment);
        break;
      case "lowToHighMonthly":
        sortedPlans.sort((a, b) => a.monthlyPayment - b.monthlyPayment);
        break;
      case "highToLowDown":
        sortedPlans.sort((a, b) => b.downPayment - a.downPayment);
        break;
      case "lowToHighDown":
        sortedPlans.sort((a, b) => a.downPayment - b.downPayment);
        break;
      case "highToLowInterest":
        sortedPlans.sort((a, b) => parseFloat(b.interest) - parseFloat(a.interest));
        break;
      case "lowToHighInterest":
        sortedPlans.sort((a, b) => parseFloat(a.interest) - parseFloat(b.interest));
        break;
      default:
        return; // No sorting needed
    }

    // New order for plans (e.g., "One", "Two", "Three")
    const planOrder = ["One", "Two", "Three"];
    
    // Apply the sorted values to the plans in order
    sortedPlans.forEach((plan, index) => {
      const targetPlanKey = planOrder[index];
      
      // Update the down payment, interest rate, etc. for each plan based on sorted order
      handleChange({ target: { 
        name: `downPayment${targetPlanKey}`, 
        value: formatInputCurrency(plan.downPayment.toFixed(2)) 
      }});
      
      handleChange({ target: { 
        name: `interest${targetPlanKey}`, 
        value: plan.interest 
      }});
      
      // Also update the percent selector, slider, and source to maintain consistency
      handleChange({ target: { 
        name: `downPayment${targetPlanKey}Percent`, 
        value: plan.downPaymentPercent 
      }});
      
      handleChange({ target: { 
        name: `downPayment${targetPlanKey}Slider`, 
        value: plan.downPaymentSlider 
      }});
      
      handleChange({ target: { 
        name: `downPayment${targetPlanKey}Source`, 
        value: plan.downPaymentSource 
      }});
    });
    
    // Recalculate all plans to ensure consistency
    recalcPlan("One");
    recalcPlan("Two");
    recalcPlan("Three");
  };

  // Handle sort option change
  const handleSortOptionChange = (value) => {
    setSortOption(value);
  };

  // Effect to trigger sorting when option changes
  useEffect(() => {
    sortPlans();
  }, [sortOption]);

  // Recalculate each plan when relevant fields change:
  useEffect(() => {
    recalcPlan("One");
  }, [
    formData.financingPrice,
    formData.downPaymentOnePercent,
    formData.downPaymentOneSlider,
    formData.interestOne,
    formData.term,
    formData.downPaymentOneSource,
  ]);

  useEffect(() => {
    recalcPlan("Two");
  }, [
    formData.financingPrice,
    formData.downPaymentTwoPercent,
    formData.downPaymentTwoSlider,
    formData.interestTwo,
    formData.term,
    formData.downPaymentTwoSource,
  ]);

  useEffect(() => {
    recalcPlan("Three");
  }, [
    formData.financingPrice,
    formData.downPaymentThreePercent,
    formData.downPaymentThreeSlider,
    formData.interestThree,
    formData.term,
    formData.downPaymentThreeSource,
  ]);

  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Landivo Payment Calculator v0.0.0.3
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ------------------- Row 1 ------------------- */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          {/* Asking Price (display-only) */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Asking Price
            </Label>
            <Input
              type="text"
              readOnly
              value={formData.askingPrice}
              className="w-full bg-gray-100 text-gray-600"
            />
          </div>
          {/* Financing Price */}
          <div>
            <Label htmlFor="financingPrice" className="block text-sm font-semibold text-gray-700 mb-1">
              Financing Price
            </Label>
            <Input
              id="financingPrice"
              name="financingPrice"
              type="text"
              placeholder="Enter financing price"
              value={formData.financingPrice}
              onChange={handleCurrencyInputChange}
              onBlur={handleCurrencyBlur}
              className="w-full"
            />
          </div>
          {/* Purchase Price */}
          <div>
            <Label htmlFor="purchasePrice" className="block text-sm font-semibold text-gray-700 mb-1">
              Purchase Price (Optional)
            </Label>
            <Input
              id="purchasePrice"
              name="purchasePrice"
              type="text"
              placeholder="Enter purchase price"
              value={formData.purchasePrice}
              onChange={handleCurrencyInputChange}
              className="w-full"
            />
          </div>
          {/* Sort Options Dropdown */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Sort Plans By
            </Label>
            <Select 
              value={sortOption}
              onValueChange={handleSortOptionChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sort option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highToLowMonthly">Monthly High to Low </SelectItem>
                <SelectItem value="lowToHighMonthly">Monthly Low to High</SelectItem>
                <SelectItem value="highToLowDown">Down Payment High to Low</SelectItem>
                <SelectItem value="lowToHighDown">Down Payment Low to High</SelectItem>
                <SelectItem value="highToLowInterest">Interest High to Low</SelectItem>
                <SelectItem value="lowToHighInterest">Interest Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ------------------- Row 2 ------------------- */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
           {/* Service Fee */}
           <div>
            <Label htmlFor="serviceFee" className="block text-sm font-semibold text-gray-700 mb-1">
              Service Fee
            </Label>
            <Input
              id="serviceFee"
              name="serviceFee"
              type="text"
              placeholder="Service fee"
              value={formData.serviceFee}
              onChange={handleCurrencyInputChange}
              className="w-full"
            />
          </div>
          {/* Tax */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Yearly Tax
            </Label>
            <Input
              type="text"
              readOnly
              value={formData.tax}
              className="w-full bg-gray-100 text-gray-600"
            />
          </div>
          {/* HOA Monthly */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              HOA Monthly Fee
            </Label>
            <Input
              type="text"
              readOnly
              value={formData.hoaMonthly}
              className="w-full bg-gray-100 text-gray-600"
            />
          </div>
          {/* Term Display (in Years + Months) */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Term
            </Label>
            <Input
              type="text"
              readOnly
              value={formatTerm(formData.term)}
              className="w-full bg-gray-100 text-gray-600"
            />
          </div>
        </div>

        {/* ------------------- Row 3: Term Slider ------------------- */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-2">
              Term Slider (Months)
            </Label>
            <Slider
              value={[Number(formData.term) || 1]}
              min={1}
              max={360}
              step={1}
              onValueChange={(val) => {
                handleSliderChange("term", val);
              }}
            />
            <p className="text-xs text-gray-500 mt-2">
              Currently: {formData.term} month{Number(formData.term) > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* ============================================================
            PLAN 1
            (Now Row 4 & Row 5)
        ============================================================ */}
        {/* ------------------- Row 4: Plan 1 Details ------------------- */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          {/* Down Payment (Plan 1) */}
          <div>
            <Label htmlFor="downPaymentOne" className="block text-sm font-semibold text-gray-700 mb-1">
              Down Payment (Plan 1)
            </Label>
            <Input
              id="downPaymentOne"
              name="downPaymentOne"
              type="text"
              placeholder="Enter down payment"
              value={formData.downPaymentOne}
              onChange={(e) => handleDownPaymentChange("One", e)}
              onBlur={() => handleDownPaymentBlur("One")}
              className="w-full"
            />
          </div>
          {/* Down Payment Selector (Plan 1) */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Down Payment % (Plan 1)
            </Label>
            <Select
              value={formData.downPaymentOnePercent}
              onValueChange={(val) => {
                handleSelectChange("downPaymentOnePercent", val);
                handleSelectChange("downPaymentOneSource", "selector");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select %" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(19)].map((_, i) => {
                  const percent = 5 + i * 5;
                  return (
                    <SelectItem key={percent} value={String(percent)}>
                      {percent}% (
                      {formatCurrency((parseCurrencyToNumber(formData.financingPrice) || 0) * (percent / 100))}
                      )
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {/* Loan Amount (Plan 1) */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Loan Amount (Plan 1)
            </Label>
            <Input
              type="text"
              readOnly
              value={formData.loanAmountOne}
              className="w-full bg-gray-100"
            />
          </div>
          {/* Interest Rate (Plan 1) */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Interest Rate (Plan 1)
            </Label>
            <Select
              value={formData.interestOne}
              onValueChange={(val) => handleSelectChange("interestOne", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Rate" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(11)].map((_, i) => {
                  const rate = (4.99 + i).toFixed(2);
                  return (
                    <SelectItem key={rate} value={rate}>
                      {rate}%
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* ------------------- Row 5: Plan 1 Slider & Monthly Payment ------------------- */}
        <div className="grid grid-cols-4 gap-4">
          {/* Slider (3/4 width) */}
          <div className="col-span-3">
            <Label className="block text-sm font-semibold text-gray-700 mb-2">
              Down Payment vs. Loan Amount (Plan 1)
            </Label>
            <Slider
              value={[Number(formData.downPaymentOneSlider) || 1]}
              min={0.5}
              max={99.5}
              step={0.5}
              onValueChange={(val) => {
                handleSliderChange("downPaymentOneSlider", val);
                handleSelectChange("downPaymentOneSource", "slider");
              }}
            />
            <p className="text-xs text-gray-500 mt-2">
              Currently: {formData.downPaymentOneSlider || 1}%
            </p>
          </div>
          {/* Monthly Payment (1/4 width) */}
          <div className="col-span-1">
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Monthly Payment (Plan 1)
            </Label>
            <Input
              type="text"
              readOnly
              value={formData.monthlyPaymentOne}
              className="w-full bg-gray-100"
            />
          </div>
        </div>

        {/* ============================================================
            PLAN 2
            (Now Row 6 & Row 7)
        ============================================================ */}
        {/* ------------------- Row 6: Plan 2 Details ------------------- */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          {/* Down Payment (Plan 2) */}
          <div>
            <Label htmlFor="downPaymentTwo" className="block text-sm font-semibold text-gray-700 mb-1">
              Down Payment (Plan 2)
            </Label>
            <Input
              id="downPaymentTwo"
              name="downPaymentTwo"
              type="text"
              placeholder="Enter down payment"
              value={formData.downPaymentTwo}
              onChange={(e) => handleDownPaymentChange("Two", e)}
              onBlur={() => handleDownPaymentBlur("Two")}
              className="w-full"
            />
          </div>
          {/* Down Payment Selector (Plan 2) */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Down Payment % (Plan 2)
            </Label>
            <Select
              value={formData.downPaymentTwoPercent}
              onValueChange={(val) => {
                handleSelectChange("downPaymentTwoPercent", val);
                handleSelectChange("downPaymentTwoSource", "selector");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select %" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(19)].map((_, i) => {
                  const percent = 5 + i * 5;
                  return (
                    <SelectItem key={percent} value={String(percent)}>
                      {percent}% (
                      {formatCurrency((parseCurrencyToNumber(formData.financingPrice) || 0) * (percent / 100))}
                      )
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {/* Loan Amount (Plan 2) */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Loan Amount (Plan 2)
            </Label>
            <Input
              type="text"
              readOnly
              value={formData.loanAmountTwo}
              className="w-full bg-gray-100"
            />
          </div>
          {/* Interest Rate (Plan 2) */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Interest Rate (Plan 2)
            </Label>
            <Select
              value={formData.interestTwo}
              onValueChange={(val) => handleSelectChange("interestTwo", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Rate" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(11)].map((_, i) => {
                  const rate = (4.99 + i).toFixed(2);
                  return (
                    <SelectItem key={rate} value={rate}>
                      {rate}%
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* ------------------- Row 7: Plan 2 Slider & Monthly Payment ------------------- */}
        <div className="grid grid-cols-4 gap-4">
          {/* Slider (3/4 width) */}
          <div className="col-span-3">
            <Label className="block text-sm font-semibold text-gray-700 mb-2">
              Down Payment vs. Loan Amount (Plan 2)
            </Label>
            <Slider
              value={[Number(formData.downPaymentTwoSlider) || 1]}
              min={0.5}
              max={99.5}
              step={0.5}
              onValueChange={(val) => {
                handleSliderChange("downPaymentTwoSlider", val);
                handleSelectChange("downPaymentTwoSource", "slider");
              }}
            />
            <p className="text-xs text-gray-500 mt-2">
              Currently: {formData.downPaymentTwoSlider || 1}%
            </p>
          </div>
          {/* Monthly Payment (1/4 width) */}
          <div className="col-span-1">
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Monthly Payment (Plan 2)
            </Label>
            <Input
              type="text"
              readOnly
              value={formData.monthlyPaymentTwo}
              className="w-full bg-gray-100"
            />
          </div>
        </div>

        {/* ============================================================
            PLAN 3
            (Now Row 8 & Row 9)
        ============================================================ */}
        {/* ------------------- Row 8: Plan 3 Details ------------------- */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          {/* Down Payment (Plan 3) */}
          <div>
            <Label htmlFor="downPaymentThree" className="block text-sm font-semibold text-gray-700 mb-1">
              Down Payment (Plan 3)
            </Label>
            <Input
              id="downPaymentThree"
              name="downPaymentThree"
              type="text"
              placeholder="Enter down payment"
              value={formData.downPaymentThree}
              onChange={(e) => handleDownPaymentChange("Three", e)}
              onBlur={() => handleDownPaymentBlur("Three")}
              className="w-full"
            />
          </div>
          {/* Down Payment Selector (Plan 3) */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Down Payment % (Plan 3)
            </Label>
            <Select
              value={formData.downPaymentThreePercent}
              onValueChange={(val) => {
                handleSelectChange("downPaymentThreePercent", val);
                handleSelectChange("downPaymentThreeSource", "selector");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select %" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(19)].map((_, i) => {
                  const percent = 5 + i * 5;
                  return (
                    <SelectItem key={percent} value={String(percent)}>
                      {percent}% (
                      {formatCurrency((parseCurrencyToNumber(formData.financingPrice) || 0) * (percent / 100))}
                      )
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {/* Loan Amount (Plan 3) */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Loan Amount (Plan 3)
            </Label>
            <Input
              type="text"
              readOnly
              value={formData.loanAmountThree}
              className="w-full bg-gray-100"
            />
          </div>
          {/* Interest Rate (Plan 3) */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Interest Rate (Plan 3)
            </Label>
            <Select
              value={formData.interestThree}
              onValueChange={(val) => handleSelectChange("interestThree", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Rate" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(11)].map((_, i) => {
                  const rate = (4.99 + i).toFixed(2);
                  return (
                    <SelectItem key={rate} value={rate}>
                      {rate}%
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* ------------------- Row 9: Plan 3 Slider & Monthly Payment ------------------- */}
        <div className="grid grid-cols-4 gap-4">
          {/* Slider (3/4 width) */}
          <div className="col-span-3">
            <Label className="block text-sm font-semibold text-gray-700 mb-2">
              Down Payment vs. Loan Amount (Plan 3)
            </Label>
            <Slider
              value={[Number(formData.downPaymentThreeSlider) || 1]}
              min={0.5}
              max={99.5}
              step={0.5}
              onValueChange={(val) => {
                handleSliderChange("downPaymentThreeSlider", val);
                handleSelectChange("downPaymentThreeSource", "slider");
              }}
            />
            <p className="text-xs text-gray-500 mt-2">
              Currently: {formData.downPaymentThreeSlider || 1}%
            </p>
          </div>
          {/* Monthly Payment (1/4 width) */}
          <div className="col-span-1">
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Monthly Payment (Plan 3)
            </Label>
            <Input
              type="text"
              readOnly
              value={formData.monthlyPaymentThree}
              className="w-full bg-gray-100"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}