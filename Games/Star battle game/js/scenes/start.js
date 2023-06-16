class Start extends Scene {
    setup() {
        super.setup();
        this.game.initData();
        this.event();
    }

    event() {
        const btn = $('#start-btn');
        on(
            btn,
            'click',
            () => {
                btn.setAttribute('disabled', 'disabled');
                res.loadAssets(() => {
                    this.game.play();
                    btn.removeAttribute('disabled');
                })
            }
        )
    }
}