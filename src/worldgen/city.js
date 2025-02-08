window.buildingInfo = new Map();

window.BUILDING_TYPES = {
    HOUSE: 'house',
    SHOP: 'shop',
    INN: 'inn',
    BLACKSMITH: 'blacksmith',
    TAVERN: 'tavern'
};

const VALID_BUILDING_TYPES = new Set(Object.values(BUILDING_TYPES));

function debugBuildingType(type, context, isError = false) {
    if (!isError && !window.DEBUG) return;
    
    console.log(`[BUILDING TYPE DEBUG] ${context}:`);
    console.log(`- Type: "${type}"`);
    console.log(`- Valid: ${VALID_BUILDING_TYPES.has(type)}`);
    if (isError) console.trace();
}

function generateBuildingName(type, random) {
    // Name components
    const nameComponents = {
        firstNames: [
            'John', 'Mary', 'William', 'Elizabeth', 'James', 'Sarah', 'Thomas', 'Margaret', 'George', 'Anne',
            'Richard', 'Emma', 'Henry', 'Alice', 'Edward', 'Catherine', 'Robert', 'Jane', 'Charles', 'Eleanor',
            'Arthur', 'Isabella', 'David', 'Grace', 'Philip', 'Rose', 'Edmund', 'Beatrice', 'Hugh', 'Matilda'
        ],
        lastNames: [
            'Smith', 'Brown', 'Miller', 'Taylor', 'Wilson', 'Clark', 'Walker', 'Wright', 'Baker', 'Carter',
            'Fletcher', 'Cooper', 'Mason', 'Fisher', 'Thatcher', 'Potter', 'Carpenter', 'Shepherd', 'Cook', 'Archer',
            'Weaver', 'Brewster', 'Chandler', 'Draper', 'Merchant', 'Forester', 'Gardener', 'Farmer', 'Hunter', 'Knight'
        ],
        adjectives: [
            'Golden', 'Silver', 'Rusty', 'Jolly', 'Merry', 'Sleepy', 'Hungry', 'Thirsty', 'Brave', 'Wise',
            'Ancient', 'Crimson', 'Emerald', 'Mystic', 'Prancing', 'Wandering', 'Dancing', 'Silent', 'Laughing', 'Wild',
            'Royal', 'Broken', 'Hidden', 'Twisted', 'Blessed', 'Cursed', 'Peaceful', 'Mighty', 'Gentle', 'Swift'
        ],
        nouns: [
            'Dragon', 'Lion', 'Eagle', 'Crown', 'Shield', 'Sword', 'Star', 'Moon', 'Sun', 'Rose',
            'Unicorn', 'Griffin', 'Phoenix', 'Stag', 'Raven', 'Wolf', 'Bear', 'Hawk', 'Serpent', 'Tiger',
            'Goblet', 'Chalice', 'Barrel', 'Anchor', 'Lantern', 'Hammer', 'Axe', 'Feather', 'Oak', 'Whale'
        ],
        shopTypes: [
            'General Store', 'Market', 'Emporium', 'Trading Post', 'Goods', 'Supplies', 'Wares', 'Shop',
            'Boutique', 'Merchants', 'Storehouse', 'Exchange', 'Marketplace', 'Depot', 'Provisions', 'Outfitters',
            'Bazaar', 'Trading House', 'Commerce', 'Mercantile', 'Establishment', 'Shoppe'
        ],
        innDescriptors: [
            'Inn', 'Tavern', 'Lodge', 'Rest', 'Haven', 'House', 'Retreat', 'Stop',
            'Alehouse', 'Pub', 'Hostel', 'Rooms', 'Lodging', 'Quarters', 'Arms', 'Respite',
            'Hearth', 'Roost', 'Shelter', 'Commons', 'Chamber', 'Dwelling'
        ]
    };

    // Helper function to get random array element
    const getRandomElement = (array) => array[Math.floor(random() * array.length)];

    // Convert type to lowercase for switch statement
    const lowerType = type.toLowerCase();
    
    switch(lowerType) {
        case 'shop':
            const shopkeeper = `${getRandomElement(nameComponents.firstNames)} ${getRandomElement(nameComponents.lastNames)}`;
            const shopType = getRandomElement(nameComponents.shopTypes);
            return `${shopkeeper}'s ${shopType}`;

        case 'inn':
            const adjective = getRandomElement(nameComponents.adjectives);
            const noun = getRandomElement(nameComponents.nouns);
            const innType = getRandomElement(nameComponents.innDescriptors);
            return `The ${adjective} ${noun} ${innType}`;

        case 'tavern':
            const tavernAdj = getRandomElement(nameComponents.adjectives);
            const tavernNoun = getRandomElement(nameComponents.nouns);
            return `The ${tavernAdj} ${tavernNoun}`;

        case 'blacksmith':
            const smithName = getRandomElement(nameComponents.lastNames);
            return `${smithName}'s Forge`;

        default: // HOUSE
            const firstName = getRandomElement(nameComponents.firstNames);
            const lastName = getRandomElement(nameComponents.lastNames);
            return `${firstName} ${lastName}'s House`;
    }
}

function placeBuilding(chunk, x, y, type, random, chunkX, chunkY, cityType) {
    debugLog(`Attempting to place building at chunk(${chunkX},${chunkY}) local(${x},${y})`);
    
    // Validate building type
    if (!Object.values(BUILDING_TYPES).includes(type)) {
        console.error(`Invalid building type: "${type}" at chunk(${chunkX},${chunkY}) pos(${x},${y})`);
        return false;
    }

    // Fixed sizes for each building type
    let width, height;
    switch(type) {
        case BUILDING_TYPES.INN:
            width = height = 5;
            break;
        case BUILDING_TYPES.TAVERN:
            width = height = 4;
            break;
        case BUILDING_TYPES.BLACKSMITH:
            width = 4;
            height = 3;
            break;
        case BUILDING_TYPES.SHOP:
            width = height = 4;
            break;
        case BUILDING_TYPES.HOUSE:
            width = height = 3;
            break;
        default:
            console.error(`Unhandled building type: ${type}`);
            return false;
    }

    // Check if there's enough space for building AND path
    for (let dy = 0; dy < height + 1; dy++) {  // +1 for path
        for (let dx = 0; dx < width; dx++) {
            if (y + dy >= CHUNK_SIZE || x + dx >= CHUNK_SIZE) return false;
            if (chunk[y + dy][x + dx] !== TILES.EMPTY) return false;
        }
    }

    // Calculate world coordinates for building info
    const worldOriginX = chunkX * CHUNK_SIZE + x;
    const worldOriginY = chunkY * CHUNK_SIZE + y;

    // Generate building name
    const buildingName = generateBuildingName(type, random);

    // Place door at the center bottom of the building
    const doorX = x + Math.floor(width / 2);
    const doorY = y + height - 1;

    // Place all building tiles
    for (let dy = 0; dy < height; dy++) {
        for (let dx = 0; dx < width; dx++) {
            const tileX = x + dx;
            const tileY = y + dy;
            
            const worldX = chunkX * CHUNK_SIZE + tileX;
            const worldY = chunkY * CHUNK_SIZE + tileY;
            const buildingKey = `${worldX},${worldY}`;
            
            // Determine if this tile is the door position
            const isDoor = (tileX === doorX && tileY === doorY);
            
            const buildingData = {
                type: type,
                name: buildingName,
                width: width,
                height: height,
                originX: worldOriginX,
                originY: worldOriginY,
                relX: dx,
                relY: dy,
                worldX: worldX,
                worldY: worldY,
                tileId: TILES.BUILDING,
                isDoor: isDoor,
                doorX: doorX - x,
                doorY: doorY - y
            };
            
            // Always set the tile type to BUILDING
            chunk[tileY][tileX] = TILES.BUILDING;
            window.buildingInfo.set(buildingKey, new Building(buildingData));
        }
    }

    // Add path from door to nearest road
    let pathY = doorY + 1;  // Start path one tile below door
    while (pathY < CHUNK_SIZE - 1 && 
           chunk[pathY][doorX] !== TILES.ROAD && 
           chunk[pathY][doorX] !== TILES.PATH) {
        if (chunk[pathY][doorX] === TILES.EMPTY) {
            chunk[pathY][doorX] = TILES.PATH;
        }
        pathY++;
    }

    return true;
}

window.generateCityChunk = function(chunk, chunkX, chunkY, zone) {
    window.currentChunkNames.clear();
    let seed = zone.seed + chunkX * 10000 + chunkY;
    
    const random = () => {
        seed++;
        return seededRandom(seed);
    };

    // Initialize empty chunk
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            chunk[y][x] = TILES.EMPTY;
        }
    }

    // Add roads first
    const mid = Math.floor(CHUNK_SIZE / 2);
    const roadWidth = zone.mainRoadWidth || 1;
    
    // Place main roads
    for (let i = -roadWidth; i <= roadWidth; i++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            if (mid + i >= 0 && mid + i < CHUNK_SIZE) {
                chunk[mid + i][x] = TILES.ROAD;
            }
        }
        for (let y = 0; y < CHUNK_SIZE; y++) {
            if (mid + i >= 0 && mid + i < CHUNK_SIZE) {
                chunk[y][mid + i] = TILES.ROAD;
            }
        }
    }

    // Define building areas (quadrants)
    const roadBuffer = 2;  // Space to leave around roads
    const quadrants = [
        // Top Left
        { startX: 2, endX: mid - roadBuffer, startY: 2, endY: mid - roadBuffer },
        // Top Right
        { startX: mid + roadBuffer, endX: CHUNK_SIZE - 3, startY: 2, endY: mid - roadBuffer },
        // Bottom Left
        { startX: 2, endX: mid - roadBuffer, startY: mid + roadBuffer, endY: CHUNK_SIZE - 3 },
        // Bottom Right
        { startX: mid + roadBuffer, endX: CHUNK_SIZE - 3, startY: mid + roadBuffer, endY: CHUNK_SIZE - 3 }
    ];

    // Try to place buildings in each quadrant
    quadrants.forEach((quad) => {
        const attempts = Math.floor((quad.endX - quad.startX) * (quad.endY - quad.startY) * zone.buildingDensity);
        
        for (let i = 0; i < attempts; i++) {
            const x = quad.startX + Math.floor(random() * (quad.endX - quad.startX));
            const y = quad.startY + Math.floor(random() * (quad.endY - quad.startY));
            
            if (random() < zone.buildingDensity) {
                const type = selectBuildingType(random);
                placeBuilding(chunk, x, y, type, random, chunkX, chunkY, zone.cityType);
            }
        }
    });

    // Add verification to catch any stray building tiles
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            if (chunk[y][x] === TILES.BUILDING) {
                const worldX = chunkX * CHUNK_SIZE + x;
                const worldY = chunkY * CHUNK_SIZE + y;
                const buildingKey = `${worldX},${worldY}`;
                const info = window.buildingInfo.get(buildingKey);
                
                if (!info) {
                    console.error(`Found building tile without info at chunk(${chunkX},${chunkY}) pos(${x},${y})`);
                    chunk[y][x] = TILES.EMPTY;  // Clear invalid building tiles
                }
            }
        }
    }

    return chunk;
};

function selectBuildingType(random) {
    // Define building type probabilities based on city type
    const buildingTypes = [
        BUILDING_TYPES.HOUSE,    // More common
        BUILDING_TYPES.HOUSE,
        BUILDING_TYPES.HOUSE,
        BUILDING_TYPES.SHOP,
        BUILDING_TYPES.TAVERN,
        BUILDING_TYPES.BLACKSMITH,
        BUILDING_TYPES.INN
    ];
    
    return buildingTypes[Math.floor(random() * buildingTypes.length)];
}

