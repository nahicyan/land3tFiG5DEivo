import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// Get all buyer lists
export const getAllBuyerLists = asyncHandler(async (req, res) => {
  try {
    const lists = await prisma.buyerList.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
    
    // For each list, count the buyers that match its criteria
    const listsWithCounts = await Promise.all(
      lists.map(async (list) => {
        // Count buyers that are explicitly added to the list
        const manualCount = list.buyerIds.length;
        
        // Count buyers that match criteria (if criteria exists)
        let criteriaCount = 0;
        if (list.criteria) {
          const criteria = JSON.parse(JSON.stringify(list.criteria));
          
          // Build the query based on criteria
          const query = {};
          
          // Add area filter if specified
          if (criteria.areas && criteria.areas.length > 0) {
            query.preferredAreas = {
              hasSome: criteria.areas
            };
          }
          
          // Add buyer type filter if specified
          if (criteria.buyerTypes && criteria.buyerTypes.length > 0) {
            query.buyerType = {
              in: criteria.buyerTypes
            };
          }
          
          // Add VIP filter if specified
          if (criteria.isVIP) {
            query.source = "VIP Buyers List";
          }
          
          // Count buyers matching the criteria
          criteriaCount = await prisma.buyer.count({
            where: query
          });
        }
        
        // Calculate total unique buyers
        // In a real implementation, you'd need to remove duplicates between manual and criteria
        const totalCount = manualCount + criteriaCount;
        
        return {
          ...list,
          buyerCount: totalCount
        };
      })
    );
    
    res.status(200).json(listsWithCounts);
  } catch (err) {
    console.error("Error fetching buyer lists:", err);
    res.status(500).json({
      message: "An error occurred while fetching buyer lists",
      error: err.message
    });
  }
});

// Get a specific buyer list with its members
export const getBuyerList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: "List ID is required" });
  }
  
  try {
    // Get the list
    const list = await prisma.buyerList.findUnique({
      where: { id }
    });
    
    if (!list) {
      return res.status(404).json({ message: "Buyer list not found" });
    }
    
    // Get manually added buyers
    const manualBuyers = await prisma.buyer.findMany({
      where: {
        id: { in: list.buyerIds }
      }
    });
    
    // Get buyers matching criteria
    let criteriaBuyers = [];
    if (list.criteria) {
      const criteria = JSON.parse(JSON.stringify(list.criteria));
      
      // Build the query based on criteria
      const query = {};
      
      // Add area filter if specified
      if (criteria.areas && criteria.areas.length > 0) {
        query.preferredAreas = {
          hasSome: criteria.areas
        };
      }
      
      // Add buyer type filter if specified
      if (criteria.buyerTypes && criteria.buyerTypes.length > 0) {
        query.buyerType = {
          in: criteria.buyerTypes
        };
      }
      
      // Add VIP filter if specified
      if (criteria.isVIP) {
        query.source = "VIP Buyers List";
      }
      
      // Get buyers matching the criteria
      criteriaBuyers = await prisma.buyer.findMany({
        where: query
      });
    }
    
    // Combine and remove duplicates
    const allBuyerIds = new Set([
      ...manualBuyers.map(b => b.id),
      ...criteriaBuyers.map(b => b.id)
    ]);
    
    const allBuyers = await prisma.buyer.findMany({
      where: {
        id: { in: Array.from(allBuyerIds) }
      }
    });
    
    res.status(200).json({
      ...list,
      buyers: allBuyers,
      buyerCount: allBuyers.length
    });
  } catch (err) {
    console.error("Error fetching buyer list:", err);
    res.status(500).json({
      message: "An error occurred while fetching the buyer list",
      error: err.message
    });
  }
});

// Create a new buyer list
export const createBuyerList = asyncHandler(async (req, res) => {
  const { name, description, criteria, buyerIds = [], color } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: "List name is required" });
  }
  
  try {
    // Create the list
    const newList = await prisma.buyerList.create({
      data: {
        name,
        description,
        criteria,
        buyerIds,
        color,
        createdBy: req.userId // Assuming you have middleware that sets req.userId
      }
    });
    
    res.status(201).json({
      message: "Buyer list created successfully",
      list: newList
    });
  } catch (err) {
    console.error("Error creating buyer list:", err);
    res.status(500).json({
      message: "An error occurred while creating the buyer list",
      error: err.message
    });
  }
});

// Update a buyer list
export const updateBuyerList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, criteria, color } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: "List ID is required" });
  }
  
  if (!name) {
    return res.status(400).json({ message: "List name is required" });
  }
  
  try {
    // Check if the list exists
    const existingList = await prisma.buyerList.findUnique({
      where: { id }
    });
    
    if (!existingList) {
      return res.status(404).json({ message: "Buyer list not found" });
    }
    
    // Update the list
    const updatedList = await prisma.buyerList.update({
      where: { id },
      data: {
        name,
        description,
        criteria,
        color,
        updatedAt: new Date()
      }
    });
    
    res.status(200).json({
      message: "Buyer list updated successfully",
      list: updatedList
    });
  } catch (err) {
    console.error("Error updating buyer list:", err);
    res.status(500).json({
      message: "An error occurred while updating the buyer list",
      error: err.message
    });
  }
});

// Delete a buyer list
export const deleteBuyerList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: "List ID is required" });
  }
  
  try {
    // Check if the list exists
    const existingList = await prisma.buyerList.findUnique({
      where: { id }
    });
    
    if (!existingList) {
      return res.status(404).json({ message: "Buyer list not found" });
    }
    
    // Delete the list
    await prisma.buyerList.delete({
      where: { id }
    });
    
    res.status(200).json({
      message: "Buyer list deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting buyer list:", err);
    res.status(500).json({
      message: "An error occurred while deleting the buyer list",
      error: err.message
    });
  }
});

// Add buyers to a list
export const addBuyersToList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { buyerIds } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: "List ID is required" });
  }
  
  if (!buyerIds || !Array.isArray(buyerIds) || buyerIds.length === 0) {
    return res.status(400).json({ message: "At least one buyer ID is required" });
  }
  
  try {
    // Check if the list exists
    const existingList = await prisma.buyerList.findUnique({
      where: { id }
    });
    
    if (!existingList) {
      return res.status(404).json({ message: "Buyer list not found" });
    }
    
    // Get current buyer IDs
    const currentBuyerIds = existingList.buyerIds || [];
    
    // Add new buyer IDs (avoiding duplicates)
    const updatedBuyerIds = Array.from(new Set([...currentBuyerIds, ...buyerIds]));
    
    // Update the list
    const updatedList = await prisma.buyerList.update({
      where: { id },
      data: {
        buyerIds: updatedBuyerIds,
        updatedAt: new Date()
      }
    });
    
    res.status(200).json({
      message: `Successfully added ${buyerIds.length} buyers to the list`,
      list: updatedList
    });
  } catch (err) {
    console.error("Error adding buyers to list:", err);
    res.status(500).json({
      message: "An error occurred while adding buyers to the list",
      error: err.message
    });
  }
});

// Remove buyers from a list
export const removeBuyersFromList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { buyerIds } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: "List ID is required" });
  }
  
  if (!buyerIds || !Array.isArray(buyerIds) || buyerIds.length === 0) {
    return res.status(400).json({ message: "At least one buyer ID is required" });
  }
  
  try {
    // Check if the list exists
    const existingList = await prisma.buyerList.findUnique({
      where: { id }
    });
    
    if (!existingList) {
      return res.status(404).json({ message: "Buyer list not found" });
    }
    
    // Get current buyer IDs
    const currentBuyerIds = existingList.buyerIds || [];
    
    // Remove specified buyer IDs
    const updatedBuyerIds = currentBuyerIds.filter(id => !buyerIds.includes(id));
    
    // Update the list
    const updatedList = await prisma.buyerList.update({
      where: { id },
      data: {
        buyerIds: updatedBuyerIds,
        updatedAt: new Date()
      }
    });
    
    res.status(200).json({
      message: `Successfully removed ${buyerIds.length} buyers from the list`,
      list: updatedList
    });
  } catch (err) {
    console.error("Error removing buyers from list:", err);
    res.status(500).json({
      message: "An error occurred while removing buyers from the list",
      error: err.message
    });
  }
});

// Send email to list members
export const sendEmailToList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { subject, content, includeUnsubscribed = false } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: "List ID is required" });
  }
  
  if (!subject || !content) {
    return res.status(400).json({ message: "Email subject and content are required" });
  }
  
  try {
    // Get the list with its buyers
    const list = await prisma.buyerList.findUnique({
      where: { id }
    });
    
    if (!list) {
      return res.status(404).json({ message: "Buyer list not found" });
    }
    
    // Get manually added buyers
    const manualBuyers = await prisma.buyer.findMany({
      where: {
        id: { in: list.buyerIds },
        ...(includeUnsubscribed ? {} : { unsubscribed: false })
      }
    });
    
    // Get buyers matching criteria
    let criteriaBuyers = [];
    if (list.criteria) {
      const criteria = JSON.parse(JSON.stringify(list.criteria));
      
      // Build the query based on criteria
      const query = {
        ...(includeUnsubscribed ? {} : { unsubscribed: false })
      };
      
      // Add area filter if specified
      if (criteria.areas && criteria.areas.length > 0) {
        query.preferredAreas = {
          hasSome: criteria.areas
        };
      }
      
      // Add buyer type filter if specified
      if (criteria.buyerTypes && criteria.buyerTypes.length > 0) {
        query.buyerType = {
          in: criteria.buyerTypes
        };
      }
      
      // Add VIP filter if specified
      if (criteria.isVIP) {
        query.source = "VIP Buyers List";
      }
      
      // Get buyers matching the criteria
      criteriaBuyers = await prisma.buyer.findMany({
        where: query
      });
    }
    
    // Combine and remove duplicates
    const allBuyerIds = new Set([
      ...manualBuyers.map(b => b.id),
      ...criteriaBuyers.map(b => b.id)
    ]);
    
    const allBuyers = await prisma.buyer.findMany({
      where: {
        id: { in: Array.from(allBuyerIds) }
      }
    });
    
    if (allBuyers.length === 0) {
      return res.status(404).json({ 
        message: "No eligible buyers found in this list" 
      });
    }
    
    // In a real implementation, you'd use a service like SendGrid, Mailchimp, etc.
    // Here we'll simulate sending emails
    
    // Process email content with placeholders
    const emailsSent = allBuyers.map(buyer => {
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
    
    // Update last email date for the list
    await prisma.buyerList.update({
      where: { id },
      data: {
        lastEmailDate: new Date()
      }
    });
    
    res.status(200).json({
      message: `Successfully sent emails to ${emailsSent.length} buyers in the list`,
      emailsSent
    });
  } catch (err) {
    console.error("Error sending email to list:", err);
    res.status(500).json({
      message: "An error occurred while sending email to the list",
      error: err.message
    });
  }
});