(function(root) {


    var Map = HelicopterGame.Entity.extend({

        // public properties
        view: null,
        body: null,
        physics: null,

        color: '#CCCCCC',
        wallBlockWidth: 4,
        wallBlocksArray: [],
        counter:0,
        level:2,
        levelFrequency:2000,
        levelIncreament:1100,

        heightReductionByLevel: 0,

        sineWaveCounter: 0,
        sineWaveIncrease: 0,
        lastYPos:300,
        lastHeight:300,

        _helicopter: undefined,
        isPlaying: true,

        // constructor
        init: function()
        {
            this.sineWaveIncrease= Math.PI * 2 / (400-(this.level*30));

            /*
             *BODY: x, y , angle(rotate) etc.
            * If you give an entity a body it can take physical form in the world,
            * although to see it you will need a view.
            *
            *VIEW: sprite and its alpha, scale, color etc. and set the Body's x,y,angle variables
            * View is display component which renders an Entity using the standard display list.
             *
             *PHYSICS: mr, mx, my, speed-> writes the Body's x,y,angle variables so that view can read
              * Provides a basic physics step without collision detection.
             * Extend to add collision handling.
            */

            this.body = this.getBody();
            this.body = new HelicopterGame.Body(this);
            this.body.rotation = 0;
            this.body.radius = 20;


            this.physics = new this.getPhysics();
            this.physics = new HelicopterGame.Physics(this);
            this.physics.mr = 0;
            this.physics.mx = (Math.random()*5)-3;
            this.physics.my = (Math.random()*5)-3;

            this.view = new this.getView();
            this.view = new HelicopterGame.View();
            this.view.alpha =1;

            var that = this;

            var wallBlockObj;
            this.heightReductionByLevel = (this.level*40);
            var prevHeight= 585-this.heightReductionByLevel;

            for(i=0; i<(fullWidth/this.wallBlockWidth); i++){
                var newHeight = this.getNewHeightValue(prevHeight);
                var newYPos = this.getNewYPosValue(newHeight);

                wallBlockObj = {xPos:i*this.wallBlockWidth, yPos:newYPos, height:newHeight}
                this.wallBlocksArray.push(wallBlockObj);

                prevHeight = newHeight;
            }

            this.view.spritePainter = {

                paint: function (sprite, context, isWithNewWallObject) {
                    var wallBlockObj;

                    that.view.local(that.body.x, that.body.y);

                    if(isWithNewWallObject){
                        that.wallBlocksArray.shift();
                        //console.log('new xPos : '+Number(that.wallArray[that.wallArray.length-1].xPos+that.wallBlockWidth))
                        var lastWallBlockObj = that.wallBlocksArray[that.wallBlocksArray.length-1];

                        var newHeight = that.getNewHeightValue(lastWallBlockObj.height);
                        var newYPos = that.getNewYPosValue(newHeight);
                        that.lastYPos = newYPos;
                        that.lastHeight = newHeight;

                        wallBlockObj = {xPos:lastWallBlockObj.xPos+that.wallBlockWidth, yPos:newYPos, height:newHeight}
                        that.wallBlocksArray.push(wallBlockObj);
                    }




                    for(var i=0; i<that.wallBlocksArray.length; i++){
                        wallBlockObj = that.wallBlocksArray[i];
                        that.view.fillRect(wallBlockObj.xPos, wallBlockObj.yPos, that.wallBlockWidth, wallBlockObj.height, that.color);
                        //if( (typeof that._helicopter!=='undefined')  && (that.counter%10===0) && (i%10===0)) console.log('wallBlockObj.xPos: '+(wallBlockObj.xPos+that.body.x)+ ' wallBlockObj.yPos: '+wallBlockObj.yPos+ '  helicopter.y: '+that._helicopter.body.y);
                        if((wallBlockObj.xPos+that.body.x)>232 && (wallBlockObj.xPos+that.body.x)<327){


                            if((typeof that._helicopter!=='undefined') && that._helicopter.body.y+20< wallBlockObj.yPos ){
                                // console.log('collision');
                                that.isPlaying=false;
                            }
                            if((typeof that._helicopter!=='undefined') && that._helicopter.body.y-5 > wallBlockObj.yPos+wallBlockObj.height ){
                                // console.log('collision');
                                that.isPlaying=false;
                            }
                        }

                    }
                    that.view.unlocal();

                    that.view.local(that.body.x, that.body.y);
                    //power up

                    that.view.unlocal();

                }
            };
            this.view.sprite = new Sprite('asteroid'+Math.random()*100, this.view.spritePainter);
            this.view.spritePainter.paint(this.view.sprite, context);

        },

        render: function(){

            /*--o render - UPDATE VIEW
            Applying the new body variable to our view to draw the sprite on the context;
            */

            if((this.body.x % this.wallBlockWidth) === 0 && this.body.x !==0 && this.isPlaying ){
                this.view.spritePainter.paint(this.view.sprite, context, true);
            }else{
                this.view.spritePainter.paint(this.view.sprite, context, false);
            }
        },

        update: function(){

            /*--o update -  UPDATE BODY
            Applying the new physical changes to our body
            */

            if(this.isPlaying){

                this.body.x -= 4;

                if((this.counter % this.levelFrequency)===0){
                    this.level++;
                    this.levelFrequency += this.levelIncreament;
                }

                this.counter++;
                HelicopterGame.UI.displayDistance(this.counter*0.1);

            }
        },

        getNewHeightValue: function(lastHeightValue){
            this.heightReductionByLevel = (this.level*40);

            var increament = 8;
            var newHeightValue;
            if(lastHeightValue>=(fullHeight-20)-this.heightReductionByLevel){
                newHeightValue =lastHeightValue-increament;
            }else if(lastHeightValue<(fullHeight-150)-this.heightReductionByLevel){
                newHeightValue =lastHeightValue+increament;
            }else{
                newHeightValue = ((Math.random()*1)>0.5)? lastHeightValue+increament : lastHeightValue-=increament;
            }
            return newHeightValue;
        },

        getNewYPosValue: function(height){
            var yPos = Math.sin(this.sineWaveCounter ) / 2 + 0.5;
            yPos = ((fullHeight-180)/2)+(yPos*180);
            this.sineWaveCounter += this.sineWaveIncrease;

            yPos -=(height/2);

            return yPos;
        },

        testCollision: function(helicopter){
            this._helicopter = helicopter
        },
        isGameOver: function(){
            return !this.isPlaying;
        },

        endGame: function () {
            this.isPlaying = false;
        }
    });

root.HelicopterGame.Map = Map;

})(window);