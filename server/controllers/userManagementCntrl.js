import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

/**
 * Get user by Auth0 ID
 * Used to check if a user exists in our database and to retrieve user data
 */
export const getUserByAuth0Id = asyncHandler(async (req, res) => {
  const { auth0Id } = req.query;
  
  if (!auth0Id) {
    return res.status(400).json({ message: "Auth0 ID is required" });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { auth0Id }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by Auth0 ID:", error);
    res.status(500).json({
      message: "An error occurred while fetching user information",
      error: error.message
    });
  }
});

/**
 * Create or update user based on Auth0 ID
 * This is called when a new user with Auth0 roles/permissions logs in
 */
export const createOrUpdateUser = asyncHandler(async (req, res) => {
  const { auth0Id, firstName, lastName, email } = req.body;
  
  if (!auth0Id || !email) {
    return res.status(400).json({ message: "Auth0 ID and email are required" });
  }
  
  try {
    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { auth0Id }
    });
    
    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { auth0Id },
        data: {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          email,
          lastLoginAt: new Date(),
          loginCount: { increment: 1 }
        }
      });
      
      return res.status(200).json({
        message: "User updated successfully",
        user
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          auth0Id,
          firstName,
          lastName,
          email,
          lastLoginAt: new Date(),
          loginCount: 1
        }
      });
      
      return res.status(201).json({
        message: "User created successfully",
        user
      });
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    res.status(500).json({
      message: "An error occurred while creating/updating the user",
      error: error.message
    });
  }
});

/**
 * Get user profile - gets the current authenticated user's profile
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    // Auth0 ID should be in req.user.sub from the auth middleware
    const auth0Id = req.user?.sub;
    
    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }
    
    const user = await prisma.user.findUnique({
      where: { auth0Id },
      include: {
        createdResidencies: {
          select: {
            id: true,
            title: true,
            streetAddress: true,
            city: true,
            state: true,
            imageUrls: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      message: "An error occurred while fetching user profile",
      error: error.message
    });
  }
});

/**
 * Update user profile - allows users to update their own profile info
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const auth0Id = req.user?.sub;
    
    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }
    
    const { firstName, lastName } = req.body;
    
    // Get the existing user to check if it exists
    const existingUser = await prisma.user.findUnique({
      where: { auth0Id }
    });
    
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove modificationHistory tracking since it's not in the schema
    const updatedUser = await prisma.user.update({
      where: { auth0Id },
      data: { 
        firstName, 
        lastName
      }
    });
    
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      message: "An error occurred while updating user profile",
      error: error.message
    });
  }
});

/**
 * Get all users (Admin only)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        createdResidencies: {
          select: {
            id: true
          }
        }
      }
    });
    
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({
      message: "An error occurred while fetching users",
      error: error.message
    });
  }
});

/**
 * Get user by ID (Admin only)
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        createdResidencies: {
          select: {
            id: true,
            title: true,
            streetAddress: true,
            city: true,
            state: true,
            imageUrls: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({
      message: "An error occurred while fetching user information",
      error: error.message
    });
  }
});