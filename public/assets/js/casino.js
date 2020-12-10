$(document).ready(function() {
    //variables
    var hitButton = document.getElementById("hitButton");
    var stayButton = document.getElementById("stayButton");
    var newRound = document.getElementById("newRound");
    var chatScroll = $("#chat-log");
    var chatInput = $("#chat-input");
    
    //get the current casino table
    var curTable = document.defaultView.location.pathname.split("casino").pop();
    let chatLength = 0;

    //populate chat log
    $.get("/api/chat" + curTable, function(chatLog){
        chatLength = chatLog.length;
        for(i=0; i < chatLength; i++) {
            var chatLine = $("<li>")

            chatLine.attr("id", "chat-line-" + i);
            chatLine.text(chatLog[i].user + ": " + chatLog[i].message);
            $("#chat-log").append(chatLine);
        };
        chatScroll.scrollTop(1000);
    });

    //Function checks the chat log db for changes every 3s and refreshes the page if someone has posted a message to the chat log
    function chatTimer() {
        
        setInterval(function() {
            $.get("/api/chat" + curTable, function(chatLog){
                if(chatLog.length > chatLength){
                    location.reload();
                    chatScroll.scrollTop(1000);
                }
            })
        }, 3000);
    }

    chatTimer();

    //submit chat button
    $("#send-chat").on("click", function(event) {
        event.preventDefault();
        let newMessage = {
            message: chatInput.val(),
            table: curTable
        }
        console.log("Sending chat");

        $.post("/api/chat/", newMessage);
        location.reload();
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

