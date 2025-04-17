// server/routes/userRoute.js
import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers
} from "../controllers/userCntrl.js";
import { 
  jwtCheck, 
  extractUserFromToken, 
  checkPermissions, 
  checkRoles 
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected route - only accessible to users with read:users permission
// With fallback to Admin role for backward compatibility
router.get("/all", 
  jwtCheck, 
  extractUserFromToken, 
  checkPermissions(['read:users']), 
  getAllUsers
);

export { router as userRoute };