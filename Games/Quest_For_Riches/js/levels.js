/**
 * Represents a game level with various entities like coins, enemies, NPCs, key, and chest.
 */
class Level {
  /**
   * Creates a new level instance.
   * @param {Object} data - The level data containing missions, coins, enemies, NPC, dialogues, key, and chest positions.
   * @param {Array} data.missions - List of mission descriptions for the level.
   * @param {Array} data.coins - List of coin objects containing x and y positions.
   * @param {Array} data.enemies - List of enemy objects containing x, y, and sprite data.
   * @param {Object} data.npc - NPC data including position and sprite data.
   * @param {Object} data.npcDialogues - Dialogues for the NPC with different states.
   * @param {Object} data.keyPosition - Position object containing x and y for the key.
   * @param {Object} data.chestPosition - Position object containing x and y for the chest.
   */
  constructor(data) {
    this.missions = data.missions;
    this.coinsData = data.coins;
    this.enemiesData = data.enemies;
    this.npcData = data.npc;
    this.npcDialogues = data.npcDialogues;
    this.keyPosition = data.keyPosition;
    this.chestPosition = data.chestPosition;
    this.coins = [];
    this.enemies = [];
  }

  /**
   * Initializes the game world by creating instances of coins, enemies, NPC, key, and chest.
   * @param {Player} player - The player instance to associate with the NPC.
   */
  initializeGameWorld(player) {
    // Initialize coins
    this.coins = this.coinsData.map((coin) => {
      const newCoin = new Coin(coin.x, coin.y, player);
      return newCoin;
    });

    // Initialize enemies
    this.enemies = this.enemiesData.map((enemyData) => {
      if (!enemyData.spriteData) {
        console.error("Missing spriteData for enemy:", enemyData);
      }
      const enemyType = enemyData.spriteData.sprites.attack1
        ? "monster"
        : "wizard";
      const newEnemy = new Enemy(
        enemyData.x,
        enemyData.y,
        enemyData.spriteData,
        100,
        enemyType
      );
      return newEnemy;
    });

    // Initialize NPC
    if (this.npcData) {
      player.npc = new NPC(
        this.npcData.x,
        this.npcData.y,
        this.npcData.spriteData
      );
    }

    // Initialize key
    this.key = new Key(this.keyPosition.x, this.keyPosition.y);

    // Initialize chest
    this.chest = new Chest(this.chestPosition.x, this.chestPosition.y);
  }

  /**
   * Retrieves the appropriate dialogue for the NPC based on the current state and whether the treasure is collected.
   * @param {number} dialogueState - The current dialogue state of the NPC.
   * @param {boolean} hasCollectedTreasure - Indicates if the player has collected the treasure.
   * @returns {string} The dialogue text for the NPC.
   */
  getNPCDialogue(dialogueState, hasCollectedTreasure) {
    if (hasCollectedTreasure) {
      return this.npcDialogues.final;
    }
    return this.npcDialogues[dialogueState] || this.npcDialogues.default;
  }
}

// Example level data for creating instances of Level class
const levelData = [
  {
    missions: [
      "Talk to The Archer", // Mission 1
      "Defeat all Wizards", // Mission 2
      "Collect the Key", // Mission 3
      "Open the Chest", // Mission 4
      "Return to The Archer", // Mission 5
    ],
    coins: [
      { x: 950, y: 300 }, // Coin 1 position
      { x: 1300, y: 400 }, // Coin 2 position
      { x: 1500, y: 300 }, // Coin 3 position
      { x: 1600, y: 300 }, // Coin 4 position
      { x: 1900, y: 400 }, // Coin 5 position
      { x: 2200, y: 400 }, // Coin 6 position
      { x: 2600, y: 400 }, // Coin 7 position
    ],
    enemies: [
      {
        x: 1000,
        y: 300,
        spriteData: {
          width: 128,
          height: 128,
          sprites: {
            idle: {
              src: "assets/images/sprites/enemies/wizard/Idle.png",
              frames: 6,
              speed: 5,
            },
            run: {
              src: "assets/images/sprites/enemies/wizard/Run.png",
              frames: 8,
              speed: 3,
            },
            attack1: {
              src: "assets/images/sprites/enemies/wizard/Attack_1.png",
              frames: 10,
              speed: 10,
            },
            dead: {
              src: "assets/images/sprites/enemies/wizard/Dead.png",
              frames: 4,
              speed: 10,
            },
            hurt: {
              src: "assets/images/sprites/enemies/wizard/Hurt.png",
              frames: 4,
              speed: 10,
            },
            walk: {
              src: "assets/images/sprites/enemies/wizard/Walk.png",
              frames: 7,
              speed: 5,
            },
          },
        },
      },
      {
        x: 1400,
        y: 300,
        spriteData: {
          width: 128,
          height: 128,
          sprites: {
            idle: {
              src: "assets/images/sprites/enemies/wizard/Idle.png",
              frames: 6,
              speed: 5,
            },
            run: {
              src: "assets/images/sprites/enemies/wizard/Run.png",
              frames: 8,
              speed: 3,
            },
            attack1: {
              src: "assets/images/sprites/enemies/wizard/Attack_1.png",
              frames: 10,
              speed: 10,
            },
            dead: {
              src: "assets/images/sprites/enemies/wizard/Dead.png",
              frames: 4,
              speed: 10,
            },
            hurt: {
              src: "assets/images/sprites/enemies/wizard/Hurt.png",
              frames: 4,
              speed: 10,
            },
            walk: {
              src: "assets/images/sprites/enemies/wizard/Walk.png",
              frames: 7,
              speed: 5,
            },
          },
        },
      },
      {
        x: 1800,
        y: 300,
        spriteData: {
          width: 128,
          height: 128,
          sprites: {
            idle: {
              src: "assets/images/sprites/enemies/wizard/Idle.png",
              frames: 6,
              speed: 5,
            },
            run: {
              src: "assets/images/sprites/enemies/wizard/Run.png",
              frames: 8,
              speed: 3,
            },
            attack1: {
              src: "assets/images/sprites/enemies/wizard/Attack_1.png",
              frames: 10,
              speed: 10,
            },
            dead: {
              src: "assets/images/sprites/enemies/wizard/Dead.png",
              frames: 4,
              speed: 10,
            },
            hurt: {
              src: "assets/images/sprites/enemies/wizard/Hurt.png",
              frames: 4,
              speed: 10,
            },
            walk: {
              src: "assets/images/sprites/enemies/wizard/Walk.png",
              frames: 7,
              speed: 5,
            },
          },
        },
      },
    ],
    npc: {
      x: 300,
      y: 300,
      spriteData: {
        width: 128,
        height: 128,
        sprites: {
          idle: {
            src: "assets/images/sprites/npc/archer/Idle.png",
            frames: 6,
            speed: 5,
          },
        },
      },
    },
    npcDialogues: {
      0: "Greetings, adventurer!",
      1: "Dark times have befallen our forest.\nEvil wizards roam freely.",
      2: "Please, we need your strength.\nDefeat those wizards and reclaim the treasure they're guarding!",
      default: "Good luck, brave soul!",
      final:
        "Well done, adventurer!\nThanks for dealing with those wizards. You saved us!",
    },
    keyPosition: { x: 1800, y: 100 },
    chestPosition: { x: 2800, y: 460 },
  },
  {
    missions: [
      "Find the Healer", // Mission 1
      "Defeat the Monsters", // Mission 2
      "Collect the Sacred Stone", // Mission 3
      "Open the Sacred Chest", // Mission 4
      "Return to the Healer", // Mission 5
    ],
    coins: [
      { x: 500, y: 200 }, // Coin 1 position
      { x: 800, y: 300 }, // Coin 2 position
      { x: 1100, y: 200 }, // Coin 3 position
      { x: 1400, y: 300 }, // Coin 4 position
      { x: 1700, y: 200 }, // Coin 5 position
      { x: 2000, y: 300 }, // Coin 6 position
      { x: 2300, y: 400 }, // Coin 7 position
    ],
    enemies: [
      {
        x: 1300,
        y: 300,
        spriteData: {
          width: 96,
          height: 96,
          sprites: {
            idle: {
              src: "assets/images/sprites/enemies/monster/Idle.png",
              frames: 2,
              speed: 5,
            },
            run: {
              src: "assets/images/sprites/enemies/monster/Run.png",
              frames: 6,
              speed: 2,
            },
            attack1: {
              src: "assets/images/sprites/enemies/monster/Attack_1.png",
              frames: 4,
              speed: 5,
            },
            attack2: {
              src: "assets/images/sprites/enemies/monster/Attack_2.png",
              frames: 5,
              speed: 10,
            },
            attack3: {
              src: "assets/images/sprites/enemies/monster/Attack_3.png",
              frames: 5,
              speed: 10,
            },
            runAttack: {
              src: "assets/images/sprites/enemies/monster/Run+Attack.png",
              frames: 6,
              speed: 10,
            },
            dead: {
              src: "assets/images/sprites/enemies/monster/Dead.png",
              frames: 4,
              speed: 10,
            },
            hurt: {
              src: "assets/images/sprites/enemies/monster/Hurt.png",
              frames: 4,
              speed: 10,
            },
            walk: {
              src: "assets/images/sprites/enemies/monster/Walk.png",
              frames: 7,
              speed: 5,
            },
          },
        },
      },
      {
        x: 1600,
        y: 300,
        spriteData: {
          width: 96,
          height: 96,
          sprites: {
            idle: {
              src: "assets/images/sprites/enemies/monster/Idle.png",
              frames: 2,
              speed: 5,
            },
            run: {
              src: "assets/images/sprites/enemies/monster/Run.png",
              frames: 6,
              speed: 2,
            },
            attack1: {
              src: "assets/images/sprites/enemies/monster/Attack_1.png",
              frames: 4,
              speed: 5,
            },
            attack2: {
              src: "assets/images/sprites/enemies/monster/Attack_2.png",
              frames: 5,
              speed: 10,
            },
            attack3: {
              src: "assets/images/sprites/enemies/monster/Attack_3.png",
              frames: 5,
              speed: 10,
            },
            runAttack: {
              src: "assets/images/sprites/enemies/monster/Run+Attack.png",
              frames: 6,
              speed: 10,
            },
            dead: {
              src: "assets/images/sprites/enemies/monster/Dead.png",
              frames: 4,
              speed: 10,
            },
            hurt: {
              src: "assets/images/sprites/enemies/monster/Hurt.png",
              frames: 4,
              speed: 10,
            },
            walk: {
              src: "assets/images/sprites/enemies/monster/Walk.png",
              frames: 7,
              speed: 5,
            },
          },
        },
      },
      {
        x: 1900,
        y: 300,
        spriteData: {
          width: 96,
          height: 96,
          sprites: {
            idle: {
              src: "assets/images/sprites/enemies/monster/Idle.png",
              frames: 2,
              speed: 5,
            },
            run: {
              src: "assets/images/sprites/enemies/monster/Run.png",
              frames: 6,
              speed: 2,
            },
            attack1: {
              src: "assets/images/sprites/enemies/monster/Attack_1.png",
              frames: 4,
              speed: 5,
            },
            attack2: {
              src: "assets/images/sprites/enemies/monster/Attack_2.png",
              frames: 5,
              speed: 10,
            },
            attack3: {
              src: "assets/images/sprites/enemies/monster/Attack_3.png",
              frames: 5,
              speed: 10,
            },
            runAttack: {
              src: "assets/images/sprites/enemies/monster/Run+Attack.png",
              frames: 6,
              speed: 10,
            },
            dead: {
              src: "assets/images/sprites/enemies/monster/Dead.png",
              frames: 4,
              speed: 10,
            },
            hurt: {
              src: "assets/images/sprites/enemies/monster/Hurt.png",
              frames: 4,
              speed: 10,
            },
            walk: {
              src: "assets/images/sprites/enemies/monster/Walk.png",
              frames: 7,
              speed: 5,
            },
          },
        },
      },
      {
        x: 2200,
        y: 300,
        spriteData: {
          width: 96,
          height: 96,
          sprites: {
            idle: {
              src: "assets/images/sprites/enemies/monster/Idle.png",
              frames: 2,
              speed: 5,
            },
            run: {
              src: "assets/images/sprites/enemies/monster/Run.png",
              frames: 6,
              speed: 2,
            },
            attack1: {
              src: "assets/images/sprites/enemies/monster/Attack_1.png",
              frames: 4,
              speed: 5,
            },
            attack2: {
              src: "assets/images/sprites/enemies/monster/Attack_2.png",
              frames: 5,
              speed: 10,
            },
            attack3: {
              src: "assets/images/sprites/enemies/monster/Attack_3.png",
              frames: 5,
              speed: 10,
            },
            runAttack: {
              src: "assets/images/sprites/enemies/monster/Run+Attack.png",
              frames: 6,
              speed: 10,
            },
            dead: {
              src: "assets/images/sprites/enemies/monster/Dead.png",
              frames: 4,
              speed: 10,
            },
            hurt: {
              src: "assets/images/sprites/enemies/monster/Hurt.png",
              frames: 4,
              speed: 10,
            },
            walk: {
              src: "assets/images/sprites/enemies/monster/Walk.png",
              frames: 7,
              speed: 5,
            },
          },
        },
      },
    ],
    npc: {
      x: 300,
      y: 300,
      spriteData: {
        width: 128,
        height: 128,
        sprites: {
          idle: {
            src: "assets/images/sprites/npc/healer/Idle.png",
            frames: 5,
            speed: 5,
          },
        },
      },
    },
    npcDialogues: {
      0: "Welcome back, hero!",
      1: "We are in desperate need of your help again.\nMonsters have invaded our land.\n They will hurt our people if we don't stop them!",
      2: "Please defeat those monsters.\nThere will be a treasure waiting for you as a reward!",
      default: "Best of luck, brave soul. Please be careful!",
      final: "You've done it!\nOur land is safe once again. Thank you!",
    },
    keyPosition: { x: 2000, y: 150 },
    chestPosition: { x: 2800, y: 460 },
  },
  // Add more levels here...
];
