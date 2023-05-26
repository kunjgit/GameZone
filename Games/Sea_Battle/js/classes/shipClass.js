var shipClass = function () {


    this.numberOfShips = 5;

    this.win = false;

    // the begin and end coordinate in below array is for sending backend the coordinates of the ship
    this.shipName = [
        //patrolBoat : 
        { color: { r: 0, g: 240, b: 0 }, size: 2 },
        //submarine  : 
        { color: { r: 153, g: 0, b: 204 }, size: 3 },
        //destroyer  : 
        { color: { r: 255, g: 0, b: 37 }, size: 3 },
        //battleship : 
        { color: { r: 235, g: 104, b: 65 }, size: 4 },
        //aircraftCarrier : 
        { color: { r: 255, g: 255, b: 0 }, size: 5 },
    ];

};
