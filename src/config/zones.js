// Zone management
window.zoneMap = new Map();

// Generate a new random seed on page load
window.worldSeed = Math.floor(Math.random() * 1000000);

// Modified seededRandom to use worldSeed
function seededRandom(seed) {
    const combinedSeed = worldSeed + seed;
    const x = Math.sin(combinedSeed) * 10000;
    return x - Math.floor(x);
}

// Get zone info with new seeding system
window.getZoneInfo = function(zoneX, zoneY) {
    const key = `${zoneX},${zoneY}`;
    
    if (!zoneMap.has(key)) {
        const seed = zoneX * 10000 + zoneY;
        const random = () => seededRandom(seed);
        
        // Use multiple noise functions with world seed influence
        const elevation = Math.sin((zoneX + worldSeed * 0.1) * 0.3) * Math.cos((zoneY + worldSeed * 0.1) * 0.3) +
                         Math.sin((zoneX + worldSeed * 0.2) * 0.7) * Math.cos((zoneY + worldSeed * 0.2) * 0.5) * 0.5;
        const moisture = Math.cos((zoneX + worldSeed * 0.3) * 0.4) * Math.cos((zoneY + worldSeed * 0.3) * 0.4) +
                        Math.sin((zoneX + zoneY + worldSeed * 0.4) * 0.6) * 0.5;
        
        // Determine base zone type first
        let zoneType;
        if (elevation > 0.6) {
            zoneType = ZONES.MOUNTAIN;
        } else if (elevation > 0.2 && moisture > 0) {
            zoneType = ZONES.HILLS;
        } else if (moisture > 0.4) {
            zoneType = ZONES.FOREST;
        } else if (moisture < -0.4) {
            zoneType = ZONES.DESERT;
        } else {
            zoneType = ZONES.PLAINS;
        }

        // Now determine if this zone should have a settlement
        let cityType = null;
        const habitabilityScore = {
            [ZONES.PLAINS]: 1.0,
            [ZONES.HILLS]: 0.8,
            [ZONES.FOREST]: 0.7,
            [ZONES.DESERT]: 0.3,
            [ZONES.MOUNTAIN]: 0.4
        }[zoneType];

        // Adjust city chance based on zone type and nearby settlements
        const cityChance = 0.3 * habitabilityScore;
        
        if (random() < cityChance) {
            // Determine settlement size based on terrain
            const sizeFactor = random() * habitabilityScore;
            if (sizeFactor > 0.8) {
                cityType = CITY_TYPES.CAPITAL;
            } else if (sizeFactor > 0.6) {
                cityType = CITY_TYPES.TOWN;
            } else if (sizeFactor > 0.3) {
                cityType = CITY_TYPES.VILLAGE;
            } else {
                cityType = CITY_TYPES.OUTPOST;
            }
        }

        // Ensure starting area has a settlement
        if (Math.abs(zoneX) <= 1 && Math.abs(zoneY) <= 1 && !cityType) {
            cityType = CITY_TYPES.TOWN;
        }

        const zoneInfo = {
            type: zoneType,
            biome: zoneType,
            hasSettlement: cityType !== null,
            cityType: cityType,
            seed: random(),
            rotation: Math.floor(random() * 4) * 90,
            pattern: Math.floor(random() * 4),
            elevation: elevation,
            moisture: moisture,
            // Adjust infrastructure based on settlement size and terrain
            roadDensity: cityType ? (
                cityType === CITY_TYPES.CAPITAL ? 0.7 :
                cityType === CITY_TYPES.TOWN ? 0.5 :
                cityType === CITY_TYPES.VILLAGE ? 0.3 : 0.2
            ) * habitabilityScore : 0,
            buildingDensity: cityType ? (
                cityType === CITY_TYPES.CAPITAL ? 0.8 :
                cityType === CITY_TYPES.TOWN ? 0.6 :
                cityType === CITY_TYPES.VILLAGE ? 0.4 : 0.3
            ) * habitabilityScore : 0,
            hasWalls: cityType && random() < 0.3 * habitabilityScore && cityType !== CITY_TYPES.OUTPOST,
            mainRoadWidth: cityType === CITY_TYPES.CAPITAL ? 3 :
                          cityType === CITY_TYPES.TOWN ? 2 : 1,
            hasRiver: random() < 0.2,
            hasBridge: random() < 0.5,
            hasMarket: cityType === CITY_TYPES.CAPITAL || random() < 0.3
        };

        zoneMap.set(key, zoneInfo);
    }

    return zoneMap.get(key);
};
