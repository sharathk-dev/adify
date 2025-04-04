export const userDetails = async (user_id, token) => {
    if (!user_id) {
        console.error("User ID is required.");
        return null;
    }
    try {
        const response = await fetch(`http://localhost:3000/api/user/${user_id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        const text = await response.text();
        console.log("Raw Response:", text);
        try {
            const json = JSON.parse(text);
            console.log(json);
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



export const trackAdView = async (payload, token) => {
    try {
        console.log("track view req : " + JSON.stringify(token));
        const response = await fetch('http://localhost:3000/api/addEvents', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
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

export const login = async (email, password, token) => {
    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ email, password }),
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid response from server. Please try again.");
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed. Please try again.");
        }
        console.log(" new user : "+JSON.stringify({ userId: data.data.member.id, token: data.data.sessionToken }))
        localStorage.setItem("user", JSON.stringify({ userId: data.data.member.id, token: data.data.sessionToken }));
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw new Error(error.message || "Login failed. Please try again.");
    }
};

export const sendParkingInfo = async (payload, token) => {
    try {
        const response = await fetch("", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
            navigate("/receipt");
        } else {
            setErrorMessage(data.message || "Submission failed. Please try again.");
        }
    }
    catch (error) {
        console.error('Error posting parkingInfo:', error);
    }

}





