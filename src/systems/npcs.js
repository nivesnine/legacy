// Basic NPC system
window.npcs = {
    list: new Map(),
    
    create(type, x, y, buildingKey) {
        // NPC creation logic here
    },
    
    update() {
        this.list.forEach(npc => {
            if (npc.update) npc.update();
        });
    },
    
    getNPCAt(x, y) {
        // Find NPC at coordinates
        return Array.from(this.list.values()).find(npc => 
            Math.floor(npc.x / TILE_SIZE) === x && 
            Math.floor(npc.y / TILE_SIZE) === y
        );
    }
}; 