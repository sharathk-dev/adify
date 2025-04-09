import express from "express";
import { recordClickLogger } from "../controllers/adclicks.controller.js";
import { getRecommendedAds } from "../controllers/recommendation.controller.js";
import { getRecommendations } from "../controllers/matchingEngine.controller.js";
import { login, signin } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { transactionDetails } from "../controllers/transactionDetails.controller.js";

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

/**
 * @swagger
 * /addEvents:
 *   post:
 *     summary: Record ad click events
 *     tags: [Ad Management]
 *     security:
 *       - Authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdClick'
 *     responses:
 *       200:
 *         description: Ad click recorded successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/addEvents", verifyToken, recordClickLogger);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get recommended ads for a user (legacy endpoint)
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of recommended ads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommended_ads:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ad'
 */
router.get("/user/:userId", (req, res) => {
    const userId = parseInt(req.params.userId);
    const ads = getRecommendedAds(userId);
    res.json({ recommended_ads: ads });
});

// Unified recommendation engine endpoint - documentation in controller
router.get("/recommendations", verifyToken, getRecommendations);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to get authentication token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", login);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post("/signin", signin);


router.post("/transactionDetails",transactionDetails)

export default router;