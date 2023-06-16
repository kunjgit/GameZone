class Game {
    constructor() {
        this.setup();
    }

    setup() {
        this.initSize();
        this.initScenes();
    }

    initData() {
        this.data = config.data();
        this.data.end = false;
    }

    initSize() {
        const el = $('#app');
        style(
            el, {
                width: config.game.w + 'px',
                height: config.game.h + 'px',
            }
        );
    }

    initScenes() {
        this.scenes = {
            start: new Start('#start', this),
            play: new Play('#play', this),
            over: new Over('#over', this),
            rank: new Rank('#rank', this),
        }
    }

    toggleScene(scene) {
        if (this.scene === this.scenes[scene]) {
            return;
        }
        Object.keys(this.scenes).map(key => {
            this.scenes[key].hidden();
        });
        this.scene && this.scene.uninstall();
        this.scene = this.scenes[scene];
        this.scene.show();
        this.scene.setup();
    }

    start() {
        this.toggleScene('start');
    }

    play() {
        this.toggleScene('play');
    }

    over() {
        this.toggleScene('over');
    }

    rank() {
        this.toggleScene('rank');
    }

}