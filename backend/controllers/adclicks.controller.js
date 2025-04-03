import { insertAdClick } from "../models/AdClick.js"; // Adjust the import path based on your setup

async function recordClickLogger(req, res) {
    try {
        const { adId, memberId, isClicked } = req.body; // Get data from request body
        return res.status(201).json({ message: "Ad click recorded" });

        if (!adId || !memberId) {
            return res.status(400).json({ error: "adId and memberId are required" });
        }

        const newClick = await insertAdClick(adId, memberId, isClicked);
        

        // return res.status(201).json({ message: "Ad click recorded", data: newClick });
    } catch (error) {
        console.error("Error recording ad click:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export { recordClickLogger };
