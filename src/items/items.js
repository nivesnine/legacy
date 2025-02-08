window.ITEM_TYPES = {
    TOOL: 'tool',
    MATERIAL: 'material',
    QUEST: 'quest',
    EQUIPMENT: 'equipment'
};

window.ITEMS = {
    AXE: {
        id: 'axe',
        name: 'Woodcutter\'s Axe',
        type: ITEM_TYPES.TOOL,
        description: 'Used for chopping down trees',
        icon: '🪓',
        use: (x, y) => {
            const tile = getTile(x, y);
            if (tile === TILES.TREE || tile === TILES.DENSE_TREE) {
                // Replace tree with stump and add wood to inventory
                setTile(x, y, TILES.STUMP);
                inventory.addItem(ITEMS.WOOD, 1);
                return true;
            }
            return false;
        }
    },
    ROPE: {
        id: 'rope',
        name: 'Strong Rope',
        type: ITEM_TYPES.TOOL,
        description: 'Helps you climb over obstacles',
        icon: '🪢',
        use: (x, y) => {
            const tile = getTile(x, y);
            if (tile === TILES.ROCK) {
                // Allow passage over rock
                player.canPassRock = true;
                setTimeout(() => { player.canPassRock = false; }, 1000);
                return true;
            }
            return false;
        }
    },
    WOOD: {
        id: 'wood',
        name: 'Wood',
        type: ITEM_TYPES.MATERIAL,
        description: 'Raw wood from trees',
        icon: '🪵',
        stackable: true
    },
    METAL: {
        id: 'metal',
        name: 'Metal Ore',
        type: ITEM_TYPES.MATERIAL,
        description: 'Raw metal ore',
        icon: '⛰️',
        stackable: true
    },
    RING: {
        id: 'ring',
        name: 'Family Ring',
        type: ITEM_TYPES.QUEST,
        description: 'A ring to pass down to your heir',
        icon: '💍'
    }
};

// Item management system
window.inventory = {
    items: [],
    maxSize: 10,
    selectedSlot: 0,

    addItem(item, quantity = 1) {
        if (this.items.length >= this.maxSize) {
            console.log('Inventory full!');
            return false;
        }

        if (item.stackable) {
            // Look for existing stack
            const existingStack = this.items.find(i => i.id === item.id);
            if (existingStack) {
                existingStack.quantity += quantity;
                return true;
            }
        }

        this.items.push({
            ...item,
            quantity: item.stackable ? quantity : 1
        });
        return true;
    },

    removeItem(itemId, quantity = 1) {
        const index = this.items.findIndex(i => i.id === itemId);
        if (index === -1) return false;

        const item = this.items[index];
        if (item.stackable) {
            item.quantity -= quantity;
            if (item.quantity <= 0) {
                this.items.splice(index, 1);
            }
        } else {
            this.items.splice(index, 1);
        }
        return true;
    },

    useSelectedItem(targetX, targetY) {
        const item = this.items[this.selectedSlot];
        if (!item) return false;

        if (item.use && item.use(targetX, targetY)) {
            if (!item.stackable) {
                this.removeItem(item.id);
            }
            return true;
        }
        return false;
    },

    cycleSelection(direction) {
        this.selectedSlot = (this.selectedSlot + direction + this.maxSize) % this.maxSize;
    }
}; 