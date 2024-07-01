/* global GameCtrl */

(function(){
'use strict';
GameCtrl.Stage01 = function () {

        //        When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
/*
    this.game;                //        a reference to the currently running game
    this.add;                //        used to add sprites, text, groups, etc
    this.camera;        //        a reference to the game camera
    this.cache;                //        the game cache
    this.input;                //        the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;                //        for preloading assets
    this.math;                //        lots of useful common math operations
    this.sound;                //        the sound manager - add a sound, play one, set-up markers, etc
    this.stage;                //        the game stage
    this.time;                //        the clock
    this.tweens;        //        the tween manager
    this.world;                //        the game world
    this.particles;        //        the particle manager
    this.physics;        //        the physics manager
    this.rnd;                //        the repeatable random number generator
*/
    //        You can use any of these from any function within this State.
    //        But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

GameCtrl.Stage01.prototype = {
    
    /**
     * Draw the distance
     */
    _createMeters:function(){
        var graphics = this.add.graphics(0, 0);
        var x;
        for(var i=10;i>=0;i--){
            x=(10-i)*780;
            this.add.text(x+15, 694, (i*10)+' m', {
                font : '46px "arcadeclasic"',
                fill : '#fff',
                align : 'left'
            });

            
            graphics.lineStyle(2, 0x000000, 1);
            graphics.beginFill(0x000000, 1);
            graphics.drawRect(x, 690, 130, 50);
            graphics.lineStyle(5, 0xd42700, 1);
            graphics.drawRect(x+5, 695, 120, 40);
            
        }


    },
    /**
     * Create player group (the clown and the lion)
     */
    _createPlayer:function(){
        this.lion=this.add.sprite(85, 630, 'clown','lion0000');
        this.physics.enable(this.lion, Phaser.Physics.ARCADE);
        

        this.lion.body.setSize(90, 50, -5, 0);
        
        this.clown=this.game.add.sprite(7, -22, 'clown','clownStand0000');
        this.physics.enable(this.clown, Phaser.Physics.ARCADE,true);
        this.lion.addChild(this.clown);
        
        
        this.lion.scale.x =3;
        this.lion.scale.y =3;
        

        this.lion.animations.add('runLion', Phaser.Animation.generateFrameNames('lion', 0, 2, '', 4), 3 /*fps */, true);
        this.lion.animations.add('idleLion', Phaser.Animation.generateFrameNames('lion', 0, 0, '', 4), 1 /*fps */, true);
        

        this.clown.isRunning=false;
        this.lion.body.collideWorldBounds=true;
        
    },

    /**
     * Create the static obstacles (firepots)
     */
    _createObstacles:function(){
        this.obstacles=this.add.group();
        var w=this.world.bounds.width-800;
        for (var i = 1200; i < w; i+=800){
            var firepot=this.add.sprite(i, 585, 'clown','firepot0000');
            this.physics.enable(firepot, Phaser.Physics.ARCADE);
            firepot.body.setSize(38, 48, -14, -15);
            //firepot.body.setPolygon( 10,0,14,0,20,30, 5,30 );
            firepot.body.x=i;
            firepot.body.y=600;
            firepot.body.immovable = true;
            firepot.scale.x=3;
            firepot.scale.y=3;
        
            this.obstacles.add(firepot);
            
        }

        this.obstacles.callAll('animations.add', 'animations', 'burnPot', Phaser.Animation.generateFrameNames('firepot', 0, 1, '', 4), 10, true);
        this.obstacles.callAll('animations.play', 'animations', 'burnPot');
    },
    _createFireCirclesLeft:function(){
        var burnCircleLeft=Phaser.Animation.generateFrameNames('firecirclel', 0, 1, '', 4);
        this.firecirclesLeft=this.add.group();
        for (var i = 800; i < this.world.bounds.width; i+=800){
            if(i%2){
                i-=300 + Math.floor(Math.random() * 100) + 1;
            }
            i++;

                        
            var fireCircleLeft=this.add.sprite(i, 335, 'clown','firecirclel0000');
            this.game.physics.enable(fireCircleLeft, Phaser.Physics.ARCADE);
            fireCircleLeft.animations.add('burnCircleLeft', burnCircleLeft, 5, true);

            this.firecirclesLeft.add(fireCircleLeft);
        }

        this.firecirclesLeft.setAll('scale.x',3);
        this.firecirclesLeft.setAll('scale.y',3);
        this.firecirclesLeft.setAll('body.velocity.x',-70);

        this.firecirclesLeft.callAll('animations.play', 'animations', 'burnCircleLeft');

    },
    _createFireCirclesRight:function(){
        var burnCircleRigth=Phaser.Animation.generateFrameNames('firecircler', 0, 1, '', 4);
        this.firecirclesRight=this.add.group();
        
        this.firecirclesLeft.forEach(function(e){
            var x =e.body.x+30;
            var fireCircleRight=this.game.add.sprite(x, 335, 'clown','firecircler0000');
            this.physics.enable(fireCircleRight, Phaser.Physics.ARCADE);
            fireCircleRight.animations.add('burnCircleRigth', burnCircleRigth, 5, true);
            
            this.firecirclesRight.add(fireCircleRight);
      
        },this);
        this.firecirclesRight.setAll('scale.x',3);
        this.firecirclesRight.setAll('scale.y',3);
        this.firecirclesRight.setAll('body.velocity.x',-70);
        
        this.firecirclesRight.callAll('animations.play', 'animations', 'burnCircleRigth');

    },
    _createFireCirclesCollision:function(){
        this.fireCollisionGroup=this.add.group();
        this.firecirclesLeft.forEach(function(e){
            var x =e.body.x+30;
        
            var touchFire = this.game.add.sprite(x-10, 554);
            this.physics.enable(touchFire, Phaser.Physics.ARCADE);
            touchFire.body.setSize(25, 150);
            this.fireCollisionGroup.add(touchFire);
        }, this);
        this.fireCollisionGroup.setAll('body.velocity.x',-70);
    },
    create: function () {
        this.gameover=false;
        this.music = this.add.audio('stage1');
        this.music.play();
        

        this.cursors =this.game.input.keyboard.createCursorKeys();
        this.world.setBounds(0,0,1024 * 8, 200);
        //this.background=this.game.add.tileSprite(0, 200, 1024, 552, 'background');
        this.background=this.add.tileSprite(0, 200, 1024 * 8, 552, 'stage01');



        this._createMeters();
        this._createFireCirclesLeft();
        this._createPlayer();
        this._createFireCirclesRight();
        this._createObstacles();
    
        this._createFireCirclesCollision();

        this.floor = this.game.add.sprite(0, 678);
        this.endStage=this.game.add.sprite(1024*8-300, 620, 'clown','endLevel1');
        this.physics.enable(this.floor, Phaser.Physics.ARCADE);
        this.physics.enable(this.endStage, Phaser.Physics.ARCADE);
        this.endStage.scale.x=3;
        this.endStage.scale.y=3;
        this.endStage.body.immovable = true;

        //this.endStage.body.checkCollision.left = false;
        //this.endStage.body.checkCollision.right = false;
        this.endStage.body.collideWorldBounds = true;


        this.floor.body.immovable = true;
        this.floor.body.collideWorldBounds = true;
        this.floor.body.width = this.game.world.width;

        this.recicleFireCirclesWall = this.game.add.sprite(-12, 600);
        this.physics.enable(this.recicleFireCirclesWall, Phaser.Physics.ARCADE);
        this.recicleFireCirclesWall.body.immovable = true;
        this.recicleFireCirclesWall.body.height = 500;
        this.recicleFireCirclesWall.body.width = 2;
         
    },
    triggerGameover: function(){
        var that=this;
        this.music.stop();
        this.failureSound=this.add.audio('failure');
        this.failureSound.play();
         
        setTimeout(function(){
            that.lion.animations.stop();
            that.clown.frameName='clownburn0000';
            that.lion.frameName='lionburn0000';

            that.lion.body.gravity.y=0;
            that.lion.body.speed=0;
            that.lion.body.velocity.y=0;
            that.lion.body.velocity.x=0;

            that.firecirclesRight.setAll('body.velocity.x',0);
            that.firecirclesLeft.setAll('body.velocity.x',0);
        },1);
        
        setTimeout(function(){
            that.game.state.start('Stage01');
            that.failureSound.stop();
        },3100);

        this.gameover=true;
    },
    _recicleFireCircle:function(){
        var fLeft=this.firecirclesLeft.getFirstExists();
        var fRight=this.firecirclesRight.getFirstExists();
        var fObstable=this.fireCollisionGroup.getFirstExists();
        fLeft.body.x=this.world.width;
        fRight.body.x=this.world.width+30;
        fObstable.body.x=this.world.width+20;
        fObstable.body.velocity.x=fLeft.body.velocity.x;
        
        this.firecirclesLeft.remove(fLeft);
        this.firecirclesLeft.add(fLeft);
        this.firecirclesRight.remove(fRight);
        this.firecirclesRight.add(fRight);
        this.fireCollisionGroup.remove(fObstable);
        this.fireCollisionGroup.add(fObstable);

    },
    triggerWin: function(){
        GameCtrl.data={textToRender:'STAGE 02', nextState:'Stage02' };
        setTimeout(function(_this){
            _this.game.state.start('Prestage');
        },10, this);
    },
    update: function () {
        if(this.gameover){
            return;
        }

        if(this.lion.body.x<(this.world.width-1600)){
            this.game.physics.arcade.collide(this.recicleFireCirclesWall,this.fireCollisionGroup, this._recicleFireCircle,null,this);
        }



        this.game.physics.arcade.collide(this.lion, this.fireCollisionGroup, this.triggerGameover, null, this);
        this.game.physics.arcade.collide(this.lion, this.obstacles, this.triggerGameover, null, this);

        
        this.game.physics.arcade.collide(this.lion, this.endStage, this.triggerWin, null, this);

        this.game.physics.arcade.collide(this.endStage, this.lion);
        this.game.physics.arcade.collide(this.floor, this.lion);


        this.lion.body.gravity.y=700;

        var isJumping=!this.lion.body.touching.down;

        this.game.camera.x=this.lion.x-100;
        if(isJumping){
            this.clown.frameName='clownStandJump0000';
            this.lion.frameName='lion0002';
        }else{
            this.clown.frameName='clownStand0000';
        }

        if (this.cursors.up.isDown&& !isJumping){
            this.lion.body.velocity.y=-480;
        }
        

        if(isJumping){
            // Mantengo la velocidad del fondo

            return;
        }

        if (this.cursors.right.isDown){
            this.clown.isRunning=true;
            //this.background.tilePosition.x -= 4;
            
            this.lion.body.velocity.x=200;
            this.lion.animations.play('runLion', 10, true);
        }else if (this.cursors.left.isDown){
            this.clown.isRunning=true;
            //this.background.tilePosition.x -= 4;
            
            this.lion.body.velocity.x=-100;
            this.lion.animations.play('runLion', 6, true);
        }else{
            this.lion.body.velocity.x=0;
                
            this.clown.isRunning=false;
            this.lion.animations.stop(0);
            this.lion.animations.play('idleLion');
        }


    },
    render: function(){
        /* global CIRCUSDEBUG */
//        CIRCUSDEBUG=true;
        if(CIRCUSDEBUG){
            this.game.debug.bodyInfo(this.lion, 32, 320);
            
            this.game.debug.body(this.lion);
            this.game.debug.body(this.clown);
            this.game.debug.body(this.recicleFireCirclesWall);

            this.game.debug.body(this.floor);
            this.obstacles.forEach(function (e) {
                this.game.debug.body(e);
            }, this);

            this.fireCollisionGroup.forEach(function (e) {
                this.game.debug.body(e);
            }, this);
        }

    

        /*this.game.debug.renderPhysicsBody(this.endStage.body);
        this.game.debug.renderPhysicsBody(this.floor.body);
        
        this.obstacles.forEach(function (e) {
                this.game.debug.renderPhysicsBody(e.body);
        }, this);*/
    },
    quitGame: function () {

            //        Here you should destroy anything you no longer need.
            //        Stop music, delete sprites, purge caches, free resources, all that good stuff.

            //        Then let's go back to the main menu.
            this.game.state.start('MainMenu');

    }

};

}());