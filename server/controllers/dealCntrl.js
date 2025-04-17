// server/controllers/dealCntrl.js
import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// Create a new deal
export const createDeal = asyncHandler(async (req, res) => {
  const {
    buyerId,
    propertyId,
    purchasePrice,
    salePrice,
    downPayment,
    interestRate,
    term,
    monthlyPayment,
    closingCosts,
    transferTaxes,
    appraisalValue,
    loanOriginationFee,
    financingType,
    startDate,
    notes,
  } = req.body;

  // Validate required fields
  if (!buyerId || !propertyId || !purchasePrice || !salePrice || !downPayment || 
      !interestRate || !term || !monthlyPayment || !startDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Verify buyer and property exist
    const buyer = await prisma.buyer.findUnique({ where: { id: buyerId } });
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    const property = await prisma.residency.findUnique({ where: { id: propertyId } });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Calculate loan amount
    const loanAmount = salePrice - downPayment;
    
    // Calculate total expected revenue
    const totalExpectedRevenue = downPayment + (monthlyPayment * term);
    
    // Create the deal
    const deal = await prisma.deal.create({
      data: {
        buyerId,
        propertyId,
        purchasePrice,
        salePrice,
        downPayment,
        loanAmount,
        interestRate,
        term,
        monthlyPayment,
        closingCosts: closingCosts || 0,
        transferTaxes: transferTaxes || 0,
        appraisalValue: appraisalValue || salePrice,
        loanOriginationFee: loanOriginationFee || 0,
        financingType: financingType || "Owner",
        status: "ACTIVE",
        startDate: new Date(startDate),
        totalExpectedRevenue,
        notes,
      }
    });

    // Generate payment schedule
    const startDateObj = new Date(startDate);
    const payments = [];

    for (let i = 1; i <= term; i++) {
      const dueDate = new Date(startDateObj);
      dueDate.setMonth(dueDate.getMonth() + i);
      
      // Calculate amortization
      const remainingMonths = term - i + 1;
      const monthlyRate = interestRate / 100 / 12;
      const remainingPrincipal = loanAmount * Math.pow(1 + monthlyRate, remainingMonths) - 
                                (monthlyPayment * (Math.pow(1 + monthlyRate, remainingMonths) - 1) / monthlyRate);
      const interest = remainingPrincipal * monthlyRate;
      const principal = monthlyPayment - interest;
      
      payments.push({
        dealId: deal.id,
        paymentNumber: i,
        amount: monthlyPayment,
        dueDate,
        principal,
        interest,
        status: "PENDING"
      });
    }

    await prisma.payment.createMany({
      data: payments
    });

    // Update property status to sold
    await prisma.residency.update({
      where: { id: propertyId },
      data: { status: "Sold" }
    });

    res.status(201).json({
      message: "Deal created successfully",
      deal
    });
  } catch (error) {
    console.error("Error creating deal:", error);
    res.status(500).json({
      message: "An error occurred while creating the deal",
      error: error.message
    });
  }
});

// Get all deals
export const getAllDeals = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    buyerId,
    propertyId,
    sort = "startDate",
    order = "desc" 
  } = req.query;
  
  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    
    // Build filter
    const where = {};
    if (status) where.status = status;
    if (buyerId) where.buyerId = buyerId;
    if (propertyId) where.propertyId = propertyId;
    
    // Get total count
    const totalCount = await prisma.deal.count({ where });
    
    // Get deals with relationships
    const deals = await prisma.deal.findMany({
      where,
      include: {
        buyer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            buyerType: true
          }
        },
        property: {
          select: {
            title: true,
            streetAddress: true,
            city: true,
            state: true,
            zip: true,
            imageUrls: true
          }
        }
      },
      orderBy: { [sort]: order.toLowerCase() },
      skip,
      take
    });
    
    res.status(200).json({
      deals,
      pagination: {
        totalCount,
        page: parseInt(page),
        pageSize: parseInt(limit),
        totalPages: Math.ceil(totalCount / take)
      }
    });
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({
      message: "An error occurred while fetching deals",
      error: error.message
    });
  }
});

// Get deal by ID
export const getDealById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        buyer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            buyerType: true
          }
        },
        property: {
          select: {
            title: true,
            streetAddress: true,
            city: true,
            state: true,
            zip: true,
            imageUrls: true
          }
        },
        payments: {
          orderBy: { paymentNumber: 'asc' }
        }
      }
    });
    
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }
    
    res.status(200).json(deal);
  } catch (error) {
    console.error("Error fetching deal:", error);
    res.status(500).json({
      message: "An error occurred while fetching the deal",
      error: error.message
    });
  }
});

// Update deal
export const updateDeal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    status,
    completionDate,
    notes,
    paymentsReceived,
    totalPaidToDate,
    principalPaid,
    interestPaid,
    currentRevenue,
    profitLoss
  } = req.body;
  
  try {
    const existingDeal = await prisma.deal.findUnique({
      where: { id }
    });
    
    if (!existingDeal) {
      return res.status(404).json({ message: "Deal not found" });
    }
    
    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: {
        status: status || undefined,
        completionDate: completionDate ? new Date(completionDate) : undefined,
        notes: notes || undefined,
        paymentsReceived: paymentsReceived !== undefined ? paymentsReceived : undefined,
        totalPaidToDate: totalPaidToDate !== undefined ? totalPaidToDate : undefined,
        principalPaid: principalPaid !== undefined ? principalPaid : undefined,
        interestPaid: interestPaid !== undefined ? interestPaid : undefined,
        currentRevenue: currentRevenue !== undefined ? currentRevenue : undefined,
        profitLoss: profitLoss !== undefined ? profitLoss : undefined
      }
    });
    
    res.status(200).json({
      message: "Deal updated successfully",
      deal: updatedDeal
    });
  } catch (error) {
    console.error("Error updating deal:", error);
    res.status(500).json({
      message: "An error occurred while updating the deal",
      error: error.message
    });
  }
});

// Record a payment
export const recordPayment = asyncHandler(async (req, res) => {
  const { dealId, paymentNumber, paymentDate, amount, lateFee } = req.body;
  
  try {
    // Find the payment
    const payment = await prisma.payment.findFirst({
      where: {
        dealId,
        paymentNumber: parseInt(paymentNumber)
      }
    });
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    // Get the deal
    const deal = await prisma.deal.findUnique({
      where: { id: dealId }
    });
    
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }
    
    // Determine if payment is late
    const paymentDateObj = new Date(paymentDate);
    const dueDate = new Date(payment.dueDate);
    const isLate = paymentDateObj > dueDate;
    
    // Update the payment
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentDate: paymentDateObj,
        status: isLate ? "LATE" : "PAID",
        lateFee: isLate ? (lateFee || 0) : 0,
        amount: amount || payment.amount
      }
    });
    
    // Update deal stats
    const actualAmount = (amount || payment.amount) + (isLate ? (lateFee || 0) : 0);
    
    await prisma.deal.update({
      where: { id: dealId },
      data: {
        paymentsReceived: { increment: 1 },
        paymentsOnTime: { increment: isLate ? 0 : 1 },
        paymentsLate: { increment: isLate ? 1 : 0 },
        totalPaidToDate: { increment: actualAmount },
        principalPaid: { increment: payment.principal },
        interestPaid: { increment: payment.interest },
        currentRevenue: { increment: actualAmount },
        profitLoss: { 
          set: deal.purchasePrice < (deal.totalPaidToDate + actualAmount) ? 
            (deal.totalPaidToDate + actualAmount - deal.purchasePrice) : 
            (deal.purchasePrice - (deal.totalPaidToDate + actualAmount))
        }
      }
    });
    
    res.status(200).json({
      message: "Payment recorded successfully",
      payment: updatedPayment
    });
  } catch (error) {
    console.error("Error recording payment:", error);
    res.status(500).json({
      message: "An error occurred while recording the payment",
      error: error.message
    });
  }
});

// Get deal financial summary
export const getDealFinancialSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        payments: true
      }
    });
    
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }
    
    // Calculate metrics
    const totalPayments = deal.payments.length;
    const paidPayments = deal.payments.filter(p => p.status === "PAID" || p.status === "LATE").length;
    const remainingPayments = totalPayments - paidPayments;
    const remainingBalance = deal.loanAmount - deal.principalPaid;
    
    // Calculate projected completion date
    const lastPaymentDate = deal.payments
      .filter(p => p.paymentDate)
      .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0]?.paymentDate;
    
    const projectedCompletionDate = deal.payments
      .sort((a, b) => b.paymentNumber - a.paymentNumber)[0]?.dueDate;
    
    // Calculate ROI
    const totalInvestment = deal.purchasePrice + (deal.closingCosts || 0) + 
                          (deal.transferTaxes || 0) + (deal.loanOriginationFee || 0);
    const currentROI = ((deal.currentRevenue - totalInvestment) / totalInvestment) * 100;
    const projectedROI = ((deal.totalExpectedRevenue - totalInvestment) / totalInvestment) * 100;
    
    // Create summary
    const summary = {
      dealId: deal.id,
      salePrice: deal.salePrice,
      purchasePrice: deal.purchasePrice,
      downPayment: deal.downPayment,
      loanAmount: deal.loanAmount,
      interestRate: deal.interestRate,
      term: deal.term,
      monthlyPayment: deal.monthlyPayment,
      startDate: deal.startDate,
      status: deal.status,
      totalPayments,
      paidPayments,
      remainingPayments,
      totalPaidToDate: deal.totalPaidToDate,
      principalPaid: deal.principalPaid,
      interestPaid: deal.interestPaid,
      remainingBalance,
      currentRevenue: deal.currentRevenue,
      totalExpectedRevenue: deal.totalExpectedRevenue,
      profitLoss: deal.profitLoss,
      currentROI,
      projectedROI,
      lastPaymentDate,
      projectedCompletionDate,
      completionDate: deal.completionDate
    };
    
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching deal summary:", error);
    res.status(500).json({
      message: "An error occurred while fetching the deal summary",
      error: error.message
    });
  }
});