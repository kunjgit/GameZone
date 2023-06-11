(function(root) {

    var UI = (function()
    {
        var that = this;
        var endDistance;
        var fuel = 100;
        var $$ = function(id) { return document.getElementById(id); },
            $intro = $$('intro'),

            $distance = $$('distance'),
            //$distance.style.color = '#666666';

            $fuel = $$('fuel');

        var _showEl = function(el)
        {
            el.style.display = 'block';
        };

        var _hideEl = function(el)
        {
            el.style.display = 'none';
        };

        var showIntro = function()
        {
            //root.HelicopterGame.Game.startGame();
            _showEl($intro);
            $$('begin').addEventListener('click', function(event) {
                // slight delay as a visual effect
                setTimeout(function() {
                    _hideEl($intro);
                    _showEl($distance);
                    _showEl($fuel);
                    that.game.startGame();
                }, 100);
            }, false);
        };

        var showEnd = function(settings)
        {
            var highScore;

            if(typeof localStorage.getItem('score') !=='undefined'){
                highScore = localStorage.getItem('score');
                console.log('endDistance: '+ endDistance+ ' highScore: '+highScore)
                if(Number(endDistance)>Number(highScore)){
                    console.log('new high Score')
                    //you broke your best score
                    localStorage.setItem('score', endDistance);
                    $$('end-info').innerHTML = "Congratulations!! You've beat your previous high score."
                    $$('end-highScore').innerHTML= "Your previous high score:"
                }
            }else{
                //first time played
                localStorage.setItem('score', endDistance);
                highScore = localStorage.getItem('score');
            }


            $$('end-distance').innerHTML = endDistance+' kms';
            $$('best-distance').innerHTML = highScore+' kms';
           // $$('end-weight').innerHTML = endWeight + ' grams';
            //$endColor.innerHTML = color;
            //$endColor.style.color = color;
            setTimeout(function() {
                _showEl($$('end'));
                $$('again').addEventListener('click', function(event) { document.location.reload(true); }, false);
            },500);
        };

        var displayDistance = function(meters)
        {
            endDistance = meters.toFixed(1);
            $distance.innerHTML ='Distance: '+endDistance+' kms';
        };

        var displayFuel = function(isDecreament)
        {
            if(isDecreament){
                fuel -=0.035;
            }else{
                fuel+=50
                if(fuel>100) fuel =100;
            }
            $$('remaining').style.width = Math.floor(fuel) + 'px';
        };
        var getFuel = function(){
            return fuel;
        }

        return {
            getFuel: getFuel,
            showIntro: showIntro,
            showEnd: showEnd,
            displayDistance: displayDistance,
            displayFuel: displayFuel
        };

    })();

    root.HelicopterGame.UI = UI;

})(window);