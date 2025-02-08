// Just collision detection
window.checkCollision = function(x, y) {
    // Check if we're inside a building
    if (BuildingManager.isInside()) {
        return BuildingManager.checkInteriorCollision(x, y);
    }

    // World collision checks
    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);
    
    // Get surrounding tiles
    const surroundingTiles = getSurroundingTiles(tileX, tileY);
    
    // Check if any surrounding tile is impassable
    for (let tile of surroundingTiles) {
        if (isImpassable(tile)) {
            return true;
        }
    }
    
    return false;
};

function isImpassable(tile) {
    if (!tile) return true;
    return tile === TILES.WALL || 
           tile === TILES.WATER || 
           tile === TILES.TREE || 
           tile === TILES.DENSE_TREE ||
           tile === TILES.BUILDING ||
           tile === TILES.ROCK ||
           tile === TILES.PEAK;
}


