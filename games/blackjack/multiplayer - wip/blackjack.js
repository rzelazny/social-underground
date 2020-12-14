// THIS GAME IS CURRENTLY CODED FOR TWO PLAYER VS THE HOUSE //

// alert("directions for creative team: This is how the house logic currently works: If the user hits the House will stand if it has 17 or more points or if it has higher points than the player, otherwise the House will also hit. When the player stands the House will stand as well if it has more than 17 points or if it has higher points than the player, otherwise the House will hit until it either is above 17 points, higher than the player, or busts. Once we are creating the actual page the houses cards should have the first card up the other face down (hit cards should also be face down) and hand points should be hidden from the player until the end of the round function has ran. I am just leaving them up for building purposes.")

// alert("directions for user: Try to get as close to 21 without busting. If you want another card press 'hit' and you will be dealt another card. If you want to stay with your hand and end the game press 'stand'. You can hit as many times as you want but beware, if you bust you automatically lose. To keep playing press 'play another round'. Each round you play, your score will be displayed and will increment as you win. If you tie with the House you will be awarded 1 point each. If you win you will be awarded 2 points and if the House wins it will be awarded two points.")
///////////////////////////////////////////////
//                Variables                  //
///////////////////////////////////////////////
var gameContainer = document.querySelector('#gameContainer');

var startBtn = document.querySelector('#start');
// var goBackBtn = document.querySelector('#goBack');

//making global variables to be used throughout several functions//
let hand = [];
var divPlayer = null;
var divHand = null;
var divPoints = null;
var divScore = null;

var amount = 0;
// hard coded for now but will use players from db
let playerArray = [{ Name: "House", ID: 0, Score: 0, Points: 0, Hand: hand[0], Stand: 'false' }];

///////////////////////////////////////////////
//                Functions                  //
///////////////////////////////////////////////

startBtn.addEventListener('click', onStart);

// this function will be called when the start btn is pressed //
function onStart() {
    // the start button is hidden //
    if (startBtn.style.display === 'block') {
        startBtn.style.display = 'none'
    }
    // will add the players hard coded in the allPlayers function to the session //
    addPlayers();
    // will draw cards for all players using the drawCards function then dynamically create html elements//
    drawCards();
}

// CONNECT DB HERE TO ADD PLAYERS BASED ON PEOPLE AT TABLE -- up to 7 //
function addPlayers() {
    amount = prompt("How many players would you like to add?");
    // makes sure the user enters correct amount of players //
    for (amount === false; amount < 2 || amount > 7;) {
        alert("Amount of players needs to be between 2 and 7.");
        amount = prompt("How many players would you like to add?");
    }

    console.log(playerArray);

    for (var i = 1; i <= amount; i++) {
        var player = { Name: 'Player' + i, ID: i, Score: 0, Points: 0, Bust: false, Hand: hand, Stand: 'false' };
        playerArray.push(player)
    }
    console.log(playerArray);
}

// setting i to 0 so that we can control the synchronicity //
let i = 0;
function drawCards() {
    // this api link will draw 2 random cards //
    var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=2"
    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function (data) {
        // we will save the data in an array. each object will hold the cards code, suit, value, and image //
        playerHand = [
            {
                code: data.cards[0].code,
                suit: data.cards[0].suit,
                value: data.cards[0].value,
                imgUrl: data.cards[0].image
            }, {
                code: data.cards[1].code,
                suit: data.cards[1].suit,
                value: data.cards[1].value,
                imgUrl: data.cards[1].image
            }
        ];
        // this will give the drawn set of cards to whichever player is 'i' //
        playerArray[i].Hand = playerHand
        // this will increment i so that it will keep running the draw cards function for each player //
        i++
        if (i < playerArray.length) {
            drawCards()
        }
        // if there isnt any more players it will stop drawing cards and run the following functions //
        else {
            totalPoints();
            setTimeout(function () {
                createElements();
            }, 500);
        }
    })
}

// this function is called after the cards are originally drawn //
function totalPoints() {
    // handVal is set to 0 //
    var handVal = 0;
    for (var i = 0; i < playerArray.length; i++) {
        // resets players points //
        playerArray[i].Points = 0;
        for (var j = 0; j < (playerArray[i].Hand).length; j++) {
            // sets values for face cards //
            if (playerArray[i].Hand[j].value === "JACK" || playerArray[i].Hand[j].value === "QUEEN" || playerArray[i].Hand[j].value === "KING") {
                playerArray[i].Hand[j].value = "10";
            }
            // sets value for ace depending on current point value
            if (playerArray[i].Hand[0].value === "ACE") {
                playerArray[i].Hand[0].value = "11";
            } else if (playerArray[i].Hand[1].value === "ACE" && playerArray[i].Hand[0].value < 11) {
                playerArray[i].Hand[1].value = "11";
            } else if (playerArray[i].Hand[1].value === "ACE" && playerArray[i].Hand[0].value > 10) {
                playerArray[i].Hand[1].value = "1";
            }

            // adds all cards in hand to create new value //
            handVal += parseInt(playerArray[i].Hand[j].value);
        }
        // sets the points equal to the new value //
        playerArray[i].Points = handVal;
        // resets back to zero //
        handVal = 0;
    }
}

// this function dynamically creates elements to display the game to the user  //
function createElements() {
    // create house and players sections to add to the game container //
    houseRow = document.createElement('div');
    houseRow.className = ('row');
    houseRow.setAttribute('style', 'margin:20px; display:block;')
    playersRow = document.createElement('div');
    playersRow.className = ('row');
    playersRow.setAttribute('style', 'margin:20px; display:block;')
    gameContainer.appendChild(houseRow);
    gameContainer.appendChild(playersRow);

    // this clears the rows // -- may not be needed //
    houseRow.innerHTML = '';
    playersRow.innerHTML = '';

    // create house row elements //
    divHouse = document.createElement('section');
    divHouse.id = ('house');
    divHouse.innerHTML = (playerArray[0].Name);
    divHouse.setAttribute('style', 'text-align:center;')
    houseRow.appendChild(divHouse);

    // creates div where the houses session score will be held and displayed //
    houseScore = document.createElement('div');
    houseScore.id = ('houseScore');
    houseScore.innerHTML = `Score: ${playerArray[0].Score} `;
    divHouse.appendChild(houseScore);

    //creates div where cards will be appended //
    houseHand = document.createElement("div");
    houseHand.id = ('houseHand');
    divHouse.appendChild(houseHand);

    // creates element to display card one image //
    var cardOneImg = document.createElement('img');
    cardOneImg.id = ('cardOneHouse')
    cardOneImg.src = (playerArray[0].Hand[0].imgUrl)
    houseHand.appendChild(cardOneImg);

    // creates element to display card two image //
    var cardTwoImg = document.createElement('img');
    cardTwoImg.id = ('cardTwoHouse')
    cardTwoImg.src = (playerArray[0].Hand[1].imgUrl)
    houseHand.appendChild(cardTwoImg);

    // creates div where the point value of the hand will be held and displayed  //
    housePoints = document.createElement('div');
    housePoints.id = ('housePoints');
    housePoints.innerHTML = `Points: ${playerArray[0].Points} `;
    divHouse.appendChild(housePoints);

    // make loop to create same elements for each player //
    for (var i = 1; i < playerArray.length; i++) {
        // create cols for each player to store their elements and append to players row //
        var playersCol = document.createElement('div');
        playersCol.className = ('col-md-6');
        playersCol.id = (playerArray[i].Name);
        playersCol.setAttribute("style", "margin:20px; display:block; float:left;")
        playersRow.appendChild(playersCol);

        // create game option buttons for each player //
        var playersBtns = document.createElement('div');
        playersBtns.className = ('playersGameOptions');
        playersBtns.id = ('buttons' + playerArray[i].Name);
        playersCol.appendChild(playersBtns);

        var hitBtn = document.createElement('input');
        hitBtn.className = ('btn');
        hitBtn.id = ('hit' + playerArray[i].Name);
        hitBtn.setAttribute("type", "button");
        hitBtn.setAttribute("value", "hit me");
        hitBtn.setAttribute("style", "display:block");

        var standBtn = document.createElement('input');
        standBtn.className = ('btn');
        standBtn.id = ('stand' + playerArray[i].Name);
        standBtn.setAttribute("type", "button");
        standBtn.setAttribute("value", "stand");
        standBtn.setAttribute("style", "display:block;");

        var restartBtn = document.createElement('input');
        restartBtn.className = ('btn');
        restartBtn.id = ('restart' + playerArray[i].Name);
        restartBtn.setAttribute("type", "button");
        restartBtn.setAttribute("value", "restart");
        restartBtn.setAttribute("style", "display:block;");

        // append buttons to playersBtns div //
        playersBtns.appendChild(hitBtn);
        playersBtns.appendChild(standBtn);
        playersBtns.appendChild(restartBtn);

        // creates div to hold data and display name //
        divPlayer = document.createElement('div');
        divPlayer.className = ('player');
        divPlayer.id = playerArray[i].Name;
        divPlayer.innerHTML = (playerArray[i].Name);
        divPlayer.setAttribute('style', 'text-align:center;')
        // append player to col //
        playersCol.appendChild(divPlayer);

        // creates div where the users session score will be held and displayed //
        divScore = document.createElement('div');
        divScore.className = ('score');
        divScore.id = ('score' + playerArray[i].Name);
        divScore.innerHTML = `Score: ${playerArray[i].Score} `;
        // append score to col //
        divPlayer.appendChild(divScore);

        //creates div where cards will be appended //
        divHand = document.createElement("div");
        divHand.id = ("hand" + playerArray[i].Name);

        // creates element to display card one image //
        var cardOneImg = document.createElement('img');
        cardOneImg.id = ('cardOne' + playerArray[i].Name)
        cardOneImg.src = (playerArray[i].Hand[0].imgUrl)

        // creates element to display card two image //
        var cardTwoImg = document.createElement('img');
        cardTwoImg.id = ('cardTwo' + playerArray[i].Name)
        cardTwoImg.src = (playerArray[i].Hand[1].imgUrl)

        divPlayer.appendChild(divHand);
        // appends cards to hand div //
        divHand.appendChild(cardOneImg);
        divHand.appendChild(cardTwoImg);

        // creates div where the point value of the hand will be held and displayed  //
        divPoints = document.createElement('div');
        divPoints.className = ('points');
        divPoints.id = ('points' + playerArray[i].Name);
        divPoints.innerHTML = `Points: ${playerArray[i].Points} `;
        // appends points to player //
        divPlayer.appendChild(divPoints);
    }

    // variables created in function for up to 7 players//
    var restartBtnP1 = document.querySelector('#restartPlayer1');
    var hitBtnP1 = document.querySelector('#hitPlayer1');
    var standBtnP1 = document.querySelector('#standPlayer1');

    var restartBtnP2 = document.querySelector('#restartPlayer2');
    var hitBtnP2 = document.querySelector('#hitPlayer2');
    var standBtnP2 = document.querySelector('#standPlayer2');

    var restartBtnP3 = document.querySelector('#restartPlayer3');
    var hitBtnP3 = document.querySelector('#hitPlayer3');
    var standBtnP3 = document.querySelector('#standPlayer3');

    var restartBtnP4 = document.querySelector('#restartPlayer4');
    var hitBtnP4 = document.querySelector('#hitPlayer4');
    var standBtnP4 = document.querySelector('#standPlayer4');

    var restartBtnP5 = document.querySelector('#restartPlayer5');
    var hitBtnP5 = document.querySelector('#hitPlayer5');
    var standBtnP5 = document.querySelector('#standPlayer5');

    var restartBtnP6 = document.querySelector('#restartPlayer6');
    var hitBtnP6 = document.querySelector('#hitPlayer6');
    var standBtnP6 = document.querySelector('#standPlayer6');

    var restartBtnP7 = document.querySelector('#restartPlayer7');
    var hitBtnP7 = document.querySelector('#hitPlayer7');
    var standBtnP7 = document.querySelector('#standPlayer7');

    // event listeners //

    if (playerArray.length === 3) {
        restartBtnP1.addEventListener('click', onRestartP1);
        restartBtnP2.addEventListener('click', onRestartP2);

        hitBtnP1.addEventListener('click', onHitPlayer1);
        hitBtnP2.addEventListener('click', onHitPlayer2);

        standBtnP1.addEventListener('click', onStandPlayer1);
        standBtnP2.addEventListener('click', onStandPlayer2);
    }
    else if (playerArray.length === 4) {
        restartBtnP1.addEventListener('click', onRestartP1);
        restartBtnP2.addEventListener('click', onRestartP2);
        restartBtnP3.addEventListener('click', onRestartP3);

        hitBtnP1.addEventListener('click', onHitPlayer1);
        hitBtnP2.addEventListener('click', onHitPlayer2);
        hitBtnP3.addEventListener('click', onHitPlayer3);

        standBtnP1.addEventListener('click', onStandPlayer1);
        standBtnP2.addEventListener('click', onStandPlayer2);
        standBtnP3.addEventListener('click', onStandPlayer3);
    }
    else if (playerArray.length === 5) {
        restartBtnP1.addEventListener('click', onRestartP1);
        restartBtnP2.addEventListener('click', onRestartP2);
        restartBtnP3.addEventListener('click', onRestartP3);

        hitBtnP1.addEventListener('click', onHitPlayer1);
        hitBtnP2.addEventListener('click', onHitPlayer2);
        hitBtnP3.addEventListener('click', onHitPlayer3);

        standBtnP1.addEventListener('click', onStandPlayer1);
        standBtnP2.addEventListener('click', onStandPlayer2);
        standBtnP3.addEventListener('click', onStandPlayer3);

        restartBtnP4.addEventListener('click', onRestartP4);
        hitBtnP4.addEventListener('click', onHitPlayer4);
        standBtnP4.addEventListener('click', onStandPlayer4);
    }
    else if (playerArray.length === 6) {
        restartBtnP1.addEventListener('click', onRestartP1);
        restartBtnP2.addEventListener('click', onRestartP2);
        restartBtnP3.addEventListener('click', onRestartP3);

        hitBtnP1.addEventListener('click', onHitPlayer1);
        hitBtnP2.addEventListener('click', onHitPlayer2);
        hitBtnP3.addEventListener('click', onHitPlayer3);

        standBtnP1.addEventListener('click', onStandPlayer1);
        standBtnP2.addEventListener('click', onStandPlayer2);
        standBtnP3.addEventListener('click', onStandPlayer3);

        restartBtnP4.addEventListener('click', onRestartP4);
        hitBtnP4.addEventListener('click', onHitPlayer4);
        standBtnP4.addEventListener('click', onStandPlayer4);

        restartBtnP5.addEventListener('click', onRestartP5);
        hitBtnP5.addEventListener('click', onHitPlayer5);
        standBtnP5.addEventListener('click', onStandPlayer5);
    }
    else if (playerArray.length === 7) {
        restartBtnP1.addEventListener('click', onRestartP1);
        restartBtnP2.addEventListener('click', onRestartP2);
        restartBtnP3.addEventListener('click', onRestartP3);

        hitBtnP1.addEventListener('click', onHitPlayer1);
        hitBtnP2.addEventListener('click', onHitPlayer2);
        hitBtnP3.addEventListener('click', onHitPlayer3);

        standBtnP1.addEventListener('click', onStandPlayer1);
        standBtnP2.addEventListener('click', onStandPlayer2);
        standBtnP3.addEventListener('click', onStandPlayer3);

        restartBtnP4.addEventListener('click', onRestartP4);
        hitBtnP4.addEventListener('click', onHitPlayer4);
        standBtnP4.addEventListener('click', onStandPlayer4);

        restartBtnP5.addEventListener('click', onRestartP5);
        hitBtnP5.addEventListener('click', onHitPlayer5);
        standBtnP5.addEventListener('click', onStandPlayer5);

        restartBtnP6.addEventListener('click', onRestartP6);
        hitBtnP6.addEventListener('click', onHitPlayer6);
        standBtnP6.addEventListener('click', onStandPlayer6);
    }
    else if (playerArray.length === 8) {
        restartBtnP1.addEventListener('click', onRestartP1);
        restartBtnP2.addEventListener('click', onRestartP2);
        restartBtnP3.addEventListener('click', onRestartP3);

        hitBtnP1.addEventListener('click', onHitPlayer1);
        hitBtnP2.addEventListener('click', onHitPlayer2);
        hitBtnP3.addEventListener('click', onHitPlayer3);

        standBtnP1.addEventListener('click', onStandPlayer1);
        standBtnP2.addEventListener('click', onStandPlayer2);
        standBtnP3.addEventListener('click', onStandPlayer3);

        restartBtnP4.addEventListener('click', onRestartP4);
        hitBtnP4.addEventListener('click', onHitPlayer4);
        standBtnP4.addEventListener('click', onStandPlayer4);

        restartBtnP5.addEventListener('click', onRestartP5);
        hitBtnP5.addEventListener('click', onHitPlayer5);
        standBtnP5.addEventListener('click', onStandPlayer5);

        restartBtnP6.addEventListener('click', onRestartP6);
        hitBtnP6.addEventListener('click', onHitPlayer6);
        standBtnP6.addEventListener('click', onStandPlayer6);

        restartBtnP7.addEventListener('click', onRestartP7);
        hitBtnP7.addEventListener('click', onHitPlayer7);
        standBtnP7.addEventListener('click', onStandPlayer7);
    }
}

// this function will be called when the user presses their restart button //
function onRestartP1() {
    var question = confirm("Player 1 wants to restart the game. Do you accept?")
    // reset player values // -- breaking code
    if (question === true) {
        // for (var i = 0; i < playerArray.length; i++) {
        //     playerArray[i].Bust = false;
        //     playerArray[i].Stand = false;
        // }
        
        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCards();
        
        // drawCards();
    }
    else {
        alert("Player declines to restart the game.")
    }
}
function onRestartP2() {
    question = confirm("Player 2 wants to restart the game. Do you accept?")
    if (question === true) {
        // reset player values //
        // for (var i = 0; i <= playerArray.length; i++) {
        //     playerArray[i].Bust = false;
        //     playerArray[i].Stand = false;
        // }
        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCards();
    }
    else {
        alert("Player declines to restart the game.")
    }
}
function onRestartP3() {
    question = confirm("Player 3 wants to restart the game. Do you accept?")
    if (question === true) {
        // reset player values //
        // for (var i = 0; i <= playerArray.length; i++) {
        //     playerArray[i].Bust = false;
        //     playerArray[i].Stand = false;
        // }
        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCards();
    }
    else {
        alert("Player declines to restart the game.")
    }
}
function onRestartP4() {
    question = confirm("Player 4 wants to restart the game. Do you accept?")
    if (question === true) {
        // reset player values //
        // for (var i = 0; i <= playerArray.length; i++) {
        //     playerArray[i].Bust = false;
        //     playerArray[i].Stand = false;
        // }
        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCards();
    }
    else {
        alert("Player declines to restart the game.")
    }
}
function onRestartP5() {
    question = confirm("Player 5 wants to restart the game. Do you accept?")
    if (question === true) {
        // reset player values //
        // for (var i = 0; i <= playerArray.length; i++) {
        //     playerArray[i].Bust = false;
        //     playerArray[i].Stand = false;
        // }
        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCards();
    }
    else {
        alert("Player declines to restart the game.")
    }
}
function onRestartP6() {
    question = confirm("Player 6 wants to restart the game. Do you accept?")
    if (question === true) {
        // reset player values //
        // for (var i = 0; i <= playerArray.length; i++) {
        //     playerArray[i].Bust = false;
        //     playerArray[i].Stand = false;
        // }
        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCards();
    }
    else {
        alert("Player declines to restart the game.")
    }
}
function onRestartP7() {
    question = confirm("Player 7 wants to restart the game. Do you accept?")
    if (question === true) {
        // reset player values //
        // for (var i = 0; i <= playerArray.length; i++) {
        //     playerArray[i].Bust = false;
        //     playerArray[i].Stand = false;
        // }
        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCards();
    }
    else {
        alert("Player declines to restart the game.")
    }
}

// this function will be called when the user presses the hit button //
function onHitPlayer1() {
    // will call player one hit function //
    player1Hit();
    // creating a timer function to give time for the card to render before busting //
    setTimeout(function () {
        // if the hit card makes the points go over 21 the user will get a bust alert //
        itsABust();
    }, 500); 
}
function player1Hit() {
    // calls to the api to get one shuffled card //
    var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=1"
    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function (data) {
        // this object holds all the data needed for the card //
        hitCard = {
                code: data.cards[0].code,
                suit: data.cards[0].suit,
                value: data.cards[0].value,
                imgUrl: data.cards[0].image
            };
        // this variable = the players original cards
        var originalHand = playerArray[1].Hand;
        // this pushes the new card into the array of cards
        originalHand.push(hitCard); 
        // then, the image is created and appended to the hand div with the other cards //
        var hitCardImg = document.createElement('img');
        hitCardImg.className = ('hitCard1')
        hitCardImg.src = (hitCard.imgUrl)

        divHand = document.getElementById(("handPlayer1"));
        divHand.appendChild(hitCardImg);

        // resets value of hand to zero //
        var handVal = 0;
        for(var a = 0; a < playerArray.length; a++) {
            // resets players points //
            playerArray[a].Points = 0;
            for (var j = 0; j < (playerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (playerArray[a].Hand[j].value === "JACK" || playerArray[a].Hand[j].value === "QUEEN" || playerArray[a].Hand[j].value === "KING") {
                    playerArray[a].Hand[j].value = "10";
                } 
                // sets value for ace depending on previous hand value //
                else if (playerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    playerArray[a].Hand[j].value = "11";
                } else if (playerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    playerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(playerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            playerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer1');
            divPoints.innerHTML = `Points: ${playerArray[1].Points} `;

        }
    })
}

function onHitPlayer2() {
        // will call player one hit function //
        player2Hit();
        // creating a timer function to give time for the card to render before busting //
        setTimeout(function () {
            // if the hit card makes the points go over 21 the user will get a bust alert//
            itsABust();
        }, 500); 
}
function player2Hit() {
    // calls to the api to get one shuffled card //
    var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=1"
    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function (data) {
        // this object holds all the data needed for the card //
        hitCard = {
                code: data.cards[0].code,
                suit: data.cards[0].suit,
                value: data.cards[0].value,
                imgUrl: data.cards[0].image
            };
        // this variable = the players original cards
        var originalHand = playerArray[2].Hand;
        // this pushes the new card into the array of cards
        originalHand.push(hitCard); 
        // then, the image is created and appended to the hand div with the other cards //
        var hitCardImg = document.createElement('img');
        hitCardImg.className = ('hitCard2')
        hitCardImg.src = (hitCard.imgUrl)

        divHand = document.getElementById(("handPlayer2"));
        divHand.appendChild(hitCardImg);

        // resets value of hand to zero //
        var handVal = 0;
        for(var a = 0; a < playerArray.length; a++) {
            // resets players points //
            playerArray[a].Points = 0;
            for (var j = 0; j < (playerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (playerArray[a].Hand[j].value === "JACK" || playerArray[a].Hand[j].value === "QUEEN" || playerArray[a].Hand[j].value === "KING") {
                    playerArray[a].Hand[j].value = "10";
                } 
                // sets value for ace depending on previous hand value //
                else if (playerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    playerArray[a].Hand[j].value = "11";
                } else if (playerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    playerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(playerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            playerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer2');
            divPoints.innerHTML = `Points: ${playerArray[2].Points} `;

        }
    })
}

function onHitPlayer3() {
        // will call player one hit function //
        player3Hit();
        // creating a timer function to give time for the card to render before busting //
        setTimeout(function () {
            // if the hit card makes the points go over 21 the user will get a bust alert //
            itsABust();
        }, 500); 
}
function player3Hit() {
    // calls to the api to get one shuffled card //
    var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=1"
    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function (data) {
        // this object holds all the data needed for the card //
        hitCard = {
                code: data.cards[0].code,
                suit: data.cards[0].suit,
                value: data.cards[0].value,
                imgUrl: data.cards[0].image
            };
        // this variable = the players original cards
        var originalHand = playerArray[3].Hand;
        // this pushes the new card into the array of cards
        originalHand.push(hitCard); 
        // then, the image is created and appended to the hand div with the other cards //
        var hitCardImg = document.createElement('img');
        hitCardImg.className = ('hitCard3')
        hitCardImg.src = (hitCard.imgUrl)

        divHand = document.getElementById(("handPlayer3"));
        divHand.appendChild(hitCardImg);

        // resets value of hand to zero //
        var handVal = 0;
        for(var a = 0; a < playerArray.length; a++) {
            // resets players points //
            playerArray[a].Points = 0;
            for (var j = 0; j < (playerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (playerArray[a].Hand[j].value === "JACK" || playerArray[a].Hand[j].value === "QUEEN" || playerArray[a].Hand[j].value === "KING") {
                    playerArray[a].Hand[j].value = "10";
                } 
                // sets value for ace depending on previous hand value //
                else if (playerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    playerArray[a].Hand[j].value = "11";
                } else if (playerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    playerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(playerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            playerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer3');
            divPoints.innerHTML = `Points: ${playerArray[3].Points} `;

        }
    })
}

function onHitPlayer4() {
        // will call player one hit function //
        player4Hit();
        // creating a timer function to give time for the card to render before busting //
        setTimeout(function () {
            // if the hit card makes the points go over 21 the user will get a bust alert //
            itsABust();
        }, 500); 
}
function player4Hit() {
    // calls to the api to get one shuffled card //
    var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=1"
    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function (data) {
        // this object holds all the data needed for the card //
        hitCard = {
                code: data.cards[0].code,
                suit: data.cards[0].suit,
                value: data.cards[0].value,
                imgUrl: data.cards[0].image
            };
        // this variable = the players original cards
        var originalHand = playerArray[4].Hand;
        // this pushes the new card into the array of cards
        originalHand.push(hitCard); 
        // then, the image is created and appended to the hand div with the other cards //
        var hitCardImg = document.createElement('img');
        hitCardImg.className = ('hitCard4')
        hitCardImg.src = (hitCard.imgUrl)

        divHand = document.getElementById(("handPlayer4"));
        divHand.appendChild(hitCardImg);

        // resets value of hand to zero //
        var handVal = 0;
        for(var a = 0; a < playerArray.length; a++) {
            // resets players points //
            playerArray[a].Points = 0;
            for (var j = 0; j < (playerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (playerArray[a].Hand[j].value === "JACK" || playerArray[a].Hand[j].value === "QUEEN" || playerArray[a].Hand[j].value === "KING") {
                    playerArray[a].Hand[j].value = "10";
                } 
                // sets value for ace depending on previous hand value //
                else if (playerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    playerArray[a].Hand[j].value = "11";
                } else if (playerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    playerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(playerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            playerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer4');
            divPoints.innerHTML = `Points: ${playerArray[4].Points} `;

        }
    })
}

function onHitPlayer5() {
        // will call player one hit function //
        player5Hit();
        // creating a timer function to give time for the card to render before busting //
        setTimeout(function () {
            // if the hit card makes the points go over 21 the user will get a bust alert //
            itsABust();
        }, 500); 
}
function player5Hit() {
    // calls to the api to get one shuffled card //
    var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=1"
    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function (data) {
        // this object holds all the data needed for the card //
        hitCard = {
                code: data.cards[0].code,
                suit: data.cards[0].suit,
                value: data.cards[0].value,
                imgUrl: data.cards[0].image
            };
        // this variable = the players original cards
        var originalHand = playerArray[5].Hand;
        // this pushes the new card into the array of cards
        originalHand.push(hitCard); 
        // then, the image is created and appended to the hand div with the other cards //
        var hitCardImg = document.createElement('img');
        hitCardImg.className = ('hitCard5')
        hitCardImg.src = (hitCard.imgUrl)

        divHand = document.getElementById(("handPlayer5"));
        divHand.appendChild(hitCardImg);

        // resets value of hand to zero //
        var handVal = 0;
        for(var a = 0; a < playerArray.length; a++) {
            // resets players points //
            playerArray[a].Points = 0;
            for (var j = 0; j < (playerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (playerArray[a].Hand[j].value === "JACK" || playerArray[a].Hand[j].value === "QUEEN" || playerArray[a].Hand[j].value === "KING") {
                    playerArray[a].Hand[j].value = "10";
                } 
                // sets value for ace depending on previous hand value //
                else if (playerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    playerArray[a].Hand[j].value = "11";
                } else if (playerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    playerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(playerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            playerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer5');
            divPoints.innerHTML = `Points: ${playerArray[5].Points} `;

        }
    })
}

function onHitPlayer6() {
        // will call player one hit function //
        player6Hit();
        // creating a timer function to give time for the card to render before busting //
        setTimeout(function () {
            // if the hit card makes the points go over 21 the user will get a bust alert //
            itsABust();
        }, 500); 
}
function player6Hit() {
    // calls to the api to get one shuffled card //
    var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=1"
    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function (data) {
        // this object holds all the data needed for the card //
        hitCard = {
                code: data.cards[0].code,
                suit: data.cards[0].suit,
                value: data.cards[0].value,
                imgUrl: data.cards[0].image
            };
        // this variable = the players original cards
        var originalHand = playerArray[6].Hand;
        // this pushes the new card into the array of cards
        originalHand.push(hitCard); 
        // then, the image is created and appended to the hand div with the other cards //
        var hitCardImg = document.createElement('img');
        hitCardImg.className = ('hitCard6')
        hitCardImg.src = (hitCard.imgUrl)

        divHand = document.getElementById(("handPlayer6"));
        divHand.appendChild(hitCardImg);

        // resets value of hand to zero //
        var handVal = 0;
        for(var a = 0; a < playerArray.length; a++) {
            // resets players points //
            playerArray[a].Points = 0;
            for (var j = 0; j < (playerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (playerArray[a].Hand[j].value === "JACK" || playerArray[a].Hand[j].value === "QUEEN" || playerArray[a].Hand[j].value === "KING") {
                    playerArray[a].Hand[j].value = "10";
                } 
                // sets value for ace depending on previous hand value //
                else if (playerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    playerArray[a].Hand[j].value = "11";
                } else if (playerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    playerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(playerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            playerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer6');
            divPoints.innerHTML = `Points: ${playerArray[6].Points} `;

        }
    })
}

function onHitPlayer7() {
        // will call player one hit function //
        player7Hit();
        // creating a timer function to give time for the card to render before busting //
        setTimeout(function () {
            // if the hit card makes the points go over 21 the user will get a bust alert //
            itsABust();
        }, 500); 
}
function player7Hit() {
    // calls to the api to get one shuffled card //
    var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=1"
    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function (data) {
        // this object holds all the data needed for the card //
        hitCard = {
                code: data.cards[0].code,
                suit: data.cards[0].suit,
                value: data.cards[0].value,
                imgUrl: data.cards[0].image
            };
        // this variable = the players original cards
        var originalHand = playerArray[7].Hand;
        // this pushes the new card into the array of cards
        originalHand.push(hitCard); 
        // then, the image is created and appended to the hand div with the other cards //
        var hitCardImg = document.createElement('img');
        hitCardImg.className = ('hitCard7')
        hitCardImg.src = (hitCard.imgUrl)

        divHand = document.getElementById(("handPlayer7"));
        divHand.appendChild(hitCardImg);

        // resets value of hand to zero //
        var handVal = 0;
        for(var a = 0; a < playerArray.length; a++) {
            // resets players points //
            playerArray[a].Points = 0;
            for (var j = 0; j < (playerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (playerArray[a].Hand[j].value === "JACK" || playerArray[a].Hand[j].value === "QUEEN" || playerArray[a].Hand[j].value === "KING") {
                    playerArray[a].Hand[j].value = "10";
                } 
                // sets value for ace depending on previous hand value //
                else if (playerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    playerArray[a].Hand[j].value = "11";
                } else if (playerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    playerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(playerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            playerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer7');
            divPoints.innerHTML = `Points: ${playerArray[7].Points} `;

        }
    })
}

function itsABust() {
    for (var i = 0; i < playerArray.length; i++) {
        if (playerArray[i].Points > 21) {
            // sets bst property to true //
            playerArray[i].Bust === true;
            //sends user alert // -- we need to set this to only display to the user who busted
            alert(`${playerArray[i].Name} busted`);
        }
    }
}

function onStandPlayer1() {
    playerArray[1].Stand === true;
}
function onStandPlayer2() {
    playerArray[2].Stand === true;
}
function onStandPlayer3() {
    playerArray[3].Stand === true;
}
function onStandPlayer4() {
    playerArray[4].Stand === true;
}
function onStandPlayer5() {
    playerArray[5].Stand === true;
}
function onStandPlayer6() {
    playerArray[6].Stand === true;
}
function onStandPlayer7() {
    playerArray[7].Stand === true;
}

// function hitHouseLogic() {
//     // house will currently stand if it has > 17 points or is higher than player points //
//     if (playerArray[0].Points > playerArray[1].Points || playerArray[0].Points > 16) {
//         playerArray[0].Stand = true;
//     }
//     else if (playerArray[0].Points < playerArray[1].Points || playerArray[0].Points === playerArray[1].Points && playerArray[0].Points < 17) {
//         var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=1"
//         $.ajax({
//             url: docUrl,
//             method: "GET"
//         }).then(function (data) {
//             // this object holds all the data needed for the card //
//             hitCard = {
//                     code: data.cards[0].code,
//                     suit: data.cards[0].suit,
//                     value: data.cards[0].value,
//                     imgUrl: data.cards[0].image
//                 };
//             // this variable = the players original cards
//             var originalHand = playerArray[0].Hand;
//             // this pushes the new card into the array of cards
//             originalHand.push(hitCard); 
//             // then, the image is created and appended to the hand div with the other cards //

//             var houseHitCard = document.querySelector("#handHouse");
//             var hitCardImg = document.createElement('img');
//             hitCardImg.className = ('hitCard' + playerArray[0].Name)
//             hitCardImg.src = (hitCard.imgUrl)
//             houseHitCard.appendChild(hitCardImg);

//             // resets value of hand to zero //
//             var handVal = 0;
//             // resets players points //
//             playerArray[0].Points = 0;
//             for (var j = 0; j < (playerArray[0].Hand).length; j++) {
//                 // sets values for face cards //
//                 if (playerArray[0].Hand[j].value === "JACK" || playerArray[0].Hand[j].value === "QUEEN" || playerArray[0].Hand[j].value === "KING") {
//                     playerArray[0].Hand[j].value = "10";
//                 } 
//                 // sets value for ace depending on previous hand value //
//                 else if (playerArray[0].Hand[j].value === "ACE" && handVal < 11) {
//                     playerArray[0].Hand[j].value = "11";
//                 } else if (playerArray[0].Hand[j].value === "ACE" && handVal > 10) {
//                     playerArray[0].Hand[j].value = "1";
//                 }
//                 // adds all cards in hand to create new value //
//                 handVal += parseInt(playerArray[0].Hand[j].value);
//             }
//             // sets the points equal to the new value //
//             playerArray[0].Points = handVal;
//             // resets handVal back to zero //
//             handVal = 0;
//             // clears points on html & recreates the elements to display the new points //
//             var housePointsDiv = document.querySelector("#pointsHouse");
//             housePointsDiv.innerHTML = `Points: ${playerArray[0].Points} `;

//             //timeout function to give html time to append card and points before running bust function //
//             setTimeout(function () {
//                 // if the hit card makes the points go over 21 the house will get a bust alert and the game will end //
//                 houseBust()
//             }, 500);
//         })
//     }
//     else {
//         playerArray[0].Stand = true;
//     }
// }

// function houseBust() {
//     if (playerArray[0].Points > 21) {
//         console.log("inside the bust function")
//         //sends user alert //
//         alert("the house busted");
//         // sets bst property to true //
//         playerArray[0].Bust = true;
//         // calls function //
//         setTimeout(function () {
//             endRound();
//         }, 500);
//     }
// }


// // when this function is called the game is ended //
// function endRound() {
//     console.log("======ending round========")
//     // the users will get an alert that the game is over //
//     alert(`round over`)
//     // display points from round to user //
//     for(var i = 0; i < playerArray.length; i++) {
//         console.log(`${playerArray[i].Name} has ${playerArray[i].Points} points`)
//         alert(`${playerArray[i].Name} has ${playerArray[i].Points} points`)
//     }
//     // if the players tie //
//     if (playerArray[0].Points === playerArray[1].Points) {
//         alert(`you tied`)
//         // increase both scores by 1 //
//         playerArray[0].Score = playerArray[0].Score + 1;
//         playerArray[1].Score = playerArray[1].Score + 1;
//         // alert the users of current scores //
//         alert(`${playerArray[0].Name}: ${playerArray[0].Score} || ${playerArray[1].Name}: ${playerArray[1].Score}`)
//         // update scores on html //
//         divScore.innerHTML = `Score: ${playerArray[0].Score} `;
//         divScore.innerHTML = `Score: ${playerArray[1].Score} `;
//     } 
//     // if the House wins //
//     else if (playerArray[1].Bust === true || playerArray[1].Points > 21 || playerArray[0].Bust === false && playerArray[0].Points > playerArray[1].Points) {
//         // alert users //
//         alert(`${playerArray[0].Name} won || ${playerArray[1].Name} lost`)
//         // increase House points by 2 //
//         playerArray[0].Score = playerArray[0].Score + 2;
//         // alert the users of current scores //
//         alert(`${playerArray[0].Name}: ${playerArray[0].Score} || ${playerArray[1].Name}: ${playerArray[1].Score}`) 
//         scoreHouse = document.querySelector("#scoreHouse");
//         scoreHouse.innerHTML = `Score: ${playerArray[0].Score} `;

//     }
//     // if player1 wins //
//     else if (playerArray[0].Bust === true || playerArray[0].Points > 21 || playerArray[1].Bust === false && playerArray[1].Points > playerArray[0].Points){
//         // alert users //
//         alert (`${playerArray[0].Name} lost || ${playerArray[1].Name} won`)
//         // increase player1 points by 2 //
//         playerArray[1].Score = playerArray[1].Score + 2;
//         // alert the users of current scores //
//         alert(`${playerArray[0].Name}: ${playerArray[0].Score} || ${playerArray[1].Name}: ${playerArray[1].Score}`)
//         scorePlayer1 = document.querySelector("#scorePlayer1");
//         scorePlayer1.innerHTML = `Score: ${playerArray[1].Score} `;
//     }
//     console.log(playerArray);
//     console.log("=========================")

//     // hides all game buttons besides and changes the value to ask user if they want to play another game //
//     if (hitBtn.style.display === 'block') {
//         hitBtn.style.display = 'none'
//     }
//     if (standBtn.style.display === 'block') {
//         standBtn.style.display = 'none'
//     }
//     restartBtn.value = "play another round";

//     // reset player values //
//     playerArray[0].Bust = false;
//     playerArray[1].Bust = false;
//     playerArray[0].Stand = false;
//     playerArray[1].Stand = false;
// }
