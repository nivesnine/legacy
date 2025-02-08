// Crafting system for blacksmith
window.CraftingSystem = {
    // Available recipes at the blacksmith
    recipes: {
        tools: {
            name: 'Basic Tools',
            ingredients: [
                { id: 'metal_ingot', count: 1 }
            ],
            result: { id: 'tools', name: 'Basic Tools', count: 1 },
            skillRequired: 0
        },
        repair_kit: {
            name: 'Repair Kit',
            ingredients: [
                { id: 'metal_ingot', count: 1 },
                { id: 'tools', count: 1 }
            ],
            result: { id: 'repair_kit', name: 'Repair Kit', count: 1 },
            skillRequired: 1
        },
        climbing_gear: {
            name: 'Climbing Gear',
            ingredients: [
                { id: 'metal_ingot', count: 2 },
                { id: 'rope', count: 1 }
            ],
            result: { id: 'climbing_gear', name: 'Climbing Gear', count: 1 },
            skillRequired: 2
        },
        lantern: {
            name: 'Durable Lantern',
            ingredients: [
                { id: 'metal_ingot', count: 1 },
                { id: 'tools', count: 1 }
            ],
            result: { id: 'lantern', name: 'Durable Lantern', count: 1 },
            skillRequired: 2
        }
    },

    // Open crafting menu
    openCraftingMenu(npc) {
        const menu = document.createElement('div');
        menu.className = 'crafting-menu';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'crafting-header';
        header.innerHTML = `
            <h2>Crafting with ${npc.type.toLowerCase()}</h2>
            <p>Your crafting skill: ${player.getKnowledgeLevel('crafting') || 0}</p>
        `;
        menu.appendChild(header);

        // Create recipe list
        const recipeList = document.createElement('div');
        recipeList.className = 'recipe-list';
        
        Object.entries(this.recipes).forEach(([id, recipe]) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'recipe-item';
            
            // Check if player has required skill
            const hasSkill = (player.getKnowledgeLevel('crafting') || 0) >= recipe.skillRequired;
            
            // Check if player has ingredients
            const hasIngredients = recipe.ingredients.every(ing => 
                player.hasItem(ing.id, ing.count)
            );
            
            recipeDiv.innerHTML = `
                <h3>${recipe.name}</h3>
                <div class="recipe-requirements">
                    <p>Required skill: ${recipe.skillRequired}</p>
                    <p>Ingredients:</p>
                    <ul>
                        ${recipe.ingredients.map(ing => `
                            <li class="${player.hasItem(ing.id, ing.count) ? 'has-item' : 'missing-item'}">
                                ${ing.count}x ${this.getItemName(ing.id)}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
            
            const craftButton = document.createElement('button');
            craftButton.textContent = 'Craft';
            craftButton.disabled = !hasSkill || !hasIngredients;
            craftButton.onclick = () => this.craftItem(recipe);
            recipeDiv.appendChild(craftButton);
            
            recipeList.appendChild(recipeDiv);
        });
        menu.appendChild(recipeList);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.textContent = 'Close';
        closeButton.onclick = () => menu.remove();
        menu.appendChild(closeButton);

        // Add menu to document
        document.body.appendChild(menu);

        // Add CSS
        const style = document.createElement('style');
        style.textContent = `
            .crafting-menu {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #666;
                padding: 20px;
                color: white;
                z-index: 1000;
                min-width: 400px;
                max-height: 80vh;
                overflow-y: auto;
            }

            .crafting-header {
                border-bottom: 1px solid #666;
                margin-bottom: 10px;
                padding-bottom: 10px;
            }

            .recipe-item {
                border: 1px solid #444;
                margin: 10px 0;
                padding: 10px;
                background: rgba(0, 0, 0, 0.5);
            }

            .recipe-requirements {
                margin: 10px 0;
                font-size: 0.9em;
            }

            .has-item {
                color: #90EE90;
            }

            .missing-item {
                color: #FFB6C1;
            }

            .crafting-menu button {
                background: #444;
                border: 1px solid #666;
                color: white;
                padding: 5px 10px;
                cursor: pointer;
                margin-top: 10px;
            }

            .crafting-menu button:disabled {
                background: #333;
                color: #666;
                cursor: not-allowed;
            }

            .crafting-menu button:not(:disabled):hover {
                background: #666;
            }

            .close-button {
                margin-top: 20px;
                width: 100%;
            }
        `;
        document.head.appendChild(style);
    },

    craftItem(recipe) {
        // Check requirements again
        if ((player.getKnowledgeLevel('crafting') || 0) < recipe.skillRequired) {
            showMessage("You don't have the required skill level.", 'warning');
            return;
        }

        // Check and consume ingredients
        for (const ing of recipe.ingredients) {
            if (!player.hasItem(ing.id, ing.count)) {
                showMessage(`Missing required ingredients: ${this.getItemName(ing.id)}`, 'warning');
                return;
            }
            player.removeItem(ing.id, ing.count);
        }

        // Add crafted item
        if (player.addItem(recipe.result)) {
            showMessage(`Successfully crafted ${recipe.name}!`, 'success');
            
            // Gain crafting experience
            player.gainKnowledge('crafting', 1);
            
            // Refresh menu
            this.refreshCraftingMenu();
        } else {
            showMessage("Inventory full!", 'warning');
            // Return ingredients
            recipe.ingredients.forEach(ing => {
                player.addItem({ id: ing.id, count: ing.count });
            });
        }
    },

    getItemName(id) {
        const items = {
            metal_ingot: 'Metal Ingot',
            tools: 'Basic Tools',
            rope: 'Rope',
            repair_kit: 'Repair Kit'
        };
        return items[id] || id;
    },

    refreshCraftingMenu() {
        const oldMenu = document.querySelector('.crafting-menu');
        if (oldMenu) {
            const npcType = oldMenu.querySelector('h2').textContent.split(' ')[2].toUpperCase();
            oldMenu.remove();
            this.openCraftingMenu({ type: npcType });
        }
    }
}; 