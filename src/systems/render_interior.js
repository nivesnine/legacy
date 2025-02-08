// Add interior tile constants
window.addEventListener('load', () => {
    if (!window.BuildingLayouts) {
        console.error('BuildingLayouts not loaded when initializing interior rendering');
        return;
    }
    // Use the consolidated INTERIOR_TILES from buildings/interiors.js
    if (!window.INTERIOR_TILES) {
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
    }
});

// Interior rendering system
window.renderInterior = function(ctx) {
    const interior = BuildingManager.getCurrentInterior();
    if (!interior || !interior.layout) return;

    const layout = interior.layout;
    const camera = window.camera;

    // Calculate visible area
    const startX = Math.max(0, Math.floor(camera.x / TILE_SIZE));
    const startY = Math.max(0, Math.floor(camera.y / TILE_SIZE));
    const endX = Math.min(layout.tiles[0].length, Math.ceil((camera.x + canvas.width) / TILE_SIZE));
    const endY = Math.min(layout.tiles.length, Math.ceil((camera.y + canvas.height) / TILE_SIZE));

    // Draw floor and walls first
    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const tile = layout.tiles[y][x];
            const screenX = x * TILE_SIZE - camera.x;
            const screenY = y * TILE_SIZE - camera.y;

            // Draw floor under everything
            if (tile !== INTERIOR_TILES.WALL) {
                if (sprites.floor) {
                    ctx.drawImage(sprites.floor, screenX, screenY, TILE_SIZE, TILE_SIZE);
                } else {
                    ctx.fillStyle = '#8b7355';  // Floor color
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                }
            }

            // Draw walls and other tiles
            switch(tile) {
                case INTERIOR_TILES.WALL:
                    if (sprites.wall) {
                        ctx.drawImage(sprites.wall, screenX, screenY, TILE_SIZE, TILE_SIZE);
                    } else {
                        ctx.fillStyle = '#654321';  // Wall color
                        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    }
                    break;
                case INTERIOR_TILES.EXIT:
                    if (sprites.door) {
                        ctx.drawImage(sprites.door, screenX, screenY, TILE_SIZE, TILE_SIZE);
                    } else {
                        ctx.fillStyle = '#4a2810';  // Door color
                        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                        ctx.strokeStyle = '#2a1810';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                    }
                    break;
            }
        }
    }

    // Draw items
    if (layout.items) {
        layout.items.forEach(item => {
            if (item.x >= startX && item.x < endX && item.y >= startY && item.y < endY) {
                const screenX = item.x * TILE_SIZE - camera.x;
                const screenY = item.y * TILE_SIZE - camera.y;

                // Draw item based on type
                switch(item.type) {
                    case INTERIOR_TILES.TABLE:
                        if (sprites.table) {
                            ctx.drawImage(sprites.table, screenX, screenY, TILE_SIZE, TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#8b4513';
                            ctx.fillRect(screenX + 4, screenY + 4, TILE_SIZE - 8, TILE_SIZE - 8);
                        }
                        break;
                    case INTERIOR_TILES.CHAIR:
                        if (sprites.chair) {
                            ctx.drawImage(sprites.chair, screenX, screenY, TILE_SIZE, TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#654321';
                            ctx.fillRect(screenX + 8, screenY + 8, TILE_SIZE - 16, TILE_SIZE - 16);
                        }
                        break;
                    case INTERIOR_TILES.BED:
                        if (sprites.bed) {
                            ctx.drawImage(sprites.bed, screenX, screenY, TILE_SIZE * 2, TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#8b4513';
                            ctx.fillRect(screenX, screenY, TILE_SIZE * 2, TILE_SIZE);
                            // Add mattress
                            ctx.fillStyle = '#DEB887';
                            ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE * 2 - 4, TILE_SIZE - 4);
                        }
                        break;
                    case INTERIOR_TILES.CHEST:
                        if (sprites.chest) {
                            ctx.drawImage(sprites.chest, screenX, screenY, TILE_SIZE, TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#8b4513';
                            ctx.fillRect(screenX + 4, screenY + 8, TILE_SIZE - 8, TILE_SIZE - 12);
                        }
                        break;
                    case INTERIOR_TILES.FORGE:
                        if (sprites.forge) {
                            ctx.drawImage(sprites.forge, screenX, screenY, TILE_SIZE, TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#4a2810';
                            ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                            // Add fire effect
                            ctx.fillStyle = '#FF4500';
                            ctx.fillRect(screenX + 6, screenY + 6, TILE_SIZE - 12, TILE_SIZE - 12);
                        }
                        break;
                    case INTERIOR_TILES.ANVIL:
                        if (sprites.anvil) {
                            ctx.drawImage(sprites.anvil, screenX, screenY, TILE_SIZE, TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#696969';
                            ctx.fillRect(screenX + 4, screenY + 8, TILE_SIZE - 8, TILE_SIZE - 12);
                        }
                        break;
                    case INTERIOR_TILES.BARREL:
                        if (sprites.barrel) {
                            ctx.drawImage(sprites.barrel, screenX, screenY, TILE_SIZE, TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#8b4513';
                            ctx.fillRect(screenX + 4, screenY + 2, TILE_SIZE - 8, TILE_SIZE - 4);
                            // Add barrel rings
                            ctx.strokeStyle = '#4a2810';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(screenX + 4, screenY + 4, TILE_SIZE - 8, 2);
                            ctx.strokeRect(screenX + 4, screenY + TILE_SIZE - 6, TILE_SIZE - 8, 2);
                        }
                        break;
                    case INTERIOR_TILES.COUNTER:
                        if (sprites.counter) {
                            ctx.drawImage(sprites.counter, screenX, screenY, TILE_SIZE, TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#8b4513';
                            ctx.fillRect(screenX + 2, screenY + 6, TILE_SIZE - 4, TILE_SIZE - 8);
                        }
                        break;
                }
            }
        });
    }

    // Draw player
    const playerScreenX = player.x - camera.x;
    const playerScreenY = player.y - camera.y;
    
    // Only draw the player if we're in an interior
    if (BuildingManager.isInside()) {
        const sprite = player.isMoving ? 
            spriteAnimation.getCurrentFrame(player.direction, true) : 
            sprites[player.direction];
            
        if (!sprite) {
            // Fallback if sprite is undefined
            ctx.fillStyle = '#000000';
            ctx.fillRect(playerScreenX + 4, playerScreenY + 4, TILE_SIZE - 8, TILE_SIZE - 8);
            return;
        }
        
        drawSprite(ctx, sprite, playerScreenX, playerScreenY);
    }
};

window.renderInterior = renderInterior;

// Helper function to get interior tile at a position
window.getInteriorTile = function(x, y) {
    const currentInterior = BuildingManager.getCurrentInterior();
    if (!currentInterior) return null;
    
    const layout = currentInterior.layout;
    if (y < 0 || y >= layout.tiles.length || 
        x < 0 || x >= layout.tiles[0].length) {
        return INTERIOR_TILES.WALL;
    }
    
    return layout.tiles[y][x];
}; 