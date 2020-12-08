$(document).ready(function() {
    //variables
    var newGame = document.getElementById("newGame");
    var joinGame = document.getElementById("joinGame");

    //functions with event listners 
    newGame.addEventListener("click", function() {
        console.log("You clicked me! That tickled...");
        //create new gaming table
        $.post("/api/newtable");
    });

    joinGame.addEventListener("click", function() {
        console.log("Stopppppp that tickles!! >:(");
    });
});