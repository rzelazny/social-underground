$(document).ready(function() {
    //variables
    var hitButton = document.getElementById("hitButton");
    var stayButton = document.getElementById("stayButton");
    var newRound = document.getElementById("newRound");

    //populate chat log
    $.get("api/tables", function(curTables){

        console.log(curTables);
        for(i=0; i < curTables.length; i++) {
            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            cardBody.attr("id", "resultCardBody");

            //append current stats to card
            var id = $("<h4>").addClass("card-text").text("Table: " + curTables[i].id);
            var game = $("<p>").addClass("card-text").text("Game: " + curTables[i].game);
            var user1 = $("<p>").addClass("card-text").text("Player 1: " + curTables[i].user1);
            var user2 = $("<p>").addClass("card-text").text("Player 2: " + curTables[i].user2);
            var user3 = $("<p>").addClass("card-text").text("Player 3: " + curTables[i].user3);
            var user4 = $("<p>").addClass("card-text").text("Player 4: " + curTables[i].user4);
            var user5 = $("<p>").addClass("card-text").text("Player 5: " + curTables[i].user5);
            var joinBtn = $('<button/>', {
                text: "Join Table",
                id: "btnJoin",
                table: curTables[i].id,
                click: joinTable
            })
            cardBody.append(id, game, user1, user2, user3, user4, user5, joinBtn);
            card.append(cardBody);
            $("#current-tables").append(card);
        };
    });

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

    //Navigation button: Log out
    $("#navBtnLogOut").on("click", function(event) {
        console.log("Logging out");
        $.get("/logout");
        window.location.replace("/login");
    })

    //Navigation button: Go back to homepage
    $("#navBtnHome").on("click", function(event) {
        window.location.replace("/home");
    })
});

