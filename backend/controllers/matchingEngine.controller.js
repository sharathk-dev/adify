import Ad from '../models/Ad.js';
import Transaction from '../models/Transaction.js';
import Member from '../models/Member.js';
import Location from '../models/Location.js';

/**
 * Matching engine for personalized ad recommendations
 * Uses weighted scoring system based on:
 * - Location match
 * - Time of day relevance
 * - Vehicle type relevance
 * - Day of week
 */
async function getMatchedAds(req, res) {
    try {
        const { memberId } = req.params;
        const { locationId, limit = 10 } = req.query;
        const data = await Ad.findAllAds();
        return res.json({
            data
        });
        // Get member information
        const member = await Member.findByPk(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        
        // Get member's vehicle information (from vehicles JSON field)
        const vehicles = typeof member.vehicles === 'string' 
            ? JSON.parse(member.vehicles) 
            : member.vehicles || [];
            
        // Get location context
        let currentLocationId = locationId;
        if (!currentLocationId) {
            // Find the member's last transaction to get location
            const lastTransaction = await Transaction.findOne({
                where: { memberId },
                order: [['createdAt', 'DESC']]
            });
            
            if (lastTransaction) {
                currentLocationId = lastTransaction.locationId;
            }
        }
        
        if (!currentLocationId) {
            return res.status(400).json({ message: 'Location ID is required' });
        }
        
        // Get all ads
        const allAds = await Ad.findAll({
            include: [
                { model: Location, as: 'locations' }
            ]
        });
        
        // Create context information for scoring
        const now = new Date();
        const hour = now.getHours();
        const dayOfWeek = now.getDay(); // 0-6 (Sunday-Saturday)
        const timeOfDay = getTimeOfDay(hour);
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // Score and rank ads
        const scoredAds = allAds.map(ad => {
            const plainAd = ad.get({ plain: true });
            
            // Parse locationIds (handle both string and array formats)
            const adLocationIds = typeof plainAd.locationIds === 'string'
                ? JSON.parse(plainAd.locationIds)
                : plainAd.locationIds || [];
                
            // Calculate individual scores
            const locationScore = calculateLocationScore(adLocationIds, currentLocationId);
            const timeScore = calculateTimeScore(plainAd.categoryId, timeOfDay, hour);
            const vehicleScore = calculateVehicleScore(plainAd.categoryId, vehicles);
            const dayScore = calculateDayScore(plainAd.categoryId, isWeekend);
            
            // Calculate weighted final score (adjust weights based on importance)
            const finalScore = (
                (locationScore * 0.4) +    // Location is very important (40%)
                (timeScore * 0.3) +        // Time of day is important (30%)
                (vehicleScore * 0.2) +     // Vehicle type has medium importance (20%)
                (dayScore * 0.1)           // Day of week has lower importance (10%)
            );
            
            return {
                ...plainAd,
                relevanceScore: parseFloat(finalScore.toFixed(2)),
                // Include scoring breakdown for debugging
                scoreDetails: {
                    locationScore,
                    timeScore,
                    vehicleScore,
                    dayScore
                }
            };
        });
        
        // Sort by score (descending) and get top N ads
        const recommendations = scoredAds
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, parseInt(limit));
            
        res.json({
            memberId,
            locationId: currentLocationId,
            timestamp: now.toISOString(),
            timeContext: {
                timeOfDay,
                hour,
                dayOfWeek,
                isWeekend
            },
            recommendations,
            count: recommendations.length
        });
        
    } catch (error) {
        console.error('Error in ad matching engine:', error);
        res.status(500).json({ message: 'Error getting matched ads', error: error.message });
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
 * @param {Array} vehicles - User's vehicles
 * @returns {Number} score between 0-1
 */
function calculateVehicleScore(categoryId, vehicles) {
    if (!vehicles || vehicles.length === 0) {
        return 0.5; // Default if no vehicle data
    }
    
    // Extract vehicle types (assuming vehicles have type property)
    const vehicleTypes = vehicles.map(v => 
        (typeof v === 'string' ? JSON.parse(v) : v).type || ''
    ).filter(Boolean);
    
    // If no valid vehicle types, return default
    if (vehicleTypes.length === 0) {
        return 0.5;
    }
    
    // Check for electric vehicles
    const hasElectric = vehicleTypes.some(type => 
        type.toLowerCase().includes('electric') || 
        type.toLowerCase().includes('ev')
    );
    
    // Check for luxury vehicles
    const hasLuxury = vehicleTypes.some(type => 
        type.toLowerCase().includes('luxury') || 
        ['bmw', 'mercedes', 'audi', 'lexus', 'tesla'].some(brand => 
            type.toLowerCase().includes(brand)
        )
    );
    
    switch(categoryId) {
        case 1: // Food & Beverages
            // No strong correlation with vehicle type
            return 0.6;
            
        case 2: // Shopping & Retail
            // Luxury vehicle owners might be more interested in retail
            return hasLuxury ? 0.9 : 0.6;
            
        case 3: // Entertainment
            // No strong correlation
            return 0.7;
            
        case 4: // Automotive
            // EV owners might be interested in EV-related ads
            if (hasElectric && Math.random() > 0.5) {
                return 1.0; // EV charging, accessories
            }
            return 0.8;
            
        case 5: // Services
            // Various services may be more relevant to certain vehicle types
            if (hasLuxury) {
                return 0.9; // Premium services
            } else if (hasElectric) {
                return 0.9; // EV services
            }
            return 0.7;
            
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

export { getMatchedAds };