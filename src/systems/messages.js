window.messages = {
    current: null,
    queue: [],
    displayTime: 3000,
    lastMessage: null,
    lastMessageTime: 0,
    
    init() {
        this.current = null;
        this.queue = [];
        this.lastMessage = null;
        this.lastMessageTime = 0;
    },
    
    show(text, type = 'info') {
        // Prevent duplicate messages within 1 second
        const now = Date.now();
        if (this.lastMessage === text && now - this.lastMessageTime < 1000) {
            return;
        }
        
        this.queue.push({
            text,
            type,
            time: now
        });
        
        this.lastMessage = text;
        this.lastMessageTime = now;
    },
    
    update() {
        if (this.current) {
            if (Date.now() - this.current.time >= this.displayTime) {
                this.current = null;
            }
        }
        
        if (!this.current && this.queue.length > 0) {
            this.current = this.queue.shift();
        }
    },
    
    draw(ctx) {
        if (!this.current) return;
        
        const message = this.current;
        const progress = (Date.now() - message.time) / this.displayTime;
        const alpha = progress < 0.1 ? progress * 10 : 
                     progress > 0.9 ? (1 - progress) * 10 : 
                     1;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Draw message box at bottom of screen - adjusted for smaller canvas
        const boxWidth = Math.min(canvas.width - 20, 260);
        const boxHeight = 40;
        const x = (canvas.width - boxWidth) / 2;
        const y = canvas.height - boxHeight - 10;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(x, y, boxWidth, boxHeight);
        
        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, boxWidth, boxHeight);
        
        // Message type indicator
        const typeColors = {
            info: '#4466FF',
            discovery: '#44FF44',
            warning: '#FFFF44',
            danger: '#FF4444',
            default: '#FFFFFF'
        };
        const typeColor = typeColors[message.type] || typeColors.default;
        
        // Draw type indicator bar
        ctx.fillStyle = typeColor;
        ctx.fillRect(x + 1, y + 1, 3, boxHeight - 2);
        
        // Draw text
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        
        // Main text
        ctx.font = '14px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(message.text, x + 10, y + 15);
        
        // Type text
        ctx.font = '12px Arial';
        ctx.fillStyle = typeColor;
        ctx.fillText(message.type.toUpperCase(), x + 10, y + 30);
        
        ctx.restore();
    }
};

window.showMessage = function(text, type) {
    messages.show(text, type);
}; 