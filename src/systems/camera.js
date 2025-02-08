// Camera system
window.initCamera = function() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas not found when initializing camera');
        return;
    }

    window.camera = {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,

        // Center camera on a point
        centerOn: function(x, y) {
            this.x = Math.floor(x - this.width / 2);
            this.y = Math.floor(y - this.height / 2);
        },

        // Convert world coordinates to screen coordinates
        worldToScreen: function(worldX, worldY) {
            return {
                x: Math.floor(worldX - this.x),
                y: Math.floor(worldY - this.y)
            };
        },

        // Convert screen coordinates to world coordinates
        screenToWorld: function(screenX, screenY) {
            return {
                x: Math.floor(screenX + this.x),
                y: Math.floor(screenY + this.y)
            };
        },

        // Check if a point is visible on screen
        isVisible: function(worldX, worldY) {
            const screenPos = this.worldToScreen(worldX, worldY);
            return screenPos.x >= -TILE_SIZE && 
                   screenPos.x <= this.width + TILE_SIZE &&
                   screenPos.y >= -TILE_SIZE && 
                   screenPos.y <= this.height + TILE_SIZE;
        }
    };
};

// Initialize camera when the window loads
window.addEventListener('load', () => {
    initCamera();
}); 