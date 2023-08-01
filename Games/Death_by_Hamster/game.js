/*
    For js13k 2022
    Theme: death
*/

// CONFIG
let id = 0;
const pi = Math.PI;
let pause = 0;
let lP = "bye_dbh_" // this is for JS13K's shared localStorage
const gPar = (key) => {

    // Address of the current window
    let address = window.location.search

    // Returns a URLSearchParams object instance
    let parameterList = new URLSearchParams(address)

    // Returning the respected value associated
    // with the provided key
    return parameterList.get(key)
};

let lS = localStorage

let gS = (o) => {
    return lS.getItem(o);
}
let sS = (o, v, ops={}) => {
    if (ops.c) { // compression
        v = lzs.compress(v);
    }
    lS.setItem(`${lP}${o}`, `${v}`);
}
let o = {
}

for (let i of Object.keys(lS)) {
    console.log(i)
    if (i.startsWith(`${lP}o_`)) {
        switch(gS(i)) {
            case "true":
                o[i.slice(10)] = 1
                break;
            case "false":
                o[i.slice(10)] = 0
                break;
        }
        break;
    }
}

const cLV = gPar("lv");

class Canvas {
    constructor(id) {
        this.c = document.getElementById(id);
        this.ctx = this.c.getContext('2d');
        this.w = this.c.width;
        this.h = this.c.height;
        // get the width and height of the canvas from CSS
        this.tW = this.c.offsetWidth;
        this.tH = this.c.offsetHeight;
        this.cam = {x: 0, y: 0};

        this.mPos = {x: 0, y: 0};

    }

    fill(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    // Mouse position crap
    gMP(evt) {
        const rect = this.c.getBoundingClientRect(), // abs. size of element
            scaleX = this.c.width / rect.width,    // relationship bitmap vs. element for x
            scaleY = this.c.height / rect.height;  // relationship bitmap vs. element for y

        this.mPos.x = ((evt.clientX - rect.left) * scaleX) + this.cam.x;
        this.mPos.y = ((evt.clientY - rect.top) * scaleY) + this.cam.y;

        return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }

    translate(x, y) {
        this.ctx.translate(x, y);
    }

    rotate(angle) {
        this.ctx.rotate(angle);
    }

    // Drawing
    dImg(img, x, y, w, h, direction=0, originx=x+w/2, originy=y+h/2) {
        this.ctx.save();
        this.ctx.translate(originx-this.cam.x, originy-this.cam.y);
        this.ctx.rotate(direction * pi/180);
        this.ctx.drawImage(img, (-w/2), -h/2, w, h);
        this.ctx.restore();
    }
    sImg(img, x, y, w, h, cropX, cropY, cropW, cropH, direction=0) {
        this.ctx.save();
        this.ctx.translate((x+w/2)-this.cam.x, (y+h/2)-this.cam.y);
        this.ctx.rotate(direction * pi/180);
        this.ctx.drawImage(img, cropX, cropY, cropW, cropH, -w/2, -h/2, w, h);
        this.ctx.drawImage(img, cropX, cropY, cropW, cropH, -w/2, -h/2, w, h);
        this.ctx.restore();
        // console.log(`${x}, ${y}, ${w}, ${h}, ${cropX}, ${cropY}, ${cropW}, ${cropH}`);
    }

    dI(img, x, y, w, h, direction=0) {
        // alias for drawImg
        this.dImg(img, x, y, w, h, direction);
    }

    dR(x, y, w, h, color="white") {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x-this.cam.x, y-this.cam.y, w, h);
    }

    sR(x, y, w, h, color) {
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x-this.cam.x, y-this.cam.y, w, h);
    }

    dT(string, x, y, scaley, scalex, color, align="", vAliign="top") {
        string = string.toUpperCase();
        let chars = string.split("");
        // console.log(chars);

        let charWidth = 7
        let charOff = 0;
        // check if there's an odd number of chars
        if (chars.length % 2 == 1) {
             charOff = 1
        }
        let strLength = (chars.length * charWidth - charOff) * scalex;

        let charHeight = 7
        let strHeight = (charHeight * scaley);
        if (strHeight % 2 == 1) {
            strHeight += 1;
        }

        if (align === "middle") {
            x = x - strLength / 2;
        } else if (align === "end") {
            x = x - strLength;
        }
        
        switch(vAliign) {
            case "middle":
            case "center":
                y = y - strHeight/2;
                break;
            case "bottom":
                y = y - strHeight;
                break;
        }


        let charI = 0;
        let nextOffset = (7 * scalex);
        for (let char of chars) {

            this.ctx.fillStyle = color;
            let row = 0;
            let col = 0;
            // offset is the amount of pixels to offset the character by. you can calculate this by multiplying the current character (they're all the same size) by the scalex and scaley
            let offset = nextOffset;

            char = fI[char];
            if (char == undefined) {
                // leave a blank space
            } else {
                for (let cRow in char) {
                    col = 0;
                    // for each pixel in the row
                    for (let c of char[cRow]) {
                        if (c == 1) {
                            this.ctx.fillRect((x + (col * scalex) + (charI * offset)) - this.cam.x,( y + (row * scaley)) - this.cam.y, scalex, scaley);

                        }
                        col++;
                    }
                    row++;
                }
            }

            charI++;
            // console.log(charI)

            nextOffset = (7 * scalex);

        }

        return {
            "w": strLength,
            "h": strHeight
        }

    }

    sC(x, y) {
        this.cam.x = x;
        this.cam.y = y;
    }

}

// Entity classes

class Entity {
    constructor(name, x, y, sprite=undefined) {
        this.name = name,
        this.x = x,
        this.y = y,
        this.sprite = sprite
    }
    step() {
        console.log(`${this.name} is stepping`);
        console.log(`${this.name} is at ${this.x}, ${this.y}`);
    }
    draw () {

    }
    intersects(other) {
        return (this.x < other.x + other.w && this.x + this.w > other.x && this.y < other.y + other.h && this.y + this.h > other.y)
    }
}

class Room {
    constructor(name) {
        this.id = id;
        id += 1;
        this.name = name;
        this.objects = [];
        this.background = "#111";
        this.w = c.w;
        this.h = c.h;
    }

    spawn(entity) {
        this.objects.push(entity)
    }

    step() {
        // step all objects in the room
        for (let obj of this.objects) {
            obj.step();
        }
    }

    draw() {
        // draw all objects in the room
        for (let obj of this.objects) {
            obj.draw();
        }
    }

    dGUI() {

    }

    kD(key) {
        // console.log(key);
    }
    kH(key) {
        // console.log(key);
    }
    click(x, y) {
        // console.log(x, y);
    }

    start() {
        c.cam = {x:0,y:0}
    }

}

// INIT CANVAS
let c = new Canvas('gameCanvas');
gameCtx = c.ctx;
c.fill("#151f1f");
gameCtx.imageSmoothingEnabled = false;

let dPM = _=>{
    c.ctx.globalAlpha = .7;
    c.fill("#000");
    c.ctx.globalAlpha = .85;
    c.dR((c.w/2-150)+c.cam.x,120+c.cam.y, 300,120, "#000")
    c.ctx.globalAlpha = 1;
    c.dT("paused", c.w/2+c.cam.x,c.h/2-30+c.cam.y, 3,3,"#fff", "middle","middle");
    for (let o in gameRoom.pseo) {
        let t = c.dT(gameRoom.pseo[o].t, c.w/2+c.cam.x, c.h/2+(o*9)+c.cam.y, 1,1,"#fff", "middle");
        if (o == gameRoom.pses) {
            let a = img.a;
            c.dImg(a, ((c.w/2+c.cam.x)-t.w/2)-8, c.h/2+(o*9)+c.cam.y, 6,7)
        }
    }
}

c.dT("Death By Hamster", c.w / 2, c.h / 2 - 40, 2, 2, "white", "middle");

// Load images
let img = {
        "ingame": "./aimerthing.png",
        "cursor": "./cursor.png",
        "tileset": "./t.png",
        "human": "./human.png",
        "car": "./hamster.png",
        "gun": "./gun.png",
        "a": "./arw.png" // arrow
};

let snd = {
    select: "./blip.mp3"
}

const beep = _=> {
    snd.select.pause()
    snd.select.currentTime = 0;
    snd.select.play()
}

let loader = new Room("loader");
let lText = "Loading...";
let lErrT;
let lErr;
loader.dGUI = () => {
    c.dT(lText, c.w / 2, c.h / 2, 2, 2, "white", "middle");
    if (lErr) {
        c.dT(lErrT, c.w / 2, c.h / 2 + 20, 1, 1, "red", "middle");
    }
}
let rooms = [];

let limg = 0;
let timg = 7;

lText = `Loading...`;

// after all images are loaded, and no errors occured, start the game
for (let key in img) {
    // attempt to load the image
    let IMG = new Image();
    IMG.addEventListener('load', () => {
        limg++;
        lText = `Loading images (${limg} / ${timg})`
    });
    IMG.addEventListener('error', (e) => {
        lErr = 1;
        lErrT = `Error loading image ${e.target.src}`;
    } );
    IMG.src = img[key];

    // add the image to the images object
    img[key] = IMG;
}

console.log("SAAA")

let lsnd = 0;
let tsnd = 0;

for (let key in snd) {
    let SND = new Audio(snd[key]);
    // SND.addEventListener('load', () => {
    //     lsnd++;
    //     lText = `Loading sounds (${lsnd} / ${tsnd})`
    //     if (lsnd == tsnd) {
    //         console.log("Finish")
    //     }
    // });
    // SND.addEventListener('error', (e) => {
    //     lErr = 1;
    //     lErrT = `Error loading image ${e.target.src}`;
    // } );

    // add the image to the images object
    snd[key] = SND;
}

loader.step = _=> {
    setRoom(1)
}

let levels = [
        /*tutorial*/ "NrCMBoIJgXXNLgMx2AVkQFlRXqrgAMy+R4s8BxoqmZhqGED8GVjyRHdL64AbF1bgMvDAHYhwQQA4p0EvAhJFCOiiUDVESRoSSK+yDi01NbE4MMQMem8c10za8qgCc5V5pXXOzhc6SxNjCBCEIcnbgcuE64LHgHglyaCYeqZqSGQgeUXK+ggmgwSbFIqXE-GkCJnJV8IKC2YKS9dIi8ahZ5fCtNb3RDu0egYle7WWGkmV6tp3CdOEEkuIcoMprBHqCoCp6BLvzwAcq2Sf9x5Aqq5RX0aSHbqSSMs+JXeDTvHKHxZuQYkguEBZT+whGgJ+vAgclemjkT3hn2qNwQZVRuB0pQgbUxRzx2VwYVKBFxkAIhPJyM0oAIcLRBERaIgTLx9NBxHZYy5HlZAPeMCAA",
        /* lv 2 */ "NrCsBoGZwBgXXMALLWCzgIxsRATDsAJzgF7qYEry7gQ0YBshEA7C+ABwckMSYwOmbAwKDMFKFknRyibAQnys05QvRVVwTXO2pdzSoQFZBuxYo1YyVo5EnCoD9WuxLgb8ZJLvsJXX5OaoL2ytyhHuDsEdgQMeDM8fiS7AFcpBQozGn8koYpWtjcvlLxBPHYEWJBeigR7ChI6BAQTbTMbRgNzemdECR9puCDjp2ORp2G0J2K0KC20IxWgjOo84jVSxtY0Kw9Rpz7RfuCh7QkZxjcl2xcPRA3Ko8EjyiP0I-Ml8Uf6OynyyiMmGkioDhBajooKhyjmkhQ60ii3hCRRe1hQOUBHRkQIW0i2HxbkxkRaeRhkXYiKKFMC1KG9McjIIzNRamxzhJni5QyJ4BIfJIOJpwvSfPY4p5zGFgmYfIg8q5KEcSzgQA",
        /* lv 3 */ "NrCMBoCZwFgXXGcBmcBWBTX0dCPg91MiA2E8CAdkwlRsTRXAA5Mno3ErLXapiiCNHJCBDMDGaiwwlBWiQFlTFOgAGds02NY4HcCZMDTUvq0tzunifABOK4crrHTUBFugNW0Kk9SDM1BjTB4pAiNYLTMI8DD+HgxEenAZdzi+XSkuJyYc00zCDIl8OP4pNJdTcsEkI34zJKQzNNSysSYS5lB+VCVdVGRMGPkxNRqejpUhKqh+JiGxM0XmuaXppB5JzbWdlYhLfdZdg42IB23zk-tRpFAXI-vrp8vKCFf0x6r+L3a7itoLlAUiaeSiugcsSeUPwPmgBCC2AovlqKJRMjcqHyb0Kbk4Phc2Ic2MsOVOTVOXUsrQcFJuNL+7xcJSBLla6XZ1B+Im5qJxdJRXWBfzc2UwlmChTwnWR1VwlHq8slBGlu1VK1V2wuwl5H0UvMegx+fWNZ0oUg+Uke4zEwoI70s-SKoB4TrwWx+Ep+F2RPEeh29tyCkORtNClAcGKgbK0kAgUcgPLEib5KftUGgRxTTo4eH4kCB4bjZuLFItDidwhclejtyr4KQBdR1dhybo+Z1iEdqBkZkgqG2ihN8v7tyHDfHoMolgIW3iiAtNmGUA8PksngctibBgt8jgQA"
]

hamsterRef = {
    "file": img.car,
    "nl": {
        "x": 0,
        "y": 0,
        "w": 32,
        "h": 16,
    }
}

let lRef = {
    "file": img.tileset,
    "default": {
        "x": 0,
        "y": 0,
        "w": 32,
        "h": 32,
        "type": "blank"
    },
    "tiles": [
        {
        },
        {
            "x": 32,
            "type": "floor"
        },
        {
            "x": 64,
            "type": "wall"
        },
        {
            "x": 96,
            "type": "wall"

        },
        {
            "x": 128,
            "type": "wall"
        },
        {
            "x": 160,
            "type": "wall"
        },
        {
            "x": 192,
            "type": "wall"
        },
        {
            "x": 224,
            "type": "wall"
        },
        {
            "x": 256,
            "type": "wall"
        },
        { // player
            "x": 32,
            "type": "floor"
        },
        { // human
            "x": 32,
            "type": "floor"
        },
        {
            "x": 352,
            "type": "wall"
        },
        {
            "x": 384,
            "type": "wall"
        },
        {
            "x": 416,
            "type": "wall"
        },
        {
            "x": 448,
            "type": "vent"
        },
    ]
}


for (let tile of lRef.tiles) {
    // if the tile is missing properties from the default, add them
    for (let key in lRef.default) {
        if (!tile[key]) {
            tile[key] = lRef.default[key];
        }
    }
}

console.debug(img)
let targFPS = 60;
let frame = 0;


let menu = new Room("menu");

menu.s = 0
menu.o = [
    {
        "t": "Play",
        "a": _=>{ setRoom(4) } // go to game room
    },
    {
        "t": "Editor",
        "a": _=>{ setRoom(3) } // go to level editor
    },
    {
        "t": "Settings",
        "a": _=>{ setRoom(5) }
    }
]


menu.dGUI = () => {
    c.dT("Death by Hamster", c.w/2, c.h/2-25, 4, 4, "white", "middle", "middle");
    c.dT("Developed By Durgesh4993", c.w/2, c.h/2, 1,1,"gray","middle","middle");
    for (let o in menu.o) {
        let txt = c.dT(`${menu.o[o].t}`, c.w/2, (c.h/2+50)+(o*20), 2,2,"#fff","middle","top");
        if (menu.s == o) {
            let a = img.a;
            let ap = ((c.w/2)-(txt.w/2))-a.width-4;
            let ap2 = ((c.w/2)+(txt.w/2))+a.width-4;
            c.dImg(a, ap, (c.h/2+50)+(o*20), a.width*2, a.height*2)
            c.dImg(a, ap2, (c.h/2+50)+(o*20), a.width*2, a.height*2, 180)
        }
    }
}
const nextRoom = () => {
    // move to the next room
    roomI++;
    if (roomI >= rooms.length) {
        roomI = 0;
    }
    cRoom = rooms[roomI];
    cRoom.start();
}

const prevRoom = () => {
    // move to the previous room
    roomI--;
    if (roomI < 0) {
        roomI = rooms.length - 1;
    }
    cRoom = rooms[roomI];
    cRoom.start();
}

const setRoom = (roomI) => {
    // set the current room to the given room
    cRoom = rooms[roomI];
    cRoom.start();
}
menu.kD = (key) => {
    switch (key) {
        case "ArrowUp":
        case "KeyW":
            menu.s -= 1
            if (menu.s < 0) {
                menu.s = menu.o.length - 1
            }
            beep()
            break;
        case "ArrowDown":
        case "KeyS":
            menu.s += 1
            if (menu.s > menu.o.length - 1) {
                menu.s = 0
            }
            beep()
            break;
        case "Space":
        case "Enter":
            menu.o[menu.s].a();
            break;
    }
}

let gameRoom = new Room("Game");
let lvlS = new Room("Level Select")
lvlS.s = 0
lvlS.o = levels
gameRoom.humans = 0
gameRoom.li = 0
let player   = new Entity("Player", 0,0);
player.speed = 0;
player.maxSpeed = 20;
player.direction = 0;
player.sprite = img.car;
player.crop = hamsterRef.nl;
player.x = 0;
player.y = 0;
player.w = player.crop.w*2;
player.h = player.crop.h*2;
gameRoom.o = [{t:"Next Level",a:_=>{lvlS.s += 1; lvlS.kD("Space"); gameRoom.tutorial=0}}, {t:"Level Select",a: _=>{setRoom(4)}}, {t:"Menu", a: _=>{setRoom(1)}}]

gameRoom.s = 0
gameRoom.pseo = [{t:"Back to Menu", a:_=>{setRoom(1)}},{t:"Level Select",a:_=>{setRoom(4)}}]
gameRoom.pses = 0
player.oldDir = 0;

player.step = _=> {
    // move in this.direction, which is an angle in degrees
    player.tooltip = ""
    player.x += player.speed * Math.cos(player.direction * pi / 180);
    player.y += player.speed * Math.sin(player.direction * pi / 180);
    // check that the player won't go into a wall on the next step, and if so, stop.
    player.checkpoints = [];
    for (let i = 0; i < 9; i++) {

        let carCx = player.x + player.w/2;
        let carCy = player.y + player.h/2;

        let pointOx = 0;
        let pointOy = 0;
        switch (i) {
            case 0:
                pointOx = -32;
                break;
            case 1:
                pointOx = 32;
                break;
            case 2:
                pointOx = -30;
                pointOy = -15;
                break;
            case 3:
                pointOx = -30;
                pointOy = 15;
                break;
            case 4:
                pointOx = 30;
                pointOy = -15;
                break;
            case 5:
                pointOx = 30;
                pointOy = 15;
                break;
            case 6:
                pointOx = 20;
                break;
            case 7:
                pointOx = -20;
        }

        let pointX = carCx - pointOx * Math.cos(player.direction * pi / 180) - pointOy * Math.sin(player.direction * pi / 180);
        let pointY = carCy - pointOx * Math.sin(player.direction * pi / 180) + pointOy * Math.cos(player.direction * pi / 180);

        player.checkpoints.push({x: pointX, y: pointY});

    }

    for (let checkpoint of player.checkpoints) {
        let x = checkpoint.x / 64;
        let y = checkpoint.y / 64;
        if (gameRoom.checktile(x, y, "wall")) {
            player.direction = player.oldDir;
            player.x = player.xy[0];
            player.y = player.xy[1];
            player.speed *= 0.001;
        } else if (gameRoom.checktile(x, y, "vent")) {
            player.tooltip = "Press SHIFT to vent"
        }
    }

    // keep the camera centered on the player
    c.sC(player.x - c.w/2, player.y - c.h/2);

    player.oldDir = player.direction;
    player.xy = [player.x, player.y]

    player.speed *= .99

}

console.log(player);

player.draw = _=> {
    // draw this.sprite at this.x, this.y
    c.sImg(player.sprite, player.x, player.y, player.w, player.h, player.crop.x, player.crop.y, player.crop.w, player.crop.h, player.direction);
    // c.dT(`${player.x/64} ${player.y/64}`, player.x, player.y, 1,1,"white","middle","middle");
    // canvas.strokeRect(player.x, player.y, player.w, player.h, "white");

    let gun = img.gun;
    let gunOx = 13;
    let gunOy = 0;

    let carCx = player.x + player.w/2;
    let carCy = player.y + player.h/2;

    // get gunx and guny by moving backwards (gunOx and gunOy) from the center of the car in this.direction
    let gunx = carCx - gunOx * Math.cos(player.direction * pi / 180) - gunOy * Math.sin(player.direction * pi / 180);
    let guny = carCy - gunOx * Math.sin(player.direction * pi / 180) + gunOy * Math.cos(player.direction * pi / 180);
    player.gx = gunx
    player.gy = guny

    if (!pause&&!gameRoom.finish) {

        // get the angle between the gun and the mouse
        player.aim = Math.atan2(c.mPos.y - guny, c.mPos.x - gunx) * 180 / pi;

    }

    // canvas.drawText(`Width${gun.width} Height${gun.height}`, gunx, guny-15, 1, 1, "green", "middle", "middle");
    c.dImg(gun, gunx, guny, gun.width*2, gun.height*2, player.aim, gunx, guny); // these two vars at the end are where the gun's center is placed
    // canvas.drawRect(gunx, guny, 1,1, "red");

    for (let checkpoint of player.checkpoints) {
        c.dR(checkpoint.x, checkpoint.y, 1,1, "black");

    }

    if (player.tooltip) {
        c.dT(player.tooltip, player.x+32, player.y-16, 1, 1, "#64bee3", "middle")
    }

}

player.shoot = () => {
    // shoot a bullet
    let bullet = new Entity("Bullet", player.gx, player.gy);
    bullet.speed = 20;
    bullet.direction = player.aim;
    bullet.w = 2;
    bullet.h = 2;

    bullet.step = () => {
        // for each step, check if it's path intersects with any other entity
        for (let i = 0; i < cRoom.objects.length; i++) {
            let ent = cRoom.objects[i];
            if (ent != bullet && ent.intersects(bullet)) {
                // if it does, remove the bullet and the entity unless it's the player
                console.log(ent);
                if (ent != player) {
                    cRoom.objects.splice(i, 1);
                    cRoom.objects.splice(cRoom.objects.indexOf(bullet), 1);
                    gameRoom.humans -= 1;
                    return;
                }
            }

        }
        if (gameRoom.checktile(bullet.x/64,bullet.y/64)) {
            cRoom.objects.splice(cRoom.objects.indexOf(bullet), 1);
        }
        // if it doesn't, move the bullet
        bullet.x += bullet.speed * Math.cos(bullet.direction * pi / 180);
        bullet.y += bullet.speed * Math.sin(bullet.direction * pi / 180);
    }
    bullet.draw = () => {
        c.dR(bullet.x, bullet.y, bullet.w,bullet.h, "#2f2f2f");
    }
    cRoom.spawn(bullet);
}



gameRoom.kD = (key) => {
    if (!pause&&!gameRoom.finish){
        switch (key) {
            case "ArrowUp":
            case "KeyW":
                player.speed += player.accel;
                if (player.speed > player.maxSpeed) {
                    player.speed = player.maxSpeed;
                }
                break;
            case "ArrowDown":
            case "KeyS":
                player.speed -= player.accel * .8
                if (player.speed < -player.maxSpeed) {
                    player.speed = -player.maxSpeed;
                }
                break;
            case "ArrowLeft":
            case "KeyA":
                player.direction -= 2.5;
                if (player.direction < 0) {
                    player.direction = 360;
                }
                break;
            case "ArrowRight":
            case "KeyD":
                player.direction += 2.5;
                if (player.direction > 360) {
                    player.direction = 0;
                }
                break;
            case "Space":
                player.shoot()
                break;
            case "ShiftLeft":
                console.log("Triggered!")
                for (let i = 0; i < 9; i++) {
                    let x = Math.floor(player.checkpoints[i].x / 64);
                    let y = Math.floor(player.checkpoints[i].y / 64);

                    for (let tile of gameRoom.level) {
                        if (lRef.tiles[tile[0]].type == "vent" && tile[1] == x && tile[2] == y) {
                            for (let tile of gameRoom.level) if (lRef.tiles[tile[0]].type == "vent" && !(tile[1] == x) && !(tile[2] == y)) {
                                console.log(x, y)
                                console.log(tile[1], tile[2])
                                player.x = tile[1] * 64;
                                player.y = tile[2] * 64 + 16;
                            }
                        }
                    }

                }
                break;
        }

    }
    if (!gameRoom.finish ) {
        if (key == "KeyP" || key == "Escape") {
            pause = !pause
        }
        if (pause) {
            switch (key) {
                case "ArrowUp":
                case "KeyW":
                    gameRoom.pses -= 1
                    if (gameRoom.pses < 0) {
                        gameRoom.pses = gameRoom.pseo.length - 1
                    }
                    beep();
                    break;
                case "ArrowDown":
                case "KeyS":
                    gameRoom.pses += 1
                    if (gameRoom.pses > gameRoom.pseo.length - 1) {
                        gameRoom.pses = 0
                    }
                    beep();
                    break;
                case "Space":
                case "Enter":
                    pause = 0;
                    gameRoom.tutorial = 0;
                    gameRoom.pseo[gameRoom.pses].a()
                    break;
            }
        }
    }
    if (gameRoom.finish) {
        switch (key) {
            case "ArrowUp":
            case "KeyW":
                gameRoom.s -= 1
                if (gameRoom.s < 0) {
                    gameRoom.s = gameRoom.o.length - 1
                }
                beep();
                break;
            case "ArrowDown":
            case "KeyS":
                gameRoom.s += 1
                if (gameRoom.s > gameRoom.o.length - 1) {
                    gameRoom.s = 0
                }
                beep();
                break;

            case "Space":
            case "Enter":
                gameRoom.finish = 0;
                gameRoom.tutorial = 0;
                gameRoom.o[gameRoom.s].a();
                break;
        }
    }
}
gameRoom.kH = (key) => {
    if (!pause&&!gameRoom.finish){
        if (key == "ArrowUp" || key == "KeyW") {
            player.speed += player.accel;
            if (player.speed > player.maxSpeed) {
                player.speed = player.maxSpeed;
            }
        }
        if (key == "ArrowDown" || key == "KeyS") {
            player.speed -= player.accel*1.1;
            if (player.speed < -player.maxSpeed) {
                player.speed = -player.maxSpeed;
            }
        }
        if (key == "ArrowLeft" || key == "KeyA") {
            player.direction -= 2.5;
            if (player.direction < 0) {
                player.direction = 360;
            }
        }
        if (key == "ArrowRight" || key == "KeyD") {
            player.direction += 2.5;
            if (player.direction > 360) {
                player.direction = 0;
            }
        }
    }
}
gameRoom.click = (e) => {
    if (!pause&&!gameRoom.finish){
    player.shoot();
    }
}
gameRoom.checktile = (tx, ty, tp) => {
    tx = Math.floor(tx);
    ty = Math.floor(ty);
    for (let tile of gameRoom.level) {
        if (lRef.tiles[tile[0]].type == tp && tile[1] == tx && tile[2] == ty) {
            return true;
        }
    }
    return false;
}

gameRoom.start = () =>{

    if (cLV) {
        gameRoom.level = cLV
    }

    if (gameRoom.li) {
        gameRoom.level = JSON.parse(lzs.decompressFromEncodedURIComponent(levels[gameRoom.li - 1]))
    }

    gameRoom.finish = 0;

    gameRoom.objects = [];


    gameRoom.humans = 0;
    gameRoom.spawn(player);


    if (gameRoom.tutorial) {
        player.accel = .05
    } else {
        player.accel = .1

    }


    for (let tile of gameRoom.level) {
        if (tile[0] === 9) {
            player.x = (tile[1]*64)+32
            player.y = (tile[2]*64)+32
        }
        if(tile[0]===10){

            let pooman = new Entity("Human", (tile[1]*64),(tile[2]*64), img.human)
            pooman.w = 26*2
            pooman.h = 16*2
            pooman.bh = Math.floor(Math.random()*3);
            pooman.bb = Math.floor(Math.random()*3)
            pooman.getT=_=>{
                pooman.tX = Math.floor((pooman.x + pooman.w) / 64)
                pooman.tY = Math.floor((pooman.y + pooman.h) / 64)
            }
            pooman.step = _=>{
                let xy = [pooman.x, pooman.y]
                if (pooman.timer<=0){
                    let director = Math.floor(Math.random()*4)
                    pooman.direction = director*90;
                    if (director === 0){
                        pooman.y -= pooman.h;
                    }
                    if (director === 1){
                        pooman.x += pooman.w;
                    }
                    if (director === 2){
                        pooman.y += pooman.w;
                    }
                    if (director === 3){
                        pooman.x -= pooman.h;
                    }
                    pooman.getT();
                    if (gameRoom.checktile(pooman.tX, pooman.tY)){
                        pooman.x = xy[0]
                        pooman.y = xy[1]
                        pooman.step()
                        return
                    }

                    pooman.timer = Math.floor(Math.random() * (120 - 60) ) + 60;
                }
                pooman.timer--;
            }
            pooman.draw = _=>{
                c.sImg(pooman.sprite, pooman.x, pooman.y, pooman.w, pooman.h, pooman.bb*pooman.w/2, 0, pooman.w/2, pooman.h/2, pooman.direction);
                c.sImg(pooman.sprite, pooman.x, pooman.y, pooman.w, pooman.h, pooman.bh*pooman.w/2, pooman.h/2, pooman.w/2, pooman.h/2, pooman.direction);
                // c.dT(`${pooman.timer} :: ${pooman.direction}`, pooman.x, pooman.y, 1, 1, "white", "middle", "middle");
            }
            pooman.timer = 90;
            gameRoom.spawn(pooman);
            gameRoom.humans += 1;
        }
    }
}

gameRoom.step = _=> {
    if (lvlS.s+1 >= lvlS.o.length) {
        gameRoom.o[0] = {t:"you killed them all!", a:_=>{alert("well done!!!")}}
    }
    if (!pause&&!gameRoom.finish) {
        if (gameRoom.humans <= 0){
            gameRoom.tutorial = 0;
            gameRoom.finish = true;
        }
        // step all objects in the room
        for (let obj of gameRoom.objects) {
            obj.step();
        }
    }
}

gameRoom.draw = _=> {

    for (let tile of gameRoom.level) {
        // [index, x, y]
        c.sImg(lRef.file, (tile[1]*32)*2, (tile[2]*32)*2, 32*2,32*2, lRef.tiles[tile[0]].x, 0, 32, 32);
    }

    if (gameRoom.tutorial) {
        c.dT("Welcome to", 3*64, 64+15, 1, 1, "black");
        c.dT("Death by Hamster", (3*64)+32, 64+25, 2,2, "black", "middle");

        c.dT("Use WASD/arrows to move", 128, 2*64, 1,1, "black");
        c.dT("Aim with the mouse and click to shoot!", 128, 2*64+10, 1,1, "black");

        c.dT("As a member of the hamster uprising,", 6*64, 3*64+25, 1,1, "black");
        c.dT("you might want to kill any humans", 6*64, 3*64+35, 1,1, "black");
        c.dT("you find!", 10*64-16, 3*64+45, 1,1, "black", "end");


    }
    for (let i = 0; i < cRoom.objects.length; i++) {
        cRoom.objects[i].draw();
    }
}

gameRoom.dGUI = _=>{
    c.dT(`Humans:${gameRoom.humans}`, (c.w-10)+c.cam.x, 10+c.cam.y, 2,2,"#fff", "end")

    if (pause) {
        dPM(gameRoom);
    }
    if (gameRoom.finish) {
        c.ctx.globalAlpha = .7;
        c.fill("#000");
        c.ctx.globalAlpha = .85;
        c.dR((c.w/2-150)+c.cam.x,120+c.cam.y, 300,150, "#000")
        c.ctx.globalAlpha = 1;


        c.dT("You Won!", c.w/2+c.cam.x,c.h/2-30+c.cam.y, 3,3,"#fff", "middle","middle");
        for (let o in gameRoom.o) {
            let t = c.dT(gameRoom.o[o].t, c.w/2+c.cam.x, c.h/2+(o*9)+c.cam.y, 1,1,"#fff", "middle");
            if (o == gameRoom.s) {
                let a = img.a;
                c.dImg(a, ((c.w/2+c.cam.x)-t.w/2)-8, c.h/2+(o*9)+c.cam.y, 6,7)
            }
        }
    }
}

let editor = new Room("Editor");
editor.i = 0;
editor.t = lRef;
editor.l = []
editor.saving = false
editor.sa = 0

editor.start = _=>{
    editor.dPos = [15,65]
}
editor.draw = _=>{
    for (let tile of editor.l) {
        // [index, x, y]
        c.sImg(lRef.file, (tile[1]*32)+editor.dPos[0], tile[2]*32+editor.dPos[1], 32,32, tile[0]*32, 0, 32, 32);
        c.dR(editor.dPos[0], editor.dPos[1], 1,1, "red")
    }
}
editor.step = _=>{
    if (editor.i < 0) {
        editor.i = lRef.tiles.length-1;
    }
    if (editor.i > lRef.tiles.length-1) {
        editor.i = 0;
    }
}
editor.generate = _=>{
    editor.saving=1
    for (let tile of editor.l) {
        if (tile[0] == 0){
            editor.l.splice(editor.l.indexOf(tile))
        }
    }
    let encodedLevel = lzs.compressToEncodedURIComponent(JSON.stringify(editor.l))
    console.log(encodedLevel);
    if (encodedLevel != editor.data){
        document.getElementById("leveltext").innerText = encodedLevel;
        document.getElementById("levelLink").innerHTML = `<a href="/?lv=${encodedLevel}&goto=2">Play</a>`
    }
    editor.data = encodedLevel;
    editor.saving=0;
    editor.sa = 1;
}
editor.click = (x,y)=>{
    if (y < 50) {
        if (x> 516 && y < 50) {
            if (!editor.saving){
                editor.generate()
            }
            editor.saveclick = true
        }
    }
    else {
        x = Math.floor((x-editor.dPos[0])/32)
        y = Math.floor((y-editor.dPos[1])/32)
        // console.debug(x,y)
        for (let t in editor.l) {
            if (editor.l[t][1] == x && editor.l[t][2] == y) {
                editor.l[t] = [editor.i, x, y];
                return;
            }
        }
        editor.l.push([editor.i,x,y])
        editor.sa = 0
    }
}
editor.kH = (key) => {
    switch (key) {
        case "KeyW":
        case "ArrowUp":
            editor.dPos[1] += 4
            break;
        case "KeyS":
        case "ArrowDown":
            editor.dPos[1] -= 4
            break;
        case "KeyA":
        case "ArrowLeft":
            editor.dPos[0] += 4
            break;
        case "KeyD":
        case "ArrowRight":
            editor.dPos[0] -= 4
            break;
    }
}

editor.dGUI = _=>{
    c.dR(0,0,c.w,50,"gray")
    c.dT(`DBH Editor::${editor.n}`, 15,25,2,2,"#fff","start","middle");
    let s = c.dT(`Save`, c.w-15,25,2,2,"#fff","end","middle");
    if (c.mPos.x > (c.w-30)-s.w && c.mPos.y < 50) {
        // console.debug((c.w-30)-s.w)
        c.dT(`Save`, c.w-15,25,2,2,"#e5e5e5","end","middle");
    }
    if (editor.sa) {
        c.dT(`Save`, c.w-15,25,2,2,"#1fdc2f","end","middle");
    } if (editor.saving) {
        c.dT(`Save`, c.w-15,25,2,2,"#1fccdc","end","middle");
    }

    c.sImg(editor.t.file, c.mPos.x+16,c.mPos.y+16,32,32,32*editor.i,0,32,32);
}



lvlS.dGUI = () => {
    c.dT("Death by Hamster", c.w/2, 25, 2, 2, "white", "middle", "top");
    c.dT("Level Select", c.w/2, 44, 1,1,"gray","middle","middle");
    for (let o in lvlS.o) {
        let n = parseInt(o)+1
        c.dT(`${n}`, (20)+(32*n), 70, 2, 2, "#fff", "middle", "middle")
        if (o == lvlS.s) {
            c.sR((20-14)+(32*n), 70-16, 32, 32, "#fff")
        }
    }
}

lvlS.kD = (key) => {
    switch (key) {
        case "ArrowUp":
        case "ArrowLeft":
        case "KeyW":
        case "KeyA":
            lvlS.s -= 1
            if (lvlS.s < 0) {
                lvlS.s = lvlS.o.length - 1
            }
            beep();
            break;
        case "ArrowDown":
        case "ArrowRight":
        case "KeyS":
        case "KeyD":
            lvlS.s += 1
            if (lvlS.s > lvlS.o.length - 1) {
                lvlS.s = 0
            }
            beep();
            break;
        case "Space":
        case "Enter":
            gameRoom.li = lvlS.s + 1;
            if (lvlS.s === 0) {
                gameRoom.tutorial = 1;
            }
            setRoom(2)
            // beep();
            break;
        case "KeyE":
            editor.l = JSON.parse(lzs.decompressFromEncodedURIComponent(lvlS.o[lvlS.s].data));
            setRoom(3)
            break;
    }
}

let options = new Room("Settings")
options.s = 0
options.ops = o;
options.o = [{
    "t": "Show FPS",
    "a": _=>{ o.showFPS = !o.showFPS; sS("o_showFPS", o.showFPS) },
    "v": "showFPS"
}, {
    "t": "Menu",
    "a": _=>{ setRoom(0) }
}]

options.dGUI = () => {
    c.dT("Settings", c.w/2, 25, 2, 2, "#fff", "middle", "top");
    for (let o in options.o) {
        let s = options.o[o]
        let txt = c.dT(`${options.o[o].t}`, 150, 50+(o*20), 2,2,"#fff","left","top");
        if (options.s == o) {
            let a = img.a;
            c.dImg(a, 136, 50 + (o * 20), a.width * 2, a.height * 2)
        }
        let v = options.ops[s.v]
        if (!(v==undefined)){
            c.dT(`${v}`, 450, 50+(o*20), 2,2,"#fff", "end");

        }
    }
}

options.kD = (key) => {
    switch (key) {
        case "ArrowUp":
        case "ArrowRight":
        case "KeyW":
            options.s -= 1
            if (options.s < 0) {
                options.s = options.o.length - 1
            }
            beep();
            break;
        case "ArrowDown":
        case "ArrowLeft":
        case "KeyS":
            options.s += 1
            if (options.s > options.o.length - 1) {
                options.s = 0
            }
            beep();
            break;
        case "Space":
        case "Enter":
            if (options.o[options.s].a) {
                options.o[options.s].a()
            }
            break;
    }
}


rooms.push(loader);
rooms.push(menu);
rooms.push(gameRoom);
rooms.push(editor);
rooms.push(lvlS);
rooms.push(options)
let roomI = !gPar("goto") ? 0 : gPar("goto");

let cRoom = rooms[roomI];


let keysPressed = {};
let keysLastPressed = {};

document.addEventListener('keydown', (e) => {
    keysPressed[e.code] = true;
});
document.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
    keysLastPressed[e.code] = false;
} );

let lastTime = 0;

let mse = {x: 0, y: 0};
let lastClick = {x: 0, y: 0};
let leftclicked = false;
let rightclicked = false

c.c.addEventListener('mousemove', (e) => {
    mse = c.gMP(e);
} );

c.c.addEventListener("mousedown", (e) => {
    // console.log(e);
    e.preventDefault()
    lastClick = c.gMP(e);
    mse = c.gMP(e);
    switch (e.button) {
        case 0: // left
            leftclicked=1;
            break;
        case 1:
            rightclicked=1;
            break;
    }
});
c.c.addEventListener("mouseup", (e)=>{
    // console.log(e);
    lastClick = c.gMP(e);
    mse = c.gMP(e);
})
c.c.oncontextmenu = _=>{return 0;}

window.onwheel = (e)=>{
    if (e.deltaY > 0) {
        editor.i += 1;
    }
    if (e.deltaY < 0) {
        editor.i -= 1;
    }
}

try {
    cRoom.start();

    setInterval(() => {
        c.tW = c.c.offsetWidth;
        c.tH = c.c.offsetHeight;
        c.scale = c.tW / c.w;
        frame++;
        c.fill(cRoom.background);

        for (let key in keysPressed) {
            if (keysPressed[key]) {
                if (!keysLastPressed[key]) {
                    cRoom.kD(key);
                    keysLastPressed[key] = true;
                } else if (keysLastPressed[key]) {
                    cRoom.kH(key);
                }
            }
        }
        if (leftclicked) {
            cRoom.click(lastClick.x, lastClick.y);
            leftclicked = 0;
        }

        cRoom.step();
        cRoom.draw();
        cRoom.dGUI();

        if (o.showFPS){
            c.dT(`FPS:${Math.round(1000 / (Date.now() - lastTime))}`, 0+c.cam.x, 0+c.cam.y, 1, 1, "#fafafa", "left", "top");
        }

        switch (cRoom.name) {
            case "menu":
            case "Editor":
                c.ctx.drawImage(img.cursor, Math.round(mse.x), Math.round(mse.y), img.cursor.width*2, img.cursor.height*2);
                break;
            case "Game":
                c.ctx.drawImage(img.ingame, Math.round(mse.x)-16, Math.round(mse.y)-16, 32, 32);
                break;
        }
        lastTime = Date.now();

    } , 1000/targFPS); // 60 fps

} catch (error) {
    c.fill("#1c1c1c");
    c.dT("Death By Hamster", c.w / 2, c.h / 2 - 40, 2, 2, "white", "middle");
    c.dT(`${error}`, c.w/2, c.h / 2, 1, 1, "red", "middle");
    c.dT(`pls let Bye know by emailing him via`, c.w /2, c.h / 2 + 40, 1, 1, "white", "middle");
    c.dT('bye at byecorps.com', c.w / 2, c.h / 2 + 60, 2, 2, "white", "middle");
}
