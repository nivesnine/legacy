// Desert configuration
const DESERT_CONFIG = {
    DUNE_CHANCE: 0.2,
    ROCK_CHANCE: 0.1,
    OASIS_CHANCE: 0.05,
    MIN_OASIS_SIZE: 3,
    MAX_OASIS_SIZE: 6
};

window.generateDesertChunk = function(chunkX, chunkY, zone) {
    const chunk = Array(CHUNK_SIZE).fill().map(() => Array(CHUNK_SIZE).fill(TILES.EMPTY));
    const seed = zone.seed + chunkX * 10000 + chunkY;
    
    // Generate base desert terrain
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const r = seededRandom(seed + x * 100 + y);
            if (r < DESERT_CONFIG.DUNE_CHANCE) {
                chunk[y][x] = TILES.DUNE;
            } else if (r < DESERT_CONFIG.DUNE_CHANCE + DESERT_CONFIG.ROCK_CHANCE) {
                chunk[y][x] = TILES.ROCK;
            }
        }
    }

    // Generate oases
    if (seededRandom(seed + 1000) < DESERT_CONFIG.OASIS_CHANCE) {
        const oasisSize = DESERT_CONFIG.MIN_OASIS_SIZE + 
            Math.floor(seededRandom(seed) * (DESERT_CONFIG.MAX_OASIS_SIZE - DESERT_CONFIG.MIN_OASIS_SIZE));
        
        const centerX = Math.floor(seededRandom(seed + 200) * (CHUNK_SIZE - oasisSize)) + oasisSize/2;
        const centerY = Math.floor(seededRandom(seed + 300) * (CHUNK_SIZE - oasisSize)) + oasisSize/2;
        
        // Create oasis with water and surrounding trees
        for (let y = -oasisSize/2; y < oasisSize/2; y++) {
            for (let x = -oasisSize/2; x < oasisSize/2; x++) {
                const dx = Math.floor(centerX + x);
                const dy = Math.floor(centerY + y);
                if (dx >= 0 && dx < CHUNK_SIZE && dy >= 0 && dy < CHUNK_SIZE) {
                    const distFromCenter = Math.sqrt(x*x + y*y);
                    if (distFromCenter < oasisSize/4) {
                        chunk[dy][dx] = TILES.WATER;
                    } else if (distFromCenter < oasisSize/2 && seededRandom(seed + dx * 100 + dy) < 0.4) {
                        chunk[dy][dx] = TILES.TREE;
                    }
                }
            }
        }
    }

    // Add paths through desert
    const mid = Math.floor(CHUNK_SIZE / 2);
    if (chunkX % 2 === 0 || chunkY % 2 === 0) {
        for (let i = -1; i <= 1; i++) {
            if (chunkX % 2 === 0 && mid + i >= 0 && mid + i < CHUNK_SIZE) {
                for (let x = 0; x < CHUNK_SIZE; x++) {
                    if (chunk[mid + i][x] !== TILES.WATER) {
                        chunk[mid + i][x] = TILES.PATH;
                    }
                }
            }
            if (chunkY % 2 === 0 && mid + i >= 0 && mid + i < CHUNK_SIZE) {
                for (let y = 0; y < CHUNK_SIZE; y++) {
                    if (chunk[y][mid + i] !== TILES.WATER) {
                        chunk[y][mid + i] = TILES.PATH;
                    }
                }
            }
        }
    }
    
    return chunk;
}; 