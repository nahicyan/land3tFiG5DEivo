// server/routes/dealRoute.js
import express from "express";
import { 
  createDeal, 
  getAllDeals, 
  getDealById, 
  updateDeal, 
  recordPayment,
  getDealFinancialSummary
} from "../controllers/dealCntrl.js";
// Removed security middleware imports
const router = express.Router();

// Create a new deal
router.post("/create", createDeal);

// Get all deals
router.get("/all", getAllDeals);

// Get deal by ID
router.get("/:id", getDealById);

// Update deal
router.put("/update/:id", updateDeal);

// Record a payment
router.post("/payment", recordPayment);

// Get deal financial summary
router.get("/:id/summary", getDealFinancialSummary);

export { router as dealRoute };