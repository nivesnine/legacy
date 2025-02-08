// Trade system for shops and taverns
window.TradeSystem = {
    // Different merchant inventories based on type
    merchantStock: {
        SHOPKEEPER: [
            { id: 'healing_potion', name: 'Healing Potion', price: 50, description: 'Restores 50 health' },
            { id: 'map', name: 'Local Map', price: 25, description: 'Reveals nearby areas' },
            { id: 'torch', name: 'Torch', price: 15, description: 'Provides light in dark areas' },
            { id: 'rope', name: 'Rope', price: 30, description: 'Useful for climbing' },
            { id: 'compass', name: 'Compass', price: 40, description: 'Shows direction' }
        ],
        TAVERNKEEPER: [
            { id: 'ale', name: 'Ale', price: 5, description: 'A refreshing drink' },
            { id: 'meal', name: 'Hot Meal', price: 10, description: 'Restores stamina' },
            { id: 'wine', name: 'Fine Wine', price: 15, description: 'A luxurious beverage' }
        ],
        BLACKSMITH: [
            { id: 'repair_kit', name: 'Repair Kit', price: 75, description: 'Fix damaged items' },
            { id: 'metal_ingot', name: 'Metal Ingot', price: 100, description: 'Used in crafting' },
            { id: 'tools', name: 'Basic Tools', price: 50, description: 'Required for repairs' }
        ]
    },

    // Open trade menu with specific merchant
    openTradeMenu(npc) {
        const menu = document.createElement('div');
        menu.className = 'trade-menu';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'trade-header';
        header.innerHTML = `
            <h2>Trading with ${npc.type.toLowerCase()}</h2>
            <p>Your gold: ${player.gold}</p>
        `;
        menu.appendChild(header);

        // Create merchant inventory
        const merchantItems = document.createElement('div');
        merchantItems.className = 'merchant-items';
        merchantItems.innerHTML = '<h3>Merchant Items</h3>';
        
        this.merchantStock[npc.type].forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'trade-item';
            itemDiv.innerHTML = `
                <span>${item.name}</span>
                <span>${item.price} gold</span>
                <span class="item-description">${item.description}</span>
            `;
            
            const buyButton = document.createElement('button');
            buyButton.textContent = 'Buy';
            buyButton.onclick = () => this.buyItem(item);
            itemDiv.appendChild(buyButton);
            
            merchantItems.appendChild(itemDiv);
        });
        menu.appendChild(merchantItems);

        // Create player inventory
        const playerItems = document.createElement('div');
        playerItems.className = 'player-items';
        playerItems.innerHTML = '<h3>Your Items</h3>';
        
        player.inventory.forEach(item => {
            if (item.sellable) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'trade-item';
                itemDiv.innerHTML = `
                    <span>${item.name}</span>
                    <span>${Math.floor(item.price * 0.5)} gold</span>
                    <span class="item-count">x${item.count || 1}</span>
                `;
                
                const sellButton = document.createElement('button');
                sellButton.textContent = 'Sell';
                sellButton.onclick = () => this.sellItem(item);
                itemDiv.appendChild(sellButton);
                
                playerItems.appendChild(itemDiv);
            }
        });
        menu.appendChild(playerItems);

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
            .trade-menu {
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

            .trade-header {
                border-bottom: 1px solid #666;
                margin-bottom: 10px;
                padding-bottom: 10px;
            }

            .trade-item {
                display: grid;
                grid-template-columns: 2fr 1fr auto auto;
                gap: 10px;
                align-items: center;
                padding: 5px;
                border-bottom: 1px solid #444;
            }

            .item-description {
                font-size: 0.8em;
                color: #aaa;
            }

            .trade-menu button {
                background: #444;
                border: 1px solid #666;
                color: white;
                padding: 5px 10px;
                cursor: pointer;
            }

            .trade-menu button:hover {
                background: #666;
            }

            .close-button {
                margin-top: 20px;
                width: 100%;
            }
        `;
        document.head.appendChild(style);
    },

    buyItem(item) {
        if (player.gold >= item.price) {
            if (player.addItem(item)) {
                player.gold -= item.price;
                showMessage(`Bought ${item.name} for ${item.price} gold.`, 'info');
                this.refreshTradeMenu();
            } else {
                showMessage("Can't carry any more of that item.", 'warning');
            }
        } else {
            showMessage("Not enough gold!", 'warning');
        }
    },

    sellItem(item) {
        const sellPrice = Math.floor(item.price * 0.5);
        if (player.removeItem(item.id)) {
            player.gold += sellPrice;
            showMessage(`Sold ${item.name} for ${sellPrice} gold.`, 'info');
            this.refreshTradeMenu();
        }
    },

    refreshTradeMenu() {
        const oldMenu = document.querySelector('.trade-menu');
        if (oldMenu) {
            const npcType = oldMenu.querySelector('h2').textContent.split(' ')[2].toUpperCase();
            oldMenu.remove();
            this.openTradeMenu({ type: npcType });
        }
    }
}; 