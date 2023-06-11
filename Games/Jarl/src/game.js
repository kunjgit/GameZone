//(function() {

   "use strict";
   var Extendable = {
      extend : function(preObject) {
         var object = Object.create(this);

         for(var index in preObject) {
            object[index] = preObject[index];
         }

         if ("construct" in object) {
            object.construct();
         }

         return object;
      }
   };

   /**
    * Main base for the game Object
    */
   var Game = Extendable.extend({
      // rooms data
      nextId : 0,
      pieces : [],
      el : document.getElementById("room"),

      // add an object to the room
      add : function(object) {

         object.create();

         if(object.id === null) {
            object.id = this.nextId;
            this.pieces[this.nextId] = object;
            this.nextId++;
         } else {
            this.pieces[object.id] = object;
         }

         this.show(object);

         return object.id;
      },

      addAll : function(array) {
         for (var i = 0, len = array.length; i < len; i++) {
            this.add(array[i]);
         }
      },

      // remove piece from room
      remove : function(object) {
         this.el.removeChild(object.el);
         delete this.pieces[object.id]; 
      },

      // remove piece from dom
      hide : function(object) {
         this.el.removeChild(object.el);
      },

      // show piece in dom
      show : function(object) {
         this.el.appendChild(this.pieces[object.id].el);
      },

      step : function () {
         for (var i = 0, len = this.pieces.length; i < len; i++) {
            this.pieces[i].step();
         }
      }
   });


   /**
    * The main game object
    * room - room to change to
    * side - a string representing which side to put the next room on
    *        eg: left, right, top, bottom
    */
   var Jarl = Game.extend({
      // vars
      room : null,
      players : [],
      turn : null,
      beginTurns : function() {

      },

      clockSort : function() {

      },

      takeTurnSquare : function(x, y, callback) {
         if (this.turn.type === "player") {
            callback(this.room.grid[x/32][y/32], this.room.itemGrid[x/32][y/32]);
            this.beginTurns();
         }
      },

      takeTurn : function(callback) {
         if (this.turn.type === "player") {
            callback();
            this.beginTurns();
         }
      },

      // functions


      /**
       * Changes the room visible
       */
      changeRoom : function(newRoom) {

         this.hide(this.room);
         this.room = newRoom;
         this.add(newRoom);

         Messages.move(newRoom.width * 32, 0);

      },

      addPlayer : function(player) {
         this.add(player);
         this.players;
         player.x = Math.floor(this.room.width / 2) * 32;
         player.y = Math.floor(this.room.height / 2) * 32;
         player.room = this.room;
         player.bind();
         player.step();

         this.turn = player;
      },

      begin : function () {
         this.room = LevelGen.begin();
         this.add(this.room);
         Messages.move(this.room.width*32);
      }
   });


   var Messages = {
      el : document.getElementById("text"),
      last : null, // the last element pushed
      push : function (text) {
         var message = document.createElement("div");
         message.innerHTML = text;
         message.className = "mess";

         this.el.insertBefore(message, this.last);

         this.last = message;
      },
      move : function(x, y) {
         this.el.style.left = x + "px";
         this.el.style.top = y + "px";
      }
      
   };

   Messages.push('Welcome to Jarl <br> push "?" for instructions');
   Messages.push('You entered level 1');


   var Gamepiece = Extendable.extend({
      x : 0,
      y : 0,
      z : 0,
      id : null,
      blocking : false,
      className : "fixed trans",

      trigger : function () {},

      // create the dom element for this piece
      create : function() {
         this.el           = document.createElement("img");
         this.el.className = this.className;
         this.el.src       = this.src;
         this.el.style.zIndex = this.z;
         this.step();
      },

      // this is called to update the Game Piece
      step : function () {
         var flipped         = this.flipped ? " flipped" : "";
         this.el.style.left = this.x +"px";
         this.el.style.top  = this.y + "px";
         this.el.className  = this.className + flipped;
      },

      move : function (x,y) {
         this.x = x;
         this.y = y;
         this.step();
      },

      // move relative
      moveRel : function (x,y) {

         var that = this;

         // attempt to take turn
         Jarl.takeTurnSquare(
            this.x + x,
            this.y + y,
            function(square, item) {
               if (square.blocking === false && (item === null || item.blocking === false)) {
                  var newx = that.x + x;
                  that.flipped = (newx === that.x) ? // is it the same
                     that.flipped : // true: keep it the same
                     newx  < that.x ? // false flip it 
                        true : false;  // left if smaller right if bigger

                  that.x += x;
                  that.y += y;
                  that.step();
               } else {

                  that.el.style.left  = that.x + (x * 0.5) + "px";
                  that.el.style.top   = that.y + (y * 0.5) + "px";

                  window.setTimeout(function () {
                     that.el.style.left  = that.x + "px";
                     that.el.style.top   = that.y + "px";
                  }, 200);
               }

               square.trigger(that);
               if (item != null) {
                  item.trigger(that);
               }
            });

      }
   });


   var Player = Gamepiece.extend({
      type : 'player',
      blocking : true, // means other object cant move through him
      src : "night.min.gif",
      z : 4,
      hp : 100,
      stats : function() {
         var html = "<img class='left' src='" + this.src + "'>";

         var hp = "HP = ["

         for (var i = 0, len = this.hp / 2; i < len; i++) {
            hp += "="
         }

         for (var i = 0, len = 50 - this.hp / 2; i < len; i++) {
            hp += " "
         }
         hp += "]"

         html += hp;
         return html;
      },
      bind : function() {

         var me = this;


         Mousetrap.bind(["left", "h"], function() {
            me.moveRel(-32, 0);
         }, 'keyup');

         Mousetrap.bind(["right", "l"], function() {
            me.moveRel(32, 0);
         }, 'keyup');

         Mousetrap.bind(["up", "k"], function() {
            me.moveRel(0, -32);
         }, 'keyup');

         Mousetrap.bind(["down", "j"], function() {
            me.moveRel(0, 32);
         }, 'keyup');

         Mousetrap.bind(["y"], function() {
            me.moveRel(-32, -32);
         }, 'keyup');

         Mousetrap.bind(["u"], function() {
            me.moveRel(32, -32);
         }, 'keyup');

         Mousetrap.bind(["n"], function() {
            me.moveRel(-32, 32);
         }, 'keyup');

         Mousetrap.bind(["m"], function() {
            me.moveRel(32, 32);
         }, 'keyup');

         Mousetrap.bind(["?"], function() {

            var help = [
               "---Controls---",
               "arrow keys - move",
               "~ or ~",
               "h - left",
               "j - down",
               "k - up",
               "l - right",
               "y - up-left",
               "u - up-right",
               "n - down-left",
               "m - down-right",
               "",
               "i - view inventory",
               "---GamePlay---",
               "move twards an enemy to attack"];

               Messages.push(help.join("<br />"));
         });
      }
   });

   var Wall = Gamepiece.extend( {
      type : 'wall',
      blocking : true,
      src : 'wall.min.gif',
   });

   var Door = Gamepiece.extend({
      type : 'door',
      src : 'door.gif',

      trigger : function (piece) {
         piece.room = this.to;
         var fromDoor = this;
         var cord = this.to.doorPlacement(Directions.opposite(fromDoor.placement));

         piece.move(cord.x * 32, cord.y * 32);

         if (piece.type === "player") {
            Jarl.changeRoom(this.to, this.placement);
         }
      }

   });

   Door.create();

   var Ground = Gamepiece.extend( {
      type : 'ground',
      src : 'ground.min.gif',
   });

   Ground.create();


   var Room = Extendable.extend({

      // create the room
      init : function(height, width, doorObj) {
         this.x = 0;
         this.y = 0;
         this.height = height;
         this.width = width;

         this.grid = [];
         this.itemGrid = [];


         // populate grid with ground / null
         for (var i = 0; i < width; i++) {
            this.grid[i] = [];
            this.itemGrid[i] = [];
            for (var j = 0; j < height; j++) {
               this.grid[i][j] = Ground.extend({x : i * 32, y : j *32});
               this.itemGrid[i][j] = null;
            }
         }

         this.doorObj = doorObj;

         this.createWalls();
         this.createItems();
      },

      /**
       * doorPlacement
       *
       * way : door direction
       * distance : how far inside the room (negative numbers outside)
       *
       * returns {x, y} : in cell units NOT pixels
       */
      doorPlacement : function (way, distance) {
         var x = 0;
         var y = 0;
         if (distance !== 0) {
            distance = distance || 1;
         }

         switch (way) {
            case 'top':
               y = distance;
               x = Math.floor(this.width / 2);
               break;

            case 'bottom':
               y = this.height - 1 - distance;
               x = Math.floor(this.width / 2);
               break;

            case 'left':
               x = distance;
               y = Math.floor(this.height / 2);
               break;

            case 'right':
               x = this.width - 1 - distance;
               y = Math.floor(this.height / 2);
               break;
         }

         return {
            x : x,
            y : y,
         };
      },


      // creates the walls based on the height, width, door placement
      createWalls : function() {
         //top
         this.createHozWall(0, this.doorObj.top)

         //bottom
         this.createHozWall(this.height-1, this.doorObj.bottom)

         //left
         this.createVertWall(0, this.doorObj.left)

         //right
         this.createVertWall(this.width-1, this.doorObj.right)
      },

      createItems : function() {
         // run type function listed below
         this.types[this.type](this);
      }, 

      types : {
         beginning : function(room) {
            var x = Math.floor(room.width/2) - 2;
            var y = Math.floor(room.height/2);
            room.itemGrid[x][y] = Items.sign.extend({
               text : "SIGN: Welcome to the dungeons of Jarl, many have entered, few have returned.",
               x : x*32,
               y : y*32,
               room : room
            });

            var cord = room.doorPlacement("bottom", 0);

            room.itemGrid[cord.x][cord.y] = Items.finalDoor.extend({
               x : cord.x*32,
               y : cord.y*32,
               room : room
            });
         },
         random : function(room) {
            
         },
         end : function(room) {
            var xcenter = Math.floor(room.width/2);
            var ycenter = Math.floor(room.height/2);
            room.itemGrid[xcenter][ycenter] = Items.finalKey.extend({
               x : xcenter*32,
               y : ycenter*32,
               room : room
            });
         }
      },

      removeItem : function (x, y) {
         x = x/32;
         y = y/32;
         var item = this.itemGrid[x][y];
         this.itemGrid[x][y] = null;
         this.el.removeChild(item.el);
      },

      createVertWall : function(x, door) {
         var i = this.height;

         while(i--) {
            this.grid[x][i] = Wall.extend({x : x * 32, y : i * 32});
         }

         // add the door if needed
         if (door !== null) {
            var y = Math.floor(this.height/2);
            this.grid[x][y] = door;
            door.x = x*32;
            door.y = y*32;
         }
      },

      createHozWall : function(y, door) {
         var i = this.width;

         while(i--) {
            this.grid[i][y] = Wall.extend({x : i*32, y : y*32});
         }

         // add the door if needed
         if (door !== null) {
            var x = Math.floor(this.width/2);
            this.grid[x][y] = door;
            door.x = x*32;
            door.y = y*32;
         }
      },

      create : function() {
         this.el = document.createElement("div");
         this.el.width = this.width * 32;
         this.el.height = this.height * 32;
         this.el.class = "fixed";
         this.el.style.top = 0;
         this.el.style.left = 0;

         // draw all elements in the grid
         for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
               var square = this.grid[i][j];
               var item = this.itemGrid[i][j];

               if (square !== null) {
                  square.create();
                  this.el.appendChild(square.el);
                  square.step();
               }
               if (item !== null) {
                  item.create();
                  this.el.appendChild(item.el);
                  item.step();
               }
            }
         }

      },


      // show the room in the console
      log : function() {
         // populate grid with null

         var text = "";
         // go across the height
         for (var i = 0; i < this.height; i++) {
            var line = "";
            // go across the width
            for (var j = 0; j < this.width; j++) {
               var spot = this.grid[j][i];
               var letter;

               if (typeof spot === "undefined") {
                  letter = "?";
                  line += letter;
                  continue;
               }

               if (spot!== null && typeof spot.type !== "undefined" && spot.type == "door") {
                  letter = "d"
               } else {
                  switch (spot) {
                     case 'wall':
                        letter = "w"
                     break;
                     case 'hidden':
                        letter = "h"
                     break;
                     case null:
                        letter = "."
                     break;
                     default:
                        letter = "~"
                  }
               }

               line += letter;
            }
            text += line + "\n";
         }

         console.log(text);

      },

      /**
       * applies a function to all the objects 
       */
      apply : function(func) {

      }


   });

   // handles directions
   var Directions = Extendable.extend({

      directions : [
         "left",
         "top",
         "right",
         "bottom"
      ],

      randomNum : function () {
         return Math.floor(Math.random() * 4);
      },

      random : function () {
         return this.numToName(this.randomNum());
      },

      opposite : function (dirName) {
         if (typeof dirName === "undefined") {
            console.error("direction does not exist", dirName);
            debugger;
         }
         return this.numToName((this.nameToNum(dirName) + 2) % 4)
      },

      numToName : function (dirNum) {
         if (typeof this.directions[dirNum] === "undefined") {
            console.error("invalid dirNum");
            debugger;
         }
         return this.directions[dirNum];
      },

      nameToNum : function (dirName) {
         if (this.directions.indexOf(dirName) === -1) {
            console.error("invalid dirName");
            debugger;
         }
         return this.directions.indexOf(dirName);
      }
   });

   /**
    * Generates a level
    */

   var LevelGen = Extendable.extend({
      depth : 3,
      branchChanse : 0.5,
      begin : function() {

         var root = Room.extend({
            type : "beginning",
            depth : this.depth
         });


         var firstRoom = this.roomGen(root, "top", true);


         var firstDoor = Door.extend({
            room : root,
            to : firstRoom,
            placement : "top"
         });

         var width = Math.floor(Math.random()*10) + 10;
         var height = Math.floor(Math.random()*10) + 10;

         root.init(width, height, {
            top : firstDoor,
            left : null,
            right : null,
            bottom : null
         });

         return root;
      },
      // generates a random graph of rooms
      roomGen : function(roomFrom, directionFrom, isRightPath) {
         var rightDir = "";
         var doors = { 
            top : null,
            bottom : null,
            left : null,
            right : null
         };

         var room = Room.extend({
            depth : roomFrom.depth - 1,
            isRightPath : isRightPath,
            type : "random"
         });

         // place door to go back
         doors[Directions.opposite(directionFrom)] = Door.extend({
            room : room,
            to : roomFrom,
            placement : Directions.opposite(directionFrom)
         });


         // if we aren't too deep yet
         if (room.depth > 1) {

            // if this is the right path
            if (isRightPath) {

               // check to make sure it's not occupied
               do {
                  rightDir = Directions.random();
                  //repeat till we have one!
               } while (doors[rightDir] !== null);
              

               // place the right door path
               doors[rightDir] = Door.extend({
                  room : room,
                  to : this.roomGen(room, rightDir, true),
                  placement : rightDir
               });
            };


            // go through the directions
            // and create other offshoots from the right path
            for(var wayName in doors) {
               var make = Math.random() > 0.2;

               //if we should make it and it's not taken
               if (make && doors[wayName] === null) {
                  // create the door and the room behind it
                  doors[wayName] = Door.extend({
                     from : room,
                     to :this.roomGen(room, wayName,false),
                     placement : wayName
                  });
               }
            }
         } else if(isRightPath) { 
            room.type = "end";
         }

         var width = Math.floor(Math.random()*10) + 5;
         var height = Math.floor(Math.random()*10) + 5;

         room.init(height, width, doors);

         return room;
      }
   });

   var Items = {
      finalKey : Gamepiece.extend({
         name : "Final Key",
         description : "The way out of this place",
         src : "finalKey.gif",
         trigger : function () { 
            Inventory.add(this) 
            this.room.removeItem(this.x,this.y);
         }
      }),
      finalDoor : Gamepiece.extend({
         src : "finalDoor.gif",
         trigger : function () {
            if (Inventory.contains("Final Key")) {
               alert("Congradulations you won Jarl! Thanks for playing my game I hope you enjoyed it!");
            } else {
               Messages.push("Doors locked tight! The Only way out is to find the key.");
            }
         }
      }),
      sign : Gamepiece.extend({
         src : "sign.gif",
         blocking : true,
         trigger : function () {
            Messages.push(this.text);
         }
      })
   };

   var Inventory  = Extendable.extend({
      size : 20,
      items : [],
      selected : 0,
      show : false,
      construct : function () {
         this.el = document.getElementById("inventory");
         this.el.style.display = this.show ? "" : "none";
         var that = this;
         Mousetrap.bind(["i"], function() {
            that.toggleShow();
         });
         this.update();
      },
      add : function (item) {
         if (this.items.length < this.size) {
            this.items.push(item);
            Messages.push(item.name + " was added to your invenetory");
         }

         this.update();
      },
      create : function () {
      },
      toggleShow : function () {
         this.show = !this.show;
         this.el.style.display = this.show ? "" : "none";

         console.log("inventory", this.el)
      },
      update : function () {
         var html =
            Player.stats() +
            "<p><strong>INVENTORY</strong></p>"  + 
            "<ul>";

         for (var i = 0, len = this.items.length; i < len; i++) {
            var item = this.items[i];

            html += "<li class='" + (this.selected == i ? "selected" : "") + "'>";
               html += "<img class='left' src='" + item.src + "' />";
               html += "<strong>" + item.name + "</strong>: " + item.description ;
            html += "</li>";
         }

         if (this.items.length === 0) {
            html += "<li>Inventory is empty</li>";
         }

         html += "</ul>";

         this.el.innerHTML = html;
      },
      contains : function (name) {
         for (var i = 0, len = this.items.length; i < len; i++) {
            var item = this.items[i];
            if (item.name === name) {
               return true;
            }
         }

         return false;
      }
   });

   Jarl.begin();
   Jarl.addPlayer(Player);
//})();
