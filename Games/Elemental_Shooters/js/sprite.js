function rect(x,y,w,h,color){
  Game.spriteCacheCtx.fillStyle = color;
  Game.spriteCacheCtx.fillRect(x,y,w,h);
}

function generateTerrainSprite(y, color1, color2, color3, color4, color5, color6){

  rect(Game.tileSize * 3, Game.tileSize * y, Game.tileSize, (Game.tileSize), color1);
  rect((Game.tileSize * 3) + 2, (Game.tileSize * y) + 2, Game.tileSize - 4, (Game.tileSize) / 2,color2);
  rect(Game.tileSize * 3, (Game.tileSize * y) + 20, Game.tileSize, 12, color3);

  rect(Game.tileSize * 4,  Game.tileSize * (3 + y), Game.tileSize, (Game.tileSize), color4);

  rect(Game.tileSize * 5,  Game.tileSize * (3 + y), Game.tileSize, (Game.tileSize), color4);
  rect(Game.tileSize * 5 + 20, Game.tileSize * (3 + y) + 20, 2, 2, color2);
  rect(Game.tileSize * 5 +12, Game.tileSize * (3 + y) + 8, 2, 2, color2);
  rect(Game.tileSize * 5 + 8, Game.tileSize * (3 + y) + 15, 2, 2, color2);
  rect(Game.tileSize * 5 + 14, Game.tileSize * (3 + y) + 6, 2, 2, color2);

  rect(Game.tileSize * 6,  Game.tileSize * (3 + y), Game.tileSize, (Game.tileSize), color4);
  rect(Game.tileSize * 6 + 10, Game.tileSize * (3 + y) + 5, 2, 2, color2);
  rect(Game.tileSize * 6 +16, Game.tileSize * (3 + y) + 9, 2, 2, color2);
  rect(Game.tileSize * 6 + 12, Game.tileSize * (3 + y) + 10, 2, 2, color2);
  rect(Game.tileSize * 6 + 18, Game.tileSize * (3 + y) + 9, 2, 2, color2);

  rect(Game.tileSize * 8, Game.tileSize * (4 + y), Game.tileSize, (Game.tileSize), color1);
  rect((Game.tileSize * 8) + 2, (Game.tileSize * (4 + y)) + 2, Game.tileSize - 4, (Game.tileSize) / 2,color5);
  rect(Game.tileSize * 8, (Game.tileSize * (4 + y)) + 20, Game.tileSize, 12, color3);

  rect(0, Game.tileSize * y, Game.tileSize * 3, Game.tileSize * 3, color1);
  rect(2,(Game.tileSize * y) + 2, (Game.tileSize * 3) - 4, (Game.tileSize * 3) - 16, color2);
  rect(0, (Game.tileSize * (3 + y)) - 12, (Game.tileSize * 3), 12, color3);

  rect(0, (Game.tileSize * (3 + y)) , Game.tileSize * 3, Game.tileSize, color1);
  rect(2, (Game.tileSize * (3 + y)) + 2, (Game.tileSize * 3) - 4, Game.tileSize / 2, color2);
  rect(0, (Game.tileSize * (4 + y)) - 12, (Game.tileSize * 3), 12 , color3);

  rect(Game.tileSize * 3, (Game.tileSize * (1 + y)), Game.tileSize, Game.tileSize * 3, color1);
  rect((Game.tileSize * 3) + 2,(Game.tileSize * (1 + y)) + 2, Game.tileSize - 4, (Game.tileSize * 3) - 16, color2);
  rect(Game.tileSize * 3, (Game.tileSize * (4 + y)) - 12, Game.tileSize, 12, color3);

  rect(Game.tileSize * 4, Game.tileSize * y, Game.tileSize * 3, Game.tileSize * 3, color1);
  rect((Game.tileSize * 4) + 2, (Game.tileSize * y) + 2, (Game.tileSize * 3) - 4, (Game.tileSize * 3) - 16, color2);
  rect(Game.tileSize * 4, (Game.tileSize * (3 + y)) - 12, (Game.tileSize * 3), 12, color3);
  rect((Game.tileSize * 5) - 2, (Game.tileSize * (1 + y)) - 14, 4, 16, color1);
  rect((Game.tileSize * 5) - 2, (Game.tileSize * (2 + y)) - 14, 4, 16, color1);
  rect((Game.tileSize * 6) - 2, (Game.tileSize * (1 + y)) - 14, 4, 16, color1);
  rect((Game.tileSize * 6) - 2, (Game.tileSize * (2 + y)) - 14, 4, 16, color1);

  rect((Game.tileSize * 7), Game.tileSize * y, (Game.tileSize * 3), (Game.tileSize * 3), color2);
  rect((Game.tileSize * 8) - 2, (Game.tileSize * (1 + y)) - 14, 4, 16, color1);
  rect((Game.tileSize * 8) - 2, (Game.tileSize * (2 + y)) - 2, 4, 4, color1);
  rect((Game.tileSize * 9) - 2, (Game.tileSize * (1 + y)) - 14, 4, 16, color1);
  rect((Game.tileSize * 9) - 2, (Game.tileSize * (2 + y)) - 2, 4, 4, color1);

  rect((Game.tileSize * 7), (Game.tileSize * (3 + y)), (Game.tileSize * 3),Game.tileSize, color2);
  rect((Game.tileSize * 8) - 2, (Game.tileSize * (4 + y)) - 14, 4, 14, color1);
  rect((Game.tileSize * 8) - 2, (Game.tileSize * (3 + y)), 4, 2, color1);
  rect((Game.tileSize * 9) - 2, (Game.tileSize * (4 + y)) - 14, 4, 14, color1);
  rect((Game.tileSize * 9) - 2, (Game.tileSize * (3 + y)), 4, 2, color1);

  rect(0, (Game.tileSize * (4 + y)), (Game.tileSize * 6),Game.tileSize * 2, color2);

  rect(Game.tileSize - 2, (Game.tileSize * (5 + y)) - 14, 4, 16, color1);
  rect(0, (Game.tileSize * (4 + y)), Game.tileSize, 2, color1);
  rect((Game.tileSize * 2) - 2, (Game.tileSize * (4 + y)), 2, Game.tileSize, color1);
  rect(Game.tileSize, (Game.tileSize * (6 + y)) - 14, Game.tileSize, 2, color1);
  rect(Game.tileSize, (Game.tileSize * (6 + y)) - 12, Game.tileSize, 12, color3);
  rect(0, (Game.tileSize * (5 + y)), 2, Game.tileSize, color1);

  rect((Game.tileSize * 3) - 2, (Game.tileSize * (5 + y)) - 14, 4, 16, color1);
  rect((Game.tileSize * 3), (Game.tileSize * (4 + y)), Game.tileSize, 2, color1);
  rect((Game.tileSize * 2), (Game.tileSize * (4 + y)), 2, Game.tileSize, color1);
  rect(Game.tileSize * 2, (Game.tileSize * (6 + y)) - 14, Game.tileSize, 2, color1);
  rect(Game.tileSize * 2, (Game.tileSize * (6 + y)) - 12, Game.tileSize, 12, color3);
  rect((Game.tileSize * 4) - 2, (Game.tileSize * (5 + y)), 2, Game.tileSize, color1);

  rect((Game.tileSize * 5) - 2, (Game.tileSize * (5 + y)) - 14, 4, 16, color1);
  rect((Game.tileSize * 4), (Game.tileSize * (5 + y)) - 14, 2, 16, color1);
  rect((Game.tileSize * 6)-2, (Game.tileSize * (5 + y))- 14, 2, 16, color1);
  rect((Game.tileSize * 5)-2, (Game.tileSize * (4 + y)), 4, 2, color1);
  rect((Game.tileSize * 5)-2, (Game.tileSize * (6 + y)) - 14, 4, 14, color1);

  rect(Game.tileSize * 6, (Game.tileSize * (4 + y)), (Game.tileSize * 2),Game.tileSize, color2);
  rect((Game.tileSize * 6), (Game.tileSize * (5 + y)) - 14, 2, 14, color1);
  rect((Game.tileSize * 8) - 2, (Game.tileSize * (5 + y)) - 14, 2, 14, color1);
  rect((Game.tileSize * 7)-2, (Game.tileSize * (4 + y)), 4, 2, color1);

  rect(Game.tileSize * 6, (Game.tileSize * (5 + y)), (Game.tileSize),Game.tileSize, color6);
  var i = 0;

  for (i = 0; i < 8; i++) {
    rect((Game.tileSize * 7) + (i * 2), (Game.tileSize * (5 + y)) + (i * 2), (Game.tileSize) - (i * 4),Game.tileSize - (i * 4), i%2==0 ? color1 : color2);
  };

  for (i = 0; i < 2; i++) {
    rect((Game.tileSize * 8) + (i * 2), (Game.tileSize * (5 + y)) + (i * 2), (Game.tileSize) - (i * 4),Game.tileSize - (i * 4), i%2==0 ? color3 : color2);
  };
  rect((Game.tileSize * 8) + (2 * 2), (Game.tileSize * (5 + y)) + (2 * 2), (Game.tileSize) - (2 * 4),Game.tileSize - (2 * 4), color5);
  for (i = 2; i < 4; i++) {
    rect((Game.tileSize * 8) + (i * 4), (Game.tileSize * (5 + y)) + (i * 4), (Game.tileSize) - (i * 8),Game.tileSize - (i * 8), i%2==0 ? color2 : '#ccc');
  };


};

function generateSprite(){

  Game.spriteCache = document.createElement('canvas');
  Game.spriteCacheCtx = Game.spriteCache.getContext('2d');

  Game.spriteCache.width = 320;
  Game.spriteCache.height = 768;

  generateTerrainSprite(0, 'hsl(91, 29%, 52%)', 'hsl(91, 37%, 68%)', 'hsl(91, 40%, 60%)', 'hsl(91, 63%, 79%)', 'hsl(91, 23%, 49%)', 'hsl(91, 53%, 60%)' );
  generateTerrainSprite(6, 'hsl(205, 29%, 52%)', 'hsl(205, 37%, 68%)', 'hsl(205, 40%, 60%)', 'hsl(205, 63%, 79%)', 'hsl(205, 23%, 49%)', 'hsl(205, 53%, 60%)' );
  generateTerrainSprite(12, 'hsl(40, 27%, 48%)', 'hsl(40, 37%, 68%)', 'hsl(40, 40%, 60%)', 'hsl(40, 63%, 79%)', 'hsl(40, 23%, 49%)', 'hsl(40, 53%, 60%)' );
  generateTerrainSprite(18, 'hsl(0, 29%, 52%)', 'hsl(0, 37%, 68%)', 'hsl(0, 40%, 60%)', 'hsl(0, 63%, 79%)', 'hsl(0, 23%, 49%)', 'hsl(0, 53%, 60%)' );

  //debug
  //console.log(Game.spriteCache.toDataURL('image/png'));

}