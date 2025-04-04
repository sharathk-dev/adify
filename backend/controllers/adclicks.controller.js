import AdClick from '../models/AdClick.js';

/**
 * @swagger
 * /addEvents:
 *   post:
 *     summary: Record an ad click event
 *     tags: [Ad Management]
 *     security:
 *       - bearerAuth: []
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
        const { adId, memberId,transactionId, isClicked} = req.body;
        if (!adId || !memberId) {
            return res.status(400).json({ error: "adId and memberId are required" });
        }
        let getRecord = await AdClick.getAdClick(transactionId)
        if(!getRecord){
            await AdClick.insertAdClick(adId, memberId, isClicked);
        }else{
            await AdClick.updateAdClick(transactionId)
        }
        return res.status(201).json({ message: "Ad click recorded" });
    } catch (error) {
        console.error("Error recording ad click:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export { recordClickLogger };
