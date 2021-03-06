// THIS GAME IS CURRENTLY CODED FOR TWO PLAYER VS THE HOUSE //

// alert("directions for creative team: This is how the house logic currently works: If the user hits the House will stand if it has 17 or more points or if it has higher points than the player, otherwise the House will also hit. When the player stands the House will stand as well if it has more than 17 points or if it has higher points than the player, otherwise the House will hit until it either is above 17 points, higher than the player, or busts. Once we are creating the actual page the houses cards should have the first card up the other face down (hit cards should also be face down) and hand points should be hidden from the player until the end of the round function has ran. I am just leaving them up for building purposes.")

// alert("directions for user: Try to get as close to 21 without busting. If you want another card press 'hit' and you will be dealt another card. If you want to stay with your hand and end the game press 'stand'. You can hit as many times as you want but beware, if you bust you automatically lose. To keep playing press 'play another round'. Each round you play, your score will be displayed and will increment as you win. If you tie with the House you will be awarded 1 point each. If you win you will be awarded 2 points and if the House wins it will be awarded two points.")
///////////////////////////////////////////////
//                Variables                  //
///////////////////////////////////////////////
var gameContainer = document.querySelector('#cont-blackjack-multi');

var multistartBtn = document.getElementById('start-multi-blackjack');
// var goBackBtn = document.querySelector('#goBack');

//making global variables to be used throughout several functions//
let multiHand = [];
var divPlayer = null;
var divHand = null;
var divPoints = null;
var divScore = null;

var amount = 0;
// hard coded for now but will use players from db
let multiPlayerArray = [{ Name: "House", ID: 0, Score: 0, Points: 0, Bust: false, Hand: multiHand[0], Stand: 'false' }];


///////////////////////////////////////////////
//                Functions                  //
///////////////////////////////////////////////

multistartBtn.addEventListener('click', onStartMulti);

// this function will be called when the start btn is pressed //
function onStartMulti() {
    console.log("I'm running");
    // the start button is hidden //
    if (multistartBtn.style.display === 'block') {
        multistartBtn.style.display = 'none'
    }
    // will add the players hard coded in the allPlayers function to the session //
    addPlayersMulti();
    // will draw cards for all players using the drawCards function then dynamically create html elements//
    drawCardsMulti();
}

// CONNECT DB HERE TO ADD PLAYERS BASED ON PEOPLE AT TABLE -- up to 7 //
function addPlayersMulti() {
    amount = prompt("How many players would you like to add?");
    // makes sure the user enters correct amount of players //
    for (amount === false; amount < 2 || amount > 7;) {
        alert("Amount of players needs to be between 2 and 7.");
        amount = prompt("How many players would you like to add?");
    }

    for (var i = 1; i <= amount; i++) {
        var player = { Name: 'Player' + i, ID: i, Score: 0, Points: 0, Bust: false, Hand: multiHand, Stand: 'false' };
        multiPlayerArray.push(player)
    }
}

// setting i to 0 so that we can control the synchronicity //
i = 0;
function drawCardsMulti() {
    // this api link will draw 2 random cards //
    var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=2"
    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function (data) {
        // we will save the data in an array. each object will hold the cards code, suit, value, and image //
        playerHandMulti = [
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
        multiPlayerArray[i].Hand = playerHandMulti
        // this will increment i so that it will keep running the draw cards function for each player //
        i++
        if (i < multiPlayerArray.length) {
            drawCardsMulti()
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
function totalPointsMulti() {
    // handVal is set to 0 //
    var handVal = 0;
    for (var i = 0; i < multiPlayerArray.length; i++) {
        // resets players points //
        multiPlayerArray[i].Points = 0;
        for (var j = 0; j < (multiPlayerArray[i].Hand).length; j++) {
            // sets values for face cards //
            if (multiPlayerArray[i].Hand[j].value === "JACK" || multiPlayerArray[i].Hand[j].value === "QUEEN" || multiPlayerArray[i].Hand[j].value === "KING") {
                multiPlayerArray[i].Hand[j].value = "10";
            }
            // sets value for ace depending on current point value
            if (multiPlayerArray[i].Hand[0].value === "ACE") {
                multiPlayerArray[i].Hand[0].value = "11";
            } else if (multiPlayerArray[i].Hand[1].value === "ACE" && multiPlayerArray[i].Hand[0].value < 11) {
                multiPlayerArray[i].Hand[1].value = "11";
            } else if (multiPlayerArray[i].Hand[1].value === "ACE" && multiPlayerArray[i].Hand[0].value > 10) {
                multiPlayerArray[i].Hand[1].value = "1";
            }

            // adds all cards in hand to create new value //
            handVal += parseInt(multiPlayerArray[i].Hand[j].value);
        }
        // sets the points equal to the new value //
        multiPlayerArray[i].Points = handVal;
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
    divHouse.innerHTML = (multiPlayerArray[0].Name);
    divHouse.setAttribute('style', 'text-align:center;')
    houseRow.appendChild(divHouse);

    // creates div where the houses session score will be held and displayed //
    houseScore = document.createElement('div');
    houseScore.id = ('houseScore');
    houseScore.innerHTML = `Score: ${multiPlayerArray[0].Score} `;
    divHouse.appendChild(houseScore);

    //creates div where cards will be appended //
    houseHand = document.createElement("div");
    houseHand.id = ('houseHand');
    divHouse.appendChild(houseHand);

    // creates element to display card one image //
    var cardOneImg = document.createElement('img');
    cardOneImg.id = ('cardOneHouse')
    cardOneImg.src = (multiPlayerArray[0].Hand[0].imgUrl)
    houseHand.appendChild(cardOneImg);

    // creates element to display card two image //
    var cardTwoImg = document.createElement('img');
    cardTwoImg.id = ('cardTwoHouse')
    cardTwoImg.src = (multiPlayerArray[0].Hand[1].imgUrl)
    houseHand.appendChild(cardTwoImg);

    // creates div where the point value of the hand will be held and displayed  //
    housePoints = document.createElement('div');
    housePoints.id = ('housePoints');
    housePoints.innerHTML = `Points: ${multiPlayerArray[0].Points} `;
    divHouse.appendChild(housePoints);

    // make loop to create same elements for each player //
    for (var i = 1; i < multiPlayerArray.length; i++) {
        // create cols for each player to store their elements and append to players row //
        var playersCol = document.createElement('div');
        playersCol.className = ('col-md-6');
        playersCol.id = (multiPlayerArray[i].Name);
        playersCol.setAttribute("style", "margin:20px; display:block; float:left;")
        playersRow.appendChild(playersCol);

        // create game option buttons for each player //
        var playersBtns = document.createElement('div');
        playersBtns.className = ('playersGameOptions');
        playersBtns.id = ('buttons' + multiPlayerArray[i].Name);
        playersCol.appendChild(playersBtns);

        var hitBtn = document.createElement('input');
        hitBtn.className = ('btn');
        hitBtn.id = ('hit' + multiPlayerArray[i].Name);
        hitBtn.setAttribute("type", "button");
        hitBtn.setAttribute("value", "hit me");
        hitBtn.setAttribute("style", "display:block");

        var standBtn = document.createElement('input');
        standBtn.className = ('btn');
        standBtn.id = ('stand' + multiPlayerArray[i].Name);
        standBtn.setAttribute("type", "button");
        standBtn.setAttribute("value", "stand");
        standBtn.setAttribute("style", "display:block;");

        var restartBtn = document.createElement('input');
        restartBtn.className = ('btn');
        restartBtn.id = ('restart' + multiPlayerArray[i].Name);
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
        divPlayer.id = multiPlayerArray[i].Name;
        divPlayer.innerHTML = (multiPlayerArray[i].Name);
        divPlayer.setAttribute('style', 'text-align:center;')
        // append player to col //
        playersCol.appendChild(divPlayer);

        // creates div where the users session score will be held and displayed //
        divScore = document.createElement('div');
        divScore.className = ('score');
        divScore.id = ('score' + multiPlayerArray[i].Name);
        divScore.innerHTML = `Score: ${multiPlayerArray[i].Score} `;
        // append score to col //
        divPlayer.appendChild(divScore);

        //creates div where cards will be appended //
        divHand = document.createElement("div");
        divHand.id = ("hand" + multiPlayerArray[i].Name);

        // creates element to display card one image //
        var cardOneImg = document.createElement('img');
        cardOneImg.id = ('cardOne' + multiPlayerArray[i].Name)
        cardOneImg.src = (multiPlayerArray[i].Hand[0].imgUrl)

        // creates element to display card two image //
        var cardTwoImg = document.createElement('img');
        cardTwoImg.id = ('cardTwo' + multiPlayerArray[i].Name)
        cardTwoImg.src = (multiPlayerArray[i].Hand[1].imgUrl)

        divPlayer.appendChild(divHand);
        // appends cards to hand div //
        divHand.appendChild(cardOneImg);
        divHand.appendChild(cardTwoImg);

        // creates div where the point value of the hand will be held and displayed  //
        divPoints = document.createElement('div');
        divPoints.className = ('points');
        divPoints.id = ('points' + multiPlayerArray[i].Name);
        divPoints.innerHTML = `Points: ${multiPlayerArray[i].Points} `;
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

    if (multiPlayerArray.length === 3) {
        restartBtnP1.addEventListener('click', onRestartP1);
        restartBtnP2.addEventListener('click', onRestartP2);

        hitBtnP1.addEventListener('click', onHitPlayer1);
        hitBtnP2.addEventListener('click', onHitPlayer2);

        standBtnP1.addEventListener('click', onStandPlayer1);
        standBtnP2.addEventListener('click', onStandPlayer2);
    }
    else if (multiPlayerArray.length === 4) {
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
    else if (multiPlayerArray.length === 5) {
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
    else if (multiPlayerArray.length === 6) {
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
    else if (multiPlayerArray.length === 7) {
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
    else if (multiPlayerArray.length === 8) {
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
        // reset player values //
        multiPlayerArray[0].Bust = false;
        multiPlayerArray[1].Bust = false;

        multiPlayerArray[0].Stand = false;
        multiPlayerArray[1].Stand = false;

        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCardsMulti();

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
        multiPlayerArray[0].Bust = false;
        multiPlayerArray[1].Bust = false;
        multiPlayerArray[2].Bust = false;

        multiPlayerArray[0].Stand = false;
        multiPlayerArray[1].Stand = false;
        multiPlayerArray[2].Stand = false;

        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCardsMulti();
    }
    else {
        alert("Player declines to restart the game.")
    }
}
function onRestartP3() {
    question = confirm("Player 3 wants to restart the game. Do you accept?")
    if (question === true) {
        // reset player values //
        multiPlayerArray[0].Bust = false;
        multiPlayerArray[1].Bust = false;
        multiPlayerArray[2].Bust = false;
        multiPlayerArray[3].Bust = false;

        multiPlayerArray[0].Stand = false;
        multiPlayerArray[1].Stand = false;
        multiPlayerArray[2].Stand = false;
        multiPlayerArray[3].Stand = false;

        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCardsMulti();
    }
    else {
        alert("Player declines to restart the game.")
    }
}
function onRestartP4() {
    question = confirm("Player 4 wants to restart the game. Do you accept?")
    if (question === true) {
        // reset player values //
        multiPlayerArray[0].Bust = false;
        multiPlayerArray[1].Bust = false;
        multiPlayerArray[2].Bust = false;
        multiPlayerArray[3].Bust = false;
        multiPlayerArray[4].Bust = false;

        multiPlayerArray[0].Stand = false;
        multiPlayerArray[1].Stand = false;
        multiPlayerArray[2].Stand = false;
        multiPlayerArray[3].Stand = false;
        multiPlayerArray[4].Stand = false;

        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCardsMulti();
    }
    else {
        alert("Player declines to restart the game.")
    }
}
function onRestartP5() {
    question = confirm("Player 5 wants to restart the game. Do you accept?")
    if (question === true) {
        // reset player values //
        multiPlayerArray[0].Bust = false;
        multiPlayerArray[1].Bust = false;
        multiPlayerArray[2].Bust = false;
        multiPlayerArray[3].Bust = false;
        multiPlayerArray[4].Bust = false;
        multiPlayerArray[5].Bust = false;

        multiPlayerArray[0].Stand = false;
        multiPlayerArray[1].Stand = false;
        multiPlayerArray[2].Stand = false;
        multiPlayerArray[3].Stand = false;
        multiPlayerArray[4].Stand = false;
        multiPlayerArray[5].Stand = false;

        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCardsMulti();
    }
    else {
        alert("Player declines to restart the game.")
    }
}
function onRestartP6() {
    question = confirm("Player 6 wants to restart the game. Do you accept?")
    if (question === true) {
        // reset player values //
        multiPlayerArray[0].Bust = false;
        multiPlayerArray[1].Bust = false;
        multiPlayerArray[2].Bust = false;
        multiPlayerArray[3].Bust = false;
        multiPlayerArray[4].Bust = false;
        multiPlayerArray[5].Bust = false;
        multiPlayerArray[6].Bust = false;

        multiPlayerArray[0].Stand = false;
        multiPlayerArray[1].Stand = false;
        multiPlayerArray[2].Stand = false;
        multiPlayerArray[3].Stand = false;
        multiPlayerArray[4].Stand = false;
        multiPlayerArray[5].Stand = false;
        multiPlayerArray[6].Stand = false;

        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCardsMulti();
    }
    else {
        alert("Player declines to restart the game.")
    }
}
function onRestartP7() {
    question = confirm("Player 7 wants to restart the game. Do you accept?")
    if (question === true) {
        // reset player values //
        multiPlayerArray[0].Bust = false;
        multiPlayerArray[1].Bust = false;
        multiPlayerArray[2].Bust = false;
        multiPlayerArray[3].Bust = false;
        multiPlayerArray[4].Bust = false;
        multiPlayerArray[5].Bust = false;
        multiPlayerArray[6].Bust = false;
        multiPlayerArray[7].Bust = false;

        multiPlayerArray[0].Stand = false;
        multiPlayerArray[1].Stand = false;
        multiPlayerArray[2].Stand = false;
        multiPlayerArray[3].Stand = false;
        multiPlayerArray[4].Stand = false;
        multiPlayerArray[5].Stand = false;
        multiPlayerArray[6].Stand = false;
        multiPlayerArray[7].Stand = false;

        // will clear everything on the gameboard //
        houseRow.innerHTML = '';
        playersRow.innerHTML = '';
        // reset i back to 0 for drawCards function //
        i = 0;
        // redraws cards for all players in session //
        drawCardsMulti();
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
        var originalHand = multiPlayerArray[1].Hand;
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
        for (var a = 0; a < multiPlayerArray.length; a++) {
            // resets players points //
            multiPlayerArray[a].Points = 0;
            for (var j = 0; j < (multiPlayerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (multiPlayerArray[a].Hand[j].value === "JACK" || multiPlayerArray[a].Hand[j].value === "QUEEN" || multiPlayerArray[a].Hand[j].value === "KING") {
                    multiPlayerArray[a].Hand[j].value = "10";
                }
                // sets value for ace depending on previous hand value //
                else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    multiPlayerArray[a].Hand[j].value = "11";
                } else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    multiPlayerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(multiPlayerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            multiPlayerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer1');
            divPoints.innerHTML = `Points: ${multiPlayerArray[1].Points} `;

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
        var originalHand = multiPlayerArray[2].Hand;
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
        for (var a = 0; a < multiPlayerArray.length; a++) {
            // resets players points //
            multiPlayerArray[a].Points = 0;
            for (var j = 0; j < (multiPlayerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (multiPlayerArray[a].Hand[j].value === "JACK" || multiPlayerArray[a].Hand[j].value === "QUEEN" || multiPlayerArray[a].Hand[j].value === "KING") {
                    multiPlayerArray[a].Hand[j].value = "10";
                }
                // sets value for ace depending on previous hand value //
                else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    multiPlayerArray[a].Hand[j].value = "11";
                } else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    multiPlayerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(multiPlayerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            multiPlayerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer2');
            divPoints.innerHTML = `Points: ${multiPlayerArray[2].Points} `;

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
        var originalHand = multiPlayerArray[3].Hand;
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
        for (var a = 0; a < multiPlayerArray.length; a++) {
            // resets players points //
            multiPlayerArray[a].Points = 0;
            for (var j = 0; j < (multiPlayerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (multiPlayerArray[a].Hand[j].value === "JACK" || multiPlayerArray[a].Hand[j].value === "QUEEN" || multiPlayerArray[a].Hand[j].value === "KING") {
                    multiPlayerArray[a].Hand[j].value = "10";
                }
                // sets value for ace depending on previous hand value //
                else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    multiPlayerArray[a].Hand[j].value = "11";
                } else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    multiPlayerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(multiPlayerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            multiPlayerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer3');
            divPoints.innerHTML = `Points: ${multiPlayerArray[3].Points} `;

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
        var originalHand = multiPlayerArray[4].Hand;
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
        for (var a = 0; a < multiPlayerArray.length; a++) {
            // resets players points //
            multiPlayerArray[a].Points = 0;
            for (var j = 0; j < (multiPlayerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (multiPlayerArray[a].Hand[j].value === "JACK" || multiPlayerArray[a].Hand[j].value === "QUEEN" || multiPlayerArray[a].Hand[j].value === "KING") {
                    multiPlayerArray[a].Hand[j].value = "10";
                }
                // sets value for ace depending on previous hand value //
                else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    multiPlayerArray[a].Hand[j].value = "11";
                } else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    multiPlayerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(multiPlayerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            multiPlayerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer4');
            divPoints.innerHTML = `Points: ${multiPlayerArray[4].Points} `;

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
        var originalHand = multiPlayerArray[5].Hand;
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
        for (var a = 0; a < multiPlayerArray.length; a++) {
            // resets players points //
            multiPlayerArray[a].Points = 0;
            for (var j = 0; j < (multiPlayerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (multiPlayerArray[a].Hand[j].value === "JACK" || multiPlayerArray[a].Hand[j].value === "QUEEN" || multiPlayerArray[a].Hand[j].value === "KING") {
                    multiPlayerArray[a].Hand[j].value = "10";
                }
                // sets value for ace depending on previous hand value //
                else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    multiPlayerArray[a].Hand[j].value = "11";
                } else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    multiPlayerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(multiPlayerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            multiPlayerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer5');
            divPoints.innerHTML = `Points: ${multiPlayerArray[5].Points} `;

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
        var originalHand = multiPlayerArray[6].Hand;
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
        for (var a = 0; a < multiPlayerArray.length; a++) {
            // resets players points //
            multiPlayerArray[a].Points = 0;
            for (var j = 0; j < (multiPlayerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (multiPlayerArray[a].Hand[j].value === "JACK" || multiPlayerArray[a].Hand[j].value === "QUEEN" || multiPlayerArray[a].Hand[j].value === "KING") {
                    multiPlayerArray[a].Hand[j].value = "10";
                }
                // sets value for ace depending on previous hand value //
                else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    multiPlayerArray[a].Hand[j].value = "11";
                } else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    multiPlayerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(multiPlayerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            multiPlayerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer6');
            divPoints.innerHTML = `Points: ${multiPlayerArray[6].Points} `;

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
        var originalHand = multiPlayerArray[7].Hand;
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
        for (var a = 0; a < multiPlayerArray.length; a++) {
            // resets players points //
            multiPlayerArray[a].Points = 0;
            for (var j = 0; j < (multiPlayerArray[a].Hand).length; j++) {
                // sets values for face cards //
                if (multiPlayerArray[a].Hand[j].value === "JACK" || multiPlayerArray[a].Hand[j].value === "QUEEN" || multiPlayerArray[a].Hand[j].value === "KING") {
                    multiPlayerArray[a].Hand[j].value = "10";
                }
                // sets value for ace depending on previous hand value //
                else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal < 11) {
                    multiPlayerArray[a].Hand[j].value = "11";
                } else if (multiPlayerArray[a].Hand[j].value === "ACE" && handVal > 10) {
                    multiPlayerArray[a].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(multiPlayerArray[a].Hand[j].value);
            }
            // sets the points equal to the new value //
            multiPlayerArray[a].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // display the new points //
            divPoints = document.getElementById('pointsPlayer7');
            divPoints.innerHTML = `Points: ${multiPlayerArray[7].Points} `;

        }
    })
}

function itsABust() {
    for (var i = 0; i < multiPlayerArray.length; i++) {
        if (multiPlayerArray[i].Points > 21) {
            // sets bst property to true //
            multiPlayerArray[i].Bust = true;
            multiPlayerArray[i].Stand = true;
            //sends user alert // -- we need to set this to only display to the user who busted
            console.log(`${multiPlayerArray[i].Name} busted`)
            // alert(`${multiPlayerArray[i].Name} busted`);
        }
    }
}

function onStandPlayer1() {
    multiPlayerArray[1].Stand = true;
    console.log(multiPlayerArray[1])
    checkStandStat();
}
function onStandPlayer2() {
    multiPlayerArray[2].Stand = true;
    checkStandStat();
}
function onStandPlayer3() {
    multiPlayerArray[3].Stand = true;
    checkStandStat();
}
function onStandPlayer4() {
    multiPlayerArray[4].Stand = true;
    checkStandStat();
}
function onStandPlayer5() {
    multiPlayerArray[5].Stand = true;
    checkStandStat();
}
function onStandPlayer6() {
    multiPlayerArray[6].Stand = true;
    checkStandStat();
}
function onStandPlayer7() {
    multiPlayerArray[7].Stand = true;
    checkStandStat();
}

function checkStandStat() {
    console.log("i can see")
    // if there are 2 players ... //
    if (multiPlayerArray.length === 3) {
        if (multiPlayerArray[1].Stand === true && multiPlayerArray[2].Stand === true) {
            console.log("all players are standing");
            houseLogic();
        }
        else {
            console.log("waiting for all players to be standing");
            console.log(multiPlayerArray);
        }
    }
    // if there are 3 players //
    else if (multiPlayerArray.length === 4) {
        if (multiPlayerArray[1].Stand === true && multiPlayerArray[2].Stand === true && multiPlayerArray[3].Stand === true) {
            console.log("all players are standing");
            houseLogic();
        }
        else {
            console.log("waiting for all players to be standing");
            console.log(multiPlayerArray);
        }
    }
    // if there are 4 players //
    else if (multiPlayerArray.length === 5) {
        if (multiPlayerArray[1].Stand === true && multiPlayerArray[2].Stand === true && multiPlayerArray[3].Stand === true && multiPlayerArray[4].Stand === true) {
            console.log("all players are standing");
            houseLogic();
        }
        else {
            console.log("waiting for all players to be standing");
            console.log(multiPlayerArray);
        }
    }
    // if there are 5 players //
    else if (multiPlayerArray.length === 6) {
        if (multiPlayerArray[1].Stand === true && multiPlayerArray[2].Stand === true && multiPlayerArray[3].Stand === true && multiPlayerArray[4].Stand === true && multiPlayerArray[5].Stand === true) {
            console.log("all players are standing");
            houseLogic();
        }
        else {
            console.log("waiting for all players to be standing");
            console.log(multiPlayerArray);
        }
    }
    // if there are 6 players //
    else if (multiPlayerArray.length === 7) {
        if (multiPlayerArray[1].Stand === true && multiPlayerArray[2].Stand === true && multiPlayerArray[3].Stand === true && multiPlayerArray[4].Stand === true && multiPlayerArray[5].Stand === true && multiPlayerArray[6].Stand === true) {
            console.log("all players are standing");
            houseLogic();
        }
        else {
            console.log("waiting for all players to be standing");
            console.log(multiPlayerArray);
        }
    }
    // if there are 7 players //
    else if (multiPlayerArray.length === 8) {
        if (multiPlayerArray[1].Stand === true && multiPlayerArray[2].Stand === true && multiPlayerArray[3].Stand === true && multiPlayerArray[4].Stand === true && multiPlayerArray[5].Stand === true && multiPlayerArray[6].Stand === true && multiPlayerArray[7].Stand === true) {
            console.log("all players are standing");
            houseLogic();
        }
        else {
            console.log("waiting for all players to be standing");
            console.log(multiPlayerArray);
        }
    }
}

function houseLogic() {
    // when all 2 players are standing ... //
    if (multiPlayerArray.length === 3) {
        // house will stand if ... //
        // house 17+ points
        if (multiPlayerArray[0].Points >= 17) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            endRound();
        }
        // all players bust
        else if (multiPlayerArray[1].Bust === true && multiPlayerArray[2].Bust === true) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            endRound();
        }
        // p1 bust & p2 points < house
        else if (multiPlayerArray[1].Bust === true && multiPlayerArray[2].Points < multiPlayerArray[0].Points) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            endRound();
        }
        // p1 points < house & p2 bust
        else if (multiPlayerArray[2].Bust === true && multiPlayerArray[1].Points < multiPlayerArray[0].Points) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            endRound();
        }
        // all players points < house 
        else if (multiPlayerArray[1].Points < multiPlayerArray[0].Points && multiPlayerArray[2].Points < multiPlayerArray[0].Points) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            endRound();
        }
        // house will hit if
        // p1 points > house BUT < 22
        else if (multiPlayerArray[1].Bust === false && multiPlayerArray[1].Points > multiPlayerArray[0].Points) {
            console.log("house will hit")
            houseHit();
        }
        // p2 points > house BUT < 22
        else if (multiPlayerArray[2].Bust === false && multiPlayerArray[2].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // player 1 tied && points < 17
        else if (multiPlayerArray[1].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 2 tied && points < 17
        else if (multiPlayerArray[2].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        else {
            console.log("something fell through the cracks");
        }
    }

    // when all 3 players are standing ... //
    else if (multiPlayerArray.length === 4) {
        // house will stand if ... //
        // house 17+ points
        if (multiPlayerArray[0].Points >= 17) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            endRound();
        }
        // all players bust
        else if (multiPlayerArray[1].Bust === true && multiPlayerArray[2].Bust === true) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            endRound();
        }
        // all players points < house 
        else if (multiPlayerArray[1].Points < multiPlayerArray[0].Points && multiPlayerArray[2].Points < multiPlayerArray[0].Points) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            endRound();
        }
        // house will hit if ... //
        // p1 points > house BUT < 22
        else if (multiPlayerArray[1].Bust === false && multiPlayerArray[1].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p2 points > house BUT < 22
        else if (multiPlayerArray[2].Bust === false && multiPlayerArray[2].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p3 points > house BUT < 22
        else if (multiPlayerArray[3].Bust === false && multiPlayerArray[3].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // player 1 tied && points < 17
        else if (multiPlayerArray[1].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 2 tied && points < 17
        else if (multiPlayerArray[2].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 3 tied && points < 17
        else if (multiPlayerArray[3].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // stand //
        else {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            endRound();
        }
    }

    // when all 4 players are standing ... //
    else if (multiPlayerArray.length === 5) {
        // house will stand if ... //
        // house 17+ points
        if (multiPlayerArray[0].Points >= 17) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
        // all players bust
        else if (multiPlayerArray[1].Bust === true && multiPlayerArray[2].Bust === true) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
        // all players points < house 
        else if (multiPlayerArray[1].Points < multiPlayerArray[0].Points && multiPlayerArray[2].Points < multiPlayerArray[0].Points) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
        // house will hit if ... //
        // p1 points > house BUT < 22
        else if (multiPlayerArray[1].Bust === false && multiPlayerArray[1].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p2 points > house BUT < 22
        else if (multiPlayerArray[2].Bust === false && multiPlayerArray[2].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p3 points > house BUT < 22
        else if (multiPlayerArray[3].Bust === false && multiPlayerArray[3].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p4 points > house BUT < 22
        else if (multiPlayerArray[4].Bust === false && multiPlayerArray[4].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // player 1 tied && points < 17
        else if (multiPlayerArray[1].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 2 tied && points < 17
        else if (multiPlayerArray[2].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 3 tied && points < 17
        else if (multiPlayerArray[3].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 4 tied && points < 17
        else if (multiPlayerArray[4].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // stand //
        else {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
    }

    // when all 5 players are standing ... //
    else if (multiPlayerArray.length === 6) {
        // house will stand if ... //
        // house 17+ points
        if (multiPlayerArray[0].Points >= 17) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
        // all players bust
        else if (multiPlayerArray[1].Bust === true && multiPlayerArray[2].Bust === true) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
        // all players points < house 
        else if (multiPlayerArray[1].Points < multiPlayerArray[0].Points && multiPlayerArray[2].Points < multiPlayerArray[0].Points) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
        // house will hit if ... //
        // p1 points > house BUT < 22
        else if (multiPlayerArray[1].Bust === false && multiPlayerArray[1].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p2 points > house BUT < 22
        else if (multiPlayerArray[2].Bust === false && multiPlayerArray[2].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p3 points > house BUT < 22
        else if (multiPlayerArray[3].Bust === false && multiPlayerArray[3].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p4 points > house BUT < 22
        else if (multiPlayerArray[4].Bust === false && multiPlayerArray[4].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p5 points > house BUT < 22
        else if (multiPlayerArray[5].Bust === false && multiPlayerArray[5].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // player 1 tied && points < 17
        else if (multiPlayerArray[1].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 2 tied && points < 17
        else if (multiPlayerArray[2].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 3 tied && points < 17
        else if (multiPlayerArray[3].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 4 tied && points < 17
        else if (multiPlayerArray[4].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 5 tied && points < 17
        else if (multiPlayerArray[5].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // stand //
        else {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }

    }

    // when all 6 players are standing ... //
    else if (multiPlayerArray.length === 7) {
        // house will stand if ... //
        // house 17+ points
        if (multiPlayerArray[0].Points >= 17) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
        // all players bust
        else if (multiPlayerArray[1].Bust === true && multiPlayerArray[2].Bust === true) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
        // all players points < house 
        else if (multiPlayerArray[1].Points < multiPlayerArray[0].Points && multiPlayerArray[2].Points < multiPlayerArray[0].Points) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
        // house will hit if ... //
        // p1 points > house BUT < 22
        else if (multiPlayerArray[1].Bust === false && multiPlayerArray[1].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p2 points > house BUT < 22
        else if (multiPlayerArray[2].Bust === false && multiPlayerArray[2].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p3 points > house BUT < 22
        else if (multiPlayerArray[3].Bust === false && multiPlayerArray[3].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p4 points > house BUT < 22
        else if (multiPlayerArray[4].Bust === false && multiPlayerArray[4].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p5 points > house BUT < 22
        else if (multiPlayerArray[5].Bust === false && multiPlayerArray[5].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p6 points > house BUT < 22
        else if (multiPlayerArray[6].Bust === false && multiPlayerArray[6].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // player 1 tied && points < 17
        else if (multiPlayerArray[1].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 2 tied && points < 17
        else if (multiPlayerArray[2].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 3 tied && points < 17
        else if (multiPlayerArray[3].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 4 tied && points < 17
        else if (multiPlayerArray[4].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 5 tied && points < 17
        else if (multiPlayerArray[5].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 6 tied && points < 17
        else if (multiPlayerArray[6].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // stand //
        else {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
    }

    // when all 7 players are standing ... //
    else if (multiPlayerArray.length === 8) {
        // house will stand if ... //
        // house 17+ points
        if (multiPlayerArray[0].Points >= 17) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
        // all players bust
        else if (multiPlayerArray[1].Bust === true && multiPlayerArray[2].Bust === true) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
        // all players points < house 
        else if (multiPlayerArray[1].Points < multiPlayerArray[0].Points && multiPlayerArray[2].Points < multiPlayerArray[0].Points) {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            // endRound();
        }
        // house will hit if ... //
        // p1 points > house BUT < 22
        else if (multiPlayerArray[1].Bust === false && multiPlayerArray[1].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p2 points > house BUT < 22
        else if (multiPlayerArray[2].Bust === false && multiPlayerArray[2].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p3 points > house BUT < 22
        else if (multiPlayerArray[3].Bust === false && multiPlayerArray[3].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p4 points > house BUT < 22
        else if (multiPlayerArray[4].Bust === false && multiPlayerArray[4].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p5 points > house BUT < 22
        else if (multiPlayerArray[5].Bust === false && multiPlayerArray[5].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p6 points > house BUT < 22
        else if (multiPlayerArray[6].Bust === false && multiPlayerArray[6].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // p7 points > house BUT < 22
        else if (multiPlayerArray[7].Bust === false && multiPlayerArray[7].Points > multiPlayerArray[0].Points) {
            console.log("house will hit");
            houseHit();
        }
        // player 1 tied && points < 17
        else if (multiPlayerArray[1].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 2 tied && points < 17
        else if (multiPlayerArray[2].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 3 tied && points < 17
        else if (multiPlayerArray[3].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 4 tied && points < 17
        else if (multiPlayerArray[4].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 5 tied && points < 17
        else if (multiPlayerArray[5].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 6 tied && points < 17
        else if (multiPlayerArray[6].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // player 7 tied && points < 17
        else if (multiPlayerArray[7].Points === multiPlayerArray[0].Points && multiPlayerArray[0].Points < 17) {
            console.log("house will hit");
            houseHit();
        }
        // stand //
        else {
            multiPlayerArray[0].Stand = true;
            console.log("we will run end round");
            endRound();
        }
    }
}

function houseHit() {
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
        var originalHand = multiPlayerArray[0].Hand;
        // this pushes the new card into the array of cards
        originalHand.push(hitCard);
        // then, the image is created and appended to the hand div with the other cards //

        var houseHitCard = document.querySelector("#houseHand");
        var hitCardImg = document.createElement('img');
        hitCardImg.className = ('hitCard' + multiPlayerArray[0].Name)
        hitCardImg.src = (hitCard.imgUrl)
        houseHitCard.appendChild(hitCardImg);

        // resets value of hand to zero //
        var handVal = 0;
        // resets players points //
        multiPlayerArray[0].Points = 0;
        for (var j = 0; j < (multiPlayerArray[0].Hand).length; j++) {
            // sets values for face cards //
            if (multiPlayerArray[0].Hand[j].value === "JACK" || multiPlayerArray[0].Hand[j].value === "QUEEN" || multiPlayerArray[0].Hand[j].value === "KING") {
                multiPlayerArray[0].Hand[j].value = "10";
            }
            // sets value for ace depending on previous hand value //
            else if (multiPlayerArray[0].Hand[j].value === "ACE" && handVal < 11) {
                multiPlayerArray[0].Hand[j].value = "11";
            } else if (multiPlayerArray[0].Hand[j].value === "ACE" && handVal > 10) {
                multiPlayerArray[0].Hand[j].value = "1";
            }
            // adds all cards in hand to create new value //
            handVal += parseInt(multiPlayerArray[0].Hand[j].value);
        }
        // sets the points equal to the new value //
        multiPlayerArray[0].Points = handVal;
        // resets handVal back to zero //
        handVal = 0;
        // clears points on html & recreates the elements to display the new points //
        var housePointsDiv = document.querySelector("#housePoints");
        housePointsDiv.innerHTML = `Points: ${multiPlayerArray[0].Points} `;

        //timeout function to give html time to append card and points before running bust function //
        setTimeout(function () {
            // if the hit card makes the points go over 21 the house will get a bust alert and the game will end //
            houseBust()
        }, 500);
    })
}

function houseBust() {
    if (multiPlayerArray[0].Points > 21) {
        console.log("inside the bust function")
        // sets bst property to true //
        multiPlayerArray[0].Bust = true;
        multiPlayerArray[0].Stand = true;
        //sends user alert //
        // alert("the house busted");
        // calls function //
        setTimeout(function () {
            endRound();
        }, 500);
    }
    else if (multiPlayerArray[0].Points < 22) {
        houseLogic();
    }
    else {
        console.log(`something fell through the cracks ... check it out`)
    }
}


// when this function is called the game is ended //
function endRound() {
    console.log("======ending round========");
    alert(`round over`);

    if (multiPlayerArray.length === 3) {
        // display all players points to user //
        alert(`end of round point values:
        ${multiPlayerArray[0].Name} has ${multiPlayerArray[0].Points} points
        ${multiPlayerArray[1].Name} has ${multiPlayerArray[1].Points} points
        ${multiPlayerArray[2].Name} has ${multiPlayerArray[2].Points} points`)

        // if all players bust -> no one wins
        if (multiPlayerArray[0].Bust === true && multiPlayerArray[1].Bust === true && multiPlayerArray[2].Bust === true) {
            alert("talk about the odds... all players have busted")
        }
        // if no one busts 
        else if (multiPlayerArray[0].Bust === false && multiPlayerArray[1].Bust === false && multiPlayerArray[2].Bust === false) {
            // if they all tie
            if (multiPlayerArray[0].Points === multiPlayerArray[1].Points && multiPlayerArray[1].Points === multiPlayerArray[2].Points) {
                alert("talk about the odds... all players have tied");
            }
            // if h > p1 & h > p2 -> h wins
            else if (multiPlayerArray[0].Points > multiPlayerArray[1].Points && multiPlayerArray[0].Points > multiPlayerArray[2].Points) {
                multiPlayerArray[0].Score = multiPlayerArray[0].Score + 1;
                alert("House wins");
            }
            // if p1 > h & p1 > p2 -> p1 wins
            else if (multiPlayerArray[1].Points > multiPlayerArray[0].Points && multiPlayerArray[1].Points > multiPlayerArray[2].Points) {
                multiPlayerArray[1].Score = multiPlayerArray[1].Score + 1;
                alert("Player1 wins");
            }
            // if p2 > h & p2 > p1 -> p2 wins
            else if (multiPlayerArray[2].Points > multiPlayerArray[0].Points && multiPlayerArray[2].Points > multiPlayerArray[1].Points) {
                multiPlayerArray[2].Score = multiPlayerArray[2].Score + 1;
                alert("Player2 wins");
            }
            // if h = p1 & > p2 -> h & p1 tie
            else if (multiPlayerArray[0].Points === multiPlayerArray[1].Points && multiPlayerArray[0].Points > multiPlayerArray[2].Points) {
                alert("House and Player1 tie, there is no winner");
            }
            // -> h & p2 tie
            else if (multiPlayerArray[0].Points === multiPlayerArray[2].Points && multiPlayerArray[0].Points > multiPlayerArray[1].Points) {
                alert("House and Player2 tie, there is no winner");
            }
            // p1 & p2 tie
            else if (multiPlayerArray[1].Points === multiPlayerArray[2].Points && multiPlayerArray[1].Points > multiPlayerArray[0].Points) {
                alert("Player1 and Player2 tie, there is no winner");
            }
            else {
                console.log("something has gone wrong... check it out")
            }
        }
        // if one player busts
        // if house busts
        else if (multiPlayerArray[0].Bust === true) {
            // if p1 > p2 -> p1 wins
            if (multiPlayerArray[1].Points > multiPlayerArray[2].Points) {
                multiPlayerArray[1].Score = multiPlayerArray[1].Score + 1;
                alert("Player1 wins");
            }
            // if p1 < p2 -> p2 wins
            else if (multiPlayerArray[1].Points < multiPlayerArray[2].Points) {
                multiPlayerArray[2].Score = multiPlayerArray[2].Score + 1;
                alert("Player2 wins");
            }
            else {
                console.log("something has gone wrong... check it out")
            }
        }
        //if p1 busts
        else if (multiPlayerArray[1].Bust === true) {
            // h wins
            if (multiPlayerArray[0].Points > multiPlayerArray[2].Points) {
                multiPlayerArray[0].Score = multiPlayerArray[0].Score + 1;
                alert("House wins");
            }
            // p2 wins
            else if (multiPlayerArray[2].Points > multiPlayerArray[0].Points) {
                multiPlayerArray[2].Score = multiPlayerArray[2].Score + 1;
                alert("Player2 wins");
            }
            else {
                console.log("something has gone wrong... check it out")
            }
        }
        //if p2 busts
        else if (multiPlayerArray[2].Bust === true) {
            // house wins
            if (multiPlayerArray[0].Points > multiPlayerArray[1].Points) {
                multiPlayerArray[0].Score = multiPlayerArray[0].Score + 1;
                alert("House wins");
            }
            // p1 wins
            else if (multiPlayerArray[0].Points < multiPlayerArray[1].Points) {
                multiPlayerArray[1].Score = multiPlayerArray[1].Score + 1;
                alert("Player1 wins");
            }
            else {
                console.log("something has gone wrong... check it out")
            }
        }
        // if two players bust 
        //if house and p1 bust -> p2 win
        else if (multiPlayerArray[0].Bust === true && multiPlayerArray[1].Bust === true) {
            multiPlayerArray[2].Score = multiPlayerArray[2].Score + 1;
            alert("Player2 wins");
        }
        // if house and p2 bust -> p1 win
        else if (multiPlayerArray[0].Bust === true && multiPlayerArray[2].Bust === true) {
            multiPlayerArray[1].Score = multiPlayerArray[1].Score + 1;
            alert("Player1 wins");
        }
        // if p1 and p2 bust -> house win
        else if (multiPlayerArray[1].Bust === true && multiPlayerArray[2].Bust === true) {
            multiPlayerArray[0].Score = multiPlayerArray[0].Score + 1;
            alert("House wins");
        }
        else {
            console.log("something has gone wrong... check it out")
        }

        // alert users of all current scores //
        alert(`end of round updated scores:
        ${multiPlayerArray[0].Name}: ${multiPlayerArray[0].Score}
        ${multiPlayerArray[1].Name}: ${multiPlayerArray[1].Score}
        ${multiPlayerArray[2].Name}: ${multiPlayerArray[2].Score}`);

        // update scores on html //
        houseScore = document.getElementById("houseScore");
        scoreP1 = document.getElementById("scorePlayer1");
        scoreP2 = document.getElementById("scorePlayer2");
        houseScore.innerHTML = `Score: ${multiPlayerArray[0].Score} `;
        scoreP1.innerHTML = `Score: ${multiPlayerArray[1].Score} `;
        scoreP2.innerHTML = `Score: ${multiPlayerArray[2].Score} `;

        // hides all game buttons besides and changes the value to ask user if they want to play another game //
        var hitBtnP1 = document.getElementById("hitPlayer1");
        hitBtnP1.style.display = 'block';
        var standBtnP1 = document.getElementById("standPlayer1");
        standBtnP1.style.display = 'block';
        var restartBtnP1 = document.getElementById("restartPlayer1");
        restartBtnP1.value = 'play another round';

        var hitBtnP2 = document.getElementById("hitPlayer2");
        hitBtnP2.style.display = 'block';
        var standBtnP2 = document.getElementById("standPlayer2");
        standBtnP2.style.display = 'block';
        var restartBtnP2 = document.getElementById("restartPlayer2");
        restartBtnP2.value = 'play another round';

        // reset player values //
        multiPlayerArray[0].Bust = false;
        multiPlayerArray[1].Bust = false;
        multiPlayerArray[2].Bust = false;

        multiPlayerArray[0].Stand = false;
        multiPlayerArray[1].Stand = false;
        multiPlayerArray[2].Stand = false;

        console.log(multiPlayerArray);
        console.log("=========================")

    }
    else if (multiPlayerArray.length === 4) {
            // USE THE FOLLOWING CODE AS A SKELETON TO BUILD EACH END ROUND LOGIC // for 3 player
    // display all players points to user //
    alert(`end of round point values:
    ${multiPlayerArray[0].Name} has ${multiPlayerArray[0].Points} points
    ${multiPlayerArray[1].Name} has ${multiPlayerArray[1].Points} points
    ${multiPlayerArray[2].Name} has ${multiPlayerArray[2].Points} points
    ${multiPlayerArray[3].Name} has ${multiPlayerArray[3].Points} points`)

    // if all players bust -> no one wins
    if (multiPlayerArray[0].Bust === true && multiPlayerArray[1].Bust === true && multiPlayerArray[2].Bust === true) {
        alert("talk about the odds... all players have busted")
    }
    // if no one busts 
    else if (multiPlayerArray[0].Bust === false && multiPlayerArray[1].Bust === false && multiPlayerArray[2].Bust === false && multiPlayerArray[3].Bust === false) {
        // if they all tie
        if (multiPlayerArray[0].Points === multiPlayerArray[1].Points && multiPlayerArray[1].Points === multiPlayerArray[2].Points && multiPlayerArray[2].Points === multiPlayerArray[3].Points) {
            alert("talk about the odds... all players have tied");
        }
        //winners based off everyone else being less than:
        // h wins
        else if (multiPlayerArray[0].Points > multiPlayerArray[1].Points && multiPlayerArray[0].Points > multiPlayerArray[2].Points && multiPlayerArray[0].Points > multiPlayerArray[3].Points) {
            multiPlayerArray[0].Score = multiPlayerArray[0].Score + 1;
            alert("House wins");
        }
        // p1 wins
        else if (multiPlayerArray[1].Points > multiPlayerArray[0].Points && multiPlayerArray[1].Points > multiPlayerArray[2].Points && multiPlayerArray[1].Points > multiPlayerArray[3].Points) {
            multiPlayerArray[1].Score = multiPlayerArray[1].Score + 1;
            alert("Player1 wins");
        }
         // p2 wins
        else if (multiPlayerArray[2].Points > multiPlayerArray[0].Points && multiPlayerArray[2].Points > multiPlayerArray[1].Points && multiPlayerArray[2].Points > multiPlayerArray[3].Points) {
            multiPlayerArray[2].Score = multiPlayerArray[2].Score + 1;
            alert("Player2 wins");
        }
         // p3 wins
        else if (multiPlayerArray[3].Points > multiPlayerArray[0].Points && multiPlayerArray[3].Points > multiPlayerArray[1].Points && multiPlayerArray[3].Points > multiPlayerArray[2].Points) {
            multiPlayerArray[3].Score = multiPlayerArray[3].Score + 1;
            alert("Player3 wins");
        }
        // if 3 players tie & there is no winner //
        // h p1 p2 *
        else if ( multiPlayerArray[0].Points === multiPlayerArray[1] && multiPlayerArray[1] === multiPlayerArray[2] && multiPlayerArray[2] > multiPlayerArray[3]) {
            alert("House, Player1, and Player2 tie, there is no winner");
        }
        // h p1 p3 *
        else if ( multiPlayerArray[0].Points === multiPlayerArray[1] && multiPlayerArray[1] === multiPlayerArray[3] && multiPlayerArray[3] > multiPlayerArray[2]) {
            alert("House, Player1, and Player3 tie, there is no winner");
        }
        // p1 p2 p3 *
        else if ( multiPlayerArray[1].Points === multiPlayerArray[2] && multiPlayerArray[2] === multiPlayerArray[3] && multiPlayerArray[3] > multiPlayerArray[0]) {
            alert("Player1, Player2, and Player3 tie, there is no winner");
        }
        // h p2 p3 *
        else if ( multiPlayerArray[0].Points === multiPlayerArray[2] && multiPlayerArray[2] === multiPlayerArray[3] && multiPlayerArray[3] > multiPlayerArray[1]) {
            alert("House, Player2, and Player3 tie, there is no winner");
        }
        // if 2 players tie
        // h & p1 tie
        else if (multiPlayerArray[0].Points === multiPlayerArray[1].Points && multiPlayerArray[0].Points > multiPlayerArray[2].Points && multiPlayerArray[0].Points > multiPlayerArray[3].Points) {
            alert("House and Player1 tie, there is no winner");
        }
        // h & p2 tie
        else if (multiPlayerArray[0].Points === multiPlayerArray[2].Points && multiPlayerArray[0].Points > multiPlayerArray[1].Points && multiPlayerArray[0].Points > multiPlayerArray[3].Points) {
            alert("House and Player2 tie, there is no winner");
        }
        // p1 & p2 tie
        else if (multiPlayerArray[1].Points === multiPlayerArray[2].Points && multiPlayerArray[1].Points > multiPlayerArray[0].Points && multiPlayerArray[1].Points > multiPlayerArray[3].Points) {
            alert("Player1 and Player2 tie, there is no winner");
        }
        // h & p3 tie *
        else if (multiPlayerArray[0].Points === multiPlayerArray[3].Points && multiPlayerArray[3].Points > multiPlayerArray[1].Points && multiPlayerArray[3].Points > multiPlayerArray[2].Points) {
            alert("House and Player3 tie, there is no winner");
        }
        //p1 & p3 tie *
        else if (multiPlayerArray[1].Points === multiPlayerArray[3].Points && multiPlayerArray[3].Points > multiPlayerArray[0].Points && multiPlayerArray[3].Points > multiPlayerArray[2].Points) {
            alert("Player1 and Player3 tie, there is no winner");
        }
        // p2 and p3 tie *
        else if (multiPlayerArray[2].Points === multiPlayerArray[3].Points && multiPlayerArray[3].Points > multiPlayerArray[0].Points && multiPlayerArray[3].Points > multiPlayerArray[1].Points) {
            alert("Player2 and Player3 tie, there is no winner");
        }
        else {
            console.log("something has gone wrong... check it out")
        }
    }
    // if one player busts
    // if house busts
    else if (multiPlayerArray[0].Bust === true) {
        //  p1 wins
        if (multiPlayerArray[1].Points > multiPlayerArray[2].Points && multiPlayerArray[1].Points > multiPlayerArray[3].Points) {
            multiPlayerArray[1].Score = multiPlayerArray[1].Score + 1;
            alert("Player1 wins");
        }
        // p2 wins
        else if (multiPlayerArray[1].Points < multiPlayerArray[2].Points && multiPlayerArray[3].Points < multiPlayerArray[2].Points) {
            multiPlayerArray[2].Score = multiPlayerArray[2].Score + 1;
            alert("Player2 wins");
        }
        // p3 wins
        else if (multiPlayerArray[1].Points < multiPlayerArray[3].Points && multiPlayerArray[2].Points < multiPlayerArray[3].Points) {
            multiPlayerArray[3].Score = multiPlayerArray[3].Score + 1;
            alert("Player3 wins");
        }
        else {
            console.log("something has gone wrong... check it out")
        }
    }
    //if p1 busts
    else if (multiPlayerArray[1].Bust === true) {
        // h wins
        if (multiPlayerArray[0].Points > multiPlayerArray[2].Points && multiPlayerArray[0].Points > multiPlayerArray[3].Points) {
            multiPlayerArray[0].Score = multiPlayerArray[0].Score + 1;
            alert("House wins");
        }
        // p2 wins
        else if (multiPlayerArray[2].Points > multiPlayerArray[0].Points && multiPlayerArray[2].Points > multiPlayerArray[3].Points) {
            multiPlayerArray[2].Score = multiPlayerArray[2].Score + 1;
            alert("Player2 wins");
        }
        // p3 wins
        else if (multiPlayerArray[3].Points > multiPlayerArray[0].Points && multiPlayerArray[3].Points > multiPlayerArray[2].Points) {
            multiPlayerArray[3].Score = multiPlayerArray[3].Score + 1;
            alert("Player3 wins");
        }
        else {
            console.log("something has gone wrong... check it out")
        }
    }
    //if p2 busts
    else if (multiPlayerArray[2].Bust === true) {
        // house wins
        if (multiPlayerArray[0].Points > multiPlayerArray[1].Points && multiPlayerArray[0].Points > multiPlayerArray[3].Points) {
            multiPlayerArray[0].Score = multiPlayerArray[0].Score + 1;
            alert("House wins");
        }
        // p1 wins
        else if (multiPlayerArray[0].Points < multiPlayerArray[1].Points && multiPlayerArray[1].Points > multiPlayerArray[3].Points) {
            multiPlayerArray[1].Score = multiPlayerArray[1].Score + 1;
            alert("Player1 wins");
        }
        // p3 wins
        else if (multiPlayerArray[0].Points < multiPlayerArray[3].Points && multiPlayerArray[3].Points > multiPlayerArray[1].Points) {
            multiPlayerArray[3].Score = multiPlayerArray[3].Score + 1;
            alert("Player3 wins");
        }
        else {
            console.log("something has gone wrong... check it out")
        }
    }
    //if p3 busts
    else if (multiPlayerArray[3].Bust === true) {
        // house wins
        if (multiPlayerArray[0].Points > multiPlayerArray[1].Points && multiPlayerArray[0].Points > multiPlayerArray[2].Points) {
            multiPlayerArray[0].Score = multiPlayerArray[0].Score + 1;
            alert("House wins");
        }
        // p1 wins
        else if (multiPlayerArray[0].Points < multiPlayerArray[1].Points && multiPlayerArray[1].Points > multiPlayerArray[2].Points) {
            multiPlayerArray[1].Score = multiPlayerArray[1].Score + 1;
            alert("Player1 wins");
        }
        // p2 wins
        else if (multiPlayerArray[0].Points < multiPlayerArray[2].Points && multiPlayerArray[2].Points > multiPlayerArray[1].Points) {
            multiPlayerArray[2].Score = multiPlayerArray[2].Score + 1;
            alert("Player2 wins");
        }
        else {
            console.log("something has gone wrong... check it out")
        }
    }

    // if two players bust 
    //if house and p1 bust -> p2 win
    else if (multiPlayerArray[0].Bust === true && multiPlayerArray[1].Bust === true) {
        // p2 wins
        if (multiPlayerArray[2].Points > multiPlayerArray[3].Points) {
            multiPlayerArray[2].Score = multiPlayerArray[2].Score + 1;
        alert("Player2 wins");
        }
        // p3 wins
        else if (multiPlayerArray[3].Points > multiPlayerArray[2].Points) {
            multiPlayerArray[3].Score = multiPlayerArray[3].Score + 1;
            alert("Player3 wins");
        }
        else {
            console.log("something has gone wrong... check it out")
        }
    }
    // if house and p2 bust 
    else if (multiPlayerArray[0].Bust === true && multiPlayerArray[2].Bust === true) {
        // p1 wins
        if (multiPlayerArray[1].Points > multiPlayerArray[3].Points) {
            multiPlayerArray[1].Score = multiPlayerArray[1].Score + 1;
        alert("Player1 wins");
        }
        // p3 wins
        else if (multiPlayerArray[3].Points > multiPlayerArray[1].Points) {
            multiPlayerArray[3].Score = multiPlayerArray[3].Score + 1;
            alert("Player3 wins");
        }
        else {
            console.log("something has gone wrong... check it out")
        }
    }
    // if p1 and p2 bust -> house win
    else if (multiPlayerArray[1].Bust === true && multiPlayerArray[2].Bust === true) {
        // house wins
        if (multiPlayerArray[0].Points > multiPlayerArray[3].Points) {
            multiPlayerArray[0].Score = multiPlayerArray[0].Score + 1;
        alert("House wins");
        }
        // p3 wins
        else if (multiPlayerArray[3].Points > multiPlayerArray[0].Points) {
            multiPlayerArray[3].Score = multiPlayerArray[3].Score + 1;
            alert("Player3 wins");
        }
        else {
            console.log("something has gone wrong... check it out")
        }
    }
    // if p3 & house bust*
    else if (multiPlayerArray[3].Bust === true && multiPlayerArray[0].Bust === true) {
        // p1 wins
        if (multiPlayerArray[1].Points > multiPlayerArray[2].Points) {
            multiPlayerArray[1].Score = multiPlayerArray[1].Score + 1;
        alert("Player1 wins");
        }
        // p2 wins
        else if (multiPlayerArray[2].Points > multiPlayerArray[1].Points) {
            multiPlayerArray[2].Score = multiPlayerArray[2].Score + 1;
            alert("Player2 wins");
        }
        else {
            console.log("something has gone wrong... check it out")
        }
    }
    // if p3 & p1 bust *
    else if (multiPlayerArray[3].Bust === true && multiPlayerArray[1].Bust === true) {
        // h wins
        if (multiPlayerArray[0].Points > multiPlayerArray[2].Points) {
            multiPlayerArray[0].Score = multiPlayerArray[0].Score + 1;
        alert("House wins");
        }
        // p2 wins
        else if (multiPlayerArray[2].Points > multiPlayerArray[0].Points) {
            multiPlayerArray[2].Score = multiPlayerArray[2].Score + 1;
            alert("Player2 wins");
        }
        else {
            console.log("something has gone wrong... check it out")
        }
    }
    // if p3 & p2 bust *
    else if (multiPlayerArray[3].Bust === true && multiPlayerArray[2].Bust === true) {
        // h wins
        if (multiPlayerArray[0].Points > multiPlayerArray[1].Points) {
            multiPlayerArray[0].Score = multiPlayerArray[0].Score + 1;
        alert("House wins");
        }
        // p1 wins
        else if (multiPlayerArray[1].Points > multiPlayerArray[0].Points) {
            multiPlayerArray[1].Score = multiPlayerArray[1].Score + 1;
            alert("Player1 wins");
        }
        else {
            console.log("something has gone wrong... check it out")
        }
    }
    // if three players bust 
    // if h, p1, p2 bust 
    else if (multiPlayerArray[0].Bust === true && multiPlayerArray[1].Bust === true && multiPlayerArray[2].Bust === true) {
        multiPlayerArray[3].Score = multiPlayerArray[3].Score + 1;
        alert("Player3 wins");
    }
    // if h, p1, p3 bust 
    else if (multiPlayerArray[0].Bust === true && multiPlayerArray[1].Bust === true && multiPlayerArray[3].Bust === true) {
        multiPlayerArray[2].Score = multiPlayerArray[2].Score + 1;
        alert("Player2 wins");
    }
    // if h, p2, p3 bust 
    else if (multiPlayerArray[0].Bust === true && multiPlayerArray[2].Bust === true && multiPlayerArray[3].Bust === true) {
        multiPlayerArray[1].Score = multiPlayerArray[1].Score + 1;
        alert("Player1 wins");
    }
    // if p1, p2, p3 bust 
    else if (multiPlayerArray[1].Bust === true && multiPlayerArray[2].Bust === true && multiPlayerArray[3].Bust === true) {
        multiPlayerArray[0].Score = multiPlayerArray[0].Score + 1;
        alert("Player0 wins");
    }
    else {
        console.log("something has gone wrong... check it out")
    }

    // alert users of all current scores //
    alert(`end of round updated scores:
    ${multiPlayerArray[0].Name}: ${multiPlayerArray[0].Score}
    ${multiPlayerArray[1].Name}: ${multiPlayerArray[1].Score}
    ${multiPlayerArray[2].Name}: ${multiPlayerArray[2].Score}
    ${multiPlayerArray[3].Name}: ${multiPlayerArray[3].Score}`);

    // update scores on html //
    houseScore = document.getElementById("houseScore");
    scoreP1 = document.getElementById("scorePlayer1");
    scoreP2 = document.getElementById("scorePlayer2");
    scoreP3 = document.getElementById("scorePlayer3");
    
    houseScore.innerHTML = `Score: ${multiPlayerArray[0].Score} `;
    scoreP1.innerHTML = `Score: ${multiPlayerArray[1].Score} `;
    scoreP2.innerHTML = `Score: ${multiPlayerArray[2].Score} `;
    scoreP3.innerHTML = `Score: ${multiPlayerArray[3].Score} `;

    // hides all game buttons besides and changes the value to ask user if they want to play another game //
    var hitBtnP1 = document.getElementById("hitPlayer1");
    hitBtnP1.style.display = 'block';
    var standBtnP1 = document.getElementById("standPlayer1");
    standBtnP1.style.display = 'block';
    var restartBtnP1 = document.getElementById("restartPlayer1");
    restartBtnP1.value = 'play another round';

    var hitBtnP2 = document.getElementById("hitPlayer2");
    hitBtnP2.style.display = 'block';
    var standBtnP2 = document.getElementById("standPlayer2");
    standBtnP2.style.display = 'block';
    var restartBtnP2 = document.getElementById("restartPlayer2");
    restartBtnP2.value = 'play another round';

    var hitBtnP3 = document.getElementById("hitPlayer3");
    hitBtnP3.style.display = 'block';
    var standBtnP3 = document.getElementById("standPlayer3");
    standBtnP3.style.display = 'block';
    var restartBtnP3 = document.getElementById("restartPlayer3");
    restartBtnP3.value = 'play another round';

    // reset player values //
    multiPlayerArray[0].Bust = false;
    multiPlayerArray[1].Bust = false;
    multiPlayerArray[2].Bust = false;
    multiPlayerArray[3].Bust = false;

    multiPlayerArray[0].Stand = false;
    multiPlayerArray[1].Stand = false;
    multiPlayerArray[2].Stand = false;
    multiPlayerArray[3].Stand = false;

    console.log(multiPlayerArray);
    console.log("=========================")
    // dont forget to uncomment the end round functions

    }
    else if (multiPlayerArray.length === 5) {


    }
    else if (multiPlayerArray.length === 6) {


    }
    else if (multiPlayerArray.length === 7) {


    }
    else if (multiPlayerArray.length === 8) {


    }
    else {
        console.log("something has gone wrong... check it out")
    }
}

// /////////////////////////////////////////////////////// //

//     // USE THE FOLLOWING CODE AS A SKELETON TO BUILD EACH END ROUND LOGIC // for 4 players
//     // display all players points to user //
//     alert(`end of round point values:
//     ${multiPlayerArray[0].Name} has ${multiPlayerArray[0].Points} points
//     ${multiPlayerArray[1].Name} has ${multiPlayerArray[1].Points} points
//     ${multiPlayerArray[2].Name} has ${multiPlayerArray[2].Points} points
//     ${multiPlayerArray[3].Name} has ${multiPlayerArray[3].Points} points
//     ${multiPlayerArray[4].Name} has ${multiPlayerArray[4].Points} points`)

//         // if all players bust -> no one wins
//     // if no one busts 
//         // if they all tie -

//         //winners based off everyone else being less than:
//         // h wins
//         // p1 wins
//         // p2 wins
//         // p3 wins
//         // p4 wins *

//         //if 4 tie **
//             // h 1 2 3
//             // h 1 2 4
//             // h 2 3 4

//         //if 3 tie
//             // h p1 p2 
//             // h p1 p3 
//             // p1 p2 p3 
//             // h p2 p3 
//             // 4 3 2 *
//             // 4 3 1 *
//             // 4 3 h *
//             // 4 2 1 *
//             // 4 2 h *

//         // if 2 tie
//             // h & p1 tie
//             // h & p2 tie 
//             // p1 & p2 tie
//             // h & p3 tie 
//             //p1 & p3 tie 
//             // p2 and p3 tie 
//             // 4 3 *
//             // 4 2 *
//             // 4 1 *
//             // 4 h *

//     // if one player busts
//         // if house busts
//             // if p1 > p2 -> p1 wins
//             // if p1 < p2 -> p2 wins
//             // if p3> p1 & p3 > p2 = p3 wins 
//             // p4 *
//         //if p1 busts
//             // h wins 
//             // p2 wins
//             // p3 wins 
//             // p4 *
//         //if p2 busts
//             // house wins 
//             // p1 wins 
//             // p3 wins 
//             // p4*
//         //p3 busts 
//             // h wins 
//             // p1 wins 
//             // p2 wins 
//             // p4 *
//         // p4 busts **
//             //h
//             // 1
//             // 2
//             // 3


//     // if two players bust
//         //if house and p1 bust
//             //p2 win 
//             //p3 win 
//             // p4 *
//         // if house and p2 bust 
//             // p1 win 
//             // p3 win 
//             // p4 *
//         // if p1 and p2 bust
//             // house win 
//             // p3 win 
//             // p4 *
//         // if p3 & house bust
//             // p1 win 
//             // p2 win 
//             // p4 *
//         // if p3 & p1 bust 
//             // h win 
//             // p2 win 
//             // p4 *
//         // if p3 & p2 bust 
//             //if h win 
//             // if p1 win 
//             // p4 *
//         // if 4 3 **
//             // h
//             // 1
//             // 2
//         // if 4 2 **
//             // 3
//             //1
//             // h
//         // if 4 1 **    
//             //3
//             //2
//             //h
//         // if 4 h **
//             //3
//             //2
//             //1

//     // if three players bust 
//         // if h, p1, p2 bust 
//             //p3 wins
//             //p4 *
//         // if h, p1, p3 bust 
//             //p2 wins
//             //p4 *
//         // if h, p2, p3 bust 
//             //p1 wins
//             //p4 *
//         // if p1, p2, p3 bust 
//             // h wins
//             //p4 *
//         // 4 3 2 **
//             // 1
//             // h
//         // 4 3 1**
//             // h
//             //2
//         // 4 3 h**
//             //1
//             //2
//         // 4 2 1**
//             //h
//             //3
//         // 4 2 h**
//             //1
//             //3

//     // if hour players bust **
//         //p4 wins
//         //p3 wins
//         // p2 wins
//         // p1 wins
//         // h wins


//     // increase winners scores by 1 //
//     // alert the winner //

//     // alert users of all current scores //
//     alert(`end of round updated scores:
//     ${multiPlayerArray[0].Name}: ${multiPlayerArray[0].Score}
//     ${multiPlayerArray[1].Name}: ${multiPlayerArray[1].Score}
//     ${multiPlayerArray[2].Name}: ${multiPlayerArray[2].Score}
//     ${multiPlayerArray[3].Name}: ${multiPlayerArray[3].Score}
//     ${multiPlayerArray[4].Name}: ${multiPlayerArray[4].Score}`);

//     // update scores on html //
//     houseScore = document.getElementById("houseScore");
//     scoreP1 = document.getElementById("scorePlayer1");
//     scoreP2 = document.getElementById("scorePlayer2");
//     scoreP3 = document.getElementById("scorePlayer3");
//     scoreP4 = document.getElementById("scorePlayer4");
    
//     houseScore.innerHTML = `Score: ${multiPlayerArray[0].Score} `;
//     scoreP1.innerHTML = `Score: ${multiPlayerArray[1].Score} `;
//     scoreP2.innerHTML = `Score: ${multiPlayerArray[2].Score} `;
//     scoreP3.innerHTML = `Score: ${multiPlayerArray[3].Score} `;
//     scoreP4.innerHTML = `Score: ${multiPlayerArray[4].Score} `;

//     // hides all game buttons besides and changes the value to ask user if they want to play another game //
//     var hitBtnP1 = document.getElementById("hitPlayer1");
//     hitBtnP1.style.display = 'block';
//     var standBtnP1 = document.getElementById("standPlayer1");
//     standBtnP1.style.display = 'block';
//     var restartBtnP1 = document.getElementById("restartPlayer1");
//     restartBtnP1.value = 'play another round';

//     var hitBtnP2 = document.getElementById("hitPlayer2");
//     hitBtnP2.style.display = 'block';
//     var standBtnP2 = document.getElementById("standPlayer2");
//     standBtnP2.style.display = 'block';
//     var restartBtnP2 = document.getElementById("restartPlayer2");
//     restartBtnP2.value = 'play another round';

//     var hitBtnP3 = document.getElementById("hitPlayer3");
//     hitBtnP3.style.display = 'block';
//     var standBtnP3 = document.getElementById("standPlayer3");
//     standBtnP3.style.display = 'block';
//     var restartBtnP3 = document.getElementById("restartPlayer3");
//     restartBtnP3.value = 'play another round';

//     var hitBtnP4 = document.getElementById("hitPlayer4");
//     hitBtnP4.style.display = 'block';
//     var standBtnP4 = document.getElementById("standPlayer4");
//     standBtnP4.style.display = 'block';
//     var restartBtnP4 = document.getElementById("restartPlayer4");
//     restartBtnP4.value = 'play another round';

//     // reset player values //
//     multiPlayerArray[0].Bust = false;
//     multiPlayerArray[1].Bust = false;
//     multiPlayerArray[2].Bust = false;
//     multiPlayerArray[3].Bust = false;
//     multiPlayerArray[4].Bust = false;

//     multiPlayerArray[0].Stand = false;
//     multiPlayerArray[1].Stand = false;
//     multiPlayerArray[2].Stand = false;
//     multiPlayerArray[3].Stand = false;
//     multiPlayerArray[4].Stand = false;

//     console.log(multiPlayerArray);
//     console.log("=========================")

//     // USE THE FOLLOWING CODE AS A SKELETON TO BUILD EACH END ROUND LOGIC // for 5 players
//     // display all players points to user //
//     alert(`end of round point values:
//     ${multiPlayerArray[0].Name} has ${multiPlayerArray[0].Points} points
//     ${multiPlayerArray[1].Name} has ${multiPlayerArray[1].Points} points
//     ${multiPlayerArray[2].Name} has ${multiPlayerArray[2].Points} points
//     ${multiPlayerArray[3].Name} has ${multiPlayerArray[3].Points} points
//     ${multiPlayerArray[4].Name} has ${multiPlayerArray[4].Points} points
//     ${multiPlayerArray[5].Name} has ${multiPlayerArray[5].Points} points`)

// // 5 player function //
//     // if all players bust -> no one wins
//     // if no one busts 
//         // if they all tie -

//         //winners based off everyone else being less than:
//         // h wins
//         // p1 wins
//         // p2 wins
//         // p3 wins
//         // p4 wins
//         // p5 wins *

//         // if 5 tie **
//         // 4 3 2 1 h
//         // 5 4 3 2 1 
//         // 5 4 3 2 h
//         // 5 4 3 1 h
//         // 5 4 2 1 h

//         //if 4 tie 
//             // h 1 2 3
//             // h 1 2 4
//             // h 2 3 4
//             // 5 4 3 2 *
//             // 5 4 3 1 *
//             // 5 4 3 h *
//             // 5 4 2 1 *
//             // 5 4 2 h *
//             // 5 3 2 1 *
//             // 5 3 2 h *
//             // 5 2 1 h *

//         //if 3 tie
//             // h p1 p2 
//             // h p1 p3 
//             // p1 p2 p3 
//             // h p2 p3 
//             // 4 3 2 
//             // 4 3 1 
//             // 4 3 h 
//             // 4 2 1 
//             // 4 2 h 
//             // **********
//             // 5 4 3
//             // 5 4 2
//             // 5 4 1
//             // 5 4 h
//             // 5 3 2
//             // 5 3 1
//             // 5 3 h
//             // 5 2 1
//             // 5 2 h
//             // 5 1 h

//         // if 2 tie
//             // h & p1 tie
//             // h & p2 tie 
//             // p1 & p2 tie
//             // h & p3 tie 
//             //p1 & p3 tie 
//             // p2 and p3 tie 
//             // 4 3 
//             // 4 2 
//             // 4 1 
//             // 4 h 
//             // **********
//             // 5 4
//             // 5 3
//             // 5 2
//             // 5 1
//             // 5 h

//     // if one player busts
//         // if house busts
//             // if p1 > p2 -> p1 wins
//             // if p1 < p2 -> p2 wins
//             // if p3> p1 & p3 > p2 = p3 wins 
//             // p4 
//             // p5
//         //if p1 busts
//             // h wins 
//             // p2 wins
//             // p3 wins 
//             // p4 
//             // p5
//         //if p2 busts
//             // house wins 
//             // p1 wins 
//             // p3 wins 
//             // p4
//             // p5
//         //p3 busts 
//             // h wins 
//             // p1 wins 
//             // p2 wins 
//             // p4 
//             //p5
//         // p4 busts 
//             //h
//             // 1
//             // 2
//             // 3
//             //5
//         // p5 busts **
//             //h
//             //1
//             //2
//             //3
//             //4


//     // if two players bust
//         //if house and p1 bust
//             //p2 win 
//             //p3 win 
//             // p4 
//             // p5 *
//         // if house and p2 bust 
//             // p1 win 
//             // p3 win 
//             // p4 
//             //p5 *
//         // if p1 and p2 bust
//             // house win 
//             // p3 win 
//             // p4 
//             //p5 *
//         // if p3 & house bust
//             // p1 win 
//             // p2 win 
//             // p4 
//             //p5 *
//         // if p3 & p1 bust 
//             // h win 
//             // p2 win 
//             // p4 
//             //p5 *
//         // if p3 & p2 bust 
//             //if h win 
//             // if p1 win 
//             // p4 
//             //p5 *
//         // if 4 3 
//             // h
//             // 1
//             // 2
//             //p5 *
//         // if 4 2 
//             // 3
//             //1
//             // h
//             //p5 *
//         // if 4 1   
//             //3
//             //2
//             //h
//             //p5 *
//         // if 4 h 
//             //3
//             //2
//             //1
//             //p5 *
//         // ******************
//         // 5 4 bust
//             // h
//             //1
//             //2
//             //3
//         // 5 3
//             //h
//             //1
//             //2
//             //4
//         // 5 2
//             //h
//             //1
//             //3
//             //4
//         // 5 1
//             //h
//             //2
//             //3
//             //4
//             //5
//         // 5 h
//             //1
//             //2
//             //3
//             //4


//     // if three players bust 
//         // if h, p1, p2 bust 
//             //p3 wins
//             //p4
//             // p5*
//         // if h, p1, p3 bust 
//             //p2 wins
//             //p4 
//             // p5*
//         // if h, p2, p3 bust 
//             //p1 wins
//             //p4 
//             // p5*
//         // if p1, p2, p3 bust 
//             // h wins
//             //p4 
//             // p5*
//         // 4 3 2 
//             // 1
//             // h
//             // p5*
//         // 4 3 1
//             // h
//             //2
//             // p5*
//         // 4 3 h
//             //1
//             //2
//             // p5*
//         // 4 2 1
//             //h
//             //3
//             // p5*
//         // 4 2 h
//             //1
//             //3
//             // p5*
//         //*******************/
//         // 5 4 3
//             //2
//             //1
//             //h
//         // 5 4 2
//             //h
//             //1
//             //3
//         // 5 4 1 
//             //h
//             //2
//             //3
//         // 5 4 h
//             //1
//             //2
//             //3
//         // 5 3 2
//             //h
//             //1
//             //4
//         // 5 3 1
//             //h
//             //2
//             //4
//         // 5 3 h
//             //1
//             //2
//             //4
//         // 5 2 1
//             //h
//             //3
//             //4
//         // 5 2 h
//             //1
//             //3
//             //4

//     // if four players bust
//         //h 1 2 3
//             //p4 wins
//             //p5 wins *
//         //h 1 2 4
//             //p3 wins
//             //p5 wins *
//         // h 1 3 4
//             //p2 wins
//             //p5 wins *
//         // h 2 3 4
//             //p1 wins
//             //p5 wins *
//         // 1 2 3 4 
//             //h wins
//             //p5 wins *
//         // ******** 
//         // 5 4 3 2
//             // h
//             //1
//         // 5 4 3 1 
//             // h
//             // 2
//         // 5 4 3 h
//             //2
//             //1
//         // 5 3 2 1
//             // h
//             //4
//         // 5 3 2 h
//             //1
//             //4
//         // 5 2 1 h
//             //3
//             //4

//      // if 5 players bust ***
//         //p5 wins
//         //p4 wins
//         //p3 wins
//         // p2 wins
//         // p1 wins
//         // h wins


//     // increase winners scores by 1 //
//     // alert the winner //

//     // alert users of all current scores //
//     alert(`end of round updated scores:
//     ${multiPlayerArray[0].Name}: ${multiPlayerArray[0].Score}
//     ${multiPlayerArray[1].Name}: ${multiPlayerArray[1].Score}
//     ${multiPlayerArray[2].Name}: ${multiPlayerArray[2].Score}
//     ${multiPlayerArray[3].Name}: ${multiPlayerArray[3].Score}
//     ${multiPlayerArray[4].Name}: ${multiPlayerArray[4].Score}
//     ${multiPlayerArray[5].Name}: ${multiPlayerArray[5].Score}`);

//     // update scores on html //
//     houseScore = document.getElementById("houseScore");
//     scoreP1 = document.getElementById("scorePlayer1");
//     scoreP2 = document.getElementById("scorePlayer2");
//     scoreP3 = document.getElementById("scorePlayer3");
//     scoreP4 = document.getElementById("scorePlayer4");
//     scoreP5 = document.getElementById("scorePlayer5");
    
//     houseScore.innerHTML = `Score: ${multiPlayerArray[0].Score} `;
//     scoreP1.innerHTML = `Score: ${multiPlayerArray[1].Score} `;
//     scoreP2.innerHTML = `Score: ${multiPlayerArray[2].Score} `;
//     scoreP3.innerHTML = `Score: ${multiPlayerArray[3].Score} `;
//     scoreP4.innerHTML = `Score: ${multiPlayerArray[4].Score} `;
//     scoreP5.innerHTML = `Score: ${multiPlayerArray[5].Score} `;

//     // hides all game buttons besides and changes the value to ask user if they want to play another game //
//     var hitBtnP1 = document.getElementById("hitPlayer1");
//     hitBtnP1.style.display = 'block';
//     var standBtnP1 = document.getElementById("standPlayer1");
//     standBtnP1.style.display = 'block';
//     var restartBtnP1 = document.getElementById("restartPlayer1");
//     restartBtnP1.value = 'play another round';

//     var hitBtnP2 = document.getElementById("hitPlayer2");
//     hitBtnP2.style.display = 'block';
//     var standBtnP2 = document.getElementById("standPlayer2");
//     standBtnP2.style.display = 'block';
//     var restartBtnP2 = document.getElementById("restartPlayer2");
//     restartBtnP2.value = 'play another round';

//     var hitBtnP3 = document.getElementById("hitPlayer3");
//     hitBtnP3.style.display = 'block';
//     var standBtnP3 = document.getElementById("standPlayer3");
//     standBtnP3.style.display = 'block';
//     var restartBtnP3 = document.getElementById("restartPlayer3");
//     restartBtnP3.value = 'play another round';

//     var hitBtnP4 = document.getElementById("hitPlayer4");
//     hitBtnP4.style.display = 'block';
//     var standBtnP4 = document.getElementById("standPlayer4");
//     standBtnP4.style.display = 'block';
//     var restartBtnP4 = document.getElementById("restartPlayer4");
//     restartBtnP4.value = 'play another round';

//     var hitBtnP5 = document.getElementById("hitPlayer5");
//     hitBtnP5.style.display = 'block';
//     var standBtnP5 = document.getElementById("standPlayer5");
//     standBtnP5.style.display = 'block';
//     var restartBtnP5 = document.getElementById("restartPlayer5");
//     restartBtnP5.value = 'play another round';

//     // reset player values //
//     multiPlayerArray[0].Bust = false;
//     multiPlayerArray[1].Bust = false;
//     multiPlayerArray[2].Bust = false;
//     multiPlayerArray[3].Bust = false;
//     multiPlayerArray[4].Bust = false;
//     multiPlayerArray[5].Bust = false;

//     multiPlayerArray[0].Stand = false;
//     multiPlayerArray[1].Stand = false;
//     multiPlayerArray[2].Stand = false;
//     multiPlayerArray[3].Stand = false;
//     multiPlayerArray[4].Stand = false;
//     multiPlayerArray[5].Stand = false;

//     console.log(multiPlayerArray);
//     console.log("=========================")
