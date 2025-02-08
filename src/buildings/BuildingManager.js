window.BuildingManager = {
    currentInterior: null,
    
    getBuildingAt(tileX, tileY) {
        // Look for building info in surrounding tiles (since buildings can be multiple tiles)
        for (let dy = -2; dy <= 0; dy++) {
            for (let dx = -2; dx <= 0; dx++) {
                const buildingKey = `${tileX + dx},${tileY + dy}`;
                const building = window.buildingInfo.get(buildingKey);
                if (building) {
                    return building;
                }
            }
        }
        return null;
    },

    enterBuilding(building) {
        debugLog('BuildingManager: Entering building', building);
        
        if (!building) {
            console.error('Attempted to enter null building');
            return false;
        }

        // Debug log building properties
        debugLog('Building properties:', {
            x: building.x,
            y: building.y,
            width: building.width,
            height: building.height,
            type: building.type
        });

        let layout;
        if (window.BuildingLayouts) {
            layout = building.getLayout();
        } else {
            // Create a default layout if BuildingLayouts is not available
            const width = 16;
            const height = 16;
            let tiles = Array(height).fill().map(() => Array(width).fill(INTERIOR_TILES.FLOOR));
            
            // Add walls
            for (let x = 0; x < width; x++) {
                tiles[0][x] = INTERIOR_TILES.WALL;
                tiles[height-1][x] = INTERIOR_TILES.WALL;
            }
            for (let y = 0; y < height; y++) {
                tiles[y][0] = INTERIOR_TILES.WALL;
                tiles[y][width-1] = INTERIOR_TILES.WALL;
            }
            
            layout = {
                tiles: tiles,
                items: []
            };
        }

        if (!layout || !layout.tiles || !layout.tiles.length) {
            console.error('Invalid layout for building:', building);
            return false;
        }

        // Store player's world position before entering
        const worldX = player.x;
        const worldY = player.y;
        const worldTileX = Math.floor(worldX / TILE_SIZE);
        const worldTileY = Math.floor(worldY / TILE_SIZE);

        // Default to center of the layout if building coordinates are undefined
        let exitX = Math.floor(layout.tiles[0].length / 2);
        let exitY = layout.tiles.length - 1;
        let entryDirection = 'up';

        // Force the exit to always be at the bottom center
        exitX = Math.floor(layout.tiles[0].length / 2);
        exitY = layout.tiles.length - 1;
        entryDirection = 'up';

        // Only calculate relative position if building coordinates are available
        if (typeof building.x === 'number' && typeof building.y === 'number' &&
            typeof building.width === 'number' && typeof building.height === 'number') {
            
            // Calculate the exact door position relative to the building
            const relativeX = worldTileX - building.x;
            const relativeY = worldTileY - building.y;
            
            // Determine entry direction based on which edge we're closest to
            if (relativeY <= 0) {
                entryDirection = 'down';
                exitX = relativeX;
                exitY = 0;
            } else if (relativeY >= building.height - 1) {
                entryDirection = 'up';
                exitX = relativeX;
                exitY = layout.tiles.length - 1;
            } else if (relativeX <= 0) {
                entryDirection = 'right';
                exitX = 0;
                exitY = relativeY;
            } else {
                entryDirection = 'left';
                exitX = layout.tiles[0].length - 1;
                exitY = relativeY;
            }

            // Keep within bounds
            exitX = Math.min(Math.max(1, exitX), layout.tiles[0].length - 2);
            exitY = Math.min(Math.max(1, exitY), layout.tiles.length - 2);
        }

        // Set up the interior data
        this.currentInterior = {
            layout: layout,
            building: building,
            entryPoint: { 
                x: worldX, 
                y: worldY,
                tileX: worldTileX,
                tileY: worldTileY,
                direction: entryDirection
            }
        };

        // Position player inside based on entry direction
        const roomWidth = layout.tiles[0].length * TILE_SIZE;
        const roomHeight = layout.tiles.length * TILE_SIZE;
        const offsetX = (canvas.width - roomWidth) / 2;
        const offsetY = (canvas.height - roomHeight) / 2;

        // Calculate starting position based on exit position
        let startX = exitX;
        let startY = exitY - 1;  // Always position player one tile above the exit

        // Update layout with new exit position
        for (let y = 0; y < layout.tiles.length; y++) {
            for (let x = 0; x < layout.tiles[0].length; x++) {
                if (layout.tiles[y][x] === INTERIOR_TILES.EXIT) {
                    layout.tiles[y][x] = INTERIOR_TILES.WALL;
                }
            }
        }
        layout.tiles[exitY][exitX] = INTERIOR_TILES.EXIT;
        layout.exitLocation = { x: exitX, y: exitY };
        
        // Ensure the tile in front of the exit is walkable
        if (exitY > 0) {
            layout.tiles[exitY - 1][exitX] = INTERIOR_TILES.FLOOR;
        }

        // Convert to pixel coordinates with offset
        player.x = (startX * TILE_SIZE) + offsetX;
        player.y = (startY * TILE_SIZE) + offsetY;
        player.direction = entryDirection;
        player.isMoving = false;

        // Start transition effect
        TransitionManager.startTransition('enter');
        
        debugLog('Entered building successfully');
        return true;
    },
    
    exitBuilding() {
        debugLog('BuildingManager: Exiting building');
        if (!this.currentInterior) return false;

        const entry = this.currentInterior.entryPoint;
        
        // Start fade out transition
        TransitionManager.startTransition('exit', () => {
            // Position player just below the door they entered from
            player.x = entry.tileX * TILE_SIZE;
            player.y = (entry.tileY + 1) * TILE_SIZE;  // One tile below entry point
            player.direction = 'down';  // Always face down when exiting
            player.isMoving = false;
            player.moveProgress = 0;

            // Clear interior state
            this.currentInterior = null;

            // Center camera on player
            camera.x = Math.floor(player.x - canvas.width / 2);
            camera.y = Math.floor(player.y - canvas.height / 2);

            // Start fade in transition
            TransitionManager.startTransition('enter');
        });

        return true;
    },
    
    isInside() {
        return this.currentInterior !== null;
    },
    
    getCurrentInterior() {
        return this.currentInterior;
    },

    checkInteriorCollision(x, y) {
        if (!this.currentInterior || !this.currentInterior.layout) {
            return true;
        }

        // Convert world coordinates to interior tile coordinates
        // Adjust for the room offset
        const roomWidth = this.currentInterior.layout.tiles[0].length * TILE_SIZE;
        const roomHeight = this.currentInterior.layout.tiles.length * TILE_SIZE;
        const offsetX = (canvas.width - roomWidth) / 2;
        const offsetY = (canvas.height - roomHeight) / 2;

        // Adjust coordinates to account for room offset and the one-tile shift
        const adjustedX = x - offsetX + TILE_SIZE;  // Add one tile width to compensate
        const adjustedY = y - offsetY + TILE_SIZE;  // Add one tile height to compensate
        
        const tileX = Math.floor(adjustedX / TILE_SIZE);
        const tileY = Math.floor(adjustedY / TILE_SIZE);

        const layout = this.currentInterior.layout;
        
        // Check bounds
        if (tileX < 0 || tileX >= layout.tiles[0].length ||
            tileY < 0 || tileY >= layout.tiles.length) {
            return true;
        }

        const tile = layout.tiles[tileY][tileX];
        return tile === INTERIOR_TILES.WALL || 
               tile === INTERIOR_TILES.COUNTER ||
               tile === INTERIOR_TILES.TABLE;
    },

    // Helper methods for coordinate conversion
    worldToTile(worldX, worldY) {
        if (!this.currentInterior) return null;

        const layout = this.currentInterior.layout;
        const roomWidth = layout.tiles[0].length * TILE_SIZE;
        const roomHeight = layout.tiles.length * TILE_SIZE;
        const offsetX = (canvas.width - roomWidth) / 2;
        const offsetY = (canvas.height - roomHeight) / 2;

        const localX = worldX - offsetX + TILE_SIZE;  // Add one tile width to compensate
        const localY = worldY - offsetY + TILE_SIZE;  // Add one tile height to compensate
        
        return {
            x: Math.floor(localX / TILE_SIZE),
            y: Math.floor(localY / TILE_SIZE)
        };
    },

    tileToWorld(tileX, tileY) {
        if (!this.currentInterior) return null;

        const layout = this.currentInterior.layout;
        const roomWidth = layout.tiles[0].length * TILE_SIZE;
        const roomHeight = layout.tiles.length * TILE_SIZE;
        const offsetX = (canvas.width - roomWidth) / 2;
        const offsetY = (canvas.height - roomHeight) / 2;

        return {
            x: (tileX * TILE_SIZE) + offsetX - TILE_SIZE,  // Subtract one tile width to compensate
            y: (tileY * TILE_SIZE) + offsetY - TILE_SIZE   // Subtract one tile height to compensate
        };
    }
}; 