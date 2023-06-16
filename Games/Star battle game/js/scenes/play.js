class Play extends Scene {
    constructor(el,game){
        super(el,game);
        this.created();
    }
    created(){
        this.raf_id = 'play_update';
        this.initCanvas();
    }
    setup() {
        this.muteFlag = false;
        this.initData();
        this.initPlayer();
        this.updateTime();
        this.updateFuel();
        this.updateScore();
        this.updateFontSize();
        $("#logo").classList.add('play-status');
        this.event();
        this.start();
    }

    start() {
        this.pauseFlag = false;
        raf.reg(this.raf_id, this.update.bind(this));
        res.play('bg');
        $('#game-pause-btn').classList.add('active');
    }
    pause() {
        this.pauseFlag = true;
        raf.remove(this.raf_id);
        res.pause('bg');
        $('#game-pause-btn').classList.remove('active');
    }

    mute(){
        this.muteFlag = true;
        res.mute();
        $('#game-mute-btn').classList.add('active');
    }

    speak(){
        this.muteFlag = false;
        res.speak();
        $('#game-mute-btn').classList.remove('active');
    }

    uninstall() {
        raf.remove(this.raf_id);
        res.end('bg');
        $("#logo").classList.remove('play-status');
        hotkey.clearAll();
    }

    initData() {

        this.pauseFlag = false;

        this.timeCooldown = new Cooldown(fps, true);


        this.playerBullets = [];
        this.enemyBullets = [];
        this.allEnemys = [];
        this.enemys = {
            arr: this.allEnemys,
            elem: Enemy,
            cooldown: new Cooldown(config.game.appendEnemyCooldown),
        };
        this.meteorites = {
            arr: this.allEnemys,
            elem: Meteorite,
            cooldown: new Cooldown(config.game.appendEnemyCooldown),
        };
        this.friends = {
            arr: [],
            elem: Friend,
            cooldown: new Cooldown(config.game.appendFriendCooldown),
        };
        this.fuels = {
            arr: [],
            elem: Fuel,
            cooldown: new Cooldown(config.game.appendFriendCooldown),
        };
        this.stars = {
            arr: [],
            elem: Star,
            cooldown: new Cooldown(config.game.appendStarCooldown),
        };
    }

    collision(a, b, callback) {
        if (!a.run || !b.run) {
            return;
        }
        var yCoolision = (a, b) => {
            return a.y > b.y && a.y < b.y + b.h;
        };
        var xCoolision = (a, b) => {
            return a.x > b.x && a.x < b.x + b.w;
        };
        if (yCoolision(a, b) || yCoolision(b, a)) {
            if (xCoolision(a, b) || xCoolision(b, a)) {
                callback(a, b);
            }
        }
    }

    bulletCollision(bullet, arr, callback) {
        arr.forEach(el => {
            this.collision(bullet, el, (a, b) => {
                a.reduceLife();
                b.reduceLife();
                if (!b.run) {
                    callback(b);
                }
            });
        });
    }

    playerCollision(el, callback) {
        this.collision(this.player, el, () => {
            el.death();
            callback(el);
        });
    }

    factory(elem) {
        const o = new elem(this);
        o.setup();
        return o;
    }

    append(obj) {
        obj.cooldown.update().active(() => {
            obj.arr.push(
                this.factory(obj.elem)
            )
        });
    }

    appendElement() {
        this.append(this.enemys);
        this.append(this.meteorites);
        this.append(this.friends);
        this.append(this.fuels);
        this.append(this.stars);
    }

    updateing(arr, callback) {
        const len = arr.length;
        for (let i = len - 1; i >= 0; i--) {
            const el = arr[i];
            if (el.isDeath) {
                arr.splice(i, 1);
                continue;
            }
            el.update();
            callback && callback(el);
        }
    }

    updateBullets() {
        const {
            shootEnemy,
            shootMeteorite,
            shootFriend
        } = config.scoreConfig;
        const {
            beingHit
        } = config.fuelConfig;
        this.updateing(this.playerBullets, bullet => {
            this.bulletCollision(bullet, this.enemyBullets, (el) => {
                el.death();
            });
            this.bulletCollision(bullet, this.enemys.arr, (el) => {
                this.updateScore(
                    el instanceof Meteorite ?
                    shootMeteorite : shootEnemy
                );
                this.updateshoot();
                this.shoot();
            });
            this.bulletCollision(bullet, this.friends.arr, (el) => {
                this.updateScore(shootFriend);
                this.shoot();
            });
        });
        this.updateing(this.enemyBullets, bullet => {
            this.playerCollision(bullet, () => {
                this.updateFuel(beingHit);
            })
        });
    }

    updateEmenys() {
        const {
            shootEnemy,
            shootMeteorite,
        } = config.scoreConfig;
        const {
            beingHit
        } = config.fuelConfig;
        this.updateing(this.enemys.arr, enemy => {
            this.playerCollision(enemy, () => {
                this.updateScore(
                    enemy instanceof Meteorite ?
                    shootMeteorite : shootEnemy
                );
                this.updateFuel(beingHit);
                this.updateshoot();
                this.shoot();
            })
        });
    }

    updateFriends() {
        const {
            shootFriend
        } = config.scoreConfig;
        this.updateing(this.friends.arr, friend => {
            this.playerCollision(friend, () => {
                this.updateScore(shootFriend);
                this.shoot();
            })
        });
    }

    updateFuels() {
        const {
            fuelRaiseSpeed
        } = config.fuelConfig;
        this.updateing(this.fuels.arr, fuel => {
            this.playerCollision(fuel, () => {
                this.updateFuel(fuelRaiseSpeed);
            })
        });
    }

    updateStars() {
        this.updateing(this.stars.arr);
    }

    updateElements() {
        this.updateStars();
        this.player.update();
        this.updateEmenys();
        this.updateFriends();
        this.updateFuels();
        this.updateBullets();
    }

    update() {
        this.timeCooldown.update().active(() => {
            this.game.data.time++;
            this.updateTime();
            this.updateFuel(config.fuelConfig.fuelLoseSpeed);
        });

        this.ctx.clearRect(0, 0, config.game.w, config.game.h);

        this.appendElement();

        this.updateElements();
    }

    updateTime() {
        const game = this.game;
        $('#time').innerHTML = numberFormat(game.data.time);
    }

    updateFuel(num = 0) {
        const game = this.game;
        const {
            fuelMax,
            fuelLoseSpeed
        } = config.fuelConfig;
        const call = () => {
            $('#fuel').innerHTML = numberFormat(game.data.fuel);
            if (game.data.fuel <= 0) {
                this.game.over();
            }
        }
        if (num === 0) {
            return call();
        }
        if (num !== fuelLoseSpeed) {
            const start = game.data.fuel;
            const end = start + num;
            incrementAnimation(start, end, current => {
                if (current > fuelMax) {
                    current = fuelMax;
                }
                game.data.fuel = current;
                call();
            })
            return;
        }
        game.data.fuel += num;
        call();
    }

    updateScore(num = 0) {
        const game = this.game;
        const call = () => {
            $('#score').innerHTML = numberFormat(game.data.score);
        }
        if (num === 0) {
            return call();
        }
        const start = game.data.score;
        const end = start + num;
        incrementAnimation(start, end, current => {
            game.data.score = current;
            call();
        })
    }

    updateshoot() {
        const game = this.game;
        game.data.shoot++;
        $('#shoot').innerHTML = numberFormat(game.data.shoot);
    }

    updateFontSize(){
        $('.content .header .info').style.fontSize = config.game.fontSize.val + 'px';
    }

    initCanvas() {
        this.canvas = $('#canvas');
        this.canvas.width = config.game.w;
        this.canvas.height = config.game.h;

        this.ctx = this.canvas.getContext('2d');
    }

    initPlayer() {
        this.player = this.factory(Player);
    }

    draw(data) {
        this.ctx.drawImage.apply(this.ctx, data);
    }

    rotateDraw(conf) {
        this.ctx.save();
        this.ctx.translate(conf.x, conf.y);
        this.ctx.rotate(conf.deg * Math.PI / 180);
        this.draw(conf.data);
        this.ctx.restore();
    }

    setFontStyle(font = "20px Arial", yellow = "yellow") {
        this.ctx.font = font;
        this.ctx.fillStyle = yellow;
    }

    drawText(data) {
        this.ctx.fillText(data.text, data.x, data.y);
    }

    event() {
        const togglePause = ()=>{
            this.pauseFlag ? this.start() : this.pause();
        }
        const toggleMute = ()=>{
            this.muteFlag ? this.speak() : this.mute();
        }
        const fontSize = (status)=>{
            let {
                max,
                min,
                val
            } = config.game.fontSize;
            val += (status ? 1 : -1);
            if (val <= min || val >= max) return;
            config.game.fontSize.val = val;
            this.updateFontSize();
        }
        hotkey.reg('p', () => {
            togglePause();
        }, true);
        hotkey.reg('m', () => {
            toggleMute();
        }, true);
        on(
            $('#game-font-size-add'),
            'click',
            ()=>{
                fontSize(true);
            }
        )
        on(
            $('#game-font-size-reduce'),
            'click',
            ()=>{
                fontSize(false);
            }
        )
        on(
            $('#game-pause-btn'),
            'click',
            ()=>{
                togglePause()
            }
        )
        on(
            $('#game-mute-btn'),
            'click',
            ()=>{
                toggleMute()
            }
        )
    }

    shoot() {
        res.replay('destroyed');
    }
}