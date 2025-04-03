
import AdClick from '../models/AdClick.js';



async function recordClickLogger(req, res) {
    try {
        const { adId, memberId,transactionId, isClicked} = req.body; // Get data from request body
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
