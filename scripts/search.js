// 검색
function search() {
    var searchText = document.getElementById("text").value;
    var link;
    var cpr = "심폐소생술",
        heimlich = "하임리히법",
        cold = "기침 코감기 목감기",
        temperature = "화상 열사병 일사병 동상",
        bruise = "타박상 찰과상 탈골",
        animal = "벌 뱀 개",
        emergency = "차량침수 절단사고",
        game_cpr = "심폐소생술게임",
        game_virus = "바이러스피하기게임",
        game_bee = "벌침빼기게임";
    if(cpr.search(searchText) != -1) {link = "cpr";}
    else if(heimlich.search(searchText) != -1) {link = "heimlich";}
    else if(cold.search(searchText) != -1) {link = "cold";}
    else if(temperature.search(searchText) != -1) {link = "temperature";}
    else if(bruise.search(searchText) != -1) {link = "bruise";}
    else if(animal.search(searchText) != -1) {link = "animal";}
    else if(emergency.search(searchText) != -1) {link = "emergency";}
    else if(game_cpr.search(searchText) != -1) {link = "game_cpr";}
    else if(game_virus.indexsearchOf(searchText) != -1) {link = "game_virus";}
    else if(game_bee.search(searchText) != -1) {link = "game_bee";}
    else {alert("검색어를 찾을 수 없습니다."); link = "index";}
    location.href = link + ".html";
}

var searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", function(){
    search();
});
searchButton.addEventListener("keydown", enter);
function enter(event) {
    if (event.keyCode == 13) {
        search();
    }
}