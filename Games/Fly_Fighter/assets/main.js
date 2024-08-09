// Inisialisasi
var btnMulai = document.getElementById('mulai'),
    btnUlangi = document.getElementById('ulangi'),
    text = document.getElementById('text'),
    scoreBoard = document.getElementById('score'),
    livesBoard = document.getElementById('nyawa');

var bannerMulai = document.getElementsByClassName('banner1'),
    bannerAkhir = document.getElementsByClassName('banner2');

var c = document.getElementById('canvas');
let ctx = c.getContext('2d');

let lives = 10,
    score = 0;

let imgShip = new Image(),
    imgEnemy = new Image(),
    laserEffect = new Audio('/assets/laser.mp3'),
    reloadEffect = new Audio('/assets/reload.mp3'),
    vid = document.querySelector('video');

imgShip.src = '/assets/ship.png';
imgEnemy.src = '/assets/musuh.png';

let batasKiri = 10,
    batasKanan = 280,
    batasAtas = 0,
    batasBawah = 130;

let ship = {
    x: batasKanan / 2,
    y: batasBawah
}

let peluru = [],
    enemy = [];

for (i = 0; i < 4; i++) {
    enemy[i] = {
        x: 20 + i * 60,
        y: -10,
        die: false,
        score: true
    }
}
for (i = 0; i < 4; i++) {
    peluru[i] = {
        x: ship.x + 5,
        y: ship.y + 5,
        status: 'ready',
        baca: false
    }
}





// Function Utama
function init() {
    run = setInterval(function () {
        draw();
    }, 1000 / 20)
}

/**
 * drawPeluru
 * Berfungsi untuk menggambar peluru pada canvas
 */
function drawPeluru() {
    for (i = 0; i < enemy.length; i++) {
        if (peluru[i].status == "ready") {
            ctx.fillStyle = 'red';
            ctx.fillRect(peluru[i].x, peluru[i].y, 2, 10);
        }
        if (peluru[i].status == "used") {
            peluru[i].y -= 1;
            ctx.fillStyle = 'red';
            ctx.fillRect(peluru[i].x, peluru[i].y, 2, 10);
        }
    }
}


/**
 * crush
 *  function lek Pesawat nabrak musuh
 */
function crush(){
    for(i=0; i < enemy.length; i++){
        if ((enemy[i].y + 50 / 4 == ship.y || enemy[i].y == ship.y) && (ship.x >= enemy[i].x && ship.x <= enemy[i].x )) {
            lives -= 1
            for (i = 0; i < enemy.length; i++){
                enemy[i].y = 0;
            }
        }
    }
}






/**
 * enemyDie
 * Berfungsi untuk proses menembak
 * apakah musuh mati karena tembakan atau tidak
 */
function enemyDie() {
    for (i = 0; i < enemy.length; i++) {
        for (j = 0; j < 4; j++) {
            if (peluru[i].status == "used") {
                if (peluru[i].x >= enemy[j].x && peluru[i].x <= enemy[j].x + 50 / 4) {
                    if (peluru[i].y == enemy[j].y + 10) {
                        // Jika musuh terkena tembakan
                        enemy[j].die = true;
                        peluru[i].y = -10;
                        if(enemy[j].score == true){
                            score += 10;
                            enemy[j].y = -10
                            enemy[j].score = false;
                        }
                    }
                }
            }
        }
    }
}

/**
 * updateBoard
 * Melakukan update terhadap jumlah score dan juga nyawa
 * sekaligus menampilkan alert menang / kalah
 */
function updateBoard() {
    scoreBoard.innerHTML = score;
    livesBoard.innerHTML = lives;
    if (lives <= 0) {
        clearInterval(run);
        bannerAkhir[0].style.display = 'block';
        text.innerHTML = "Mohon Maaf<br/> kamu gagal memenangkan permainan";
    }
    if (lives >= 1 && score >= 50) {
        clearInterval(run);
        bannerAkhir[0].style.display = 'block';
        text.innerHTML = "Selamat<br/> kamu telah memenangkan permainan";
    }
}

/**
 * reload
 * Melakukan proses reload terhadap peluru
 */
function reload() {
    reloadEffect.play();
    for (i = 0; i < peluru.length; i++) {
        if (peluru[i].y <= 0) {
            peluru[i] = {
                x: ship.x + 6,
                y: ship.y,
                status: 'ready',
            }
        }
    }
}

/**
 * drawEnemy
 * Menggambar musuh pada canvas
 */
function drawEnemy() {
    if (enemy[0].die == true && enemy[1].die == true && enemy[2].die == true && enemy[3].die == true) {
        // Membuat musuh baru jika semua musuh telah terbunuh
        for (i = 0; i < enemy.length; i++) {
            enemy[i] = {
                x: 20 + i * 80,
                y: -10,
                die: false,
                score: true
            }
        }
    } else {
        for (i = 0; i < enemy.length; i++) {
            if (enemy[i].die == false) {
                ctx.drawImage(imgEnemy, 0, 0, 50, 38, enemy[i].x, enemy[i].y, 50 / 4, 38 / 4);
                enemy[i].y += 1;
                if (enemy[i].y > batasBawah + 20) {
                    // jika lewat nyawa berkurang satu
                    lives -= 1;
                    enemy[i].y = -10;
                    return
                }
            }
        }
    }
}

/**
 * drawShip
 * Menggambar kapal aliansi pada canvas
 */
function drawShip() {
    ctx.drawImage(imgShip, 0, 0, 50, 57, ship.x, ship.y, 50 / 4, 57 / 4);
}

/**
 * draw
 * Mengatur lebar canvas & memanggil semua function yang telah dibuat
 */
function draw() {
    ctx.clearRect(0, 0, 600, 600);
    // Memanggil function
    drawEnemy();
    drawShip();
    enemyDie();
    drawPeluru();
    crush();
    updateBoard();
};


// Menambahkan event listener click pada button mulai
btnMulai.addEventListener('click', function () {
    // vid.play();
    bannerMulai[0].style.display = "none"; // hide Banner1
    init();
    document.addEventListener('keydown', function (anu) {
        switch (anu.code) {
            case "Space":
                if (peluru[0].status == 'ready') {
                    laserEffect.play()
                    peluru[0].status = 'used';
                } else if (peluru[1].status == 'ready') {
                    laserEffect.play()
                    peluru[1].status = 'used';
                } else if (peluru[2].status == 'ready') {
                    laserEffect.play()
                    peluru[2].status = 'used';
                } else if (peluru[3].status == 'ready') {
                    laserEffect.play()
                    peluru[3].status = 'used';
                } else {
                    reload();
                }
                break;
            case "ArrowRight":
                if (ship.x < batasKanan) {
                    ship.x += 10;
                }
                for (var i = 0; i < peluru.length; i++) {
                    if (peluru[i].status !== "used") {
                        if (peluru[i].x <= batasKanan)
                            peluru[i].x += 10;
                    }
                }
                break;
            case "ArrowLeft":
                if (ship.x > batasKiri) {
                    ship.x -= 10;
                }
                for (var i = 0; i < peluru.length; i++) {
                    if (peluru[i].status !== "used") {
                        if (peluru[i].x >= batasKiri + 10)
                            peluru[i].x -= 10;
                    }
                }
                break;
            case "ArrowUp":
                if (ship.y > batasAtas) {
                    ship.y -= 10;
                }
                for (var i = 0; i < peluru.length; i++) {
                    if (peluru[i].status !== "used") {
                        if (peluru[i].y > batasAtas + 10)
                            peluru[i].y -= 10;
                    }
                }
                break;
            case "ArrowDown":
                if (ship.y < batasBawah) {
                    ship.y += 10;
                }
                for (var i = 0; i < peluru.length; i++) {
                    if (peluru[i].status !== "used") {
                        if (peluru[i].y < batasBawah)
                            peluru[i].y += 10;
                    }
                }
                break;
            default:
                break;
        }
    })
})

btnUlangi.addEventListener('click', function () {
    // Re-Declare for restart game
    lives = 10,
        score = 0;
    bannerAkhir[0].style.display = "none";
    let batasKiri = 10,
        batasKanan = 280,
        batasAtas = 0,
        batasBawah = 130;
    let ship = {
        x: batasKanan / 2,
        y: batasBawah
    }
    let peluru = [],
        enemy = [];
    for (i = 0; i < 4; i++) {
        enemy[i] = {
            x: 20 + i * 80,
            y: -10,
            die: false,
            score: true
        }
    }
    for (i = 0; i < 4; i++) {
        peluru[i] = {
            x: ship.x + 5,
            y: ship.y + 5,
            status: 'ready',
            baca: false
        }
    }
    init();
    document.addEventListener('keydown', function (anu) {
        switch (anu.code) {
            case "Space":
                if (peluru[0].status == 'ready') {
                    laserEffect.play()
                    peluru[0].status = 'used';
                } else if (peluru[1].status == 'ready') {
                    laserEffect.play()
                    peluru[1].status = 'used';
                } else if (peluru[2].status == 'ready') {
                    laserEffect.play()
                    peluru[2].status = 'used';
                } else if (peluru[3].status == 'ready') {
                    laserEffect.play()
                    peluru[3].status = 'used';
                } else {
                    reload();
                }
                break;
            case "ArrowRight":
                if (ship.x < batasKanan) {
                    ship.x += 10;
                }
                for (var i = 0; i < peluru.length; i++) {
                    if (peluru[i].status !== "used") {
                        if (peluru[i].x <= batasKanan)
                            peluru[i].x += 10;
                    }
                }
                break;
            case "ArrowLeft":
                if (ship.x > batasKiri) {
                    ship.x -= 10;
                }
                for (var i = 0; i < peluru.length; i++) {
                    if (peluru[i].status !== "used") {
                        if (peluru[i].x >= batasKiri + 10)
                            peluru[i].x -= 10;
                    }
                }
                break;
            case "ArrowUp":
                if (ship.y > batasAtas) {
                    ship.y -= 10;
                }
                for (var i = 0; i < peluru.length; i++) {
                    if (peluru[i].status !== "used") {
                        if (peluru[i].y > batasAtas + 10)
                            peluru[i].y -= 10;
                    }
                }
                break;
            case "ArrowDown":
                if (ship.y < batasBawah) {
                    ship.y += 10;
                }
                for (var i = 0; i < peluru.length; i++) {
                    if (peluru[i].status !== "used") {
                        if (peluru[i].y < batasBawah)
                            peluru[i].y += 10;
                    }
                }
                break;
        }
    })
})