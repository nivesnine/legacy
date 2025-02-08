// Make the class globally accessible
window.GameMenu = class GameMenu {
    constructor() {
        this.isVisible = false;
        this.selectedOption = 0;
        this.options = [
            { text: 'Resume Game', action: () => this.hide() },
            { text: 'Items', action: () => this.showItems() },
            { text: 'Controls', action: () => this.showControls() }
        ];
        this.itemsVisible = false;
        this.controlsVisible = false;
    }

    draw(ctx) {
        if (!this.isVisible) return;

        const menuWidth = 160;
        const menuHeight = 200;
        const menuX = (canvas.width - menuWidth) / 2;
        const menuY = (canvas.height - menuHeight) / 2;

        // Draw title above menu box
        ctx.font = '20px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText('LEGACY', menuX + menuWidth/2, menuY - 10);

        // Draw menu background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(menuX, menuY, menuWidth, menuHeight);

        // Draw menu border
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);

        if (this.itemsVisible) {
            this.drawItems(ctx, menuX, menuY, menuWidth, menuHeight);
        } else if (this.controlsVisible) {
            this.drawControls(ctx, menuX, menuY, menuWidth, menuHeight);
        } else {
            // Draw main menu options
            ctx.font = '14px Arial';
            this.options.forEach((option, index) => {
                if (index === this.selectedOption) {
                    ctx.fillStyle = '#FFD700';
                } else {
                    ctx.fillStyle = '#FFFFFF';
                }
                ctx.fillText(option.text, menuX + menuWidth/2, menuY + 40 + (index * 25));
            });

            // Draw player stats below menu options
            ctx.font = '12px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`Health: ${player.health}/${player.maxHealth}`, menuX + menuWidth/2, menuY + menuHeight - 60);
            ctx.fillText(`Level: ${player.level}`, menuX + menuWidth/2, menuY + menuHeight - 45);
            ctx.fillText(`XP: ${player.experience}/${player.experienceToLevel}`, menuX + menuWidth/2, menuY + menuHeight - 30);
            ctx.fillText(`Zones Explored: ${window.discoveredZones.size}`, menuX + menuWidth/2, menuY + menuHeight - 15);
        }
    }

    drawItems(ctx, menuX, menuY, menuWidth, menuHeight) {
        // Draw items list
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        const inventory = window.player.inventory || [];
        inventory.forEach((item, index) => {
            const isSelected = index === window.player.selectedItem;
            ctx.fillStyle = isSelected ? '#FFD700' : '#FFFFFF';
            const text = item.stackable ? `${item.name} (${item.count})` : item.name;
            ctx.fillText(text, menuX + 20, menuY + 40 + (index * 20));
        });

        if (inventory.length === 0) {
            ctx.fillStyle = '#888888';
            ctx.textAlign = 'center';
            ctx.fillText('No items', menuX + menuWidth/2, menuY + 60);
        }

        // Draw return instruction
        ctx.font = '12px Arial';
        ctx.fillStyle = '#888888';
        ctx.textAlign = 'center';
        ctx.fillText('Press ESC to return', menuX + menuWidth/2, menuY + menuHeight - 20);
    }

    drawControls(ctx, menuX, menuY, menuWidth, menuHeight) {
        // Draw controls list
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        const controls = [
            'Arrow Keys: Move',
            'Space/E: Interact',
            'ESC: Menu'
        ];

        controls.forEach((control, index) => {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(control, menuX + 20, menuY + 40 + (index * 20));
        });

        // Draw return instruction
        ctx.font = '12px Arial';
        ctx.fillStyle = '#888888';
        ctx.textAlign = 'center';
        ctx.fillText('Press ESC to return', menuX + menuWidth/2, menuY + menuHeight - 20);
    }

    show() {
        this.isVisible = true;
        this.selectedOption = 0;
        this.itemsVisible = false;
        this.controlsVisible = false;
    }

    hide() {
        this.isVisible = false;
        this.itemsVisible = false;
        this.controlsVisible = false;
    }

    showItems() {
        this.itemsVisible = true;
        this.controlsVisible = false;
    }

    showControls() {
        this.controlsVisible = true;
        this.itemsVisible = false;
    }

    handleInput(key) {
        if (!this.isVisible) return;

        if (this.itemsVisible || this.controlsVisible) {
            if (key === 'Escape') {
                this.itemsVisible = false;
                this.controlsVisible = false;
            }
            return;
        }

        switch(key) {
            case 'ArrowUp':
                this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
                break;
            case 'ArrowDown':
                this.selectedOption = (this.selectedOption + 1) % this.options.length;
                break;
            case 'Enter':
                this.options[this.selectedOption].action();
                break;
            case 'Escape':
                this.hide();
                break;
        }
    }
} 