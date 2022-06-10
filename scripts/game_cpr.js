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
var canvas_img = document.getElementById("canvas_img");
var ctx = canvas_cpr.getContext("2d");
var ctx_img = canvas_img.getContext("2d");

var startImg = "./images/game_cpr/start.png";
var ruleImg = "./images/game_cpr/rule.png";
var middleImg = "./images/game_cpr/middle.png";
var endImg = "./images/game_cpr/end.png";
var replayBreathImg = "./images/game_cpr/replayBreath.png";
var replayCompressionImg = "./images/game_cpr/replayCompression.png";

// 이미지 화면 확인
var ruleImgOpen = false;
var startImgOpen = true;
var replayCompressionImgOpen = false;
var replayBreathImgOpen = false;

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
    height : 55,
    orgX : 0
}
heart.x[0] = 40;
heart.orgX = heart.x[0];
var cloud = { // 구름 위치, 크기
    x : [],
    y : 35,
    width : 35,
    height : 35,
    orgX : 0,
    orgY : 0
}
cloud.x[0] = 38;
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
var time = { // 시간 위치
    x : 45,
    y : 130
}

var BackgroundImg = new Image();
BackgroundImg.src ="./images/game_cpr/background.png";
var PatientImg = new Image();
PatientImg.src = "./images/game_cpr/patient.png";
var TextImg = new Image();
TextImg.src = "./images/game_cpr/text.png";
var timeRemaining = 30;         // 남은 시간
var orgTimeRemaining = timeRemaining;
var FPS = 50;

// 흉부압박에 필요한 변수
var HelperChestImg = new Helper("./images/game_cpr/compression", helper.imgCount);
var compressionNum = 16;        // 흉부압박 성공에 필요한 횟수
var HeartImg = new Check("./images/game_cpr/heart", compressionNum);
var compression = false;        // 흉부압박 실행여부
var compressionCount = 0;       // 흉부압박 횟수
var compressionSuccess = false; // 흉부압박 최종 성공여부
var makeCompression = false;    // 흉부압박 시키기
var playCompression,
    startMakeCompression,
    stopMakeCompression,
    playBreath;

// 인공호흡에 필요한 변수
var HelperBreathImg = new Helper("./images/game_cpr/breath", 12);
var breathNum = 20;             // 인공호흡 성공에 필요한 횟수
var CloudImg = new Check("./images/game_cpr/cloud", breathNum);
var breathCount = 0;            // 인공호흡 횟수
var breath = false;             // 인공호흡 실행여부
var breathSuccess = false;      // 인공호흡 최종 성공여부
var ArrowImg = [];              // 화살표 이미지
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
    catch : false
}
var up = {
    x : arrow.x+9 + rect.width*1,
    y : arrow.y,
    width : arrow.width,
    height : arrow.height,
    img : ArrowImg[1],
    catch : false
}
var right = {
    x : arrow.x+13 + rect.width*2,
    y : arrow.y,
    width : arrow.width,
    height : arrow.height,
    img : ArrowImg[2],
    catch : false
}
var down = {
    x : arrow.x+17 + rect.width*3,
    y : arrow.y,
    width : arrow.width,
    height : arrow.height,
    img : ArrowImg[3],
    catch : false
}
var speed = 3;              // 화살표 하강 속도
var orgSpeed = speed;
var speedUp = 0.05;         // 화살표 하강 속도 증가
var startLocation = [];     // 화살표 시작 위치(랜덤)
var firstStart = true;      // 처음 시작하는지 확인
var accuracy = 2;           // 화살표 체크 정확도(/)

// 흉부압박
function Compress() {
    playCompression = setInterval(function () {
        ctx.clearRect(0, 0, canvas_cpr.width, canvas_cpr.height);
        ctx.beginPath();
        ctx.drawImage(BackgroundImg, 0, 0, canvas_cpr.width, canvas_cpr.height);
        ctx.drawImage(PatientImg, patient.x, patient.y, patient.width, patient.height);
        HelperChestImg.next();
        ctx.drawImage(HelperChestImg.image(), helper.x, helper.y, helper.width, helper.height);
        if(makeCompression == true){
            ctx.drawImage(TextImg, text.x, text.y, text.width, text.height);
            ctx.fillStyle = "rgba(255, 212, 0, 0.8)";
            ctx.arc(arc.x, arc.y, arc.r, 0, Math.PI * 2);
            ctx.fill();
            compression = false;
        }

        // 상단 하트 이미지 출력
        for (var i = 0; i < compressionNum; i++) {
            ctx.drawImage(HeartImg.image(i), heart.x[i], heart.y, heart.width, heart.height);
            heart.x[i+1] = heart.x[i] + HeartImg.width;
        }
        // 남은 시간
        if(Math.round(timeRemaining) <= 5){
            ctx.fillStyle = "red";
            ctx.font = "bold 30px Arial";
            ctx.fillText("TIME : " + Math.round(timeRemaining), time.x, time.y);
        }else if(Math.round(timeRemaining) <= 10 && Math.round(timeRemaining) >= 6){
            ctx.fillStyle = "purple";
            ctx.font = "bold 30px Arial";
            ctx.fillText("TIME : " + Math.round(timeRemaining), time.x, time.y);
        }else{
            ctx.fillStyle = "black";
            ctx.font = "bold 30px Arial";
            ctx.fillText("TIME : " + Math.round(timeRemaining), time.x, time.y);
        }
        // 성공 or 실패
        if(timeRemaining >= 0 && compressionCount >= compressionNum) {
            clearInterval(playCompression);
            clearInterval(startMakeCompression);
            clearInterval(stopMakeCompression);
            compressionSuccess = true;
            // 인공호흡으로 넘어가는 이미지
            PrintImg(ctx_img, middleImg, 0, 0, canvas_img.width, canvas_img.height);
            canvas_img.style.display = "block";
            canvas_cpr.style.display = "none";
            setTimeout(function() {
                canvas_cpr.style.display = "block";
                canvas_img.style.display = "none";
                timeRemaining = orgTimeRemaining;
                Breathe();
            }, 5000);
            // Breathe();
        } else if(timeRemaining <= 0 && compressionCount < compressionNum){
            clearInterval(playCompression);
            clearInterval(startMakeCompression);
            clearInterval(stopMakeCompression);
            replayCompressionImgOpen = true;
            PrintImg(ctx_img, replayCompressionImg, 0, 0, canvas_img.width, canvas_img.height);
            canvas_img.style.display = "block";
            canvas_cpr.style.display = "none";
        }
        // 시간 흐름
        if(timeRemaining > 0 && compressionSuccess == false) {
            timeRemaining -= 1/30;
        }
    }, FPS);
}
// "Compression" 나타나기
function MakeCompression(){
    startMakeCompression = setInterval(function(){
        makeCompression = true;
    }, (Math.floor(Math.random() * (2000-1000+1)) + 1000));
    stopMakeCompression = setInterval(function(){
        makeCompression = false;
    }, (Math.floor(Math.random() * (1300-1000+1)) + 1000));
}
// 재시작(변수 초기화)
function Replay() {
    timeRemaining = orgTimeRemaining;
    if(replayCompressionImgOpen == true) {
        compressionCount = 0;
        heart.x[0] = heart.orgX;
        HeartImg.empty(compressionNum);
    }
    if(replayBreathImgOpen == true) {
        breathCount = 0;
        speed = orgSpeed;
        firstStart = true;
        cloud.x[0] = cloud.orgX;
        CloudImg.empty(breathNum);
    }
}
// 흉부압박 시 클릭 이벤트
canvas_cpr.onselectstart = function () {
    return false;
}
canvas_cpr.addEventListener("click", function(event){
    // 마우스 좌표
    var x = event.clientX - canvas_cpr.offsetLeft;
    var y = event.clientY - canvas_cpr.offsetTop;

    // 도형의 좌표(arc)
    var shapeX = arc.x - arc.r;
    var shapeY = arc.y - arc.r;
    var shapeS = arc.x + arc.r - shapeX;

    if((makeCompression == true) && (x >= shapeX && x <= shapeX + shapeS) && (y >= shapeY && y <= shapeY + shapeS)){
    // if((x >= shapeX && x <= shapeX + shapeS) && (y >= shapeY && y <= shapeY + shapeS)){ // 테스트용
        compression = true;
        makeCompression = false;
        compressionCount++;
        HeartImg.fill();
    }
    // event.preventDefault();
});

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
                cloud.x[i] = cloud.orgX;
                cloud.y += 50;
            }
            // 10의 자리가 홀수 => 오른쪽에 출력
            else if ((i / 10) % 2 != 0 && (i % 10 == 0)){
                cloud.x[i] += 417;
            }
            ctx.drawImage(CloudImg.image(i), cloud.x[i], cloud.y, cloud.width, cloud.height);
            cloud.x[i+1] = cloud.x[i] + cloud.width;
        }
        if(Math.round(timeRemaining) <= 5){
            ctx.fillStyle = "red";
            ctx.font = "bold 30px Arial";
            ctx.fillText("TIME : " + Math.round(timeRemaining), time.x, time.y);
        }else if(Math.round(timeRemaining) <= 10 && Math.round(timeRemaining) >= 6){
            ctx.fillStyle = "purple";
            ctx.font = "bold 30px Arial";
            ctx.fillText("TIME : " + Math.round(timeRemaining), time.x, time.y);
        }else{
            ctx.fillStyle = "black";
            ctx.font = "bold 30px Arial";
            ctx.fillText("TIME : " + Math.round(timeRemaining), time.x, time.y);
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
        // 박스에 들어오면 화살표 y위치 변경
        if(firstStart == true || left.catch == true || left.y >= rect.y + 6){
            left.y = -startLocation[0];
            left.catch = false;
            breath = false;
        }
        if(firstStart == true || up.catch == true || up.y >= rect.y + 6){
            up.y = -startLocation[1];
            up.catch = false;
            breath = false;
        }
        if(firstStart == true || right.catch == true || right.y >= rect.y + 6){
            right.y = -startLocation[2];
            right.catch = false;
            breath = false;
        }
        if(firstStart == true || down.catch == true || down.y >= rect.y + 6){
            down.y = -startLocation[3];
            down.catch = false;
            breath = false;
        }
        ctx.drawImage(left.img, left.x, left.y, left.width, left.height);
        ctx.drawImage(up.img, up.x, up.y, up.width, up.height);
        ctx.drawImage(right.img, right.x, right.y, right.width, right.height);
        ctx.drawImage(down.img, down.x, down.y, down.width, down.height);
        // 최대 속도 16
        if(speed < 16){
            speed += speedUp;
        }
        left.y += speed;
        up.y += speed;
        right.y += speed;
        down.y += speed;
        firstStart = false;

        // 성공 or 실패
        if(timeRemaining >= 0 && breathCount >= breathNum) {
            clearInterval(playBreath);
            breathSuccess = true;
            PrintImg(ctx_img, endImg, 0, 0, canvas_img.width, canvas_img.height);
            canvas_img.style.display = "block";
            canvas_cpr.style.display = "none";
        } else if(timeRemaining <= 0 && breathCount < breathNum){
            clearInterval(playBreath);
            replayBreathImgOpen = true;
            breathSuccess = false;
            PrintImg(ctx_img, replayBreathImg, 0, 0, canvas_img.width, canvas_img.height);
            canvas_img.style.display = "block";
            canvas_cpr.style.display = "none";
        }
        // 시간 흐름
        if(timeRemaining > 0 && breathSuccess == false) {
            timeRemaining -= 1/30;
        }
    }, FPS);
}

// 화살표 시작 위치 랜덤 지정
function MakeRandom() {
    for (var i = 0; i < 4; i++) {
        var randomLocation = Math.floor(Math.random() * (420-60+1)) + 60;
        startLocation[i] = randomLocation;
    }
}
function BreatheKeyDown(event) {
    // 방향에 맞는 키를 누른 경우
    if(event.keyCode == 37 && (left.y + (left.height/accuracy) >= rect.y)){
        left.catch = true;
        breath = true;
        breathCount++;
        CloudImg.fill();
    }
    if(event.keyCode == 38 && (up.y + (up.height/accuracy) >= rect.y)){
        up.catch = true;
        breath = true;
        breathCount++;
        CloudImg.fill();
    }
    if(event.keyCode == 39 && (right.y + (right.height/accuracy) >= rect.y)){
        right.catch = true;
        breath = true;
        breathCount++;
        CloudImg.fill();
    }
    if(event.keyCode == 40 && (down.y + (down.height/accuracy) >= rect.y)){
        down.catch = true;
        breath = true;
        breathCount++;
        CloudImg.fill();
    }
    // 박스 누르면 깜빡임
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
        Miss();
    }
    if(event.keyCode == 38 && (up.y + up.height < rect.y)){
        Miss();
    }
    if(event.keyCode == 39 && (right.y + right.height < rect.y)){
        Miss();
    }
    if(event.keyCode == 40 && (down.y + down.height < rect.y)){
        Miss();
    }
    // event.preventDefault();
}
// 인공호흡에서 방향키 잘못 눌렀을 때 (count--)
function Miss() {
    CloudImg.minusFill();
    breathCount--;
    if(breathCount < 0){
        breathCount = 0;
    }
}
// 이미지 출력
function PrintImg(ctx_img, image, x, y, w, h) {
    var img = new Image;
    img.src = image;
    img.onload = function() {
        ctx_img.clearRect(0, 0, canvas_img.width, canvas_img.height);
        ctx_img.drawImage(img, x, y, w, h);
        // ctx_img.strokeStyle = "rgb(105, 36, 152)";
        // ctx_img.strokeRect(1136, 12, 48, 48);
    };
}

// 버튼 클릭 이벤트 (초기 화면)
canvas_img.onselectstart = function () {
    return false;
};
canvas_img.addEventListener("click", function(event){
    var x = event.clientX - canvas_img.offsetLeft;
    var y = event.clientY - canvas_img.offsetTop;
    var btn = {
        ruleX : 85,
        startX : 801,
        y : 367,
        w : 314,
        h : 103,
    }
    var close = {
        x : 1136,
        y : 12,
        w : 48,
        h : 48
    }
    // rule 버튼 클릭 시
    if(startImgOpen == true && ((x > btn.ruleX && x < btn.ruleX+btn.w) && (y > btn.y && y < btn.y+btn.h))){
        ruleImgOpen = true;
        startImgOpen = false;
        PrintImg(ctx_img, ruleImg, 0, 0, canvas_img.width, canvas_img.height);
    }
    // rule의 닫기 버튼 클릭 시
    if(ruleImgOpen == true && ((x > close.x && x < close.x+close.w) && (y > close.y && y < close.y+close.h))){
        ruleImgOpen = false;
        startImgOpen = true;
        PrintImg(ctx_img, startImg, 0, 0, canvas_img.width, canvas_img.height);
    }
    // start 버튼 클릭 시
    if(startImgOpen == true && ((x > btn.startX && x < btn.startX+btn.w) && (y > btn.y && y < btn.y+btn.h))){
        startImgOpen = false;
        canvas_cpr.style.display = "block";
        canvas_img.style.display = "none";
        Compress();
        MakeCompression();
    }
    // 흉부압박 replay 버튼 클릭 시
    if(replayCompressionImgOpen == true && ((x > btn.startX && x < btn.startX+btn.w) && (y > btn.y && y < btn.y+btn.h))){
        Replay();
        replayCompressionImgOpen = false;
        canvas_cpr.style.display = "block";
        canvas_img.style.display = "none";
        Compress();
        MakeCompression();
    }
    // 인공호흡 replay 버튼 클릭 시
    if(replayBreathImgOpen == true && ((x > btn.startX && x < btn.startX+btn.w) && (y > btn.y && y < btn.y+btn.h))){
        Replay();
        replayBreathImgOpen = false;
        canvas_cpr.style.display = "block";
        canvas_img.style.display = "none";
        Breathe();
    }
    // 중간에 home 버튼 클릭 시 => 초기 화면으로 (+변수 초기화)
    if((replayCompressionImgOpen == true || replayBreathImgOpen == true) && 
    ((x > btn.ruleX && x < btn.ruleX+btn.w) && (y > btn.y && y < btn.y+btn.h))){
        replayCompressionImgOpen = true;
        replayBreathImgOpen = true;
        Replay();
        ruleImgOpen = false;
        startImgOpen = true;
        replayCompressionImgOpen = false;
        replayBreathImgOpen = false;
        compressionSuccess = false;
        breathSuccess = false;
        PrintImg(ctx_img, startImg, 0, 0, canvas_img.width, canvas_img.height);
    }
});

// 버튼 객체 생성
const leftButton = new Path2D();
const rightButton = new Path2D();
const closeButton = new Path2D();
leftButton.roundedRect = function(obj, x, y, width, height, radius) {
    obj.moveTo(x, y + radius);
    obj.lineTo(x, y + height - radius);
    obj.arcTo(x, y + height, x + radius, y + height, radius);
    obj.lineTo(x + width - radius, y + height);
    obj.arcTo(x + width, y + height, x + width, y + height-radius, radius);
    obj.lineTo(x + width, y + radius);
    obj.arcTo(x + width, y, x + width - radius, y, radius);
    obj.lineTo(x + radius, y);
    obj.arcTo(x, y, x, y + radius, radius);
}
rightButton.roundedRect = function(obj, x, y, width, height, radius) {
    obj.moveTo(x, y + radius);
    obj.lineTo(x, y + height - radius);
    obj.arcTo(x, y + height, x + radius, y + height, radius);
    obj.lineTo(x + width - radius, y + height);
    obj.arcTo(x + width, y + height, x + width, y + height-radius, radius);
    obj.lineTo(x + width, y + radius);
    obj.arcTo(x + width, y, x + width - radius, y, radius);
    obj.lineTo(x + radius, y);
    obj.arcTo(x, y, x, y + radius, radius);
}
leftButton.roundedRect(leftButton, 89, 369, 307, 99, 35);
rightButton.roundedRect(rightButton, 804, 369, 307, 99, 35);
closeButton.arc(1161, 36, 21.7, 0, Math.PI * 2);
ctx_img.beginPath();
ctx_img.lineWidth = 7;
ctx_img.strokeStyle = "rgb(217, 73, 37)";
ctx_img.stroke(leftButton);
ctx_img.strokeStyle = "rgb(86, 138, 53)";
ctx_img.stroke(rightButton);

// 버튼 hover
canvas_img.addEventListener("mousemove", function(event) {
    // leftButton
    if (startImgOpen || replayCompressionImgOpen || replayBreathImgOpen) {
        if(ctx_img.isPointInPath(leftButton, event.offsetX, event.offsetY)){
            ctx_img.strokeStyle = "orange";
        } else {
            ctx_img.strokeStyle = "rgb(217, 73, 37)";
        }
        ctx_img.lineWidth = 7;
        ctx_img.stroke(leftButton);
    }
    //rightButton
    if (startImgOpen || replayCompressionImgOpen || replayBreathImgOpen) {
        if(ctx_img.isPointInPath(rightButton, event.offsetX, event.offsetY)){
            ctx_img.strokeStyle = "orange";
        } else {
            ctx_img.strokeStyle = "rgb(86, 138, 53)";
        }
        ctx_img.lineWidth = 7;
        ctx_img.stroke(rightButton);
    }
    // closeButton
    if (ruleImgOpen) {
        if(ctx_img.isPointInPath(closeButton, event.offsetX, event.offsetY)){
            ctx_img.strokeStyle = "gray";
        } else {
            ctx_img.strokeStyle = "rgb(89, 89, 89)";
        }
        ctx_img.lineWidth = 5;
        ctx_img.stroke(closeButton);
    }
});

PrintImg(ctx_img, startImg, 0, 0, canvas_img.width, canvas_img.height);
addEventListener("keydown", BreatheKeyDown);