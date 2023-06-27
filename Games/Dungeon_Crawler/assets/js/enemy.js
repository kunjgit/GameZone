// Enemy
let enemy = {
    name: null,
    type: null,
    lvl: null,
    stats: {
        hp: null,
        hpMax: null,
        atk: 0,
        def: 0,
        atkSpd: 0,
        vamp: 0,
        critRate: 0,
        critDmg: 0
    },
    image: {
        name: null,
        type: null,
        size: null
    },
    rewards: {
        exp: null,
        gold: null,
        drop: null
    }
};

const generateRandomEnemy = (condition) => {
    // List of possible enemy names
    const enemyNames = [
        // Goblin
        'Goblin', 'Goblin Rogue', 'Goblin Mage', 'Goblin Archer',
        // Wolf
        'Wolf', 'Black Wolf', 'Winter Wolf',
        // Slime
        'Slime', 'Angel Slime', 'Knight Slime', 'Crusader Slime',
        // Orc
        'Orc Swordsmaster', 'Orc Axe', 'Orc Archer', 'Orc Mage',
        // Spider
        'Spider', 'Red Spider', 'Green Spider',
        // Skeleton
        'Skeleton Archer', 'Skeleton Swordsmaster', 'Skeleton Knight', 'Skeleton Mage', 'Skeleton Pirate', 'Skeleton Samurai', 'Skeleton Warrior',
        // Bosses
        'Zaart, the Dominator Goblin', 'Banshee, Skeleton Lord', 'Molten Spider', 'Cerberus Ptolemaios', 'Hellhound Inferni', 'Berthelot, the Undead King', 'Slime King', 'Zodiac Cancer', 'Alfadriel, the Light Titan', 'Tiamat, the Dragon Knight', 'Nameless Fallen King', 'Zodiac Aries', 'Llyrrad, the Ant Queen', 'Clockwork Spider', 'Aragorn, the Lethal Wolf',
        // Monarch
        'Naizicher, the Spider Dragon', 'Ulliot, the Deathlord', 'Ifrit', 'Shiva', 'Behemoth', 'Blood Manipulation Feral', 'Thanatos', 'Darkness Angel Reaper', 'Zalaras, the Dragon Emperor'
    ];
    const enemyTypes = ['Offensive', 'Defensive', 'Balanced', 'Quick', 'Lethal'];
    let selectedEnemies = null;

    // Generate enemy type
    enemy.type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

    // Calculate enemy level
    const maxLvl = dungeon.progress.floor * dungeon.settings.enemyLvlGap + (dungeon.settings.enemyBaseLvl - 1);
    const minLvl = maxLvl - (dungeon.settings.enemyLvlGap - 1);
    if (condition == "guardian") {
        enemy.lvl = minLvl;
    } else if (condition == "sboss") {
        enemy.lvl = maxLvl;
    } else {
        enemy.lvl = randomizeNum(minLvl, maxLvl);
    }

    // Generate proper enemy info
    switch (enemy.type) {
        case "Offensive":
            // Select name and apply stats for Offensive enemies
            if (condition == "guardian") {
                selectedEnemies = enemyNames.filter(name => [
                    'Zaart, the Dominator Goblin', 'Banshee, Skeleton Lord', 'Molten Spider', 'Berthelot, the Undead King'
                ].includes(name));
            } else if (condition == "sboss") {
                selectedEnemies = enemyNames.filter(name => [
                    'Behemoth', 'Zalaras, the Dragon Emperor'
                ].includes(name));
            } else {
                selectedEnemies = enemyNames.filter(name => [
                    'Goblin Mage', 'Goblin Archer',
                    'Wolf', 'Black Wolf', 'Winter Wolf',
                    'Knight Slime',
                    'Orc Swordsmaster', 'Orc Axe', 'Orc Archer', 'Orc Mage',
                    'Red Spider',
                    'Skeleton Archer', 'Skeleton Swordsmaster', 'Skeleton Mage', 'Skeleton Pirate', 'Skeleton Samurai',
                ].includes(name));
            }
            enemy.name = selectedEnemies[Math.floor(Math.random() * selectedEnemies.length)];
            setEnemyStats(enemy.type, condition);
            break;
        case "Defensive":
            // Select name and apply stats for Defensive enemies
            if (condition == "guardian") {
                selectedEnemies = enemyNames.filter(name => [
                    'Slime King', 'Zodiac Cancer', 'Alfadriel, the Light Titan'
                ].includes(name));
            } else if (condition == "sboss") {
                selectedEnemies = enemyNames.filter(name => [
                    'Ulliot, the Deathlord',
                ].includes(name));
            } else {
                selectedEnemies = enemyNames.filter(name => [
                    'Angel Slime', 'Knight Slime', 'Crusader Slime',
                    'Green Spider',
                    'Skeleton Knight', 'Skeleton Warrior'
                ].includes(name));
            }
            enemy.name = selectedEnemies[Math.floor(Math.random() * selectedEnemies.length)];
            setEnemyStats(enemy.type, condition);
            break;
        case "Balanced":
            // Select name and apply stats for Balanced enemies
            if (condition == "guardian") {
                selectedEnemies = enemyNames.filter(name => [
                    'Tiamat, the Dragon Knight', 'Nameless Fallen King', 'Zodiac Aries'
                ].includes(name));
            } else if (condition == "sboss") {
                selectedEnemies = enemyNames.filter(name => [
                    'Ifrit', 'Shiva', 'Thanatos'
                ].includes(name));
            } else {
                selectedEnemies = enemyNames.filter(name => [
                    'Goblin',
                    'Slime', 'Angel Slime', 'Knight Slime',
                    'Orc Swordsmaster', 'Orc Axe', 'Orc Archer', 'Orc Mage',
                    'Spider',
                    'Skeleton Knight', 'Skeleton Warrior'
                ].includes(name));
            }
            enemy.name = selectedEnemies[Math.floor(Math.random() * selectedEnemies.length)];
            setEnemyStats(enemy.type, condition);
            break;
        case "Quick":
            // Select name and apply stats for Quick enemies
            if (condition == "guardian") {
                selectedEnemies = enemyNames.filter(name => [
                    'Llyrrad, the Ant Queen', 'Clockwork Spider'
                ].includes(name));
            } else if (condition == "sboss") {
                selectedEnemies = enemyNames.filter(name => [
                    'Darkness Angel Reaper', 'Naizicher, the Spider Dragon'
                ].includes(name));
            } else {
                selectedEnemies = enemyNames.filter(name => [
                    'Goblin', 'Goblin Rogue', 'Goblin Archer',
                    'Wolf', 'Black Wolf', 'Winter Wolf',
                    'Orc Swordsmaster',
                    'Spider', 'Red Spider', 'Green Spider',
                    'Skeleton Swordsmaster', 'Skeleton Pirate', 'Skeleton Samurai'
                ].includes(name));
            }
            enemy.name = selectedEnemies[Math.floor(Math.random() * selectedEnemies.length)];
            setEnemyStats(enemy.type, condition);
            break;
        case "Lethal":
            // Select name and apply stats for Lethal enemies
            if (condition == "guardian") {
                selectedEnemies = enemyNames.filter(name => [
                    'Aragorn, the Lethal Wolf', 'Cerberus Ptolemaios', 'Hellhound Inferni'
                ].includes(name));
            } else if (condition == "sboss") {
                selectedEnemies = enemyNames.filter(name => [
                    'Blood Manipulation Feral'
                ].includes(name));
            } else {
                selectedEnemies = enemyNames.filter(name => [
                    'Goblin Rogue',
                    'Wolf', 'Black Wolf', 'Winter Wolf',
                    'Orc Swordsmaster', 'Orc Axe',
                    'Red Spider',
                    'Skeleton Swordsmaster', 'Skeleton Samurai'
                ].includes(name));
            }
            enemy.name = selectedEnemies[Math.floor(Math.random() * selectedEnemies.length)];
            setEnemyStats(enemy.type, condition);
            break;
    }
    if (condition == "chest") {
        enemy.name = "Mimic";
    } else if (condition == "door") {
        enemy.name = "Door Mimic";
    }
    setEnemyImg();
}

// Set a randomly generated stat for the enemy
const setEnemyStats = (type, condition) => {
    if (type == "Offensive") {
        enemy.stats = {
            hp: 0,
            hpMax: randomizeNum(300, 370),
            atk: randomizeNum(70, 100),
            def: randomizeNum(20, 50),
            atkSpd: randomizeDecimal(0.2, 0.4),
            vamp: 0,
            critRate: randomizeDecimal(1, 4),
            critDmg: randomizeDecimal(6.5, 7.5)
        };
    } else if (type == "Defensive") {
        enemy.stats = {
            hp: 0,
            hpMax: randomizeNum(400, 500),
            atk: randomizeNum(40, 70),
            def: randomizeNum(40, 70),
            atkSpd: randomizeDecimal(0.1, 0.3),
            vamp: 0,
            critRate: 0,
            critDmg: 0
        };
    } else if (type == "Balanced") {
        enemy.stats = {
            hp: 0,
            hpMax: randomizeNum(320, 420),
            atk: randomizeNum(50, 80),
            def: randomizeNum(30, 60),
            atkSpd: randomizeDecimal(0.15, 0.35),
            vamp: 0,
            critRate: randomizeDecimal(0.5, 1.5),
            critDmg: randomizeDecimal(1, 3)
        };
    } else if (type == "Quick") {
        enemy.stats = {
            hp: 0,
            hpMax: randomizeNum(300, 370),
            atk: randomizeNum(50, 80),
            def: randomizeNum(30, 60),
            atkSpd: randomizeDecimal(0.35, 0.45),
            vamp: 0,
            critRate: randomizeDecimal(1, 4),
            critDmg: randomizeDecimal(3, 6)
        };
    } else if (type == "Lethal") {
        enemy.stats = {
            hp: 0,
            hpMax: randomizeNum(300, 370),
            atk: randomizeNum(70, 100),
            def: randomizeNum(20, 50),
            atkSpd: randomizeDecimal(0.15, 0.35),
            vamp: 0,
            critRate: randomizeDecimal(4, 8),
            critDmg: randomizeDecimal(6, 9)
        };
    }

    if (dungeon.enemyMultipliers == undefined) {
        dungeon.enemyMultipliers = {
            hp: 1,
            atk: 1,
            def: 1,
            atkSpd: 1,
            vamp: 1,
            critRate: 1,
            critDmg: 1
        }
    }

    // Apply stat scaling for enemies each level
    for (const stat in enemy.stats) {
        if (["hpMax", "atk", "def"].includes(stat)) {
            enemy.stats[stat] += Math.round(enemy.stats[stat] * ((dungeon.settings.enemyScaling - 1) * enemy.lvl));
        } else if (["atkSpd"].includes(stat)) {
            enemy.stats[stat] = 0.4;
            enemy.stats[stat] += enemy.stats[stat] * (((dungeon.settings.enemyScaling - 1) / 4) * enemy.lvl);
        } else if (["critRate"].includes(stat)) {
            enemy.stats[stat] += enemy.stats[stat] * (((dungeon.settings.enemyScaling - 1) / 4) * enemy.lvl);
        } else if (["critDmg"].includes(stat)) {
            enemy.stats[stat] = 50;
            enemy.stats[stat] += enemy.stats[stat] * (((dungeon.settings.enemyScaling - 1) / 4) * enemy.lvl);
        }
    }

    // Stat multiplier for floor guardians
    if (condition == "guardian") {
        enemy.stats.hpMax = enemy.stats.hpMax * 1.5;
        enemy.stats.atk = enemy.stats.atk * 1.3;
        enemy.stats.def = enemy.stats.def * 1.3;
        enemy.stats.critRate = enemy.stats.critRate * 1.1;
        enemy.stats.critDmg = enemy.stats.critDmg * 1.2;
    }

    // Stat multiplier for monarchs
    if (condition == "sboss") {
        enemy.stats.hpMax = enemy.stats.hpMax * 6;
        enemy.stats.atk = enemy.stats.atk * 2;
        enemy.stats.def = enemy.stats.def * 2;
        enemy.stats.critRate = enemy.stats.critRate * 1.1;
        enemy.stats.critDmg = enemy.stats.critDmg * 1.3;
    }

    // Apply stat multipliers for every stat
    let floorMultiplier = (dungeon.progress.floor / 3);
    if (floorMultiplier < 1) {
        floorMultiplier = 1;
    }
    enemy.stats.hpMax = Math.round((enemy.stats.hpMax * floorMultiplier) * dungeon.enemyMultipliers.hp);
    enemy.stats.atk = Math.round(enemy.stats.atk * dungeon.enemyMultipliers.atk);
    enemy.stats.def = Math.round(enemy.stats.def * dungeon.enemyMultipliers.def);
    enemy.stats.atkSpd = enemy.stats.atkSpd * dungeon.enemyMultipliers.atkSpd;
    enemy.stats.vamp = enemy.stats.vamp * dungeon.enemyMultipliers.vamp;
    enemy.stats.critRate = enemy.stats.critRate * dungeon.enemyMultipliers.critRate;
    enemy.stats.critDmg = enemy.stats.critDmg * dungeon.enemyMultipliers.critDmg;

    // Calculate exp and gold that the monster gives
    const expYield = [];

    for (const stat in enemy.stats) {
        let statExp;
        if (["hpMax", "atk", "def"].includes(stat)) {
            statExp = enemy.stats[stat] + enemy.stats[stat] * 0.5;
        } else if (["atkSpd", "critRate", "critDmg"].includes(stat)) {
            statExp = enemy.stats[stat] + enemy.stats[stat] * 2;
        } else if (["vamp", "hp"].includes(stat)) {
            statExp = enemy.stats[stat] + enemy.stats[stat] * 1;
        }
        expYield.push(statExp);
    }

    let expCalculation = (expYield.reduce((acc, cur) => acc + cur, 0)) / 20;
    enemy.rewards.exp = Math.round(expCalculation + expCalculation * (enemy.lvl * 0.1));
    if (enemy.rewards.exp > 1000000) {
        enemy.rewards.exp = 1000000 * randomizeDecimal(0.9, 1.1);
    }
    enemy.rewards.gold = Math.round((enemy.rewards.exp * randomizeDecimal(0.9, 1.1)) * 1.5);
    enemy.rewards.drop = randomizeNum(1, 3);
    if (enemy.rewards.drop == 1) {
        enemy.rewards.drop = true;
    } else {
        enemy.rewards.drop = false;
    }

    enemy.stats.hp = enemy.stats.hpMax;
    enemy.stats.hpPercent = 100;

    // Caps attack speed to 2.5
    if (enemy.stats.atkSpd > 2.5) {
        enemy.stats.atkSpd = 2.5;
    }
}

const setEnemyImg = () => {
    // Apply monster image
    enemy.image.type = '.png';
    switch (enemy.name) {
        // Goblins
        case 'Goblin':
            enemy.image.name = 'goblin';
            enemy.image.size = '50%';
            break;
        case 'Goblin Rogue':
            enemy.image.name = 'goblin_rogue';
            enemy.image.size = '50%';
            break;
        case 'Goblin Archer':
            enemy.image.name = 'goblin_archer';
            enemy.image.size = '50%';
            break;
        case 'Goblin Mage':
            enemy.image.name = 'goblin_mage';
            enemy.image.size = '50%';
            break;

        // Wolf
        case 'Wolf':
            enemy.image.name = 'wolf';
            enemy.image.size = '50%';
            break;
        case 'Black Wolf':
            enemy.image.name = 'wolf_black';
            enemy.image.size = '50%';
            break;
        case 'Winter Wolf':
            enemy.image.name = 'wolf_winter';
            enemy.image.size = '50%';
            break;

        // Slime
        case 'Slime':
            enemy.image.name = 'slime';
            enemy.image.size = '50%';
            break;
        case 'Angel Slime':
            enemy.image.name = 'slime_angel';
            enemy.image.size = '50%';
            break;
        case 'Knight Slime':
            enemy.image.name = 'slime_knight';
            enemy.image.size = '50%';
            break;
        case 'Crusader Slime':
            enemy.image.name = 'slime_crusader';
            enemy.image.size = '50%';
            break;

        // Orc
        case 'Orc Swordsmaster':
            enemy.image.name = 'orc_swordsmaster';
            enemy.image.size = '50%';
            break;
        case 'Orc Axe':
            enemy.image.name = 'orc_axe';
            enemy.image.size = '50%';
            break;
        case 'Orc Archer':
            enemy.image.name = 'orc_archer';
            enemy.image.size = '50%';
            break;
        case 'Orc Mage':
            enemy.image.name = 'orc_mage';
            enemy.image.size = '50%';
            break;

        // Spider
        case 'Spider':
            enemy.image.name = 'spider';
            enemy.image.size = '50%';
            break;
        case 'Red Spider':
            enemy.image.name = 'spider_red';
            enemy.image.size = '50%';
            break;
        case 'Green Spider':
            enemy.image.name = 'spider_green';
            enemy.image.size = '50%';
            break;

        // Skeleton
        case 'Skeleton Archer':
            enemy.image.name = 'skeleton_archer';
            enemy.image.size = '50%';
            break;
        case 'Skeleton Swordsmaster':
            enemy.image.name = 'skeleton_swordsmaster';
            enemy.image.size = '50%';
            break;
        case 'Skeleton Knight':
            enemy.image.name = 'skeleton_knight';
            enemy.image.size = '50%';
            break;
        case 'Skeleton Mage':
            if (randomizeNum(1, 2) == 1) {
                enemy.image.name = 'skeleton_mage1';
            } else {
                enemy.image.name = 'skeleton_mage2';
            }
            enemy.image.size = '50%';
            break;
        case 'Skeleton Pirate':
            enemy.image.name = 'skeleton_pirate';
            enemy.image.size = '50%';
            break;
        case 'Skeleton Samurai':
            enemy.image.name = 'skeleton_samurai';
            enemy.image.size = '50%';
            break;
        case 'Skeleton Warrior':
            enemy.image.name = 'skeleton_warrior';
            enemy.image.size = '50%';
            break;

        // Mimic
        case 'Mimic':
            enemy.image.name = 'mimic';
            enemy.image.size = '50%';
            break;
        case 'Door Mimic':
            enemy.image.name = 'mimic_door';
            enemy.image.size = '50%';
            break;

        // Bosses
        case 'Zaart, the Dominator Goblin':
            enemy.image.name = 'goblin_boss';
            enemy.image.size = '70%';
            break;
        case 'Banshee, Skeleton Lord':
            enemy.image.name = 'skeleton_boss';
            enemy.image.size = '50%';
            break;
        case 'Molten Spider':
            enemy.image.name = 'spider_fire';
            enemy.image.size = '50%';
            break;
        case 'Cerberus Ptolemaios':
            enemy.image.name = 'cerberus_ptolemaios';
            enemy.image.size = '50%';
            break;
        case 'Hellhound Inferni':
            enemy.image.name = 'hellhound';
            enemy.image.size = '50%';
            break;
        case 'Berthelot, the Undead King':
            enemy.image.name = 'berthelot';
            enemy.image.size = '50%';
            break;
        case 'Slime King':
            enemy.image.name = 'slime_boss';
            enemy.image.size = '50%';
            break;
        case 'Zodiac Cancer':
            enemy.image.name = 'zodiac_cancer';
            enemy.image.size = '50%';
            break;
        case 'Alfadriel, the Light Titan':
            enemy.image.name = 'alfadriel';
            enemy.image.size = '50%';
            break;
        case 'Tiamat, the Dragon Knight':
            enemy.image.name = 'tiamat';
            enemy.image.size = '50%';
            break;
        case 'Nameless Fallen King':
            enemy.image.name = 'fallen_king';
            enemy.image.size = '50%';
            break;
        case 'Zodiac Aries':
            enemy.image.name = 'zodiac_aries';
            enemy.image.size = '50%';
            break;
        case 'Clockwork Spider':
            enemy.image.name = 'spider_boss';
            enemy.image.size = '50%';
            break;
        case 'Llyrrad, the Ant Queen':
            enemy.image.name = 'ant_queen';
            enemy.image.size = '50%';
            break;
        case 'Aragorn, the Lethal Wolf':
            enemy.image.name = 'wolf_boss';
            enemy.image.size = '50%';
            break;

        // Special Boss
        case 'Naizicher, the Spider Dragon':
            enemy.image.name = 'spider_dragon';
            enemy.image.size = '70%';
            break;
        case 'Ulliot, the Deathlord':
            enemy.image.name = 'skeleton_dragon';
            enemy.image.size = '70%';
            break;
        case 'Ifrit':
            enemy.image.name = 'firelord';
            enemy.image.size = '70%';
            break;
        case 'Shiva':
            enemy.image.name = 'icemaiden';
            enemy.image.size = '70%';
            break;
        case 'Behemoth':
            enemy.image.name = 'behemoth';
            enemy.image.size = '70%';
            break;
        case 'Blood Manipulation Feral':
            enemy.image.name = 'bm-feral';
            enemy.image.size = '70%';
            break;
        case 'Thanatos':
            enemy.image.name = 'thanatos';
            enemy.image.size = '70%';
            break;
        case 'Darkness Angel Reaper':
            enemy.image.name = 'da-reaper';
            enemy.image.size = '70%';
            break;
        case 'Zalaras, the Dragon Emperor':
            enemy.image.name = 'zalaras';
            enemy.image.size = '70%';
            break;
    };
}

const enemyLoadStats = () => {
    // Shows proper percentage for respective stats
    let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    if (enemy.stats.hp > enemy.stats.hpMax) {
        enemy.stats.hp = enemy.stats.hpMax;
    }
    enemy.stats.hpPercent = ((enemy.stats.hp / enemy.stats.hpMax) * 100).toFixed(2).replace(rx, "$1");

    const enemyHpElement = document.querySelector('#enemy-hp-battle');
    const enemyHpDamageElement = document.querySelector('#enemy-hp-dmg');
    enemyHpElement.innerHTML = `&nbsp${nFormatter(enemy.stats.hp)}/${nFormatter(enemy.stats.hpMax)}<br>(${enemy.stats.hpPercent}%)`;
    enemyHpElement.style.width = `${enemy.stats.hpPercent}%`;
    enemyHpDamageElement.style.width = `${enemy.stats.hpPercent}%`;
}