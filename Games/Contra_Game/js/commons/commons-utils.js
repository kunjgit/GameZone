var commons = commons || {};

commons.game = {

    teams : {
        "B": {tid: "B", name: "Red", color: "#0000FF"},
        "R": {tid: "R", name: "Red", color: "#FF0000"},
        "G": {tid: "G", name: "Green", color: "#00FF00"},
        "Y": {tid: "Y", name: "Yellow", color: "#00FFFF"},
        "U": {tid: "U", name: "Unknown", color: "#FFFFFF"},
    },

    getColorForTeam: function(tid){

        var team = this.teams[tid] || commons.game.teams["U"];
        return team.color;
    },
    effect_ExplodeOnTarget: function (target) {

        var explosion = me.pool.pull("explosion-1", target.pos.x, target.pos.y);
        me.game.world.addChild(explosion, 99);
    },
};

commons.me = {

    textureSpriteHelper : function(texture, imgPrefix, mappings){

        var fileNames = [];
        var animations = {};

        mappings.forEach(statemap => {

            var name = statemap["name"];
            var frames = statemap["frames"];
            var delay = statemap["delay"] || 200;

            animations[name] = [];

            frames.forEach(frameIdx => {

                var fileName = imgPrefix + ( frameIdx < 10 ? "_0" : "_" );
                fileName += frameIdx.toString() + ".png";

                fileNames.push(fileName);
                animations[name].push({name: fileName, delay: delay});
            });
        });


        var sprite = texture.createAnimationFromName(fileNames);

        for(var animState in animations){
            sprite.addAnimation(animState, animations[animState]);
        }
        return sprite;
    }
};
