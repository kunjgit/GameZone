$.GLITCHES = {
  list: []
};

$.GLITCH_TYPE = {};
$.GLITCH_TYPE.PIXEL_SHIFT = 0;
$.GLITCH_TYPE.INVERT = 1;
$.GLITCH_TYPE.BLACK_AND_WHITE = 2;
$.GLITCH_TYPE.COLOR_SHIFT = 3;

$.GLITCHES_FOR_DEVICE_TYPE = {
  desktop: [
    $.GLITCH_TYPE.PIXEL_SHIFT,
    $.GLITCH_TYPE.INVERT,
    $.GLITCH_TYPE.BLACK_AND_WHITE,
    $.GLITCH_TYPE.COLOR_SHIFT
  ],
  mobile: [
    $.GLITCH_TYPE.INVERT,
    $.GLITCH_TYPE.BLACK_AND_WHITE
  ]
};

$.GLITCHES_FOR_DEVICE = $.GLITCHES_FOR_DEVICE_TYPE[( $.MOBILE ? "mobile" : "desktop" )];

$.GLITCHES_TYPES = [];

$.GLITCH = function () {


  this.type = $.GLITCHES_FOR_DEVICE[Math.floor(Math.random() * $.GLITCHES_FOR_DEVICE.length)];

  this.x = Math.random() * $.W;
  this.y = Math.random() * $.H;

  switch (this.type) {
    case $.GLITCH_TYPE.INVERT:
    case $.GLITCH_TYPE.BLACK_AND_WHITE:
      this.width = Math.floor(Math.random() * ($.W - this.x) / 2 );
      this.height = Math.floor(Math.random() * ($.H - this.y) / 2 );
      this.lifetime = Math.random() * 0.5;
      break;
    case $.GLITCH_TYPE.COLOR_SHIFT:
      this.width = Math.floor(Math.random() * ($.W - this.x) / 2 );
      this.height = Math.floor(Math.random() * ($.H - this.y) / 2 );
      this.lifetime = Math.random();
      this.shiftR = 0;
      this.shiftG = 0;
      this.shiftB = 0;
      break;
    case $.GLITCH_TYPE.PIXEL_SHIFT:
      this.width = Math.floor(Math.random() * ($.W - this.x) / 2 );
      this.height = Math.floor(Math.random() * ($.H - this.y) / 2 );
      this.shift = 0;
      this.lifetime = Math.random() * 2;
      break;
  }

  if(this.width == 0 || this.height == 0) this.lifetime = 0;
};

$.GLITCH.prototype.update = function () {
  switch (this.type) {
    case $.GLITCH_TYPE.PIXEL_SHIFT:
      this.shift += Math.floor(Math.random() * 10 - 5) * 4;
      break;
    case $.GLITCH_TYPE.COLOR_SHIFT:
      this.shiftR += Math.random() * 10 - 5;
      this.shiftG += Math.random() * 10 - 5;
      this.shiftB += Math.random() * 10 - 5;
      this.shiftR -= this.shiftR > 255 ? 255 : 0;
      this.shiftR += this.shiftR <   0 ? 255 : 0;
      this.shiftG -= this.shiftG > 255 ? 255 : 0;
      this.shiftG += this.shiftG <   0 ? 255 : 0;
      this.shiftB -= this.shiftB > 255 ? 255 : 0;
      this.shiftB += this.shiftB >   0 ? 255 : 0;
      break;
  }
};

$.GLITCH.prototype.render = function (c) {
  var data = [];

  var imageData = c.getImageData(this.x, this.y, this.width, this.height), i;

  imageData.data.map(function (v) {
    data.push(v)
  });

  switch (this.type) {
    case $.GLITCH_TYPE.INVERT:
      for(i = 0;i < data.length;i+=4) {
        data[i]     = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
      break;
    case $.GLITCH_TYPE.BLACK_AND_WHITE:
      for(i = 0;i < data.length;i+=4) {

        var luminosity = data[i] * 0.21 + data[i + 1] * 0.72 + data[i + 2] * 0.07;

        data[i]     = luminosity;
        data[i + 1] = luminosity;
        data[i + 2] = luminosity;
      }
      break;
    case $.GLITCH_TYPE.COLOR_SHIFT:
      for(i = 0;i < data.length;i+=4) {
        data[i]     += this.shiftR;
        data[i + 1] += this.shiftG;
        data[i + 2] += this.shiftB;
      }
      break;
    case $.GLITCH_TYPE.PIXEL_SHIFT:
      if(this.shift > 0) {
        data.unshift.apply(data, data.splice(this.shift));
      } else if(this.shift < 0) {
        data.push.apply(data, data.splice(0, -this.shift));
      }
      break;
  }

  try {
    c.putImageData(new ImageData(
      new Uint8ClampedArray(data),
      imageData.width,
      imageData.height
      ),
      this.x,
      this.y
    );
  } catch(e) {
    //Prevent errors showing in Edge
  }
};

$.GLITCHES.add = function () {
  if($.GLITCHES.list.length < 10)
    $.GLITCHES.list.push(new $.GLITCH());
};

$.GLITCHES.update = function (dt) {
  $.GLITCHES.list.forEach(function (glitch, idx) {
    glitch.lifetime -= dt;

    if( glitch.lifetime <= 0 ) {
      $.GLITCHES.list.splice(idx, 1);
    } else {
      glitch.update(dt);
    }
  });
};

$.GLITCHES.render = function (c) {
  $.GLITCHES.list.forEach(function (glitch) {
    glitch.render(c);
  });
};