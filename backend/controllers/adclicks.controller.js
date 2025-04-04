import AdClick from '../models/AdClick.js';

/**
 * @swagger
 * /addEvents:
 *   post:
 *     summary: Record an ad click event
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
 *       201:
 *         description: Ad click recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ad click recorded"
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "adId and memberId are required"
 *       403:
 *         description: Forbidden - attempting to record clicks for another member
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: You can only record clicks for yourself"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
async function recordClickLogger(req, res) {
    try {
        const { adId, memberId, transactionId, isClicked } = req.body;
        
        // Validation checks
        if (!adId || !memberId) {
            return res.status(400).json({ error: "adId and memberId are required" });
        }
        
        // Authorization check: Ensure a member can only record clicks for themselves
        const authenticatedMemberId = req.member.id;
        if (memberId != authenticatedMemberId) {
            return res.status(403).json({ 
                message: 'Forbidden: You can only record clicks for yourself',
                details: `Authenticated as member ${authenticatedMemberId}, but tried to record clicks for member ${memberId}`
            });
        }
        
        // Process the ad click
        let getRecord = await AdClick.getAdClick(transactionId);
        if (!getRecord) {
            await AdClick.insertAdClick(adId, memberId, isClicked);
        } else {
            await AdClick.updateAdClick(transactionId);
        }
        
        return res.status(201).json({ message: "Ad click recorded" });
    } catch (error) {
        console.error("Error recording ad click:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export { recordClickLogger };
