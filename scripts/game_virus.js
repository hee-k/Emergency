var canvas = document.getElementById("canv");
var c = canvas.getContext("2d");
var img = new Image();
var life = 3;


class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 80;
        this.ySpeed = 3;
        this.xSpeed = 0;
    }
    show() {
        c.fillStyle = '#FFCC99';
        if (life == 2) {
            c.fillStyle = '#F2EA00';
        }
        if (life == 1) {
            c.fillStyle = '#6ACB20';
        }
        if (life == 0) {
            c.fillStyle = '#519C17';
        }
        if (life < 0) {
            c.fillStyle = '#504120';
        }
        c.fillRect(this.x, this.y, this.w, this.h);
        c.fillStyle = 'black';
        if (!dead) {
            c.fillRect(this.x + 5, this.y + 10, 10, 5);
            c.fillRect(this.x + 25, this.y + 10, 10, 5);
            c.fillRect(this.x + 5, this.y + 22, 30, 5);
        } else {
            c.fillRect(this.x + 10, this.y + 5, 5, 10);
            c.fillRect(this.x + 10, this.y + 25, 5, 10);
            c.fillRect(this.x + 22, this.y + 5, 5, 30);
        }

    }
    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.ySpeed += gravity;
        if (this.y >= 750 - this.h) {
            this.ySpeed = 0;
            canJump = true;
        } else {
            canJump = false;
        }
        if (this.x >= 800 - 40) {
            this.x = 800 - 40;
        }
        if (this.x <= 0) {
            this.x = 0;
        }
    }
}
class Virus {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 15;
        this.h = 15;
        this.ySpeed = 3;
    }
    show() {
        c.fillStyle = 'grey';
        c.beginPath();
        c.arc(this.x, this.y, this.w, 0, 2 * Math.PI);
        c.closePath();
        c.fill();
        c.fillStyle = 'red';
        c.fillRect(this.x - 3, this.y - 22, 5, 7);
        c.fillRect(this.x - 3, this.y + 15, 5, 7);
        c.fillRect(this.x + 15, this.y - 4, 7, 5);
        c.fillRect(this.x - 20, this.y - 4, 7, 5);
        c.fillRect(this.x + 5, this.y - 11, 4, 4);
        c.fillRect(this.x - 8, this.y - 11, 4, 4);
        c.fillRect(this.x + 5, this.y + 9, 4, 4);
        c.fillRect(this.x - 8, this.y + 9, 4, 4);


    }
    update() {
        this.y += this.ySpeed;
        this.ySpeed += gravity;
        //사망 판정
        if (p.x < this.x + this.w && p.x + p.w > this.x && p.y < this.y + this.h && p.y + p.h > this.y) {
            life--;
            this.x = -this.width;
            if (life < 0) {
                dead = true;
            }
        }
    }
}



function makeVirus() {
    if (!dead) {
        var a = new Virus(Math.floor(Math.random() * 800), -50);
        virus.push(a);
        setTimeout(makeVirus, spawnSpeed);
    }

}

function moreSpeed() {
    setInterval(function () {
        spawnSpeed--;
    }, 50)
}


var p;
var score = 0;
var gravity = 0.1;
var canJump = false;
var virus = [];
var spawnSpeed = 1000;
var dead = false;
window.onload = function () {
    start();
    setInterval(addScore, 1000);
    setInterval(update, 10);
}
function start() {
    p = new Player(360, 400);
    //장애물 소환
    makeVirus();
    moreSpeed();

}

function addScore() {
    if(!dead){
        score = score + 10;
    }
    
}

function update() {
    //목숨
    if (life == 3) {
        img.src = './images/game_virus/./h4.png';
        img.onload = function () {
            c.drawImage(img, 10, 10);
        }
    }
    if (life == 2) {
        img.src = './images/game_virus/./h3.png';
        img.onload = function () {
            c.drawImage(img, 10, 10);
        }
    }
    if (life == 1) {
        img.src = './images/game_virus/./h2.png';
        img.onload = function () {
            c.drawImage(img, 10, 10);
        }
    }
    if (life == 0) {
        img.src = './images/game_virus/./h1.png';
        img.onload = function () {
            c.drawImage(img, 10, 10);
        }
    }
    if (life == -1) {
        img.src = './images/game_virus/./h0.png';
        img.onload = function () {
            c.drawImage(img, 10, 10);
        }
    }



    //배경
    c.fillStyle = '#330000';
    c.fillRect(0, 0, 800, 800);

    //지면
    c.fillStyle = '#660000'
    c.fillRect(0, 750, 800, 100);
    //캐릭터
    p.show();
    p.update();
    //장애물
    for (var i = 0; i < virus.length; i++) {
        virus[i].show();
        virus[i].update();

    }
    //사망화면
    if (dead) {
        document.getElementById("playButton").style.display = "block"
        document.getElementById("dead").style.display = "block"

        p.w = 80;
        p.h = 40;
        p.xSpeed = 0;
    }
    function keyDown(e) {
        var key = e.keyCode;
        if (key == 39 && p.x < 800 && !dead) {
            p.xSpeed = 5;
        }
        if (key == 37 && p.x > 0 && !dead) {
            p.xSpeed = -5;
        }
        if (key == 38 && canJump && !dead) {
            p.ySpeed = -3;
        }
    }
    function keyUp(e) {
        var key = e.keyCode;
        if (key == 39 && p.x < 800) {
            p.xSpeed = 0;
        }
        if (key == 37 && p.x > 0) {
            p.xSpeed = 0;
        }
    }
    function makeVirus() {
        if (!dead) {
            var a = new Virus(Math.floor(Math.random() * 800), -50);
            virus.push(a);
            setTimeout(makeVirus, spawnSpeed);
        }

    }
    function moreSpeed() {
        setInterval(function () {
            spawnSpeed--;
        }, 50)
    }
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;

    c.fillText("Score: " + score, 15, 120);
    c.font = "30px malgun gothic";









}