// Tile types
window.TILES = {
    EMPTY: 0,
    WALL: 1,
    TREE: 2,
    WATER: 3,
    BUILDING: 4,
    ROAD: 5,
    DOOR: 6,
    BRIDGE: 7,
    GATE: 8,
    DENSE_TREE: 9,
    BUSH: 10,
    STUMP: 11,
    ROCK: 12,
    CAVE: 13,
    PEAK: 14,
    PATH: 15,
    DUNE: 16,
    HERB_HEALING: 40,    // Basic healing herb
    HERB_POISON: 41,     // Dangerous poisonous plant
    HERB_STRENGTH: 42,   // Temporary strength boost
    HERB_SPEED: 43,      // Temporary speed boost
    HERB_UNKNOWN: 44,    // Mystery herb - could be good or bad
};

// Update tile cache for city tiles
window.initTileCache = function() {
    if (!window.tileCache) {
        window.tileCache = new Map();
        
        const tileTypes = [
            'wall', 'tree', 'water', 'building', 'road', 'door',
            'dense_tree', 'bush', 'stump', 'rock', 'cave', 'peak',
            'path', 'dune'
        ];
        
        tileTypes.forEach(type => {
            const tileCanvas = document.createElement('canvas');
            tileCanvas.width = TILE_SIZE;
            tileCanvas.height = TILE_SIZE;
            const tileCtx = tileCanvas.getContext('2d');
            
            switch(type) {
                case 'building':
                    // Building base texture
                    tileCtx.fillStyle = '#8B4513';  // Wood brown base
                    tileCtx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
                    
                    // Wood plank texture
                    tileCtx.fillStyle = '#A0522D';  // Darker wood
                    for (let i = 2; i < TILE_SIZE; i += 4) {
                        tileCtx.fillRect(0, i, TILE_SIZE, 2);
                    }

                    // Add some detail
                    tileCtx.fillStyle = '#654321';  // Even darker wood
                    tileCtx.fillRect(2, 2, 2, TILE_SIZE - 4);  // Left detail
                    tileCtx.fillRect(TILE_SIZE - 4, 2, 2, TILE_SIZE - 4);  // Right detail
                    
                    // Add subtle highlights
                    tileCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    for (let i = 0; i < TILE_SIZE; i += 4) {
                        tileCtx.fillRect(i, 0, 1, TILE_SIZE);
                    }
                    break;
                    
                case 'road':
                    // Stone road texture
                    tileCtx.fillStyle = '#696969';
                    tileCtx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
                    // Road details
                    tileCtx.fillStyle = '#808080';
                    for(let i = 0; i < 4; i++) {
                        for(let j = 0; j < 4; j++) {
                            if((i+j) % 2 === 0) {
                                tileCtx.fillRect(i*4, j*4, 4, 4);
                            }
                        }
                    }
                    break;
                    
                case 'dense_tree':
                    // Denser tree texture
                    tileCtx.fillStyle = '#2D4F00';
                    tileCtx.fillRect(4, 6, 8, 10);
                    tileCtx.fillStyle = '#1B3B00';
                    tileCtx.fillRect(2, 2, 12, 8);
                    break;

                case 'bush':
                    // Bush texture
                    tileCtx.fillStyle = '#2D4F00';
                    tileCtx.beginPath();
                    tileCtx.arc(8, 8, 6, 0, Math.PI * 2);
                    tileCtx.fill();
                    break;

                case 'stump':
                    // Tree stump texture
                    tileCtx.fillStyle = '#4B2F00';
                    tileCtx.fillRect(6, 6, 4, 4);
                    tileCtx.fillStyle = '#3A2400';
                    tileCtx.fillRect(5, 5, 6, 1);
                    break;

                case 'rock':
                    // Rock texture
                    tileCtx.fillStyle = '#696969';
                    tileCtx.fillRect(4, 4, 8, 8);
                    tileCtx.fillStyle = '#808080';
                    tileCtx.fillRect(5, 5, 6, 6);
                    break;

                case 'cave':
                    // Cave entrance texture
                    tileCtx.fillStyle = '#363636';
                    tileCtx.fillRect(4, 4, 8, 12);
                    tileCtx.fillStyle = '#1A1A1A';
                    tileCtx.fillRect(5, 6, 6, 10);
                    break;

                case 'peak':
                    // Mountain peak texture
                    tileCtx.fillStyle = '#808080';
                    tileCtx.beginPath();
                    tileCtx.moveTo(8, 2);
                    tileCtx.lineTo(14, 14);
                    tileCtx.lineTo(2, 14);
                    tileCtx.closePath();
                    tileCtx.fill();
                    break;

                case 'path':
                    // Dirt path texture
                    tileCtx.fillStyle = '#8B7355';
                    tileCtx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
                    for (let i = 0; i < TILE_SIZE; i += 2) {
                        for (let j = 0; j < TILE_SIZE; j += 2) {
                            if (seededRandom(i * j) > 0.8) {
                                tileCtx.fillStyle = '#7A6346';
                                tileCtx.fillRect(i, j, 1, 1);
                            }
                        }
                    }
                    break;

                case 'dune':
                    // Sand dune texture
                    const gradient = tileCtx.createLinearGradient(0, 0, TILE_SIZE, TILE_SIZE);
                    gradient.addColorStop(0, '#DAA520');
                    gradient.addColorStop(1, '#CD853F');
                    tileCtx.fillStyle = gradient;
                    tileCtx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
                    break;
            }
            window.tileCache.set(type, tileCanvas);
        });
    }
};
