$(document).ready(function() {

    //variables
    var hitButton = document.getElementById("hitButton");
    var stayButton = document.getElementById("stayButton");
    var newRound = document.getElementById("newRound");

    //get the current casino table
    var curTable = document.defaultView.location.pathname.split("casino").pop();

    //Elements and vars for chat log
    var chatScroll = $("#chat-log");
    var chatInput = $("#chat-input");
    let chatLength = 0;

    //webcam stuff, user is user facing camera mode, not userID
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('snapShot');
    const webcam = new Webcam(webcamElement, 'user', canvasElement);

    
    //function sets up the page, including querying the db for chat logs and our game
    function init(){
        getChatLogs();
        joinTable();
        getGame();
        chatTimer();
        console.log(user)
    }

    init();

    //populate chat log
    function getChatLogs(){
        $.get("/api/chat" + curTable, function(chatLog){
            //chat length is used to check for new messages being posted
            chatLength = chatLog.length;
            for(i=0; i < chatLength; i++) {
                var chatLine = $("<li>")
                //chatLine.attr("id", "chat-line-" + i);
                chatLine.text(chatLog[i].user + ": " + chatLog[i].message);
                $("#chat-log").append(chatLine);
            };
            //scroll to the bottom
            chatScroll.scrollTop(1000);
        });
    }
    
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

    //Function posts a message to the chat log
    function sendMessage(msg){
        let newMessage = {
            message: msg,
            table: curTable
        }
        $.post("/api/chat/", newMessage);
        location.reload();
    }

    function getGame(){
        $.get("/api/table:" + curTable, function(table){
            let tableGame = table.game;
        })
    }

    //on joining the table post a message and update the table database
    function joinTable(){
        // $.put("api/table", function(){
        
        // })
    }

    //functions with event listners 
    // hitButton.addEventListener("click", function hitButton() {
    //     console.log("Hit me baby one more time ;)");
    // });

    // stayButton.addEventListener("click", function stayButton() {
    //     console.log("Stay with me cause you're all I need");
    // });

    // newRound.addEventListener("click", function newRound() {
    //     console.log("Final round...FIGHT");
    // });

    //send chat button
    $("#send-chat").on("click", function(event) {
        event.preventDefault();
        sendMessage(chatInput.val());
    })
    //Turn on the camera
    $("#camBtnOn").on("click", function(event) {
        //prompt user to start their camera
        webcam.start();
    })

    //Turn off the camera
    $("#camBtnOff").on("click", function(event) {
        webcam.stop();
    })

    //Take photo
    $("#camBtnSnap").on("click", function(event) {
        let picture = {
            photo: webcam.snap(),
            table: curTable
        }
        console.log("Sending photo");
        $.post("/api/photo/", picture);
        document.querySelector('#snap-photo').href = picture.photo;
    })

    //Play Rock Paper Scissors
    $("#camBtnRPS").on("click", function(event) {
        let timer = 1
        let rpsTimer = setInterval(function() {
            timer--
            $("#rpsCountdown").text(timer);
            console.log(timer);
            if(timer === 0){
                clearInterval(rpsTimer);
                let sendPic = {
                    photo: webcam.snap(),
                    table: curTable
                }
                console.log("Sending photo");
                //document.querySelector('#snap-photo').href = sendPic.photo;
                $.post("/api/photo/", sendPic);

                $.get("/api/photo/1/" + curTable).then(function(data){
                    console.log("data: ", atob(data.photo));
                    console.log("photo: ", data);
                    document.querySelector('#download-photo').href = "data:image/png;base64," + atob(data.photo);
                })
            }
        }, 1000);
    })
});

