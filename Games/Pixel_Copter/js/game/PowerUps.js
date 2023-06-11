(function(root) {


    var PowerUps = HelicopterGame.Entity.extend({

        // public properties
        view: null,
        body: null,
        physics: null,

        image:null,
        imageUrl:'images/fuel_icon_22.png',
        isPlaying:true,
        counter:0,

        init: function(){

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

            this.body = new HelicopterGame.Body(this);
            this.body.x = -30;
            this.body.y = 0;
            this.body.rotation = (90 * Math.PI * 2) - Math.PI;
            this.setBody(this.body);

            this.physics = this.getPhysics();
            this.physics = new HelicopterGame.Physics(this);

            this.view = this.getView();
            this.view = new HelicopterGame.View();
            this.view.alpha =1;

            var that = this;

            this.image = new Image();
            this.image.src = this.imageUrl;

            this.view.spritePainter = {
                paint:function(sprite,context){
                    if(that.image.complete){
                        that.view.local(that.body.x, that.body.y);
                        that.view.strokeCircle(-1,0,18,2,'#333333');
                        that.view.drawImage(that.image, -that.image.width/2, -11, that.image.width, that.image.height);
                        that.view.unlocal();
                    }
                    that.counter++;
                }

            }

            this.view.sprite = new Sprite('PowerUps', this.view.spritePainter);
            console.log("painting the PowerUps sprite");
            this.view.spritePainter.paint(this.view.sprite, context);
        },

        render: function(){

            /*--o render - UPDATE VIEW
            Applying the new body variable to our view to draw the sprite on the context;
            */

            this.view.spritePainter.paint(this.view.sprite, context);
        },

        update: function(){

            /*--o update -  UPDATE BODY
            Applying the new physical changes to our body
            */

            if(this.isPlaying && this.body.x>-30) this.body.x -=4;
        },

        addFuelItem: function(yPos, height){
            console.log('yPos: '+yPos+' height: '+height);
            this.body.y = (yPos+25) + (Math.random()*(height-50));
            // this.body.y = (yPos+11) + (Math.random()*height) - 11;
            this.body.x=fullWidth;
        },
        powerUpToken: function(){
            this.body.x = -30;
        },
        endGame: function(){
            this.isPlaying = false;
        }
    });

root.HelicopterGame.PowerUps = PowerUps;

})(window);