class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = { x: 0, y: 0 };
        this.buildingOpacity = 1.0;
        this.buildingFadeSpeed = 0.1;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateCamera(player) {
        this.camera.x = player.x - this.canvas.width / 2;
        this.camera.y = player.y - this.canvas.height / 2;
    }

    isPlayerInBuilding(player, building) {
        return player.x > building.x && 
               player.x < building.x + building.width &&
               player.y > building.y && 
               player.y < building.y + building.height;
    }

    drawWorld(world, player) {
        this.clear();
        this.updateCamera(player);

        // Draw ground/terrain first
        world.chunks.forEach(chunk => {
            this.drawChunk(chunk);
        });

        // Check if player is in any building
        let playerInBuilding = false;
        world.buildings.forEach(building => {
            if (this.isPlayerInBuilding(player, building)) {
                playerInBuilding = true;
            }
        });

        // Update building opacity
        if (playerInBuilding && this.buildingOpacity > 0.3) {
            this.buildingOpacity = Math.max(0.3, this.buildingOpacity - this.buildingFadeSpeed);
        } else if (!playerInBuilding && this.buildingOpacity < 1.0) {
            this.buildingOpacity = Math.min(1.0, this.buildingOpacity + this.buildingFadeSpeed);
        }

        // Draw buildings with current opacity
        world.buildings.forEach(building => {
            this.drawBuilding(building);
        });

        // Draw player
        this.drawPlayer(player);

        // Draw UI elements
        if (world.messagePopup) {
            world.messagePopup.draw(this.ctx);
        }
    }

    drawChunk(chunk) {
        const screenX = chunk.x - this.camera.x;
        const screenY = chunk.y - this.camera.y;

        // Draw paths
        chunk.paths.forEach(path => {
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(
                screenX + path.x,
                screenY + path.y,
                path.width,
                path.height
            );
        });

        // Draw other terrain features
        // ... (existing terrain drawing code)
    }

    drawBuilding(building) {
        const screenX = building.x - this.camera.x;
        const screenY = building.y - this.camera.y;

        // Draw building with current opacity
        this.ctx.globalAlpha = this.buildingOpacity;
        
        // Draw walls
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(screenX, screenY, building.width, building.height);
        
        // Draw roof
        this.ctx.fillStyle = '#A0522D';
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, screenY);
        this.ctx.lineTo(screenX + building.width/2, screenY - 20);
        this.ctx.lineTo(screenX + building.width, screenY);
        this.ctx.closePath();
        this.ctx.fill();

        // Draw door
        this.ctx.fillStyle = '#4A2810';
        const doorWidth = 20;
        const doorHeight = 30;
        this.ctx.fillRect(
            screenX + (building.width - doorWidth)/2,
            screenY + building.height - doorHeight,
            doorWidth,
            doorHeight
        );

        // Reset opacity
        this.ctx.globalAlpha = 1.0;
    }

    drawPlayer(player) {
        const screenX = player.x - this.camera.x;
        const screenY = player.y - this.camera.y;
        
        const sprite = window.spriteAnimation.getCurrentFrame(player.direction, player.isMoving);
        const colors = window.getPlayerColors(player.level);
        
        // Draw player sprite
        const size = 2; // Scale factor for the sprite
        sprite.forEach((row, y) => {
            row.forEach((pixel, x) => {
                if (pixel !== 0) { // 0 is transparent
                    this.ctx.fillStyle = colors[pixel];
                    this.ctx.fillRect(
                        screenX + (x * size),
                        screenY + (y * size),
                        size,
                        size
                    );
                }
            });
        });
    }
} 