FE.MakeImages = function(p) {
	this.numImages = Object.keys(FE.images).length;
	var tmp = MGE.createCanvas(16, 16);
	this.canvas  = tmp.canvas;
	this.context = tmp.context;

	this.start();
}

FE.MakeImages.prototype = {
	// ----------------------------------------
	// start
	// ----------------------------------------
	start: function() {
		var _self = this;
		for (var i in FE.images) {
			for (var j in FE.images[i]) {
				var image = FE.decodeImage(FE.images[i][j]);
				this.context.fillStyle = j;
				for (var k=0; k < 16; k++) {
					for (var l=0; l < 16; l++) {
						if (image[l + 16 * k] == '1') {
							this.context.fillRect(l, k , 1, 1);
						}
					}
				}
			}
			
			var img = MGE.imageFromCanvas(this.canvas);
			MGE.TextureCache[i] = img;

			this.context.clearRect(0, 0, 16, 16);
		}
		
		MGE.removeCanvas(_self.canvas);
	}
}

FE.encodeImage = function(input) {
	var encoding = input[0];
    input.match(/(.)\1*/g).forEach(function(substr){ encoding+= String.fromCharCode(96 + substr.length)});
    return encoding;	
}

FE.decodeImage = function(encoded) {
    var output = '';
    var isZero = (encoded[0] === '0' ? true : false);
	for (var i=1; i < encoded.length; i++) {
		output +=  new Array(encoded.charCodeAt(i) - 95).join(isZero ? '0' : '1');
		isZero = !isZero;
	}
    return output;	
}

/**
	images are encoded in layers
*/
FE.images = {
	'angel' : {
		'#88a1a7' : '0ºaoazaofjfihoaoahht',
		'#afd1d9' : '0bmdkekhgigfjadbndldkfigig',
		'#7a9196' : '0Èaoeã',
		'#48727c' : '0©blaoaoapeaoaoaoid',
		'#e0e6e7' : '0bmdlcldldê',
		'#bd9127' : '0hdkcmbnbnbė',
		'#f8cea1' : '0zbmcmc¡a'
	},
	'dragon' : {
		'#20710f' : '0aaamcmdkffabffabmdfldkigjfjeoanck',
		'#46cd21' : '0¤andkegabgebdcagifjcmdnbmdld',
		'#56320e' : '0Çapapapapapaoaparbdc',
		'#ead873' : '0Ąbnbnbncmc',
		'#dda621' : '0ăaoaoaoaoapb',
		'#0d0501' : '0³aaa'
	},	
	'fire' : {
		'#880000' : '0vacahabaocleaaifgaaifkdlcnbnapkfic',
		'#b80000' : '0aoancmdaaighifjeldlcnbnoa',
		'#f82f00' : '0¸anclekfhifjekelekfi',
		'#f88800' : '0Èancmdkfhhgigjfjgh',
		'#ffffff' : '0èaobmckaadjfigje'
		
	},
	'water' : {
		'#5174ad' : '0yanbmclejfihgjfjeldldldldlejghd',
		'#5989d7' : '0©anbnclekekfigigigjfkdt',
		'#87beec' : '0anbnanbnaoanbnaoaoaobobx',
		'#ffffff' : '0¶ananbnbmbnbnbnbnbobz'
	},
	'air' : {
		'#7d7dec' : '0dihgkcnaoaaoanclfgj',
		'#b4b9e3' : '0dihgkdldmcmdlejge',
		'#656eba' : '0¶efadadaeacacabadacacabaeacccaebgahaeaje',
		'#ffffff' : '0Çancmc'
	},	
	'earth' : {
		'#7cef5d' : '0amcldjfhhfjdlcldlejghhf',
		'#46cd21' : '0oanambmambkckckcmanaoapa',
		'#4ab034' : '0aoanbmaaalabakacajadahbeafbfafananamanaca',
		'#61d740' : '0½anbmbmckdcaffiekd',
		'#2c9d14' : '0Ďabakadaiaebfbeacefao'
	},	
	// not used in this version
	'healthPotion' : {
		'#9f6c2f' : '0vdldlabalabalabalabakadaiafagahaeajadajadajadajaeahaghd'
	}
};