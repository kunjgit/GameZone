//canvas elements for the main mario game

var GameUI = (function() {
  var instance;

  function GameUI() {
    var canvas = document.getElementsByClassName('game-screen')[0];
    var ctx = canvas.getContext('2d');

    var that = this;

    this.setWidth = function(width) {
      canvas.width = width;
    };

    this.setHeight = function(height) {
      canvas.height = height;
    };

    this.getWidth = function() {
      return canvas.width;
    };

    this.getHeight = function() {
      return canvas.height;
    };

    this.getCanvas = function() {
      return canvas;
    };

    this.show = function() {
      canvas.style.display = 'block';
    };

    this.hide = function() {
      canvas.style.display = 'none';
    };

    this.clear = function(x, y, width, height) {
      ctx.clearRect(x, y, width, height);
    };

    this.scrollWindow = function(x, y) {
      ctx.translate(x, y);
    };

    this.draw = function(image, sx, sy, width, height, x, y, width, height) {
      ctx.drawImage(image, sx, sy, width, height, x, y, width, height);
    };

    this.makeBox = function(x, y, width, height) {
      ctx.rect(x, y, width, height);
      ctx.fillStyle = 'black';
      ctx.fill();
    };

    this.writeText = function(text, x, y) {
      ctx.font = '20px SuperMario256';
      ctx.fillStyle = 'white';
      ctx.fillText(text, x, y);
    };
  }

  return {
    getInstance: function() {
      if (instance == null) {
        instance = new GameUI();
      }

      return instance;
    }
  };
})();
