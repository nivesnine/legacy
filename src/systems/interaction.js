// Building interaction system
window.handleDoorInteraction = function(tileX, tileY) {
    debugLog('Handling door interaction at', tileX, tileY);
    // Look for building info in surrounding tiles
    for (let dy = -2; dy <= 0; dy++) {
        for (let dx = -2; dx <= 0; dx++) {
            const buildingKey = `${tileX + dx},${tileY + dy}`;
            const building = window.buildingInfo.get(buildingKey);
            if (building) {
                debugLog('Found building:', building);
                try {
                    // Use BuildingManager to handle entry
                    const success = BuildingManager.enterBuilding(building);
                    if (success) {
                        player.gainExperience('BUILDING_ENTERED');
                        
                        // Add to visited buildings if not already visited
                        if (!window.visitedBuildings.has(buildingKey)) {
                            window.visitedBuildings.add(buildingKey);
                            showMessage(`Entered ${building.name}`, 'discovery');
                        }
                    } else {
                        showMessage("Couldn't enter building", 'warning');
                    }
                } catch (error) {
                    console.error('Error entering building:', error);
                    showMessage("Couldn't enter building", 'warning');
                }
                return false; // Return false to allow standing on doors
            }
        }
    }
    return false;
};

// Handle exit from buildings
window.handleBuildingExit = function() {
    if (BuildingManager.isInside()) {
        try {
            const success = BuildingManager.exitBuilding();
            if (!success) {
                showMessage("Couldn't exit building", 'warning');
            }
            return success;
        } catch (error) {
            console.error('Error exiting building:', error);
            showMessage("Couldn't exit building", 'warning');
            return false;
        }
    }
    return false;
};

// General interaction handler
window.handleInteraction = function(x, y) {
    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);
    const tile = getTile(tileX, tileY);
    
    debugLog('Handling interaction at', tileX, tileY, 'tile:', tile);
    
    // Handle different types of interactions
    switch(tile) {
        case TILES.DOOR:
            debugLog('Found door tile, handling interaction');
            return handleDoorInteraction(tileX, tileY);
            
        case TILES.BUILDING:
            // Check if we're at a door position
            debugLog('Found building tile, checking for door');
            return handleDoorInteraction(tileX, tileY);
            
        case TILES.HERB_HEALING:
        case TILES.HERB_POISON:
        case TILES.HERB_STRENGTH:
        case TILES.HERB_SPEED:
            const plant = PLANTS[tile];
            if (plant) {
                herbalism.discoverPlant(tile);
                plant.effect(player);
                // Remove the plant after use
                setTile(tileX, tileY, TILES.EMPTY);
            }
            return false;
            
        case TILES.PEAK:
            if (!discoveredPeaks.has(`${tileX},${tileY}`)) {
                discoveredPeaks.add(`${tileX},${tileY}`);
                player.gainExperience('MOUNTAIN_CLIMBED');
                showMessage("You've reached a mountain peak!", 'discovery');
            }
            return false;
            
        default:
            return false;
    }
};

// Helper function to set tile at position
window.setTile = function(x, y, tileType) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    const localX = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const localY = ((y % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    
    const chunk = getChunk(chunkX, chunkY);
    if (chunk) {
        chunk[localY][localX] = tileType;
    }
}; 