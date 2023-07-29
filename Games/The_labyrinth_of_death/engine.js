
const canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    units = 16;
var lastTime = 0, deltaTime = 0;
context.imageSmoothingEnabled = false;
var canvasTranslationX = 0, canvasTranslationnY = 0;

canvas.width = 128;
canvas.height = 128;

const pianoFrequencies = [130, 146, 164, 174, 195]

function CMIDI(string, context) {
    let bin = "";
    for (let char in string) {
        bin += char.charCodeAt(char).toString(2).padStart(8, "0");
    }
    for (let i = 0; i < (bin.length / 5 | 0) * 5; i++) {
        const osc = context.createOscillator();
        osc.connect(context.destination);
        osc.frequency.setValueAtTime(pianoFrequencies[i % 5], context.currentTime);
        osc.start(context.currentTime + i * .5);
        osc.stop(context.currentTime + .5 + i * .5);
    }
}

class Sound {
    constructor(audioContext) {
        this.AudioContext = audioContext;
        this.MainGainNode = this.AudioContext.createGain();
        this.MainGainNode.connect(this.AudioContext.destination);
        this.MainGainNode.gain.value = .1;

        this.FootStepGainNode = this.AudioContext.createGain();
        this.FootStepGainNode.connect(this.AudioContext.destination);
        this.FootStepGainNode.gain.value = 1;
    }

    PlayTone(duration, frequency, start = 0) {
        const oscillator = this.AudioContext.createOscillator();
        oscillator.connect(this.MainGainNode);
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = frequency;
        oscillator.start(this.AudioContext.currentTime + start);
        oscillator.stop(this.AudioContext.currentTime + start + duration);
    }

    FootStep() {
        const oscillator = this.AudioContext.createOscillator();
        oscillator.connect(this.FootStepGainNode);
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 1;
        oscillator.start(this.AudioContext.currentTime);
        oscillator.stop(this.AudioContext.currentTime + .2);
    }

    PlayMelody() {
        let frequencies = [311.1270, 329.6276, 440, 415.3047, 349.2282, 391.9954],
            melody = [
                1, 0, .2,
                0, .2, .3,
                2, .6, .2,
                3, .8, .4,
                1, 2.4, .35,
                2, 2.7, .3,

                2, 5.0, .2,
                3, 5.2, .4,
                1, 6.4, .35,
                2, 6.7, .3,

                2, 8.6, .2,
                3, 8.8, .4,
                1, 10.3, .4,
                5, 10.8, .4,
                4, 11.3, .4,
                5, 11.8, .3,
                4, 12, .3,
                1, 12.2, .4,
            ];
        for (let i = 0; i < melody.length; i += 3)
            this.PlayTone(melody[i + 2], frequencies[melody[i]], melody[i + 1]);
    }
}

let audioContext = new AudioContext(),
    sound = new Sound(audioContext);
let musicStarted = false;
onclick = onkeypress = onfocus = e => {
    if (musicStarted) return
    sound.PlayMelody();
    setInterval(e => { sound.PlayMelody() }, 14000);
    musicStarted = true;
}

with (context) {
    //#region TINYFONT
    const DEFAULT_CHAR_HEIGHT = 5;
    const DEFAULT_COLOR = 'white';


    const initFont = ({ height = DEFAULT_CHAR_HEIGHT, ...chars } = {}, ctx) => {
        const bin2arr = (bin, width) => bin.match(new RegExp(`.{${width}}`, 'g'));

        return (string, x = 0, y = 0, size = 5, color = DEFAULT_COLOR) => {
            const renderChar = (charX, char) => {
                const pixelSize = size / height;
                const fontCode = chars[char.charCodeAt()] || '';
                const binaryChar = fontCode > 0 ? fontCode : fontCode.codePointAt();

                const binary = (binaryChar || 0).toString(2);

                const width = Math.ceil(binary.length / height);
                const marginX = charX + pixelSize;
                const formattedBinary = binary.padStart(width * height, 0);
                const binaryCols = bin2arr(formattedBinary, height);

                binaryCols.map((column, colPos) =>
                    [...column].map((pixel, pixPos) => {
                        fillStyle = !+pixel ? 'transparent' : color; // pixel == 0 ?
                        fillRect(x + marginX + colPos * pixelSize, y + pixPos * pixelSize, pixelSize, pixelSize);
                    })
                );

                return charX + (width + 1) * pixelSize
            };
            [...string].reduce(renderChar, 0);
        };
    };
    const font = [...Array(33),
        29,     // ! 11101
        , // "
        , // #
        , // $
        , // %
        , // &
        12, // ' 01100
        , // (
        , // )
        , // *
        "ᇄ",    // 4548    + 00100 01110 00100
        3,      // 3       , 00011
        "ႄ",    // 4228    - 00100 00100 00100
        1,      // 1       . 00001
        1118480,    // 1118480 / 00001 00010 00100 01000 10000
        "縿",    // 32319   0 11111 10001 11111
        31,     // 31      1 11111
        "庽",    // 24253   2 10111 10101 11101
        "嚿",    // 22207   3 10101 10101 11111
        "炟",   // 28831   4 11100 00100 11111
        "皷",   // 30391   5 11101 10101 10111
        "纷",   // 32439   6 11111 10101 10111
        "䈟",   // 16927   7 10000 10000 11111
        "线",   // 32447   8 11111 10101 11111
        "皿",   // 30399   9 11101 10101 11111
        17,     // 17      : 10001
        , // ;
        , // <
        "⥊",  // = 01010 01010 01010
        , // >
        "䊼",  // ? 10000 10101 11100
        , // @
        "㹏",  // 15951  A 01111 10010 01111
        "纮",  // 32430  B 11111 10101 01110
        "縱",  // 32305   C 11111 10001 10001
        "縮",  // 32302   D 11111 10001 01110
        "纵",  // 32437   E 11111 10101 10101
        "纐",  // 32400   F 11111 10100 10000
        "񴚦",  // 476838  G 01110 10001 10101 00110
        "粟",  // 31903   H 11111 00100 11111
        "䟱",  // 18417   I 10001 11111 10001
        "丿",  // 20031   J 10011 10001 11111
        1020241,  // 1020241 K 11111 00100 01010 10001
        "簡",        // 31777   L 11111 00001 00001
        33059359,   // 33059359 M 11111 10000 11100 10000 11111
        1024159,  // 1024159 N 11111 01000 00100 11111
        "縿",  // 32319   O 11111 10001 11111
        "纜",  // 32412   P 11111 10100 11100
        "񼙯",  // 509551  Q 01111 10001 10011 01111
        "繍",  // 32333   R 11111 10010 01101
        "皷",  // 30391   S 11101 10101 10111
        "䏰",  // 17392   T 10000 11111 10000
        "簿",  // 31807   U 11111 00001 11111
        25363672,  // 25363672 V 11000 00110 00001 00110 11000
        32541759,  // 32541759 W 11111 00001 00011 00001 11111
        18157905,   // 18157905 X 10001 01010 00100 01010 10001
        "惸",        // 24824   Y 11000 00111 11000
        18470705,   // 18470705 Z 10001 10011 10101 11001 10001
        , // [
        , // \
        , // ]
        , // ^
        "С", // 1057 _ 00001 00001 00001
        //, // `
        //// #97:
        //, // a
        //,,,,,,,,,,,,,,,,,,,,,,,,,
        //// #123:
        //, // {
        //, // |
        //, // }
        //, // ~
    ];
    const render = initFont(font, context);
    //#endregion TINYFONT

    //My sprite library
    function SGF16(string, x, y, color = "#FFF", flip = 0, force = 0) {
        flip *= 16;
        fillStyle = color;
        if (x + canvasTranslationX < 144 && x + canvasTranslationX > -16, y + canvasTranslationnY < 144 && y + canvasTranslationnY > -16 || force)
            for (let i = 0; i < 32; i++) {
                var bin = string.charCodeAt(i).toString(2).padStart(8, "0");
                for (let j = 0; j < 8; j++)
                    +bin[j] && fillRect(Math.abs(flip - (j + (i % 2 ? 8 : 0))) + x, ((i / 2) | 0) + y, 1, 1);
            }
    }

    function SGF8(string, x, y, color = 'red') {
        fillStyle = color;
        for (let i = 0; i < 8; i++) {
            var bin = string.charCodeAt(i).toString(2).padStart(8, "0");
            for (let j = 0; j < 8; j++)
                +bin[j] && fillRect(j + x, i + y, 1, 1);
        }
    }

    function Loop(time) {
        if (transitionCounter < 1 && transitionCounter > 0) {
            if (nextScreen) currentScreen = nextScreen;
            nextScreen = null;
        }

        currentScreen.Update();
        if (transitionCounter > 1) {
            currentScreen.Draw();
            context.fillStyle = `rgba(0, 0, 0, ${2 - transitionCounter})`;
            context.fillRect(0, 0, 128, 128);
        } else {
            currentScreen.Draw();
            context.fillStyle = `rgba(0, 0, 0, ${transitionCounter})`;
            context.fillRect(0, 0, 128, 128);
        }
        transitionCounter -= 0.05;

    }

    class PlayScreen {
        static Heart = "fÿóûÿ~<"
        constructor(map = new GameMap()) {
            this.Map = map;
            this.Player = new Player(16, 16);
            this.Entities = [
                new Level1Boss(256, 608), new Portal(-32, 608),
                new Zombie(448, 144), new Zombie(384, 160), new Zombie(32, 96), new Zombie(448, 336), new Zombie(704, 176), new Zombie(736, 176), new Zombie(896, 336), new Zombie(576, 448), new Zombie(48, 368), new Zombie(112, 336), new Zombie(224, 368), new Zombie(48, 496), new Zombie(48, 528), new Zombie(176, 528), new Zombie(176, 496), new Zombie(240, 496), new Zombie(240, 528), new Zombie(576, 448), new Zombie(720, 464), new Zombie(832, 432)
                , new Dling(64, 400), new Dling(240, 464), new Dling(64, 464), new Dling(240, 400), new Dling(752, 96), new Dling(800, 384), new Dling(912, 448), new Dling(864, 512), new Dling(704, 512), new Dling(464, 512), new Dling(448, 416),
            ];
            this.Lives = 5;
            this.Signposts = [new Signpost(undefined, 0, 16), new Door(0, 592, 10), new Door(0, 608, 10), new Door(0, 626, 10), new Signpost("PRESS SPACE TO USE THE SWORD", 176, 176), new Signpost("USE SWORDS TO ATTACK ZOMBIES", 432, 32), new Signpost("YOU ARE ON THE RIGHT PATH", 288, 272), new Signpost("NO HUMANS ALLOWED", 32, 96)];
            this.Tridents = [];
            this.Sword = new Item(160, 144);
            this.Keys = [];
            this.Boomerang = new Boomerang();
            this.HasBoomerang = false;
        }

        Update() {
            this.Player.Update(this.Map.IsEmpty.bind(this.Map));
            for (let i = 0; i < this.Entities.length; i++) {
                if (this.Entities[i].Kill) this.Entities.splice(i, 1);
                else this.Entities[i].Update(this.Map.IsEmpty.bind(this.Map));
            }
            if (this.Sword.Picked) this.Player.HasSword = true;
            this.Text = "";
            this.Sword.Update();
            for (let i = 0; i < this.Signposts.length; i++) {
                if (this.Signposts[i].Kill) {
                    this.Signposts.splice(i, 1);
                }
                else this.Signposts[i].Update();

            }
            for (let i = 0; i < this.Tridents.length; i++) {
                if (this.Tridents[i].Kill) this.Tridents.splice(i, 1);
                else this.Tridents[i].Update(this.Map.IsEmpty.bind(this.Map));

            }
            for (let i = 0; i < this.Keys.length; i++) {
                if (this.Keys[i].Kill) {
                    this.Keys.splice(i, 1);
                }
                else this.Keys[i].Update();
            }

            if (this.HasBoomerang) this.Boomerang.Update(this.Map.IsEmpty.bind(this.Map));
            if (this.Lives <= 0) switchScreen(new DeathScreen());
            if (this.Change) this.ChangeScreen();
        }

        ChangeScreen() {
            switchScreen(new PlayScreenLevel2());
        }

        Draw() {
            save();
            fillStyle = "#0b130777"
            fillRect(0, 0, canvas.width, canvas.height); //Clear canvas
            canvasTranslationX = 64 - (this.Boomerang.Active ? this.Boomerang.X : this.Player.X)
            canvasTranslationnY = 64 - (this.Boomerang.Active ? this.Boomerang.Y : this.Player.Y)
            translate(canvasTranslationX, canvasTranslationnY);
            this.Map.Draw();
            this.Player.Draw();
            this.Entities.forEach(z => z.Draw());
            this.Signposts.forEach(s => s.Draw());
            this.Sword.Draw();
            this.Tridents.forEach(t => t.Draw());
            this.Keys.forEach(k => k.Draw());
            this.Boomerang.Draw();
            restore();

            for (let i = 0; i < this.Lives * 10; i += 10) {
                SGF8(PlayScreen.Heart, i, 1)
            }

            if (this.Text) {
                strokeStyle = "white";
                lineWidth = '1px';
                strokeRect(4, canvas.height - 11, canvas.width - 16, 10);
                render(this.Text, 6, canvas.height - 8);
            }
        }
    }

    class Portal {
        static Sprite = "À       !|!AA>    ð";
        constructor(x, y) {
            this.X = x;
            this.Y = y;
            this.Rotation = 0;
        }

        Update() {
            this.Rotation += .25;
            if (Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y) < 3) {
                currentScreen.Change = true;
            }
        }

        Draw() {
            save();
            translate(this.X + 8, this.Y + 8);
            rotate(this.Rotation);
            SGF16(Portal.Sprite, -8, -8, "white", 0, 1);
            restore();
        }
    }

    class PlayScreenLevel2 extends PlayScreen {

        constructor() {
            super(new GameMap(64, 30, GameMap.Map2));
            this.Entities = [
                new Level2Boss(512, 400),
                new Ghost(64, 240), new Ghost(64, 224), new Ghost(336, 256), new Ghost(352, 256), new Ghost(112, 288), new Ghost(112, 352), new Ghost(112, 416), new Ghost(432, 432)
                , new Zombie(448, 32), new Zombie(448, 96), new Zombie(528, 96), new Zombie(544, 32), new Zombie(688, 80), new Zombie(800, 384), new Zombie(800, 448), new Zombie(320, 368), new Zombie(416, 368)
                , new Dling(80, 352), new Dling(144, 416), new Dling(496, 416), new Dling(496, 448), new Dling(432, 64)
                , new Shuriken(656, 272), new Shuriken(816, 128), new Shuriken(816, 176), new Shuriken(624, 64), new Shuriken(656, 272), new Shuriken(512, 176)
            ];
            this.Keys = [new Key(400, 336), new Key(496, 64, 1), new Key(880, 128, 2)];
            this.Signposts = [new Door(432, 304), new Door(432, 304 - 16), new Door(592, 320, 1), new Door(592 + 16, 320, 1), new Door(992, 400, 2), new Door(976, 400, 2), new Signpost("YOU SURVIVED!", 0, 48), new Signpost("NOW YOU HAVE A BOOMERANG!", 0, 32), new Signpost("GO GET THAT STONE!", 0, 16), new Signpost("HOLD SHIFT FOR BOOMERANG", 16, 640)];
            this.HasBoomerang = true;
            this.Player.HasSword = 1;
            this.Sword = new Item(-2056, -2056);

        }
    }

    class Key {
        static Sprite = "àà          ";
        constructor(x = 0, y = 0, id = 0) {
            this.X = x;
            this.Y = y;
            this.Id = id;
            this.Kill = false;
        }

        Update() {
            if (Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y) < 10) {
                currentScreen.Player.Keys.push(this.Id);
                this.Kill = true;
                sound.PlayTone(.1, 500, 0);
            }
        }

        Draw() {
            SGF16(Key.Sprite, this.X, this.Y, "yellow");
        }
    }

    class Door {
        static Sprite = "ÿÿÁ!!!AA!ñÿÿ";
        constructor(x = 0, y = 0, id = 0) {
            this.X = x;
            this.Y = y;
            this.Id = id;
        }

        Update() {
            if (currentScreen.Player.Keys.indexOf(this.Id) != -1) {
                this.Kill = true;
            }
        }

        Draw() {
            SGF16(Door.Sprite, this.X, this.Y, "yellow");
        }
    }

    class DeathScreen {
        constructor() {
            fillStyle = "#000A";
            fillRect(0, 0, canvas.width, canvas.height);
        }

        Update() { }

        Draw() {
            render("GAME OVER. HADES POSSESSES YOU.", 6, 16, 5, "red");
            render("PRESS F5 TO TRY AGAIN", 32, 108);
        }
    }

    class WinScreen {
        constructor() {
            clearRect(0, 0, canvas.width, canvas.height);
        }

        Update() {

        }

        Draw() {
            render("YOU GOT THE PHILOSPHER'S STONE!", 6, 16, 5, "lightgreen");
            SGF16(PhilosophersStone.Sprite, 54, 54, "red", 0, 1);
            render("OH, BUT IT'S JUST A LUMP OF PLASTIC.", 0, 108);
        }
    }


    class BaseSolid {
        constructor(x = 32, y = 32) {
            this.X = x;
            this.Y = y;
            this.NextX = x;
            this.NextY = y;
            this.Color = "#FFF";
            this.Direction = 2
            this.SpriteSide = "ø èHèè à   o o     ";
            this.SpriteBack = "?ü /ô/ô/ô/ô/ô/ô  ø/ô/ô/ô @@";
            this.SpriteFace = "?ü /ô/ô-´/ô/ô,4À8/ô/ô/ô @@";
            this.Speed = 1;

        }

        Update(checkFunction, _up, _down, _left, _right) {
            if (!(this.X + canvasTranslationX < 144 && this.X + canvasTranslationX > -16, this.Y + canvasTranslationnY < 144 && this.Y + canvasTranslationnY > -16)) return;
            //Move the character acording to the next position
            var distanceX = this.X - this.NextX;
            distanceX && (this.X -= Math.sign(distanceX) * this.Speed);

            var distanceY = this.Y - this.NextY;
            distanceY && (this.Y -= Math.sign(distanceY) * this.Speed);

            if (!(distanceX || distanceY)) { //Finished moving
                (_up && checkFunction(this.X, this.Y - units) && (this.NextY -= units, this.Direction = 0, 1)) ||
                    (_down && checkFunction(this.X, this.Y + units) && (this.NextY += units, this.Direction = 1, 1)) ||
                    (_left && checkFunction(this.X - units, this.Y) && (this.NextX -= units, this.Direction = 2, 1)) ||
                    (_right && checkFunction(this.X + units, this.Y) && (this.NextX += units, this.Direction = 3, 1))
            }
        }

        Draw() {
            if (this.Direction == 0) SGF16(this.SpriteBack, this.X | 0, this.Y | 0, this.Color, 0);//Up
            if (this.Direction == 1) SGF16(this.SpriteFace, this.X | 0, this.Y | 0, this.Color, 0);//Down
            if (this.Direction == 2) SGF16(this.SpriteSide, this.X | 0, this.Y | 0, this.Color, 1);//Left
            if (this.Direction == 3) SGF16(this.SpriteSide, this.X | 0, this.Y | 0, this.Color, 0);//Right
        }
    }
    class Boomerang extends BaseSolid {
        static Sprite = "  ü=V'ül x P p P p P p P p     ";
        constructor(x = 0, y = 0) {
            super(x, y);
            this.Rotation = 0;
            this.Speed = 2;
            this.NextX = 16;
            this.NextY = 16;
        }

        Update(checkFunction) {
            if (shift || Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y) > 3 && this.Active) {
                if (!this.Active) {
                    this.X = currentScreen.Player.X; this.Y = currentScreen.Player.Y;
                    this.NextY = currentScreen.Player.NextY;
                    this.NextX = currentScreen.Player.NextX;
                }
                this.Active = true;
            } else this.Active = false;

            super.Update(f => 1, up && this.Active, down && this.Active, left && this.Active, right && this.Active);
            this.Rotation += .2;
            if (this.Active) {
                for (let entity of currentScreen.Entities) {
                    const distance = Math.hypot(entity.Y - this.Y, entity.X - this.X);
                    if (distance < 16) {
                        entity.kill = true;
                    }
                }
            }
        }

        Draw() {
            if (!this.Active) return;
            save();
            translate(this.X + 8, this.Y + 8)
            rotate(this.Rotation);
            SGF16(Boomerang.Sprite, -8, -8, "white", 0, 1);
            restore();
        }
    }

    class Item {
        static Sprite = "  \n  2 d Èã @  9 pàÀ";
        constructor(x = 0, y = 0) {
            this.Picked = false;
            this.X = x;
            this.Y = y;
        }

        Update() {
            if (currentScreen.Player.X == this.X && currentScreen.Player.Y == this.Y && !this.Picked) {
                this.Picked = true;
                this.ShowText = true;
                setTimeout((e => { this.ShowText = false }).bind(this), 3000)
            }
            this.ShowText && (currentScreen.Text = "YOU JUST STOLE HADE'S SWORD!")
        }

        Draw() {
            this.Picked || SGF16(Item.Sprite, this.X, this.Y, 'red');
        }
    }

    class Signpost {
        static Sprite = "  ø @I2M¢@OÒ@Nò@Kò@@ÿÿÿÿ"
        constructor(text = "USE WASD TO MOVE", x = 16, y = 16) {
            this.Text = text;
            this.Offset = 0;
            this.X = x;
            this.Y = y;
        }
        Update() {
            if (Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y) < 17) {
                currentScreen.Text = this.Text;
            }
        }
        Draw() {
            SGF16(Signpost.Sprite, this.X, this.Y, "white")
        }
    }
    class Level1Boss extends BaseSolid {
        get Kill() { return this.kill }
        set Kill(value) {
            sound.PlayTone(.1, 500, 0);
            if (value) currentScreen.Keys.push(new Key(this.X, this.Y, 10)),
                this.kill = value;
        }
        constructor(x, y) {
            super(x, y)
            this.SpriteFace = `0\`ø7ì1ÿÿ»Ý¿ý¿ý¸;Üø@@
 `;
            this.SpriteSide = `  À¸þ\rÞ\rþ\rÀ\rÞ\rþüø @ @ \``;
            this.SpriteBack = `0\`ø?ü?üÿÿ¿ý¿ý¿ý¿ý?üø@@
 `;;
            this.Color = "crimson";
            this.TridentCounter = 0;
            this.Speed = 1;
            this.Boomerang = new BadBoomerang(x, y);
        }

        Update(checkFunction) {
            if (Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y) > 96) {
                return
            }
            super.Update(checkFunction, currentScreen.Player.Y < this.Y, currentScreen.Player.Y > this.Y, currentScreen.Player.X < this.X, currentScreen.Player.X > this.X);
            this.TridentCounter++;

            if (!(this.TridentCounter % 32)) this.Shoot();
            this.Boomerang.Update(checkFunction);
        }

        Draw() {
            super.Draw();
            this.Boomerang.Draw();
        }

        Shoot() {
            currentScreen.Tridents.push(
                new Trident(this.X, this.Y, 0, 2),
                new Trident(this.X, this.Y, 2, 0),
                new Trident(this.X, this.Y, 0, -2),
                new Trident(this.X, this.Y, -2, 0)
            )
        }
    }

    class StartScreen {
        constructor() {

        }

        Update() {
            if (space) switchScreen(new PlayScreen());
        }

        Draw() {
            render("THE LABYRINTH OF DEATH", 20, 16, 5, "lightblue");
            render("DEVELOPED BY DURGESH4993", 15, 32, 5);
            render("PRESS SPACE TO PLAY", 32, 108);
        }
    }

    class Fire {
        get Kill() { return this.Counter < -90 }
        set Kill(value) { }
        constructor(x = 32, y = 32) {
            this.X = x;
            this.Y = y;
            this.Sprite = "                 @@À"; //Little fire
            this.Counter = 45;
        }

        Update() {
            if (this.Counter-- < 0) {
                this.Sprite = "\0\n@d ¤ ªQBSB^IHòòòò@?ø"; //Big fire
                if (this.X / 16 == currentScreen.Player.X / 16 | 0 && this.Y / 16 == currentScreen.Player.Y / 16 | 0) {
                    currentScreen.Lives--;
                    currentScreen.Player.Blink();
                    Sound.PlayTone(.1, 100);
                }
            }
        }

        Draw() {
            SGF16(this.Sprite, this.X, this.Y, "orange");
        }
    }

    class Level2Boss extends BaseSolid {
        get Kill() {
            return this._kill;
        }

        set Kill(value) {
            this._kill = value;
            sound.PlayTone(.1, 500, 0);

            if (this._kill) {
                currentScreen.Entities.push(new PhilosophersStone(this.X, this.Y));
            }
        }
        constructor(x, y) {
            super(x, y);
            this.SpriteFace = 'ðøØøøàðòòðøø¿ü¿ü¿ü';
            this.SpriteBack = 'ðøøøøñá0OñOññùù?ý?ý?ý';
            this.SpriteSide = 'ðøØøø ð  oðððøø?ü?ü?ü';
            this.Color = "crimson";
            this.FireCounter = 32;
            this.ZombieCounter = 64;
        }

        Update(checkFunction) {
            if (Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y) > 128) {
                return
            }
            const value = Math.random();
            super.Update(checkFunction, value < .25, value > .25 && value < .5, value > .5 && value < .75, value > .75);
            if (!(this.FireCounter % 32)) currentScreen.Entities.push(new Fire(this.NextX, this.NextY));
            if (!(this.ZombieCounter++ % 64)) {
                currentScreen.Entities.push(new Zombie(this.NextX, this.NextY));
            }
        }
    }

    class Ghost extends BaseSolid {
        get Kill() {
            return this.kill;
        }

        set Kill(value) {
            if (value == "player") {
                this.kill = true;
                return;
            }
            if (value == "bomerang") this.kill = true;
            sound.PlayTone(.1, 500, 0);
        }
        constructor(x, y) {
            super(x, y);
            this.SpriteSide = "    øüüÌÜüüÄôüü    ";
            this.SpriteFace = "    øüüÌ\rìüüüÜü    ";
            this.SpriteBack = "    øüüüüüüüüüü    ";
            this.Color = "#FFF8"
        }

        Update() {
            super.Update(f => 1, currentScreen.Player.Y < this.Y, currentScreen.Player.Y > this.Y, currentScreen.Player.X < this.X, currentScreen.Player.X > this.X);
            if (Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y) < 17) {
                this.Kill = 'player';
                currentScreen.Lives--;
                currentScreen.Player.Blink();
                sound.PlayTone(.1, 200);
            }
        }
    }

    class Player extends BaseSolid {
        static Sword = "  ÀÀÀÀÀÀÀÀÀð!";
        constructor(x = 0, y = 0) {
            super(16, 16);
            this.CurrentBlink = false;
            this.Sword = 0;
            this.Speed = 2;
            this.Keys = [];
            this.WalkCounter = 0;
            this.NextStep = 13;
        }

        Update(checkFunction) {
            super.Update(checkFunction, up && !currentScreen.Boomerang.Active, down && !currentScreen.Boomerang.Active, left && !currentScreen.Boomerang.Active, right && !currentScreen.Boomerang.Active);
            if (up && !currentScreen.Boomerang.Active || down && !currentScreen.Boomerang.Active || left && !currentScreen.Boomerang.Active || right && !currentScreen.Boomerang.Active) {
                this.WalkCounter++;
                if (!(this.WalkCounter % this.NextStep)) {
                    this.NextStep = (Math.random() * 5 | 0) + 12; //A touch of randomness
                    this.WalkCounter = 1;
                    sound.FootStep();
                }
            } //Footstep sound fx

            //Check if a enemy hit sword
            if (this.HasSword && space)
                for (let zombie of currentScreen.Entities) {
                    const distance = Math.hypot(zombie.Y - this.Y, zombie.X - this.X);
                    if (distance < 32) {
                        const angle = Math.atan2(zombie.Y - this.Y, zombie.X - this.X);
                        zombie.Kill |= Math.abs(angle - [-Math.PI / 2, Math.PI / 2, Math.PI, 0][this.Direction]) < Math.PI / 2;
                    }
                }
        }

        Draw() {
            this.CurrentBlink && this.Blinking ||
                super.Draw();

            if (this.HasSword && space) {
                save();
                translate(this.X + 8, this.Y + 8);
                rotate(-Math.PI * (this.Direction == 1) + Math.PI * 1.5 * (this.Direction == 2) + Math.PI * .5 * (this.Direction == 3)); //Rotate acording to direction
                SGF16(Player.Sword, -8, -24, "red", 0, 1);
                restore();

            }
        }

        Blink() {
            this.Blinking = true;
            setTimeout(e => currentScreen.Player && (currentScreen.Player.Blinking = false), 1e3)
        }
    }

    class PhilosophersStone {
        static Sprite = "Àð?ø<ÿÞÿÞÿÞÿþÿþüü?øðÀ";
        get Kill() {
            return false;
        }

        set Kill(value) {

        }
        constructor(x, y) {
            this.X = x;
            this.Y = y;
        }

        Update() {
            if (Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y) < 17) {
                switchScreen(new WinScreen());
            }
        }

        Draw() {
            SGF16(PhilosophersStone.Sprite, this.X, this.Y, "")
        }
    }

    setInterval(e => { currentScreen.Player && (currentScreen.Player.CurrentBlink ^= 1); }, 1e2); //Player blinking animation

    class Zombie extends BaseSolid {
        get Kill() {
            return this._kill
        }

        set Kill(value) {
            this._kill = value;
            if (value == "player") return;
            if (Math.random() < .2) currentScreen.Lives++;
            sound.PlayTone(.1, 500, 0);
        }
        constructor(x = 0, y = 0) {
            super(x, y);
            this.Color = "#6AA121";
            this.SpriteSide = "  ?ø@_ô_d_ôø  ø þàþ";
            this.SpriteFace = "  ?ü@_ú[Ú_úøàØßûøø   ";
            this.SpriteBack = "  ?ü@_ú_ú_úøø  ßûßûøø   ";
        }

        Update(checkFunction) {



            super.Update(checkFunction, currentScreen.Player.Y < this.Y, currentScreen.Player.Y > this.Y, currentScreen.Player.X < this.X, currentScreen.Player.X > this.X);
            if (Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y) < 17) {
                this.Kill = 'player';
                currentScreen.Lives--;
                currentScreen.Player.Blink();
                sound.PlayTone(.1, 200);
            }
        }
    }

    class Shuriken extends BaseSolid {
        get Kill() {
            return false;
        }

        set Kill(value) { }
        static Sprite = "    Àðü~þp?ðàà À À  ";
        constructor(x, y) {
            super(x, y);
            this.Rotation = 0;
            this.Speed = 0.5;
        }

        Update(checkFunction) {
            super.Update(checkFunction, currentScreen.Player.Y < this.Y, currentScreen.Player.Y > this.Y, currentScreen.Player.X < this.X, currentScreen.Player.X > this.X);
            if (Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y) < 10) {
                this.Kill = true;
                currentScreen.Lives--;
                currentScreen.Player.Blink();
                sound.PlayTone(.1, 100);
            }
            this.Rotation += .3;
        }

        Draw() {
            save();
            translate(this.X + 8, this.Y + 8)
            rotate(this.Rotation);
            SGF16(Shuriken.Sprite, -8, -8, "white", 0, 1);
            restore();
        }
    }

    class BadBoomerang extends BaseSolid {
        get Kill() {
            return false;
        }

        set Kill(value) { }
        constructor(x, y) {
            super(x, y)
            this.Rotation = 0;
            this.Speed = 1;
        }
        Update(checkFunction) {
            super.Update(checkFunction, currentScreen.Player.Y < this.Y, currentScreen.Player.Y > this.Y, currentScreen.Player.X < this.X, currentScreen.Player.X > this.X);
            if (Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y) < 10) {
                this.Kill = true;
                currentScreen.Lives--;
                currentScreen.Player.Blink();
                sound.PlayTone(.1, 100);
            }
            this.Rotation += .3;
        }
        Draw() {
            save();
            translate(this.X + 8, this.Y + 8)
            rotate(this.Rotation);
            SGF16(Boomerang.Sprite, -8, -8, "white", 0, 1);
            restore();
        }
    }

    class Trident {
        static Sprite = "        þ  ÿÿ þ           ";
        constructor(x, y, vx, vy) {
            this.X = x;
            this.Y = y;
            this.Vx = vx;
            this.Vy = vy;
        }

        Update(checkFunction) {
            this.X += this.Vx;
            this.Y += this.Vy;
            if (!checkFunction(this.X, this.Y)) this.Kill = true;
            if (Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y) < 10) {
                this.Kill = true;
                currentScreen.Lives--;
                currentScreen.Player.Blink();
                sound.PlayTone(.1, 100);
            }
        }

        Draw() {
            if (this.X + canvasTranslationX < 144 && this.X + canvasTranslationX > -16, this.Y + canvasTranslationnY < 144 && this.Y + canvasTranslationnY > -16) {
                save();
                translate(this.X + 8, this.Y + 8);
                rotate(Math.atan2(this.Vy, this.Vx) + Math.PI);
                SGF16(Trident.Sprite, -8, -8, "gray", 0, 1);
                restore();
            }
        }
    }

    class Dling extends BaseSolid {
        get Kill() {
            return this._kill
        }

        set Kill(value) {
            this._kill = value;
            if (value == "player") return;
            if (Math.random() < .2) currentScreen.Lives++;
            sound.PlayTone(.1, 500, 0);
        }
        constructor(x = 0, y = 0) {
            super(x, y);
            this.Color = "crimson";
            this.SpriteSide = "    \n à?ð5ð?þ1òò\nR    ";
            this.SpriteFace = "  @@@ðø¸ø8ð À ";
            this.SpriteBack = "  @@@ðøøøøð À ";
            this.TridentCounter = 0;

        }

        Update(checkFunction) {
            this.TridentCounter++;

            const distance = Math.hypot(this.X - currentScreen.Player.X, this.Y - currentScreen.Player.Y)
            if (distance < 17) {
                this.Kill = 'player';
                currentScreen.Lives--;
                currentScreen.Player.Blink();
                sound.PlayTone(.1, 100);
            }
            if (!(this.TridentCounter % 32)) this.Shoot();
            super.Update(checkFunction, currentScreen.Player.Y < this.Y, currentScreen.Player.Y > this.Y, currentScreen.Player.X < this.X, currentScreen.Player.X > this.X);
        }

        Shoot() {
            currentScreen.Tridents.push(new Trident(this.X,
                this.Y, ((+(this.Direction == 3) - +(this.Direction == 2))) * 2,
                ((+(this.Direction == 1) - +(this.Direction == 0))) * 2));
        }
    }

    class GameMap {
        static WallSide = "          ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ  ÿÿÿÿ";
        static FrontCorner = "À@À¿¿¿¿¿¿¿¿ÿÿ";
        static Top = "À\nÀÀÀÀ           ";
        static Map1 = "ÿÿÿÿÿÿÿü       `           øÿþþçÄ   &   1 #ä	ù$ÿ'òL@ 	 b DI I\"HI$ÿñHI$À @I&  @I0 $Iÿþ$$L  ?ù$`   	$    I$ÿÿ?ÿþI$À   I&  @  O0 ÿÿÿÿ     ` ?Äÿÿ  $@    \"   È H  þDHÿÿ0 \"D           ÿüDÿÿã  $            D  Oÿÿþ   \"            ÿÿÿÿÿÿÿ";
        static Map2 = "ÿÿÿÿÿÿÿÿ               ùü?ÿà @	   @	  @ÿÉù D	?øD	 	ÿÿ É  üI   Iÿù  I 	'ÿþI 	 IÿÉ I O?I @  I @  IÿüÿùÿI @ I @ É @ÿð	ÿÏð  	    ù          ÿÿø      ÿÿÿÿÿ";
        constructor(width = 61, height = 43, map = GameMap.Map1) {
            this.Width = width;
            this.Height = height;
            this.Map = "";
            for (let i = 0; i < map.length; i++) {
                this.Map += map.charCodeAt(i).toString(2).padStart(8, "0");
            }
        }

        Set(value, index) {
            this.Map[index] = value;
        }

        Draw() {
            fillStyle = "#668";
            for (let i = 0; i < this.Map.length; i++) {
                if (+this.Map[i]) {
                    var up = +(this.Map[i - this.Width] || 1), down = +(this.Map[i + this.Width] || 1), left = +(this.Map[i - 1] || 1), right = +(this.Map[i + 1] || 1);
                    !(i % this.Height) && (left = 0);
                    i % this.Height == this.Height - 1 && (right = 0);
                    i < this.Height - 1 && (up = 0);
                    i > this.Width * this.Height - this.Height && (down = 0);
                    var x = i % this.Width * units; var y = ((i / this.Width) | 0) * units;
                    currentScreen.Signposts.filter(item => item.X == x && item.Y == y).length ||
                        !(left || right || top || down) ||
                        left && right && (SGF16(GameMap.WallSide, x, y, "#668"), true) ||
                        !left && !right && (fillRect(x + 7, y, 3, 16), true) ||
                        !left && (SGF16(GameMap.FrontCorner, x, y, "#668"), true) ||
                        !right && (SGF16(GameMap.FrontCorner, x - 1, y, "#668", 1), true);
                }
            }
        }

        IsEmpty(x, y) {
            x = x / 16 | 0;
            y = y / 16 | 0; //Convert to map position (ie 32 -> 2)
            if (x > this.Width || x < 0 || y < 0 || y > this.Height) return 1; //Outside map
            var collisioned = false;
            currentScreen.Signposts.forEach(signPost => {
                if ((signPost.X / 16 | 0) == x && (signPost.Y / 16 | 0) == y) {
                    collisioned = true;
                }
            });
            if (collisioned) return;
            return !+(this.Map[x + y * this.Width]); //If map byte is 0
        }
    }

    var up = 0, down = 0, left = 0, right = 0, space = 0, shift = 0; //Key variables
    let updateKeys = (code, value) => {
        if (code == 65) left = value;
        if (code == 87) up = value;
        if (code == 68) right = value;
        if (code == 83) down = value;
        if (code == 16) {
            shift = value;
            if (currentScreen.Boomerang && value == 1) {
                currentScreen.Boomerang.X = currentScreen.Player.X;
                currentScreen.Boomerang.Y = currentScreen.Player.Y;
            }
        }
        if (code == 32) {
            value || currentScreen.Player && currentScreen.Player.HasSword && sound.PlayTone(.1, 100);  //Sword sound
            space = value;
        }
    };
    onkeydown = (e) => { updateKeys(e.keyCode, 1) };
    onkeyup = (e) => { updateKeys(e.keyCode, 0) };


    var currentScreen = new StartScreen();
    var nextScreen = null;
    var transitionCounter = 0;
    function switchScreen(screen) {
        nextScreen = screen;
        if (transitionCounter < 0)
            transitionCounter = 2;
    }
    setInterval(Loop, 1000 / 45);
}