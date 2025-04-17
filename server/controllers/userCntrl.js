import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prismaConfig.js";

// Utility function to generate a JWT token
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing in the environment variables.");
    throw new Error("Internal server error: Missing JWT_SECRET.");
  }
  return jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Create a new user (Local Registration)
export const createUser = asyncHandler(async (req, res) => {
  console.log("Received request to create a new user:", req.body);
  let { email, role } = req.body;

  if (!email) {
    console.error("Email is missing in the request.");
    return res.status(400).json({ message: "Email is required." });
  }

  const lowerCaseEmail = email.toLowerCase();

  try {
    const userExists = await prisma.user.findUnique({ where: { email: lowerCaseEmail } });
    if (userExists) {
      console.log("User already exists:", lowerCaseEmail);
      return res.status(409).json({ message: "User already exists." });
    }

    const resolvedRole = role || "USER";
    const user = await prisma.user.create({
      data: {
        ...req.body,
        email: lowerCaseEmail,
        role: resolvedRole,
      },
    });

    console.log("New user created:", user);
    res.status(201).json({ message: "New user registered", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error. Please try again." });
  }
});

// Log in a user (Local Authentication)
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const lowerCaseEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: lowerCaseEmail } });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Use Passport's req.login to create a session
  req.login(user, (err) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Failed to log in" });
    }

    console.log("User logged in and session created:", user);
    res.status(200).json({ message: "Login successful", user });
  });
});


// Log out a user
export const logoutUser = asyncHandler((req, res) => {
  console.log("Logging out user...");
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed." });
    }
    console.log("Logout successful.");
    res.status(200).json({ message: "Logout successful." });
  });
});

// Handle Google login success and generate token
export const loginSuccess = (req, res) => {
  if (req.user) {
    try {
      const token = generateToken(req.user);
      console.log("Google login success for user:", req.user.email);
      res.status(200).json({
        error: false,
        message: "Successfully logged in",
        user: req.user,
        token,
      });
    } catch (error) {
      console.error("Error generating token during Google login:", error);
      res.status(500).json({ error: true, message: "Internal server error." });
    }
  } else {
    console.error("Google login failed: No user found.");
    res.status(403).json({ error: true, message: "Not authorized." });
  }
};

// Handle Google login failure
export const loginFailed = (req, res) => {
  console.error("Google login failed.");
  res.status(401).json({ error: true, message: "Login failed." });
};

// Handle Google login redirect and return token
export const googleLoginRedirect = asyncHandler(async (req, res) => {
  console.log("Google login redirect received:", req.user);
  if (!req.user || !req.user.email) {
    console.error("Google login redirect error: User not found.");
    return res.status(404).json({ message: "User not found." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: req.user.email } });

    if (!user) {
      console.log("User not found in database:", req.user.email);
      return res.status(404).json({ message: "User not found." });
    }

    const token = generateToken(user);
    console.log("Google login successful:", { user, token });

    res.status(200).json({
      message: "Google login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Error during Google login redirect:", error);
    res.status(500).json({ message: "Internal server error. Please try again." });
  }
});

// Display All User
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // Remove sensitive information
    const safeUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).send(safeUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ 
      message: "An error occurred while fetching users", 
      error: error.message 
    });
  }
});