var slides = document.querySelector(".slides"); // .slides ul
var slide = document.querySelectorAll(".slides li"); // .slide li
var currentIdx = 0; // 현재 index (slide 위치 파악용 )
var slideCount = slide.length;
var orgslideCount = slide.length;
var slideWidth = 220;
var slideMargin = 31;
var prevBtn = document.querySelector(".prev");
var nextBtn = document.querySelector(".next");

makeClone();

// 앞, 뒤로 슬라이드 복사본 생성
function makeClone() {
    for(var i = 0; i < slideCount; i++) {
        var cloneSlide = slide[i].cloneNode(true); // 요소 복사
        cloneSlide.classList.add("clone");
        slides.appendChild(cloneSlide); // 원래 요소 뒤에 추가
    }
    for(var i = orgslideCount - 1; i >= 0; i--) {
        var cloneSlide = slide[i].cloneNode(true);
        cloneSlide.classList.add("clone");
        slides.prepend(cloneSlide); // 원래 요소 앞에 추가
    }
    updateWidth();
    setInitialPos();

    setTimeout(function(){
        slides.classList.add("animated");
    }, 100);
}
// 전체 요소 개수 구하기 (+마진)
function updateWidth() {
    var currentSlides = document.querySelectorAll(".slides li"); // 현재 슬라이드
    var newSlideCount = currentSlides.length;

    var newWidth = (slideWidth + slideMargin) * newSlideCount - slideMargin + "px"; // 새로운 ul의 너비
    slides.style.width = newWidth;
}
// 전체 슬라이드 너비 계산 (-)
function setInitialPos() {
    var initialTranslateValue = -(slideWidth + slideMargin) * orgslideCount;
    slides.style.transform = "translateX(" + initialTranslateValue + "px)";
}

function moveSlide(num){
    slides.style.left = -num * (slideWidth + slideMargin) + "px";
    currentIdx = num;
    // console.log(currentIdx, slideCount);

    if(currentIdx == orgslideCount || currentIdx == -orgslideCount) {
        // .slides.animated 에서 설정한 0.5s 이후
        setTimeout(function(){
            // left 값 변경
            slides.style.left = "0px";
            currentIdx = 0;
            // 돌아가는게 안보이도록 animated 제거
            slides.classList.remove("animated");
        }, 500);
        // animated 다시 추가
        setTimeout(function(){
            slides.classList.add("animated");
        }, 600); 
    }
}
// 이전, 다음 버튼
nextBtn.addEventListener("click", function(){
    moveSlide(currentIdx + 1);
});
prevBtn.addEventListener("click", function(){
    moveSlide(currentIdx - 1);
});

// 자동 슬라이드
var timer = undefined;
function autoSlide(){
    if(timer == undefined){
        timer = setInterval(function(){
            moveSlide(currentIdx + 1);
        }, 2000);
    }
}
autoSlide();
function stopSlide(){
    clearInterval(timer);
    // console.log(timer);
    timer = undefined;
}
// 마우스 올리면 자동슬라이드 stop
slides.addEventListener("mouseenter", function(){
    stopSlide();
});
slides.addEventListener("mouseleave", function(){
    autoSlide();
});