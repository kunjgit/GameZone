// Medieval RPG - Complete Game with Keyboard Combat and Swords
class MedievalRPG {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.gameWidth = this.canvas.width;
        this.gameHeight = this.canvas.height;

        // Game state
        this.gameRunning = true;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.inCombat = false;
        this.combatCooldown = 0;

        // Player object
        this.player = {
            x: 400,
            y: 300,
            width: 32,
            height: 32,
            speed: 180,
            level: 1,
            experience: 0,
            experienceToNext: 100,
            hp: 100,
            maxHp: 100,
            gold: 50,
            score: 0,
            inventory: [],
            maxInventory: 20,
            equipment: {
                weapon: null,
                armor: null,
                accessory: null,
            },
            stats: {
                strength: 10,
                defense: 5,
                agility: 8,
                magic: 5,
            },
            isAttacking: false,
            attackCooldown: 0,
            lastAttackTime: 0,
            attackAnimation: {
                active: false,
                duration: 0,
                type: "normal", // 'normal', 'special', 'critical'
                particles: [],
            },
        };

        // Quests tracking
        this.quests = {
            swordFound: false,
            treasuresCollected: 0,
            monstersDefeated: 0,
            completedQuests: [],
            availableQuests: [
                {
                    id: "sword_quest",
                    title: "🗡️ Find the Lost Sword",
                    description:
                        "Search the ancient ruins for the legendary blade",
                    requirement: "swordFound",
                    target: 1,
                    completed: false,
                    reward: { gold: 200, xp: 100, item: "Health Potion" },
                },
                {
                    id: "treasure_quest",
                    title: "💰 Treasure Hunter",
                    description: "Collect 10 treasures",
                    requirement: "treasuresCollected",
                    target: 10,
                    completed: false,
                    reward: { gold: 500, xp: 250, item: "Magic Ring" },
                },
                {
                    id: "monster_quest",
                    title: "⚔️ Monster Slayer",
                    description: "Defeat 5 monsters",
                    requirement: "monstersDefeated",
                    target: 5,
                    completed: false,
                    reward: { gold: 300, xp: 150, item: "Iron Armor" },
                },
            ],
        };

        // Current map and map system
        this.currentMap = 0;
        this.maps = [
            {
                name: "Village Outskirts",
                width: 1600,
                height: 1200,
                theme: "grass",
                emoji: "🏘️",
                difficulty: 1,
                description:
                    "The peaceful village outskirts where your adventure begins",
                rewards: "Basic equipment and starting resources",
            },
            {
                name: "Dark Forest",
                width: 2000,
                height: 1600,
                theme: "forest",
                emoji: "🌲",
                difficulty: 2,
                description:
                    "A mysterious forest filled with dangerous creatures",
                rewards: "Enhanced weapons and forest treasures",
            },
            {
                name: "Ancient Ruins",
                width: 1800,
                height: 1400,
                theme: "ruins",
                emoji: "🏛️",
                difficulty: 3,
                description: "Crumbling ruins that hold ancient secrets",
                rewards: "Rare artifacts and enchanted items",
            },
            {
                name: "Dragon's Lair",
                width: 2400,
                height: 1800,
                theme: "cave",
                emoji: "🐉",
                difficulty: 5,
                description: "The final challenge - face the ancient dragon",
                rewards: "Legendary equipment and ultimate glory",
            },
        ];

        // Animation particles system
        this.particles = [];
        this.damageNumbers = [];

        // Input handling
        this.keys = {};
        this.setupInput();

        // Game objects
        this.treasures = [];
        this.enemies = [];
        this.npcs = [];
        this.swords = [];
        this.items = [];

        // Game map
        this.map = {
            width: this.maps[this.currentMap].width,
            height: this.maps[this.currentMap].height,
            tiles: [],
        };

        // Map portals for travel
        this.portals = [];

        // Camera
        this.camera = {
            x: 0,
            y: 0,
        };

        // Initialize game
        this.initializeGame();
        this.gameLoop();
    }

    setupInput() {
        document.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Combat controls
            if (e.key.toLowerCase() === "tab") {
                e.preventDefault();
                this.performAttack();
            }
            if (e.key.toLowerCase() === "f") {
                this.useSpecialAttack();
            }
            if (e.key.toLowerCase() === "q") {
                this.usePotion();
            }
            if (e.key === " ") {
                this.handleInteraction();
            }
            if (e.key.toLowerCase() === "m") {
                this.showMapSelection();
            }
        });

        document.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    initializeGame() {
        // Generate map
        this.generateMap();

        // Create swords (special items)
        this.createSwords();

        // Create treasures
        this.createTreasures();

        // Create enemies
        this.createEnemies();

        // Create NPCs
        this.createNPCs();

        // Create items and potions
        this.createItems();

        // Create portals between maps
        this.createPortals();

        // Give player starting equipment
        this.giveStartingEquipment();

        // Initialize inventory UI
        this.updateInventoryUI();
        this.updateUI();

        // Welcome message
        this.showMessage(
            "🏰 Welcome to Kingdom Quest! Find swords, defeat monsters, and collect treasures!",
            "success"
        );
        this.showMessage(
            "⚔️ Press TAB to attack enemies, F for special attacks, Q to use potions",
            "info"
        );
    }

    giveStartingEquipment() {
        // Give player a basic sword to start
        const basicSword = {
            name: "Rusty Sword",
            icon: "🗡️",
            type: "weapon",
            damage: 15,
            special: "Quick Strike",
            value: 25,
            rarity: "common",
        };

        this.addToInventory(basicSword);
        this.player.equipment.weapon = basicSword;
        this.showMessage(
            "🗡️ You start with a Rusty Sword! Press TAB to attack enemies.",
            "success"
        );
    }

    generateMap() {
        const currentMapData = this.maps[this.currentMap];
        const tileSize = 32;
        const cols = Math.ceil(currentMapData.width / tileSize);
        const rows = Math.ceil(currentMapData.height / tileSize);

        this.map.width = currentMapData.width;
        this.map.height = currentMapData.height;
        this.map.tiles = [];

        for (let y = 0; y < rows; y++) {
            this.map.tiles[y] = [];
            for (let x = 0; x < cols; x++) {
                let tile = this.getMapThemeTile(currentMapData.theme);
                this.map.tiles[y][x] = tile;
            }
        }
    }

    getMapThemeTile(theme) {
        const random = Math.random();

        switch (theme) {
            case "grass":
                if (random < 0.1) return "stone";
                else if (random < 0.15) return "tree";
                else if (random < 0.18) return "water";
                return "grass";

            case "forest":
                if (random < 0.4) return "tree";
                else if (random < 0.5) return "dark_tree";
                else if (random < 0.6) return "stone";
                return "grass";

            case "ruins":
                if (random < 0.3) return "stone";
                else if (random < 0.4) return "ruins_wall";
                else if (random < 0.5) return "ruins_floor";
                return "grass";

            case "cave":
                if (random < 0.5) return "cave_wall";
                else if (random < 0.6) return "cave_floor";
                else if (random < 0.7) return "lava";
                return "stone";

            default:
                return "grass";
        }
    }

    createPortals() {
        this.portals = [];

        // Only create portals if not on the last map
        if (this.currentMap < this.maps.length - 1) {
            // Portal to next map
            this.portals.push({
                x: this.map.width - 100,
                y: this.map.height / 2,
                width: 40,
                height: 40,
                targetMap: this.currentMap + 1,
                icon: "🌀",
                name: `Portal to ${this.maps[this.currentMap + 1].name}`,
            });
        }

        // Portal to previous map (if not on first map)
        if (this.currentMap > 0) {
            this.portals.push({
                x: 50,
                y: this.map.height / 2,
                width: 40,
                height: 40,
                targetMap: this.currentMap - 1,
                icon: "🌀",
                name: `Portal to ${this.maps[this.currentMap - 1].name}`,
            });
        }
    }

    createSwords() {
        const swordTypes = [
            {
                name: "Iron Sword",
                icon: "⚔️",
                damage: 25,
                special: "Power Strike",
                value: 100,
                rarity: "uncommon",
                points: 500,
            },
            {
                name: "Silver Blade",
                icon: "🗡️",
                damage: 35,
                special: "Lightning Cut",
                value: 200,
                rarity: "rare",
                points: 800,
            },
            {
                name: "Enchanted Sword",
                icon: "✨",
                damage: 50,
                special: "Magic Slash",
                value: 350,
                rarity: "epic",
                points: 1200,
            },
            {
                name: "Dragon Slayer",
                icon: "🐲",
                damage: 75,
                special: "Dragon's Wrath",
                value: 500,
                rarity: "legendary",
                points: 2000,
            },
            {
                name: "Excalibur",
                icon: "👑",
                damage: 100,
                special: "Divine Strike",
                value: 1000,
                rarity: "mythic",
                points: 5000,
            },
        ];

        // Place swords strategically around the map
        swordTypes.forEach((swordType, index) => {
            const sword = {
                x: 200 + index * 300 + Math.random() * 200,
                y: 200 + index * 200 + Math.random() * 200,
                width: 24,
                height: 24,
                type: swordType,
                collected: false,
                glowing: true,
            };
            this.swords.push(sword);
        });
    }

    createTreasures() {
        const treasureTypes = [
            {
                name: "Gold Coin",
                icon: "🪙",
                value: 10,
                rarity: "common",
                points: 50,
            },
            {
                name: "Silver Chalice",
                icon: "🏆",
                value: 50,
                rarity: "uncommon",
                points: 200,
            },
            {
                name: "Ancient Scroll",
                icon: "📜",
                value: 75,
                rarity: "rare",
                points: 300,
            },
            {
                name: "Magic Crystal",
                icon: "💎",
                value: 100,
                rarity: "epic",
                points: 500,
            },
            {
                name: "Dragon Egg",
                icon: "🥚",
                value: 200,
                rarity: "legendary",
                points: 1000,
            },
        ];

        // Place treasures randomly
        for (let i = 0; i < 40; i++) {
            const treasureType =
                treasureTypes[Math.floor(Math.random() * treasureTypes.length)];
            const treasure = {
                x: Math.random() * (this.map.width - 50) + 25,
                y: Math.random() * (this.map.height - 50) + 25,
                width: 20,
                height: 20,
                type: treasureType,
                collected: false,
            };
            this.treasures.push(treasure);
        }
    }

    createEnemies() {
        const enemyTypes = [
            {
                name: "Goblin",
                icon: "👹",
                hp: 30,
                maxHp: 30,
                damage: 8,
                xp: 25,
                gold: 15,
                speed: 50,
            },
            {
                name: "Orc Warrior",
                icon: "👺",
                hp: 50,
                maxHp: 50,
                damage: 12,
                xp: 40,
                gold: 25,
                speed: 40,
            },
            {
                name: "Skeleton",
                icon: "💀",
                hp: 35,
                maxHp: 35,
                damage: 10,
                xp: 30,
                gold: 20,
                speed: 45,
            },
            {
                name: "Dark Knight",
                icon: "🖤",
                hp: 80,
                maxHp: 80,
                damage: 18,
                xp: 60,
                gold: 50,
                speed: 35,
            },
        ];

        // Place enemies around the map
        for (let i = 0; i < 25; i++) {
            const enemyType =
                enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const enemy = {
                x: Math.random() * (this.map.width - 100) + 50,
                y: Math.random() * (this.map.height - 100) + 50,
                width: 32,
                height: 32,
                type: enemyType,
                hp: enemyType.hp,
                maxHp: enemyType.maxHp,
                isAlive: true,
                lastAttackTime: 0,
                moveDirection: Math.random() * Math.PI * 2,
                changeDirectionTime: 0,
            };
            this.enemies.push(enemy);
        }
    }

    createNPCs() {
        const npcTypes = [
            {
                name: "Village Merchant",
                icon: "🧙‍♂️",
                type: "shop",
                dialogue: "Welcome! I sell weapons, armor, and potions!",
            },
            {
                name: "Wise Elder",
                icon: "👴",
                type: "quest",
                dialogue: "Find the legendary swords to save our kingdom!",
            },
            {
                name: "Healer",
                icon: "🧙‍♀️",
                type: "healer",
                dialogue: "I can restore your health for gold.",
            },
        ];

        npcTypes.forEach((npcType, index) => {
            const npc = {
                x: 100 + index * 400,
                y: 100,
                width: 32,
                height: 32,
                type: npcType,
            };
            this.npcs.push(npc);
        });
    }

    createItems() {
        const itemTypes = [
            {
                name: "Health Potion",
                icon: "🧪",
                type: "potion",
                effect: "heal",
                value: 50,
                price: 30,
            },
            {
                name: "Iron Armor",
                icon: "🛡️",
                type: "armor",
                defense: 10,
                value: 80,
                price: 100,
            },
            {
                name: "Magic Ring",
                icon: "💍",
                type: "accessory",
                magic: 5,
                value: 120,
                price: 150,
            },
        ];

        // Place some items around the map
        for (let i = 0; i < 15; i++) {
            const itemType =
                itemTypes[Math.floor(Math.random() * itemTypes.length)];
            const item = {
                x: Math.random() * (this.map.width - 50) + 25,
                y: Math.random() * (this.map.height - 50) + 25,
                width: 20,
                height: 20,
                type: itemType,
                collected: false,
            };
            this.items.push(item);
        }
    }

    gameLoop(currentTime = 0) {
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (this.gameRunning) {
            this.update();
            this.render();
        }

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update() {
        // Update timers
        if (this.combatCooldown > 0) {
            this.combatCooldown -= this.deltaTime;
        }
        if (this.player.attackCooldown > 0) {
            this.player.attackCooldown -= this.deltaTime;
        }

        // Update attack animations
        this.updateAttackAnimations();

        // Update particles
        this.updateParticles();

        // Update damage numbers
        this.updateDamageNumbers();

        // Update player
        this.updatePlayer();

        // Update camera
        this.updateCamera();

        // Update enemies
        this.updateEnemies();

        // Check collisions
        this.checkCollisions();

        // Update combat status
        this.updateCombatStatus();

        // Check quest completion
        this.checkQuestCompletion();
    }

    updatePlayer() {
        let moveX = 0;
        let moveY = 0;

        // Handle movement input
        if (this.keys["w"] || this.keys["arrowup"]) moveY = -1;
        if (this.keys["s"] || this.keys["arrowdown"]) moveY = 1;
        if (this.keys["a"] || this.keys["arrowleft"]) moveX = -1;
        if (this.keys["d"] || this.keys["arrowright"]) moveX = 1;

        // Normalize diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
        }

        // Apply movement
        const newX = this.player.x + moveX * this.player.speed * this.deltaTime;
        const newY = this.player.y + moveY * this.player.speed * this.deltaTime;

        // Check bounds
        if (newX >= 0 && newX <= this.map.width - this.player.width) {
            this.player.x = newX;
        }
        if (newY >= 0 && newY <= this.map.height - this.player.height) {
            this.player.y = newY;
        }
    }

    updateCamera() {
        this.camera.x = this.player.x - this.gameWidth / 2;
        this.camera.y = this.player.y - this.gameHeight / 2;

        this.camera.x = Math.max(
            0,
            Math.min(this.camera.x, this.map.width - this.gameWidth)
        );
        this.camera.y = Math.max(
            0,
            Math.min(this.camera.y, this.map.height - this.gameHeight)
        );
    }

    updateEnemies() {
        this.enemies.forEach((enemy) => {
            if (!enemy.isAlive) return;

            // Simple AI: move randomly and attack player if nearby
            enemy.changeDirectionTime += this.deltaTime;
            if (enemy.changeDirectionTime > 2) {
                enemy.moveDirection = Math.random() * Math.PI * 2;
                enemy.changeDirectionTime = 0;
            }

            // Move enemy
            const moveX =
                Math.cos(enemy.moveDirection) *
                enemy.type.speed *
                this.deltaTime;
            const moveY =
                Math.sin(enemy.moveDirection) *
                enemy.type.speed *
                this.deltaTime;

            enemy.x += moveX;
            enemy.y += moveY;

            // Keep enemies in bounds
            enemy.x = Math.max(
                0,
                Math.min(enemy.x, this.map.width - enemy.width)
            );
            enemy.y = Math.max(
                0,
                Math.min(enemy.y, this.map.height - enemy.height)
            );

            // Check if enemy can attack player
            const distance = this.getDistance(this.player, enemy);
            if (distance < 50 && Date.now() - enemy.lastAttackTime > 2000) {
                this.enemyAttackPlayer(enemy);
                enemy.lastAttackTime = Date.now();
            }
        });
    }

    checkCollisions() {
        // Check sword collection
        this.swords.forEach((sword) => {
            if (!sword.collected && this.isColliding(this.player, sword)) {
                this.collectSword(sword);
            }
        });

        // Check treasure collection
        this.treasures.forEach((treasure) => {
            if (
                !treasure.collected &&
                this.isColliding(this.player, treasure)
            ) {
                this.collectTreasure(treasure);
            }
        });

        // Check item collection
        this.items.forEach((item) => {
            if (!item.collected && this.isColliding(this.player, item)) {
                this.collectItem(item);
            }
        });

        // Check portal interactions
        this.portals.forEach((portal) => {
            if (this.isColliding(this.player, portal)) {
                this.showPortalPrompt(portal);
            }
        });
    }

    updateAttackAnimations() {
        if (this.player.attackAnimation.active) {
            this.player.attackAnimation.duration -= this.deltaTime;

            if (this.player.attackAnimation.duration <= 0) {
                this.player.attackAnimation.active = false;
                this.player.attackAnimation.particles = [];
            } else {
                // Update attack particles
                this.player.attackAnimation.particles.forEach((particle) => {
                    particle.x += particle.vx * this.deltaTime;
                    particle.y += particle.vy * this.deltaTime;
                    particle.life -= this.deltaTime;
                    particle.alpha = particle.life / particle.maxLife;
                });

                // Remove dead particles
                this.player.attackAnimation.particles =
                    this.player.attackAnimation.particles.filter(
                        (p) => p.life > 0
                    );
            }
        }
    }

    updateParticles() {
        this.particles.forEach((particle) => {
            particle.x += particle.vx * this.deltaTime;
            particle.y += particle.vy * this.deltaTime;
            particle.life -= this.deltaTime;
            particle.alpha = particle.life / particle.maxLife;
        });

        this.particles = this.particles.filter((p) => p.life > 0);
    }

    updateDamageNumbers() {
        this.damageNumbers.forEach((dmg) => {
            dmg.y -= 50 * this.deltaTime;
            dmg.life -= this.deltaTime;
            dmg.alpha = dmg.life / dmg.maxLife;
        });

        this.damageNumbers = this.damageNumbers.filter((d) => d.life > 0);
    }

    checkQuestCompletion() {
        this.quests.availableQuests.forEach((quest) => {
            if (!quest.completed) {
                let progress = 0;

                switch (quest.requirement) {
                    case "swordFound":
                        progress = this.quests.swordFound ? 1 : 0;
                        break;
                    case "treasuresCollected":
                        progress = this.quests.treasuresCollected;
                        break;
                    case "monstersDefeated":
                        progress = this.quests.monstersDefeated;
                        break;
                }

                if (progress >= quest.target && !quest.completed) {
                    this.completeQuest(quest);
                }
            }
        });
    }

    completeQuest(quest) {
        quest.completed = true;
        this.quests.completedQuests.push(quest.id);

        // Give rewards
        this.player.gold += quest.reward.gold;
        this.addExperience(quest.reward.xp);

        // Add reward item to inventory
        if (quest.reward.item) {
            const rewardItem = this.createRewardItem(quest.reward.item);
            this.addToInventory(rewardItem);
        }

        this.showMessage(`🎉 Quest Completed: ${quest.title}!`, "success");
        this.showMessage(
            `💰 Received: ${quest.reward.gold} gold, ${quest.reward.xp} XP`,
            "success"
        );
        if (quest.reward.item) {
            this.showMessage(`📦 Received: ${quest.reward.item}!`, "success");
        }

        this.updateQuestUI();
        this.updateUI();
    }

    createRewardItem(itemName) {
        const rewardItems = {
            "Health Potion": {
                name: "Health Potion",
                icon: "🧪",
                type: "potion",
                effect: "heal",
                value: 50,
            },
            "Magic Ring": {
                name: "Magic Ring",
                icon: "💍",
                type: "accessory",
                magic: 10,
                value: 200,
            },
            "Iron Armor": {
                name: "Iron Armor",
                icon: "🛡️",
                type: "armor",
                defense: 15,
                value: 150,
            },
        };

        return rewardItems[itemName] || rewardItems["Health Potion"];
    }

    showPortalPrompt(portal) {
        if (!this.portalPromptShown) {
            this.showMessage(
                `🌀 Press SPACE to travel to ${portal.name}`,
                "info"
            );
            this.portalPromptShown = true;
            this.nearPortal = portal;

            setTimeout(() => {
                this.portalPromptShown = false;
            }, 3000);
        }
    }

    travelToMap(mapIndex) {
        if (mapIndex >= 0 && mapIndex < this.maps.length) {
            this.currentMap = mapIndex;

            // Reset map and objects
            this.map.width = this.maps[this.currentMap].width;
            this.map.height = this.maps[this.currentMap].height;

            // Regenerate everything for new map
            this.generateMap();
            this.createSwords();
            this.createTreasures();
            this.createEnemies();
            this.createNPCs();
            this.createItems();
            this.createPortals();

            // Reset player position
            this.player.x = 100;
            this.player.y = 100;

            // Update current map display
            const currentMapElement =
                document.getElementById("current-map-name");
            if (currentMapElement) {
                currentMapElement.textContent = this.maps[this.currentMap].name;
            }

            this.showMessage(
                `🗺️ Traveled to ${this.maps[this.currentMap].name}!`,
                "success"
            );
            this.showMessage(
                `📜 ${this.maps[this.currentMap].description}`,
                "info"
            );
        }
    }

    isColliding(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    }

    getDistance(obj1, obj2) {
        const dx = obj1.x + obj1.width / 2 - (obj2.x + obj2.width / 2);
        const dy = obj1.y + obj1.height / 2 - (obj2.y + obj2.height / 2);
        return Math.sqrt(dx * dx + dy * dy);
    }

    collectSword(sword) {
        sword.collected = true;

        const swordItem = {
            name: sword.type.name,
            icon: sword.type.icon,
            type: "weapon",
            damage: sword.type.damage,
            special: sword.type.special,
            value: sword.type.value,
            rarity: sword.type.rarity,
        };

        this.addToInventory(swordItem);
        this.player.score += sword.type.points;
        this.player.gold += sword.type.value;

        // Auto-equip if better than current weapon
        if (
            !this.player.equipment.weapon ||
            sword.type.damage > this.player.equipment.weapon.damage
        ) {
            this.player.equipment.weapon = swordItem;
            this.showMessage(`⚔️ Equipped ${sword.type.name}!`, "success");
        }

        // Update quest progress
        this.quests.swordFound = true;
        this.updateQuestUI();

        this.showMessage(
            `🗡️ Found ${sword.type.name}! +${sword.type.points} points`,
            "success"
        );
        this.updateUI();
        this.updateInventoryUI();
    }

    collectTreasure(treasure) {
        treasure.collected = true;

        const treasureItem = {
            name: treasure.type.name,
            icon: treasure.type.icon,
            type: "treasure",
            value: treasure.type.value,
            rarity: treasure.type.rarity,
        };

        this.addToInventory(treasureItem);
        this.player.gold += treasure.type.value;
        this.player.score += treasure.type.points;
        this.addExperience(treasure.type.points / 10);

        // Update quest progress
        this.quests.treasuresCollected++;
        this.updateQuestUI();

        this.showMessage(
            `💰 Found ${treasure.type.name}! +${treasure.type.points} points`,
            "success"
        );
        this.updateUI();
        this.updateInventoryUI();
    }

    collectItem(item) {
        item.collected = true;

        this.addToInventory({
            name: item.type.name,
            icon: item.type.icon,
            type: item.type.type,
            effect: item.type.effect,
            value: item.type.value,
            defense: item.type.defense,
            magic: item.type.magic,
        });

        this.showMessage(`📦 Found ${item.type.name}!`, "success");
        this.updateInventoryUI();
    }

    addToInventory(item) {
        if (this.player.inventory.length < this.player.maxInventory) {
            this.player.inventory.push(item);
            return true;
        } else {
            this.showMessage("❌ Inventory full!", "error");
            return false;
        }
    }

    performAttack() {
        if (this.player.attackCooldown > 0) return;

        // Find nearest enemy within attack range
        let nearestEnemy = null;
        let nearestDistance = Infinity;

        this.enemies.forEach((enemy) => {
            if (!enemy.isAlive) return;

            const distance = this.getDistance(this.player, enemy);
            if (distance < 60 && distance < nearestDistance) {
                nearestEnemy = enemy;
                nearestDistance = distance;
            }
        });

        if (nearestEnemy) {
            this.attackEnemy(nearestEnemy);
        } else {
            this.showMessage("⚔️ No enemies in range!", "warning");
        }
    }

    attackEnemy(enemy) {
        const weapon = this.player.equipment.weapon;
        const baseDamage = weapon ? weapon.damage : 10;
        const criticalChance = 0.2; // 20% critical hit chance
        const isCritical = Math.random() < criticalChance;
        const totalDamage = Math.floor(
            (baseDamage + this.player.stats.strength) * (isCritical ? 1.5 : 1)
        );

        enemy.hp -= totalDamage;
        this.player.attackCooldown = 1.0; // 1 second cooldown

        // Create attack animation
        this.createAttackAnimation(enemy, isCritical ? "critical" : "normal");

        // Create damage number
        this.createDamageNumber(enemy.x, enemy.y, totalDamage, isCritical);

        // Create hit particles
        this.createHitParticles(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2
        );

        const hitMessage = isCritical
            ? `💥 CRITICAL HIT! ${enemy.type.name} for ${totalDamage} damage!`
            : `⚔️ Hit ${enemy.type.name} for ${totalDamage} damage!`;

        this.showMessage(hitMessage, isCritical ? "warning" : "success");

        if (enemy.hp <= 0) {
            this.enemyDefeated(enemy);
        }

        this.updateCombatStatus();
    }

    createAttackAnimation(target, type) {
        this.player.attackAnimation.active = true;
        this.player.attackAnimation.duration = 0.5;
        this.player.attackAnimation.type = type;
        this.player.attackAnimation.particles = [];

        // Create attack particles based on weapon type
        const weapon = this.player.equipment.weapon;
        const particleCount = type === "critical" ? 15 : 8;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 100 + Math.random() * 50;

            this.player.attackAnimation.particles.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y + this.player.height / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.3,
                maxLife: 0.3,
                alpha: 1,
                color:
                    type === "critical"
                        ? "#ff4444"
                        : weapon?.icon === "🗡️"
                        ? "#ffd700"
                        : "#ffffff",
            });
        }
    }

    createDamageNumber(x, y, damage, isCritical) {
        this.damageNumbers.push({
            x: x + Math.random() * 20 - 10,
            y: y - 10,
            damage: damage,
            life: 2.0,
            maxLife: 2.0,
            alpha: 1,
            isCritical: isCritical,
        });
    }

    createHitParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 100;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.5,
                maxLife: 0.5,
                alpha: 1,
                color: "#ff6b6b",
            });
        }
    }

    useSpecialAttack() {
        const weapon = this.player.equipment.weapon;
        if (!weapon || !weapon.special) {
            this.showMessage("❌ No special attack available!", "error");
            return;
        }

        if (this.player.attackCooldown > 0) return;

        // Find all enemies in range for special attack
        const enemiesInRange = this.enemies.filter(
            (enemy) =>
                enemy.isAlive && this.getDistance(this.player, enemy) < 80
        );

        if (enemiesInRange.length === 0) {
            this.showMessage(
                "⚔️ No enemies in range for special attack!",
                "warning"
            );
            return;
        }

        const specialDamage = weapon.damage * 1.5 + this.player.stats.strength;

        enemiesInRange.forEach((enemy) => {
            enemy.hp -= specialDamage;
            if (enemy.hp <= 0) {
                this.enemyDefeated(enemy);
            }
        });

        this.player.attackCooldown = 3.0; // Longer cooldown for special
        this.showMessage(
            `✨ ${weapon.special}! Hit ${enemiesInRange.length} enemies!`,
            "success"
        );
    }

    usePotion() {
        const potion = this.player.inventory.find(
            (item) => item.type === "potion" && item.effect === "heal"
        );

        if (!potion) {
            this.showMessage("❌ No healing potions available!", "error");
            return;
        }

        if (this.player.hp >= this.player.maxHp) {
            this.showMessage("❌ Already at full health!", "warning");
            return;
        }

        // Remove potion from inventory
        const index = this.player.inventory.indexOf(potion);
        this.player.inventory.splice(index, 1);

        // Heal player
        this.player.hp = Math.min(
            this.player.maxHp,
            this.player.hp + potion.value
        );

        this.showMessage(
            `🧪 Used ${potion.name}! Restored ${potion.value} HP`,
            "success"
        );
        this.updateUI();
        this.updateInventoryUI();
    }

    enemyAttackPlayer(enemy) {
        const damage = Math.max(
            1,
            enemy.type.damage - this.player.stats.defense
        );
        this.player.hp -= damage;

        this.showMessage(
            `💥 ${enemy.type.name} attacks for ${damage} damage!`,
            "error"
        );

        if (this.player.hp <= 0) {
            this.gameOver();
        }

        this.updateUI();
    }

    enemyDefeated(enemy) {
        enemy.isAlive = false;

        // Rewards
        this.player.gold += enemy.type.gold;
        this.player.score += enemy.type.xp * 10;
        this.addExperience(enemy.type.xp);

        // Update quest progress
        this.quests.monstersDefeated++;
        this.updateQuestUI();

        this.showMessage(
            `💀 Defeated ${enemy.type.name}! +${enemy.type.xp} XP, +${enemy.type.gold} gold`,
            "success"
        );
        this.updateUI();
    }

    addExperience(amount) {
        this.player.experience += amount;

        while (this.player.experience >= this.player.experienceToNext) {
            this.levelUp();
        }

        this.updateUI();
    }

    levelUp() {
        this.player.experience -= this.player.experienceToNext;
        this.player.level++;
        this.player.experienceToNext = Math.floor(
            this.player.experienceToNext * 1.2
        );

        // Increase stats
        this.player.maxHp += 20;
        this.player.hp = this.player.maxHp;
        this.player.stats.strength += 3;
        this.player.stats.defense += 2;
        this.player.stats.agility += 1;
        this.player.stats.magic += 1;

        this.showMessage(
            `🆙 Level Up! Now level ${this.player.level}!`,
            "success"
        );
        this.updateUI();
    }

    handleInteraction() {
        // Check for nearby NPCs
        this.npcs.forEach((npc) => {
            const distance = this.getDistance(this.player, npc);
            if (distance < 50) {
                this.interactWithNPC(npc);
                return;
            }
        });

        // Check for nearby portals
        if (this.nearPortal) {
            this.travelToMap(this.nearPortal.targetMap);
            this.nearPortal = null;
        }
    }

    interactWithNPC(npc) {
        if (npc.type.type === "shop") {
            this.showShopModal();
        } else if (npc.type.type === "healer") {
            this.healPlayer();
        } else {
            this.showMessage(npc.type.dialogue, "info");
        }
    }

    healPlayer() {
        const healCost = 30;
        if (
            this.player.gold >= healCost &&
            this.player.hp < this.player.maxHp
        ) {
            this.player.gold -= healCost;
            this.player.hp = this.player.maxHp;
            this.showMessage("✨ Fully healed! -30 gold", "success");
            this.updateUI();
        } else if (this.player.hp >= this.player.maxHp) {
            this.showMessage("❌ Already at full health!", "warning");
        } else {
            this.showMessage("❌ Not enough gold for healing!", "error");
        }
    }

    updateCombatStatus() {
        const nearbyEnemies = this.enemies.filter(
            (enemy) =>
                enemy.isAlive && this.getDistance(this.player, enemy) < 80
        ).length;

        const statusElement = document.getElementById("combat-status");
        if (nearbyEnemies > 0) {
            statusElement.textContent = `⚔️ ${nearbyEnemies} enemies nearby - Ready to fight!`;
            statusElement.style.color = "#ff6b6b";
        } else {
            statusElement.textContent = "✅ Safe area - No enemies nearby";
            statusElement.style.color = "#90ee90";
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = "#2d5a2d";
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        // Draw map
        this.drawMap();

        // Draw items
        this.drawItems();

        // Draw treasures
        this.drawTreasures();

        // Draw swords
        this.drawSwords();

        // Draw enemies
        this.drawEnemies();

        // Draw NPCs
        this.drawNPCs();

        // Draw player
        this.drawPlayer();

        // Draw UI overlays
        this.drawUIOverlays();
    }

    drawMap() {
        const tileSize = 32;
        const startX = Math.floor(this.camera.x / tileSize);
        const startY = Math.floor(this.camera.y / tileSize);
        const endX = Math.min(
            startX + Math.ceil(this.gameWidth / tileSize) + 1,
            this.map.tiles[0].length
        );
        const endY = Math.min(
            startY + Math.ceil(this.gameHeight / tileSize) + 1,
            this.map.tiles.length
        );

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tile = this.map.tiles[y][x];
                const screenX = x * tileSize - this.camera.x;
                const screenY = y * tileSize - this.camera.y;

                switch (tile) {
                    case "grass":
                        this.ctx.fillStyle = "#4a7c59";
                        break;
                    case "stone":
                        this.ctx.fillStyle = "#8b7355";
                        break;
                    case "tree":
                        this.ctx.fillStyle = "#2d4016";
                        break;
                    case "dark_tree":
                        this.ctx.fillStyle = "#1a2010";
                        break;
                    case "water":
                        this.ctx.fillStyle = "#4682b4";
                        break;
                    case "ruins_wall":
                        this.ctx.fillStyle = "#6b5b73";
                        break;
                    case "ruins_floor":
                        this.ctx.fillStyle = "#9b8b93";
                        break;
                    case "cave_wall":
                        this.ctx.fillStyle = "#3b3b3b";
                        break;
                    case "cave_floor":
                        this.ctx.fillStyle = "#5b5b5b";
                        break;
                    case "lava":
                        this.ctx.fillStyle = "#ff4500";
                        break;
                    default:
                        this.ctx.fillStyle = "#4a7c59";
                }

                this.ctx.fillRect(screenX, screenY, tileSize, tileSize);
            }
        }

        // Draw portals
        this.drawPortals();
    }

    drawSwords() {
        this.swords.forEach((sword) => {
            if (sword.collected) return;

            const screenX = sword.x - this.camera.x;
            const screenY = sword.y - this.camera.y;

            // Draw glowing effect
            if (sword.glowing) {
                this.ctx.shadowColor = "#ffd700";
                this.ctx.shadowBlur = 15;
            }

            this.ctx.font = "24px Arial";
            this.ctx.fillText(sword.type.icon, screenX, screenY + 20);

            this.ctx.shadowBlur = 0;

            // Draw sword name
            this.ctx.fillStyle = "#ffd700";
            this.ctx.font = "10px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText(sword.type.name, screenX + 12, screenY - 5);
            this.ctx.textAlign = "left";
        });
    }

    drawTreasures() {
        this.treasures.forEach((treasure) => {
            if (treasure.collected) return;

            const screenX = treasure.x - this.camera.x;
            const screenY = treasure.y - this.camera.y;

            this.ctx.font = "20px Arial";
            this.ctx.fillText(treasure.type.icon, screenX, screenY + 16);
        });
    }

    drawItems() {
        this.items.forEach((item) => {
            if (item.collected) return;

            const screenX = item.x - this.camera.x;
            const screenY = item.y - this.camera.y;

            this.ctx.font = "18px Arial";
            this.ctx.fillText(item.type.icon, screenX, screenY + 16);
        });
    }

    drawEnemies() {
        this.enemies.forEach((enemy) => {
            if (!enemy.isAlive) return;

            const screenX = enemy.x - this.camera.x;
            const screenY = enemy.y - this.camera.y;

            // Draw enemy
            this.ctx.font = "30px Arial";
            this.ctx.fillText(enemy.type.icon, screenX, screenY + 24);

            // Draw health bar
            const barWidth = 32;
            const barHeight = 4;
            const healthPercent = enemy.hp / enemy.maxHp;

            this.ctx.fillStyle = "#ff0000";
            this.ctx.fillRect(screenX, screenY - 8, barWidth, barHeight);
            this.ctx.fillStyle = "#00ff00";
            this.ctx.fillRect(
                screenX,
                screenY - 8,
                barWidth * healthPercent,
                barHeight
            );

            // Draw enemy name
            this.ctx.fillStyle = "#ff6b6b";
            this.ctx.font = "10px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText(enemy.type.name, screenX + 16, screenY - 12);
            this.ctx.textAlign = "left";
        });
    }

    drawNPCs() {
        this.npcs.forEach((npc) => {
            const screenX = npc.x - this.camera.x;
            const screenY = npc.y - this.camera.y;

            this.ctx.font = "30px Arial";
            this.ctx.fillText(npc.type.icon, screenX, screenY + 24);

            // Draw NPC name
            this.ctx.fillStyle = "#90ee90";
            this.ctx.font = "10px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText(npc.type.name, screenX + 16, screenY - 5);
            this.ctx.textAlign = "left";
        });
    }

    drawPlayer() {
        const screenX = this.player.x - this.camera.x;
        const screenY = this.player.y - this.camera.y;

        // Draw attack effect if attacking
        if (this.player.attackCooldown > 0.5) {
            this.ctx.strokeStyle = "#ffd700";
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(screenX + 16, screenY + 16, 40, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Draw player
        this.ctx.font = "30px Arial";
        this.ctx.fillText("🤴", screenX, screenY + 24);

        // Draw equipped weapon indicator
        if (this.player.equipment.weapon) {
            this.ctx.font = "16px Arial";
            this.ctx.fillText(
                this.player.equipment.weapon.icon,
                screenX + 25,
                screenY + 10
            );
        }

        // Draw player name and level
        this.ctx.fillStyle = "#ffd700";
        this.ctx.font = "12px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
            `Level ${this.player.level} Hero`,
            screenX + 16,
            screenY - 5
        );
        this.ctx.textAlign = "left";

        // Draw attack animations
        this.drawAttackAnimations();

        // Draw damage numbers
        this.drawDamageNumbers();
    }

    drawPortals() {
        this.portals.forEach((portal) => {
            const screenX = portal.x - this.camera.x;
            const screenY = portal.y - this.camera.y;

            // Draw swirling animation
            const time = Date.now() * 0.005;
            this.ctx.save();
            this.ctx.translate(
                screenX + portal.width / 2,
                screenY + portal.height / 2
            );
            this.ctx.rotate(time);

            // Draw portal effect
            this.ctx.shadowColor = "#00ffff";
            this.ctx.shadowBlur = 15;
            this.ctx.font = "40px Arial";
            this.ctx.fillText(portal.icon, -20, 15);

            this.ctx.restore();
            this.ctx.shadowBlur = 0;

            // Draw portal name
            this.ctx.fillStyle = "#00ffff";
            this.ctx.font = "10px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText(
                portal.name,
                screenX + portal.width / 2,
                screenY - 5
            );
            this.ctx.textAlign = "left";
        });
    }

    drawAttackAnimations() {
        // Draw player attack animation
        if (this.player.attackAnimation.active) {
            this.player.attackAnimation.particles.forEach((particle) => {
                this.ctx.save();
                this.ctx.globalAlpha = particle.alpha;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(
                    particle.x - this.camera.x,
                    particle.y - this.camera.y,
                    3,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
                this.ctx.restore();
            });
        }

        // Draw general particles
        this.particles.forEach((particle) => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(
                particle.x - this.camera.x,
                particle.y - this.camera.y,
                2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawDamageNumbers() {
        this.damageNumbers.forEach((dmg) => {
            this.ctx.save();
            this.ctx.globalAlpha = dmg.alpha;
            this.ctx.fillStyle = dmg.isCritical ? "#ff4444" : "#ffffff";
            this.ctx.font = dmg.isCritical ? "bold 16px Arial" : "14px Arial";
            this.ctx.strokeStyle = "#000000";
            this.ctx.lineWidth = 2;
            this.ctx.textAlign = "center";

            const screenX = dmg.x - this.camera.x;
            const screenY = dmg.y - this.camera.y;

            this.ctx.strokeText(dmg.damage.toString(), screenX, screenY);
            this.ctx.fillText(dmg.damage.toString(), screenX, screenY);
            this.ctx.restore();
        });
    }

    drawUIOverlays() {
        // Draw minimap
        this.drawMinimap();

        // Draw attack range indicator when near enemies
        const nearbyEnemies = this.enemies.filter(
            (enemy) =>
                enemy.isAlive && this.getDistance(this.player, enemy) < 80
        );

        if (nearbyEnemies.length > 0) {
            const screenX = this.player.x - this.camera.x;
            const screenY = this.player.y - this.camera.y;

            this.ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(screenX + 16, screenY + 16, 60, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    drawMinimap() {
        const minimapSize = 120;
        const minimapX = this.gameWidth - minimapSize - 10;
        const minimapY = 10;
        const scale = minimapSize / Math.max(this.map.width, this.map.height);

        // Minimap background
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
        this.ctx.strokeStyle = "#d4af37";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);

        // Draw swords on minimap
        this.swords.forEach((sword) => {
            if (sword.collected) return;
            const x = minimapX + sword.x * scale;
            const y = minimapY + sword.y * scale;
            this.ctx.fillStyle = "#ffd700";
            this.ctx.fillRect(x - 2, y - 2, 4, 4);
        });

        // Draw treasures on minimap
        this.treasures.forEach((treasure) => {
            if (treasure.collected) return;
            const x = minimapX + treasure.x * scale;
            const y = minimapY + treasure.y * scale;
            this.ctx.fillStyle = "#ff6600";
            this.ctx.fillRect(x - 1, y - 1, 2, 2);
        });

        // Draw enemies on minimap
        this.enemies.forEach((enemy) => {
            if (!enemy.isAlive) return;
            const x = minimapX + enemy.x * scale;
            const y = minimapY + enemy.y * scale;
            this.ctx.fillStyle = "#ff0000";
            this.ctx.fillRect(x - 1, y - 1, 2, 2);
        });

        // Draw player on minimap
        const playerX = minimapX + this.player.x * scale;
        const playerY = minimapY + this.player.y * scale;
        this.ctx.fillStyle = "#00ff00";
        this.ctx.fillRect(playerX - 2, playerY - 2, 4, 4);
    }

    // UI Management
    updateUI() {
        document.getElementById("player-level").textContent = this.player.level;
        document.getElementById("player-hp").textContent = this.player.hp;
        document.getElementById("player-max-hp").textContent =
            this.player.maxHp;
        document.getElementById("player-strength").textContent =
            this.player.stats.strength;
        document.getElementById("player-defense").textContent =
            this.player.stats.defense;
        document.getElementById("player-score").textContent = this.player.score;
        document.getElementById("player-gold").textContent = this.player.gold;

        // Update experience bar
        const expPercent =
            (this.player.experience / this.player.experienceToNext) * 100;
        document.getElementById("exp-bar").style.width = expPercent + "%";
        document.getElementById(
            "exp-text"
        ).textContent = `${this.player.experience}/${this.player.experienceToNext} XP`;
    }

    updateQuestUI() {
        document.getElementById("sword-progress").textContent = `Progress: ${
            this.quests.swordFound ? 1 : 0
        }/1`;
        document.getElementById(
            "treasure-progress"
        ).textContent = `Progress: ${this.quests.treasuresCollected}/10`;
        document.getElementById(
            "monster-progress"
        ).textContent = `Progress: ${this.quests.monstersDefeated}/5`;
    }

    updateInventoryUI() {
        const inventoryGrid = document.getElementById("inventory-grid");
        const inventoryCount = document.getElementById("inventory-count");

        inventoryGrid.innerHTML = "";
        inventoryCount.textContent = this.player.inventory.length;

        // Create inventory slots
        for (let i = 0; i < this.player.maxInventory; i++) {
            const slot = document.createElement("div");
            slot.className = "inventory-slot";

            if (i < this.player.inventory.length) {
                const item = this.player.inventory[i];
                slot.className += " occupied";
                slot.innerHTML = `<span class="item-icon">${item.icon}</span>`;
                slot.title = `${item.name} (${item.type})`;
            }

            inventoryGrid.appendChild(slot);
        }
    }

    showMessage(text, type = "info") {
        const messageLog = document.getElementById("message-log");
        const message = document.createElement("div");
        message.className = `message ${type}`;
        message.textContent = text;

        messageLog.appendChild(message);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 5000);
    }

    showShopModal() {
        const shopItems = [
            {
                name: "Iron Sword",
                icon: "⚔️",
                price: 150,
                type: "weapon",
                damage: 25,
            },
            {
                name: "Steel Armor",
                icon: "🛡️",
                price: 200,
                type: "armor",
                defense: 15,
            },
            {
                name: "Health Potion",
                icon: "🧪",
                price: 30,
                type: "potion",
                effect: "heal",
                value: 50,
            },
            {
                name: "Mana Potion",
                icon: "💙",
                price: 40,
                type: "potion",
                effect: "mana",
                value: 30,
            },
        ];

        const shopItemsContainer = document.getElementById("shop-items");
        shopItemsContainer.innerHTML = "";

        shopItems.forEach((item) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "shop-item";
            itemDiv.innerHTML = `
                <div class="shop-item-name">${item.icon} ${item.name}</div>
                <div class="shop-item-description">
                    ${
                        item.type === "weapon"
                            ? `Damage: ${item.damage}`
                            : item.type === "armor"
                            ? `Defense: ${item.defense}`
                            : item.type === "potion"
                            ? `Restores ${item.value} ${item.effect}`
                            : ""
                    }
                </div>
                <div class="shop-item-price">💰 ${item.price} gold</div>
                <button class="btn btn-primary" onclick="buyItem('${
                    item.name
                }', ${item.price}, '${JSON.stringify(item).replace(
                /"/g,
                "&quot;"
            )}')">
                    Buy Item
                </button>
            `;
            shopItemsContainer.appendChild(itemDiv);
        });

        document.getElementById("shop-modal").classList.remove("hidden");
    }

    showMapSelection() {
        const mapModal = document.getElementById("map-modal");
        const mapSelection = document.getElementById("map-selection");

        // Clear previous content
        mapSelection.innerHTML = "";

        // Create map options
        this.maps.forEach((map, index) => {
            const mapOption = document.createElement("div");
            mapOption.className = "map-option";

            // Add current/locked classes
            if (index === this.currentMap) {
                mapOption.classList.add("current");
            }

            // For now, all maps are unlocked. You can add unlock conditions later
            const isUnlocked = true;
            if (!isUnlocked) {
                mapOption.classList.add("locked");
            }

            // Create difficulty stars
            const stars =
                "★".repeat(map.difficulty || 1) +
                "☆".repeat(5 - (map.difficulty || 1));

            mapOption.innerHTML = `
                <div class="map-title">${map.emoji || "🗺️"} ${map.name}</div>
                <div class="map-description">${map.description}</div>
                <div class="map-difficulty">
                    ${Array.from(stars)
                        .map(
                            (star) =>
                                `<span class="difficulty-star ${
                                    star === "☆" ? "empty" : ""
                                }">${star}</span>`
                        )
                        .join("")}
                </div>
                <div class="map-rewards">${
                    map.rewards || "Explore to discover rewards!"
                }</div>
            `;

            // Add click handler if not current map and unlocked
            if (index !== this.currentMap && isUnlocked) {
                mapOption.addEventListener("click", () => {
                    this.travelToMap(index);
                    this.closeMapModal();
                });
            }

            mapSelection.appendChild(mapOption);
        });

        mapModal.classList.remove("hidden");
    }

    closeMapModal() {
        document.getElementById("map-modal").classList.add("hidden");
    }

    gameOver() {
        this.gameRunning = false;
        this.showMessage("💀 Game Over! You have been defeated.", "error");

        setTimeout(() => {
            if (confirm("Game Over! Would you like to restart?")) {
                location.reload();
            }
        }, 2000);
    }
}

// Global functions for modal interactions
function closeShopModal() {
    document.getElementById("shop-modal").classList.add("hidden");
}

function closeMapModal() {
    document.getElementById("map-modal").classList.add("hidden");
}

function buyItem(itemName, price, itemDataJson) {
    const itemData = JSON.parse(itemDataJson.replace(/&quot;/g, '"'));

    if (game.player.gold >= price) {
        game.player.gold -= price;

        const item = {
            name: itemData.name,
            icon: itemData.icon,
            type: itemData.type,
            damage: itemData.damage,
            defense: itemData.defense,
            effect: itemData.effect,
            value: itemData.value,
        };

        if (game.addToInventory(item)) {
            game.showMessage(`✅ Purchased ${itemName}!`, "success");
            game.updateUI();
            game.updateInventoryUI();
        }
    } else {
        game.showMessage("❌ Not enough gold!", "error");
    }
}

// Initialize game when page loads
let game;
window.addEventListener("load", () => {
    game = new MedievalRPG();

    // Setup modal event listeners
    setupModalEventListeners();
});

// Setup modal event listeners
function setupModalEventListeners() {
    // Close modals when clicking outside
    document.getElementById("shop-modal").addEventListener("click", (e) => {
        if (e.target.id === "shop-modal") {
            closeShopModal();
        }
    });

    document.getElementById("map-modal").addEventListener("click", (e) => {
        if (e.target.id === "map-modal") {
            closeMapModal();
        }
    });

    // Close modals with Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const shopModal = document.getElementById("shop-modal");
            const mapModal = document.getElementById("map-modal");

            if (!shopModal.classList.contains("hidden")) {
                closeShopModal();
            }
            if (!mapModal.classList.contains("hidden")) {
                closeMapModal();
            }
        }
    });
}

// Handle window resize
window.addEventListener("resize", () => {
    if (game) {
        // Handle canvas resize if needed
    }
});
