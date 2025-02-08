// Special locations that can be discovered
window.SPECIAL_LOCATIONS = {
    SHRINE: 'shrine',        // Gives permanent stat boost
    CAVE: 'cave',           // Contains valuable items
    PEAK: 'peak',          // Viewpoint to reveal map
    RUINS: 'ruins',        // Ancient buildings with lore
    SPRING: 'spring'       // Healing location
};

// Track discovered locations
window.discoveredLocations = new Map();

// Location effects
const LOCATION_EFFECTS = {
    [SPECIAL_LOCATIONS.SHRINE]: (player) => {
        const stats = ['maxHealth', 'speed', 'luck'];
        const stat = stats[Math.floor(seededRandom(Date.now()) * stats.length)];
        if (stat === 'maxHealth') {
            player.maxHealth += 10;
            player.health = player.maxHealth;
            return 'Your vitality has increased!';
        } else if (stat === 'speed') {
            player.moveSpeed *= 1.1;
            return 'You feel lighter on your feet!';
        } else {
            player.luck = (player.luck || 1) * 1.1;
            return 'You feel fortune smiling upon you!';
        }
    },
    
    [SPECIAL_LOCATIONS.SPRING]: (player) => {
        player.health = player.maxHealth;
        return 'The spring\'s waters restore your health!';
    },
    
    [SPECIAL_LOCATIONS.PEAK]: (player) => {
        // Reveal surrounding chunks on map
        const chunkX = Math.floor(player.x / (TILE_SIZE * CHUNK_SIZE));
        const chunkY = Math.floor(player.y / (TILE_SIZE * CHUNK_SIZE));
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const key = `${chunkX + dx},${chunkY + dy}`;
                if (!discoveredLocations.has(key)) {
                    discoveredLocations.set(key, true);
                }
            }
        }
        return 'From this vantage point, you can see far into the distance!';
    }
};

// Add special locations during chunk generation
window.addSpecialLocations = function(chunk, chunkX, chunkY, zone) {
    const chunkKey = `${chunkX},${chunkY}`;
    if (discoveredLocations.has(chunkKey)) return;

    const seed = zone.seed + chunkX * 10000 + chunkY;
    const random = () => seededRandom(seed++);

    // Different zones have different chances for special locations
    let locationChance = 0.05; // Base 5% chance
    let possibleLocations = [];

    switch(zone.type) {
        case ZONES.MOUNTAIN:
            locationChance = 0.15;
            possibleLocations = [SPECIAL_LOCATIONS.PEAK, SPECIAL_LOCATIONS.SHRINE, SPECIAL_LOCATIONS.CAVE];
            break;
            
        case ZONES.FOREST:
            locationChance = 0.1;
            possibleLocations = [SPECIAL_LOCATIONS.SHRINE, SPECIAL_LOCATIONS.RUINS, SPECIAL_LOCATIONS.SPRING];
            break;
            
        case ZONES.PLAINS:
            locationChance = 0.08;
            possibleLocations = [SPECIAL_LOCATIONS.RUINS, SPECIAL_LOCATIONS.SHRINE];
            break;
    }

    if (random() < locationChance) {
        const locationType = possibleLocations[Math.floor(random() * possibleLocations.length)];
        const x = Math.floor(random() * (CHUNK_SIZE - 4)) + 2;
        const y = Math.floor(random() * (CHUNK_SIZE - 4)) + 2;

        // Store location info
        discoveredLocations.set(chunkKey, {
            type: locationType,
            x: x + chunkX * CHUNK_SIZE,
            y: y + chunkY * CHUNK_SIZE,
            discovered: false
        });

        // Add visual marker in chunk
        chunk[y][x] = TILES[locationType.toUpperCase()];
    }
}; 