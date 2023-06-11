$.Draw = {
    clear: function() {
        $.ctx.clearRect(0, 0, $.width, $.height);
    },

    rect: function(x, y, w, h, col) {
        $.ctx.beginPath();
        $.ctx.rect(x, y, w, h);
        $.ctx.fillStyle = col;
        $.ctx.fill();
    },
    line: function (from, to) {
        $.ctx.save();
        $.ctx.strokeStyle = 'rgba(221, 189, 172, 0.5)';
        $.ctx.moveTo(from.x,from.y);
        $.ctx.lineTo(to.x, to.y);
        $.ctx.stroke();
        $.ctx.restore();
    },
    text: function(string, x, y, size, col) {
        $.ctx.font = 'bold '+size+'px Monospace';
        $.ctx.fillStyle = col;
        $.ctx.fillText(string, x, y);
    },

    obstacle: function (x, y, size) {
        var obstacle_img = document.getElementById('obstacle');
        var pat = $.ctx.drawImage(obstacle_img, x, y);
    },

    formation: function (x, y, type) {
        var formation_img = document.getElementById(type);
        var opacity = ((x + 22) / 100);

        $.ctx.save();
        $.ctx.globalAlpha = opacity;
        $.ctx.drawImage(formation_img, x, y);
        $.ctx.restore();
    },

    heart: function (x, y) {
        var heart_img = document.getElementById('heart');
        $.ctx.save();
        $.ctx.globalAlpha = 1;
        $.ctx.drawImage(heart_img, x, y);
        $.ctx.restore();
    },

    startScreen: function () {
        $.Draw.clear();

        var formationDist = 5;

        for (var j = 0; j < 10; j++) {
            var type = (j % 2 === 0) ? 'small_formation' : 'large_formation';
            $.Draw.formation(formationDist, 0, type);        
            formationDist += 30;
        }

        var logo = document.getElementById('jumbit_logo');

        $.ctx.save();
        $.ctx.globalAlpha = 1;
        $.ctx.drawImage(logo, 50, 80);
        $.ctx.restore();

        var text_arr = ['A spark of flame trapped in a cold cave.',
        'Traveling through a breeze of wind, ',
        'how long can you survive the unstable ',
        'frozen formations in your way?'];

        var line_height = 180;

        for (var i = 0; i < text_arr.length; i++) {
            $.Draw.text(text_arr[i], 20, line_height, 12, "#ddbdac");
            line_height += 18;
        }

        line_height += 45;

        $.Draw.text('Tap to survive!', 40, line_height, 25, "#dd1919");

        line_height += 160;
        $.Draw.text('made for ', 20, line_height, 12, "#ddbeac");
        $.Draw.text('GSSOC', 80, line_height, 12, "#ac907e");
        line_height += 16;
        $.Draw.text('Programming ', 20, line_height, 12, "#ddbeac");
        $.Draw.text('HTML CSS', 105, line_height, 12, "#ac907e");
    },

    gameOverScreen: function () {
        $.Draw.clear();

        var formationDist = 5;

        for (var j = 0; j < 10; j++) {
            var type = (j % 2 === 0) ? 'small_formation' : 'large_formation';
            $.Draw.formation(formationDist, 0, type);        
            formationDist += 30;
        }

        $.Draw.text('Game Over', 70, 180, 35, '#ddbeac');
        $.Draw.text('Managed to survive ' + $.distanceCoveredStr + ' km!', 25, 230, 18, '#ddbeac');
        $.Draw.text('Tap or click to continue', 60, 300, 15, '#967a64');
    }
};
