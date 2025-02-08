// Transition system for smooth scene changes
window.TransitionManager = {
    isTransitioning: false,
    alpha: 0,
    transitionType: null,
    callback: null,
    transitionSpeed: 0.1,
    font: '20px Arial',

    startTransition(type, callback = null) {
        this.isTransitioning = true;
        this.transitionType = type;
        this.callback = callback;
        this.alpha = type === 'enter' ? 1 : 0;
        
        // Only log important transitions
        if (type === 'exit') {
            debugLog('Loading interior...');
        } else if (type === 'enter') {
            debugLog('Transition complete');
        }
    },

    update() {
        if (!this.isTransitioning) return;

        if (this.transitionType === 'enter') {
            this.alpha -= this.transitionSpeed;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.isTransitioning = false;
                this.transitionType = null;
                if (this.callback) {
                    this.callback();
                    this.callback = null;
                }
            }
        } else if (this.transitionType === 'exit') {
            this.alpha += this.transitionSpeed;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.isTransitioning = false;
                this.transitionType = null;
                if (this.callback) {
                    this.callback();
                    this.callback = null;
                }
            }
        }
    },

    draw(ctx) {
        if (!this.isTransitioning && this.alpha === 0) return;

        ctx.save();
        
        // Draw black overlay
        ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Always draw "Loading..." when transitioning and fully faded to black
        if (this.alpha > 0.9) {
            ctx.font = this.font;
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                'Loading...', 
                ctx.canvas.width / 2, 
                ctx.canvas.height / 2
            );
        }

        ctx.restore();
    }
}; 