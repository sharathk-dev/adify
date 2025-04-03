import express from "express";
import { recordClickLogger } from "../controllers/adclicks.controller.js";
import { getRecommendedAds } from "../controllers/recommendation.controller.js";
import { getMatchedAds } from "../controllers/matchingEngine.controller.js";
import { login } from "../controllers/auth.controllers.js";
import { verifyToken } from "../controllers/auth.controllers.js";

const router = express.Router();

// Route for recording ad clicks
router.post("/addEvents",verifyToken, recordClickLogger);

// Route for getting recommended ads for a user
router.get("/user/:userId", (req, res) => {
    const userId = parseInt(req.params.userId);
    const ads = getRecommendedAds(userId);
    res.json({ recommended_ads: ads });
});

// New matching engine route - get personalized ads for a member
router.get("/recommendations/member/:memberId",verifyToken, getMatchedAds);

router.post("/login",login)

export default router;