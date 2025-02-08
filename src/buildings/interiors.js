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
    FURNITURE: 31
};

// Track which building the player is currently in
window.currentInterior = null;

window.getInteriorTile = function(x, y) {
    if (!currentInterior) return null;
    
    const layout = currentInterior.layout;
    if (y < 0 || y >= layout.tiles.length || 
        x < 0 || x >= layout.tiles[0].length) {
        return INTERIOR_TILES.WALL;
    }
    
    return layout.tiles[y][x];
}; 