class MessagePopup {
    constructor() {
        this.messages = [];
        this.fadeTime = 3000; // Time in ms before message starts fading
        this.fadeOutDuration = 1000; // Duration of fade out animation
    }

    addMessage(text, type = 'info') {
        const message = {
            text,
            type,
            timestamp: Date.now(),
            opacity: 1
        };
        this.messages.push(message);
        
        // Remove old messages
        if (this.messages.length > 5) {
            this.messages.shift();
        }
    }

    update() {
        const currentTime = Date.now();
        this.messages = this.messages.filter(msg => {
            const age = currentTime - msg.timestamp;
            if (age > this.fadeTime) {
                const fadeProgress = (age - this.fadeTime) / this.fadeOutDuration;
                msg.opacity = Math.max(0, 1 - fadeProgress);
                return msg.opacity > 0;
            }
            return true;
        });
    }

    draw(ctx) {
        const padding = 10;
        const messageHeight = 30;
        const startY = ctx.canvas.height - (this.messages.length * (messageHeight + padding));

        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = '16px Arial';

        this.messages.forEach((msg, index) => {
            const y = startY + (index * (messageHeight + padding));
            
            // Draw background
            ctx.fillStyle = this.getBackgroundColor(msg.type, msg.opacity);
            ctx.strokeStyle = this.getBorderColor(msg.type, msg.opacity);
            ctx.lineWidth = 2;
            
            const textWidth = ctx.measureText(msg.text).width;
            const boxWidth = textWidth + (padding * 2);
            const boxX = padding;
            const boxY = y;
            
            // Rounded rectangle background
            this.drawRoundedRect(ctx, boxX, boxY, boxWidth, messageHeight, 5);
            ctx.fill();
            ctx.stroke();
            
            // Draw text
            ctx.fillStyle = `rgba(255, 255, 255, ${msg.opacity})`;
            ctx.fillText(msg.text, boxX + padding, boxY + (messageHeight / 2));
        });

        ctx.restore();
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    getBackgroundColor(type, opacity) {
        const colors = {
            info: `rgba(0, 0, 0, ${opacity * 0.8})`,
            success: `rgba(40, 167, 69, ${opacity * 0.8})`,
            warning: `rgba(255, 193, 7, ${opacity * 0.8})`,
            error: `rgba(220, 53, 69, ${opacity * 0.8})`
        };
        return colors[type] || colors.info;
    }

    getBorderColor(type, opacity) {
        const colors = {
            info: `rgba(128, 128, 128, ${opacity * 0.5})`,
            success: `rgba(40, 167, 69, ${opacity * 0.5})`,
            warning: `rgba(255, 193, 7, ${opacity * 0.5})`,
            error: `rgba(220, 53, 69, ${opacity * 0.5})`
        };
        return colors[type] || colors.info;
    }
} 