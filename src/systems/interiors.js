// Interior layout templates
window.INTERIOR_LAYOUTS = {
    [window.BUILDING_TYPES.HOUSE]: function() {
        return {
            tiles: [
                [1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 2, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1]
            ],
            items: [
                { type: INTERIOR_TILES.BED, x: 1, y: 1 },
                { type: INTERIOR_TILES.TABLE, x: 3, y: 3 },
                { type: INTERIOR_TILES.CHAIR, x: 2, y: 3 },
                { type: INTERIOR_TILES.CHAIR, x: 4, y: 3 },
                { type: INTERIOR_TILES.CHEST, x: 5, y: 1 }
            ]
        };
    },

    [window.BUILDING_TYPES.SHOP]: function() {
        return {
            tiles: [
                [1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 3, 3, 3, 3, 3, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 2, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1]
            ],
            items: [
                { type: INTERIOR_TILES.CHEST, x: 1, y: 1 },
                { type: INTERIOR_TILES.CHEST, x: 3, y: 1 },
                { type: INTERIOR_TILES.CHEST, x: 5, y: 1 }
            ]
        };
    },

    [window.BUILDING_TYPES.TAVERN]: function() {
        return {
            tiles: [
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 3, 3, 3, 3, 3, 3, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 2, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1]
            ],
            items: [
                { type: INTERIOR_TILES.TABLE, x: 2, y: 4 },
                { type: INTERIOR_TILES.CHAIR, x: 1, y: 4 },
                { type: INTERIOR_TILES.CHAIR, x: 3, y: 4 },
                { type: INTERIOR_TILES.TABLE, x: 5, y: 4 },
                { type: INTERIOR_TILES.CHAIR, x: 4, y: 4 },
                { type: INTERIOR_TILES.CHAIR, x: 6, y: 4 },
                { type: INTERIOR_TILES.BARREL, x: 1, y: 1 },
                { type: INTERIOR_TILES.BARREL, x: 6, y: 1 }
            ]
        };
    },

    [window.BUILDING_TYPES.BLACKSMITH]: function() {
        return {
            tiles: [
                [1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 3, 3, 3, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 2, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1]
            ],
            items: [
                { type: INTERIOR_TILES.FORGE, x: 1, y: 1 },
                { type: INTERIOR_TILES.ANVIL, x: 1, y: 2 },
                { type: INTERIOR_TILES.CHEST, x: 5, y: 1 }
            ]
        };
    },

    [window.BUILDING_TYPES.INN]: function() {
        return {
            tiles: [
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 2, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1]
            ],
            items: [
                { type: INTERIOR_TILES.BED, x: 1, y: 1 },
                { type: INTERIOR_TILES.BED, x: 1, y: 2 },
                { type: INTERIOR_TILES.BED, x: 5, y: 1 },
                { type: INTERIOR_TILES.BED, x: 5, y: 2 },
                { type: INTERIOR_TILES.TABLE, x: 2, y: 5 },
                { type: INTERIOR_TILES.CHAIR, x: 1, y: 5 },
                { type: INTERIOR_TILES.CHAIR, x: 3, y: 5 },
                { type: INTERIOR_TILES.TABLE, x: 5, y: 5 },
                { type: INTERIOR_TILES.CHAIR, x: 4, y: 5 },
                { type: INTERIOR_TILES.CHAIR, x: 6, y: 5 }
            ]
        };
    }
};

// Tile types for interiors
window.INTERIOR_TILES = {
    FLOOR: 0,
    WALL: 1,
    EXIT: 2,
    COUNTER: 3,
    TABLE: 4,
    CHAIR: 5,
    BED: 6,
    CHEST: 7,
    FORGE: 8,
    ANVIL: 9,
    BARREL: 10
};

window.enterBuilding = function(building) {
    if (!building || !building.type) {
        debugLog('Invalid building data');
        return false;
    }
    
    const layoutGenerator = window.INTERIOR_LAYOUTS[building.type];
    if (!layoutGenerator) {
        debugLog('No layout found for building type:', building.type);
        return false;
    }
    
    const layout = layoutGenerator();
    
    // Store player's world position and state
    const worldX = player.x;
    const worldY = player.y;
    const worldDirection = player.direction;
    
    window.currentInterior = {
        layout: layout,
        buildingKey: building.key,
        entryPoint: { 
            x: worldX, 
            y: worldY,
            direction: worldDirection,
            doorTileX: Math.floor(worldX / TILE_SIZE),
            doorTileY: Math.floor(worldY / TILE_SIZE)
        }
    };
    
    // Position player at the interior entrance
    const entranceY = layout.tiles.length - 2;  // One tile up from bottom
    const entranceX = Math.floor(layout.tiles[0].length / 2);  // Center of room
    
    // Update player position and direction
    player.x = entranceX * TILE_SIZE;
    player.y = entranceY * TILE_SIZE;
    player.direction = 'up';
    player.sprite = sprites.up;
    
    // Center camera on the room
    camera.x = (layout.tiles[0].length * TILE_SIZE - canvas.width) / 2;
    camera.y = (layout.tiles.length * TILE_SIZE - canvas.height) / 2;
    
    return true;
};

window.exitBuilding = function() {
    if (!currentInterior) return false;
    
    // Return to exact door position
    const entry = currentInterior.entryPoint;
    player.x = entry.doorTileX * TILE_SIZE;
    player.y = entry.doorTileY * TILE_SIZE;
    player.direction = entry.direction;
    player.sprite = sprites[entry.direction];
    
    // Move player slightly away from door to prevent re-entry
    const offset = TILE_SIZE / 2;
    switch(entry.direction) {
        case 'up':
            player.y += offset;
            break;
        case 'down':
            player.y -= offset;
            break;
        case 'left':
            player.x += offset;
            break;
        case 'right':
            player.x -= offset;
            break;
    }
    
    currentInterior = null;
    interiorOverlay.hide();
    return true;
}; 