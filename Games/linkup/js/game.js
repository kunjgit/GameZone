var Game = (function(){

    var ROW = config.row + 2;
    var COL = config.col + 2;
    var itemCount = config.row * config.col;

    var data = {
        time : config.time,
        cell : [],
    };

    var timeCooldown = 60;

    var hlepData = [];

    var Game = function(){
        
    };

    Game.prototype = {
        setup : function(){
            this.view = new View();
            this.init();
        },

        init : function(){
            this.start();
            this.view.init(this,data);
        },

        start : function(){
            this.initCell();
            this.fillCell();
            this.checkDeadlock();
            this.update();
        },

        restart: function () {
            location.reload();  
        },

        help: function () {
            this.judge.apply(this, hlepData);
        },

        update: function () {

            this.updateTime();

            window.requestAnimationFrame(this.update.bind(this));  
        },

        updateTime: function () {
            timeCooldown--;
            if (!timeCooldown) {
                timeCooldown = 60;
                data.time--;
                this.view.updateTime(data.time);
            }
            if (data.time === 0) {
                this.over();
            }
        },

        initCell : function(){
            var index = -1;
            for (var i=0; i<ROW; i++){
                data.cell[i] = [];
                for (var j=0; j<COL; j++){
                    index++;
                    data.cell[i][j] = {
                        val : null,
                        index : index,
                    }
                }
            }
        },
        fillCell : function(){
            var row = config.row;
            var col = config.col
            var count = config.objectCount;
            var repeat = config.repeatCount;
            for (var i=0; i<count; i++){
                for (var j=0; j<repeat; j++){
                    while(true){
                        var x = random(1,col);
                        var y = random(1,row);
                        var item = data.cell[y][x];
                        if (item.val===null){
                            data.cell[y][x].val = i;
                            break;
                        }
                    }
                }
            }
        },
        indexToPos : function(index){
            return {
                x : index % COL,
                y : Math.floor(index / COL),
            }
        },
        posToIndex : function(obj){
            return (
                obj.y * COL + obj.x
            );
        },
        removeItem: function (before,after) {
            this.getItem(before).val = null;
            this.getItem(after).val = null;
            this.view.removeItem(before);
            this.view.removeItem(after);
            itemCount -= 2;
            this.checkWinning();
        },
        isEmpty : function(obj){
            return obj.val === null;
        },
        isSame : function(before,after){
            return this.getItem(before).val === this.getItem(after).val;
        },
        identicalX : function(before,after){
            return this.indexToPos(before).x === this.indexToPos(after).x;
        },
        identicalY : function(before,after){
            return this.indexToPos(before).y === this.indexToPos(after).y;
        },
        getAround : function(index){
            return [
                -COL,
                COL,
                -1,
                1
            ]
        },
        getCorner : function(before,after){
            var min = Math.min.call(null,before,after);
            var max = Math.max.call(null,before,after);
            min = this.indexToPos(min);
            max = this.indexToPos(max);
            return [
                this.posToIndex({
                    x : max.x,
                    y : min.y,
                }),
                this.posToIndex({
                    x : min.x,
                    y : max.y,
                }),
            ];
        },
        connectable : function(before,after){
            var _this = this;
            var pos = [];
            var success = false;
            var min = Math.min.call(null,before,after);
            var max = Math.max.call(null,before,after);
            var called = function(dir){
                var i = min;
                var num = dir === 'x' ? COL : 1;
                for (;i+=num; i<=max){
                    var current = _this.getItem(i);
                    if (current === _this.getItem(max)){
                        success = true;
                        break;
                    }else if (_this.isEmpty(current)){
                        pos.push(current.index);
                    }else{
                        break;
                    }
                }
            }
            if (this.identicalY(before,after)){
                called('y');
            }else if (this.identicalX(before,after)){
                called('x');
            }
            if (success){
                if (min !== before){
                    pos = pos.reverse();
                }
            }
            return {
                success : success,
                pos : pos,
            }
        },
        directlyConnectable : function(before,after){
            var status = this.connectable(before,after);
            return status;
        },
        onceCorner : function(before,after){
            var _this = this;
            var success = false;
            var pos = [];
            var corners = this.getCorner(before,after);
            corners.forEach(function(el){
                if ( !_this.isEmpty(_this.getItem(el)) || success){
                    return;
                }
                var _status = [
                    _this.connectable(before,el),
                    _this.connectable(el,after),
                ];
                var ok = _status.every(function(status){
                    return status.success;
                });
                if (ok){
                    _status[0].pos.push(el);
                    success = true;
                    pos = _status[0].pos.concat(_status[1].pos);
                }
            });
            return {
                success : success,
                pos : pos,
            };
        },
        twiceCorner : function(before,after){
            var success = false;
            var pos = [];   
            var arounds = this.getAround(before);
            call : for (var i=0; i<arounds.length; i++){
                var j = before;
                while(j+=arounds[i]){
                    var current = this.getItem(j);
                    if (!this.isEmpty(current)){
                        break;
                    }
                    var _status = this.onceCorner(j,after);
                    if (_status.success){
                        success = true;
                        var _pos = this.directlyConnectable(before,j).pos;
                        _pos.push(j);
                        pos = _pos.concat(_status.pos);
                        break call;
                    }
                    if (this.isLimit(j)){
                        break;
                    }
                }
            }
            return {
                success : success,
                pos : pos,
            }
        },
        isConnectable : function(before,after){
            var status = {};
            if (before === after) return false;
            if (!this.isSame(before,after)) return false;
            var calleds = [
                // 直连
                this.directlyConnectable,
                // 一次拐角
                this.onceCorner,
                // 两次拐角
                this.twiceCorner,
            ];
            for (var i=0; i<calleds.length; i++){
                var fn = calleds[i].bind(this);
                status = fn(before,after);
                if (status.success){
                    break;
                }
            }
            return status;
        },
        judge : function(before,after){
            var _this = this;
            var status = this.isConnectable(before,after);
            if (status && status.success) {           
                if (status.pos.length>0){
                    status.pos.unshift(before);
                    status.pos.push(after);
                    this.view.showLine(status.pos,function(){
                        _this.removeItem(before,after);
                    });
                }else{
                    this.removeItem(before,after);
                }
                return true;
            }else{
                return false;
            }
        },

        isOutside : function(index){
            var pos = this.indexToPos(index);
            return (
                pos.x < 0 ||
                pos.y < 0 ||
                pos.x > COL-1 ||
                pos.y > ROW-1
            );
        },

        isLimit : function(index){
            var pos = this.indexToPos(index);
            return (
                pos.x === 0 ||
                pos.y === 0 ||
                pos.x === COL-1 ||
                pos.y === ROW-1
            );
        },

        getItem : function(index){
            if (this.isOutside(index)){
                return {};
            }
            var pos = this.indexToPos(index);
            return data.cell[pos.y][pos.x];
        },

        winning: function () {
            setTimeout(function () {
                var str = "已完成，确定再来一局吗？";
                alert(str);
                location.reload();
            }, 50);
        },
        
        over: function () {
            data.time = config.time;
            var str = "失败！确定再来一局吗？";
            alert(str);
            location.reload();   
        },

        checkWinning: function () {
            if (itemCount === 0) {
                this.winning();
            } else {
                this.checkDeadlock();
            }
        },

        checkDeadlock: function () {
            log(1);
            var count = config.objectCount;
            var cell = reduceDimension(data.cell);
            var filter = function (i) {
                return cell.filter(function (el) {
                    return el.val === i; 
                });
            };
            for (var i = 0; i < count; i++){
                var result = filter(i);
                var len = result.length;
                for (var j = 0; j < len; j++) {
                    var el = result[j].index;
                    for (var k = 0; k < len; k++){
                        var status = this.isConnectable(el, result[k].index);
                        if (status && status.success) {
                            hlepData = [el, result[k].index];
                            return;
                        }
                    }
                }
            }
            this.randomReset();
        },

        randomReset: function () {
            var _this = this;
            var row = config.row;
            var col = config.col
            var cell = (function () {
                return reduceDimension(data.cell).filter(function (el) {
                    return el.val !== null; 
                });
            })();
            this.initCell();
            cell.forEach(function (el) {
                while(true){
                    var x = random(1,col);
                    var y = random(1,row);
                    var item = data.cell[y][x];
                    if (item.val===null){
                        data.cell[y][x] = {
                            val: el.val,
                            index: _this.posToIndex({ x: x, y: y }),
                        }
                        break;
                    }
                }
            });
            this.view.init(this, data);
            this.checkDeadlock();
        }
    }


    return Game;

})();