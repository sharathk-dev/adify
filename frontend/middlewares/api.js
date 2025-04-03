export const userDetails = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/recommendations/1", { credentials: "include" });
        const text = await response.text(); 
        console.log("Raw Response:", text);
        
        try {
            const json = JSON.parse(text);
            console.log(json)
            return json;
        } catch (error) {
            console.error("Failed to parse JSON.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
};


export const trackAdView = async (payload) => {
    try {
        const response = await fetch('http://localhost:3000/api/clickLogger', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload), 
        });

        if (!response.ok) {
            throw new Error('Failed to track ad view');
        }
        const data = await response.json();
        console.log('Ad view tracked successfully:', data);
    } catch (error) {
        console.error('Error posting trackAdView details:', error);
    }
};



