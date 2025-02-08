function generateChunk(chunkX, chunkY) {
    const zone = getZoneInfo(chunkX, chunkY);
    const chunk = createEmptyChunk();
    
    // Generate base terrain
    generateTerrain(chunk, chunkX, chunkY, zone);
    
    // Add zone-specific features
    switch(zone.type) {
        case ZONES.CITY:
            generateCity(chunk, chunkX, chunkY, zone);
            break;
        case ZONES.FOREST:
            generateForest(chunk, chunkX, chunkY, zone);
            break;
        case ZONES.MOUNTAIN:
            generateMountain(chunk, chunkX, chunkY, zone);
            break;
        // ... other zone types ...
    }
    
    // Add plants after terrain generation
    addPlantsToChunk(chunk, chunkX, chunkY, zone);
    
    return chunk;
} 