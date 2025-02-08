// Debug mode flag
window.DEBUG = true;  // Set to true to show debug information

// Helper function for debug logging
function debugLog(...args) {
    if (DEBUG && args[0]) {  // Skip tile drawing logs
        console.log(...args);
    }
}

// Find a city for the starting position
function findStartingCity() {
    // Force create a city at origin
    const originZone = getZoneInfo(0, 0);
    originZone.type = ZONES.CITY;
    originZone.cityType = CITY_TYPES.TOWN;
    originZone.buildingDensity = 0.5;
    originZone.roadDensity = 0.3;
    originZone.pattern = 0; // Grid pattern
    
    // Place player in the center of this city zone
    const centerX = 2 * CHUNK_SIZE * TILE_SIZE; // Center of the zone
    const centerY = 2 * CHUNK_SIZE * TILE_SIZE;
    
    debugLog('Starting in city at origin');
    return { x: centerX, y: centerY };
}

// Initialize game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;  // Keep pixel art sharp

// Game systems
let menu, controls;

// Initialize sprite animation system
window.spriteAnimation = {
    frameCount: 0,
    animationSpeed: 8,  // frames per animation cycle
    getCurrentFrame: function(direction, isMoving) {
        if (!isMoving) return sprites[direction];
        const frame = Math.floor(this.frameCount / this.animationSpeed) % 2;
        return sprites[direction + (frame ? '_walk' : '')];
    },
    update: function() {
        this.frameCount = (this.frameCount + 1) % (this.animationSpeed * 2);
    }
};

// Track discovered areas
window.discoveredZones = new Set();
window.discoveredPeaks = new Set();
window.visitedBuildings = new Set();

// Game timing
let lastFrameTime = 0;

// Wait for all scripts to load before initializing
window.addEventListener('load', () => {
    try {
        // Check if required classes are available
        if (!window.GameMenu) {
            throw new Error('GameMenu class not loaded');
        }
        if (!window.Controls) {
            throw new Error('Controls class not loaded');
        }

        // Initialize camera first
        initCamera();
        if (!window.camera) {
            throw new Error('Failed to initialize camera');
        }

        // Initialize UI
        menu = new window.GameMenu();
        if (!menu) {
            throw new Error('Failed to create GameMenu instance');
        }

        // Initialize controls with menu instance
        controls = new window.Controls(menu);
        if (!controls) {
            throw new Error('Failed to create Controls instance');
        }

        // Initialize player position
        const startPos = findStartingCity();
        player.x = startPos.x;
        player.y = startPos.y;
        player.direction = 'down';
        player.isMoving = false;
        
        // Center camera on player
        camera.centerOn(player.x, player.y);

        console.log('Game initialized successfully');
        // Start game loop
        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error('Error during game initialization:', error);
        ctx.fillStyle = '#FF0000';
        ctx.font = '14px Arial';
        ctx.fillText('Error initializing game: ' + error.message, 10, 30);
    }
});

function checkAndGenerateChunks() {
    const playerChunkX = Math.floor(player.x / (TILE_SIZE * CHUNK_SIZE));
    const playerChunkY = Math.floor(player.y / (TILE_SIZE * CHUNK_SIZE));
    
    // Get player's position within current chunk
    const relX = (player.x / TILE_SIZE) % CHUNK_SIZE;
    const relY = (player.y / TILE_SIZE) % CHUNK_SIZE;

    // Check all adjacent chunks when player is near edge (within 8 tiles)
    const LOAD_DISTANCE = 8;
    const chunksToCheck = [];

    // Near left edge
    if (relX < LOAD_DISTANCE) {
        chunksToCheck.push([playerChunkX - 1, playerChunkY]);
    }
    // Near right edge
    if (relX > CHUNK_SIZE - LOAD_DISTANCE) {
        chunksToCheck.push([playerChunkX + 1, playerChunkY]);
    }
    // Near top edge
    if (relY < LOAD_DISTANCE) {
        chunksToCheck.push([playerChunkX, playerChunkY - 1]);
    }
    // Near bottom edge
    if (relY > CHUNK_SIZE - LOAD_DISTANCE) {
        chunksToCheck.push([playerChunkX, playerChunkY + 1]);
    }

    // Also check diagonals when near corners
    if (relX < LOAD_DISTANCE && relY < LOAD_DISTANCE) {
        chunksToCheck.push([playerChunkX - 1, playerChunkY - 1]);
    }
    if (relX < LOAD_DISTANCE && relY > CHUNK_SIZE - LOAD_DISTANCE) {
        chunksToCheck.push([playerChunkX - 1, playerChunkY + 1]);
    }
    if (relX > CHUNK_SIZE - LOAD_DISTANCE && relY < LOAD_DISTANCE) {
        chunksToCheck.push([playerChunkX + 1, playerChunkY - 1]);
    }
    if (relX > CHUNK_SIZE - LOAD_DISTANCE && relY > CHUNK_SIZE - LOAD_DISTANCE) {
        chunksToCheck.push([playerChunkX + 1, playerChunkY + 1]);
    }

    // Always check current chunk and immediate neighbors
    chunksToCheck.push([playerChunkX, playerChunkY]); // Current chunk
    chunksToCheck.push([playerChunkX - 1, playerChunkY]); // Left
    chunksToCheck.push([playerChunkX + 1, playerChunkY]); // Right
    chunksToCheck.push([playerChunkX, playerChunkY - 1]); // Top
    chunksToCheck.push([playerChunkX, playerChunkY + 1]); // Bottom

    // Generate any missing chunks
    chunksToCheck.forEach(([x, y]) => {
        const key = `${x},${y}`;
        if (!chunkCache.has(key)) {
            debugLog(`Generating new chunk at (${x}, ${y})`);
            getChunk(x, y); // This will generate and cache the chunk
        }
    });
}

// Draw sprite helper function
function drawSprite(ctx, sprite, x, y) {
    if (!sprite) return;
    
    const colors = window.getPlayerColors(player.level);
    const pixelSize = TILE_SIZE / 16; // Scale to match tile size
    
    sprite.forEach((row, rowIndex) => {
        row.forEach((pixel, colIndex) => {
            if (pixel !== 0) { // 0 is transparent
                ctx.fillStyle = colors[pixel];
                ctx.fillRect(
                    x + (colIndex * pixelSize),
                    y + (rowIndex * pixelSize),
                    pixelSize,
                    pixelSize
                );
            }
        });
    });
}

// Add this near the top where other game functions are
function checkNewZoneDiscovery() {
    const zoneX = Math.floor(player.x / (TILE_SIZE * CHUNK_SIZE * 4));
    const zoneY = Math.floor(player.y / (TILE_SIZE * CHUNK_SIZE * 4));
    const zoneKey = `${zoneX},${zoneY}`;
    
    if (!window.discoveredZones.has(zoneKey)) {
        window.discoveredZones.add(zoneKey);
        player.gainExperience('NEW_ZONE_DISCOVERED');
        const zoneInfo = getZoneInfo(zoneX, zoneY);
        showMessage(`Discovered new ${zoneInfo.type} zone!`, 'discovery');
    }
}

// Game loop
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    // Update game state
    if (!menu.isVisible) {
        movePlayer();
        player.update(deltaTime);
        if (npcs && npcs.update) {
            npcs.update(deltaTime);
        }
        TransitionManager.update();
        
        // Check for new zone discovery when moving
        if (player.isMoving) {
            checkNewZoneDiscovery();
        }
        
        // Only update sprite animation if player is actually moving
        if (player.isMoving && !TransitionManager.isTransitioning) {
            window.spriteAnimation.frameCount = (window.spriteAnimation.frameCount + 1) % (window.spriteAnimation.animationSpeed * 2);
        }
        
        // Update camera to follow player
        camera.centerOn(player.x, player.y);
        
        // Only check for new chunks when not in menu
        if (!BuildingManager.currentInterior) {
            checkAndGenerateChunks();
        }
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Always render the world (even when menu is visible)
    if (BuildingManager.currentInterior) {
        renderInterior(ctx);
    } else {
        drawWorld(ctx);
        drawBuildingInfo(ctx);
        
        // Draw NPCs
        if (npcs && npcs.list) {
            npcs.list.forEach(npc => {
                if (isOnScreen(npc.x, npc.y)) {
                    const sprite = npc.isMoving ? 
                        spriteAnimation.getCurrentFrame(npc.direction, true) : 
                        sprites[npc.direction];
                    const screenX = Math.floor(npc.x - camera.x);
                    const screenY = Math.floor(npc.y - camera.y);
                    drawSprite(ctx, sprite, screenX, screenY);
                }
            });
        }
        
        // Draw player
        const screenPos = camera.worldToScreen(player.x, player.y);
        const sprite = player.isMoving ? 
            spriteAnimation.getCurrentFrame(player.direction, true) : 
            sprites[player.direction];
        drawSprite(ctx, sprite, screenPos.x, screenPos.y);
    }

    // Draw UI elements last to ensure they're on top
    if (messages && messages.draw) {
        messages.draw(ctx);
    }
    menu.draw(ctx);  // Draw menu last so it's always on top
    TransitionManager.draw(ctx);

    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

// Collision detection
window.checkCollision = function(x, y) {
    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);
    
    // If we're inside a building, use the interior collision system
    if (BuildingManager.isInside()) {
        return BuildingManager.checkInteriorCollision(x, y);
    }

    // Get the tile at the target position
    const tile = getTile(tileX, tileY);

    // For buildings, check the building info
    if (tile === TILES.BUILDING) {
        const buildingKey = `${tileX},${tileY}`;
        const info = window.buildingInfo.get(buildingKey);
        if (info) {
            // Allow walking if this is a door position
            return !info.isDoor;
        }
        return true; // Block if no building info found
    }

    // Basic collision for other tiles
    return tile === TILES.WALL || 
           tile === TILES.WATER || 
           tile === TILES.DENSE_TREE ||  // Only collide with dense trees
           tile === TILES.ROCK;
};

// Add this function near the top with other game functions
function movePlayer() {
    if (!controls) return;
    
    const movement = controls.getMovementDirection();
    if (movement.dx === 0 && movement.dy === 0) {
        player.isMoving = false;
        return;
    }

    // Calculate new position
    const speed = PLAYER_SPEED * (player.isRunning ? 2 : 1);
    const newX = player.x + movement.dx * speed;
    const newY = player.y + movement.dy * speed;

    // Update player direction based on movement
    if (Math.abs(movement.dx) > Math.abs(movement.dy)) {
        player.direction = movement.dx > 0 ? 'right' : 'left';
    } else {
        player.direction = movement.dy > 0 ? 'down' : 'up';
    }

    // Check collision at new position
    if (!checkCollision(newX, player.y)) {
        player.x = newX;
        player.isMoving = true;
    }
    if (!checkCollision(player.x, newY)) {
        player.y = newY;
        player.isMoving = true;
    }
}

const PLAYER_SPEED = 4; // Adjust this value as needed
  