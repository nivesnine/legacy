// Achievement notification system
window.notifications = {
    list: [],
    
    init() {
        this.list = [];
    },
    
    add(text, type = 'info') {
        this.list.push({
            text,
            type,
            time: Date.now(),
            duration: 3000
        });
    },
    
    update() {
        const now = Date.now();
        this.list = this.list.filter(n => now - n.time < n.duration);
    },
    
    draw(ctx) {
        let y = 10;
        this.list.forEach(notification => {
            ctx.fillStyle = this.getColor(notification.type);
            ctx.font = '14px Arial';
            ctx.fillText(notification.text, 10, y);
            y += 20;
        });
    },
    
    getColor(type) {
        switch(type) {
            case 'danger': return '#ff0000';
            case 'success': return '#00ff00';
            case 'discovery': return '#ffff00';
            default: return '#ffffff';
        }
    }
};

// Helper function to show achievements
window.showAchievement = function(type, amount) {
    notifications.add(type, amount);
}; 