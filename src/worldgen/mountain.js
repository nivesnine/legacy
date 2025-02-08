// Mountain configuration
const MOUNTAIN_CONFIG = {
    BASE_ELEVATION: 0,
    MAX_ELEVATION: 5,
    ROCK_DENSITY: 0.5,
    CAVE_CHANCE: 0.05,
    PEAK_CHANCE: 0.2
};

window.generateMountainChunk = function(chunkX, chunkY, zone) {
    const chunk = Array(CHUNK_SIZE).fill().map(() => Array(CHUNK_SIZE).fill(TILES.EMPTY));
    
    // Generate elevation map with ridges
    const elevation = generateMountainElevation(chunkX, chunkY, zone);
    
    // Place terrain based on elevation
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const height = elevation[y][x];
            
            if (height > 0.8) {
                chunk[y][x] = TILES.PEAK;
            } else if (height > 0.6) {
                chunk[y][x] = TILES.ROCK;
            } else if (height > 0.4) {
                chunk[y][x] = seededRandom(x * y) < 0.3 ? TILES.ROCK : TILES.EMPTY;
            }
        }
    }
    
    return chunk;
};

function generateMountainElevation(chunkX, chunkY, zone) {
    const elevation = Array(CHUNK_SIZE).fill().map(() => Array(CHUNK_SIZE).fill(0));
    
    // Create ridge-based elevation
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const worldX = chunkX * CHUNK_SIZE + x;
            const worldY = chunkY * CHUNK_SIZE + y;
            
            // Base elevation
            let height = (
                Math.sin(worldX * 0.1) * Math.cos(worldY * 0.1) +
                Math.sin(worldX * 0.05 + worldY * 0.05) +
                Math.abs(Math.sin(worldX * 0.02 - worldY * 0.02) * 2)
            ) / 4;
            
            // Add ridge effect
            const ridgeValue = Math.abs(Math.sin(worldX * 0.05 + worldY * 0.05));
            height = (height + Math.pow(ridgeValue, 2)) / 2;
            
            elevation[y][x] = height;
        }
    }
    
    return elevation;
}
