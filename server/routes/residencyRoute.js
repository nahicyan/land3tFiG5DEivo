// server/routes/residencyRoute.js (updated)
import express from 'express';
import { 
    createResidency, 
    getAllResidencies, 
    getResidency, 
    updateResidency, 
    getResidencyImages, 
    createResidencyWithMultipleFiles 
} from '../controllers/residencyCntrl.js';
import { upload } from '../config/multerConfig.js';
import { jwtCheck, extractUserFromToken, checkPermissions } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/allresd", getAllResidencies);
router.get("/:id", getResidency);
router.get("/:id/image", getResidencyImages);

// Protected routes - accessible to users with specific permissions
router.post("/create", jwtCheck, extractUserFromToken, checkPermissions(['write:properties']), createResidency);
router.post("/createWithFile", jwtCheck, extractUserFromToken, checkPermissions(['write:properties']), upload.array("images", 10), createResidencyWithMultipleFiles);
router.put("/update/:id", jwtCheck, extractUserFromToken, checkPermissions(['write:properties']), upload.array("images", 10), updateResidency);

export { router as residencyRoute };