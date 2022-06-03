// 횟수 체크 이미지
function Check(path, num) {
    this.images = [];
    this.count = 0;
    this.path = path;
    for (var i = 0; i < num; i++) {
        this.images[i] = new Image();
        this.images[i].src = path + "_empty.png";
    }
}
Check.prototype.fill = function() {
    this.images[this.count].src = this.path + "_fill.png";
    this.count++;
}
Check.prototype.minusFill = function() {
    if(this.count == 0) {
        this.images[this.count].src = this.path + "_empty.png";
    }
    else {
        this.images[this.count-1].src = this.path + "_empty.png";
        this.count--;
    }
}
Check.prototype.empty = function(num) {
    for (var i = 0; i < num; i++) {
        this.images[i].src = this.path + "_empty.png";
    }
    this.count = 0;
}
Check.prototype.image = function(index) {
    this.width = this.images[0].width;
    this.height = this.images[0].height;
    return this.images[index];
}
// 구급대원(hepler) 이미지
function Helper(path, length) {
    this.images = [];
    this.j = 1;
    this.index = 0;
    this.length = length * 2 - 1; // 왔다갔다를 한 묶음으로 저장 (012343210)
    for (var i = 0; i < this.length; i++) {
        this.images[i] = new Image();
        if(i < length) {
            this.images[i].src = path + i + '.png';
        }else if (i >= length){
            this.images[i].src = path + (i - (this.j*2)) + '.png';
            this.j++;
        }
    }
}
Helper.prototype.firstImage = function() {
    return this.images[0];
}
Helper.prototype.image = function() {
    this.width = this.images[0].width;
    this.height = this.images[0].height;
    return this.images[this.index];
}
Helper.prototype.next = function() {
    if(this.index == this.length - 1){
        this.index = 0;
        return true;
    }else {
        this.index++;
        return false;
    }
}

var canvas_cpr = document.getElementById("canvas_cpr");
var ctx = canvas_cpr.getContext("2d");

var helper = { // 구급대원 위치, 크기
    x : 350,
    y : 80,
    width : 470,
    height : 470,
    imgCount : 5
}
var patient = { // 환자 위치, 크기
    x : 350,
    y : 80,
    width : 470,
    height : 470
}
var text = { // 말풍선 위치, 크기
    x : 540,
    y : 100,
    width : 200,
    height : 180
}
var heart = { // 하트 위치, 크기
    x : [],
    y : 20,
    width : 60,
    height : 55
}
heart.x[0] = 40;
var cloud = { // 구름 위치, 크기
    x : [],
    y : 25,
    width : 35,
    height : 35,
    orgX : 0,
    orgY : 0
}
cloud.x[0] = 25;
cloud.orgX = cloud.x[0];
cloud.orgY = cloud.y;
var arc = { // 원 위치, 크기
    x : 490,
    y : 390,
    r : 50
}
var rect = { // 사각형 위치, 크기
    x : [],
    y : 202,
    width : 60,
    height : 60,
}
rect.x[0] = 480;
for (var i = 1; i < 4; i++) {
    rect.x[i] = rect.x[i-1] + rect.width + 4;
}
var arrow = { // 화살표 위치, 크기
    x : 480,
    y : 0,
    width : 50,
    height : 50
}

var BackgroundImg = new Image();
BackgroundImg.src ="./images/game_cpr/backgroundImg.png";
var PatientImg = new Image();
PatientImg.src = "./images/game_cpr/patient.png";
var TextImg = new Image();
TextImg.src = "./images/game_cpr/text.png";

// 흉부압박에 필요한 변수
var HelperChestImg = new Helper("./images/game_cpr/compression", helper.imgCount);
var compressionNum = 16; // 흉부압박 성공에 필요한 횟수
var HeartImg = new Check("./images/game_cpr/heart", compressionNum);

var compression = false;           // 흉부압박 실행여부
var compressionCount = 0;          // 흉부압박 횟수
// var compressionTimer = 0;          // 일정 Frame 이후 helperChest up
// var compressionSpeed = 6;          // 흉부압박 속도
// var orgHelperChestY = helperChest.y;  // 초기 helperChest y위치
var timeRemaining = 20;
var FPS = 50;
var compressionSuccess = false; // 흉부압박 최종 성공여부
var makeCompress = false; // 흉부압박 시키기
var playCompresstion;
var startMakeCompress;
var stopMakeCompress;
var playBreath;

// 인공호흡에 필요한 변수
var HelperBreathImg = new Helper("./images/game_cpr/breath", 1);
var breathNum = 40; // 인공호흡 성공에 필요한 횟수
var CloudImg = new Check("./images/game_cpr/cloud", breathNum);
var breathCount = 0; // 인공호흡 횟수
var breath = false; // 인공호흡 실행여부
var breathSuccess = false; // 인공호흡 최종 성공여부
var ArrowImg = [];  // 화살표 이미지
for (var i = 0; i < 4; i++) {
    ArrowImg[i] = new Image();
    ArrowImg[i].src = "./images/game_cpr/arrow" + (i + 37) + ".png";
}
var left = {
    x : arrow.x+5,
    y : arrow.y,
    width : arrow.width,
    height : arrow.height,
    img : ArrowImg[0],
    breath : false
}
var up = {
    x : arrow.x+9 + rect.width*1,
    y : arrow.y,
    width : arrow.width,
    height : arrow.height,
    img : ArrowImg[1],
    breath : false
}
var right = {
    x : arrow.x+13 + rect.width*2,
    y : arrow.y,
    width : arrow.width,
    height : arrow.height,
    img : ArrowImg[2],
    breath : false
}
var down = {
    x : arrow.x+17 + rect.width*3,
    y : arrow.y,
    width : arrow.width,
    height : arrow.height,
    img : ArrowImg[3],
    breath : false
}
var speed = 5; // 화살표 하강 속도
var speedUp = 0.01; // 화살표 하강 속도 증가
var startLocation = []; // 화살표 시작 위치(랜덤)
var firstStart = true; // 처음 시작하는지 확인
var accuracy = 3; // 화살표 체크 정확도(/)

// 인공호흡 진행 시간 체크
var today = new Date();
var startMin;
var startHour;
var currentMin;
var currentHour;

function Compress() {
    playCompresstion = setInterval(function () {
        ctx.clearRect(0, 0, canvas_cpr.width, canvas_cpr.height);
        ctx.beginPath();
        ctx.drawImage(BackgroundImg, 0, 0, canvas_cpr.width, canvas_cpr.height);
        ctx.drawImage(PatientImg, patient.x, patient.y, patient.width, patient.height);
        HelperChestImg.next();
        ctx.drawImage(HelperChestImg.image(), helper.x, helper.y, helper.width, helper.height);
        if(makeCompress == true){
            ctx.drawImage(TextImg, text.x, text.y, text.width, text.height);
            ctx.fillStyle = "rgba(255, 212, 0, 0.8)";
            ctx.arc(arc.x, arc.y, arc.r, 0, Math.PI * 2);
            ctx.fill();
            compression = false;
        }

        // if(compression == true) {
        //     ctx.fillStyle = "rgba(255, 212, 0, 0.5)";
        //     ctx.arc(arc.x, arc.y, arc.r, 0, Math.PI * 2);
        //     ctx.fill();
        //     compression = false;
        // }
        // 상단 하트 이미지 출력
        for (var i = 0; i < compressionNum; i++) {
            ctx.drawImage(HeartImg.image(i), heart.x[i], heart.y, heart.width, heart.height);
            heart.x[i+1] = heart.x[i] + HeartImg.width;
            // console.log(heart.x[i]);
        }
        // 남은 시간
        if(Math.round(timeRemaining) <= 5){
            ctx.fillStyle = "red";
            ctx.font = "bold 30px Arial";
            ctx.fillText("TIME : " + Math.round(timeRemaining), 45, 130);
        }else if(Math.round(timeRemaining) <= 10 && Math.round(timeRemaining) >= 6){
            ctx.fillStyle = "purple";
            ctx.font = "bold 30px Arial";
            ctx.fillText("TIME : " + Math.round(timeRemaining), 45, 130);
        }else{
            ctx.fillStyle = "black";
            ctx.font = "bold 30px Arial";
            ctx.fillText("TIME : " + Math.round(timeRemaining), 45, 130);
        }
        // 성공 or 실패
        if((timeRemaining <= 0 && compressionCount >= compressionNum) || (compressionCount >= compressionNum)) {
            ctx.fillStyle = "red";
            ctx.font = "bold 60px Arial";
            ctx.fillText("CPR 성공", (canvas_cpr.width / 2) - 120, (canvas_cpr.height / 2) + 30);
            compressionSuccess = true;
            // Breathe 시작 시간
            startMin = today.getMinutes();
            startHour = today.getHours();
            Breathe();
            clearInterval(playCompresstion);
            clearInterval(startMakeCompress);
            clearInterval(stopMakeCompress);
        } else if(timeRemaining <= 0 && compressionCount < compressionNum){
            ctx.fillStyle = "red";
            ctx.font = "bold 60px Arial";
            ctx.fillText("CPR 실패", (canvas_cpr.width / 2) - 120, (canvas_cpr.height / 2) + 30);
            // 다시 시작하려면 R
            ctx.font = "bold 20px Arial";
            ctx.fillText("Press R to play again", (canvas_cpr.width / 2) - 85, (canvas_cpr.height / 2) + 60);
        }
        // 시간 흐름
        if(timeRemaining > 0 && compressionSuccess == false) {
            timeRemaining -= 1/30;
        }
        // // cpr 실행 시(input space bar)
        // if(compression == true) {
        //     compression = false;
        //     // helperChest.y += compressionSpeed;
        //     // compressionTimer++;
        // }
        // // // 일정 Frame 이후 helperChest up
        // // if(compressionTimer > 8) {
        // //     compression = false;
        // //     helperChest.y -= compressionSpeed;
        // //     if(helperChest.y ==  orgHelperChestY) {
        // //         compressionTimer = 0;
        // //     }
        // // }
                
    }, FPS);
}
// Compression 시키기
function MakeCompress(){
    startMakeCompress = setInterval(function(){
        makeCompress = true;
    }, (Math.floor(Math.random() * (2000-1000+1)) + 1000));
    stopMakeCompress = setInterval(function(){
            makeCompress = false;
    }, (Math.floor(Math.random() * (1000-800+1)) + 800));
}
// 재시작(변수 초기화)
function ReStart() {
    compressionCount = 0;
    //orgHelperChestY = helperChest.y;
    timeRemaining = 10;
    heart.x[0] = 390;
    HeartImg.empty(compressionNum);
}
function CompressClick(event){
    // 마우스 좌표
    var x = event.clientX - canvas_cpr.offsetLeft;
    var y = event.clientY - canvas_cpr.offsetTop;

    // 도형의 좌표
    var shapeX = arc.x - arc.r;
    var shapeY = arc.y - arc.r;
    var shapeS = arc.x + arc.r - shapeX;

    if((makeCompress == true) && (x >= shapeX && x <= shapeX + shapeS) && (y >= shapeY && y <= shapeY + shapeS)){
    // if((x >= shapeX && x <= shapeX + shapeS) && (y >= shapeY && y <= shapeY + shapeS)){ // 테스트용
        compression = true;
        makeCompress = false;
        compressionCount++;
        HeartImg.fill();
    }
}
function CompressKeyDown(event) {
    if((timeRemaining <= 0 && compressionCount < compressionNum) && Event.keyCode == 82){
        ReStart();
    }
    // MyEvent.preventDefault();
}
function Breathe() {
    playBreath = setInterval(function(){
        ctx.clearRect(0, 0, canvas_cpr.width, canvas_cpr.height);
        ctx.drawImage(BackgroundImg, 0, 0, canvas_cpr.width, canvas_cpr.height);
        ctx.drawImage(PatientImg, patient.x, patient.y, patient.width, patient.height);
        HelperBreathImg.next();
        ctx.drawImage(HelperBreathImg.image(), helper.x, helper.y, helper.width, helper.height);

        // 양옆 구름 이미지 출력
        for (var i = 0; i < breathNum; i++) {
            // 0이면 원래 위치에 출력
            if(i == 0) {
                cloud.x[i] = cloud.orgX;
                cloud.y = cloud.orgY;
            }
            // 10의 자리 수가 짝수 => 왼쪽에 출력
            else if(i != 0 && (((i / 10) % 2 == 0) && (i % 10 == 0))){
                cloud.x[i] = 20;
                cloud.y += 50;
            }
            // 10의 자리가 홀수 => 오른쪽에 출력
            else if ((i / 10) % 2 != 0 && (i % 10 == 0)){
                cloud.x[i] += 455;
            }
            ctx.drawImage(CloudImg.image(i), cloud.x[i], cloud.y, cloud.width, cloud.height);
            cloud.x[i+1] = cloud.x[i] + cloud.width;
        }
        // 사각형 그리기
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgb(217, 73, 37)";
        ctx.strokeRect(rect.x[0], rect.y, rect.width, rect.height);
        ctx.strokeStyle = "rgb(17, 135, 207)";
        ctx.strokeRect(rect.x[1], rect.y, rect.width, rect.height);
        ctx.strokeStyle = "rgb(253, 159, 40)";
        ctx.strokeRect(rect.x[2], rect.y, rect.width, rect.height);
        ctx.strokeStyle = "rgb(105, 36, 152)";
        ctx.strokeRect(rect.x[3], rect.y, rect.width, rect.height);
        // 화살표 위치
        MakeRandom();
        // 알맞게 누르면
        if(firstStart == true || left.breath == true || left.y >= rect.y + 6){
            left.y = -startLocation[0];
            left.breath = false;
            breath = false;
        }
        if(firstStart == true || up.breath == true || up.y >= rect.y + 6){
            up.y = -startLocation[1];
            up.breath = false;
            breath = false;
        }
        if(firstStart == true || right.breath == true || right.y >= rect.y + 6){
            right.y = -startLocation[2];
            right.breath = false;
            breath = false;
        }
        if(firstStart == true || down.breath == true || down.y >= rect.y + 6){
            down.y = -startLocation[3];
            down.breath = false;
            breath = false;
        }
        ctx.drawImage(left.img, left.x, left.y, left.width, left.height);
        ctx.drawImage(up.img, up.x, up.y, up.width, up.height);
        ctx.drawImage(right.img, right.x, right.y, right.width, right.height);
        ctx.drawImage(down.img, down.x, down.y, down.width, down.height);
        // 최대 속도 15
        if(speed < 15){
            speed += speedUp;
        }
        left.y += speed;
        up.y += speed;
        right.y += speed;
        down.y += speed;
        firstStart = false;

        // 성공 or 실패
        // 인공호흡 진행 후 5분이 지났는지 체크 (오류-수정중)
        currentMin = today.getMinutes();
        currentHour = today.getHours();
        if(breathCount >= breathNum) {
            ctx.fillStyle = "red";
            ctx.font = "bold 60px Arial";
            ctx.fillText("CPR 성공", (canvas_cpr.width / 2) - 120, (canvas_cpr.height / 2) + 30);
            breathSuccess = true;
            clearInterval(playBreath);
        }
        if((breathCount < breathNum) && 
        ((currentMin - startMin >= 5) || ((currentMin - startMin <= 0) && (currentHour != startHour)))){
            ctx.fillStyle = "red";
            ctx.font = "bold 60px Arial";
            ctx.fillText("CPR 실패", (canvas_cpr.width / 2) - 120, (canvas_cpr.height / 2) + 30);
            clearInterval(playBreath);
        }
    }, FPS);
}

// 시작 위치 랜덤 지정
function MakeRandom() {
    for (var i = 0; i < 4; i++) {
        var randomLocation = Math.floor(Math.random() * (180-60+1)) + 60;
        startLocation[i] = randomLocation;
    }
}
function BreatheKeyDown(event) {
    // 방향에 맞는 키를 누른 경우
    if(event.keyCode == 37 && (left.y + (left.height/accuracy) >= rect.y)){
        left.breath = true;
        breath = true;
        breathCount++;
        CloudImg.fill();
    }
    if(event.keyCode == 38 && (up.y + (up.height/accuracy) >= rect.y)){
        up.breath = true;
        breath = true;
        breathCount++;
        CloudImg.fill();
    }
    if(event.keyCode == 39 && (right.y + (right.height/accuracy) >= rect.y)){
        right.breath = true;
        breath = true;
        breathCount++;
        CloudImg.fill();
    }
    if(event.keyCode == 40 && (down.y + (down.height/accuracy) >= rect.y)){
        down.breath = true;
        breath = true;
        breathCount++;
        CloudImg.fill();
    }
    // 누른 버튼 위치 깜빡임
    if(event.keyCode == 37){
        setTimeout(function(){
            ctx.fillStyle = "rgba(217, 73, 37, 0.5)";
            ctx.fillRect(rect.x[0], rect.y, rect.width, rect.height);
        },1);
    }
    if(event.keyCode == 38){
        setTimeout(function(){
            ctx.fillStyle = "rgba(17, 135, 207, 0.5)";
            ctx.fillRect(rect.x[1], rect.y, rect.width, rect.height);
        },1);
    }
    if(event.keyCode == 39){
        setTimeout(function(){
            ctx.fillStyle = "rgba(253, 159, 40, 0.5)";
            ctx.fillRect(rect.x[2], rect.y, rect.width, rect.height);
        },1);
    }
    if(event.keyCode == 40){
        setTimeout(function(){
            ctx.fillStyle = "rgba(105, 36, 152, 0.5)";
            ctx.fillRect(rect.x[3], rect.y, rect.width, rect.height);
        },1);
    }
    // 잘못 누른 경우
    if(event.keyCode == 37 && (left.y + left.height < rect.y)){
        CloudImg.minusFill();
        breathCount--;
    }
    if(event.keyCode == 38 && (up.y + up.height < rect.y)){
        CloudImg.minusFill();
        breathCount--;
    }
    if(event.keyCode == 39 && (right.y + right.height < rect.y)){
        CloudImg.minusFill();
        breathCount--;
    }
    if(event.keyCode == 40 && (down.y + down.height < rect.y)){
        CloudImg.minusFill();
        breathCount--;
    }
    // MyEvent.preventDefault();
}
addEventListener("keydown", CompressKeyDown);
addEventListener("keydown", BreatheKeyDown);
addEventListener("click", CompressClick);

Compress();
MakeCompress();