# Legacy - A Roguelike Adventure Game

## Game Overview
Legacy is a roguelike adventure game where you explore a procedurally generated world, discover locations, and build your family's legacy through generations of advancement and discovery.

**Note: This is intentionally designed as a non-combat game, focusing instead on exploration, discovery, and generational progress.**

## Core Game Systems

### World Generation
```pseudo
CHUNK_SIZE = 16 tiles
ZONE_SIZE = 4 chunks

For each zone (x, y):
    1. Generate zone type (WILDERNESS, MOUNTAINS, etc.)
    2. For each chunk in zone:
        - Generate terrain based on zone type
        - Place natural formations (caves, peaks, etc.)
        - Add resources based on biome
        - Place wildlife and natural hazards
```

### Generational Progress System
```pseudo
Technology Tiers:
    Generation 1 (Stone Age):
        - Start in cave
        - Only natural resources available
        - Basic tool discovery (sticks, stones)
        - No buildings or structures
    
    Generation 2 (Early Settlement):
        - Start in basic hut
        - Access to previous generation's discoveries
        - Basic crafting unlocked
        - Simple structures possible
    
    Generation 3+ (Advancing Civilization):
        - Inherit all previous knowledge
        - New building types unlock
        - Advanced crafting and tools
        - Expanding settlement capabilities

Knowledge Transfer:
    - Discoveries in current life become starting knowledge for next generation
    - Each generation builds upon previous discoveries
    - Technology tree expands based on combined family knowledge
```

### Health & Aging System
```pseudo
Health follows human life pattern:
    Age 0-16:
        - Growing phase
        - Health increases gradually
        - Limited stamina
        - Learning bonus
    
    Age 17-25:
        - Peak physical condition
        - Maximum health and stamina
        - Full movement capabilities
    
    Age 26-50:
        - Gradual decline in physical stats
        - Experience bonus
        - Wisdom increases
    
    Age 51+:
        - Accelerated health decline
        - Reduced stamina
        - Maximum wisdom
        - Teaching bonus for next generation

Environmental Effects:
    - Temperature affects health
    - Nutrition impacts recovery
    - Rest required for healing
    - Injuries have lasting effects
```

### Player Movement & Interaction
```pseudo
On each frame:
    1. Handle input (arrow keys/WASD)
    2. Apply realistic physics:
        - Momentum and inertia
        - Terrain effects on movement
        - Stamina impact
        - Age-based limitations
    3. Check collision with environment
    4. Update sprite animation based on movement
    5. Check for special interactions:
        - Resource gathering
        - Tool usage
        - Discovery opportunities
        - Knowledge sharing
```

### Biome System
```pseudo
Biome Types:
    - Forest (temperate, tropical, taiga)
    - Mountains (peaks, caves, valleys)
    - Plains (grassland, savanna)
    - Desert (sandy, rocky)
    - Wetlands (swamp, marsh)
    - Coastal (beach, cliffs)

Each biome contains:
    - Unique resources
    - Specific challenges
    - Local wildlife
    - Weather patterns
    - Natural shelters
```

### Building System
```pseudo
Building Types:
    - HOUSE: Basic residential building with furniture
    - SHOP: Contains counters and items for sale
    - TAVERN: Large space with tables and chairs
    - BLACKSMITH: Has forge and anvil
    - INN: Multiple rooms with beds

When entering building:
    1. Store player's world position
    2. Generate interior layout based on building type
    3. Position player at entrance
    4. Center camera on room
    5. Switch to interior rendering mode
```

### Camera System
```pseudo
Camera follows player with these rules:
    - In world: Center on player with smooth movement
    - In buildings: Center on room
    - Maintain boundaries at world edges
    - Handle transitions when entering/exiting buildings
```

### Experience & Progression
```pseudo
Player gains experience from:
    - Discovering new zones
    - Entering buildings first time
    - Climbing peaks
    - Completing special actions

Level up system:
    - Each level requires more XP
    - Health increases with level
    - New abilities unlock at certain levels
```

### Interior System
```pseudo
Interior layouts consist of:
    - Tiles: Floor, Walls, Exit, Counters
    - Items: Furniture, Decorations
    - NPCs: Shopkeepers, Residents

Rendering order:
    1. Draw floor tiles with textures
    2. Draw walls and fixed elements
    3. Draw furniture and items
    4. Draw NPCs
    5. Draw player with shadow
```

### Message System
```pseudo
Message types:
    - INFO: General information (blue)
    - DISCOVERY: New findings (green)
    - WARNING: Caution needed (yellow)
    - DANGER: Immediate threats (red)

Message handling:
    1. Check for duplicate messages (within 1 second)
    2. Add new messages to queue
    3. Display current message with fade in/out
    4. Show message type and text
```

### Building Generation
```pseudo
For each building:
    1. Determine size based on type
    2. Generate basic layout (walls, floor, exit)
    3. Add type-specific features:
        - HOUSE: Beds, tables, chests
        - SHOP: Counters, display items
        - TAVERN: Tables, chairs, barrels
        - BLACKSMITH: Forge, anvil, storage
        - INN: Multiple beds, common area
    4. Add random decorative elements
    5. Place NPCs if needed
```

## Technical Details

### Tile System
- Each tile is 16x16 pixels
- World is divided into chunks (16x16 tiles)
- Zones are 4x4 chunks
- Buildings occupy multiple tiles (typically 3x3)

### Rendering Layers
1. Background terrain
2. Ground items/decorations
3. Buildings and structures
4. NPCs and interactive elements
5. Player character
6. UI elements (messages, stats)

### State Management
```pseudo
Global state includes:
    - Player position, stats, inventory
    - Discovered zones and buildings
    - Current interior state if in building
    - Active messages and notifications
    - Camera position and boundaries
```

## Development Notes
- Use `TILE_SIZE` constant for all position calculations
- Handle edge cases in collision detection
- Maintain consistent coordinate systems (world vs screen)
- Consider performance with chunk loading/unloading
- Keep building interiors separate from world state

## Future Enhancements
- [ ] Enhance graphics and visual effects
    - Dynamic lighting system
    - Day/night cycle effects
    - Weather particle systems
    - Improved sprite animations
    - Smooth tile transitions
    - Environmental ambiance
    - Character customization
    - Realistic shadows
    - Particle effects for actions
    - Visual aging for characters
- [ ] Implement realistic physics engine
    - Gravity and momentum
    - Material properties
    - Weather effects
    - Natural disasters
- [ ] Expand biome system
    - More diverse environments
    - Realistic resource distribution
    - Climate effects
    - Seasonal changes
- [ ] Develop technology tree
    - Hidden progression system
    - Natural discovery process
    - Generational knowledge transfer
    - Historical record keeping
- [ ] Enhanced survival mechanics
    - Realistic health system
    - Aging effects
    - Environmental impacts
    - Injury and recovery
- [ ] Improve world evolution
    - Dynamic environment changes
    - Long-term world effects
    - Civilization development
    - Historical landmarks
- [ ] Add crafting system
    - Resource gathering
    - Tool creation
    - Building construction
    - Knowledge sharing
- [ ] Implement family system
    - Genetic traits
    - Skill inheritance
    - Family traditions
    - Legacy achievements
- [ ] Create social system
    - NPC relationships
    - Knowledge trading
    - Community building
    - Cultural development 