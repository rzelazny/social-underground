$(document).ready(function() {

    //variables
    var hitButton = document.getElementById("hitButton");
    var stayButton = document.getElementById("stayButton");
    var newRound = document.getElementById("newRound");

    //get the current casino table
    var curTable = document.defaultView.location.pathname.split("casino").pop();
    let email = "";
    let curSeat = "";
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
        getGame();
        chatTimer();

        //get the current user's email and which seat they're in
        $.get("/api/user_data").then(function(userData){
            email = userData.email;
            $.get("/api/table" + curTable).then(function(tableData){
                if(tableData[0].user1 === email){
                    curSeat = "user1";
                }else if(tableData[0].user2 === email){
                    curSeat = "user2";
                }else if(tableData[0].user3 === email){
                    curSeat = "user3";
                }else if(tableData[0].user4 === email){
                    curSeat = "user4";
                }else if(tableData[0].user5 === email){
                    curSeat = "user5";
                }
            })
        })
    }

    init();

    //populate chat log
    function getChatLogs(){
        $.get("/api/chat" + curTable, function(chatLog){
            //chat length is used to check for new messages being posted
            chatLength = chatLog.length;
            for(let i=0; i < chatLength; i++) {
                var chatLine = $("<li>")
                //chatLine.attr("list-style", "none");
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

    //Function finds out what game is set at the table and adjusts what containers are visible
    function getGame(){
        $.get("/api/table" + curTable).then( function(table){
            var tableGame = JSON.stringify(table[0].game).replace(/"/g, '');

            console.log("gonna try: ", tableGame.replace(/"/g, ''));
            switch(tableGame){
                case "Just Chatting":
                    console.log("Just chatting setup")
                    $("#containerBlackJack").css("display", "none");
                break;
                case "Black Jack":
                    console.log("Black Jack setup");
                    $("#gameChoice").css("display", "none");
                    $("#containerBlackJack").css("display", "block");
                    $("#start").css("display", "block");
                break;
                default:
                    console.log("default running");

            }
        })
    }
    function giveUpSeat(goTo){
        let updateSeat = {
            column: curSeat,
            data: "Open Seat"
        }
        $.post("/api/table"+ curTable, updateSeat).then(function(){
            window.location.assign(goTo);
        })
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
    //var choosenAnswer = document.querySelector('input[name="OptRadio"]:checked').getAttribute("id"); 
    
    //Choosing a game
    $("#chooseGame").on("click", function(event) {
        event.preventDefault();
        let gameChoice = "";
        let gameToggle = document.querySelector('input[name="inlineRadioOptions"]:checked').getAttribute("id"); 
        console.log($("#multi-select").val());
        if(gameToggle === "radio-multi"){
            gameChoice = $("#multi-select").val();
        }else{
            gameChoice = $("#single-select").val();
        }

        let updateGame = {
            column: "game",
            data: gameChoice
        }
        $.post("/api/table" + curTable, updateGame).then(function(){
            location.reload();
        })
    })

    //Show multiplayer game choices
    $("#radio-multi").on("click", function(event) {
        $("#single-select").css("display", "none");
        $("#multi-select").css("display", "block");
    })

    //Show single player game choices
    $("#radio-single").on("click", function(event) {
        $("#single-select").css("display", "block");
        $("#multi-select").css("display", "none");
        
    })

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

    //Navigate to home and free up user's seat at the table.
    $("#goHome").on("click", function(event) {
        giveUpSeat("/home");
    })

    $("#memberPage").on("click", function(event) {
        giveUpSeat("/members");
    })
    //Navigate to home and free up user's seat at the table.
    $("#logOut").on("click", function(event) {
        giveUpSeat("/logout");
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

