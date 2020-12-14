$(document).ready(function() {

    function init(){
        cleanupTables()
    }

    init();

    //function clears out any tables with no users or that haven't been updated recently
    function cleanupTables(){
        $.post("api/cleanup", function(){
            console.log("table cleanup complete");
            getTables();
        })
    }

    //get the gaming tables that already exist and display them
    function getTables(){
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
    }

    //function lets user join an existing table
    function joinTable() {
        let tableId = $(this).attr("table")
        let newMessage = {};
        let openSeat = ""
        $.get("/api/table" + tableId).then( function(tableData){
            //make sure there's room at the table
            if(tableData[0].user1 === "Open Seat"){
                openSeat = "user1";
            }else if(tableData[0].user2 === "Open Seat"){
                openSeat = "user2";
            }else if(tableData[0].user3 === "Open Seat"){
                openSeat = "user3";
            }else if(tableData[0].user4 === "Open Seat"){
                openSeat = "user4";
            }else if(tableData[0].user5 === "Open Seat"){
                openSeat = "user5";
            }else{
                //if the table is full refresh the page, it shouldn't show up as available anymore
                location.reload();
                return
            }
            $.get("/api/user_data", function(userData){
                let tableUpdate = {
                    column: openSeat,
                    data: userData.email
                }
                //update the table with the new user
                $.post("/api/table"+ tableId, tableUpdate).then(function(){
                    //post message that player has joined the table
                    newMessage = {
                        message: " has entered chat.",
                        table: tableId
                    }
                    //post the joining chat message
                    $.post("/api/chat/", newMessage, function(){
                        //join the table
                        window.location.assign("/casino" + tableId);
                    });
                })
            })
        })
    }

    // Create a new gaming table on click
    $("#newTableSpan").on("click", function(event) {
        console.log("Making a new gaming table ");
        //create a new gaming table
        $.post("/api/newtable").then(function(newTable){
            //post the joining chat message
            newMessage = {
                message: " has entered chat.",
                table: newTable.id
            }
            $.post("/api/chat/", newMessage, function(){
                //join the table
                window.location.assign("/casino" + newTable.id);
            });
        });
    })

    // $("#joinGame").on("click", function(event) {
    //     console.log("Stopppppp that tickles!! >:(");
    //     $.post("/api/newtable");
    //         console.log("The table was made");
    //         window.location.replace("/casino");
        
    // })
});
