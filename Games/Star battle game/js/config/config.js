const config = {};
const fps = 60;

(() => {

    // common

    const plane = (callback=false) => {
        const o = {
            w: 70,
            h: 70,
            x: 0,
            y: 0,
            img : 'player',
            speed: 4,
            bulletCooldown : 5 * fps,
        }
        if (!callback) {
            return o;
        }
        const data = callback(o);
        for (let key of Object.keys(data)){
            o[key] = data[key]
        }
        return o;
    }

    const planeAnimation = ()=>{
        return {
            loop : true,
            col : 1,
            row : 4,
            cooldown : 0.1 * fps,
        }
    }

    const bullet = (() => {
        return {
            w: 20,
            h: 10,
            x: 0,
            y: 0,
            speed : 4,
        };
    })

    const batchAdd = (url, name, count,ext) => {
        let images = {};
        for (let i = 1; i <= count; i++){
            images[name + i] = url + name + i +'.'+ ext;
        }
        return images;
    }


    const batchImport = (name, count) => {
        let images = [];
        for (let i = 1; i <= count; i++){
            images.push(name + i);
        }
        return images;
    };

    // config

    config.game = {
        w: 960,
        h: 480,
        fontSize : {
            min : 12,
            max : 30,
            val : 16,
        },
        // random cooldown index 0 - index 1
        appendEnemyCooldown: [2 * fps, 5 * fps],
        appendFriendCooldown : [2*fps,5*fps],
        appendFuelCooldown : [2*fps,5*fps],
        appendStarCooldown : [1*fps,2*fps],
    }

    config.fuelConfig = {
        fuelLoseSpeed: -1,
        fuelRaiseSpeed: 15,
        fuelMax: 30,
        beingHit : -15,
    }
    config.scoreConfig = {
        shootEnemy: 5,
        shootMeteorite: 10,
        shootFriend: -10,
    }

    config.data = ()=>{
        return {
            fuel: 15,
            score: 0,
            shoot: 0,
            time : 0,
            name : '',
        }
    }
    
    config.player = (() => {

        const { h } = config.game;

        const o = plane(o => {
            return {
                y: h / 2 - o.h / 2,
                bulletCooldown: 0.5 * fps,
                animation : planeAnimation(),
            }
        });

        return o;

    })();

    config.enemy = (() => {

        const { w } = config.game;

        const o = plane(o => {
            return {
                x: w + o.w,
                speed: -3,
                img : 'enemy',
                animation : planeAnimation(),
            }
        })

        return o;

    })();

    config.meteorite = (() => {

        const { w } = config.game;

        const o = plane(o => {
            return {
                w: 85,
                h : 85,
                x: w + o.w,
                speed: -3,
                img : batchImport('meteorites_', 4),
                life : 2,
            }
        })

        return o;

    })();

    config.friend = (() => {

        const { w } = config.game;

        const o = plane(o => {
            return {
                x: w + o.w,
                speed: -3,
                img : 'friend',
                animation : planeAnimation(),
            }
        })

        return o;

    })();

    config.fuel = (() => {

        const o = {
            w: 40,
            h: 40,
        };
        o.x = 0;
        o.y = -o.h;

        o.speed = -1;

        o.img = 'fuel';

        return o;

    })();

    config.star = (() => {

        const o = {};

        o.img = batchImport('star_', 12);

        return o;

    })();


    config.playerBullet = (() => {
        
        let o = bullet();
        o.img = 'playerBullet';

        return o;

    })();

    config.enemyBullet = (() => {
        
        let o = bullet();
        o.speed = -o.speed;
        o.img = 'enemyBullet';

        return o;

    })();

    config.planeDeathAnimation = {
        img: 'boom',
        loop : false,
        row: 4,
        col: 4,
        cooldown: 0.05 * fps,
    }

    config.bulletDeathAnimation = {
        img: 'boom',
        loop : false,
        row: 4,
        col: 4,
        cooldown: 0.01 * fps,
    }

    config.images = (() => {

        const path = './img/';

        let images = {
            boom: path + 'boom.png',
            player: path + 'plane/player.png',
            friend: path + 'plane/friend.png',
            enemy: path + 'plane/enemy.png',
            playerBullet: path + 'playerBullet.png',
            enemyBullet: path + 'enemyBullet.png',
            fuel: path + 'fuel2.png',
        };

        return Object.assign(
            batchAdd(path+'/star/','star_',12,'png'),
            batchAdd(path+'/meteorites/','meteorites_',4,'png'),
            images,
        )

    })();

    config.audios = (()=>{
        const path = './sound/';
        return {
            bg : path + 'background.mp3',
            destroyed : path + 'destroyed.mp3',
            shoot : path + 'shoot.mp3',
        }
    })();

})();