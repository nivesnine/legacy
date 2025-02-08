// Interaction system
window.InteractionSystem = {
    // Check for possible interactions at player's position
    checkInteractions() {
        if (!BuildingManager.isInside()) return null;

        const interior = BuildingManager.getCurrentInterior();
        const tileX = Math.floor(player.x / TILE_SIZE);
        const tileY = Math.floor(player.y / TILE_SIZE);

        // Check for NPCs
        const nearbyNPC = interior.layout.npcs.find(npc => 
            Math.abs(npc.x - tileX) <= 1 && Math.abs(npc.y - tileY) <= 1
        );

        if (nearbyNPC) {
            return this.handleNPCInteraction(nearbyNPC);
        }

        // Check for interactive items
        const nearbyItem = interior.layout.items.find(item =>
            Math.abs(item.x - tileX) <= 1 && Math.abs(item.y - tileY) <= 1
        );

        if (nearbyItem) {
            return this.handleItemInteraction(nearbyItem, interior.type);
        }

        return null;
    },

    handleNPCInteraction(npc) {
        const npcType = NPC_TYPES[npc.type];
        if (!npcType) return null;

        // Show initial dialogue
        showMessage(npcType.dialogue.greeting, 'dialogue');

        // Return available interaction options
        return {
            type: 'npc',
            options: npcType.interactions.map(interaction => ({
                type: interaction,
                label: this.getInteractionLabel(interaction),
                action: () => this.executeNPCInteraction(interaction, npc)
            }))
        };
    },

    handleItemInteraction(item, buildingType) {
        const building = BUILDING_TYPES[buildingType];
        if (!building || !building.interactions[item.type]) return null;

        const interaction = building.interactions[item.type];

        // Check if interaction requires NPC
        if (interaction.npcRequired) {
            const nearbyNPC = this.findNearbyNPC(item.x, item.y);
            if (!nearbyNPC) {
                showMessage("There's no one here to help with that.", 'info');
                return null;
            }
        }

        // Check if interaction requires payment
        if (interaction.cost && !this.canAfford(interaction.cost)) {
            showMessage(`You need ${interaction.cost} gold for that.`, 'warning');
            return null;
        }

        return {
            type: 'item',
            options: [{
                type: interaction.type,
                label: this.getInteractionLabel(interaction.type),
                action: () => this.executeItemInteraction(interaction, item)
            }]
        };
    },

    executeNPCInteraction(type, npc) {
        const npcType = NPC_TYPES[npc.type];
        
        switch(type) {
            case 'trade':
                showMessage(npcType.dialogue.trade, 'dialogue');
                // Open trade menu
                TradeSystem.openTradeMenu(npc);
                break;

            case 'quest':
                showMessage(npcType.dialogue.quest, 'dialogue');
                // Open quest menu
                QuestSystem.checkAvailableQuests(npc);
                break;

            case 'heir_option':
                showMessage(npcType.dialogue.heir, 'dialogue');
                // Handle heir selection
                if (confirm(`Make ${npc.name} your heir?`)) {
                    player.setHeir(npc);
                }
                break;

            case 'gossip':
                showMessage(npcType.dialogue.gossip, 'dialogue');
                // Generate random gossip
                this.generateGossip();
                break;

            case 'craft':
                showMessage(npcType.dialogue.craft, 'dialogue');
                // Open crafting menu
                CraftingSystem.openCraftingMenu(npc);
                break;

            case 'repair':
                showMessage(npcType.dialogue.repair, 'dialogue');
                // Open repair menu
                RepairSystem.openRepairMenu(npc);
                break;
        }
    },

    executeItemInteraction(interaction, item) {
        switch(interaction.type) {
            case 'rest':
                if (interaction.cost) {
                    player.gold -= interaction.cost;
                }
                // Heal player and advance time
                player.health = player.maxHealth;
                TimeSystem.advanceTime(8); // 8 hours
                showMessage("You feel well rested.", 'info');
                break;

            case 'storage':
                // Open storage menu
                StorageSystem.openStorage(item);
                break;

            case 'examine':
                // Show item description
                showMessage(this.getItemDescription(item), 'info');
                break;

            case 'sit':
                player.isSitting = true;
                if (Math.random() < interaction.gossipChance) {
                    this.generateGossip();
                }
                break;
        }
    },

    findNearbyNPC(x, y) {
        const interior = BuildingManager.getCurrentInterior();
        return interior.layout.npcs.find(npc => 
            Math.abs(npc.x - x) <= 1 && Math.abs(npc.y - y) <= 1
        );
    },

    canAfford(cost) {
        return player.gold >= cost;
    },

    getInteractionLabel(type) {
        const labels = {
            trade: 'Trade',
            quest: 'Ask about work',
            heir_option: 'Discuss inheritance',
            gossip: 'Chat',
            craft: 'Craft item',
            repair: 'Repair item',
            rest: 'Rest',
            storage: 'Open storage',
            examine: 'Examine',
            sit: 'Sit down'
        };
        return labels[type] || type;
    },

    generateGossip() {
        const gossip = [
            "They say the mountains hold ancient secrets...",
            "I heard there's treasure in the old caves.",
            "The weather's been strange lately.",
            "Have you seen the new trading caravan?",
            "The forest has been restless at night."
        ];
        showMessage(gossip[Math.floor(Math.random() * gossip.length)], 'dialogue');
    },

    getItemDescription(item) {
        const descriptions = {
            [INTERIOR_TILES.DISPLAY]: "Various goods are on display.",
            [INTERIOR_TILES.FORGE]: "A hot forge ready for metalworking.",
            [INTERIOR_TILES.ANVIL]: "A sturdy anvil for shaping metal.",
            [INTERIOR_TILES.BARREL]: "A barrel containing various supplies.",
            [INTERIOR_TILES.BOOKSHELF]: "A collection of books and scrolls."
        };
        return descriptions[item.type] || "Nothing special about this.";
    }
}; 