// Add elevation system
const ELEVATION_LEVELS = {
    WATER: 0,
    BEACH: 1,
    PLAINS: 2,
    HILLS: 3,
    MOUNTAINS: 4,
    PEAKS: 5
};

// Update zone generation to include better elevation handling
window.getZoneInfo = function(zoneX, zoneY) {
    const key = `${zoneX},${zoneY}`;
    
    if (!zoneMap.has(key)) {
        const seed = zoneX * 10000 + zoneY;
        const random = () => seededRandom(seed);
        
        // Use multiple noise functions for better terrain
        const baseElevation = (
            Math.sin((zoneX + worldSeed * 0.1) * 0.3) * 
            Math.cos((zoneY + worldSeed * 0.1) * 0.3) +
            Math.sin((zoneX + worldSeed * 0.2) * 0.7) * 
            Math.cos((zoneY + worldSeed * 0.2) * 0.5) * 0.5
        );
        
        // Add ridge noise for mountain ranges
        const ridgeNoise = Math.abs(Math.sin(
            (zoneX + worldSeed * 0.3) * 0.2 + 
            (zoneY + worldSeed * 0.3) * 0.2
        ));
        
        const elevation = (baseElevation + ridgeNoise) / 2;
        
        // ... rest of zone generation
    }
    // ... rest of function
}; 