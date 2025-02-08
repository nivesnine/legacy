// Path tracking system
window.pathTracker = {
    // Store movement data per chunk
    movementData: new Map(),
    
    // How often to record player position (in game ticks)
    trackingInterval: 10,
    tickCount: 0,
    
    // Maximum value for path influence
    maxInfluence: 100,
    
    // Record player movement
    update() {
        this.tickCount++;
        if (this.tickCount >= this.trackingInterval) {
            this.tickCount = 0;
            this.recordPosition();
        }
    },
    
    // Record current player position
    recordPosition() {
        const tileX = Math.floor(player.x / TILE_SIZE);
        const tileY = Math.floor(player.y / TILE_SIZE);
        const chunkX = Math.floor(tileX / CHUNK_SIZE);
        const chunkY = Math.floor(tileY / CHUNK_SIZE);
        const localX = ((tileX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        const localY = ((tileY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        
        const key = `${chunkX},${chunkY}`;
        if (!this.movementData.has(key)) {
            this.movementData.set(key, Array(CHUNK_SIZE).fill().map(() => Array(CHUNK_SIZE).fill(0)));
        }
        
        const chunkData = this.movementData.get(key);
        chunkData[localY][localX] = Math.min(this.maxInfluence, (chunkData[localY][localX] || 0) + 1);
    },
    
    // Get path influence for a position
    getInfluence(worldX, worldY) {
        const tileX = Math.floor(worldX / TILE_SIZE);
        const tileY = Math.floor(worldY / TILE_SIZE);
        const chunkX = Math.floor(tileX / CHUNK_SIZE);
        const chunkY = Math.floor(tileY / CHUNK_SIZE);
        const localX = ((tileX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        const localY = ((tileY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        
        const key = `${chunkX},${chunkY}`;
        const chunkData = this.movementData.get(key);
        return chunkData ? chunkData[localY][localX] : 0;
    },
    
    // Save movement data to localStorage
    save() {
        const data = {};
        for (const [key, value] of this.movementData.entries()) {
            data[key] = value;
        }
        localStorage.setItem('pathMovementData', JSON.stringify(data));
    },
    
    // Load movement data from localStorage
    load() {
        try {
            const data = JSON.parse(localStorage.getItem('pathMovementData'));
            if (data) {
                this.movementData.clear();
                for (const [key, value] of Object.entries(data)) {
                    this.movementData.set(key, value);
                }
            }
        } catch (error) {
            console.error('Error loading path movement data:', error);
        }
    }
}; 