window.buildingInfo = new Map();
        window.currentChunkNames = new Set();
        
        // Building types
        window.BUILDING_TYPES = {
            HOUSE: 'house',
            SHOP: 'shop',
            INN: 'inn',
            BLACKSMITH: 'blacksmith',
            TAVERN: 'tavern'
        };

        // Name generation data
        window.BUILDING_NAMES = {
            prefix: ['Old', 'Golden', 'Silver', 'Iron', 'Copper', 'Red', 'Blue', 'Green', 'White', 'Black', 
                     'Ancient', 'Rusty', 'Shining', 'Mystic', 'Crystal', 'Emerald', 'Ruby', 'Shadow', 'Bright',
                     'Crooked', 'Twisted', 'Broken', 'Lucky', 'Blessed', 'Cursed', 'Haunted', 'Merry', 'Wild'],
            adjectives: ['Sleeping', 'Dancing', 'Laughing', 'Wandering', 'Hidden', 'Silent', 'Whispering', 
                         'Roaring', 'Prancing', 'Mysterious', 'Drunken', 'Jolly', 'Grumpy', 'Sneaky', 'Clever',
                         'Wise', 'Foolish', 'Proud', 'Humble', 'Mighty'],
            nouns: ['Dragon', 'Lion', 'Eagle', 'Crown', 'Shield', 'Sword', 'Star', 'Moon', 'Sun', 'Rose',
                    'Griffin', 'Phoenix', 'Unicorn', 'Whale', 'Bear', 'Wolf', 'Raven', 'Serpent', 'Tiger', 
                    'Hammer', 'Anvil', 'Goblet', 'Chalice', 'Barrel', 'Tankard', 'Axe', 'Dagger', 'Bow',
                    'Arrow', 'Stallion', 'Mare', 'Stag', 'Hound', 'Cat', 'Rat', 'Pig', 'Goat', 'Chicken'],
            locations: ['Corner', 'Square', 'Plaza', 'Street', 'Lane', 'Garden', 'Market', 'Haven', 'Rest',
                        'Crossing', 'Bridge', 'Gate', 'Hill', 'Valley', 'Harbor', 'Dock', 'Alley', 'Way'],
            firstNames: ['John', 'Mary', 'William', 'Elizabeth', 'James', 'Sarah', 'Thomas', 'Margaret',
                         'Edward', 'Alice', 'George', 'Catherine', 'Richard', 'Anne', 'Robert', 'Emma',
                         'Harold', 'Rose', 'Arthur', 'Grace', 'Giles', 'Agnes', 'Hugh', 'Mabel', 'Walter',
                         'Joan', 'Roger', 'Eleanor', 'Ralph', 'Matilda'],
            lastNames: ['Smith', 'Brown', 'Wilson', 'Taylor', 'Davies', 'Evans', 'Thomas', 'Roberts',
                        'Cooper', 'Fletcher', 'Baker', 'Miller', 'Potter', 'Turner', 'Carter', 'Walker',
                        'Wright', 'Clarke', 'Green', 'Hill', 'Thatcher', 'Fisher', 'Cook', 'Carpenter',
                        'Mason', 'Shepherd', 'Fowler', 'Hunter', 'Brewer', 'Weaver'],
            titles: ['Master', 'Madame', 'Sir', 'Lady', 'Old', 'Young', 'Goodman', 'Goodwife',
                     'Elder', 'Brother', 'Sister', 'Father', 'Mother', 'Uncle', 'Aunt', 'Captain'],
            shopTypes: ['Apothecary', 'Bookshop', 'Herbalist', 'Jeweler', 'Tailor', 'Cobbler',
                        'Candlemaker', 'Carpenter', 'Weaver', 'Potter', 'Armorer', 'Bowyer',
                        'Leatherworker', 'Alchemist', 'Scribe']
        };

        // Game constants
        const TILE_SIZE = 16;
        const CHUNK_SIZE = 16;
        const PLAYER_SIZE = 16;
        
        // Tile types
        window.TILES = {
            EMPTY: 0,
            WALL: 1,
            TREE: 2,
            WATER: 3,
            BUILDING: 4,
            ROAD: 5,
            DOOR: 6,
            BRIDGE: 7,
            GATE: 8
        };

        // World dimensions
        const worldWidth = 1024;  // 64 tiles
        const worldHeight = 1024; // 64 tiles

        // Camera configuration
        window.camera = {
            x: 0,
            y: 0,
            width: 256,
            height: 256
        };

        // Add zone types
        window.ZONES = {
            CITY: 'city',
            FOREST: 'forest',
            MOUNTAIN: 'mountain',
            PLAINS: 'plains',
            LAKE: 'lake',
            DESERT: 'desert',
            HILLS: 'hills'
        };

        // Zone management
        window.zoneMap = new Map();

        // Generate a new random seed on page load
        window.worldSeed = Math.floor(Math.random() * 1000000);

        // Add city zone types
        window.CITY_TYPES = {
            CAPITAL: 'capital',    // Larger, more organized city
            TOWN: 'town',         // Medium-sized settlement
            VILLAGE: 'village',   // Small, sparse settlement
            OUTPOST: 'outpost'    // Tiny frontier settlement
        };

        // Add zone biome types for more variety
        window.ZONE_BIOMES = {
            PLAINS: 'plains',
            FOREST: 'forest',
            MOUNTAIN: 'mountain',
            LAKE: 'lake',
            DESERT: 'desert',
            HILLS: 'hills'
        };

        // Modified seededRandom to use worldSeed
        function seededRandom(seed) {
            const combinedSeed = worldSeed + seed;
            const x = Math.sin(combinedSeed) * 10000;
            return x - Math.floor(x);
        }

        // Add a Set to track zones being processed
        const processingZones = new Set();

        // Modify getZoneInfo to use the new seeding system
        window.getZoneInfo = function(zoneX, zoneY) {
            const key = `${zoneX},${zoneY}`;
            
            if (!zoneMap.has(key)) {
                const seed = zoneX * 10000 + zoneY;
                const random = () => seededRandom(seed);
                
                // Use multiple noise functions with world seed influence
                const elevation = Math.sin((zoneX + worldSeed * 0.1) * 0.3) * Math.cos((zoneY + worldSeed * 0.1) * 0.3) +
                                 Math.sin((zoneX + worldSeed * 0.2) * 0.7) * Math.cos((zoneY + worldSeed * 0.2) * 0.5) * 0.5;
                const moisture = Math.cos((zoneX + worldSeed * 0.3) * 0.4) * Math.cos((zoneY + worldSeed * 0.3) * 0.4) +
                                Math.sin((zoneX + zoneY + worldSeed * 0.4) * 0.6) * 0.5;
                
                // Increase city generation chance
                const cityScore = (Math.abs(elevation) + Math.abs(moisture)) / 2;
                let zoneType;
                let cityType = null;
                
                // Make cities more common in suitable terrain
                if (cityScore < 0.3 && random() < 0.6) { // Increased chance from 0.4 to 0.6
                    zoneType = ZONES.CITY;
                    // Determine city type based on location and random factors
                    const sizeFactor = random();
                    if (sizeFactor > 0.8) {
                        cityType = CITY_TYPES.CAPITAL;
                    } else if (sizeFactor > 0.6) {
                        cityType = CITY_TYPES.TOWN;
                    } else if (sizeFactor > 0.3) {
                        cityType = CITY_TYPES.VILLAGE;
                    } else {
                        cityType = CITY_TYPES.OUTPOST;
                    }
                } else {
                    // Determine other zone types based on elevation and moisture
                    if (elevation > 0.6) {
                        zoneType = ZONES.MOUNTAIN;
                    } else if (elevation > 0.2 && moisture > 0) {
                        zoneType = ZONES.HILLS;
                    } else if (moisture > 0.4) {
                        zoneType = ZONES.FOREST;
                    } else if (moisture < -0.4) {
                        zoneType = ZONES.DESERT;
                    } else {
                        zoneType = ZONES.PLAINS;
                    }
                }

                // Ensure starting area (near origin) has a city
                if (Math.abs(zoneX) <= 1 && Math.abs(zoneY) <= 1 && !cityType) {
                    zoneType = ZONES.CITY;
                    cityType = CITY_TYPES.TOWN;
                }

                const zoneInfo = {
                    type: zoneType,
                    biome: zoneType === ZONES.CITY ? ZONE_BIOMES.PLAINS : zoneType,
                    seed: random(),
                    cityType: cityType,
                    rotation: Math.floor(random() * 4) * 90,
                    pattern: Math.floor(random() * 4),
                    elevation: elevation,
                    moisture: moisture,
                    roadDensity: 0.3 + random() * 0.4,    // Increased road density
                    buildingDensity: 0.5 + random() * 0.3, // Increased building density
                    hasWalls: random() < 0.3 && cityType !== CITY_TYPES.OUTPOST,
                    mainRoadWidth: cityType === CITY_TYPES.CAPITAL ? 3 :
                                  cityType === CITY_TYPES.TOWN ? 2 : 1,
                    hasRiver: random() < 0.2,
                    hasBridge: random() < 0.5,
                    hasMarket: cityType === CITY_TYPES.CAPITAL || random() < 0.3
                };

                zoneMap.set(key, zoneInfo);
            }

            return zoneMap.get(key);
        };

        // Add to the top level constants
        window.usedBuildingNames = new Map(); // Map of zoneKey -> Set of used names