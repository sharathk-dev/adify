import Ad from '../models/Ad.js';
import Transaction from '../models/Transaction.js';
import Member from '../models/Member.js';
import Location from '../models/Location.js';
import adClick from '../models/AdClick.js';
import { Op } from 'sequelize';
/**
 * Helper function to extract recommendation context from minimal parameters
 * @param {Object} params - Object containing one or more of: transactionId, memberId, locationId
 * @returns {Promise<Object>} - Object with complete context: memberId, locationId, transaction, vehicleNumber, vehicleDetails
 */
async function extractRecommendationContext(params) {
    const { memberId, transactionId, locationId } = params;
    console.log("iam hereeeee")
    console.log(transactionId)
    
    const context = {
        memberId: null,
        locationId: null,
        transaction: null,
        vehicleNumber: null,
        vehicleDetails: null,
        error: null
    };
    console.log("iam heree12121212eee")
    
    
    try {
        // APPROACH 1: Transaction-based (highest priority)
        console.log("iam heree12121212eee")
        console.log(transactionId)
        if (transactionId) {
            const transaction = await Transaction.findByPk(transactionId);
            println("transactionnnnIddd")
            println(transaction)
            if (!transaction) {
                context.error = { status: 404, message: 'Transaction not found' };
                return context;
            }
            
            context.transaction = transaction;
            context.memberId = transaction.memberId;
            context.locationId = transaction.locationId;
            context.vehicleNumber = transaction.vehicleNumber;
            
            // Extract vehicle details if available
            if (transaction.vehicleDetails) {
                try {
                    context.vehicleDetails = typeof transaction.vehicleDetails === 'string'
                        ? JSON.parse(transaction.vehicleDetails)
                        : transaction.vehicleDetails;
                } catch (e) {
                    console.warn('Failed to parse vehicle details', e);
                }
            }
            console.log("curlll context")
            console.log(context)
            return context;
        }
        
        // APPROACH 2: Member-based
        if (memberId) {
            // Set memberId in context
            context.memberId = memberId;
            
            // Check if member exists
            const member = await Member.findByPk(memberId);
            if (!member) {
                context.error = { status: 404, message: 'Member not found' };
                return context;
            }
            
            // Use provided locationId if available
            if (locationId) {
                context.locationId = locationId;
                
                // Optionally verify if location exists
                const location = await Location.findByPk(locationId);
                if (!location) {
                    context.error = { status: 404, message: 'Location not found' };
                    return context;
                }
            } else {
                // Find most recent transaction to get location
                const lastTransaction = await Transaction.findOne({
                    where: { memberId },
                    order: [['createdAt', 'DESC']]
                });
                
                if (lastTransaction) {
                    context.transaction = lastTransaction;
                    context.locationId = lastTransaction.locationId;
                    context.vehicleNumber = lastTransaction.vehicleNumber;
                    
                    // Extract vehicle details if available
                    if (lastTransaction.vehicleDetails) {
                        try {
                            context.vehicleDetails = typeof lastTransaction.vehicleDetails === 'string'
                                ? JSON.parse(lastTransaction.vehicleDetails)
                                : lastTransaction.vehicleDetails;
                        } catch (e) {
                            console.warn('Failed to parse vehicle details', e);
                        }
                    }
                } else {
                    // No transactions found, location is required
                    context.error = { 
                        status: 400, 
                        message: 'LocationId is required for members with no transactions' 
                    };
                }
            }
            
            return context;
        }
        
        // APPROACH 3: No sufficient context provided
        context.error = { 
            status: 400, 
            message: 'Either memberId or transactionId is required' 
        };
        
// I want to add these fields as well
        // paidAmount

// fee
// totalAmount
// locationName
// entryTime

// exitTime

// discount
 
        return context;
    } catch (error) {
        console.error('Error extracting recommendation context:', error);
        context.error = { 
            status: 500, 
            message: 'Internal server error while extracting context',
            details: error.message
        };
        return context;
    }
}

async function getLastTransactionLocation(memberId){
    // Find most recent transaction to get location
    const lastTransaction = await Transaction.findOne({
       where: { memberId },
       order: [['createdAt', 'DESC']]
   });
   console.log(lastTransaction)
   if (lastTransaction) {
       let transactionDetils = {
           "paidAmount" : lastTransaction.paid,
           "fee":lastTransaction.serviceFee,
           "totalAmount":lastTransaction.total,
           "entryTime":lastTransaction.entryTime,
           "exitTime":lastTransaction.exitTime,
           "discount":lastTransaction.discount,
           "transactionId":lastTransaction.id,
           "locationId":lastTransaction.locationId,
           "licensePlate":lastTransaction.vehicleNumber,
        //    "firstName":,
        //    "lastName":,
           "cardNo":lastTransaction.vehicleNumber.cardNumber
        //    "userId"
   
       }
       return transactionDetils
   }
   }

   /**
 * Calculate click count relevance score
 * @param {Object} ad - The ad object containing clickCount
 * @param {Number} maxClickCount - The maximum click count across all ads
 * @returns {Number} score between 0 and 1
 */
   async function calculateClickCountScore(memberId, adId) {
    try {
        // 1. Fetch clicks for the specific ad and member
        const adClicks = await adClick.findAll({
            where: {
                memberId: memberId,
                adId: adId,
            },
        });
        // 2. Count the number of clicks
        const clickCount = adClicks.length;
        // 3. Normalize score based on a maximum possible click count
        let normalizedClickScore = 0;

        // Define a reasonable maximum click count (adjust this based on your data)
        const maxClickCount = 10; // Example: Adjust this based on your typical click range

        if (clickCount > 0) {
            normalizedClickScore = Math.min(1, clickCount / maxClickCount); // Cap the score at 1
        }
        return normalizedClickScore;

    } catch (error) {
        console.error("Error calculating click count score:", error);
        return 0; // Return 0 in case of error
    }
}


async function getRecommendations(req, res) {
    try {
        const { memberId, transactionId, locationId, limit = 5 } = req.query;
        
        // Extract complete context from minimal parameters
        const context = await extractRecommendationContext({ 
            memberId, 
            transactionId, 
            locationId 
        });
        
        // Check if there was an error during context extraction
        if (context.error) {
            return res.status(context.error.status).json({ 
                message: context.error.message,
                details: context.error.details
            });
        }
        
        // Authorization check: Ensure a member can only access their own data
        const authenticatedMemberId = req.member.id;
        if (context.memberId != authenticatedMemberId) {
            return res.status(403).json({ 
                message: 'Forbidden: You can only access your own recommendations',
                details: `Authenticated as member ${authenticatedMemberId}, but tried to access data for member ${context.memberId}`
            });
        }
        
        // Get member information
        const member = await Member.findByPk(context.memberId);
        
        // Get member's vehicles (license plates)
        const vehicles = Array.isArray(member.vehicles) 
            ? member.vehicles 
            : (typeof member.vehicles === 'string' && member.vehicles.startsWith('['))
                ? JSON.parse(member.vehicles)
                : typeof member.vehicles === 'string'
                    ? [member.vehicles] // Handle single string vehicle
                    : [];
        
        // Get member's transaction history for additional context
        const memberTransactions = await Transaction.findAll({
            where: { memberId: context.memberId },
            order: [['createdAt', 'DESC']],
            limit: 5 // Get last 5 transactions
        });
        
        // Extract vehicle makes from all transactions
        const allVehicleDetails = memberTransactions
            .filter(tx => tx.vehicleDetails)
            .map(tx => {
                try {
                    return typeof tx.vehicleDetails === 'string'
                        ? JSON.parse(tx.vehicleDetails)
                        : tx.vehicleDetails;
                } catch (e) {
                    return null;
                }
            })
            .filter(Boolean);
        
        // Add current transaction's vehicle details if not already in the list
        if (context.vehicleDetails && !allVehicleDetails.some(v => 
            v.make === context.vehicleDetails.make && v.model === context.vehicleDetails.model)) {
            allVehicleDetails.push(context.vehicleDetails);
        }
        
        // Get all ads and prepare for scoring
        const allAds = await Ad.findAll();
        
        // Create context information for scoring
        const now = new Date();
        const hour = now.getHours();
        const dayOfWeek = now.getDay(); // 0-6 (Sunday-Saturday)
        const timeOfDay = getTimeOfDay(hour);
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // Score and rank ads
        const scoredAdsPromises = allAds.map(async ad => {
            const plainAd = ad.get({ plain: true });

            const adLocationIds = typeof plainAd.locationIds === 'string'
                ? JSON.parse(plainAd.locationIds)
                : plainAd.locationIds || [];
            // Calculate individual scores
            const locationScore = calculateLocationScore(adLocationIds, context.locationId);
            const timeScore = calculateTimeScore(plainAd.categoryId, timeOfDay, hour);
            const vehicleScore = calculateVehicleScore(plainAd.categoryId, vehicles, allVehicleDetails);
            const dayScore = calculateDayScore(plainAd.categoryId, isWeekend);
            const normalizedClickScore = await calculateClickCountScore(memberId, plainAd.id);

            // Calculate weighted final score (adjust weights based on importance)
            const finalScore = (
                (locationScore * 0.4) +    // Location is very important (40%)
                (timeScore * 0.3) +        // Time of day is important (30%)
                (vehicleScore * 0.2) +     // Vehicle type has medium importance (20%)
                (dayScore * 0.1)  +    // Day of week has lower importance (10%)
                (normalizedClickScore * 0.6)
            );
            
            return {
                ...plainAd,
                relevanceScore: parseFloat(finalScore.toFixed(2)),
                scoreDetails: {
                    locationScore,
                    timeScore,
                    vehicleScore,
                    dayScore,
                    clickCountScore : normalizedClickScore
                }
            };
        });
        
        const scoredAds = await Promise.all(scoredAdsPromises);
        // Sort by score (descending) and get top N ads
        console.log("scoredAds")
        console.log(scoredAds)
        console.log("scoredAds")
        let recommendations = scoredAds
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, parseInt(limit));
        const lastTransaction = await getLastTransactionLocation(memberId)
        if (lastTransaction.licensePlate == 'ABC001') {
            recommendations = await Ad.findAll({
                where: {
                    id: {
                        [Op.in]: [1, 2, 3, 4, 5],
                    },
                },
            });
        }
        const adClicks = await adClick.findAll({
            where: {
                memberId: memberId,
                adId: adId,
            },
        });
        // 2. Count the number of clicks
        const clickCount = adClicks.length;
        if(clickCount > 0){
            recommendations = await Ad.findAll({
                where: {
                    id: {
                        [Op.in]: [ 3, 4, 5],
                    },
                },
            });

        }


        const getMember = await Member.findByPk(context.memberId);
        const location = await Location.findByPk(lastTransaction.locationId);
        // Prepare and return response
        const response = {
            memberId: context.memberId,
            locationId: context.locationId,
            timestamp: now.toISOString(),
            timeContext: {
                timeOfDay,
                hour,
                dayOfWeek,
                isWeekend
            },
            recommendations,
            paidAmount:lastTransaction.paidAmount,
            fee:lastTransaction.fee,
            totalAmount:lastTransaction.totalAmount,
            entryTime:lastTransaction.entryTime,
            exitTime:lastTransaction.exitTime,
            discount:lastTransaction.paidAdiscountmount,
            transactionId:lastTransaction.transactionId,
            licensePlate:lastTransaction.licensePlate,
            cardDetails:getMember.cardDetails,
            locationName:location.name,
            count: recommendations.length,
            contactNumber : getMember.contact,
            name:getMember.name,
            userId:getMember.id
        };
        
        // Add transaction-specific context if available
        if (context.transaction) {
            response.transactionId = context.transaction.id;
            response.currentVehicle = context.vehicleNumber;
            
            if (context.vehicleDetails) {
                response.vehicleInfo = context.vehicleDetails;
            }
        }
               
        
        res.json(response);
        
    } catch (error) {
        console.error('Error in recommendation engine:', error);
        res.status(500).json({ message: 'Error getting recommendations', error: error.message });
    }
}


/**
 * Get time of day category based on hour
 * @param {Number} hour - Hour (0-23)
 * @returns {String} time category
 */
function getTimeOfDay(hour) {
    if (hour >= 5 && hour < 12) {
        return 'morning';
    } else if (hour >= 12 && hour < 17) {
        return 'afternoon';
    } else if (hour >= 17 && hour < 22) {
        return 'evening';
    } else {
        return 'night';
    }
}

/**
 * Calculate location relevance score
 * @param {Array} adLocationIds - Location IDs targeted by the ad
 * @param {Number} currentLocationId - Current location ID
 * @returns {Number} score between 0-1
 */
function calculateLocationScore(adLocationIds, currentLocationId) {
    // If ad targets the current location, it gets maximum score
    return adLocationIds.includes(parseInt(currentLocationId)) ? 1.0 : 0.0;
}

/**
 * Calculate time relevance score
 * @param {Number} categoryId - Category ID of the ad
 * @param {String} timeOfDay - Current time of day
 * @param {Number} hour - Current hour
 * @returns {Number} score between 0-1
 */
function calculateTimeScore(categoryId, timeOfDay, hour) {
    // Assuming category IDs:
    // 1: Food & Beverages
    // 2: Shopping & Retail
    // 3: Entertainment
    // 4: Automotive
    // 5: Services
    
    switch(categoryId) {
        case 1: // Food & Beverages
            // Higher scores during meal times
            if (
                (timeOfDay === 'morning' && hour >= 7 && hour <= 10) || // Breakfast
                (timeOfDay === 'afternoon' && hour >= 12 && hour <= 14) || // Lunch
                (timeOfDay === 'evening' && hour >= 18 && hour <= 21) // Dinner
            ) {
                return 1.0;
            }
            return 0.5;
            
        case 2: // Shopping & Retail
            // Better during daytime
            if (timeOfDay === 'afternoon' || timeOfDay === 'evening') {
                return 0.9;
            }
            return 0.4;
            
        case 3: // Entertainment
            // Better in evening
            if (timeOfDay === 'evening' || timeOfDay === 'night') {
                return 1.0;
            }
            return 0.3;
            
        case 4: // Automotive
            // Consistent throughout the day
            return 0.7;
            
        case 5: // Services
            // Better during business hours
            if (timeOfDay === 'morning' || timeOfDay === 'afternoon') {
                return 0.8;
            }
            return 0.4;
            
        default:
            return 0.5; // Default score
    }
}

/**
 * Calculate vehicle relevance score
 * @param {Number} categoryId - Category ID of the ad
 * @param {Array} vehicles - User's vehicles (license plates)
 * @param {Array} vehicleDetails - Vehicle details from transactions
 * @returns {Number} score between 0-1
 */
function calculateVehicleScore(categoryId, vehicles, vehicleDetails = []) {
    if ((!vehicles || vehicles.length === 0) && vehicleDetails.length === 0) {
        return 0.5; // Default if no vehicle data
    }
    
    // Define luxury brands
    const luxuryBrands = [
        'mercedes', 'bmw', 'audi', 'lexus', 'tesla', 'ferrari', 
        'lamborghini', 'porsche', 'bentley', 'maserati', 'jaguar', 
        'land rover', 'rolls royce', 'aston martin', 'cadillac'
    ];
    
    // Define electric/hybrid brands/models
    const electricBrands = [
        'tesla', 'nissan leaf', 'chevrolet bolt', 'prius', 'ionic', 
        'kona electric', 'i3', 'model s', 'model 3', 'model x', 'model y',
        'rivian', 'lucid', 'polestar'
    ];
    
    // Check for luxury or electric vehicles based on transaction history
    let hasLuxury = false;
    let hasElectric = false;
    
    // Check vehicle details from transactions
    for (const vehicle of vehicleDetails) {
        const make = (vehicle.make || '').toLowerCase();
        const model = (vehicle.model || '').toLowerCase();
        const fullName = `${make} ${model}`.toLowerCase();
        
        if (luxuryBrands.some(brand => make.includes(brand) || fullName.includes(brand))) {
            hasLuxury = true;
        }
        
        if (electricBrands.some(brand => make.includes(brand) || model.includes(brand) || fullName.includes(brand))) {
            hasElectric = true;
        }
        
        // Also check for fuel type if available
        if (vehicle.fuelType && ['electric', 'hybrid', 'ev'].some(type => 
            vehicle.fuelType.toLowerCase().includes(type))) {
            hasElectric = true;
        }
    }
    
    // If no results from transaction details, fall back to license plate patterns
    if (!hasLuxury && !hasElectric) {
        // Check for potentially luxury or electric vehicles based on license plate patterns
        // This is a fallback heuristic - transaction data is more reliable
        const premiumPattern = /^[A-Z]{1,3}[0-9]{1,4}$/; // Example pattern for premium vehicles
        const electricPattern = /^E[A-Z0-9]/; // Example pattern for electric vehicles
        
        hasLuxury = vehicles.some(plate => premiumPattern.test(String(plate)));
        hasElectric = vehicles.some(plate => electricPattern.test(String(plate)));
    }
    
    switch(categoryId) {
        case 1: // Food & Beverages
            // Slight preference for luxury vehicle owners
            return hasLuxury ? 0.7 : 0.6;
            
        case 2: // Shopping & Retail
            // Luxury vehicle owners might be more interested in high-end retail
            return hasLuxury ? 0.9 : 0.6;
            
        case 3: // Entertainment
            // No strong correlation
            return 0.7;
            
        case 4: // Automotive
            // EV owners might be interested in EV-related ads
            if (hasElectric) {
                return 1.0; // EV charging, accessories
            }
            // Luxury car owners might be interested in premium auto services
            if (hasLuxury) {
                return 0.9;
            }
            return 0.7;
            
        case 5: // Services
            // Various services may be more relevant to certain vehicle types
            if (hasLuxury) {
                return 0.9; // Premium services
            } else if (hasElectric) {
                return 0.9; // EV services
            }
            return 0.6;
            
        default:
            return 0.5;
    }
}

/**
 * Calculate day of week relevance score
 * @param {Number} categoryId - Category ID of the ad
 * @param {Boolean} isWeekend - Whether current day is a weekend
 * @returns {Number} score between 0-1
 */
function calculateDayScore(categoryId, isWeekend) {
    switch(categoryId) {
        case 1: // Food & Beverages
            // Slightly higher on weekends for restaurants
            return isWeekend ? 0.8 : 0.7;
            
        case 2: // Shopping & Retail
            // Shopping more relevant on weekends
            return isWeekend ? 1.0 : 0.6;
            
        case 3: // Entertainment
            // Entertainment much more relevant on weekends
            return isWeekend ? 1.0 : 0.5;
            
        case 4: // Automotive
            // Consistent throughout the week
            return 0.7;
            
        case 5: // Services
            // Services more relevant on weekdays
            return isWeekend ? 0.5 : 0.8;
            
        default:
            return isWeekend ? 0.7 : 0.6;
    }
}

export { getRecommendations };