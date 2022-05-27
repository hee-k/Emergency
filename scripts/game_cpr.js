function Heart(path, num) {
    this.images = [];
    for (var i = 0; i < num; i++) {
        this.images[i] = new Image();
        this.images[i].src = path + "_empty.png";
    }
    this.count = 0;
    this.path = path;
}
Heart.prototype.fillHeart = function () {
    this.images[this.count].src = this.path + "_fill.png";
    this.count++;
}
Heart.prototype.emptyHeart = function (num) {
    for (var i = 0; i < num; i++) {
        this.images[i].src = this.path + "_empty.png";
    }
    this.count = 0;
}
Heart.prototype.image = function (index) {
    this.width = this.images[0].width;
    this.height = this.images[0].height;
    return this.images[index];
}
var ctx = canvas_cpr.getContext("2d");
var HelperImg = new Image();
var PatientImg = new Image();
HelperImg.src = "./images/cpr_up.png";
PatientImg.src = "./images/cpr_down.png";
var cprSuccess = 10; // cpr 성공에 필요한 횟수
var HeartImg = new Heart("./images/heart", cprSuccess);
var helper = { // cpr하는 사람
    x : 430,
    y : 180
    // width : ,
    // height : 
}
var patient = { // cpr 당하는 환자
    x : 450,
    y : 430
    // width : 500,
    // height : 300
}
var heart = {
    x : [],
    y : 0
}
var push = false;           // cpr 실행여부
var pushCount = 0;          // cpr 횟수
var pushTimer = 0;          // 일정 Frame 이후 helper up
var pushSpeed = 6;          // cpr 속도
var orgHelperY = helper.y;  // 초기 helper y위치
var timeRemaining = 10;
var FPS = 30;
var success = false;
heart.x[0] = 200;

function Do_a_CPR() {
    ctx.clearRect(0, 0, canvas_cpr.width, canvas_cpr.height);
    ctx.drawImage(PatientImg, patient.x, patient.y);
    ctx.drawImage(HelperImg, helper.x, helper.y);
    for (var i = 0; i < cprSuccess; i++) {
        ctx.drawImage(HeartImg.image(i), heart.x[i], heart.y);
        heart.x[i+1] = heart.x[i] + HeartImg.width;
        // console.log(heart.x[i]);
    }
    // CPR Count 글씨 출력
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("CPR Count : ", 15, 50);
    // 남은 시간
    ctx.fillText("Time Remaining: " + Math.round(timeRemaining), 15, 130);
    // 성공 or 실패
    if((timeRemaining <= 0 && pushCount >= cprSuccess) || pushCount >= cprSuccess) {
        ctx.fillStyle = "red";
        ctx.font = "bold 60px Arial";
        ctx.fillText("CPR 성공", (canvas_cpr.width / 2) - 120, (canvas_cpr.height / 2) + 30);
        success = true;
        clearInterval(Do_a_CPR);
    } else if(timeRemaining <= 0 && pushCount < cprSuccess){
        ctx.fillStyle = "red";
        ctx.font = "bold 60px Arial";
        ctx.fillText("CPR 실패", (canvas_cpr.width / 2) - 120, (canvas_cpr.height / 2) + 30);
        // 다시 시작하려면 R
        ctx.font = "bold 20px Arial";
        ctx.fillText("Press R to play again", (canvas_cpr.width / 2) - 85, (canvas_cpr.height / 2) + 60);
    }
    // 시간 흐름
    if(timeRemaining > 0 && success == false) {
        timeRemaining -= 1/FPS;
    }
    // cpr 실행 시(input space bar)
    if(push == true) {
        helper.y += pushSpeed;
        pushTimer++;
    }
    // 일정 Frame 이후 helper up
    if(pushTimer > 8) {
        push = false;
        helper.y -= pushSpeed;
        if(helper.y ==  orgHelperY) {
            pushTimer = 0;
        }
    }
}
// 재시작(변수 초기화)
function reStart() {
    pushCount = 0;
    orgHelperY = helper.y;
    timeRemaining = 10;
    heart.x[0] = 200;
    HeartImg.emptyHeart(cprSuccess);
}
function MyKeyDownHandler(MyEvent) {
    if(MyEvent.keyCode == 32){
        push = true;
        pushCount++;
        HeartImg.fillHeart();
    }
    if((timeRemaining <= 0 && pushCount < cprSuccess) && MyEvent.keyCode == 82){
        reStart();
    }
    // MyEvent.preventDefault();
}
addEventListener("keydown", MyKeyDownHandler);
setInterval(Do_a_CPR, 25);