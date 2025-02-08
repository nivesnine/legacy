// Interior tile types
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
    FURNITURE: 31,
    DISPLAY: 32,
    BOOKSHELF: 33,
    WINDOW: 34
};

// NPC types and their behaviors
window.NPC_TYPES = {
    SHOPKEEPER: {
        sprite: 'npc_shopkeeper',
        behavior: 'stationary',
        interactions: ['trade', 'quest'],
        dialogue: {
            greeting: "Welcome to my shop!",
            trade: "Here's what I have for sale...",
            quest: "I might have a job for you..."
        }
    },
    BLACKSMITH: {
        sprite: 'npc_blacksmith',
        behavior: 'workshop',
        interactions: ['craft', 'repair', 'quest'],
        dialogue: {
            greeting: "Need something forged?",
            craft: "I can craft that for you...",
            repair: "I'll fix that right up."
        }
    },
    INNKEEPER: {
        sprite: 'npc_innkeeper',
        behavior: 'counter',
        interactions: ['rest', 'gossip', 'quest'],
        dialogue: {
            greeting: "Looking for a room?",
            rest: "It'll be 10 gold for the night.",
            gossip: "Have you heard about..."
        }
    },
    TAVERNKEEPER: {
        sprite: 'npc_tavernkeeper',
        behavior: 'counter',
        interactions: ['trade', 'gossip'],
        dialogue: {
            greeting: "What can I get you?",
            trade: "Here's what's on tap...",
            gossip: "Word around town is..."
        }
    },
    RESIDENT: {
        sprite: 'npc_resident',
        behavior: 'wander',
        interactions: ['talk', 'heir_option'],
        dialogue: {
            greeting: "Hello there!",
            talk: "Nice weather we're having.",
            heir: "I'd be honored to carry on your legacy."
        }
    }
};

// Building type definitions with specific features
window.BUILDING_TYPES = {
    HOUSE: {
        name: 'House',
        size: { width: 12, height: 12 },
        features: [
            { type: INTERIOR_TILES.BED, count: 2 },
            { type: INTERIOR_TILES.TABLE, count: 1 },
            { type: INTERIOR_TILES.CHAIR, count: 4 },
            { type: INTERIOR_TILES.CHEST, count: 2 }
        ],
        decorative: [
            { type: INTERIOR_TILES.WINDOW, count: 4 },
            { type: INTERIOR_TILES.BOOKSHELF, count: 1 }
        ],
        npcs: [
            { type: 'RESIDENT', count: 2, positions: 'random' }
        ],
        interactions: {
            BED: { type: 'rest', cost: 0 },
            CHEST: { type: 'storage', shared: true }
        }
    },
    SHOP: {
        name: 'Shop',
        size: { width: 14, height: 10 },
        features: [
            { type: INTERIOR_TILES.COUNTER, count: 3 },
            { type: INTERIOR_TILES.DISPLAY, count: 4 },
            { type: INTERIOR_TILES.CHEST, count: 2 }
        ],
        decorative: [
            { type: INTERIOR_TILES.WINDOW, count: 2 },
            { type: INTERIOR_TILES.FURNITURE, count: 2 }
        ],
        npcs: [
            { type: 'SHOPKEEPER', count: 1, positions: 'behind_counter' }
        ],
        interactions: {
            COUNTER: { type: 'trade', npcRequired: true },
            DISPLAY: { type: 'examine', description: true }
        }
    },
    TAVERN: {
        name: 'Tavern',
        size: { width: 16, height: 14 },
        features: [
            { type: INTERIOR_TILES.TABLE, count: 4 },
            { type: INTERIOR_TILES.CHAIR, count: 12 },
            { type: INTERIOR_TILES.BARREL, count: 4 },
            { type: INTERIOR_TILES.COUNTER, count: 2 }
        ],
        decorative: [
            { type: INTERIOR_TILES.WINDOW, count: 4 },
            { type: INTERIOR_TILES.FURNITURE, count: 3 }
        ],
        npcs: [
            { type: 'TAVERNKEEPER', count: 1, positions: 'behind_counter' },
            { type: 'RESIDENT', count: 3, positions: 'at_tables' }
        ],
        interactions: {
            COUNTER: { type: 'trade', npcRequired: true },
            TABLE: { type: 'sit', gossipChance: 0.3 }
        }
    },
    BLACKSMITH: {
        name: 'Blacksmith',
        size: { width: 12, height: 10 },
        features: [
            { type: INTERIOR_TILES.FORGE, count: 1 },
            { type: INTERIOR_TILES.ANVIL, count: 1 },
            { type: INTERIOR_TILES.CHEST, count: 2 },
            { type: INTERIOR_TILES.COUNTER, count: 1 }
        ],
        decorative: [
            { type: INTERIOR_TILES.WINDOW, count: 2 },
            { type: INTERIOR_TILES.BARREL, count: 2 }
        ],
        npcs: [
            { type: 'BLACKSMITH', count: 1, positions: 'at_forge' }
        ],
        interactions: {
            FORGE: { type: 'craft', npcRequired: true, requiresSkill: true },
            ANVIL: { type: 'repair', npcRequired: true },
            COUNTER: { type: 'trade', npcRequired: true }
        }
    },
    INN: {
        name: 'Inn',
        size: { width: 18, height: 16 },
        features: [
            { type: INTERIOR_TILES.BED, count: 6 },
            { type: INTERIOR_TILES.TABLE, count: 2 },
            { type: INTERIOR_TILES.CHAIR, count: 6 },
            { type: INTERIOR_TILES.CHEST, count: 4 }
        ],
        decorative: [
            { type: INTERIOR_TILES.WINDOW, count: 6 },
            { type: INTERIOR_TILES.FURNITURE, count: 4 }
        ],
        npcs: [
            { type: 'INNKEEPER', count: 1, positions: 'behind_counter' },
            { type: 'RESIDENT', count: 2, positions: 'random' }
        ],
        interactions: {
            COUNTER: { type: 'rent', npcRequired: true },
            BED: { type: 'rest', cost: 10, requiresRent: true },
            TABLE: { type: 'sit', gossipChance: 0.2 }
        }
    }
};

// Layout generation function
window.generateInteriorLayout = function(buildingType) {
    const building = BUILDING_TYPES[buildingType];
    if (!building) return null;

    const width = building.size.width;
    const height = building.size.height;
    
    // Create empty layout
    const layout = {
        tiles: Array(height).fill().map(() => Array(width).fill(INTERIOR_TILES.FLOOR)),
        items: [],  // Will store positions of furniture and items
        npcs: []    // Will store NPC positions and types
    };

    // Add walls
    for (let x = 0; x < width; x++) {
        layout.tiles[0][x] = INTERIOR_TILES.WALL;
        layout.tiles[height-1][x] = INTERIOR_TILES.WALL;
    }
    for (let y = 0; y < height; y++) {
        layout.tiles[y][0] = INTERIOR_TILES.WALL;
        layout.tiles[y][width-1] = INTERIOR_TILES.WALL;
    }

    // Add door (exit)
    const doorX = Math.floor(width / 2);
    layout.tiles[height-1][doorX] = INTERIOR_TILES.EXIT;

    // Place required features
    building.features.forEach(feature => {
        for (let i = 0; i < feature.count; i++) {
            let placed = false;
            while (!placed) {
                const x = 1 + Math.floor(Math.random() * (width - 2));
                const y = 1 + Math.floor(Math.random() * (height - 2));
                if (layout.tiles[y][x] === INTERIOR_TILES.FLOOR) {
                    layout.items.push({
                        type: feature.type,
                        x: x,
                        y: y
                    });
                    placed = true;
                }
            }
        }
    });

    // Add decorative elements
    building.decorative.forEach(decor => {
        for (let i = 0; i < decor.count; i++) {
            let placed = false;
            while (!placed) {
                const x = 1 + Math.floor(Math.random() * (width - 2));
                const y = 1 + Math.floor(Math.random() * (height - 2));
                if (layout.tiles[y][x] === INTERIOR_TILES.FLOOR &&
                    !layout.items.some(item => item.x === x && item.y === y)) {
                    layout.items.push({
                        type: decor.type,
                        x: x,
                        y: y
                    });
                    placed = true;
                }
            }
        }
    });

    // Add NPCs to the layout
    if (building.npcs) {
        building.npcs.forEach(npcGroup => {
            for (let i = 0; i < npcGroup.count; i++) {
                const npc = {
                    type: npcGroup.type,
                    ...NPC_TYPES[npcGroup.type]
                };

                // Position NPC based on their designated position type
                let placed = false;
                while (!placed) {
                    let x, y;
                    switch(npcGroup.positions) {
                        case 'behind_counter':
                            // Find a counter and place NPC behind it
                            const counter = layout.items.find(item => item.type === INTERIOR_TILES.COUNTER);
                            if (counter) {
                                x = counter.x;
                                y = counter.y - 1;
                            }
                            break;
                        case 'at_forge':
                            // Find forge and place NPC next to it
                            const forge = layout.items.find(item => item.type === INTERIOR_TILES.FORGE);
                            if (forge) {
                                x = forge.x + 1;
                                y = forge.y;
                            }
                            break;
                        case 'at_tables':
                            // Find a table and place NPC at it
                            const table = layout.items.find(item => 
                                item.type === INTERIOR_TILES.TABLE && 
                                !layout.npcs.some(n => n.x === item.x && n.y === item.y + 1)
                            );
                            if (table) {
                                x = table.x;
                                y = table.y + 1;
                            }
                            break;
                        case 'random':
                        default:
                            x = 1 + Math.floor(Math.random() * (width - 2));
                            y = 1 + Math.floor(Math.random() * (height - 2));
                            break;
                    }

                    // Check if position is valid
                    if (x && y && layout.tiles[y][x] === INTERIOR_TILES.FLOOR &&
                        !layout.items.some(item => item.x === x && item.y === y) &&
                        !layout.npcs.some(other => other.x === x && other.y === y)) {
                        npc.x = x;
                        npc.y = y;
                        layout.npcs.push(npc);
                        placed = true;
                    }
                }
            }
        });
    }

    return layout;
}; 