// Debug logging
window.debugLog = function(...args) {
    if (window.DEBUG) {
        console.log(...args);
    }
};

// Random number utilities
window.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.randomFloat = function(min, max) {
    return Math.random() * (max - min) + min;
};

window.randomChoice = function(array) {
    return array[Math.floor(Math.random() * array.length)];
};

// Distance calculations
window.distance = function(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
};

window.manhattanDistance = function(x1, y1, x2, y2) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
};

// Color utilities
window.lerp = function(start, end, t) {
    return start + (end - start) * t;
};

window.lerpColor = function(color1, color2, t) {
    const r1 = parseInt(color1.substr(1,2), 16);
    const g1 = parseInt(color1.substr(3,2), 16);
    const b1 = parseInt(color1.substr(5,2), 16);
    
    const r2 = parseInt(color2.substr(1,2), 16);
    const g2 = parseInt(color2.substr(3,2), 16);
    const b2 = parseInt(color2.substr(5,2), 16);
    
    const r = Math.round(lerp(r1, r2, t));
    const g = Math.round(lerp(g1, g2, t));
    const b = Math.round(lerp(b1, b2, t));
    
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}; 