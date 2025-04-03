import express from "express";
import { recordClickLogger } from "../controllers/adclicks.controller.js";
import { getRecommendedAds } from "../controllers/recommendation.controller.js";

const router = express.Router();

// Route for recording ad clicks
router.get("/clickLogger", recordClickLogger);

// Route for getting recommended ads for a user
router.get("/user/:userId", (req, res) => {
    const userId = parseInt(req.params.userId);
    const ads = getRecommendedAds(userId);
    res.json({ recommended_ads: ads });
});

export default router;