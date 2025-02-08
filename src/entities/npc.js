window.NPC_TYPES = {
    VILLAGER: 'villager',
    SHOPKEEPER: 'shopkeeper',
    BLACKSMITH: 'blacksmith',
    INNKEEPER: 'innkeeper'
};

class NPC {
    constructor(type, x, y, name) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.name = name;
        this.sprite = sprites.down;
        this.relationship = 0; // -100 to 100
        this.inventory = type === NPC_TYPES.SHOPKEEPER ? generateShopInventory() : null;
        this.canForgeRing = type === NPC_TYPES.BLACKSMITH;
        this.hasRoom = type === NPC_TYPES.INNKEEPER;
    }

    interact() {
        // Basic interaction based on NPC type
        switch(this.type) {
            case NPC_TYPES.SHOPKEEPER:
                return {
                    type: 'shop',
                    inventory: this.inventory
                };

            case NPC_TYPES.BLACKSMITH:
                // Check if player has metal to forge
                if (inventory.items.some(item => item.id === 'metal')) {
                    return {
                        type: 'forge',
                        message: "I can forge that metal into something useful."
                    };
                }
                return { type: 'dialogue', message: "Bring me some metal if you need something forged." };

            case NPC_TYPES.INNKEEPER:
                return {
                    type: 'rest',
                    message: "Would you like to rest here?"
                };

            default:
                // Villagers can become heirs if player has a ring
                if (inventory.items.some(item => item.id === 'ring')) {
                    return {
                        type: 'heir_option',
                        message: `${this.name} seems trustworthy.`
                    };
                }
                return { 
                    type: 'dialogue', 
                    message: this.getRandomDialogue() 
                };
        }
    }

    getRandomDialogue() {
        const time = Math.floor(Date.now() / (1000 * 60 * 60)) % 24; // Current hour
        const dialogues = [
            time < 6 ? "Can't sleep either, huh?" :
            time < 12 ? "Beautiful morning!" :
            time < 18 ? "Nice day for a walk." :
            "Better get inside soon, it's getting dark."
        ];
        return dialogues[Math.floor(seededRandom(this.x * this.y + Date.now()) * dialogues.length)];
    }

    update() {
        // Simple random movement within their area
        if (seededRandom(this.x * this.y + Date.now()) < 0.02) {
            const direction = Math.floor(seededRandom(this.x + Date.now()) * 4);
            const oldX = this.x;
            const oldY = this.y;

            switch(direction) {
                case 0: this.y--; this.sprite = sprites.up; break;
                case 1: this.y++; this.sprite = sprites.down; break;
                case 2: this.x--; this.sprite = sprites.left; break;
                case 3: this.x++; this.sprite = sprites.right; break;
            }

            // Check collision and stay within their area
            if (checkCollision(this.x * TILE_SIZE, this.y * TILE_SIZE) || 
                Math.abs(this.x - oldX) > 3 || Math.abs(this.y - oldY) > 3) {
                this.x = oldX;
                this.y = oldY;
            }
        }
    }
}

// NPC Manager
window.npcs = {
    list: new Map(),

    create(type, x, y, buildingKey) {
        const name = generateNPCName(type);
        const npc = new NPC(type, x, y, name);
        
        // Set type-specific properties
        switch(type) {
            case NPC_TYPES.SHOPKEEPER:
                npc.dialogue = [
                    "Welcome to my shop!",
                    "Looking for anything specific?",
                    "I've got the best prices in town."
                ];
                npc.inventory = generateShopInventory();
                break;

            case NPC_TYPES.BLACKSMITH:
                npc.dialogue = [
                    "Need something forged?",
                    "I can repair that for you.",
                    "Quality metalwork takes time."
                ];
                npc.canForgeRing = true;
                break;

            case NPC_TYPES.VILLAGER:
                npc.dialogue = [
                    "Nice weather we're having.",
                    "Have you heard about the mountains?",
                    "Be careful in the forest at night."
                ];
                npc.canInherit = true;
                break;
        }

        const key = `${x},${y}`;
        this.list.set(key, npc);
        
        if (buildingKey) {
            const building = window.buildingInfo.get(buildingKey);
            if (building) {
                building.npc = npc;
            }
        }

        return npc;
    },

    update() {
        this.list.forEach(npc => npc.update());
    },

    getNPCAt(x, y) {
        return this.list.get(`${x},${y}`);
    }
};

function generateNPCName(type) {
    const firstName = BUILDING_NAMES.firstNames[Math.floor(seededRandom(Date.now()) * BUILDING_NAMES.firstNames.length)];
    const lastName = BUILDING_NAMES.lastNames[Math.floor(seededRandom(Date.now() + 1) * BUILDING_NAMES.lastNames.length)];
    return `${firstName} ${lastName}`;
}

function generateShopInventory() {
    return [
        { ...ITEMS.AXE, price: 50 },
        { ...ITEMS.ROPE, price: 30 },
        // Add more items as needed
    ];
} 