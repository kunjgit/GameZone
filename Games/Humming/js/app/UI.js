(function(root) {

	var UI = (function()
	{
		var $$ = function(id) { return document.getElementById(id); },
			$intro = $$('intro'),
			$weight = $$('weight'),
			$energy = $$('energy');

		var favColours = ['Blue', 'Red', 'Pink', 'Yellow', 'Orange', 'Teal', 'Magenta', 'Gold', 'Cyan'];

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
			_showEl($intro);
			$$('begin').addEventListener('click', function(event) {
				// slight delay as a visual effect
				setTimeout(function() {
					_hideEl($intro);
					_showEl($weight);
					_showEl($energy);
					root.Game.start(false);
				}, 100);
			}, false);
		};

		var showEnd = function(settings)
		{
			_hideEl($weight);
			_hideEl($energy);

			// set the end game screen properties
			var color = favColours[root.Utils.getRandomInt(0, ( favColours.length - 1 ))],
				$endColor = $$('end-color'),
				endWeight = Math.floor(settings.weight * 5);

			$$('end-time').innerHTML = settings.time.m + ':' + settings.time.s;
			$$('end-weight').innerHTML = endWeight + ' grams';
			$endColor.innerHTML = color;
			$endColor.style.color = color;

			_showEl($$('end'));
			$$('again').addEventListener('click', function(event) { document.location.reload(true); }, false);
		};

		var displayWeight = function(weight)
		{
			var width = Math.ceil( weight * 25 );
			$weight.style.width = width + 'px';

		};

		var displayEnergy = function(energy)
		{
			$$('remaining').style.width = Math.floor(energy * 1.5) + 'px';
		};

		return {
			showIntro: showIntro,
			showEnd: showEnd,
			displayWeight: displayWeight,
			displayEnergy: displayEnergy
		};

	})();

	root.UI = UI;

})(window);