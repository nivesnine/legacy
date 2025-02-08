// Player configuration
window.player = {
    x: 0,  // Will be set by game.js
    y: 0,  // Will be set by game.js
    size: PLAYER_SIZE,
    sprite: sprites.down,
    isMoving: false,
    direction: 'down',
    targetX: 0,
    targetY: 0,
    moveProgress: 0,
    lastDirection: 'down', // Add this to track last direction
    
    // Health system
    maxHealth: 100,
    health: 100,
    isInvulnerable: false,
    invulnerableTime: 1000, // ms of invulnerability after taking damage
    flashDamage: false,
    
    // Movement
    moveSpeed: 1,
    
    // Stats and progression
    level: 1,
    experience: 0,
    experienceToLevel: 100,
    
    // Inheritance system
    generation: 1,
    familyName: '',
    traits: [], // Inherited traits from parents
    
    // Age system
    age: 10 + Math.floor(Math.random() * 4), // Start between 10-13 years old
    birthYear: 0,
    deathAge: 70 + Math.floor(Math.random() * 20), // Die between 70-89
    yearLength: 60 * 60 * 1000, // 1 game year = 60 real seconds
    lastYearUpdate: Date.now(),
    ageEffects: {
        CHILD: { // Age 0-16
            maxHealth: 70,
            moveSpeed: 1.2,
            stamina: 0.8,
            learningBonus: 1.5
        },
        TEEN: { // Age 17-25
            maxHealth: 100,
            moveSpeed: 1.1,
            stamina: 1.0,
            learningBonus: 1.2
        },
        ADULT: { // Age 26-50
            maxHealth: 100,
            moveSpeed: 1.0,
            stamina: 1.0,
            experienceBonus: 1.2,
            wisdomGain: 0.1
        },
        ELDER: { // Age 51+
            maxHealth: 80,
            moveSpeed: 0.8,
            stamina: 0.7,
            wisdomGain: 0.2,
            teachingBonus: 1.5
        }
    },
    
    // Wisdom and teaching system
    wisdom: 0,
    maxWisdom: 100,
    teachingAbility: 0,
    
    // Health and status
    health: 100,
    injuries: [], // Track current injuries
    
    // Random events
    lastEventCheck: Date.now(),
    eventCheckInterval: 30000, // Check for random events every 30 seconds
    
    // Effects system
    temporaryEffects: [],
    
    // Knowledge and discovery system
    knowledge: {
        herbalism: 0,
        mycology: 0,
        astronomy: 0,
        geology: 0,
        meteorology: 0
    },
    
    discoveryLog: [],
    maxDiscoveryLogSize: 100,
    
    // Methods
    takeDamage(amount, type) {
        if (this.isInvulnerable) return;
        
        this.health = Math.max(0, this.health - amount);
        this.isInvulnerable = true;
        this.flashDamage = true;
        
        // Add injury if significant damage
        if (amount >= 20) {
            this.injuries.push({
                type,
                severity: amount,
                duration: 60000 * (amount/10) // Duration based on damage
            });
        }
        
        setTimeout(() => {
            this.isInvulnerable = false;
            this.flashDamage = false;
        }, this.invulnerableTime);
        
        if (this.health <= 0) {
            this.die(type);
        }
    },
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    },
    
    die(cause) {
        showMessage(`You have died from ${cause}!`, 'danger');
        // Handle death - could trigger inheritance system here
    },
    
    respawnAsHeir(heirInfo) {
        // Transfer inherited items
        inventory.items = inventory.items.filter(item => item.inherited);
        
        // Update player stats
        this.generation++;
        this.health = this.maxHealth;
        this.level = 1;
        this.experience = 0;
        
        // Inherit traits
        this.traits = [...heirInfo.traits];
        this.familyName = heirInfo.familyName;
        
        // Move to heir's location
        this.x = heirInfo.x;
        this.y = heirInfo.y;
    },
    
    gameOver() {
        // TODO: Implement game over screen
        console.log('Game Over - No heir found');
        // Reset to new character
        window.location.reload();
    },
    
    gainExperience(type) {
        let amount = EXPERIENCE_REWARDS[type] || 0;
        
        // Apply knowledge bonuses
        if (type === 'PLANT_DISCOVERED') {
            amount *= (1 + this.getKnowledgeLevel('herbalism') * 0.1);
        } else if (type === 'MOUNTAIN_CLIMBED') {
            amount *= (1 + this.getKnowledgeLevel('geology') * 0.1);
        }
        
        debugLog(`Gained ${amount} experience from ${type}`);
        this.experience += amount;
        
        // Level up check
        while (this.experience >= this.experienceToLevel) {
            this.levelUp();
        }
        
        // Show achievement notification
        showAchievement(type, amount);
    },
    
    levelUp() {
        this.level++;
        this.experience -= this.experienceToLevel;
        this.experienceToLevel = Math.floor(this.experienceToLevel * 1.5);
        this.maxHealth += 10;
        this.health = this.maxHealth;
    },
    
    update() {
        // Update age
        const now = Date.now();
        if (now - this.lastYearUpdate >= this.yearLength) {
            this.age++;
            this.lastYearUpdate = now;
            
            // Update age effects
            this.updateAgeEffects();
            
            // Die of old age
            if (this.age >= this.deathAge) {
                this.die('old age');
                return;
            }
        }
        
        // Check for random events
        if (now - this.lastEventCheck >= this.eventCheckInterval) {
            this.checkRandomEvents();
            this.lastEventCheck = now;
        }
        
        // Update injuries
        this.updateInjuries();
        
        // Update temporary effects
        this.updateEffects();
        
        // Knowledge affects various abilities
        this.updateKnowledgeEffects();

        // Only update sprite if direction has changed
        if (this.direction !== this.lastDirection) {
            this.sprite = sprites[this.direction];
            this.lastDirection = this.direction;
        }
    },
    
    checkRandomEvents() {
        const currentTile = getTile(Math.floor(this.x/TILE_SIZE), Math.floor(this.y/TILE_SIZE));
        const random = Math.random();
        
        // Different events based on terrain
        switch(currentTile) {
            case TILES.MOUNTAIN:
            case TILES.ROCK:
                if (random < 0.1) { // 10% chance
                    this.takeDamage(20, 'falling rocks');
                    showMessage("Rocks tumble down the mountain!", 'danger');
                }
                break;
                
            case TILES.DENSE_TREE:
                if (random < 0.05) { // 5% chance
                    this.takeDamage(30, 'falling tree');
                    showMessage("A branch breaks and falls on you!", 'danger');
                }
                break;
                
            case TILES.WATER:
                if (random < 0.15) { // 15% chance
                    this.takeDamage(10, 'drowning');
                    showMessage("You struggle against the current!", 'danger');
                }
                break;
        }
    },
    
    updateInjuries() {
        const now = Date.now();
        this.injuries = this.injuries.filter(injury => {
            if (now - injury.startTime >= injury.duration) {
                showMessage(`Your ${injury.type} injury has healed`, 'info');
                return false;
            }
            return true;
        });
    },
    
    updateEffects() {
        const now = Date.now();
        this.temporaryEffects = this.temporaryEffects.filter(effect => {
            if (now - effect.startTime >= effect.duration) {
                showMessage(`The ${effect.type} effect has worn off.`, 'info');
                return false;
            }
            return true;
        });
    },
    
    // Apply effect modifiers
    getModifiedSpeed() {
        const hasSpeedBoost = this.temporaryEffects.some(e => e.type === 'speed');
        let speed = this.moveSpeed;
        
        // Apply speed boost if active
        if (hasSpeedBoost) speed *= 1.5;
        
        // Apply terrain penalties for elders
        if (this.age >= 60) {
            const currentTile = getTile(Math.floor(this.x/TILE_SIZE), Math.floor(this.y/TILE_SIZE));
            if (currentTile === TILES.MOUNTAIN || currentTile === TILES.ROCK) {
                speed *= 0.7; // Elders have more trouble on rough terrain
            }
        }
        
        return speed;
    },
    
    getModifiedStrength() {
        const hasStrengthBoost = this.temporaryEffects.some(e => e.type === 'strength');
        return hasStrengthBoost ? 1.5 : 1;
    },
    
    // Initialize with child effects
    init() {
        this.updateAgeEffects('CHILD');
        this.sprite = sprites.down;
        this.direction = 'down';
        this.isMoving = false;
        this.moveProgress = 0;
    },
    
    updateAgeEffects() {
        let stage;
        if (this.age < 17) {
            stage = 'CHILD';
        } else if (this.age < 26) {
            stage = 'TEEN';
        } else if (this.age < 51) {
            stage = 'ADULT';
        } else {
            stage = 'ELDER';
        }

        const effects = this.ageEffects[stage];
        if (effects) {
            // Apply base stats
            this.maxHealth = effects.maxHealth;
            this.moveSpeed = effects.moveSpeed;
            
            // Apply learning and experience bonuses
            if (effects.learningBonus) {
                this.learningRate = effects.learningBonus;
            }
            if (effects.experienceBonus) {
                this.experienceRate = effects.experienceBonus;
            }
            
            // Update wisdom
            if (effects.wisdomGain) {
                this.wisdom = Math.min(this.maxWisdom, this.wisdom + effects.wisdomGain);
            }
            
            // Update teaching ability for elders
            if (effects.teachingBonus) {
                this.teachingAbility = effects.teachingBonus;
            }
            
            // Adjust current health if it exceeds new max
            if (this.health > this.maxHealth) {
                this.health = this.maxHealth;
            }
            
            // Show age transition messages
            if (this.age === 17) {
                showMessage("You've entered your prime years!", 'info');
            } else if (this.age === 26) {
                showMessage("With age comes wisdom...", 'info');
            } else if (this.age === 51) {
                showMessage("You feel the weight of your years...", 'info');
            } else if (this.age >= this.deathAge - 5) {
                showMessage("You sense your time growing short...", 'warning');
            }
        }
    },
    
    gainKnowledge(field, amount) {
        if (this.knowledge[field] !== undefined) {
            const oldLevel = Math.floor(this.knowledge[field] / 10);
            this.knowledge[field] = Math.min(100, this.knowledge[field] + amount);
            const newLevel = Math.floor(this.knowledge[field] / 10);
            
            if (newLevel > oldLevel) {
                showMessage(`Your ${field} knowledge has reached level ${newLevel}!`, 'discovery');
                this.gainExperience('KNOWLEDGE_LEVEL_UP');
            }
        }
    },
    
    logDiscovery(discovery) {
        const timestamp = Date.now();
        this.discoveryLog.unshift({ discovery, timestamp });
        if (this.discoveryLog.length > this.maxDiscoveryLogSize) {
            this.discoveryLog.pop();
        }
    },
    
    getKnowledgeLevel(field) {
        return Math.floor(this.knowledge[field] / 10);
    },
    
    updateKnowledgeEffects() {
        // Herbalism improves healing item effectiveness
        const herbalismBonus = this.getKnowledgeLevel('herbalism') * 0.05;
        this.healingMultiplier = 1 + herbalismBonus;
        
        // Geology improves mountain climbing speed
        const geologyBonus = this.getKnowledgeLevel('geology') * 0.05;
        this.mountainSpeedMultiplier = 1 + geologyBonus;
        
        // Meteorology improves weather prediction
        const meteorologyLevel = this.getKnowledgeLevel('meteorology');
        this.weatherPredictionRange = meteorologyLevel * 600; // seconds
    },
    
    // Consolidated inventory system
    inventory: [],
    selectedItem: null,
    
    addItem(item) {
        // Some items are unique
        if (item.unique && this.inventory.some(i => i.id === item.id)) {
            return false;
        }
        
        // Check if item is stackable and already exists
        if (item.stackable) {
            const existingItem = this.inventory.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.count += item.count || 1;
                return true;
            }
        }
        
        // Add new item
        this.inventory.push({
            ...item,
            count: item.count || 1
        });
        return true;
    },
    
    removeItem(itemId, count = 1) {
        const index = this.inventory.findIndex(item => item.id === itemId);
        if (index === -1) return false;

        const item = this.inventory[index];
        if (item.count > count) {
            item.count -= count;
        } else {
            this.inventory.splice(index, 1);
        }
        return true;
    },
    
    hasItem(itemId, count = 1) {
        const item = this.inventory.find(item => item.id === itemId);
        return item && item.count >= count;
    },
    
    useItem(itemId) {
        const item = this.inventory.find(i => i.id === itemId);
        if (!item) return false;
        
        switch(item.id) {
            case 'raft':
                // Allow crossing water tiles
                return true;
                
            case 'ring':
                // Used for inheritance system
                return this.inventory.some(i => i.id === 'ring' && i.givenTo);
                
            case 'key':
                // Could be used for special doors or chests
                return true;
                
            case 'healingPotion':
                this.heal(50);
                this.removeItem(itemId);
                return true;
                
            default:
                return false;
        }
    }
};

// Movement system
window.movePlayer = function() {
    let moveDuration = 6 / player.getModifiedSpeed();  // Apply speed effects
    
    if (player.isMoving) {
        // Get the tile type the player is moving to
        const targetTileX = Math.floor(player.targetX / TILE_SIZE);
        const targetTileY = Math.floor(player.targetY / TILE_SIZE);
        const targetTile = getTile(targetTileX, targetTileY);
        
        // Adjust movement speed based on tile type
        if (targetTile === TILES.ROAD) {
            moveDuration = moveDuration / 2;  // 100% faster on roads
        } else if (targetTile === TILES.PATH) {
            moveDuration = moveDuration * 2/3;  // 50% faster on paths
        }

        player.moveProgress++;
        
        const progress = player.moveProgress / moveDuration;
        const startX = player.x;
        const startY = player.y;
        
        if (player.moveProgress >= moveDuration) {
            player.x = player.targetX;
            player.y = player.targetY;
            player.isMoving = false;
            player.moveProgress = 0;
        } else {
            player.x = startX + (player.targetX - startX) * progress;
            player.y = startY + (player.targetY - startY) * progress;
        }
        return;
    }

    let newTargetX = player.x;
    let newTargetY = player.y;

    if (keys.up) {
        newTargetY = player.y - TILE_SIZE;
        player.direction = 'up';
    } else if (keys.down) {
        newTargetY = player.y + TILE_SIZE;
        player.direction = 'down';
    } else if (keys.left) {
        newTargetX = player.x - TILE_SIZE;
        player.direction = 'left';
    } else if (keys.right) {
        newTargetX = player.x + TILE_SIZE;
        player.direction = 'right';
    }

    if ((newTargetX !== player.x || newTargetY !== player.y) && 
        !checkCollision(newTargetX, newTargetY)) {
        player.targetX = newTargetX;
        player.targetY = newTargetY;
        player.isMoving = true;
        player.moveProgress = 0;
    }
};

// Simplified inventory system focused on exploration and key items
window.inventory = {
    items: [],  // Array of collected items
    selectedItem: null,
    
    addItem(item) {
        // Some items are unique (like the ring)
        if (item.unique && this.items.some(i => i.id === item.id)) {
            return false;
        }
        
        this.items.push(item);
        return true;
    },
    
    hasItem(itemId) {
        return this.items.some(item => item.id === itemId);
    },
    
    useItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return false;
        
        switch(item.id) {
            case 'raft':
                // Allow crossing water tiles
                return true;
                
            case 'ring':
                // Used for inheritance system
                return this.items.some(i => i.id === 'ring' && i.givenTo);
                
            case 'key':
                // Could be used for special doors or chests
                return true;
                
            default:
                return false;
        }
    }
};

// Experience system based on exploration and achievements
const EXPERIENCE_REWARDS = {
    NEW_ZONE_DISCOVERED: 50,      // Finding a new type of area
    ITEM_COLLECTED: 25,           // Finding a significant item
    BUILDING_ENTERED: 10,         // Entering a new building
    HEIR_ESTABLISHED: 100,        // Successfully setting up an heir
    WATER_CROSSED: 30,            // First time crossing water with raft
    MOUNTAIN_CLIMBED: 40,         // Reaching mountain peaks
    FAMILY_LEGACY: 200,           // Completing a generation
    PLANT_DISCOVERED: 35,         // Finding and identifying a new plant
    HERB_COMBINATION: 45,         // Discovering a new herb combination
    KNOWLEDGE_LEVEL_UP: 75,       // Reaching a new level in any knowledge field
    WEATHER_PREDICTED: 25,        // Successfully predicting weather
    SEASONAL_CYCLE: 150,         // Experiencing all seasons
    BIOME_MASTERY: 300,         // Reaching level 5 in biome-specific knowledge
    NATURALIST: 500,            // Discovering all basic plants
    MASTER_HERBALIST: 1000,     // Discovering all herb combinations
    GEOLOGIST: 400,             // Identifying all rock formations
    ASTRONOMER: 350,            // Mapping constellations
    METEOROLOGIST: 450,         // Predicting complex weather patterns
    ECOSYSTEM_UNDERSTOOD: 250,   // Understanding biome relationships
    MIGRATION_TRACKED: 200      // Tracking seasonal changes
};

// Add basic crafting recipes
window.CRAFTING_RECIPES = [
    {
        inputs: ['wood', 'wood'],
        output: 'planks',
        count: 4
    },
    {
        inputs: ['planks', 'planks', 'planks'],
        output: 'door',
        count: 1
    },
    // Add more recipes as needed
];

// Update player position and animation
window.updatePlayer = function() {
    // Don't update if transitioning
    if (TransitionManager.isTransitioning) return;

    // Get movement input
    let dx = 0;
    let dy = 0;

    if (keys.up) dy -= 1;
    if (keys.down) dy += 1;
    if (keys.left) dx -= 1;
    if (keys.right) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;
    }

    // Update direction and sprite only when moving
    if (dx !== 0 || dy !== 0) {
        // Update direction
        if (Math.abs(dx) > Math.abs(dy)) {
            player.direction = dx > 0 ? 'right' : 'left';
        } else {
            player.direction = dy > 0 ? 'down' : 'up';
        }
        // Update sprite based on direction
        player.sprite = sprites[player.direction];
    }

    // Calculate new position
    const speed = TILE_SIZE / 16;  // Adjust for smoother movement
    const newX = player.x + dx * speed;
    const newY = player.y + dy * speed;

    // Check collision at new position
    if (!checkCollision(newX, newY)) {
        player.x = newX;
        player.y = newY;
    }
};