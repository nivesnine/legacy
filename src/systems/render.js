const tileCache = new Map();

function getTileCachedCanvas(type, width = TILE_SIZE, height = TILE_SIZE) {
    if (!tileCache.has(type)) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // More varied color palette while keeping pixel art style
        const COLORS = {
            // Nature colors
            GRASS_DARK: '#2d5a1d',
            GRASS_LIGHT: '#3d8a2d',
            TREE_TRUNK: '#654321',
            TREE_DARK: '#1a4f1a',
            TREE_MID: '#2d7a2d',
            TREE_LIGHT: '#3d9a3d',
            WATER_DARK: '#1d3a4a',
            WATER_LIGHT: '#2d5a7a',
            // Structure colors
            STONE_DARK: '#4a4a4a',
            STONE_LIGHT: '#7a7a7a',
            WOOD_DARK: '#4a2d1d',
            WOOD_LIGHT: '#7a4a2d',
            // Additional colors
            PATH_DARK: '#8b6d2d',
            PATH_LIGHT: '#a68b4d',
            ROCK_DARK: '#505050',
            ROCK_MID: '#707070',
            ROCK_LIGHT: '#909090',
            PEAK_LIGHT: '#ffffff',
            SHRINE_DARK: '#8b7355',
            SHRINE_LIGHT: '#ffd700'
        };
        
        switch(type) {
            case TILES.WALL:
                // Stone wall with simple texture
                ctx.fillStyle = COLORS.STONE_DARK;
                ctx.fillRect(0, 0, width, height);
                // Brick pattern
                ctx.fillStyle = COLORS.STONE_LIGHT;
                for (let y = 0; y < height; y += 4) {
                    ctx.fillRect(y % 8 ? 0 : 4, y, 8, 3);
                }
                break;

            case TILES.TREE:
                // Detailed tree with better shape
                // Trunk
                ctx.fillStyle = COLORS.TREE_TRUNK;
                ctx.fillRect(6, 8, 4, 8);   // Main trunk
                ctx.fillRect(5, 13, 6, 3);  // Trunk base
                ctx.fillStyle = '#543219';   // Darker trunk detail
                ctx.fillRect(7, 9, 2, 6);    // Trunk texture
                
                // Layered foliage for more natural look
                ctx.fillStyle = COLORS.TREE_DARK;
                ctx.beginPath();
                ctx.moveTo(8, 0);           // Top point
                ctx.lineTo(15, 7);          // Bottom right
                ctx.lineTo(1, 7);           // Bottom left
                ctx.fill();
                
                ctx.fillStyle = COLORS.TREE_MID;
                ctx.beginPath();
                ctx.moveTo(8, 2);
                ctx.lineTo(13, 8);
                ctx.lineTo(3, 8);
                ctx.fill();
                
                ctx.fillStyle = COLORS.TREE_LIGHT;
                // Add some highlight spots for texture
                for (let i = 0; i < 4; i++) {
                    const x = 4 + Math.floor(seededRandom(i) * 8);
                    const y = 2 + Math.floor(seededRandom(i + 1) * 4);
                    ctx.fillRect(x, y, 2, 2);
                }
                break;

            case TILES.WATER:
                ctx.fillStyle = COLORS.WATER_DARK;
                ctx.fillRect(0, 0, width, height);
                // Simple wave pattern
                ctx.fillStyle = COLORS.WATER_LIGHT;
                for (let i = 0; i < width; i += 4) {
                    ctx.fillRect(i, height/2, 2, 2);
                    ctx.fillRect((i + 2) % width, height/2 + 4, 2, 2);
                }
                break;

            case TILES.EMPTY:
                ctx.fillStyle = COLORS.GRASS_DARK;
                ctx.fillRect(0, 0, width, height);
                // Random grass details
                ctx.fillStyle = COLORS.GRASS_LIGHT;
                for (let i = 0; i < 4; i++) {
                    const x = Math.floor(seededRandom(i) * width);
                    const y = Math.floor(seededRandom(i + 1) * height);
                    ctx.fillRect(x, y, 2, 2);
                }
                break;

            case TILES.BUILDING:
                ctx.fillStyle = COLORS.WOOD_DARK;
                ctx.fillRect(0, 0, width, height);
                // Wood plank texture
                ctx.fillStyle = COLORS.WOOD_LIGHT;
                for (let i = 2; i < height; i += 4) {
                    ctx.fillRect(0, i, width, 2);
                }
                // Window
                ctx.fillStyle = COLORS.STONE_LIGHT;
                ctx.fillRect(4, 4, 8, 8);
                ctx.fillStyle = COLORS.WOOD_DARK;
                ctx.fillRect(7, 4, 2, 8);
                ctx.fillRect(4, 7, 8, 2);
                break;

            case TILES.DOOR:
                ctx.fillStyle = COLORS.WOOD_DARK;
                ctx.fillRect(0, 0, width, height);
                // Door panel
                ctx.fillStyle = COLORS.WOOD_LIGHT;
                ctx.fillRect(2, 0, 12, height);
                // Door handle
                ctx.fillStyle = COLORS.STONE_LIGHT;
                ctx.fillRect(12, 8, 2, 2);
                // Make sure door is visually distinct
                ctx.fillStyle = COLORS.WOOD_DARK;
                ctx.fillRect(3, 2, 10, 2);  // Top panel
                ctx.fillRect(3, 12, 10, 2); // Bottom panel
                break;

            case TILES.ROAD:
                ctx.fillStyle = COLORS.PATH_DARK;
                ctx.fillRect(0, 0, width, height);
                // Path stones
                ctx.fillStyle = COLORS.PATH_LIGHT;
                for (let i = 0; i < width; i += 4) {
                    for (let j = 0; j < height; j += 4) {
                        ctx.fillRect(i, j, 3, 3);
                    }
                }
                break;

            case TILES.PEAK:
                // Mountain base
                ctx.fillStyle = COLORS.ROCK_DARK;
                ctx.beginPath();
                ctx.moveTo(0, height);
                ctx.lineTo(width/2, 4);
                ctx.lineTo(width, height);
                ctx.fill();
                // Snow cap
                ctx.fillStyle = COLORS.PEAK_LIGHT;
                ctx.beginPath();
                ctx.moveTo(width/2, 4);
                ctx.lineTo(width/2 + 4, 8);
                ctx.lineTo(width/2 - 4, 8);
                ctx.fill();
                break;

            case TILES.SHRINE:
                // Base
                ctx.fillStyle = COLORS.SHRINE_DARK;
                ctx.fillRect(2, 8, 12, 8);
                // Roof
                ctx.fillStyle = COLORS.SHRINE_LIGHT;
                ctx.beginPath();
                ctx.moveTo(1, 8);
                ctx.lineTo(8, 2);
                ctx.lineTo(15, 8);
                ctx.fill();
                // Door
                ctx.fillStyle = COLORS.WOOD_DARK;
                ctx.fillRect(6, 10, 4, 6);
                break;

            case TILES.ROCK:
                // More detailed rock formation
                ctx.fillStyle = COLORS.ROCK_DARK;
                ctx.beginPath();
                // Main rock shape
                ctx.moveTo(3, 13);          // Bottom left
                ctx.lineTo(13, 13);         // Bottom right
                ctx.lineTo(15, 9);          // Right point
                ctx.lineTo(14, 8);
                ctx.lineTo(12, 3);          // Upper right
                ctx.lineTo(8, 1);           // Top point
                ctx.lineTo(4, 3);           // Upper left
                ctx.lineTo(1, 9);           // Left point
                ctx.closePath();
                ctx.fill();
                
                // Add highlights
                ctx.fillStyle = COLORS.ROCK_LIGHT;
                ctx.beginPath();
                ctx.moveTo(8, 1);
                ctx.lineTo(12, 4);
                ctx.lineTo(10, 8);
                ctx.lineTo(6, 6);
                ctx.closePath();
                ctx.fill();
                
                // Add texture details
                ctx.strokeStyle = COLORS.ROCK_MID;
                ctx.lineWidth = 1;
                // Cracks and texture lines
                ctx.beginPath();
                ctx.moveTo(4, 7);
                ctx.lineTo(7, 9);
                ctx.moveTo(9, 5);
                ctx.lineTo(12, 7);
                ctx.moveTo(6, 11);
                ctx.lineTo(10, 11);
                ctx.stroke();
                
                // Small rock details
                ctx.fillStyle = COLORS.ROCK_MID;
                ctx.fillRect(2, 11, 2, 2);
                ctx.fillRect(13, 10, 2, 2);
                break;

            default:
                // Default ground tile
                ctx.fillStyle = COLORS.GRASS_DARK;
                ctx.fillRect(0, 0, width, height);
                break;
        }
        
        tileCache.set(type, canvas);
    }
    return tileCache.get(type);
}

// Main rendering function
window.drawWorld = function(ctx) {
    // Get visible chunks based on camera position
    const startChunkX = Math.floor(camera.x / (TILE_SIZE * CHUNK_SIZE));
    const startChunkY = Math.floor(camera.y / (TILE_SIZE * CHUNK_SIZE));
    const chunksX = Math.ceil(camera.width / (TILE_SIZE * CHUNK_SIZE)) + 1;
    const chunksY = Math.ceil(camera.height / (TILE_SIZE * CHUNK_SIZE)) + 1;

    // Draw visible chunks
    for (let y = 0; y < chunksY; y++) {
        for (let x = 0; x < chunksX; x++) {
            const chunkX = startChunkX + x;
            const chunkY = startChunkY + y;
            drawChunk(ctx, chunkX, chunkY);
        }
    }

    // Draw buildings
    if (window.buildingInfo) {
        for (const [key, building] of window.buildingInfo) {
            const screenX = building.worldX * TILE_SIZE - camera.x;
            const screenY = building.worldY * TILE_SIZE - camera.y;

            // Only draw if building is visible
            if (screenX + TILE_SIZE >= 0 &&
                screenY + TILE_SIZE >= 0 &&
                screenX <= camera.width &&
                screenY <= camera.height) {
                
                // Draw the building tile
                const buildingTile = getTileCachedCanvas(TILES.BUILDING);
                if (buildingTile) {
                    ctx.drawImage(buildingTile, screenX, screenY);
                }

                // If this tile has a door, draw the door overlay
                if (building.isDoor) {
                    // Draw door frame
                    ctx.fillStyle = '#8b4513';  // Dark brown
                    ctx.fillRect(screenX + 4, screenY, 8, TILE_SIZE);
                    
                    // Draw door handle
                    ctx.fillStyle = '#ffd700';  // Gold
                    ctx.fillRect(screenX + 10, screenY + 8, 2, 2);
                }
            }
        }
    }
};

function drawChunk(ctx, chunkX, chunkY) {
    const chunk = getChunk(chunkX, chunkY);
    if (!chunk) return;

    const chunkScreenX = chunkX * CHUNK_SIZE * TILE_SIZE - camera.x;
    const chunkScreenY = chunkY * CHUNK_SIZE * TILE_SIZE - camera.y;

    // Only draw if chunk is visible on screen
    if (chunkScreenX + CHUNK_SIZE * TILE_SIZE < 0 || 
        chunkScreenY + CHUNK_SIZE * TILE_SIZE < 0 ||
        chunkScreenX > camera.width || 
        chunkScreenY > camera.height) {
        return;
    }

    // Draw each tile in the chunk
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const tile = chunk[y][x];
            const screenX = chunkScreenX + x * TILE_SIZE;
            const screenY = chunkScreenY + y * TILE_SIZE;

            // Skip if tile is off screen
            if (screenX + TILE_SIZE < 0 || 
                screenY + TILE_SIZE < 0 ||
                screenX > camera.width || 
                screenY > camera.height) {
                continue;
            }

            // Draw the tile
            const tileCanvas = getTileCachedCanvas(tile);
            if (tileCanvas) {
                ctx.drawImage(tileCanvas, screenX, screenY);
            }
        }
    }
}

// Player rendering
window.drawPlayer = function(ctx) {
    const sprite = spriteAnimation.getCurrentFrame(player.direction, player.isMoving);
    const screenX = Math.floor(player.x - camera.x);
    const screenY = Math.floor(player.y - camera.y);
    
    drawSprite(ctx, sprite, screenX, screenY);
};

// Building rendering
function renderBuilding(ctx, screenX, screenY, worldX, worldY) {
    const buildingKey = `${worldX},${worldY}`;
    const info = window.buildingInfo.get(buildingKey);
    
    if (!info) return;

    // Find position within building
    const originX = Math.floor(worldX / info.width) * info.width;
    const originY = Math.floor(worldY / info.height) * info.height;
    const relX = worldX - originX;
    const relY = worldY - originY;

    switch(info.type) {
        case BUILDING_TYPES.HOUSE:
            // Base wall
            ctx.fillStyle = '#8B4513';  // Wood brown base
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            
            // Wood plank texture
            ctx.fillStyle = '#A0522D';  // Darker wood
            for (let i = 2; i < TILE_SIZE; i += 4) {
                ctx.fillRect(screenX, screenY + i, TILE_SIZE, 2);
            }

            // Add windows to middle sections
            if (relX > 0 && relX < info.width - 1 && relY > 0 && relY < info.height - 1) {
                // Window frame
                ctx.fillStyle = '#654321';  // Dark wood
                ctx.fillRect(screenX + 3, screenY + 3, 10, 10);
                // Window glass
                ctx.fillStyle = '#F8F8FF';  // White smoke
                ctx.fillRect(screenX + 4, screenY + 4, 8, 8);
                // Window cross
                ctx.fillStyle = '#654321';
                ctx.fillRect(screenX + 7, screenY + 4, 2, 8);
                ctx.fillRect(screenX + 4, screenY + 7, 8, 2);
            }

            // Add roof to top row
            if (relY === 0) {
                ctx.fillStyle = '#8B0000';  // Dark red roof
                ctx.beginPath();
                ctx.moveTo(screenX, screenY);
                ctx.lineTo(screenX + TILE_SIZE/2, screenY - 6);
                ctx.lineTo(screenX + TILE_SIZE, screenY);
                ctx.fill();
                // Roof texture
                ctx.fillStyle = '#800000';
                for (let i = 0; i < TILE_SIZE; i += 4) {
                    ctx.fillRect(screenX + i, screenY - i/3, 3, 2);
                }
            }
            break;

        case BUILDING_TYPES.SHOP:
            // Stone wall base
            ctx.fillStyle = '#696969';  // Stone gray
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            
            // Stone texture
            ctx.fillStyle = '#808080';  // Lighter gray
            for (let i = 0; i < TILE_SIZE; i += 4) {
                for (let j = 0; j < TILE_SIZE; j += 4) {
                    if ((i + j) % 8 === 0) {
                        ctx.fillRect(screenX + i, screenY + j, 3, 3);
                    }
                }
            }

            // Shop windows and details
            if (relX > 0 && relX < info.width - 1 && relY > 0 && relY < info.height - 1) {
                // Large display window
                ctx.fillStyle = '#B8B8B8';  // Light gray frame
                ctx.fillRect(screenX + 2, screenY + 3, 12, 10);
                ctx.fillStyle = '#F0F8FF';  // Alice blue glass
                ctx.fillRect(screenX + 3, screenY + 4, 10, 8);
            }

            // Shop sign on top row
            if (relY === 0) {
                ctx.fillStyle = '#DEB887';  // Burlywood sign
                ctx.fillRect(screenX + 2, screenY, 12, 4);
                ctx.strokeStyle = '#8B4513';  // Wood trim
                ctx.strokeRect(screenX + 2, screenY, 12, 4);
            }
            break;

        case BUILDING_TYPES.INN:
            // Tudor-style walls
            ctx.fillStyle = '#F5DEB3';  // Wheat colored wall
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            
            // Timber frame
            ctx.fillStyle = '#8B4513';  // Dark wood beams
            if (relX === 0 || relX === info.width - 1) {
                ctx.fillRect(screenX + 2, screenY, 3, TILE_SIZE);
            }
            if (relY === 0 || relY === info.height - 1) {
                ctx.fillRect(screenX, screenY + 2, TILE_SIZE, 3);
            }

            // Windows and details
            if (relX > 0 && relX < info.width - 1 && relY > 0 && relY < info.height - 1) {
                // Diamond pane windows
                ctx.fillStyle = '#8B4513';  // Frame
                ctx.fillRect(screenX + 3, screenY + 3, 10, 10);
                ctx.fillStyle = '#FAFAD2';  // Light yellow glass
                ctx.fillRect(screenX + 4, screenY + 4, 8, 8);
                // Diamond pattern
                ctx.strokeStyle = '#8B4513';
                ctx.beginPath();
                ctx.moveTo(screenX + 8, screenY + 4);
                ctx.lineTo(screenX + 8, screenY + 12);
                ctx.moveTo(screenX + 4, screenY + 8);
                ctx.lineTo(screenX + 12, screenY + 8);
                ctx.stroke();
            }
            break;

        case BUILDING_TYPES.BLACKSMITH:
            // Stone and timber walls
            ctx.fillStyle = '#696969';  // Stone base
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            
            // Forge details
            if (relY === info.height - 1) {
                // Glowing forge
                ctx.fillStyle = '#FF4500';  // Orange red
                ctx.fillRect(screenX + 4, screenY + 8, 8, 6);
                // Embers
                ctx.fillStyle = '#FFD700';  // Gold
                for (let i = 0; i < 3; i++) {
                    ctx.fillRect(screenX + 5 + i*3, screenY + 9, 2, 2);
                }
            }

            // Tools on walls
            if (relX === info.width - 1) {
                ctx.fillStyle = '#363636';  // Dark gray
                ctx.fillRect(screenX + 12, screenY + 4, 2, 8);  // Hammer
                ctx.fillRect(screenX + 8, screenY + 6, 2, 6);   // Tongs
            }
            break;
    }
}

// Add this function back
function drawBuildingInfo(ctx) {
    const playerTileX = Math.floor(player.x / TILE_SIZE);
    const playerTileY = Math.floor(player.y / TILE_SIZE);
    
    if (getTile(playerTileX, playerTileY) === TILES.DOOR) {
        // Look for associated building
        for (let by = -2; by <= 0; by++) {
            for (let bx = -2; bx <= 0; bx++) {
                const buildingKey = `${playerTileX + bx},${playerTileY + by}`;
                const info = window.buildingInfo.get(buildingKey);
                if (info) {
                    // Draw info box
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.fillRect(10, camera.height - 60, camera.width - 20, 50);
                    
                    ctx.fillStyle = 'white';
                    ctx.font = '16px Arial';
                    ctx.fillText(info.name, 20, camera.height - 40);
                    ctx.font = '12px Arial';
                    ctx.fillText(info.type, 20, camera.height - 20);
                    return;
                }
            }
        }
    }
}

function drawInventory(ctx) {
    const slotSize = 32;
    const padding = 4;
    const startX = 10;
    const startY = camera.height - slotSize - 10;

    // Draw inventory background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(
        startX - padding, 
        startY - padding,
        (slotSize + padding) * inventory.maxSize + padding,
        slotSize + padding * 2
    );

    // Draw slots
    for (let i = 0; i < inventory.maxSize; i++) {
        const x = startX + i * (slotSize + padding);
        const y = startY;

        // Slot background
        ctx.fillStyle = i === inventory.selectedSlot ? '#444444' : '#222222';
        ctx.fillRect(x, y, slotSize, slotSize);

        // Draw item if exists
        const item = inventory.items[i];
        if (item) {
            ctx.font = '20px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(item.icon, x + 8, y + 24);
            
            if (item.stackable && item.quantity > 1) {
                ctx.font = '12px Arial';
                ctx.fillText(item.quantity, x + slotSize - 14, y + slotSize - 4);
            }
        }
    }
}

function drawInterior(ctx) {
    if (!window.currentInterior || !window.currentInterior.layout) {
        debugLog('No interior layout to draw');
        return;
    }

    const layout = window.currentInterior.layout;
    
    // Clear background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, camera.width, camera.height);
    
    // Draw interior tiles
    for (let y = 0; y < layout.tiles.length; y++) {
        for (let x = 0; x < layout.tiles[y].length; x++) {
            const tile = layout.tiles[y][x];
            const screenX = x * TILE_SIZE - camera.x;
            const screenY = y * TILE_SIZE - camera.y;
            
            // Draw the appropriate tile
            switch(tile) {
                case INTERIOR_TILES.FLOOR:
                    ctx.fillStyle = '#8B4513';  // Wood floor
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    break;
                    
                case INTERIOR_TILES.WALL:
                    ctx.fillStyle = '#808080';  // Stone wall
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    break;
                    
                case INTERIOR_TILES.EXIT:
                    ctx.fillStyle = '#4A4A4A';  // Door
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    break;
                    
                case INTERIOR_TILES.COUNTER:
                    ctx.fillStyle = '#DEB887';  // Counter
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    break;
            }
        }
    }
    
    // Draw items
    if (layout.items) {
        layout.items.forEach(item => {
            const screenX = item.x * TILE_SIZE - camera.x;
            const screenY = item.y * TILE_SIZE - camera.y;
            drawInteriorItem(ctx, item.type, screenX, screenY);
        });
    }
}

function drawInteriorTile(ctx, tile, screenX, screenY) {
    switch(tile) {
        case INTERIOR_TILES.FLOOR:
            // Wooden floor
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            // Add wood grain
            ctx.fillStyle = '#A0522D';
            for (let i = 0; i < TILE_SIZE; i += 4) {
                ctx.fillRect(screenX + i, screenY, 1, TILE_SIZE);
            }
            break;

        case INTERIOR_TILES.WALL:
            // Stone wall
            ctx.fillStyle = '#808080';
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            // Add brick pattern
            ctx.fillStyle = '#666666';
            for (let y = 0; y < TILE_SIZE; y += 4) {
                for (let x = y % 8 === 0 ? 0 : 4; x < TILE_SIZE; x += 8) {
                    ctx.fillRect(screenX + x, screenY + y, 4, 4);
                }
            }
            break;

        case INTERIOR_TILES.COUNTER:
            // Counter base
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            // Counter top
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(screenX, screenY, TILE_SIZE, 4);
            break;

        case INTERIOR_TILES.TABLE:
            // Table top
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(screenX + 2, screenY + 2, 12, 12);
            // Table legs
            ctx.fillStyle = '#654321';
            ctx.fillRect(screenX + 3, screenY + 12, 2, 4);
            ctx.fillRect(screenX + 11, screenY + 12, 2, 4);
            break;

        case INTERIOR_TILES.CHAIR:
            // Chair seat
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(screenX + 4, screenY + 8, 8, 4);
            // Chair back
            ctx.fillRect(screenX + 4, screenY + 2, 8, 2);
            // Chair legs
            ctx.fillStyle = '#654321';
            ctx.fillRect(screenX + 4, screenY + 12, 2, 4);
            ctx.fillRect(screenX + 10, screenY + 12, 2, 4);
            break;

        case INTERIOR_TILES.BED:
            // Bed frame
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            // Mattress
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(screenX + 1, screenY + 1, 14, 12);
            // Pillow
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(screenX + 2, screenY + 2, 4, 4);
            break;

        case INTERIOR_TILES.EXIT:
            // Door frame
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            // Door
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(screenX + 2, screenY, 12, TILE_SIZE);
            // Handle
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(screenX + 12, screenY + 8, 1.5, 0, Math.PI * 2);
            ctx.fill();
            break;
    }
}

function drawInteriorItem(ctx, type, screenX, screenY) {
    switch(type) {
        case INTERIOR_TILES.CHEST:
            // Chest base
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(screenX + 2, screenY + 6, 12, 8);
            // Chest lid
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(screenX + 2, screenY + 4, 12, 2);
            // Lock
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(screenX + 7, screenY + 8, 2, 2);
            break;

        case INTERIOR_TILES.FORGE:
            // Forge base
            ctx.fillStyle = '#696969';
            ctx.fillRect(screenX + 2, screenY + 8, 12, 8);
            // Fire
            ctx.fillStyle = '#FF4500';
            ctx.fillRect(screenX + 4, screenY + 4, 8, 4);
            // Smoke
            ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
            ctx.beginPath();
            ctx.arc(screenX + 8, screenY + 2, 2, 0, Math.PI * 2);
            ctx.fill();
            break;

        case INTERIOR_TILES.ANVIL:
            // Anvil base
            ctx.fillStyle = '#4A4A4A';
            ctx.beginPath();
            ctx.moveTo(screenX + 4, screenY + 12);
            ctx.lineTo(screenX + 12, screenY + 12);
            ctx.lineTo(screenX + 14, screenY + 8);
            ctx.lineTo(screenX + 2, screenY + 8);
            ctx.fill();
            break;

        case INTERIOR_TILES.BARREL:
            // Barrel
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(screenX + 4, screenY + 4, 8, 12);
            // Barrel rings
            ctx.fillStyle = '#4A4A4A';
            ctx.fillRect(screenX + 4, screenY + 6, 8, 1);
            ctx.fillRect(screenX + 4, screenY + 13, 8, 1);
            break;
    }
}

function drawNPCs(ctx) {
    npcs.list.forEach(npc => {
        if (npc.sprite) {
            const screenX = Math.floor(npc.x - camera.x);
            const screenY = Math.floor(npc.y - camera.y);
            drawSprite(ctx, npc.sprite, screenX, screenY);
        }
    });
}

function drawSprite(ctx, sprite, x, y, color = null) {
    if (!sprite) return;
    
    for (let sy = 0; sy < sprite.length; sy++) {
        for (let sx = 0; sx < sprite[sy].length; sx++) {
            if (sprite[sy][sx] !== 0) {
                // If color is provided, use it, otherwise use sprite's color coding
                ctx.fillStyle = color || (
                    sprite[sy][sx] === 1 ? 'black' : 
                    sprite[sy][sx] === 2 ? 'red' : 
                    sprite[sy][sx] === 3 ? '#FFD700' : // Gold color for value 3
                    'white'
                );
                ctx.fillRect(x + sx, y + sy, 1, 1);
            }
        }
    }
}

function drawInteriorNPCs(ctx) {
    // Draw NPCs that are inside the current building
    npcs.list.forEach(npc => {
        if (npc.currentBuilding === interiorOverlay.currentBuilding) {
            const screenX = Math.floor(npc.x - camera.x);
            const screenY = Math.floor(npc.y - camera.y);
            drawSprite(ctx, npc.sprite, screenX, screenY);
        }
    });
}

