class Level {
  constructor(data) {
    this.missions = data.missions;
    this.coinsData = data.coins;
    this.enemiesData = data.enemies;
    this.npcDialogues = data.npcDialogues;
    this.keyPosition = data.keyPosition;
    this.chestPosition = data.chestPosition;
    this.coins = []; // Ensure these are initialized
    this.enemies = [];
  }

  initializeGameWorld(player) {
    // Initialize coins
    this.coins = this.coinsData.map((coin) => {
      const newCoin = new Coin(coin.x, coin.y, player);
      console.log("Coin instantiated:", newCoin);
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
        100, // patrolDistance
        enemyType // type
      );
      console.log("Enemy instantiated:", newEnemy);
      return newEnemy;
    });

    // Initialize key
    this.key = new Key(this.keyPosition.x, this.keyPosition.y);
    console.log("Key instantiated:", this.key);

    // Initialize chest
    this.chest = new Chest(this.chestPosition.x, this.chestPosition.y);
    console.log("Chest instantiated:", this.chest);
  }

  getNPCDialogue(dialogueState, hasCollectedTreasure) {
    if (hasCollectedTreasure) {
      return this.npcDialogues.final;
    }
    return this.npcDialogues[dialogueState] || this.npcDialogues.default;
  }
}

// Example level data
const levelData = [
  {
    missions: [
      "Talk to The Archer",
      "Defeat all Wizards",
      "Collect the Key",
      "Open the Chest",
      "Return to The Archer",
    ],
    coins: [
      { x: 950, y: 300 },
      { x: 1300, y: 400 },
      { x: 1500, y: 300 },
      { x: 1600, y: 300 },
      { x: 1900, y: 400 },
      { x: 2200, y: 400 },
      { x: 2600, y: 400 },
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
    npcDialogues: {
      0: "Greetings, adventurer!",
      1: "Dark times have befallen our forest.\nEvil creatures roam freely.",
      2: "Please, we need your strength.\nDefeat the bad guys and reclaim the treasure!",
      default: "Good luck, brave soul!",
      final:
        "Well done, adventurer!\nThanks for dealing with those bad guys. You saved us!",
    },
    keyPosition: { x: 1800, y: 100 },
    chestPosition: { x: 2800, y: 460 },
  },
  {
    missions: [
      "Find the Healer",
      "Defeat the Monsters",
      "Collect the Sacred Stone",
      "Open the Sacred Chest",
      "Return to the Healer",
    ],
    coins: [
      { x: 500, y: 200 },
      { x: 800, y: 300 },
      { x: 1100, y: 200 },
      { x: 1400, y: 300 },
      { x: 1700, y: 200 },
      { x: 2000, y: 300 },
      { x: 2300, y: 400 },
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
    npcDialogues: {
      0: "Welcome, hero!",
      1: "We are in desperate need of your help.\nMonsters have invaded our land.",
      2: "Retrieve the Sacred Stone to save us!",
      default: "Best of luck, brave soul!",
      final: "You've done it!\nOur land is safe once again. Thank you!",
    },
    keyPosition: { x: 2000, y: 150 },
    chestPosition: { x: 2800, y: 460 },
  },
  // Add more levels as needed
];
