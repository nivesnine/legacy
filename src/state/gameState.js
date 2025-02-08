// Global game state
window.currentInterior = null;
window.currentChunkNames = new Set();
window.buildingInfo = new Map();
window.loadedChunks = new Map();
window.chunkCache = new Map();
window.chunkUsage = new Map();
window.cacheTimestamp = 0;
window.zoneMap = new Map();
window.usedBuildingNames = new Map();
window.worldSeed = Math.floor(Math.random() * 1000000);

// Player state
window.keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Camera state
window.camera = {
    x: 0,
    y: 0,
    width: 456,
    height: 456
};

const gameState = {
    // ... other state properties ...
    isInterior: false,
    currentBuilding: null,
    
    enterBuilding(building) {
        this.isInterior = true;
        this.currentBuilding = building;
        transitionManager.startTransition(() => {
            // Any additional setup needed when entering building
        });
    },
    
    exitBuilding() {
        this.isInterior = false;
        this.currentBuilding = null;
        transitionManager.startTransition(() => {
            // Any additional cleanup needed when exiting building
        });
    }
}; 