// Make Controls class globally accessible
window.Controls = class Controls {
    constructor(menu) {
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            interact: false
        };
        this.menu = menu;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        // Handle menu first
        if (e.key === 'Escape') {
            if (!this.menu.isVisible) {
                this.menu.show();
            } else {
                this.menu.handleInput(e.key);
            }
            e.preventDefault();
            return;
        }

        // If menu is visible, handle menu controls
        if (this.menu.isVisible) {
            this.menu.handleInput(e.key);
            e.preventDefault();
            return;
        }

        // Otherwise handle game controls
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
                this.keys.up = true;
                break;
            case 'ArrowDown':
            case 's':
                this.keys.down = true;
                break;
            case 'ArrowLeft':
            case 'a':
                this.keys.left = true;
                break;
            case 'ArrowRight':
            case 'd':
                this.keys.right = true;
                break;
            case ' ':
            case 'e':
            case 'Enter':
                this.keys.interact = true;
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
                    
                    // Check adjacent tiles for doors
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
                                // Check if this building has been visited before
                                const buildingKey = `${pos.x},${pos.y}`;
                                if (!window.visitedBuildings.has(buildingKey)) {
                                    window.visitedBuildings.add(buildingKey);
                                    player.gainExperience('BUILDING_ENTERED');
                                }
                                BuildingManager.enterBuilding(building);
                                break;
                            }
                        }
                    }
                }
                break;
        }
    }

    handleKeyUp(e) {
        // Don't process movement keys if menu is visible
        if (this.menu.isVisible) return;

        switch(e.key) {
            case 'ArrowUp':
            case 'w':
                this.keys.up = false;
                break;
            case 'ArrowDown':
            case 's':
                this.keys.down = false;
                break;
            case 'ArrowLeft':
            case 'a':
                this.keys.left = false;
                break;
            case 'ArrowRight':
            case 'd':
                this.keys.right = false;
                break;
            case ' ':
            case 'e':
            case 'Enter':
                this.keys.interact = false;
                break;
        }
    }

    getMovementDirection() {
        // Don't allow movement if menu is visible
        if (this.menu.isVisible) return { dx: 0, dy: 0 };

        let dx = 0;
        let dy = 0;

        if (this.keys.up) dy -= 1;
        if (this.keys.down) dy += 1;
        if (this.keys.left) dx -= 1;
        if (this.keys.right) dx += 1;

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        return { dx, dy };
    }

    isInteracting() {
        return !this.menu.isVisible && this.keys.interact;
    }

    getControlsInfo() {
        return [
            "Movement: Arrow Keys or WASD",
            "Interact: Space or E",
            "Menu: ESC"
        ];
    }
} 