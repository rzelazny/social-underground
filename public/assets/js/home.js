$(document).ready(function() {

    //get the gaming tables that already exist and display them
    $.get("api/tables", function(curTables){

        for(i=0; i < curTables.length; i++) {
            var columnCount = i;
            var card = $("<div>").addClass("card game-table");
            var cardBody = $("<div>").addClass("card-body");
            cardBody.attr("id", "resultCardBody");

            //create stats to append
            var id = $("<h4>").addClass("card-text").text("Table: " + curTables[i].id + " - " + curTables[i].game);
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
            //append stats to the card
            cardBody.append(id, user1, user2, user3, user4, user5, joinBtn);
            card.append(cardBody);

            //there are 3 columns we append in sequence, the 4th table should be in the first column again.
            while(columnCount > 2){
                columnCount -= 3;
            }

            //append card to the correct column on the homepage
            $("#current-tables" + columnCount).append(card);
        };
    });

    //function lets user join an existing table
    function joinTable() {
        let tableId = $(this).attr("table")
        window.location.assign("/casino" + tableId);
    }

    // Getting references to our form and inputs
    //var joinGame = document.getElementById("joinGame");

    // When the form is submitted, we validate there's an email and password entered
    $("#newTable").on("click", function(event) {
        console.log("Making a new gaming table ");
        //create a new gaming table
        $.post("/api/newtable").then(function(newTable){
            console.log("The table was made");
            console.log(newTable);
            window.location.assign("/casino" + tableId);
        }
        );
    })

    // $("#joinGame").on("click", function(event) {
    //     console.log("Stopppppp that tickles!! >:(");
    //     $.post("/api/newtable");
    //         console.log("The table was made");
    //         window.location.replace("/casino");
        
    // })
});
