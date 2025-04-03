


import _ from "lodash";

// Sample data (mock database)
const users = [
    { id: 1, name: "John Doe", email: "john@example.com", contact: "1234567890" }
];

const locations = [
    { locationCode: 101, name: "Downtown", lat: 40.7128, long: -74.0060, address: "123 Main St, NY" }
];

const ads = [
    { id: 10, advertiser_id: 2, ad_url: "https://example.com/ad1", image_url: "https://example.com/ad1.jpg", locationIds: [101, 102], CPC: 0.5, category_id: 5 },
    { id: 11, advertiser_id: 3, ad_url: "https://example.com/ad2", image_url: "https://example.com/ad2.jpg", locationIds: [101], CPC: 0.7, category_id: 5 },
    { id: 12, advertiser_id: 4, ad_url: "https://example.com/ad3", image_url: "https://example.com/ad3.jpg", locationIds: [102], CPC: 0.4, category_id: 2 }
];

const categories = [
    { id: 5, category: "Automobile" },
    { id: 2, category: "Fashion" }
];

const transactions = [
    { uid: 1001, user_id: 1,totalAmount:"10.00",paidAmount:"2.00",fee:"4.00", transactionId: "abcd-1234", vehicleModel: "Toyota Camry", entryTime: "2024-04-01T12:00:00Z", exitTime: "2024-04-01T14:00:00Z", location_code: 101, vehicleNumber: "XYZ-1234" }
];

const adClicks = [
    { id: 5001, ad_id: 10, user_id: 1, timestamp: "2024-04-01T13:30:00Z", isClicked: true }
];

// Function to get the last transaction location of the user
function getLastTransactionLocation(userId) {
    const userTransactions = transactions.filter(t => t.user_id === userId);
    if (userTransactions.length === 0) return null;
    return _.last(userTransactions).location_code;
}

// Function to get categories of ads clicked by user
function getUserClickedCategories(userId) {
    const userClicks = adClicks.filter(click => click.user_id === userId && click.isClicked);
    return userClicks.map(click => {
        const ad = ads.find(a => a.id === click.ad_id);
        return ad ? ad.category_id : null;
    }).filter(category => category !== null);
}

// Main function to get recommended ads
export function getRecommendedAds(userId) {

    const userLocation = getLastTransactionLocation(userId);
    const userClickedCategories = getUserClickedCategories(userId);

    // Get the last transaction details for the user
    const lastTransaction = _.last(transactions.filter(t => t.user_id === userId));

    if (!lastTransaction) return [];

    let relevantAds = ads.filter(ad => ad.locationIds.includes(userLocation));

    // Prioritize ads based on category clicks
    if (userClickedCategories.length > 0) {
        relevantAds = relevantAds.filter(ad => userClickedCategories.includes(ad.category_id));
    }

    // Sort ads by highest CPC (Cost Per Click)
    relevantAds = _.orderBy(relevantAds, ["CPC"], ["desc"]);

    // Prepare the final response
    return {
        licensePlate: lastTransaction.vehicleNumber,
        entryTime: lastTransaction.entryTime,
        exitTime: lastTransaction.exitTime,
        paidAmount: lastTransaction.paidAmount,
        totalAmount: lastTransaction.totalAmount,
        fee: lastTransaction.fee,
        recommended_ads: relevantAds.map(ad => ([
            { ad_url: ad.ad_url,target_url: ad.image_url, ad_id: ad.id },
            { ad_url: ad.ad_url,target_url: ad.image_url, ad_id: ad.id } // Ensure your ad objects have target_url
        ]))
    };
    
}


