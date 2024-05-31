   
document.addEventListener('touchmove', function(e) {e.preventDefault();}, false);
document.addEventListener('touchstart', function(e) {e.preventDefault();}, false);


var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var rs = {x: 1, y: 1, fx:100, fy: 100, marw: 1, marh: 1};

var tox, toy = 0;
var topres = false;

var GameStatusChanger = {};


var ActionOb = function () {

    function ActionOb (bx, by, ex, ey, acc, canc, movin) { 
        this.bx = bx;
        this.by = by;
        this.ex = ex;
        this.ey = ey;
        this.acc = acc;
        this.canc = canc;
        this.movin = movin;
    }

    ActionOb.prototype.isit = function (x, y){
        if ((x>this.bx) && (x<this.ex) && (y>this.by) & (y<this.ey)) {return true;} else {return false;}
    };

    return ActionOb;

}();


var inpu = (function () {

    function getmxy(e)  {
        tox = e.pageX - canvas.offsetLeft;
        toy = e.pageY - canvas.offsetTop;
        
    }

    function gettxy(e)  {
        e.preventDefault();
        tox = e.targetTouches[0].pageX - canvas.offsetLeft;
        toy = e.targetTouches[0].pageY - canvas.offsetTop;

    }

    var ActionMap = function () {

        function ActionMap (arr) {
            this.arr = [];
            this.touche = [];
        }

        ActionMap.prototype.isthere = function (x, y) {
            var thereis = [];
            var arr = this.arr;
            for (var v = 0; v <arr.length; v++) {if (arr[v].isit(x, y)) {thereis.push(arr[v]);}}
            return thereis;
        };
        ActionMap.prototype.moved = function () {
            if (topres) {
            var oo =  this.isthere(tox, toy);
            var arr = this.touche;
            var is = false;
            
            
            for (var v = 0; v <arr.length; v++) {
                     is = false;
                     for (var vv = 0; vv <arr.length; vv++) {
                         if (arr[0] == oo[vv]) {is=true;}
                         }
                     if (!is) {arr.shift().canc();} else {arr.push(arr.shift());}
                }
            while (oo.length>0) {
                is = false;
                for (v = 0; v <arr.length; v++) {
                        if (arr[v] == oo[0]) {is=true;}
                    }
                if (is) {oo.shift();} else {oo[0].movin();
                                            arr.push(oo.shift());}                  
                }
            }
        };
        ActionMap.prototype.mmove = function (e) {
            
            if (topres) {
                getmxy(e);
                this.moved();
            }
        };
        ActionMap.prototype.tstart = function (e) {
            gettxy(e);
            topres = true;
            this.moved();
        };
        ActionMap.prototype.mstart = function (e) {
            getmxy(e);
            topres  = true;
            this.moved();
        };
        ActionMap.prototype.tmove = function (e) {
            gettxy(e);
            this.moved();
        };
        ActionMap.prototype.cancel = function () {
             while(this.touche.length>0) {this.touche.canc();}
        };
        ActionMap.prototype.fire = function () {
             while(this.touche.length>0) {this.touche.pop().acc();}
        };
        ActionMap.prototype.touchup = function () {
            topres = false;
            this.fire();
        }; 

        return ActionMap;
    }();

    return new ActionMap();

})();


canvas.addEventListener("mousedown", function (e) {inpu.mstart(e);}, false);

canvas.addEventListener("mousemove", function (e) {inpu.mmove(e);}, false);

document.body.addEventListener("mouseup", function (e) {inpu.touchup();}, false);

document.body.addEventListener("mousedown", function (e) {inpu.mstart(e);}, false);

canvas.addEventListener("touchstart", function (e) {inpu.tstart(e);}, false);

canvas.addEventListener("touchmove", function (e) {inpu.tmove(e);}, true);

canvas.addEventListener("touchend", function (e) {inpu.touchup(e);}, false);

document.body.addEventListener("touchcancel", function (e) {inpu.cancel(e);}, false);

    
var resizegame = function () {
    
    var bw = window.innerWidth - 20;
    var bh = window.innerHeight - 20;

    if (bw*1.5>bh) {canvas.height = bh; 
                    canvas.width = Math.floor(bh * 0.6);} 
            else   {canvas.width  = bw; 
                    canvas.height = Math.floor(bw * 1.66);}

    canvas.style.marginLeft = Math.floor((bw - canvas.width)/2) + 'px';
    canvas.style.marginTop  = Math.floor((bh - canvas.height)/2) + 'px';
    
    context.clearRect(0, 0, canvas.width, canvas.height);


    rs.x = canvas.width / 100;
    rs.y = canvas.height / 100;

    rs.marw = rs.x*2;
    rs.marh = rs.y*2;
    
    rs.fx = canvas.width - rs.marw * 2;
    rs.fy = canvas.height - rs.marh * 2;
    
};


//important asset! Fisher-Yates shuffle to mutate an array;

var randomize = function(a,b,c,d) {

    c = a.length;

    while( c ) {

        b = Math.random()*c | 0;
        c = c - 1;
        d = a[c];
        a[c] = a[b];
        a[b] = d;

    }

    return a;

};

//defining gameplay colors

var colors = {empty: '#0b0b0b',
              binary: [['#C4C4C4','#4D4D4D'], ['#17E67B','#0E8043'], ['#177EE6','#0D4680'], 
                    ['#E6C717','#806E0D'], ['#E67717','#80420D'], ['#E665BB','#803868']],
              red: '#E61717',
              bck: '#f4f4f4' }; 

colors.rn = function () {
    var hold = colors.binary.shift();
    randomize(colors.binary);
    colors.binary.unshift(hold);
};

colors.rn();

canvas.style.backgroundColor = colors.empty;

//defining basic graphical element and animation - squares and circles
var drawblister = function drawblister (x, y, len, margin, stroke, value) {

    var ms = stroke/2;

    if (value>0) {
          context.beginPath();
          context.moveTo(x+(len/2), y+margin+2);
          context.lineTo(x+(len/2)-ms, y+margin-ms);
          context.lineTo(x+(len/2), y-margin-2);
          context.lineTo(x+(len/2)+ms, y-margin+ms);
          context.lineTo(x+(len/2), y+margin+2);
          context.fillStyle = colors.empty;
          context.fill();
    }

    if (value>1) {
          context.beginPath();
          context.moveTo(x+margin+2, y+(len/2));
          context.lineTo(x+margin-ms, y+(len/2)+ms);
          context.lineTo(x-margin-2, y+(len/2));
          context.lineTo(x-margin+ms, y+(len/2)-ms);
          context.lineTo(x+margin+2, y+(len/2));
          context.fillStyle = colors.empty;
          context.fill();
    }
};
    
var CutOut = function () {
    function CutOut(x, y, size, margin, value, color, blister){
        this.x = x;
        this.y = y;
        this.size = size;
        this.margin = margin;
        this.value = value;
        this.color = colors.binary[color];
        this.blister = blister;
        this.selected = false;
        this.open = true;
        this.broken = false;
        this.innermargin = rs.x;
        this.stroke = rs.x;
    }

    CutOut.prototype.switch = function () {
        this.open = !this.open;
    };

    return CutOut;
}();

var Square = function () {

    function Square(x, y, size, margin, value, color, blister) {

    this.data = new CutOut(x, y, size, margin, value, color, blister);

    }

    Square.prototype.clear = function () {
        var x = this.data.x-rs.x/2;
        var y = this.data.y-rs.x/2;
        var size = this.data.size+rs.x;
        context.fillStyle = colors.empty;
        context.fillRect(x, y, size, size);
    };

    Square.prototype.draw = function () {
        
        var x = this.data.x+this.data.margin;
        var y = this.data.y+this.data.margin;
        var size = this.data.size-2*this.data.margin;

        if (this.data.open) { 

            if (this.data.selected){
                context.fillStyle = colors.red;
            } else {
                context.fillStyle = colors.bck;
            }

            context.fillRect(x, y, size, size);

            if (!this.data.broken) {
                
                if (this.data.blister>0) {
                    drawblister(x, y, size, this.data.innermargin, this.data.stroke, this.data.blister);
                }

                if (this.data.value>0) {
                    x = x+this.data.innermargin;
                    y = y+this.data.innermargin;
                    size = size - 2*this.data.innermargin;
                    context.fillStyle = this.data.color[this.data.value-1];
                    context.fillRect(x, y, size, size);
                }

            } else {
              drawblister(x, y, size, this.data.innermargin*Math.random(), this.data.stroke*(0.6+0.8*Math.random()), this.data.blister);
            }
        } 
    };

    Square.prototype.selecto = function () {
        this.data.selected = true;
        this.draw();
    };

    Square.prototype.deselect = function () {
        this.data.selected = false;
        this.draw();
    };

    Square.prototype.break = function () {
        var br = this;
        this.data.value = 0;
        this.data.selected = false;
        if (!this.drawplus) {this.draw();} else {this.drawplus();}
        setTimeout(function () {br.broke();}, 250);
    };

    Square.prototype.broke = function () {
        this.data.broken = true;
        this.draw();
    };

    Square.prototype.decolor = function () {
        this.data.color = colors.binary[0];
        this.draw();
    };

    return Square;
}();

var Circle = function () {
    
    function Circle(x, y, size, margin, value, color, blister){

        this.data = new CutOut(x, y, size, margin, value, color, blister);

    }

    Circle.prototype.drawcircle = function (x, y, margin, size, fill) {
        context.beginPath();
        context.arc(x+size, y+size, size-margin, 0, 2*Math.PI);
        context.fillStyle = fill;
        context.fill();
    };

    Circle.prototype.clear = function () {
        var x = this.data.x+this.data.margin;
        var y = this.data.y;
        var size = this.data.size/2;
        context.clearRect(x, y, size, size);
    };

    Circle.prototype.draw = function () {

        var x = this.data.x;
        var y = this.data.y;
        var size = (this.data.size/2);
        var margin = this.data.margin;
        var fillit = '';

        if (this.data.open) {  

            if (this.data.selected) {fillit = colors.red;} else {fillit = colors.bck;}
            
            this.drawcircle(x, y, margin, size, fillit);

            if (!this.data.broken) {
                if (this.data.blister>0){
                    drawblister(x+margin, y+margin, (this.data.size-2*margin), this.data.innermargin, this.data.stroke, this.data.blister);
                 }
                 if (this.data.value>0){
                    margin = margin + this.data.innermargin;
                    fillit = this.data.color[this.data.value-1];
                    this.drawcircle(x, y, margin, size, fillit);
                 }
            } else {
                drawblister(x+margin, y+margin, (this.data.size-2*margin), this.data.innermargin*Math.random(), this.data.stroke*(0.6+0.8*Math.random()), this.data.blister);
            }

        }
    };

    return Circle;

}();


//defining value display objects - and menu - so called instruments;
    

var Instruments = function () {

    var Counter = function () {
        
        function Counter(x, y, cirsize, cirmargin, values, rowlen, color) {

            this.values = values;
            this.x = x;
            this.y = y;
            this.cirsize = cirsize;
            this.cirmargin = cirmargin;
            this.values = values;
            this.startvalues = [];

            for (var v = 0; v < this.values.length; v++) {
                this.startvalues.push(this.values[v]);
            }
          
            this.rowlen = rowlen;
            this.meters = [];
            this.color = color;

            this.ready = function () {
                var begx = this.x;
                var begy = this.y;
                var rowp = 0;
                for (var value = (this.values.length-1); value >= 0; value--) {
                    this.meters.unshift(new Circle(begx, begy, this.cirsize, this.cirmargin, this.values[value]+1, color, 1));
                    begx = begx + this.cirsize;
                    rowp = rowp+1;
                    if (rowp == rowlen) {begx = this.x;
                                          begy = this.y + this.cirsize;}
                }
            };
            
            this.ready();
        }

        Counter.prototype.draw = function (value) {

            this.meters[value].data.value = this.values[value]+1;
            this.meters[value].draw();
        
        };
        
        Counter.prototype.drawall = function () {
        
            for (var value = 0; value < this.values.length; value++) {
             this.draw(value);
            }
        
        }; 
        
        Counter.prototype.refresh = function (values) {
        
            for (var value = 0; value < this.values.length; value++) {

                if (this.meters[value].data.value != (this.values[value]+1)) {this.draw(value);}

            }
        
        };

        Counter.prototype.reset = function () {

            for (var value = 0; value < this.values.length; value++) {
             this.values[value] = this.startvalues[value];  
             this.meters[value].data.value = this.startvalues[value]; 
             this.meters[value].data.broken = false;
            }

            this.drawall();
        };
        
        Counter.prototype.a1 = function () {

            var value = 0;

            while (this.values[value] == 1) {
                this.values[value]= 0;
                value = value + 1;
                if (value == this.values.length) {
                    this.values.push(0);
                    this.meters.push(new Circle(this.x-this.cirsize, 
                        (this.y+this.cirsize*(this.values.length-11)), 
                        this.cirsize, this.cirmargin, 1, this.color, 1));
                }
            }

            this.values[value] = 1;
            this.refresh();

        };
        
        Counter.prototype.r1 = function () {

            var value = 0;

            while (this.values[value] === 0) {
                this.values[value]= 1;
                value = value + 1;
                if (value == this.values.length) {return true;}
            }

            this.values[value] = 0;
            value = this.values.length-1;

            while (this.values[value] === 0) {
                    this.meters[value].data.broken = true;
                    value = value-1;
            }

            this.refresh();

        };

        return Counter;
    }();
    
    function Instruments() {
            
        colors.rn();
        var insx = rs.marw;
        var circleprop = (rs.fx/19);
        this.circleprop = circleprop;

        var insy = rs.marh+circleprop*1.5;

        this.level = 0;

        this.score = 0;

        this.scoreboard = new Counter(insx+circleprop, insy, (circleprop), ((circleprop)*0.1), [0,0,0,0,0,0,0,0,0,0], 5, 1);

        this.timeboard  = new Counter(insx+circleprop*10, insy, (circleprop), ((circleprop)*0.1), [1,1,1,1,1,1], 3, 2);



        this.restart = new Square(insx+circleprop*16, insy, circleprop*2, 0, 2, 0, 2);
                          
        this.restart.drawplus = function () {
            this.draw();
            context.font = "bold "+rs.x*7+"px Lucida Console";
            context.fillStyle = colors.bck;
            context.textAlign="center";
            context.textBaseline="center";
            context.fillText("R", insx+circleprop*17, insy+circleprop*1.4);
            context.fillStyle = colors.bck;
            context.fillRect(insx+circleprop*16.75, insy+circleprop*0.575, rs.x*2, rs.x*2.1);
                
        };
          
    }

    Instruments.prototype.redraw = function () {

        var circleprop = this.circleprop ;   

        var insx = rs.marw;
        var insy = rs.marh+circleprop*1.5;

        this.scoreboard.drawall();
        this.timeboard.drawall();


        this.restart.drawplus(); 

        context.font = "bold "+rs.x*2.8+"px Lucida Console";
        context.fillStyle = colors.red;
        context.fillText("Squared", rs.marw+circleprop*3.75, rs.marh*2);
        context.fillText("Lines", rs.marw+circleprop*9.5, rs.marh*2);

        
        context.fillStyle = colors.bck;
        context.fillText("Play On", rs.marw+circleprop*7, rs.marh*2);

        context.fillStyle = colors.binary[0][0];
        context.textAlign = "right";
        context.fillText("Reversed v0.5", rs.fx, rs.marh*2);


        context.textAlign = "left";
        context.font = "bold "+rs.x*3+"px Lucida Console";
        context.fillStyle = colors.binary[1][0];
        context.fillText("score", insx+circleprop*6.1, insy+circleprop*1.75);
        context.fillStyle = colors.binary[2][0];
        context.fillText("time", insx+circleprop*13.1, insy+circleprop*1.75);
        context.fillText("time", insx+circleprop*13.1, insy+circleprop*1.75);

        
        context.font = "bold "+rs.x*2.8+"px Lucida Console";
        context.fillStyle = "#0000e0";
        context.textAlign = "center";
        context.fillText("heartland", rs.fx+rs.marw-circleprop*2.125, rs.fy+rs.marh+rs.x-circleprop*0.4);

    };

    Instruments.prototype.leveldraw = function () {
               
        context.clearRect(rs.fx/2-rs.fx/4, rs.fy-rs.x*3, rs.fx/2, rs.x*6);
                          
        context.font = "bold "+rs.x*2.8+"px Lucida Console";
        context.fillStyle = this.scoreboard.meters[0].data.color[0];
        context.textAlign = "center";
        context.fillText(this.level+' / 127', rs.fx/2, rs.fy+rs.marh+rs.x-this.circleprop*0.4);

    };

    Instruments.prototype.timereset = function () {this.timeboard.reset();};
    
    Instruments.prototype.scorereset = function () {this.scoreboard.reset();};
    
    Instruments.prototype.r1 = function () {
        if (this.timeboard.r1()) {return true;}
    };
    
    Instruments.prototype.a1 = function () {
        this.score = this.score+1;
        this.scoreboard.a1();
    };

    Instruments.prototype.levelup = function () {
        this.level = this.level+1;
        this.timereset();
        this.leveldraw();
        this.scoreboard.drawall();
    };

    return Instruments;

}();

//board && pieces - main game assets - main interact functions
    
var Gameassets = function () {
    
    var Piece = function () {
        
        function Piece(ar, vl) {

            this.fresh = true;
    
            var cu = Math.floor(ar[0]/6);
            var cd = Math.floor(ar[ar.length-1]/6);
           
            var cl = 5;
            var cr = 0;
            var v = 0;
             
            for (v = 0; v<ar.length; v++) {
                    if (ar[v]%6 < cl) {cl = ar[v]%6;}
                    if (ar[v]%6 > cr) {cr = ar[v]%6;}
                }
            
            this.hi = cd-cu;
            this.wi = cr-cl;

            
            for (v = 0; v<ar.length; v++) {
                ar[v] = ar[v]-cu*6;//-Math.floor(ar[v]/6);
                ar[v] = ar[v]-Math.floor(ar[v]/6)*(5-this.wi);
                ar[v] = ar[v] - cl;
            } 
          
            var piecelen = (this.hi+1)*(this.wi+1);
    
            this.values = [];

            for (v = 0; v<piecelen; v++) {

                if ((ar.length>0) && (ar[0]==v)) {
                    this.values.push(vl.shift());
                    ar.shift();
                } else {
                    this.values.push([0, 0]);
                }
            }
             
        }
        
        
        Piece.prototype.ready = function (x, y, psize, pmargin) {
            var frx = (psize*(3-this.wi)/2)+x;
            var fry = (psize*(3-this.hi)/2)+y;
            this.squares = [];
        
            for (var h = 0; h <= this.hi; h++) {
                     for (var w = 0; w <= this.wi; w++) {
                         if (this.values[w+h*(1+this.wi)][0]>0) {
                             this.squares.push(new Square(frx+w*psize, fry+h*psize, psize, pmargin, this.values[w+h*(1+this.wi)][0], this.values[w+h*(1+this.wi)][1], 2));
                            }
                     }
                }
            
            for (var s = 0; s < this.squares.length; s++) {
                this.squares[s].data.innermargin = rs.x/2;
                this.squares[s].data.stroke = rs.x/2;
                this.squares[s].data.blister  = 1;
            }

        };
        
        Piece.prototype.draw = function () {
            for (var s = 0; s < this.squares.length; s++) {
                this.squares[s].draw();
            }
        };

        Piece.prototype.selecto = function () {
            for (var s = 0; s < this.squares.length; s++) {
                this.squares[s].selecto();
            }
        };

        Piece.prototype.deselect = function () {
           for (var s = 0; s < this.squares.length; s++) {
                this.squares[s].deselect();
            }
        };
        
         Piece.prototype.nextl = function () {
            for (var s = 0; s < this.squares.length; s++) {
                this.squares[s].clear();
            }
        };
        
        Piece.prototype.clear = function () {
            this.fresh = false;
            for (var s = 0; s < this.squares.length; s++) {
                this.squares[s].data.blister = 0;
                this.squares[s].break();
            }
        };
        
        Piece.prototype.checkout = function (ap) {
        
            var compval = function (a, b) { 
                for(var i = a.length; i--;) {
                    if ((a[i][0] !== b[i][0]) || (a[i][1] !== b[i][1])) {return false;}
                }
                return true;
            };
                                           
            if ((this.fresh) && (this.hi == ap.hi) && (this.wi == ap.wi) && 
                (this.values.length == ap.values.length) && (compval(this.values, ap.values))) {
                return true;
            } else {
                return false;
            }
                    
        };

        return Piece;

    }();
    
    
    var Board = function () {

        function Board(level) {

            //procedrually genereated level construcion basis
            this.level = level;
            this.noise = 0.01*level;
            
            if (this.noise>0.9) {this.noise = Math.random();}
            
            this.values = function (noise) {

                var values = [];
                
                for (var value = 0; value < 36; value++) {
                    if (Math.random()>noise) {
                        values.push([1,0]);
                    } else {
                        values.push([2,0]);
                    }
                }
                
                return values;
            
            }(this.noise);
            
            this.cc = 5-Math.floor(this.level/10);

            if (this.cc<1) {this.cc = 1;}
            
            this.scramble = false;

            if (this.level>65) {this.scramble = true;}
            
            this.piecons = [[5, 10], [4, 25], [3, 25], [4, 5], [2, 25], [5, 1], [3, 20], [2, 20]];
            
            this.pc = [];
            
            while (this.piecons.length>0){
                while (this.piecons[0][1]>0){
                    this.pc.push(this.piecons[0][0]);
                    this.piecons[0][1] = this.piecons[0][1]-1;
                } 
                this.piecons.shift();
            }
            
            for (var value = this.level; value > 0; value--) {
                if (this.pc.length>0) {
                    this.pc.shift();
                } else {
                    this.pc = [2, 3, 4];
                }
            }
            
            while(this.pc.length>55) {this.pc.pop();}

            //max noise - 60 level, min colors = 15lvl, end 4s - 35lvl, end 3s - 60lvl endend - 109 lvl?
            
            
            //begin asset construction!
            
            this.selected = [];
            this.pieces = [];
            this.squares = [];
            
            //try construct constructs array for colorvalues ++++ pieces!!
            
            function tryconstruct (pc) {
                
                var placemap = [];
                var sizemap = [];
                var sizesum = 0;
                for (var value = 0; value <36; value++) {
                      placemap.push(value);
                } 
                
                randomize(placemap);
                
                var sizenum = 0;
                
                while (sizesum < 34) { 
                    sizenum = pc[Math.floor(Math.random() * pc.length)];
                    sizesum = sizesum + sizenum;
                    sizemap.push(sizenum);
                }
            
                sizemap.sort(function(a, b){return b-a;});
            
                if (sizesum != 36) {
                    sizenum = 36-sizesum;
                    if (sizenum < 2) {sizemap[sizemap.length-1] = sizemap[sizemap.length-1] + sizenum;
                    } else {
                        sizemap.push(sizenum);
                    }
                    sizesum = sizesum + sizenum;
                }
            
                sizemap.sort(function(a, b){return b-a;});
                //use sizemap && placemap to construct basic pieces!! FTW!! pm = placemap sm = sizemap

                var piecearraymaker = function (pm, sm) {

                    function checkit (arra, element) {

                        if (arra.length === 0) {return true;}

                        for (i=0; i < arra.length; i ++) {
                            if (
                                ((arra[i] == element + 1) && (element % 6 !== 5)) ||
                                ((arra[i] == element - 1) && (element % 6 !== 0)) ||
                                (arra[i] == element - 6) ||
                                (arra[i] == element + 6))  {
                            return true;
                            }
                        }
                        return false;
                    }
                    
                    var places = [];
                    var pieces = [];
                    
                    var pushitorleaveit = function (places, mat) {
                       for (var n=0; n<mat.length; n++){
                           if (checkit(places, mat[n])) {
                               places.push(mat.splice(n, 1)[0]);
                               return true;
                           }
                       }
                       return false;
                    }; 
                    
                    //properpiecevalues!!!!
                    
                    while (sm.length>0) {
                      var len = sm.pop();
                      places = [];
                      while (len > 0) {
                          if (pushitorleaveit(places, pm)) {
                                len = len-1;
                            } else {
                                sm.push(len);
                                len = 0;
                            }
                        }

                      pieces.push(places);
                    }
                    
                    pieces.sort(function(a,b){return a.length - b.length;});
                  
                    // i do have pieces numbers. but there are singletons etc. so the question is how to make it a bit better.

                    while (pieces[0].length <= 1) {
                        for (var n = 1; n < pieces.length; n++) {
                            if (checkit(pieces[n], pieces[0][0])){
                                pieces[n].push(pieces[0].pop());
                                pieces.shift();
                                //pieces[n].sort(function(a,b){return a - b});
                                pieces.sort(function(a,b){
                                return a.length - b.length;});
                                n = pieces.length;
                            }
                        }
                    }
                   
                    pieces.sort(function(a,b){return b.length - a.length;});
                    
                    return pieces;

                };
            
                return piecearraymaker(placemap, sizemap);
            }
            //gettingridof pieces which are to long for interface to look good

            var pa = tryconstruct(this.pc);
            
            function f1 (a) {return Math.floor(a / 6);}
            function f2 (a) {return a % 6;}

            while (pa[0].length >= 5) {
                
                var p = pa[0];

                if (    (pa[0].length>5) || 
                        (f1(p[0]) == f1(p[1])== f1(p[2])== f1(p[3])== f1(p[4])) ||      
                        (f2(p[0]) == f2(p[1])== f2(p[2])== f2(p[3])== f2(p[4]))) {
                    pa = tryconstruct(this.pc);
                } else {
                    pa.push(pa.shift());
                }    
            }
        
            
            while (pa.length>0) {
                
                var ca = pa.pop();

                ca.sort(function(a,b){return a - b;});

                var clnum = Math.floor(Math.random()*this.cc)+1;
                var cav = [];
                
                for (var val = 0; val<ca.length; val++) {
                    this.values[ca[val]][1] = clnum;
                    cav.push(this.values[ca[val]]);
                }
                
                this.pieces.push(new Piece(ca, cav));
            }
        }

        Board.prototype.ready = function (x, y, psize, pmargin) {
               
            this.x = x;
            this.y = y;
            var gx = x;
            var gy = y;
            var sqr = this.squares;
            var value = this.values;

            var addsquare = function (nuem) { 
                var zz = new Square(gx, gy, psize, pmargin, value[nuem][0], value[nuem][1], 2);
               
                sqr.push(zz);
                sqr[nuem].data.innermargin = rs.x;
            };    

            for (var vale = 0; vale < 36; vale++) {
                addsquare(vale);
                gx = gx + psize;
                if (vale % 6 == 5) {
                    gx = x;
                    gy = gy+psize;
                }
            }            
                            
        };

        //very important function - produces piece out of array val and an array of elements (fex selected)
        Board.prototype.a2p = function () {

        this.selected.sort(function(a,b){return a - b;});

        var arrv = [];
        var arrx = [];

        for (var val = 0; val<this.selected.length; val++) {
          var z = this.selected[val];
          if ((val===0)||(z != this.selected[val-1])){
              arrv.push(this.values[z]);
              arrx.push(z);
          }
        }

        return new Piece(arrx, arrv);
        };
        Board.prototype.draw = function (num) {
            this.squares[num].draw();
        };
        Board.prototype.drawall = function () {
            for (var val = 0; val < 36; val++) {
                this.draw(val);
            }
        };

        Board.prototype.selecto = function (nur) {
            if (this.squares[nur].data.value > 0) {
                this.squares[nur].selecto();                        
                this.selected.push(nur);
            }
        };

        Board.prototype.deselectall = function () {

            while(this.selected.length>0) {
                this.squares[this.selected.pop()].deselect();
            }

        };

        Board.prototype.checkdestruction = function () {

            for (var val = 0; val < 36; val++) {
                if (this.squares[val].data.value>0) {
                    return false;
                } 
            }
            this.deselectall();
            return true;
        };

        Board.prototype.destruct = function () {
            while(this.selected.length>0) {
                var s = this.squares[this.selected.pop()];
                s.data.value = 0;
                s.break();
            }
            if (this.checkdestruction()) {
                setTimeout(GameStatusChanger.nextlevel, 450);
            }
        };

        return Board;
    }();
    

    var PieceBox = function () {
        //x - y - pieces element array - piece size - piece margin (inside) - r
        function PieceBox (x, y, ea, ps, pm, rl, els) {
            this.pa = ea;
            this.x = x;
            this.y = y;
            this.ps = ps;
            this.pm = pm;
            this.rl = rl;
            this.els = els;
            this.selected = [];
        }

        PieceBox.prototype.ready = function () {
            var xx = this.x;
            var yy = this.y;
            var els = this.els;
            for (var v=0; v<this.pa.length; v++) {
                xx = this.x+v%this.rl*els;
                yy = this.y+Math.floor(v/this.rl)*els;
                this.pa[v].ready(xx, yy, this.ps, this.pm);
            }
        };
        PieceBox.prototype.selecto = function () {
            for (var v = 0; v<this.selected.length; v++) {
                this.pa[this.selected[v]].selecto();
                this.draw(this.selected[v]);
            }
        };
        PieceBox.prototype.deselect = function () {
            for (var v = 0; v<this.pa.length; v++) {
                this.pa[v].deselect();
            }
            this.selected = [];
        };
        PieceBox.prototype.clear = function () {
            if (this.selected.length>0) {
                this.pa[this.selected.shift()].clear();
            }
            this.deselect();
        };
        PieceBox.prototype.nextl = function () {
            for (var v = 0; v<this.pa.length; v++) {
                this.pa[v].nextl();
            }        
        };
        PieceBox.prototype.draw = function (nu) {
            this.pa[nu].draw();
        };
        PieceBox.prototype.drawall = function () {
            for (var v = 0; v<this.pa.length; v++) {
                this.pa[v].draw();
            }
        };
        PieceBox.prototype.checkout = function (npece) {
           this.deselect();
           for (var v = 0; v<this.pa.length; v++) {
                if ((this.pa[v].fresh) && (npece.checkout(this.pa[v]))) {
                    var z = v; 
                    this.selected.push(z);
                }
            }
            if (this.selected.length>0) {
                this.selecto();
                return true;
            } else {
                this.deselect();
                return false;
            }    
        };

        return PieceBox;
    }(); 
    
    
    function Gameassets (level) {
        
        var circleprop = (rs.fx/19);

        var bsy = rs.marh+circleprop*3.5+rs.marh;
        var bsi = (rs.fx/7);
        var bsx = rs.marw+ bsi/2;
        
        this.board = new Board(level);
        this.board.ready(bsx, bsy, bsi, bsi/10);
        this.board.drawall();
        
        var boa = this.board;
        
        var pbel = rs.fx/7;
        var pbr = 7;
        var pbx = rs.marw;
        var pby = bsy+bsi*6+circleprop;
        
        this.pb = new PieceBox(pbx, pby, this.board.pieces, rs.fx/29, 0, pbr, pbel);
        this.pb.ready();
        this.pb.drawall();
        
        var pieb = this.pb;
        
        function checkit () {
            return pieb.checkout(boa.a2p());
        }
        
             
        function cancelit () {
            boa.deselectall();
            pieb.deselect();
        }
        
        function doit () {
            if (checkit()) {
                GameStatusChanger.score();
                boa.destruct();
                pieb.clear();
            } else {
                cancelit();
            }
        }
   
        function addelement (nu) {
            boa.selecto(nu);
            checkit();
        }
        
        inpu.arr.push(new ActionOb(
            bsx-rs.x, bsy-rs.x, bsx+bsi*6+rs.x, bsy+bsi*6+rs.x,
            function () {doit();},
            function () {cancelit();},
            function () {})
        );
       
        function createit (num) {
            inpu.arr.push(new ActionOb(bsx+v%6*bsi, bsy+Math.floor(v/6)*bsi, 
                                        bsx+v%6*bsi+bsi, bsy+Math.floor(v/6)*bsi+bsi,
                                         function () {},
                                         function () {},
                                         function () {addelement(num);}));
        }

        for (var v = 0; v<36; v++) {
            createit(v);
        }
        
    }

    return Gameassets;

}();

var Timer = function () {
    
    function Timer () {
    }
    
    Timer.prototype.gamend = function () {
        if (this.countdown) {clearInterval(this.countdown);}
        GameStatusChanger.end(); 
    };
    Timer.prototype.stop = function () {
        if (this.countdown) {clearInterval(this.countdown);}
    };
    Timer.prototype.start = function (ins) {
        var Tim = this;
    this.countdown = setInterval(function () {
        if (ins.r1()) {
            Tim.stop();
            Tim.gamend();
        }}, 1000);
    };
    return Timer;
}();


var NewGame = function () {
    
    function NewGame () {
        this.gamestatus = 'intro';
        this.touched = {
            r: false,
            b: false
        };
    }
    

    NewGame.prototype.levelup = function () {
               
        this.t.stop();
        this.g.pb.nextl();
        this.resetmaker();
        this.i.levelup();
        this.i.leveldraw();
        this.g = new Gameassets(this.i.level);
        this.t.start(this.i);
        this.gamestatus = 'playing';
        if (this.i.level == 128) {
            this.i.level = 'WIN!';                      
            GameStatusChanger.win();
        }
    };

    NewGame.prototype.resetmaker = function () {
        ohh = this;
        var s = this.i.restart;
        while (inpu.arr.length>0) {inpu.arr.pop();}
        while (inpu.touche.length>0) {inpu.touche.pop();}
        inpu.arr.push(
            new ActionOb (s.data.x, s.data.y, s.data.x+s.data.size, s.data.y+s.data.size,
                             function () {s.break(); setTimeout(function () {ohh.newgame();}, 450);},
                             function () {s.data.selected = false; s.drawplus();},
                             function () {s.data.selected = true; s.drawplus();})
        );
    };

    NewGame.prototype.newgame = function () {
                resizegame();
                if (this.t) {this.t.stop();}
                this.i = new Instruments();
                this.i.redraw();
                this.resetmaker();
                this.g = new Gameassets(this.i.level);
                this.t = new Timer();
                this.i.leveldraw();
                this.t.start(this.i);
                this.gamestatus = 'playing';
                this.touched = {
                    r: false,
                    b: false
                };
    };
    
    return NewGame;
}();

var intro = function () {
    resizegame();
    var presstobegin = new Square(rs.marw*2, ((rs.fy-rs.fx)/2)-rs.marw, rs.fx-rs.marw*2, 0, 1, 1, 2);
  
    presstobegin.data.innermargin = rs.x*5;
    presstobegin.data.stroke = rs.x*6;
    
     presstobegin.drawplus = function () {
        this.draw();
        context.font = "bold "+rs.x*3.2+"px Lucida Console";
        context.fillStyle = colors.empty;
        context.textAlign = "left";
        context.fillText('functionary.', rs.fx/8, rs.fy/3+rs.x*2);
        context.fillText('your function is to cut', rs.fx/8, rs.fy/3+rs.x*6);
        context.fillText('(board) into procedurally declared', rs.fx/8, rs.fy/3+rs.x*10);
        context.fillText('└► blocks', rs.fx/8, rs.fy/3+rs.x*14);
        context.fillText('   for the player', rs.fx/8, rs.fy/3+rs.x*18);
        context.fillText('   to enjoy', rs.fx/8, rs.fy/3+rs.x*22);
        

        context.fillText('make no mistakes.', rs.fx/8, rs.fy/3+rs.x*36);
        context.fillText('waste no boards.', rs.fx/8, rs.fy/3+rs.x*40);
        context.fillText('prove you are a computer', rs.fx/8, rs.fy/3+rs.x*44);
        context.fillText('   worthy of functioning.', rs.fx/8, rs.fy/3+rs.x*48);
        context.textAlign = "center";

        context.fillStyle = colors.empty;
        context.fillText('tap to begin', rs.fx/2, rs.fy/3+rs.x*56);
    }; 
    
    presstobegin.drawplus();
    
    var i = {};
    i.colors = [colors.empty, colors.bck];
    i.dance = function () {
        this.colors.push(this.colors.shift());
        context.fillStyle = this.colors[0];
        context.fillText('tap to begin', rs.fx/2, rs.fy/3+rs.x*56);
    };

    var click = setInterval(function () {i.dance();}, 450);
    
    return {cl: click, ptb: presstobegin};
};


var introstart = intro();

var presstobegin = introstart.ptb;

var squaredlines = new NewGame();

var scorealert = function () {
    if (squaredlines) {
        var score = squaredlines.i.score;
        if (score<500) {
            alert(score+' bricks computed. Next time work harder.');
        } else {
            alert(score+' blocks. You are a computer. Go compute.');
        }
    }
};


GameStatusChanger.end = function () {
    scorealert();
    squaredlines.newgame();
};

GameStatusChanger.nextlevel = function () {
    squaredlines.levelup();
};


var gamebegin = function () {
    clearInterval(introstart.cl);
    inpu.arr.pop();
    squaredlines.newgame();
    
};  


inpu.arr.push(
        new ActionOb (rs.marw*2, ((rs.fy-rs.fx)/2)-rs.marw, rs.marw*2 + rs.fx-rs.marw*2, ((rs.fy-rs.fx)/2)-rs.marw + rs.fx-rs.marw*2, 
                    function () {presstobegin.data.selected = false; presstobegin.drawplus(); setTimeout(function () {presstobegin.data.broken = true; presstobegin.draw();}, 100);setTimeout(function () {gamebegin ();}, 300); }, 
                    function () {presstobegin.data.selected = false; presstobegin.drawplus(); }, 
                    function () {presstobegin.data.selected = true; presstobegin.drawplus(); }));


//setTimeout(function () {gamebegin()}, 4000);

GameStatusChanger.score = function() {squaredlines.i.a1();};

GameStatusChanger.win =  function () {
    var score = squaredlines.i.score;
    alert(score+' blocks make for a nice computing indeed.');
    squaredlines.newgame();
};
