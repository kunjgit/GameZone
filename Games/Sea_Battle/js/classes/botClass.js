var botClass = function () {

    player.call(this, "p2", 2);

    this.chainFire = false;
    this.curr_big_ship = 5;
    this.smallSize = 0;

    this.grid = new Array(10);

    this.target_locked_x = [];
    this.target_locked_y = [];
    this.missed_target_x = [];
    this.missed_target_y = [];
    this.stack_x = [];
    this.stack_y = [];

};
// botclass inherits all player class methods
botClass.prototype = Object.create(player.prototype);

botClass.prototype.countShipStatus = function(str){

        var numberOfShipsDestroyed = 0;
        for(var i = 0; i < 5; i++){
            if(bot.currLife[ i ] === 0){
                numberOfShipsDestroyed ++;
            }
        }

        return numberOfShipsDestroyed;

}

botClass.prototype.drawProbabilityDensityGrid = function () {

 var i = 1, j = 1;
 var indent = 200;

        for (i = 0; i < 10; i++) {

            for (j = 0; j < 10; j++) {

                if (this.grid[i][j] > 2) {

                    fill(this.grid[i][j] * 50, 0, 0);
                    rect(indent + 550 + 30 * (i + 1), 50 + 30 * (j + 1), 30, 30);

                }
                else if (this.grid[i][j] === 2) {

                    fill(0, 0, 0);
                    rect(indent + 550 + 30 * (i + 1), 50 + 30 * (j + 1), 30, 30);
                }

            }
        }
        return 0;
};

// size = this.curr_big_ship
botClass.prototype.find = function (x, y, horiz) {

       var i, set = 0;

        if (horiz) {

            for (i = 0; i < this.target_locked_x.length; i++) {


                if (this.target_locked_x[i] !== x) {
                    return 0;
                }
                if (this.target_locked_y[i] >= y && (this.target_locked_y[i] <= y + this.curr_big_ship)) {

                    set++;
                }
                // else set=0;
            }

        }

        // vertical
        else {

            for (i = 0; i < this.target_locked_x.length; i++) {


                if (this.target_locked_y[i] !== y) {
                    return 0;
                }
                if (this.target_locked_x[i] >= x && (this.target_locked_x[i] <= x + this.curr_big_ship)) {

                    set++;
                }
                //	 else set=0;
            }
        }

        if (set === this.target_locked_x.length) {

            return 1;
        }
        return 0;
};
// currship = currbigship
botClass.prototype.grid_filter = function (i, j, horiz, currShip) {
    
        var k;

        if (horiz) {

            for (k = 0; k < currShip; k++) {

                if (this.grid[i][j + k] <= 0) {
                    return 0;
                }

                if (!this.chainFire) {

                    if (this.grid[i][j + k] === 1) {
                        return 0;
                    }
                }
            }
        }

        else {

            for (k = 0; k < currShip; k++) {

                if (this.grid[i + k][j] <= 0) {
                    return 0;
                }

                if (!this.chainFire) {

                    if (this.grid[i + k][j] === 1) {
                        return 0;
                    }

                }
            }
        }

        return 1;
};
botClass.prototype.largestAliveShip = function () {

    // below for loops finds the current biggest alive ship of opponent
           var i = 0;

        for (i = 4; i >= 0; i--) {

            if (this.currLife[i] !== 0) {
                switch (i) {
                    case 0: i = 2;
                        break;
                    case 1: i = 3;
                        break;

                    case 2: i = 3;
                        break;

                    case 3: i = 4;
                        break;

                    case 4: i = 5;
                        break;
                }
                return i;
            }
        }
};
botClass.prototype.smallestAliveShip = function () {

        var i;
        for (i = 0; i < 5; i++) {

            if (this.currLife[i] !== 0) {

                switch (i) {
                    case 0: i = 2;
                        break;


                    case 1: i = 3;
                        break;

                    case 2: i = 3;
                        break;

                    case 3: i = 4;
                        break;

                    case 4: i = 5;
                        break;

                }

                return i;

            }
        }
        return 0;

};
botClass.prototype.initialize = function () {

    for(var i = 0; i < 10; i++){

        this.grid[ i ] = new Array(10);
    }

    for (var i = 0; i < 10; i++) {

        for (var j = 0; j < 10; j++) {

            // marks missed shot as 0 & ignore  in density map
            if (this.gridHidden[i][j] === -1 || this.gridHidden[i][j] === ISLAND) {
                this.grid[i][j] = 0;
            }
            // mark hit shot as 1 & ignore in density map
            else if (this.gridHidden[i][j] === 1) {
                this.grid[i][j] = 1;
            }
            else{
                this.grid[i][j] = 2;
            }
        }
    }

    while (this.stack_x.length > 0) {
        this.stack_x.pop();
        this.stack_y.pop();
    }
};
botClass.prototype.calcProbabilityDensity = function () {

        var i, j, k;

        this.initialize();

        // below for loop determines the biggest alive ship
        if (this.chainFire) {

            this.curr_big_ship = this.smallestAliveShip() + this.smallSize; //   when chainFire is enabled we will reduce filter to smallest ship
        }


        // strategy always searches for biggest unsinked ship
        else {

            this.curr_big_ship = this.largestAliveShip();
        }

        // horizontal probability update
        for (i = 0; i < 10; i++) {

            for (j = 0; j <= 10 - this.curr_big_ship; j++) {

                // enables probability filter when chain fire is active
                if (this.chainFire && !(this.grid_filter(i, j, 1, this.curr_big_ship) && this.find(i, j, 1))) {
                    continue;
                }

                // enables probability filter when chain fire is dormant
                else if (!this.grid_filter(i, j, 1, this.curr_big_ship)) {
                    continue;
                }

                for (k = 0; k < this.curr_big_ship; k++) {

                    if (this.grid[i][j + k] > 1) {

                        if (this.chainFire) {

                            this.grid[i][j + k] = this.grid[i][j + k] + 100;
                        }
                        else {
                            this.grid[i][j + k]++;
                        }
                    }
                }
            }
        }

        // vertical probability update
        for (i = 0; i <= 10 - this.curr_big_ship; i++) {

            for (j = 0; j < 10; j++) {

                if (this.chainFire && !(this.grid_filter(i, j, 0, this.curr_big_ship) && this.find(i, j, 0))) {
                    continue;
                }

                else if (!this.grid_filter(i, j, 0, this.curr_big_ship)) {
                    continue;
                }

                for (k = 0; k < this.curr_big_ship; k++) {

                    if (this.grid[i + k][j] > 1) {

                        if (this.chainFire) {

                            this.grid[i + k][j] = this.grid[i + k][j] + 100;

                        }
                        else {
                            ++this.grid[i + k][j];
                        }
                    }
                }
            }
        }
        return 0;
};
botClass.prototype.maxProbability = function () {

        var i, j, max = 0;

        for (i = 0; i < 10; i++) {
            for (j = 0; j < 10; j++) {

                if (this.grid[i][j] >= max) {

                    max = this.grid[i][j];
                }
            }
        }
        return max;
};
botClass.prototype.play = function () {


        var botHitX = 0, botHitY = 0;


        if (this.checkShipLifeStatus()) {

            return true;
        }


        if ((this.missed_target_x.length > 0) && (!this.chainFire)) {

            this.chainFire = true;
            var tempX = this.missed_target_x.pop();
            var tempY = this.missed_target_y.pop();

            // give loc high probability
            this.grid[ tempX ][ tempY ] = this.grid[ tempX ][ tempY ] + 20;
            this.target_locked_x.push(tempX);
            this.target_locked_y.push(tempY);
            this.hitShipType = this.gridActual[tempX][tempY];

        }

        this.calcProbabilityDensity();

        var max = this.maxProbability();

        while (this.stack_x.length > 0) {
            this.stack_x.pop();
            this.stack_y.pop();
        }

        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {

                if (this.grid[i][j] === max) {

                    if (this.chainFire === false || this.target_locked_x[ 0 ] === i || this.target_locked_y[ 0 ] === j) {
                        this.stack_x.push(i);
                        this.stack_y.push(j);
                    }
                }
            }
        }

        // selects target randomly from highest density block 

        var randomNumber = floor(random(0, this.stack_x.length));

            botHitX = this.stack_x[randomNumber];
            botHitY = this.stack_y[randomNumber];

        while (this.stack_x.length > 0) {
            this.stack_x.pop();
            this.stack_y.pop();
        }


        // if shot missed execute this
        if ((this.gridActual[ botHitX ][ botHitY ] === 0) && (this.gridHidden[ botHitX ][ botHitY ] === 0)) {

            this.gridHidden[ botHitX ][ botHitY ] = -1;
            playerSwitching = true;
            this.turn++;

        }


        // if shot hit execute this
        else if ((this.gridActual[botHitX][botHitY] > 0) && (this.gridHidden[botHitX][botHitY] === 0)) {

            // ruduce ships life which is hit 
            // mark as hit on hidden grid
            this.gridHidden[botHitX][botHitY] = 1;
            this.currLife[this.gridActual[botHitX][botHitY] - 1]--;

            if (this.chainFire) {

                // if we hit another ship than add its coordinates to stack
                if ((this.hitShipType !== this.gridActual[botHitX][botHitY])) {

                    this.missed_target_x.push(botHitX);
                    this.missed_target_y.push(botHitY);

                }

                else if (this.currLife[ this.gridActual[ botHitX ][ botHitY ] - 1] > 0) {

                    this.target_locked_x.push(botHitX);
                    this.target_locked_y.push(botHitY);

                    if (this.smallestAliveShip() <= this.target_locked_x.length) {

                        this.smallSize++;

                    }
                }


                // if ship sinked execute this else
                else {

                    while (this.target_locked_x.length > 0) {

                        this.target_locked_x.pop();
                        this.target_locked_y.pop();
                    }

                    this.smallSize = 0;
                    this.hitShipType = 0;
                    this.chainFire = false;
                }
            }

            // if chain fire is off
            else {


                this.hitShipType = this.gridActual[botHitX][botHitY];
                this.target_locked_x.push(botHitX);
                this.target_locked_y.push(botHitY);

                this.chainFire = true;
            }


        }
        return 0;

};
botClass.prototype.destroy = function(){

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {

            this.grid[i][j] = 0;
        }
    }

    while (this.target_locked_x.length() > 0) {

        this.target_locked_x.pop();
        this.target_locked_y.pop();
    }

    while (this.missed_target_x.length() > 0) {

        this.missed_target_x.pop();
        this.missed_target_y.pop();
    }
        
};
