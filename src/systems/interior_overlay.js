window.interiorOverlay = {
    visible: false,
    position: null,
    fadeAlpha: 0,
    fadeSpeed: 0.1,

    init() {
        this.visible = false;
        this.position = null;
        this.fadeAlpha = 0;
    },

    show(position) {
        if (!position) {
            console.error('Attempted to show interior overlay without position');
            return;
        }
        this.visible = true;
        this.position = position;
        this.fadeAlpha = 0;
    },

    hide() {
        this.visible = false;
        this.position = null;
        this.fadeAlpha = 0;
    },

    update() {
        if (this.visible && this.fadeAlpha < 1) {
            this.fadeAlpha = Math.min(1, this.fadeAlpha + this.fadeSpeed);
        } else if (!this.visible && this.fadeAlpha > 0) {
            this.fadeAlpha = Math.max(0, this.fadeAlpha - this.fadeSpeed);
        }
    },

    draw(ctx) {
        if (!this.position || this.fadeAlpha <= 0) return;

        const interior = BuildingManager.getCurrentInterior();
        if (!interior || !interior.layout) return;

        ctx.save();
        ctx.globalAlpha = this.fadeAlpha * 0.7;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
}; 