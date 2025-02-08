// Forest configuration
const FOREST_CONFIG = {
    TREE_DENSITY: 0.4,
    DENSE_TREE_CHANCE: 0.3,
    BUSH_CHANCE: 0.2,
    CLEARING_CHANCE: 0.1,
    MIN_CLEARING_SIZE: 4,
    MAX_CLEARING_SIZE: 8
};

window.generateForestChunk = function(chunkX, chunkY, zone) {
    const chunk = Array(CHUNK_SIZE).fill().map(() => Array(CHUNK_SIZE).fill(TILES.EMPTY));
    const seed = zone.seed + chunkX * 10000 + chunkY;
    
    // Generate clearings first
    generateClearings(chunk, seed);
    
    // Fill with trees and bushes
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            if (chunk[y][x] === TILES.EMPTY && seededRandom(seed + x * 100 + y) < FOREST_CONFIG.TREE_DENSITY) {
                const r = seededRandom(seed + x * 100 + y);
                if (r < FOREST_CONFIG.DENSE_TREE_CHANCE) {
                    chunk[y][x] = TILES.DENSE_TREE;
                } else if (r < FOREST_CONFIG.DENSE_TREE_CHANCE + FOREST_CONFIG.BUSH_CHANCE) {
                    chunk[y][x] = TILES.BUSH;
                } else {
                    chunk[y][x] = TILES.TREE;
                }
            }
        }
    }
    
    // Add paths through forest
    const mid = Math.floor(CHUNK_SIZE / 2);
    if (chunkX % 2 === 0 || chunkY % 2 === 0) {
        for (let i = 0; i < CHUNK_SIZE; i++) {
            if (chunkX % 2 === 0) {
                chunk[mid][i] = TILES.EMPTY;
                chunk[mid - 1][i] = TILES.EMPTY;
                chunk[mid + 1][i] = TILES.EMPTY;
            }
            if (chunkY % 2 === 0) {
                chunk[i][mid] = TILES.EMPTY;
                chunk[i][mid - 1] = TILES.EMPTY;
                chunk[i][mid + 1] = TILES.EMPTY;
            }
        }
    }
    
    return chunk;
};

function generateClearings(chunk, seed) {
    if (seededRandom(seed + 100) < FOREST_CONFIG.CLEARING_CHANCE) {
        const clearingSize = FOREST_CONFIG.MIN_CLEARING_SIZE + 
            Math.floor(seededRandom(seed + 100) * (FOREST_CONFIG.MAX_CLEARING_SIZE - FOREST_CONFIG.MIN_CLEARING_SIZE));
        
        const centerX = Math.floor(seededRandom(seed + 100) * (CHUNK_SIZE - clearingSize)) + clearingSize/2;
        const centerY = Math.floor(seededRandom(seed + 100) * (CHUNK_SIZE - clearingSize)) + clearingSize/2;
        
        for (let y = -clearingSize/2; y < clearingSize/2; y++) {
            for (let x = -clearingSize/2; x < clearingSize/2; x++) {
                const dx = Math.floor(centerX + x);
                const dy = Math.floor(centerY + y);
                if (dx >= 0 && dx < CHUNK_SIZE && dy >= 0 && dy < CHUNK_SIZE) {
                    // Create clearing with occasional stumps
                    chunk[dy][dx] = seededRandom(seed + dx * 100 + dy) < 0.1 ? TILES.STUMP : TILES.EMPTY;
                }
            }
        }
    }
}
