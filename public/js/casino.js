//variables
var hitButton = document.getElementById("hitButton");
var stayButton = document.getElementById("stayButton");
var newRound = document.getElementById("newRound");

//functions with event listners 
hitButton.addEventListener("click", function hitButton() {
    console.log("Hit me baby one more time ;)");
});

stayButton.addEventListener("click", function stayButton() {
    console.log("Stay with me cause you're all I need");
});

newRound.addEventListener("click", function newRound() {
    console.log("Final round...FIGHT");
});