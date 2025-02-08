class Renderer {
    // ... existing code ...

    drawTile(ctx, tileId, x, y) {
        switch(tileId) {
            case TILES.EMPTY:
                ctx.fillStyle = '#7ec850';  // Grass
                break;
            case TILES.ROAD:
                ctx.fillStyle = '#8b7355';  // Brown road
                break;
            case TILES.PATH:
                ctx.fillStyle = '#a89078';  // Lighter path
                break;
            case TILES.BUILDING:
                ctx.fillStyle = '#d2b48c';  // Building wall
                break;
            case TILES.DOOR:
                ctx.fillStyle = '#8b4513';  // Dark brown door
                break;
            default:
                ctx.fillStyle = 'magenta';  // Error color
        }

        ctx.fillRect(
            x * TILE_SIZE - this.camera.x,
            y * TILE_SIZE - this.camera.y,
            TILE_SIZE,
            TILE_SIZE
        );

        // Add door frame if it's a door
        if (tileId === TILES.DOOR) {
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                x * TILE_SIZE - this.camera.x + 1,
                y * TILE_SIZE - this.camera.y + 1,
                TILE_SIZE - 2,
                TILE_SIZE - 2
            );
        }
    }

    // ... existing code ...
} 