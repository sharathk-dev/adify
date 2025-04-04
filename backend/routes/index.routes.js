import express from "express";
import { recordClickLogger } from "../controllers/adclicks.controller.js";
import { getRecommendedAds } from "../controllers/recommendation.controller.js";
import { getMatchedAds } from "../controllers/matchingEngine.controller.js";
import { login, signin } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 *   - name: Ad Management
 *     description: Ad click tracking endpoints
 *   - name: Recommendations
 *     description: Ad recommendation endpoints
 */

// Route for recording ad clicks
router.post("/addEvents", verifyToken, recordClickLogger);

// Route for getting recommended ads for a user
router.get("/user/:userId", (req, res) => {
    const userId = parseInt(req.params.userId);
    const ads = getRecommendedAds(userId);
    res.json({ recommended_ads: ads });
});

// New matching engine route - get personalized ads for a member
router.get("/recommendations/member/:memberId", verifyToken, getMatchedAds);

// Authentication routes
router.post("/login", login);
router.post("/signin", signin);

export default router;