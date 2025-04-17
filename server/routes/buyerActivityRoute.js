// server/routes/buyerActivityRoute.js
import express from "express";
import { 
  recordBuyerActivity,
  getBuyerActivity,
  getBuyerActivitySummary,
  deleteBuyerActivity
} from "../controllers/buyerActivityCntrl.js";

const router = express.Router();

// Route for recording activity (POST /api/buyer/activity)
router.post("/activity", recordBuyerActivity);

// Route for getting all activity for a buyer (GET /api/buyer/activity/:buyerId)
router.get("/activity/:buyerId", getBuyerActivity);

// Route for getting activity summary for a buyer (GET /api/buyer/activity/:buyerId/summary)
router.get("/activity/:buyerId/summary", getBuyerActivitySummary);

// Route for deleting activity records (DELETE /api/buyer/activity/:buyerId)
router.delete("/activity/:buyerId", deleteBuyerActivity);

export { router as buyerActivityRoute };