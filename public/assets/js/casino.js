$(document).ready(function() {
    //variables
    var hitButton = document.getElementById("hitButton");
    var stayButton = document.getElementById("stayButton");
    var newRound = document.getElementById("newRound");
    //get the current casino table
    var curTable = document.defaultView.location.pathname.split("casino").pop();
    console.log(document.defaultView);
    //populate chat log
    $.get("/api/chat" + curTable, function(chatLog){

        console.log("getting chat: ");
        for(i=0; i < chatLog.length; i++) {
            var chatLine = $("<li>")

            chatLine.attr("id", "chat-line-" + i);
            chatLine.text(chatLog[i].user + ": " + chatLog[i].message);
            $("#chat-log").append(chatLine);
        };
    });

    //submit chat button
    $("#send-chat").on("click", function(event) {
        event.preventDefault();

        let newMessage = {
            message: $("#chat-input").text,
            table: curTable
        }
        console.log("Sending chat");

        $.post("/api/chat/", newMessage);
    })

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

