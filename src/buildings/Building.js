class Building {
    constructor(data) {
        this.type = data.type;
        this.name = data.name;
        this.width = data.width;
        this.height = data.height;
        this.originX = data.originX;
        this.originY = data.originY;
        this.relX = data.relX;
        this.relY = data.relY;
        this.worldX = data.worldX;
        this.worldY = data.worldY;
        this.tileId = data.tileId;
        this.isDoor = data.isDoor;
        this.doorX = data.doorX;
        this.doorY = data.doorY;
    }

    getLayout() {
        debugLog('Getting layout for building type:', this.type);
        const layout = BuildingLayouts.getLayout(this.type);
        if (!layout) {
            debugLog('Creating default layout for building type:', this.type);
            const width = 16;
            const height = 16;
            let tiles = Array(height).fill().map(() => Array(width).fill(INTERIOR_TILES.FLOOR));
            
            // Add walls and windows
            for (let x = 0; x < width; x++) {
                tiles[0][x] = INTERIOR_TILES.WALL;
                tiles[height-1][x] = INTERIOR_TILES.WALL;
                // Add windows on top wall
                if (x % 4 === 2) {
                    tiles[0][x] = INTERIOR_TILES.WINDOW;
                }
            }
            for (let y = 0; y < height; y++) {
                tiles[y][0] = INTERIOR_TILES.WALL;
                tiles[y][width-1] = INTERIOR_TILES.WALL;
                // Add windows on side walls
                if (y % 4 === 2) {
                    tiles[y][0] = INTERIOR_TILES.WINDOW;
                    tiles[y][width-1] = INTERIOR_TILES.WINDOW;
                }
            }

            let items = [];  // Store decorative items

            // Add a clear path to the exit
            const exitX = Math.floor(width/2);
            const exitY = height - 1;
            
            // Make the exit door more obvious with door frame
            tiles[exitY][exitX-1] = INTERIOR_TILES.WALL;  // Left door frame
            tiles[exitY][exitX] = INTERIOR_TILES.EXIT;    // Door
            tiles[exitY][exitX+1] = INTERIOR_TILES.WALL;  // Right door frame
            
            // Clear path to door (remove any furniture/carpets in the way)
            for (let y = exitY - 3; y <= exitY; y++) {
                for (let x = exitX - 1; x <= exitX + 1; x++) {
                    if (y !== exitY) {  // Don't clear the door frame
                        tiles[y][x] = INTERIOR_TILES.FLOOR;
                    }
                }
            }

            // Add furniture based on building type
            switch(this.type) {
                case 'house':
                    // Bedroom area (top left)
                    tiles[3][3] = INTERIOR_TILES.BED;
                    tiles[3][4] = INTERIOR_TILES.BED;
                    tiles[3][2] = INTERIOR_TILES.CHEST;
                    tiles[2][2] = INTERIOR_TILES.BOOKSHELF;
                    tiles[2][3] = INTERIOR_TILES.BOOKSHELF;
                    
                    // Living area (center)
                    tiles[7][7] = INTERIOR_TILES.TABLE;
                    tiles[6][7] = INTERIOR_TILES.CHAIR;
                    tiles[8][7] = INTERIOR_TILES.CHAIR;
                    tiles[7][6] = INTERIOR_TILES.CHAIR;
                    tiles[7][8] = INTERIOR_TILES.CHAIR;
                    
                    // Add carpet under living area
                    for (let y = 6; y < 10; y++) {
                        for (let x = 6; x < 10; x++) {
                            if (tiles[y][x] === INTERIOR_TILES.FLOOR) {
                                tiles[y][x] = INTERIOR_TILES.CARPET;
                            }
                        }
                    }
                    
                    // Storage area (right side)
                    tiles[3][12] = INTERIOR_TILES.BOOKSHELF;
                    tiles[4][12] = INTERIOR_TILES.BOOKSHELF;
                    tiles[5][12] = INTERIOR_TILES.CHEST;
                    
                    // Add decorative items
                    items.push(
                        { type: 'vase', x: 7, y: 7 },
                        { type: 'candle', x: 3, y: 2 },
                        { type: 'book', x: 2, y: 2 }
                    );
                    
                    // Add door mat near exit
                    tiles[exitY-1][exitX] = INTERIOR_TILES.CARPET;
                    
                    // Add decorative items near door
                    items.push(
                        { type: 'candle', x: exitX-1, y: exitY-1 },
                        { type: 'candle', x: exitX+1, y: exitY-1 }
                    );
                    break;
                    
                case 'shop':
                    // Counter area
                    for (let x = 4; x < 12; x++) {
                        tiles[4][x] = INTERIOR_TILES.COUNTER;
                    }
                    
                    // Display shelves
                    for (let x = 4; x < 12; x += 2) {
                        tiles[2][x] = INTERIOR_TILES.BOOKSHELF;
                    }
                    
                    // Storage area
                    tiles[2][5] = INTERIOR_TILES.CHEST;
                    tiles[2][7] = INTERIOR_TILES.BARREL;
                    tiles[2][9] = INTERIOR_TILES.CHEST;
                    
                    // Seating area
                    tiles[8][4] = INTERIOR_TILES.CHAIR;
                    tiles[8][6] = INTERIOR_TILES.TABLE;
                    tiles[8][8] = INTERIOR_TILES.CHAIR;
                    
                    // Add decorative items
                    items.push(
                        { type: 'coin', x: 5, y: 4 },
                        { type: 'potion', x: 7, y: 4 },
                        { type: 'scroll', x: 9, y: 4 }
                    );
                    
                    // Add welcome mat
                    tiles[exitY-1][exitX] = INTERIOR_TILES.CARPET;
                    break;
                    
                case 'blacksmith':
                    // Forge area
                    tiles[4][4] = INTERIOR_TILES.FORGE;
                    tiles[4][5] = INTERIOR_TILES.ANVIL;
                    tiles[4][6] = INTERIOR_TILES.BARREL;
                    
                    // Counter/display area
                    for (let x = 8; x < 12; x++) {
                        tiles[4][x] = INTERIOR_TILES.COUNTER;
                    }
                    
                    // Storage
                    tiles[2][4] = INTERIOR_TILES.CHEST;
                    tiles[2][5] = INTERIOR_TILES.CHEST;
                    
                    // Work area
                    tiles[6][4] = INTERIOR_TILES.TABLE;
                    tiles[6][5] = INTERIOR_TILES.CHAIR;
                    
                    // Add decorative items
                    items.push(
                        { type: 'sword', x: 8, y: 4 },
                        { type: 'hammer', x: 4, y: 5 },
                        { type: 'shield', x: 10, y: 4 }
                    );
                    break;
                    
                case 'inn':
                    // Reception area
                    for (let x = 6; x < 10; x++) {
                        tiles[3][x] = INTERIOR_TILES.COUNTER;
                    }
                    
                    // Dining area
                    for (let y = 6; y < 9; y += 2) {
                        for (let x = 4; x < 12; x += 3) {
                            tiles[y][x] = INTERIOR_TILES.TABLE;
                            tiles[y][x+1] = INTERIOR_TILES.CHAIR;
                            tiles[y-1][x] = INTERIOR_TILES.CHAIR;
                        }
                    }
                    
                    // Add carpet in dining area
                    for (let y = 5; y < 10; y++) {
                        for (let x = 3; x < 13; x++) {
                            if (tiles[y][x] === INTERIOR_TILES.FLOOR) {
                                tiles[y][x] = INTERIOR_TILES.CARPET;
                            }
                        }
                    }
                    
                    // Add decorative items
                    items.push(
                        { type: 'candle', x: 7, y: 3 },
                        { type: 'mug', x: 4, y: 6 },
                        { type: 'plate', x: 7, y: 6 }
                    );
                    break;
            }

            // Add exit at bottom center
            tiles[height-1][Math.floor(width/2)] = INTERIOR_TILES.EXIT;

            return {
                tiles: tiles,
                items: items,
                exitLocation: { x: exitX, y: exitY }  // Store exit location for easier reference
            };
        }

        // If we have a predefined layout, use it
        return {
            tiles: layout.tiles.map(row => 
                row.map(tile => {
                    switch(tile) {
                        case BuildingLayouts.TILE_TYPES.FLOOR: return INTERIOR_TILES.FLOOR;
                        case BuildingLayouts.TILE_TYPES.WALL: return INTERIOR_TILES.WALL;
                        case BuildingLayouts.TILE_TYPES.COUNTER: return INTERIOR_TILES.COUNTER;
                        case BuildingLayouts.TILE_TYPES.TABLE: return INTERIOR_TILES.TABLE;
                        case BuildingLayouts.TILE_TYPES.CHAIR: return INTERIOR_TILES.CHAIR;
                        case BuildingLayouts.TILE_TYPES.BED: return INTERIOR_TILES.BED;
                        case BuildingLayouts.TILE_TYPES.CHEST: return INTERIOR_TILES.CHEST;
                        case BuildingLayouts.TILE_TYPES.FORGE: return INTERIOR_TILES.FORGE;
                        case BuildingLayouts.TILE_TYPES.ANVIL: return INTERIOR_TILES.ANVIL;
                        case BuildingLayouts.TILE_TYPES.BARREL: return INTERIOR_TILES.BARREL;
                        case BuildingLayouts.TILE_TYPES.EXIT: return INTERIOR_TILES.EXIT;
                        case BuildingLayouts.TILE_TYPES.FURNITURE: return INTERIOR_TILES.FURNITURE;
                        default: return INTERIOR_TILES.FLOOR;
                    }
                })
            ),
            items: layout.items.map(item => ({
                type: INTERIOR_TILES[item.type.toUpperCase()],
                x: item.x,
                y: item.y
            })),
            exitLocation: layout.exitLocation || {
                x: Math.floor(layout.tiles[0].length / 2),
                y: layout.tiles.length - 1
            }
        };
    }

    enter() {
        debugLog('Entering building:', this.type);
        const result = BuildingManager.enterBuilding(this);
        if (result) {
            gameState.isInterior = true;
            gameState.currentBuilding = this;
        }
        debugLog('Enter building result:', result);
        return result;
    }

    exit() {
        debugLog('Exiting building');
        const result = BuildingManager.exitBuilding();
        if (result) {
            gameState.isInterior = false;
            gameState.currentBuilding = null;
        }
        return result;
    }

    checkCollision(x, y) {
        // Add a small buffer zone around buildings (e.g., 1 pixel)
        const buffer = 1;
        return x >= this.x - buffer && 
               x < this.x + this.width + buffer && 
               y >= this.y - buffer && 
               y < this.y + this.height + buffer;
    }
}

window.Building = Building; 