function DrawImg(path, len){
    this.images = [];
    for(var i = 0; i < len; i++) {
        this.images[i] = new Image();
        this.images[i].src = path + i + '.png';
    }
    this.index = 0;
    this.len = len;
}
DrawImg.prototype.draw = function () {
    this.index++;
    this.index %= this.len;
}
DrawImg.prototype.image = function () {
    this.width = this.images[0].width;
    this.height = this.images[0].height;
    return this.images[this.index];
}

var ctx = CPR_canvas.getContext("2d");
var HelperImg = new DrawImg("./images", 2);
var PatientImg = new DrawImg("./images", 2);
var helper_y = 0;
var i = 0;
var score = 0;
var time_remaining = 10;
var FPS = 30;

function Do_a_Frame() {
    HelperImg.draw();
    PatientImg.draw();
    ctx.clearRect(0, 0, CPR_canvas.width, CPR_canvas.height);
    helper_y = i;
    ctx.drawImage(HelperImg, 300, helper_y);
    ctx.drawImage(PatientImg, 300, 400);
    // 점수 출력
    ctx.fillStyle = "purple";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 0, 30);
    // 남은 시간
    ctx.fillText("Time Remaining: " + Math.round(time_remaining), 0, 45);
    if(time_remaining <= 0){
        ctx.fillStyle = "red";
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "center";
        if(score > 10) {
            ctx.fillText("CPR 성공", CPR_canvas.width / 2, CPR_canvas.height / 2);
        }else {
            ctx.fillText("CPR 실패", CPR_canvas.width / 2, CPR_canvas.height / 2);
        }
        // 다시 시작하려면 s
        ctx.font = "bold 20px Arial";
        ctx.fillText("Press S to play again", CPR_canvas.width / 2, (CPR_canvas.height / 2) + 50);
        ctx.textAlign = "left";
    }else {
        time_remaining -= 1/FPS;
    }
}
function MyKeyDownHandler(MyEvent) {
    if(MyEvent.keyCode == 32){
        score++;
        i += 40;
    }
    MyEvent.preventDefault();
}
addEventListener("keydown", MyKeyDownHandler);
setInterval(Do_a_Frame, 1000/FPS);