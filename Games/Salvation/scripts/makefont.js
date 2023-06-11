/**
	Font is encoded in Dword
	
	Generated font image is missing space between glyphs, which can cause some problems when image is scalled down - need to be done
*/
FE.MakeFont = function(p) {
	this.color = p.color;
	this.shadow = p.shadow;
	this.size = p.size;	
	this.name = p.name;
	this.data = [];
	
	this.numChars = Object.keys(FE.fontData).length;
	this.perLineX  = Math.round(Math.sqrt(this.numChars)) + 1;
	this.perLineY  = ((this.perLineX * this.perLineX) < this.numChars) ? this.perLineX + 1 : this.perLineX;
	

	var tmp = MGE.createCanvas(this.size * 5 * this.perLineX, (this.size * 5 + (this.shadow == null ? 0 : this.size)) * this.perLineY);
	this.canvas  = tmp.canvas;
	this.context = tmp.context;
	this.start();
}

FE.MakeFont.prototype = {
	// ----------------------------------------
	// start
	// ----------------------------------------
	start: function() {
		var _self = this;
		var tmp, startX, startY;
		var tmp2 = 0;

		for (var k in FE.fontData) {
			var letter = FE.fontData[k];
			for (var j=0; j < 5; j++) {
				tmp = letter & 31;
				for (var i=0; i < 5; i++) {
					startX = (tmp2 % this.perLineX) * 5 * this.size + i * this.size;
					startY = ~~(tmp2 / this.perLineX) * 5 * this.size + j * this.size + (this.shadow == null ? 0 : ~~(tmp2 / this.perLineX) * this.size);				

					if ((tmp & 16) === 16) {
						if (this.shadow != null) {
							this.context.fillStyle = this.shadow;
							this.context.fillRect(startX, startY + this.size, this.size, this.size);
						}
					
						this.context.fillStyle = this.color;
						this.context.fillRect(startX, startY, this.size, this.size);
					}
					tmp = tmp << 1;
				}
				letter = letter >> 5;
			}
			tmp2 ++;
			this.data[k] = {'x': startX - 4 * this.size, 'y': startY - 4 * this.size, 'width': this.size * 5, 'height': (this.shadow == null ? this.size * 5 : this.size * 6)};
		};

		var img = MGE.imageFromCanvas(this.canvas);
		img.onload = function() {
			MGE.TextureCache[img.src] = img;
			_self.storeImage(img, _self.data);
		}
	},
	
	// ----------------------------------------
	// storeImage
	// ----------------------------------------
	storeImage: function(img, data) {	
		this.texture = {'img': img, 'data': data};
		MGE.removeCanvas(this.canvas);
		if (this.onComplete) {
			this.onComplete.call();
		}		
	}
}

FE.fontData = {
	0: 15255086, 1: 2165186,  2: 33061951, 3: 32554047, 4: 1113649,  5: 32570911, 6: 33095199, 7: 1082431,  8: 33095231, 9: 32570943, 
	A: 18859566, B: 32045630, C: 16269839, D: 32032318, E: 33061407, F: 17332767, G: 16309775, H: 18415153, I: 32641183, J: 15238207,
	K: 18444881, L: 33047056, M: 18405233, N: 18470705,	O: 15255086, P: 17778238, Q: 16369198, R: 18826814,	S: 31504911, T: 4329631,
	U: 15255089, V: 4539953,  W: 11195953, X: 18157905, Y: 4336177,  Z: 32772191, 
	'+': 145536, '-': 14336, '*': 332096, ':': 131200, '.': 8388608, ',': 17301504, '?': 4198476, '!': 4198532, '|': 4329604, '"': 330, '(': 4464900, ')': 4261956, ' ': 0
}