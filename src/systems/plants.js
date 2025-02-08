window.PLANTS = {
    // Healing plants
    [TILES.HERB_HEALING]: {
        name: 'Red Mushroom',
        description: 'A vibrant red mushroom with healing properties.',
        effect(player) {
            const healAmount = 20 + Math.floor(Math.random() * 20);
            player.heal(healAmount);
            showMessage(`The ${this.name} restores ${healAmount} health!`, 'good');
        },
        chance: 0.4,
        biomes: [ZONES.FOREST, ZONES.PLAINS],
        season: 'all',
        combinations: ['HERB_STRENGTH', 'HERB_SPEED']
    },

    // Poisonous plants (now educational rather than harmful)
    [TILES.HERB_POISON]: {
        name: 'Death Cap',
        description: 'A dangerous mushroom. Studying it increases botanical knowledge.',
        effect(player) {
            player.gainKnowledge('mycology', 10);
            showMessage(`You carefully study the ${this.name}, learning about mushroom identification.`, 'discovery');
        },
        chance: 0.2,
        biomes: [ZONES.FOREST],
        season: 'autumn',
        combinations: ['HERB_HEALING']
    },

    // Strength boost
    [TILES.HERB_STRENGTH]: {
        name: 'Lion\'s Mane',
        description: 'A shaggy white mushroom that enhances vitality.',
        effect(player) {
            player.temporaryEffects.push({
                type: 'strength',
                duration: 30000,
                startTime: Date.now(),
                magnitude: 1.5
            });
            showMessage(`The ${this.name} makes you feel stronger!`, 'good');
        },
        chance: 0.2,
        biomes: [ZONES.MOUNTAIN, ZONES.FOREST],
        season: 'summer',
        combinations: ['HERB_HEALING', 'HERB_SPEED']
    },

    // Speed boost
    [TILES.HERB_SPEED]: {
        name: 'Swift Leaf',
        description: 'A delicate leaf that enhances agility.',
        effect(player) {
            player.temporaryEffects.push({
                type: 'speed',
                duration: 20000,
                startTime: Date.now(),
                magnitude: 1.3
            });
            showMessage(`The ${this.name} makes you feel lighter!`, 'good');
        },
        chance: 0.2,
        biomes: [ZONES.PLAINS],
        season: 'spring',
        combinations: ['HERB_STRENGTH']
    }
};

// Track discovered plants and combinations
window.herbalism = {
    discoveries: new Set(),
    knownCombinations: new Set(),
    
    discoverPlant(plantType) {
        if (!this.discoveries.has(plantType)) {
            this.discoveries.add(plantType);
            player.gainExperience('PLANT_DISCOVERED');
            showMessage(`You've discovered ${PLANTS[plantType].name}!`, 'discovery');
            
            // Check for possible combinations with known plants
            this.checkNewCombinations(plantType);
        }
    },
    
    checkNewCombinations(newPlant) {
        const plant = PLANTS[newPlant];
        plant.combinations.forEach(combo => {
            if (this.discoveries.has(combo)) {
                const comboKey = [newPlant, combo].sort().join('-');
                if (!this.knownCombinations.has(comboKey)) {
                    this.knownCombinations.add(comboKey);
                    showMessage(`You realize ${plant.name} might combine well with ${PLANTS[combo].name}!`, 'discovery');
                }
            }
        });
    },
    
    combineHerbs(herb1, herb2) {
        const comboKey = [herb1, herb2].sort().join('-');
        if (this.knownCombinations.has(comboKey)) {
            const effect = this.getCombinationEffect(herb1, herb2);
            return effect;
        }
        return null;
    },
    
    getCombinationEffect(herb1, herb2) {
        // Define special effects for known combinations
        const combos = {
            'HERB_HEALING-HERB_STRENGTH': {
                name: 'Vitality Elixir',
                effect(player) {
                    player.heal(50);
                    player.temporaryEffects.push({
                        type: 'strength',
                        duration: 60000,
                        startTime: Date.now(),
                        magnitude: 2.0
                    });
                }
            },
            // Add more combinations as needed
        };
        
        const key = [herb1, herb2].sort().join('-');
        return combos[key];
    }
};

// Enhanced plant generation based on biome and season
window.addPlantsToChunk = function(chunk, chunkX, chunkY, zone) {
    const seed = zone.seed + chunkX * 10000 + chunkY;
    const random = () => seededRandom(seed++);
    
    // Get current season (could be based on game time)
    const currentSeason = getCurrentSeason();
    
    // Filter plants suitable for this biome and season
    const suitablePlants = Object.entries(PLANTS).filter(([_, plant]) => {
        return plant.biomes.includes(zone.type) && 
               (plant.season === 'all' || plant.season === currentSeason);
    });
    
    // Add plants with proper distribution
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            if (chunk[y][x] === TILES.EMPTY && random() < 0.1) {
                // Weight plants by their chance
                const totalWeight = suitablePlants.reduce((sum, [_, plant]) => sum + plant.chance, 0);
                let roll = random() * totalWeight;
                
                for (const [tileType, plant] of suitablePlants) {
                    roll -= plant.chance;
                    if (roll <= 0) {
                        chunk[y][x] = parseInt(tileType);
                        break;
                    }
                }
            }
        }
    }
};

function getCurrentSeason() {
    // This could be tied to game time system
    const gameTime = Date.now() / 1000;
    const yearProgress = (gameTime % (60 * 60 * 24)) / (60 * 60 * 24);
    
    if (yearProgress < 0.25) return 'spring';
    if (yearProgress < 0.5) return 'summer';
    if (yearProgress < 0.75) return 'autumn';
    return 'winter';
} 