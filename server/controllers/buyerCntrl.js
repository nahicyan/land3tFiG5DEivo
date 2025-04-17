import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";
import {
  sendOfferNotification,
  newOfferTemplate,
  updatedOfferTemplate,
  lowOfferTemplate,
} from "../utils/offerNotification.js";

// Function to make an offer
export const makeOffer = asyncHandler(async (req, res) => {
  const {
    email,
    phone,
    buyerType,
    propertyId,
    offeredPrice,
    firstName,
    lastName,
  } = req.body;

  if (!email || !phone || !propertyId || !offeredPrice || !firstName || !lastName) {
    res.status(400).json({
      message: "First Name, Last Name, Email, phone, property ID, and offered price are required.",
    });
    return;
  }

  try {
    // 1. Find or create buyer
    let buyer = await prisma.buyer.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { phone }],
      },
    });

    if (!buyer) {
      buyer = await prisma.buyer.create({
        data: {
          email: email.toLowerCase(),
          phone,
          buyerType,
          firstName,
          lastName,
          source: "Property Offer",
        },
      });
    }

    // 2. Retrieve property details for notifications
    const property = await prisma.residency.findUnique({
      where: { id: propertyId },
    });

    // 3. Check if the buyer already made an offer on the same property
    const existingOffer = await prisma.offer.findFirst({
      where: {
        buyerId: buyer.id,
        propertyId,
      },
    });

    if (existingOffer) {
      if (parseFloat(offeredPrice) > parseFloat(existingOffer.offeredPrice)) {
        // Update the existing offer with the higher price
        const updatedOffer = await prisma.offer.update({
          where: { id: existingOffer.id },
          data: {
            offeredPrice,
            timestamp: new Date(),
          },
        });

        // Send response first
        res.status(200).json({
          message: "Your previous offer was updated to the new higher price.",
          offer: updatedOffer,
        });

        // Send notification email in the background
        await sendOfferNotification(
          "Offer Updated",
          updatedOfferTemplate(property, buyer, offeredPrice)
        );
        return;
      } else {
        res.status(400).json({
          message: `You have already made an offer of $${existingOffer.offeredPrice}. Offer a higher price to update.`,
          existingOffer,
        });
        return;
      }
    }

    // 4. Create a new offer
    const newOffer = await prisma.offer.create({
      data: {
        propertyId,
        offeredPrice,
        buyerId: buyer.id,
        timestamp: new Date(),
      },
    });

    // 5. Check if the offer is below the minimum price
    if (parseFloat(offeredPrice) < parseFloat(property.minPrice)) {
      // Send response first with a low offer warning
      res.status(201).json({
        message: `Offer submitted successfully, but it is below the minimum price of $${property.minPrice}. Consider offering a higher price.`,
        offer: newOffer,
      });

      // Send low offer notification in the background
      await sendOfferNotification(
        "Low Offer Submitted",
        lowOfferTemplate(property, buyer, offeredPrice)
      );
      return;
    }

    // 6. Send response for successful offer submission
    res.status(201).json({
      message: "Offer created successfully.",
      offer: newOffer,
    });

    // 7. Send new offer notification in the background
    await sendOfferNotification(
      "New Offer Submitted",
      newOfferTemplate(property, buyer, offeredPrice)
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while processing the offer.",
      error: err.message,
    });
  }
});

export const getOffersOnProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  if (!propertyId) {
    res.status(400).json({ message: "Property ID is required." });
    return;
  }

  try {
    // Fetch all offers for the property, including buyer details
    const offers = await prisma.offer.findMany({
      where: { propertyId },
      include: {
        buyer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc", // Change to "asc" for oldest first
      },
    });

    res.status(200).json({
      propertyId,
      totalOffers: offers.length,
      offers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while fetching offers for the property.",
      error: err.message,
    });
  }
});

/**
 * Get offers by buyer
 * @route GET /api/buyer/offers/buyer
 * @access Private
 */
export const getOffersByBuyer = asyncHandler(async (req, res) => {
  const { buyerId, email, phone } = req.query;

  if (!buyerId && !email && !phone) {
    return res.status(400).json({ 
      message: "At least one of buyerId, email or phone is required." 
    });
  }

  try {
    // Find buyer by ID, email or phone
    let buyer;
    
    if (buyerId) {
      buyer = await prisma.buyer.findUnique({
        where: { id: buyerId }
      });
    } else if (email) {
      buyer = await prisma.buyer.findFirst({
        where: { email }
      });
    } else if (phone) {
      buyer = await prisma.buyer.findFirst({
        where: { phone }
      });
    }

    if (!buyer) {
      return res.status(404).json({ 
        message: "Buyer not found with the provided information." 
      });
    }

    // Fetch all offers by the buyer without property relation
    const offers = await prisma.offer.findMany({
      where: { buyerId: buyer.id },
      // Removed include: { property: true } that would cause an error
      orderBy: {
        timestamp: 'desc' // Latest first
      }
    });

    // Return offers with buyer information
    res.status(200).json({
      buyer: {
        firstName: buyer.firstName,
        lastName: buyer.lastName,
        email: buyer.email,
        phone: buyer.phone,
        buyerType: buyer.buyerType,
        id: buyer.id
      },
      totalOffers: offers.length,
      offers
    });
  } catch (err) {
    console.error("Error fetching offers by buyer:", err);
    res.status(500).json({
      message: "An error occurred while fetching offers by buyer.",
      error: err.message
    });
  }
});

// Update in server/controllers/buyerCntrl.js
export const createVipBuyer = asyncHandler(async (req, res) => {
  const { email, phone, buyerType, firstName, lastName, preferredAreas, auth0Id } = req.body;

  // Validate required fields
  if (!email || !phone || !buyerType || !firstName || !lastName || !preferredAreas || !Array.isArray(preferredAreas)) {
    res.status(400).json({
      message: "All fields are required including preferred areas."
    });
    return;
  }

  try {
    // Check if buyer already exists
    let buyer = await prisma.buyer.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { phone }],
      },
    });

    if (buyer) {
      // Update existing buyer with VIP status, preferred areas, and Auth0 ID
      buyer = await prisma.buyer.update({
        where: { id: buyer.id },
        data: {
          firstName,
          lastName,
          buyerType,
          preferredAreas,
          source: "VIP Buyers List",
          auth0Id  // Add Auth0 user ID to the buyer record
        },
      });
    } else {
      // Create new buyer with VIP status, preferred areas, and Auth0 ID
      buyer = await prisma.buyer.create({
        data: {
          email: email.toLowerCase(),
          phone,
          buyerType,
          firstName,
          lastName,
          preferredAreas,
          source: "VIP Buyers List",
          auth0Id  // Add Auth0 user ID to the buyer record
        },
      });
    }

    res.status(201).json({
      message: "VIP Buyer created successfully.",
      buyer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while processing the request.",
      error: err.message,
    });
  }
});


// Get all buyers
export const getAllBuyers = asyncHandler(async (req, res) => {
  try {
    const buyers = await prisma.buyer.findMany({
      include: {
        offers: {
          select: {
            id: true,
            propertyId: true,
            offeredPrice: true,
            timestamp: true
          },
          orderBy: {
            timestamp: "desc"
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    res.status(200).json(buyers);
  } catch (err) {
    console.error("Error fetching buyers:", err);
    res.status(500).json({
      message: "An error occurred while fetching buyers",
      error: err.message
    });
  }
});

// Get buyer by ID
export const getBuyerById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: "Buyer ID is required" });
  }
  
  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id },
      include: {
        offers: {
          select: {
            id: true,
            propertyId: true,
            offeredPrice: true,
            timestamp: true
          },
          orderBy: {
            timestamp: "desc"
          }
        }
      }
    });
    
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    
    res.status(200).json(buyer);
  } catch (err) {
    console.error("Error fetching buyer:", err);
    res.status(500).json({
      message: "An error occurred while fetching the buyer",
      error: err.message
    });
  }
});

// Update buyer
export const updateBuyer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phone,
    buyerType,
    source,
    preferredAreas
  } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: "Buyer ID is required" });
  }
  
  try {
    // Check if buyer exists
    const existingBuyer = await prisma.buyer.findUnique({
      where: { id }
    });
    
    if (!existingBuyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    
    // Check if email is changing and if it's already in use
    if (email !== existingBuyer.email) {
      const emailExists = await prisma.buyer.findUnique({
        where: { email: email.toLowerCase() }
      });
      
      if (emailExists && emailExists.id !== id) {
        return res.status(400).json({ message: "Email already in use by another buyer" });
      }
    }
    
    // Check if phone is changing and if it's already in use
    if (phone !== existingBuyer.phone) {
      const phoneExists = await prisma.buyer.findUnique({
        where: { phone }
      });
      
      if (phoneExists && phoneExists.id !== id) {
        return res.status(400).json({ message: "Phone number already in use by another buyer" });
      }
    }
    
    // Update the buyer
    const updatedBuyer = await prisma.buyer.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        buyerType,
        source,
        preferredAreas: preferredAreas || []
      },
      include: {
        offers: true
      }
    });
    
    res.status(200).json(updatedBuyer);
  } catch (err) {
    console.error("Error updating buyer:", err);
    res.status(500).json({
      message: "An error occurred while updating the buyer",
      error: err.message
    });
  }
});

// Delete buyer
export const deleteBuyer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: "Buyer ID is required" });
  }
  
  try {
    // Check if buyer exists
    const existingBuyer = await prisma.buyer.findUnique({
      where: { id }
    });
    
    if (!existingBuyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    
    // First delete all offers from this buyer (due to foreign key constraint)
    await prisma.offer.deleteMany({
      where: { buyerId: id }
    });
    
    // Then delete the buyer
    const deletedBuyer = await prisma.buyer.delete({
      where: { id }
    });
    
    res.status(200).json({
      message: "Buyer and associated offers deleted successfully",
      buyer: deletedBuyer
    });
  } catch (err) {
    console.error("Error deleting buyer:", err);
    res.status(500).json({
      message: "An error occurred while deleting the buyer",
      error: err.message
    });
  }
});


// Create a regular buyer
export const createBuyer = asyncHandler(async (req, res) => {
  const {
    email,
    phone,
    buyerType,
    firstName,
    lastName,
    source,
    preferredAreas
  } = req.body;

  // Validate required fields
  if (!email || !phone || !buyerType || !firstName || !lastName) {
    res.status(400).json({
      message: "Email, phone, buyerType, firstName, and lastName are required."
    });
    return;
  }

  try {
    // Check if buyer already exists with this email or phone
    const existingBuyer = await prisma.buyer.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { phone }
        ]
      }
    });

    if (existingBuyer) {
      res.status(409).json({
        message: "A buyer with this email or phone number already exists.",
        existingBuyer
      });
      return;
    }
    
    // Create new buyer
    const buyer = await prisma.buyer.create({
      data: {
        email: email.toLowerCase(),
        phone,
        buyerType,
        firstName,
        lastName,
        source: source || "Manual Entry",
        preferredAreas: preferredAreas || []
      }
    });

    res.status(201).json({
      message: "Buyer created successfully.",
      buyer
    });
  } catch (err) {
    console.error("Error creating buyer:", err);
    res.status(500).json({
      message: "An error occurred while processing the request.",
      error: err.message
    });
  }
});

// Get buyers by preferred area
export const getBuyersByArea = asyncHandler(async (req, res) => {
  const { areaId } = req.params;
  
  if (!areaId) {
    return res.status(400).json({ message: "Area ID is required" });
  }
  
  try {
    const buyers = await prisma.buyer.findMany({
      where: {
        preferredAreas: {
          has: areaId
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    res.status(200).json({
      areaId,
      count: buyers.length,
      buyers
    });
  } catch (err) {
    console.error("Error fetching buyers by area:", err);
    res.status(500).json({
      message: "An error occurred while fetching buyers by area",
      error: err.message
    });
  }
});

// Send email to selected buyers
export const sendEmailToBuyers = asyncHandler(async (req, res) => {
  const { buyerIds, subject, content, includeUnsubscribed = false } = req.body;
  
  if (!buyerIds || !Array.isArray(buyerIds) || buyerIds.length === 0) {
    return res.status(400).json({ message: "At least one buyer ID is required" });
  }
  
  if (!subject || !content) {
    return res.status(400).json({ message: "Email subject and content are required" });
  }
  
  try {
    // Get the buyers to email
    const buyers = await prisma.buyer.findMany({
      where: {
        id: { in: buyerIds },
        ...(includeUnsubscribed ? {} : { unsubscribed: false })
      }
    });
    
    if (buyers.length === 0) {
      return res.status(404).json({ 
        message: "No eligible buyers found with the provided IDs" 
      });
    }
    
    // In a real implementation, you'd use a service like SendGrid, Mailchimp, etc.
    // Here we'll simulate sending emails
    
    // Process email content with placeholders
    const emailsSent = buyers.map(buyer => {
      // Replace placeholders with buyer data
      const personalizedContent = content
        .replace(/{firstName}/g, buyer.firstName)
        .replace(/{lastName}/g, buyer.lastName)
        .replace(/{email}/g, buyer.email)
        .replace(/{preferredAreas}/g, (buyer.preferredAreas || []).join(", "));
      
      // In a real implementation, send the email here
      
      return {
        buyerId: buyer.id,
        email: buyer.email,
        name: `${buyer.firstName} ${buyer.lastName}`,
        status: "sent" // In a real implementation, this would be the actual status
      };
    });
    
    // Create a record of the email campaign
    // In a real implementation, you'd store this in the database
    
    res.status(200).json({
      message: `Successfully sent emails to ${emailsSent.length} buyers`,
      emailsSent,
      failedCount: buyerIds.length - emailsSent.length
    });
  } catch (err) {
    console.error("Error sending emails to buyers:", err);
    res.status(500).json({
      message: "An error occurred while sending emails",
      error: err.message
    });
  }
});

// Import buyers from CSV
export const importBuyersFromCsv = asyncHandler(async (req, res) => {
  // In a real implementation, you'd process the uploaded CSV file
  // Here we'll assume the data is already parsed and available in req.body.buyers
  
  const { buyers, source = "CSV Import" } = req.body;
  
  if (!buyers || !Array.isArray(buyers) || buyers.length === 0) {
    return res.status(400).json({ message: "No buyer data provided" });
  }
  
  try {
    const results = {
      created: 0,
      updated: 0,
      failed: 0,
      errors: []
    };
    
    // Process each buyer
    for (const buyerData of buyers) {
      try {
        const { email, phone, firstName, lastName, buyerType, preferredAreas } = buyerData;
        
        // Check required fields
        if (!email || !phone || !firstName || !lastName) {
          results.failed++;
          results.errors.push({
            data: buyerData,
            reason: "Missing required fields"
          });
          continue;
        }
        
        // Check if buyer already exists
        const existingBuyer = await prisma.buyer.findFirst({
          where: {
            OR: [
              { email: email.toLowerCase() },
              { phone }
            ]
          }
        });
        
        if (existingBuyer) {
          // Update existing buyer
          await prisma.buyer.update({
            where: { id: existingBuyer.id },
            data: {
              firstName,
              lastName,
              buyerType: buyerType || existingBuyer.buyerType,
              preferredAreas: preferredAreas || existingBuyer.preferredAreas,
              source: source || existingBuyer.source
            }
          });
          
          results.updated++;
        } else {
          // Create new buyer
          await prisma.buyer.create({
            data: {
              email: email.toLowerCase(),
              phone,
              firstName,
              lastName,
              buyerType: buyerType || "Investor", // Default
              preferredAreas: preferredAreas || [],
              source
            }
          });
          
          results.created++;
        }
      } catch (err) {
        results.failed++;
        results.errors.push({
          data: buyerData,
          reason: err.message
        });
      }
    }
    
    res.status(200).json({
      message: `Processed ${buyers.length} buyers: ${results.created} created, ${results.updated} updated, ${results.failed} failed`,
      results
    });
  } catch (err) {
    console.error("Error importing buyers:", err);
    res.status(500).json({
      message: "An error occurred while importing buyers",
      error: err.message
    });
  }
});

// Get buyer statistics
export const getBuyerStats = asyncHandler(async (req, res) => {
  try {
    // Get total buyer count
    const totalCount = await prisma.buyer.count();
    
    // Get count of VIP buyers
    const vipCount = await prisma.buyer.count({
      where: { source: "VIP Buyers List" }
    });
    
    // Get counts by area (this is more complex with array fields)
    // In MongoDB/Prisma, we'd need aggregation for this
    // This is a simplified version
    const buyers = await prisma.buyer.findMany({
      select: {
        id: true,
        preferredAreas: true,
        buyerType: true,
        source: true,
        createdAt: true
      }
    });
    
    // Manually count by area
    const byArea = {};
    const byType = {};
    const bySource = {};
    
    // Process for time-based analytics - group by month
    const monthlyGrowth = {};
    
    buyers.forEach(buyer => {
      // Count by area
      if (buyer.preferredAreas) {
        buyer.preferredAreas.forEach(area => {
          byArea[area] = (byArea[area] || 0) + 1;
        });
      }
      
      // Count by type
      if (buyer.buyerType) {
        byType[buyer.buyerType] = (byType[buyer.buyerType] || 0) + 1;
      }
      
      // Count by source
      const source = buyer.source || "Unknown";
      bySource[source] = (bySource[source] || 0) + 1;
      
      // Process for monthly growth
      if (buyer.createdAt) {
        const date = new Date(buyer.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyGrowth[monthKey] = (monthlyGrowth[monthKey] || 0) + 1;
      }
    });
    
    // Return stats
    res.status(200).json({
      totalCount,
      vipCount,
      byArea,
      byType,
      bySource,
      monthlyGrowth
    });
  } catch (err) {
    console.error("Error getting buyer stats:", err);
    res.status(500).json({
      message: "An error occurred while fetching buyer statistics",
      error: err.message
    });
  }
});

// 

export const getBuyerByAuth0Id = asyncHandler(async (req, res) => {
  const { auth0Id } = req.query;
  
  if (!auth0Id) {
    return res.status(400).json({ message: "Auth0 ID is required" });
  }
  
  try {
    // Find buyer by Auth0 ID
    const buyer = await prisma.buyer.findFirst({
      where: { auth0Id }
    });
    
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    
    // Return buyer data with 200 status
    res.status(200).json(buyer);
  } catch (err) {
    console.error("Error fetching buyer by Auth0 ID:", err);
    res.status(500).json({
      message: "An error occurred while fetching buyer information",
      error: err.message
    });
  }
});
