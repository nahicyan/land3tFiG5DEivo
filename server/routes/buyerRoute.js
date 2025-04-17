import express from "express";
import { 
  makeOffer, 
  getOffersByBuyer, 
  getOffersOnProperty, 
  createVipBuyer,
  createBuyer,
  getAllBuyers,
  getBuyerById,
  updateBuyer,
  deleteBuyer,
  // New email-related endpoints
  getBuyersByArea,
  sendEmailToBuyers,
  importBuyersFromCsv,
  getBuyerStats
} from "../controllers/buyerCntrl.js";
import { getBuyerByAuth0Id } from '../controllers/buyerCntrl.js';

const router = express.Router();

// Route to create or update an offer
router.post("/makeOffer", makeOffer);

// Route to get offers by property or buyer
router.get("/offers/property/:propertyId", getOffersOnProperty);
router.get("/offers/buyer", getOffersByBuyer);

// Routes to create buyers
router.post("/createVipBuyer", createVipBuyer);
router.post("/create", createBuyer);


// Buyer CRUD operations
router.get("/byAuth0Id", getBuyerByAuth0Id);
router.get("/all", getAllBuyers);
router.get("/:id", getBuyerById);
router.put("/update/:id", updateBuyer);
router.delete("/delete/:id", deleteBuyer);

// New buyer list management routes
router.get("/byArea/:areaId", getBuyersByArea);
router.post("/sendEmail", sendEmailToBuyers);
router.post("/import", importBuyersFromCsv);
router.get("/stats", getBuyerStats);

export { router as buyerRoute };