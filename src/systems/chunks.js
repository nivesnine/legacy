// Chunk management
window.loadedChunks = new Map();

// Add chunk cache with LRU
const MAX_CACHED_CHUNKS = 100;
const chunkCache = new Map();
const chunkUsage = new Map();
let cacheTimestamp = 0;

window.getChunk = function(chunkX, chunkY) {
    const key = `${chunkX},${chunkY}`;
    
    if (chunkCache.has(key)) {
        chunkUsage.set(key, ++cacheTimestamp);
        return chunkCache.get(key);
    }

    // Clear old chunks if cache is full
    if (chunkCache.size >= MAX_CACHED_CHUNKS) {
        const oldest = Array.from(chunkUsage.entries())
            .sort(([,a], [,b]) => a - b)[0][0];
        chunkCache.delete(oldest);
        chunkUsage.delete(oldest);
    }

    const chunk = generateChunk(chunkX, chunkY);
    chunkCache.set(key, chunk);
    chunkUsage.set(key, ++cacheTimestamp);
    return chunk;
};

window.generateChunk = function(chunkX, chunkY) {
    // Determine which zone this chunk belongs to
    const zoneX = Math.floor(chunkX / 4); // 4 chunks per zone
    const zoneY = Math.floor(chunkY / 4);
    const zone = getZoneInfo(zoneX, zoneY);

    // Generate base chunk according to biome
    let chunk;
    switch (zone.type) {
        case ZONES.MOUNTAIN:
            chunk = generateMountainChunk(chunkX, chunkY, zone);
            break;
        case ZONES.FOREST:
            chunk = generateForestChunk(chunkX, chunkY, zone);
            break;
        case ZONES.DESERT:
            chunk = generateDesertChunk(chunkX, chunkY, zone);
            break;
        default: // PLAINS or HILLS
            chunk = Array(CHUNK_SIZE).fill().map(() => Array(CHUNK_SIZE).fill(TILES.EMPTY));
            break;
    }

    // If zone has a settlement, overlay city structures
    if (zone.hasSettlement) {
        overlaySettlement(chunk, chunkX, chunkY, zone);
    }

    // Apply path influence from previous generations
    if (window.pathTracker) {
        const chunkData = window.pathTracker.movementData.get(`${chunkX},${chunkY}`);
        if (chunkData) {
            for (let y = 0; y < CHUNK_SIZE; y++) {
                for (let x = 0; x < CHUNK_SIZE; x++) {
                    const influence = chunkData[y][x];
                    if (influence > 0) {
                        // Higher influence means higher chance of path
                        const pathThreshold = 1 - (influence / pathTracker.maxInfluence);
                        if (seededRandom(chunkX * 1000 + chunkY + x * y) > pathThreshold) {
                            // Only place path if the tile is empty or already a path
                            if (chunk[y][x] === TILES.EMPTY || chunk[y][x] === TILES.PATH) {
                                chunk[y][x] = TILES.PATH;
                            }
                        }
                    }
                }
            }
        }
    }

    return chunk;
};

function overlaySettlement(chunk, chunkX, chunkY, zone) {
    // Get local coordinates within the zone
    const localX = ((chunkX % 4) + 4) % 4;
    const localY = ((chunkY % 4) + 4) % 4;

    // Only place settlement structures in the center chunks of the zone
    const isSettlementCenter = localX >= 1 && localX <= 2 && localY >= 1 && localY <= 2;
    
    if (isSettlementCenter) {
        // Clear some space for the settlement based on terrain
        const clearingChance = {
            [ZONES.PLAINS]: 0.9,
            [ZONES.HILLS]: 0.7,
            [ZONES.FOREST]: 0.6,
            [ZONES.DESERT]: 0.8,
            [ZONES.MOUNTAIN]: 0.4
        }[zone.type];

        // Clear area for settlement, preserving some terrain features
        for (let y = 0; y < CHUNK_SIZE; y++) {
            for (let x = 0; x < CHUNK_SIZE; x++) {
                if (seededRandom(zone.seed + x * 100 + y) < clearingChance) {
                    chunk[y][x] = TILES.EMPTY;
                }
            }
        }

        // Generate city structures
        generateCityChunk(chunk, chunkX, chunkY, zone);
    } else {
        // For outer chunks, just add roads and occasional buildings
        addOutskirtStructures(chunk, chunkX, chunkY, zone);
    }
}

function addOutskirtStructures(chunk, chunkX, chunkY, zone) {
    // Add roads connecting to other zones
    const mid = Math.floor(CHUNK_SIZE / 2);
    if (chunkX % 4 === 0 || chunkY % 4 === 0) {
        for (let i = -1; i <= 1; i++) {
            if (chunkX % 4 === 0 && mid + i >= 0 && mid + i < CHUNK_SIZE) {
                for (let x = 0; x < CHUNK_SIZE; x++) {
                    if (chunk[mid + i][x] !== TILES.WALL) {
                        chunk[mid + i][x] = zone.type === ZONES.MOUNTAIN ? TILES.PATH : TILES.ROAD;
                    }
                }
            }
            if (chunkY % 4 === 0 && mid + i >= 0 && mid + i < CHUNK_SIZE) {
                for (let y = 0; y < CHUNK_SIZE; y++) {
                    if (chunk[y][mid + i] !== TILES.WALL) {
                        chunk[y][mid + i] = zone.type === ZONES.MOUNTAIN ? TILES.PATH : TILES.ROAD;
                    }
                }
            }
        }
    }

    // Add occasional buildings along roads
    const buildingChance = zone.buildingDensity * 0.3; // Reduced density for outskirts
    for (let y = 1; y < CHUNK_SIZE - 1; y++) {
        for (let x = 1; x < CHUNK_SIZE - 1; x++) {
            if (chunk[y][x] === TILES.EMPTY && 
                (chunk[y-1][x] === TILES.ROAD || chunk[y+1][x] === TILES.ROAD ||
                 chunk[y][x-1] === TILES.ROAD || chunk[y][x+1] === TILES.ROAD)) {
                if (seededRandom(zone.seed + x * 100 + y) < buildingChance) {
                    chunk[y][x] = TILES.BUILDING;
                }
            }
        }
    }
}

window.getTile = function(worldX, worldY) {
    const chunkX = Math.floor(worldX / CHUNK_SIZE);
    const chunkY = Math.floor(worldY / CHUNK_SIZE);
    const localX = ((worldX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const localY = ((worldY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    
    const chunk = getChunk(chunkX, chunkY);
    return chunk ? chunk[localY][localX] : TILES.WALL;
}; 