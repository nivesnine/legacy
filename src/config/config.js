// Add at the top with other global declarations
window.currentChunkNames = new Set();
window.buildingInfo = new Map();
window.loadedChunks = new Map();
window.chunkCache = new Map();
window.chunkUsage = new Map();
window.cacheTimestamp = 0;

// Constants
window.MAX_CACHED_CHUNKS = 100;
window.TILE_SIZE = 16;
window.CHUNK_SIZE = 16;
window.PLAYER_SIZE = 16;

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
    DUNE: 16
};

// Building types
window.BUILDING_TYPES = {
    HOUSE: 'house',
    SHOP: 'shop',
    INN: 'inn',
    BLACKSMITH: 'blacksmith',
    TAVERN: 'tavern'
};

// Zone types
window.ZONES = {
    CITY: 'city',
    FOREST: 'forest',
    MOUNTAIN: 'mountain',
    PLAINS: 'plains',
    LAKE: 'lake',
    DESERT: 'desert',
    HILLS: 'hills'
};

// City types
window.CITY_TYPES = {
    CAPITAL: 'capital',    // Larger, more organized city
    TOWN: 'town',         // Medium-sized settlement
    VILLAGE: 'village',   // Small, sparse settlement
    OUTPOST: 'outpost'    // Tiny frontier settlement
};

// Zone biomes
window.ZONE_BIOMES = {
    PLAINS: 'plains',
    FOREST: 'forest',
    MOUNTAIN: 'mountain',
    LAKE: 'lake',
    DESERT: 'desert',
    HILLS: 'hills'
};

// Add or update INTERIOR_TILES definition
window.INTERIOR_TILES = {
    FLOOR: 20,
    WALL: 21,
    COUNTER: 22,
    TABLE: 23,
    CHAIR: 24,
    BED: 25,
    CHEST: 26,
    FORGE: 27,
    ANVIL: 28,
    BARREL: 29,
    EXIT: 30,
    FURNITURE: 31,
    WINDOW: 32,
    CARPET: 33,
    BOOKSHELF: 34
}; 