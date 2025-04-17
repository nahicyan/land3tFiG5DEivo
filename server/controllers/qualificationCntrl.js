// server/controllers/qualificationCntrl.js
import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";
import nodemailer from "nodemailer";

// Create a new qualification entry
export const createQualification = asyncHandler(async (req, res) => {
  try {
    const {
      propertyId,
      ownerId,
      propertyPrice,
      loanAmount,
      interestRate,
      monthlyPayment,
      downPayment,
      term,
      // Survey data
      language,
      homeUsage,
      realEstateAgent,
      homePurchaseTiming,
      currentHomeOwnership,
      currentOnAllPayments,
      downPaymentPercentage,
      employmentStatus,
      verifyIncome,
      incomeHistory,
      openCreditLines,
      totalMonthlyPayments,
      grossAnnualIncome,
      foreclosureForbearance,
      declaredBankruptcy,
      currentCreditScore,
      liensOrJudgments,
      // Personal info
      firstName,
      lastName,
      email,
      phone,
      // Property info
      propertyAddress,
      propertyCity,
      propertyState,
      propertyZip,
      // Qualification status
      qualified,
    } = req.body;

    // Check for disqualifying factors
    const disqualifiers = [];
    if (!qualified) {
      // Determine specific reason(s) for disqualification
      if (currentOnAllPayments === "No") disqualifiers.push("Payment history");
      if (foreclosureForbearance === "Yes") disqualifiers.push("Current foreclosure/forbearance"); 
      if (declaredBankruptcy === "Yes") disqualifiers.push("Recent bankruptcy");
      if (liensOrJudgments === "Yes") disqualifiers.push("Outstanding liens/judgments");
      
      if (currentCreditScore === "Poor (580-619)" || currentCreditScore === "Bad (Below 580)") 
        disqualifiers.push("Low credit score");
      
      if (verifyIncome === "No, I cannot" || verifyIncome === "No, I don't") 
        disqualifiers.push("Unable to verify income");
      
      if (incomeHistory === "No") 
        disqualifiers.push("Insufficient income history");
      
      if (grossAnnualIncome === "Less than $30,000" || grossAnnualIncome === "$30,000 - $50,000")
        disqualifiers.push("Insufficient income");
      
      // Down payment check
      if (propertyPrice && downPayment && (downPayment < propertyPrice * 0.1)) {
        disqualifiers.push("Insufficient down payment");
      }
    }

    // Create a new qualification entry
    const qualification = await prisma.qualification.create({
      data: {
        propertyId,
        ownerId: ownerId ? parseInt(ownerId) : null,
        propertyPrice: parseFloat(propertyPrice),
        loanAmount: loanAmount ? parseFloat(loanAmount) : null,
        interestRate: interestRate ? parseFloat(interestRate) : null,
        monthlyPayment: monthlyPayment ? parseFloat(monthlyPayment) : null,
        downPayment: downPayment ? parseFloat(downPayment) : null,
        term: term ? parseInt(term) : null,
        
        // Survey data
        language,
        homeUsage,
        realEstateAgent,
        homePurchaseTiming,
        currentHomeOwnership,
        currentOnAllPayments,
        employmentStatus,
        verifyIncome,
        incomeHistory,
        openCreditLines,
        totalMonthlyPayments: totalMonthlyPayments ? parseFloat(totalMonthlyPayments) : null,
        grossAnnualIncome,
        foreclosureForbearance,
        declaredBankruptcy,
        currentCreditScore,
        liensOrJudgments,
        
        // Personal info
        firstName,
        lastName,
        email,
        phone,
        
        // Status
        qualified,
        disqualificationReason: disqualifiers.length > 0 ? disqualifiers.join(", ") : null,
        
        // Property info
        propertyAddress,
        propertyCity,
        propertyState,
        propertyZip,
      }
    });

    // Send email notification to administrators
    sendQualificationEmail(qualification);

    // Return success response
    res.status(201).json({
      message: "Qualification submitted successfully",
      qualification,
      qualified
    });
  } catch (error) {
    console.error("Error creating qualification:", error);
    res.status(500).json({
      message: "Failed to submit qualification",
      error: error.message
    });
  }
});

// Get qualifications for a specific property
export const getQualificationsForProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  
  try {
    const qualifications = await prisma.qualification.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(qualifications);
  } catch (error) {
    console.error("Error fetching qualifications:", error);
    res.status(500).json({
      message: "Failed to fetch qualifications",
      error: error.message
    });
  }
});

// Get all qualifications with pagination and filtering
export const getAllQualifications = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    qualified, 
    sortBy = 'createdAt', 
    sortOrder = 'desc',
    search = ''
  } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);
  
  try {
    // Build filter object
    const where = {};
    
    // Add qualification filter if provided
    if (qualified !== undefined) {
      where.qualified = qualified === 'true';
    }
    
    // Add search functionality
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { propertyAddress: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Get total count for pagination
    const totalCount = await prisma.qualification.count({ where });
    
    // Get data with sorting
    const qualifications = await prisma.qualification.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder.toLowerCase() }
    });
    
    res.status(200).json({
      qualifications,
      pagination: {
        totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / take)
      }
    });
  } catch (error) {
    console.error("Error fetching qualifications:", error);
    res.status(500).json({
      message: "Failed to fetch qualifications",
      error: error.message
    });
  }
});

// Email notification for new qualifications
async function sendQualificationEmail(qualification) {
  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("SMTP not configured, skipping email notification");
    return;
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Prepare email content
    const qualificationStatus = qualification.qualified ? "QUALIFIED" : "NOT QUALIFIED";
    const emailSubject = `Landivo: New ${qualificationStatus} Lead - ${qualification.firstName} ${qualification.lastName}`;
    
    // Format currency
    const formatCurrency = (value) => {
      return value ? `$${value.toLocaleString()}` : "N/A";
    };

    // Email HTML content with payment plan details
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: ${qualification.qualified ? '#2e7d32' : '#c62828'}">
          ${qualificationStatus} - Pre-Qualification Submission
        </h2>
        
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Property Information</h3>
          <p><strong>Property ID:</strong> ${qualification.ownerId || 'N/A'}</p>
          <p><strong>Property Address:</strong> ${qualification.propertyAddress || 'N/A'}, ${qualification.propertyCity || ''}, ${qualification.propertyState || ''} ${qualification.propertyZip || ''}</p>
          <p><strong>Property Price:</strong> ${formatCurrency(qualification.propertyPrice)}</p>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Selected Payment Plan</h3>
          <p><strong>Loan Amount:</strong> ${formatCurrency(qualification.loanAmount)}</p>
          <p><strong>Down Payment:</strong> ${formatCurrency(qualification.downPayment)}</p>
          <p><strong>Interest Rate:</strong> ${qualification.interestRate ? qualification.interestRate + '%' : 'N/A'}</p>
          <p><strong>Monthly Payment:</strong> ${formatCurrency(qualification.monthlyPayment)}/month</p>
          <p><strong>Term:</strong> ${qualification.term ? qualification.term + ' months' : 'N/A'}</p>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Applicant Information</h3>
          <p><strong>Name:</strong> ${qualification.firstName} ${qualification.lastName}</p>
          <p><strong>Email:</strong> ${qualification.email}</p>
          <p><strong>Phone:</strong> ${qualification.phone}</p>
          <p><strong>Employment:</strong> ${qualification.employmentStatus || 'N/A'}</p>
          <p><strong>Credit Score:</strong> ${qualification.currentCreditScore || 'N/A'}</p>
          <p><strong>Annual Income:</strong> ${qualification.grossAnnualIncome || 'N/A'}</p>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Survey Responses</h3>
          <p><strong>Home Usage:</strong> ${qualification.homeUsage || 'N/A'}</p>
          <p><strong>Current Home Ownership:</strong> ${qualification.currentHomeOwnership || 'N/A'}</p>
          <p><strong>Current on All Payments:</strong> ${qualification.currentOnAllPayments || 'N/A'}</p>
          <p><strong>Has Real Estate Agent:</strong> ${qualification.realEstateAgent || 'N/A'}</p>
          <p><strong>Purchase Timing:</strong> ${qualification.homePurchaseTiming || 'N/A'}</p>
          <p><strong>Income Verification:</strong> ${qualification.verifyIncome || 'N/A'}</p>
          <p><strong>Income History:</strong> ${qualification.incomeHistory || 'N/A'}</p>
          <p><strong>Open Credit Lines:</strong> ${qualification.openCreditLines || 'N/A'}</p>
          <p><strong>Monthly Debt:</strong> ${formatCurrency(qualification.totalMonthlyPayments || 0)}</p>
          <p><strong>Foreclosure/Forbearance:</strong> ${qualification.foreclosureForbearance || 'N/A'}</p>
          <p><strong>Declared Bankruptcy:</strong> ${qualification.declaredBankruptcy || 'N/A'}</p>
          <p><strong>Liens or Judgments:</strong> ${qualification.liensOrJudgments || 'N/A'}</p>
        </div>
        
        ${!qualification.qualified ? `
        <div style="margin-bottom: 20px; padding: 15px; background-color: #ffebee; border-radius: 5px; border-left: 4px solid #c62828;">
          <h3 style="margin-top: 0; color: #c62828;">Disqualification Reasons</h3>
          <p>${qualification.disqualificationReason || 'No specific reason provided'}</p>
        </div>` : ''}
        
        <p style="margin-top: 30px; font-size: 14px; color: #757575;">
          This is an automated message from the Landivo Pre-Qualification System.
        </p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Landivo Qualification" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO || process.env.SMTP_USER,
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Qualification notification email sent successfully");
  } catch (error) {
    console.error("Error sending qualification email:", error);
  }
}