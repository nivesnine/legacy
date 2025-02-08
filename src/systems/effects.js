window.effects = {
    list: [],
    
    init() {
        this.list = [];
    },
    
    add(effect) {
        this.list.push(effect);
    },
    
    update() {
        const now = Date.now();
        this.list = this.list.filter(effect => {
            if (effect.update) effect.update();
            return now - effect.startTime < effect.duration;
        });
    },
    
    draw(ctx) {
        this.list.forEach(effect => {
            if (effect.draw) effect.draw(ctx);
        });
    }
}; 