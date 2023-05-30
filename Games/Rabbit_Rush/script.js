console.clear();

class RabbitRushGame {

    constructor() {
        const rr = document.querySelector('.rr');
        if (rr) {
            this.rr = rr;
            const styles = window.getComputedStyle(this.rr);
            this.scene = 'start';
            this.hangtime = styles.getPropertyValue('--rr-hangtime');
            this.difficulty = {
                level: 1,
                wait: parseInt(this.rr.dataset.difficultyWait),
                decrement: 600,
                speed: parseInt(styles.getPropertyValue('--rr-difficulty-speed')),
                min: 2500,
                obs: (styles.getPropertyValue('--rr-bp').includes('desktop') ? 2 : 1),
            }
            this.heroStatus = 'ground';
            this.timers = { jump: null, score: null, difficulty: null };
            this.times = [0.6, 0.25, 0.14, 0.01];
            this.scores = { cur: 0, hi: 0 }
            this.autoplay = parseInt(this.rr.dataset.autoplay);
            this.el = {
                stage: rr.querySelector('.rr__stage'),
                landscapes: [...rr.querySelectorAll('.rr__landscape')],
                hero: rr.querySelector('.rr__hero'),
                obs: [...rr.querySelectorAll('.rr__obsticle')],
                toggle: rr.querySelector('.rr__toggle'),
                score: rr.querySelector('.rr__score'),
                nameScore: rr.querySelector('.rr__score--user'),
                hiScore: rr.querySelector('.rr__score--hi'),
                resetables: [...rr.querySelectorAll('.animates')],
                username: rr.querySelector('.rr__user-form'),
                msgs: {
                    all: [...rr.querySelectorAll('.rr__msg')],
                    info: rr.querySelector('.rr__msg--info'),
                    lost: [...rr.querySelectorAll('.rr__msg--lost')],
                    won: rr.querySelector('.rr__msg--won'),
                    level: rr.querySelector('.rr__msg--level'),
                    levelNum: rr.querySelector('.rr__level'),
                }
            };
        }
    }
    
    init() {
        if (this.rr) {
            // extract some values
            this.scores.hi = parseInt(this.el.hiScore.innerText);
            // bind persistent functionality (i.e. not reset on pause)
            this.bindConstants();
            this.showMessage(this.el.msgs.info);
            setTimeout(()=>{
                this.el.hero.focus();
                this.hideMessage(this.el.msgs.info);
                // maybe autostart
                if (this.autoplay) {
                    this.start();
                }
            }, 3000);
            // allow cheats
            this.cheat();
        }
    }
    
    handleEvent(e) {
        this?.[`${e.type}Input`](e);
    }

    keydownInput(e) {
        if (['h', 'j', ' ', 'ArrowUp'].includes(e.key)) {
            if(!e.target.classList.contains('rr__toggle')) e.preventDefault();
            this.aniJump();
        }
    }
    
    clickInput(e) {
        this.aniJump();
    }
    
    start(reset=false) {
        this.trackDifficulty(reset);
        this.keepScore(reset ? 0 : null);
        this.scene = 'running';
        this.bindControls();
        this.loopScene();
        this.el.landscapes.forEach((el) => {
            this.el.stage.setAttribute('data-running', '');
            this.el.toggle.textContent = 'Stop';
            this.el.hero.dataset.ani = 'running';
        });
        window.requestAnimationFrame(this.aniStage.bind(this));
    }
    
    end(ani='resting') {
        clearTimeout(this.timers.jump);
        clearTimeout(this.timers.score);
        clearTimeout(this.timers.difficulty);
        this.scene = 'end';
        this.heroStatus = 'ground';
        this.el.hero.dataset.ani = ani;
        this.el.hero.style.setProperty('transform', window.getComputedStyle(this.el.hero).getPropertyValue('transform'));
        this.bindControls(false);
        this.el.stage.removeAttribute('data-running');
        this.el.toggle.textContent = 'Start Over';
    }

    reset(hard=false) {
        if (hard) {
            this.difficulty.level = 1;
            this.el.toggle.textContent = 'Play';
        }
        this.scene = 'start';
        this.el.hero.style.removeProperty('transform');
        this.toggleAni(this.el.resetables);
        this.shuffleObsticles(this.el.obs, true);
        this.hideMessage(this.el.msgs.all);
    }
    
    loopScene() {
        this.el.landscapes.forEach((el) => {
            const obsticles = [...el.querySelectorAll('.rr__obsticle')];
            el.addEventListener('animationiteration', (e) => {
                if (e.animationName === 'rr-landscape') {
                    this.shuffleObsticles(obsticles);
                }
            });
        });
    }
    
    trackDifficulty(reset=false) {
        if (reset) {
            this.el.stage.style.setProperty('--rr-difficulty-speed', this.difficulty.speed);
        }
        this.timers.difficulty = setTimeout(() => {
            this.difficulty.level++;
            this.showMessage(this.el.msgs.level);
            this.el.msgs.levelNum.innerText = this.difficulty.level;
            this.end(this.el.hero.dataset.ani);
            this.timers.difficulty = setTimeout(() => {
                const newSpeed = this.difficulty.speed - this.difficulty.decrement * this.difficulty.level;
                if (newSpeed > this.difficulty.min) {
                    this.el.stage.style.setProperty('--rr-difficulty-speed', newSpeed);
                } else {
                    this.el.stage.style.setProperty('--rr-difficulty-speed', this.difficulty.min);
                }
                this.reset();
                this.start();
            }, 3000);
        }, this.difficulty.wait);
    }
    
    showMessage(mixedEl, className='active', show=true) {
        Array.isArray(mixedEl)
            ? mixedEl?.forEach(el => el.classList.toggle(className, show))
            : mixedEl.classList.toggle(className, show);
    }
    
    hideMessage(mixedEl, className='active') {
        this.showMessage(mixedEl, className, false);
    }
    
    resetFocus() {
        this.el.hero.focus();
        this.el.hero.blur();
    }
    
    bindConstants() {
        this.el.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.scene === 'start') {
                this.start(true);
                this.resetFocus();
            } else if (this.scene === 'running') {
                this.end();
            } else { // this.schene === 'end'
                this.reset(true);
                this.start(true);
                this.resetFocus();
            }
        });

        this.el.username.addEventListener('submit', (e) => {
            e.preventDefault();
            this.el.username.firstElementChild.setCustomValidity('');
            const name = this.el.username.querySelector('input').value;
            this.el.nameScore.innerText = name;
            this.scores.hi = this.scores.cur;
            this.el.hiScore.innerText = this.scores.hi.toString().padStart(5, 0);
            this.end();
            this.reset();
            if (!this.ignoreScore) {
                this.updateDb(name, this.scores.hi);
            }
        });

        this.el.username.firstElementChild.addEventListener('invalid', (e) => {
            e.target.setCustomValidity('Use only numbers, letters, and underscores.');
        });
        
        this.el.username.firstElementChild.addEventListener('keydown', (e) => {
            e.target.setCustomValidity('');
        });
    }
    
    bindControls(bind=true) {
        if (bind) {
            this.el.stage.addEventListener('click', this);
            document.addEventListener('keydown', this);
        } else {
            this.el.stage.removeEventListener('click', this);
            document.removeEventListener('keydown', this);
        }
    }
    
    shuffleObsticles(obsticles, reset=false) {
        var rands = Array.from({ length: this.difficulty.obs }, () => {
            return Math.floor(Math.random() * obsticles.length)
        });
        obsticles.forEach((el, i) => el.classList.toggle('active', reset===false && rands.includes(i)));
    }
    
    checkScore() {
        if (this.scores.cur > this.scores.hi) {
            this.showMessage(this.el.msgs.won);
        } else {
            this.showMessage(this.el.msgs.lost[Math.floor(Math.random() * this.el.msgs.lost.length)]);
        }
    }
    
    checkNoOverlap() {
        const heroBounds = this.el.hero.getBoundingClientRect();
        return ! this.el.obs.some((ob)=> {
            const obBounds = ob.getBoundingClientRect();
            const check = !(
                heroBounds.top > obBounds.bottom ||
                heroBounds.right < obBounds.left ||
                heroBounds.bottom < obBounds.top ||
                heroBounds.left > obBounds.right
            );
            // /*DEBUG*/check && console.log(`hit ${ob.querySelector('use').getAttribute('href')}`);
            return check;
        });
    }
    
    /**
     * @see https://css-tricks.com/restart-css-animation/#aa-update-another-javascript-method-to-restart-a-css-animation
     */
    toggleAni(els, add=true) {
        els?.forEach((el) => {
            el.classList.add('no-animation');
            setTimeout(()=>el.classList.remove('no-animation'), 99);
        })
    }
    
    aniStage() {
        // if we haven't crashed into or landed on an obsticle
        if (this.checkNoOverlap()) {
            if (this.scene === 'running') {
                // recursively animate running across stage
                window.requestAnimationFrame(this.aniStage.bind(this));
            }
        // if we've hit an object then end game
        } else {
            this.end('crashed');
            this.checkScore();
        }
    }
    
    aniSuper(hangtimeMultiplier) {
        clearTimeout(this.timers.jump);
        this.el.hero.dataset.ani = 'super';
        this.heroStatus = 'super';
        this.timers.jump = setTimeout(() => {
            this.el.hero.dataset.ani = 'running';
            this.heroStatus = 'downward';
            this.timers.jump = setTimeout(() => {
                this.heroStatus = 'ground';
            }, this.hangtime * this.times[1] + this.hangtime * this.times[2] + this.hangtime * this.times[3] );
        }, this.hangtime * hangtimeMultiplier);
    }
    
    aniJump() {
        if (this.heroStatus === 'ground') {
            this.heroStatus = 'jumping';
            this.el.hero.dataset.ani = 'jumping-up';
            clearTimeout(this.timers.jump);
            this.timers.jump = setTimeout(() => {
                this.el.hero.dataset.ani = 'jumping';
                this.timers.jump = setTimeout(() => {
                    this.heroStatus = 'peak';
                    this.timers.jump = setTimeout(() => {
                        this.heroStatus = 'downward';
                        this.el.hero.dataset.ani = 'running';
                        this.timers.jump = setTimeout(() => {
                            this.heroStatus = 'ground';
                        }, this.hangtime * this.times[3]);
                    }, this.hangtime * this.times[2]);
                }, this.hangtime * this.times[1]);
            }, this.hangtime * this.times[0]);
        } else if (this.heroStatus === 'jumping') {
            this.aniSuper(.85);
        }
    }
    
    keepScore(score) {
        score = typeof score === 'number' ? score : this.scores.cur;
        this.scores.cur = score;
        this.el.score.innerText = this.scores.cur.toString().padStart(5, 0);
        this.timers.score = setTimeout(() => {
            this.keepScore(++score);
        }, 500);
    }
    
    updateDb(name, score) {
        /*DEBUG*/alert(`"${name}" and "${score}" would be sent to WordPress for saving 🙂`) // 😱 an alert!
        // const wp = window.rabbitRun;
        // fetch(`${wp.api}/rabbit-rush/v1/winner/?user=${name}&score=${score}`, {
        //     headers:{
        //         'X-WP-Nonce': wp.nonce,
        //     },
        //     credentials: 'same-origin'
        // })
        // .then((resp) => resp.json())
        // .then((response) => {
        //     if (response?.data?.status === 200) {
        //         console.log('Success', response);
        //     } else {
        //         console.error('Error', response);
        //     }
        // });
    }
    
    cheat() {
        
        const useCheats = (msg) => {
            this.ignoreScore = true;
            console.log(msg);
        }
        
        const cheats = {
            eriamjh: () => (useCheats('🦸‍ flying') || this.aniSuper(9999)),
            nopain: () => (useCheats('🙈 invisibility') || (this.el.hero.style.setProperty('margin-bottom', '2em')) || (this.el.hero.querySelectorAll('.rr__hero-ani').forEach(el=>el.style.cssText='position:relative;top:2em;filter:opacity(0.5)'))),
            deathmarch: () => (useCheats('🏃‍♂️ force start') || this.start()),
            everyone: () => (useCheats('👁 show all obsticles') || this.el.obs.forEach(el=>el.classList.add('active')) || (this.shuffleObsticles = () => this.el.obs.forEach(el=>el.classList.add('active')))),
        }
        
        let text = '';
        let timer = null;
        
        const clearCheats = () => {
            clearTimeout(timer);
            text = '';
            console.log('📝 cheat prompt cleared')
        }
        
        const keydownCheat = (e) => {
            if (e.key === 'Backspace') {
                clearCheats();
                return;
            }
            text += e.key;
            console.log(`cheat: ${text}`);
            clearTimeout(timer);
            timer = setTimeout(clearCheats, 3000);
            Object.keys(cheats).forEach((key) => {
                if (text === key) {
                    cheats[key]();
                    clearCheats();
                }
            });
        };
        
        const addCheatListener = (e) => {
            if (e.altKey) {
                console.log('👀 entering cheatcode mode');
                this.el.stage.removeEventListener('click', addCheatListener);
                document.addEventListener('keydown', keydownCheat);
            }
        }
        this.el.stage.addEventListener('click', addCheatListener);
        
        // pre-activate a cheat code on load:
        // cheats.eriamjh();
        // cheats.nopain();
        // cheats.deathmarch();
        // cheats.everyone();
    }
}

const rr = new RabbitRushGame();
rr.init();