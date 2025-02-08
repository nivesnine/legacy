class TransitionManager {
    static isTransitioning = false;
    static alpha = 0;
    static transitionType = null;
    static callback = null;
    static transitionSpeed = 0.05;

    static startTransition(type, callback = null) {
        this.isTransitioning = true;
        this.transitionType = type;
        this.callback = callback;
        this.alpha = type === 'enter' ? 0 : 1;
    }

    static update() {
        if (!this.isTransitioning) return;

        if (this.transitionType === 'enter') {
            this.alpha += this.transitionSpeed;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.isTransitioning = false;
                if (this.callback) this.callback();
            }
        } else if (this.transitionType === 'exit') {
            this.alpha -= this.transitionSpeed;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.isTransitioning = false;
                if (this.callback) this.callback();
            }
        }
    }

    static draw(ctx) {
        if (!this.isTransitioning && this.alpha === 0) return;

        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
} 