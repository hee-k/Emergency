var ctx = myCanvas.getContext("2d");
var card_x = 0;
var card_y = 307;
var cardImg = new Image();
cardImg.src="./images/game_bee/card0.png";
var hybee_x = 230;
var hybee_y = 307;
var hybeeImg = new Image();
hybeeImg.src="./images/game_bee/honeybee.png";
var gtbee_x = 465;
var gtbee_y = 307;
var gtbeeImg = new Image();
gtbeeImg.src="./images/game_bee/giantbee.png";
var lastbee_x = 700;
var lastbee_y = 307;
var lastbeeImg = new Image();
lastbeeImg.src="./images/game_bee/lastbee.png";

var count = 0; //카운트 버튼을 누르면 카운트 올라감.
var time_remaining = 30; //제한시간 30초

function Do_a_Frame(){
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    ctx.drawImage(cardImg,card_x,card_y);
    ctx.drawImage(hybeeImg,hybee_x,hybee_y);
    ctx.drawImage(gtbeeImg,gtbee_x,gtbee_y);
    ctx.drawImage(lastbeeImg,lastbee_x,lastbee_y);

    ctx.fillStyle="red";
    ctx.font = "40px Arial";
    ctx.fillText("벌침 빼기 게임",270,40);

    ctx.fillStyle = "blue";
    ctx.font = "15px hangle";
    ctx.fillText ("카운트 버튼을 눌러 시간안에 벌침을 빼세요.", myCanvas.width / 4, myCanvas.height / 4);
    ctx.fillText ("-> 방향키로 움직이기", myCanvas.width / 4, (myCanvas.height / 4)+50);
    ctx.fillText ("1단계 50회", 230, 470);
    ctx.fillText ("2단계 100회", 465, 470);
    ctx.fillText ("3단계 150회", 700, 470);

    ctx.fillStyle="red";
    ctx.font = "25px Arial";
    ctx.fillText("count : " + count,40,40);
    ctx.fillText("남은 시간: " + Math.round(time_remaining),40,70);

    //게임 다시하기 위한 코딩
    if(time_remaining <= 0) {
        ctx.fillStyle = "red";
        ctx.font = "bold 25px Arial";
        ctx.fillText("게임 오버...", myCanvas.width / 2,myCanvas.height / 2);
        ctx.textAlign = "left";
        ctx.font = "bold 20px Arial";
        ctx.fillText("다시하기를 원하면 b버튼을 누르세요", myCanvas.width / 2, (myCanvas.height / 2) + 50);
    } else {
        time_remaining = time_remaining - 1/40;
    }
}

//다시하기 게임을 위한 곳
function restart_game() {
    time_remaining = 30;
    count = 0;
}

//이미지 충돌시
function ImagesTouching(x1,img1,x2,img2){
    if(x1>=x2+img2.width || x1+img1.width <= x2){
        return false;
    }
    return true;
}

//키 이벤트 관련

function MyKeyDownHandler (MyEvent) {
    var moving = 0;
    if(MyEvent.keyCode == 37 && card_x > 0){
        moving = - 10; //left
    }
    if(MyEvent.keyCode == 39 && card_x + cardImg.width < myCanvas.width){
        moving = + 10; //right
    }
    if(time_remaining <= 0 && MyEvent.keyCode == 66){
        restart_game();
    }
    card_x = card_x + moving;
    if(ImagesTouching(card_x,cardImg,hybee_x,hybeeImg)){
        if(count>=50){
            hybee_x=-hybeeImg.width;
        }else {
            card_x = card_x - moving;
        }
    }
    if(ImagesTouching(card_x,cardImg,gtbee_x,gtbeeImg)){
        if(count>=100){
            gtbee_x=-gtbeeImg.width;
        } else {
            card_x = card_x - moving;
        }
    }
    if(ImagesTouching(card_x,cardImg,lastbee_x,lastbeeImg)){
        if(count>=150){
            lastbee_x=-lastbeeImg.width;
        } else {
            card_x = card_x - moving;
        }
    }
}

//카운트 부분
function touch(){
    count++;
}

addEventListener("keydown",MyKeyDownHandler);
setInterval(Do_a_Frame,25);
