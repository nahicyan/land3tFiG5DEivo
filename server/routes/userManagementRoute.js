import express from "express";
import {
  getUserByAuth0Id,
  createOrUpdateUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById
} from "../controllers/userManagementCntrl.js";
import { jwtCheck, extractUserFromToken, checkPermissions } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/byAuth0Id", getUserByAuth0Id);
router.post("/sync", createOrUpdateUser);

// Protected routes (require authentication)
router.get("/profile", 
  jwtCheck, 
  extractUserFromToken, 
  getUserProfile
);

router.put("/profile", 
  jwtCheck,
  extractUserFromToken,
  updateUserProfile
);

// Admin routes (require specific permissions)
router.get("/all", 
  jwtCheck, 
  extractUserFromToken, 
  checkPermissions(['read:users']), 
  getAllUsers
);

router.get("/:id", 
  jwtCheck, 
  extractUserFromToken, 
  checkPermissions(['read:users']), 
  getUserById
);

export { router as userManagementRoute };