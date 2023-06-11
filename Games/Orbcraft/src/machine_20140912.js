(function(){

    var frameRate = 1000/30,
	currentState='start',
	lt = new Date(),
	
    state = {
        start : {
            update : function () {
                var context;
                sheets = new Layers('app', ['background', 'buildings', 'orbs', 'disp'], 640, 480);
                //sheets.fillTo(0, '#000000');

                // draw black background
                context = sheets.get('background');
                context.fillStyle = '#1a1a1a';
                context.fillRect(0, 0, sheets.width, sheets.height);

                // set up new Game
                currentGame = new Game();
				
				// gender Grid Lines once
                currentGame.renderGridLines(context);

                // attach Event Handlers
                (function () {
                    var canvas = sheets.get('disp', 'canvas');
                    Shell.bind(canvas, 'mousemove', function (e) {
                        var box = canvas.getBoundingClientRect();
                        mx = e.clientX - box.left;
                        my = e.clientY - box.top;
                        currentGame.userMove(mx, my);
                    });
                    Shell.bind(canvas, 'mousedown', function (e) {
					    e.preventDefault();
                        var box = canvas.getBoundingClientRect();
                        mx = e.clientX - box.left;
                        my = e.clientY - box.top;
                        currentGame.userGrab(mx, my);
                    });
                    Shell.bind(canvas, 'mouseup', function (e) {
                        var box = canvas.getBoundingClientRect();
                        mx = e.clientX - box.left;
                        my = e.clientY - box.top;
                        currentGame.userRelease(mx, my);
                    });

                }());

                currentState = 'game';
            },
            render : function () {}
        },
        game : {
            update : function () {

                currentGame.update();

            },
            render : function () {
                var context = sheets.get('buildings');
                context.clearRect(0, 0, sheets.width, sheets.height);
                currentGame.renderBuildings(context);

                context = sheets.get('orbs');
                context.clearRect(0, 0, sheets.width, sheets.height);
                currentGame.renderOrbs(context);

                context = sheets.get('disp');
                context.clearRect(0, 0, sheets.width, sheets.height);
                currentGame.render(context);
            }
        }

    };

    thread = function () {

        if (new Date() - lt >= frameRate) {
            state[currentState].update();
            state[currentState].render();
            lt = new Date();
        }
        window.requestAnimationFrame(thread);
    };
    thread();
}());