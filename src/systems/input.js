// Input handling
window.keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

window.setupInput = function() {
    document.addEventListener('keydown', (e) => {
        // Handle menu first
        if (e.key === 'Escape') {
            if (!menu.isVisible) {
                menu.show();
            } else {
                menu.hide();
            }
            e.preventDefault();
            return;
        }

        // If menu is visible, don't process other inputs
        if (menu.isVisible) {
            return;
        }

        switch(e.key) {
            case 'ArrowUp': case 'w': keys.up = true; break;
            case 'ArrowDown': case 's': keys.down = true; break;
            case 'ArrowLeft': case 'a': keys.left = true; break;
            case 'ArrowRight': case 'd': keys.right = true; break;
            case 'Enter': case 'e':
                // Handle building entry/exit
                if (BuildingManager.isInside()) {
                    // Check if player is at exit
                    const tileX = Math.floor(player.x / TILE_SIZE);
                    const tileY = Math.floor(player.y / TILE_SIZE);
                    const interior = BuildingManager.getCurrentInterior();
                    if (interior && interior.layout) {
                        const currentTile = interior.layout.tiles[tileY][tileX];
                        if (currentTile === INTERIOR_TILES.EXIT) {
                            BuildingManager.exitBuilding();
                        }
                    }
                } else {
                    // Check if player is at a door
                    const tileX = Math.floor(player.x / TILE_SIZE);
                    const tileY = Math.floor(player.y / TILE_SIZE);
                    const tile = getTile(tileX, tileY);
                    
                    // Check adjacent tiles for doors if not directly on one
                    const adjacentPositions = [
                        { x: tileX, y: tileY },
                        { x: tileX, y: tileY - 1 },
                        { x: tileX, y: tileY + 1 },
                        { x: tileX - 1, y: tileY },
                        { x: tileX + 1, y: tileY }
                    ];

                    for (const pos of adjacentPositions) {
                        const adjacentTile = getTile(pos.x, pos.y);
                        if (adjacentTile === TILES.DOOR || adjacentTile === TILES.BUILDING) {
                            const building = BuildingManager.getBuildingAt(pos.x, pos.y);
                            if (building) {
                                BuildingManager.enterBuilding(building);
                                break;
                            }
                        }
                    }
                }
                break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch(e.key) {
            case 'ArrowUp': case 'w': keys.up = false; break;
            case 'ArrowDown': case 's': keys.down = false; break;
            case 'ArrowLeft': case 'a': keys.left = false; break;
            case 'ArrowRight': case 'd': keys.right = false; break;
        }
    });
};

function handleInteractions(interactions) {
    if (interactions.type === 'npc') {
        // Create and show interaction menu for NPC
        const menu = document.createElement('div');
        menu.className = 'interaction-menu';
        
        interactions.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.label;
            button.onclick = () => {
                option.action();
                menu.remove();
            };
            menu.appendChild(button);
        });
        
        document.body.appendChild(menu);
        
        // Position menu near player
        const playerScreen = camera.worldToScreen(player.x, player.y);
        menu.style.left = `${playerScreen.x}px`;
        menu.style.top = `${playerScreen.y - menu.offsetHeight}px`;
        
    } else if (interactions.type === 'item') {
        // Execute item interaction directly
        interactions.options[0].action();
    }
}

function handleWorldInteraction() {
    const tileX = Math.floor(player.x / TILE_SIZE);
    const tileY = Math.floor(player.y / TILE_SIZE);
    
    // Check if we're at a door
    const tile = getTile(tileX, tileY);
    if (tile === TILES.BUILDING) {
        const buildingKey = `${tileX},${tileY}`;
        const building = window.buildingInfo.get(buildingKey);
        if (building && building.isDoor) {
            building.enter();
            return;
        }
    }
    
    // Check for other world interactions (plants, resources, etc.)
    if (PLANTS && PLANTS[tile]) {
        // Handle plant interaction
        PLANTS[tile].effect(player);
        setTile(tileX, tileY, TILES.EMPTY);
        player.gainExperience('PLANT_FOUND');
    }
}

// Add CSS for interaction menu
const style = document.createElement('style');
style.textContent = `
    .interaction-menu {
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #666;
        padding: 10px;
        border-radius: 5px;
        z-index: 1000;
    }
    
    .interaction-menu button {
        display: block;
        width: 100%;
        padding: 5px 10px;
        margin: 2px 0;
        background: #444;
        border: 1px solid #666;
        color: white;
        cursor: pointer;
    }
    
    .interaction-menu button:hover {
        background: #666;
    }
`;
document.head.appendChild(style);
