// THIS GAME IS CURRENTLY CODED FOR ONE PLAYER VS THE HOUSE //

//alert("directions for creative team: This is how the house logic currently works: If the user hits the House will stand if it has 17 or more points or if it has higher points than the player, otherwise the House will also hit. When the player stands the House will stand as well if it has more than 17 points or if it has higher points than the player, otherwise the House will hit until it either is above 17 points, higher than the player, or busts. Once we are creating the actual page the houses cards should have the first card up the other face down (hit cards should also be face down) and hand points should be hidden from the player until the end of the round function has ran. I am just leaving them up for building purposes.")

//alert("directions for user: Try to get as close to 21 without busting. If you want another card press 'hit' and you will be dealt another card. If you want to stay with your hand and end the game press 'stand'. You can hit as many times as you want but beware, if you bust you automatically lose. To keep playing press 'play another round'. Each round you play, your score will be displayed and will increment as you win. If you tie with the House you will be awarded 0 points. If you win you will be awarded 1 point and if the House wins it will be awarded 1 point.")
///////////////////////////////////////////////
//                Variables                  //
///////////////////////////////////////////////
var players = document.querySelector('#players');
var directions = document.querySelector('#directions');
var endRoundDiv = document.querySelector('#endRoundDiv');


var startBtn = document.querySelector('#start');
var restartBtn = document.querySelector('#restart');
var hitBtn = document.querySelector('#hit');
var standBtn = document.querySelector('#stand');
var goBackBtn = document.querySelector('#goBack');

//making global variables to be used throughout several functions//
let hand = [];
var divPlayer = null;
var divHand = null;
var divPoints = null;
var divScore = null;

var roundOver = null;
var pointDisplay = null;
var pointDisplayHousePlayer = null;
var winnerDisplay = null;
var scoresDisplay = null;
var scoresDisplayHousePlayer = null;



// hard coded for now but will use players from db
let playerArray = [];

///////////////////////////////////////////////
//                Functions                  //
///////////////////////////////////////////////

// this function will be called when the start btn is pressed //
function onStart() {
    // will call the displayBtns function //
    displayBtns();
    // will add the players hard coded in the allPlayers function to the session //
    addPlayers();
    // will draw cards for all players using the drawCards function //

    drawCards();
}

// this function is called at the start of the game //
function displayBtns() {
    // the start button is hidden //
    if (startBtn.style.display === 'block') {
        startBtn.style.display = 'none'
    }
    if (endRoundDiv.style.display === 'block') {
        endRoundDiv.style.display = 'none'
    }
    
    if (directions.style.display === 'block') {
        directions.style.display = 'none'
    }
    // the hit button is displayed //
    if (hitBtn.style.display === 'none') {
        hitBtn.style.display = 'inline'
    }
    // the stand button is displayed //
    if (standBtn.style.display === 'none') {
        standBtn.style.display = 'inline'
    }
    // the restart button is displayed and replaces the spot of the start button //
    if (restartBtn.style.display === 'none') {
        restartBtn.style.display = 'inline'
    }
}


// hard coded for one player to play against the House //
function addPlayers() {
    // each 'player' object will hold their name, id, session score, points of their hand, and their hand coordinating to their object in the hand array //
    var house = { Name: 'House', ID: 0, Score: 0, Points: 0, Bust: false, Hand: hand[0], Stand: 'false' };
    var player1 = { Name: 'Player1', ID: 1, Score: 0, Points: 0, Bust: false, Hand: hand[1], Stand: 'false' };
    // appends the objects created above to the playerArray //
    playerArray.push(house, player1);
}

// setting i to 0 so that we can control the synchronicity //
var i = 0;
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
        console.log("Debug stuff:");
        console.log(i);
        console.log(playerHand);
        console.log(playerArray);
        console.log(playerArray[i].Hand);
        playerArray[i].Hand = playerHand
        // this will increment i so that it will keep running the draw cards function for each player //
        i++
        if (i < playerArray.length) {
            drawCards()
        }
        // if there isnt any more players it will stop drawing cards and run the following functions //
        else {
            totalPoints();
            createElements();
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
    players.innerHTML = ''; // this clears the gameboard //

    // in this loop, we will create elements for each player //
    for (var i = 0; i < playerArray.length; i++) {

        // creates div where all player data will be held, displays name //
        divPlayer = document.createElement('div');
        divPlayer.className = ('player');
        divPlayer.id = playerArray[i].Name;
        divPlayer.innerHTML = (playerArray[i].Name);

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

        // creates div where the point value of the hand will be held and displayed  //
        divPoints = document.createElement('div');
        divPoints.className = ('points');
        divPoints.id = ('points' + playerArray[i].Name);
        divPoints.innerHTML = `Points: ${playerArray[i].Points} `;

        // creates div where the users session score will be held and displayed //
        divScore = document.createElement('div');
        divScore.className = ('score');
        divScore.id = ('score' + playerArray[i].Name);
        divScore.innerHTML = `Score: ${playerArray[i].Score} `;

        // appends cards to hand div //
        divHand.appendChild(cardOneImg);
        divHand.appendChild(cardTwoImg);

        // appends hand, points, and score divs to the player div //
        divPlayer.appendChild(divScore);
        divPlayer.appendChild(divHand);
        divPlayer.appendChild(divPoints);


        // appends all the data held in the player div to the gameboard
        players.appendChild(divPlayer);
    }
}

// this function will be called when the user presses restart button //
function onRestart() {
    // reset player values //
    playerArray[0].Bust = false;
    playerArray[1].Bust = false;
    playerArray[0].Stand = false;
    playerArray[1].Stand = false;
    // will clear everything on the gameboard //
    players.innerHTML = '';
    endRoundDiv.innerHTML = '';
    // reset i back to 0 for drawCards function //
    i = 0;
    // makes sure the buttons are displayed in case the round ended previously and buttons were hidden //
    displayBtns();
    // sets the restart btn text back to restart in case the round ended previously and the value said to play another round //
    restartBtn.value = "restart";
    // redraws cards for all players in session //
    drawCards();
}

// this function will be called when the user presses the hit button //
function onHit() {
    // will call player one hit function //
    playerOneHit();
    // creating a timer function to give time for the card to render before busting //
    setTimeout(function () {
        // if the hit card makes the points go over 21 the user will get a bust alert and the game will end //
        itsABust();
    }, 500);
}

// hard coded for one player // 
function playerOneHit() {
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
        hitCardImg.className = ('hitCard' + playerArray[1].Name)
        hitCardImg.src = (hitCard.imgUrl)
        divHand.appendChild(hitCardImg);

        // resets value of hand to zero //
        var handVal = 0;
        for (var i = 0; i < playerArray.length; i++) {
            // resets players points //
            playerArray[i].Points = 0;
            for (var j = 0; j < (playerArray[i].Hand).length; j++) {
                // sets values for face cards //
                if (playerArray[i].Hand[j].value === "JACK" || playerArray[i].Hand[j].value === "QUEEN" || playerArray[i].Hand[j].value === "KING") {
                    playerArray[i].Hand[j].value = "10";
                }
                // sets value for ace depending on previous hand value //
                else if (playerArray[i].Hand[j].value === "ACE" && handVal < 11) {
                    playerArray[i].Hand[j].value = "11";
                } else if (playerArray[i].Hand[j].value === "ACE" && handVal > 10) {
                    playerArray[i].Hand[j].value = "1";
                }

                // adds all cards in hand to create new value //
                handVal += parseInt(playerArray[i].Hand[j].value);
            }
            // sets the points equal to the new value //
            playerArray[i].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;

            // clears points on html & recreates the elements to display the new points //
            divPoints.innerHTML = ''
            divPoints = document.createElement('div');
            divPoints.className = ('points');
            divPoints.id = ('points' + playerArray[i].Name);
            divPoints.innerHTML = `Points: ${playerArray[i].Points} `;
            divPlayer.appendChild(divPoints);

        }
    })
}

function itsABust() {
    for (var i = 0; i < playerArray.length; i++) {
        if (playerArray[i].Points > 21) {
            //sends user alert //
            // alert("you busted");
            // sets bst property to true //
            playerArray[i].Bust = true;
            console.log(playerArray[i]);
            // calls function //
            console.log("this itsabust fcn is what is ending the round");
            endRound();
        }
    }
    // hard coded house logic //
    if (playerArray[1].Points < 22) {
        setTimeout(function () {
            hitHouseLogic();
        }, 500);
    }
}

function hitHouseLogic() {
    // house will currently stand if it has > 17 points or is higher than player points //
    if (playerArray[0].Points > playerArray[1].Points || playerArray[0].Points > 16) {
        playerArray[0].Stand = true;
    }
    else if (playerArray[0].Points < playerArray[1].Points || playerArray[0].Points === playerArray[1].Points && playerArray[0].Points < 17) {
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
            var originalHand = playerArray[0].Hand;
            // this pushes the new card into the array of cards
            originalHand.push(hitCard);
            // then, the image is created and appended to the hand div with the other cards //

            var houseHitCard = document.querySelector("#handHouse");
            var hitCardImg = document.createElement('img');
            hitCardImg.className = ('hitCard' + playerArray[0].Name)
            hitCardImg.src = (hitCard.imgUrl)
            houseHitCard.appendChild(hitCardImg);

            // resets value of hand to zero //
            var handVal = 0;
            // resets players points //
            playerArray[0].Points = 0;
            for (var j = 0; j < (playerArray[0].Hand).length; j++) {
                // sets values for face cards //
                if (playerArray[0].Hand[j].value === "JACK" || playerArray[0].Hand[j].value === "QUEEN" || playerArray[0].Hand[j].value === "KING") {
                    playerArray[0].Hand[j].value = "10";
                }
                // sets value for ace depending on previous hand value //
                else if (playerArray[0].Hand[j].value === "ACE" && handVal < 11) {
                    playerArray[0].Hand[j].value = "11";
                } else if (playerArray[0].Hand[j].value === "ACE" && handVal > 10) {
                    playerArray[0].Hand[j].value = "1";
                }
                // adds all cards in hand to create new value //
                handVal += parseInt(playerArray[0].Hand[j].value);
            }
            // sets the points equal to the new value //
            playerArray[0].Points = handVal;
            // resets handVal back to zero //
            handVal = 0;
            // clears points on html & recreates the elements to display the new points //
            var housePointsDiv = document.querySelector("#pointsHouse");
            housePointsDiv.innerHTML = `Points: ${playerArray[0].Points} `;

            //timeout function to give html time to append card and points before running bust function //
            setTimeout(function () {
                // if the hit card makes the points go over 21 the house will get a bust alert and the game will end //
                houseBust()
            }, 500);
        })
    }
    else {
        playerArray[0].Stand = true;
    }
}

function houseBust() {
    if (playerArray[0].Points > 21) {
        console.log("inside the bust function")
        //sends user alert //
        // alert("the house busted");
        // sets bst property to true //
        playerArray[0].Bust = true;
        // calls function //
        setTimeout(function () {
            endRound();
        }, 500);
    }
}

// this function will be called when the user presses the stand button //
function onStand() {
    console.log("running through stand function")
    playerArray[1].Stand = true;
    if (playerArray[0].Bust === true) {
        console.log("if busted why did it come here???")
    }
    else {
        if (playerArray[0].Points > 16 || playerArray[0].Points > playerArray[1].Points) {
            playerArray[0].Stand = true;
            console.log("house standing ends the round");
            endRound();
        }
        else {
            console.log("player1 stands // house does not - hits again")
            hitHouseLogic();
            setTimeout(function () {
                console.log(playerArray[0]);
                if (playerArray[0].Points < 22) {
                    console.log("house didnt bust - send to testing")
                    testing();
                }
                else {
                    console.log("house busted - why am i seeing in here????")
                }
            }, 1000);
        }
    }
}

function testing() {
    onStand();
}

// when this function is called the game is ended //
function endRound() {
    console.log("======ending round========")
    // the users will get an alert that the game is over //
    // display points from round to user //

    endRoundDiv.style.display = "block";
    roundOver = document.createElement("div");
    roundOver.innerHTML = `The round is over!`
    pointDisplay = document.createElement("div");
    pointDisplayHousePlayer = document.createElement("div");
    pointDisplay.innerHTML = `Hand Points:`
    pointDisplayHousePlayer.innerHTML = `${playerArray[0].Name}: ${playerArray[0].Points} || ${playerArray[1].Name}: ${playerArray[1].Points}`
    endRoundDiv.appendChild(roundOver);
    endRoundDiv.appendChild(pointDisplay);
    endRoundDiv.appendChild(pointDisplayHousePlayer);
    // alert(`The round is over
    // ${playerArray[0].Name}: ${playerArray[0].Points} points
    // ${playerArray[1].Name}: ${playerArray[1].Points} points`)
    
    // if the players tie //
    if (playerArray[0].Points === playerArray[1].Points) {
        // alert(`you tied, no one was awarded points.`)
        // // increase both scores by 1 //
        // playerArray[0].Score = playerArray[0].Score + 1;
        // playerArray[1].Score = playerArray[1].Score + 1;
        // alert the users of current scores //
        // alert(`You tied, no players scores were increased.
        // Current Scores: 
        // ${playerArray[0].Name}: ${playerArray[0].Score}
        // ${playerArray[1].Name}: ${playerArray[1].Score}`)
        winnerDisplay = document.createElement("div");
        scoresDisplay = document.createElement("div");
        scoresDisplayHousePlayer = document.createElement("div");
        winnerDisplay.innerHTML = `You tied, no players scores were increased.`
        scoresDisplay.innerHTML = `Current Scores: `
        scoresDisplayHousePlayer.innerHTML = `${playerArray[0].Name}: ${playerArray[0].Score} || ${playerArray[1].Name}: ${playerArray[1].Score}`
        endRoundDiv.appendChild(winnerDisplay);
        endRoundDiv.appendChild(scoresDisplay);
        endRoundDiv.appendChild(scoresDisplayHousePlayer);
        // // update scores on html //
        // divScore.innerHTML = `Score: ${playerArray[0].Score} `;
        // divScore.innerHTML = `Score: ${playerArray[1].Score} `;
    }
    // if the House wins //
    else if (playerArray[1].Bust === true || playerArray[1].Points > 21 || playerArray[0].Bust === false && playerArray[0].Points > playerArray[1].Points) {
        // alert users //
        // alert(`${playerArray[0].Name} won || ${playerArray[1].Name} lost`)
        // increase House points by 2 //
        playerArray[0].Score = playerArray[0].Score + 1;
        // alert the users of current scores //
        winnerDisplay = document.createElement("div");
        scoresDisplay = document.createElement("div");
        scoresDisplayHousePlayer = document.createElement("div");
        winnerDisplay.innerHTML = `House wins!`
        scoresDisplay.innerHTML = `Current Scores: `
        scoresDisplayHousePlayer.innerHTML = `${playerArray[0].Name}: ${playerArray[0].Score} || ${playerArray[1].Name}: ${playerArray[1].Score}`
        endRoundDiv.appendChild(winnerDisplay);
        endRoundDiv.appendChild(scoresDisplay);
        endRoundDiv.appendChild(scoresDisplayHousePlayer);
        // alert(`House wins
        // Current Scores: 
        // ${playerArray[0].Name}: ${playerArray[0].Score}
        // ${playerArray[1].Name}: ${playerArray[1].Score}`) 
        scoreHouse = document.querySelector("#scoreHouse");
        scoreHouse.innerHTML = `Score: ${playerArray[0].Score} `;

    }
    // if player1 wins //
    else if (playerArray[0].Bust === true || playerArray[0].Points > 21 || playerArray[1].Bust === false && playerArray[1].Points > playerArray[0].Points) {
        // alert users //
        // alert (`${playerArray[0].Name} lost || ${playerArray[1].Name} won`)
        // increase player1 points by 2 //
        playerArray[1].Score = playerArray[1].Score + 1;
        // alert the users of current scores //
        winnerDisplay = document.createElement("div");
        scoresDisplay = document.createElement("div");
        scoresDisplayHousePlayer = document.createElement("div");
        winnerDisplay.innerHTML = `Player1 wins!`
        scoresDisplay.innerHTML = `Current Scores: `
        scoresDisplayHousePlayer.innerHTML = `${playerArray[0].Name}: ${playerArray[0].Score} || ${playerArray[1].Name}: ${playerArray[1].Score}`
        endRoundDiv.appendChild(winnerDisplay);
        endRoundDiv.appendChild(scoresDisplay);
        endRoundDiv.appendChild(scoresDisplayHousePlayer);
        // alert(`Player1 wins
        // Current Scores: 
        // ${playerArray[0].Name}: ${playerArray[0].Score}
        // ${playerArray[1].Name}: ${playerArray[1].Score}`) 
        scoreHouse = document.querySelector("#scoreHouse");
        scoreHouse.innerHTML = `Score: ${playerArray[0].Score} `
        scorePlayer1 = document.querySelector("#scorePlayer1");
        scorePlayer1.innerHTML = `Score: ${playerArray[1].Score} `;
        let userStat = {
            login_id = localStorage.getItem("user"),
            display_name = "player1",
            wins = [1]
        }
        postUserStat(userStat);
    }
    console.log(playerArray);
    console.log("=========================")

    // hides all game buttons besides and changes the value to ask user if they want to play another game //
    if (hitBtn.style.display === 'inline') {
        hitBtn.style.display = 'none'
    }
    if (standBtn.style.display === 'inline') {
        standBtn.style.display = 'none'
    }
    // restartBtn.value = "play another round";

    // reset player values //
    playerArray[0].Bust = false;
    playerArray[1].Bust = false;
    playerArray[0].Stand = false;
    playerArray[1].Stand = false;
}
function postUserStat(userStat) {
    $.post("/api/user_stat", {
        login_id: userStat.login_id,
        wins: userStat.wins
    }).then(function (data) {
        $(".card-text-blackjack").text(data.wins);
    }).catch(function (err) {
        console.log(err);
    })
}
///////////////////////////////////////////////
//                On Clicks                  //
///////////////////////////////////////////////

startBtn.addEventListener('click', onStart);
restartBtn.addEventListener('click', onRestart);
hitBtn.addEventListener('click', onHit);
standBtn.addEventListener('click', onStand);
