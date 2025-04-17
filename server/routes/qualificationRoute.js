// server/routes/qualificationRoute.js
import express from "express";
import { 
  createQualification, 
  getQualificationsForProperty,
  getAllQualifications
} from "../controllers/qualificationCntrl.js";

const router = express.Router();

// Create a new qualification entry
router.post("/create", createQualification);

// Get qualifications for a specific property
router.get("/property/:propertyId", getQualificationsForProperty);

// Get all qualifications with pagination and filtering
router.get("/all", getAllQualifications);

export { router as qualificationRoute };