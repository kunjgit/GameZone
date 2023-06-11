(function(root) {


    var Helicopter = HelicopterGame.Entity.extend({

        // public properties
        view: null,
        body: null,
        physics: null,

        gamePad: null,

        color: '#FF0000',
        helicopterColor: '#666666',
        helicopterExplosionColor: '#333333',
        helicopterExplosionScale:1,
        smokeColor: '#666666',
        helicopterBodyShape:null,
        helicopterCrashedBodyShape: null,
        smokesArray:[],
        smokeFrequency:10,
        counter:0,
        isPlaying:true,
        hasFuel:true,


        // constructor
        init: function()
        {
            var helicopterXOffset= -52
            var helicopterYOffset= -15
            this.helicopterBodyShape= [
            [0+helicopterXOffset, 9.5+helicopterYOffset, 4, 10],
            [0+helicopterXOffset, 15.5+helicopterYOffset, 73, 4],
            [40.5+helicopterXOffset, 9.25+helicopterYOffset, 28, 18],
            [68+helicopterXOffset, 15.5+helicopterYOffset, 12, 7.5],
            [63+helicopterXOffset, 19.5+helicopterYOffset, 12, 7.5],
            [29+helicopterXOffset, 15.5+helicopterYOffset, 12, 7.5],
            [15.5+helicopterXOffset, 2+helicopterYOffset, 77, 3.5],
            [51.5+helicopterXOffset, 0+helicopterYOffset, 6, 2],
            [51.5+helicopterXOffset, 6+helicopterYOffset, 6, 3.5]
            ];
            this.helicopterCrashedBodyShape=[
            [37-32, 0-32],
            [40-32, 19-32],
            [63-32, 20-32],
            [48-32, 31-32],
            [64-32, 50-32],
            [40-32, 41-32],
            [30-32, 62-32],
            [23-32, 41-32],
            [0-32, 38-32],
            [20-32, 29-32],
            [5-32, 10-32],
            [29-32, 22-32],
            ];

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
            this.body.x = 280;
            this.body.y = 200;
            this.body.rotation = (90 * Math.PI * 2) - Math.PI;
            this.body.radius = 15;
            this.setBody(this.body);

            this.physics = this.getPhysics();
            this.physics = new HelicopterGame.Physics(this);
            this.physics.mr = 0;
            this.physics.mx = 0;
            this.physics.my = 0;

            this.view = this.getView();
            this.view = new HelicopterGame.View();
            this.view.alpha =1;
            var that = this;
            this.view.spritePainter = {

                paint: function (sprite, context) {
                    // helicopter
                    if(that.isPlaying){
                        that.view.local(that.body.x, that.body.y, that.body.rotation);
                    }else{
                        that.view.local(that.body.x, that.body.y+15, that.body.rotation);
                    }



                    if(that.isPlaying){
                        var helicopterShapeObj;
                        for(i=0;i<that.helicopterBodyShape.length;i++){
                            if(i==6 && (that.counter%2)===0){
                                helicopterShapeObj = that.helicopterBodyShape[6];
                                if(helicopterShapeObj[2]==77){
                                    helicopterShapeObj[0] =15.5+20-52;
                                    helicopterShapeObj[2] =40;
                                }else if(helicopterShapeObj[2]==40){
                                    helicopterShapeObj[0] =15.5-52
                                    helicopterShapeObj[2] =0;
                                }else if(helicopterShapeObj[2]==0){
                                    if((that.counter%5)===0){
                                        helicopterShapeObj[0] =15.5+20-52;
                                        helicopterShapeObj[2] =39;
                                    }
                                }else if(helicopterShapeObj[2]==39){
                                    helicopterShapeObj[0] =15.5-52
                                    helicopterShapeObj[2] =77;
                                }
                            }
                            that.view.fillRect(that.helicopterBodyShape[i][0],that.helicopterBodyShape[i][1],that.helicopterBodyShape[i][2],that.helicopterBodyShape[i][3],that.helicopterColor);
                        }
                    }else{
                        var alpha = 1-(that.helicopterExplosionScale/2);
                        that.view.fillPolygon(that.helicopterExplosionColor, 5, that.helicopterCrashedBodyShape, that.helicopterExplosionScale, (that.helicopterExplosionScale*1), 0, 0, alpha);
                        if(that.helicopterExplosionScale<1.9){
                            that.helicopterExplosionScale +=0.05;
                        }else{
                            that.helicopterExplosionScale = 2;
                        }
                    }

                    that.view.unlocal();
                    that.view.local(that.body.x, that.body.y);

                    if(that.isPlaying && (that.counter % that.smokeFrequency===0)) {
                        var smoke = {xPos:-52, yPos:that.body.y-5-(that.body.rotation*50), width:10, height:10, alpha:1};
                        that.smokesArray.push(smoke);
                    }

                    for (i=that.smokesArray.length-1; i>=0; i--) {
                        that.smokesArray[i].xPos -= 4;
                        that.smokesArray[i].width += 0.2;
                        that.smokesArray[i].height += 0.2;
                        that.smokesArray[i].alpha -= 0.01;
                        that.view.fillRect(that.smokesArray[i].xPos, that.smokesArray[i].yPos-that.body.y, that.smokesArray[i].width, that.smokesArray[i].height, that.smokeColor, that.smokesArray[i].alpha);

                        if (that.smokesArray[i].alpha<0) {
                            that.smokesArray.splice(i,1);
                        }
                    }
                    that.view.unlocal();

                    that.counter++;
                }
            };
            this.view.sprite = new Sprite('helicopter', this.view.spritePainter);
            console.log("painting the Helicopter sprite");
            this.view.spritePainter.paint(this.view.sprite, context);

            this.gamePad = new HelicopterGame.GamePad();

        },

        render: function()
        {
            /*--o render - UPDATE VIEW
            Applying the new body variable to our view to draw the sprite on the context;
            */
            this.view.spritePainter.paint(this.view.sprite, context);
        },

        update: function()
        {
            /*--o update -  UPDATE BODY
            Applying the new physical changes to our body
            */

            if(!this.isPlaying) return;

            this.gamePad.checkInput();

            // y coordinate
            if (this.gamePad.isKeyPressed('SPACE') && this.hasFuel) {
                this.physics.my -= this.physics.thrust;
            }

            this.physics.my += this.physics.gravity;

            // rotation
            this.physics.mr =Math.atan2(this.physics.my/2, this.body.x);
            this.body.rotation = this.physics.mr*180/Math.PI;

            this.body.y += this.physics.my;

        },
        endFuel: function(){
            this.hasFuel = false;
        },
        endGame: function(){
            this.isPlaying = false;
        }
    });

var main = this;
root.HelicopterGame.Helicopter = Helicopter;

})(window);