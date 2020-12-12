// current issues //

// 1. 

// to do //

// 1. hide house cards & points from user during game. At the end of the game display cards and points //


///////////////////////////////////////////////
//                Variables                  //
///////////////////////////////////////////////
var players =  document.querySelector('#players');

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
    // the hit button is displayed //
    if (hitBtn.style.display === 'none') {
        hitBtn.style.display = 'block'
    }
    // the stand button is displayed //
    if (standBtn.style.display === 'none') {
        standBtn.style.display = 'block'
    }
    // the restart button is displayed and replaces the spot of the start button //
    if (restartBtn.style.display === 'none') {
        restartBtn.style.display = 'block'
    }
}

// currently a hard coded below but will need a more in-depth function where we use the logged in players //
// function addPlayers(amount) {
    // playerArray = [{ Name: House, ID: 0, Score: 0, Points: 0, Hand: hand }];
    //     for (var i = 1; i <= amount; i++) {
    //         var Hand = [];
    //         var player = { Name: 'Player ' + i, ID: i, Score: 0, Points: 0, Hand: hand };
    //         playerArray.push(player)
    //     }
// }

// hard coded for one player to play against the House //
function addPlayers() {
    // each 'player' object will hold their name, id, session score, points of their hand, and their hand coordinating to their object in the hand array //
    var house = { Name: 'House', ID: 0, Score: 0, Points: 0, Bust: false, Hand: hand[0], Stand: 'false' };
    var player1 = { Name: 'Player1',  ID: 1, Score: 0, Points: 0, Bust: false, Hand: hand[1], Stand: 'false' };
    // appends the objects created above to the playerArray //
    playerArray.push(house, player1);
}

// setting i to 0 so that we can control the synchronicity //
let i = 0;
function drawCards () {
    // this api link will draw 2 random cards //
    var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=2"
    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function (data) {
        // we will save the data in an array. each object will hold the cards code, suit, value, and image //
        playerHand = [
            {
                code: data.cards[ 0 ].code,
                suit: data.cards[ 0 ].suit,
                value: data.cards[ 0 ].value,
                imgUrl: data.cards[ 0 ].image
            }, {
                code: data.cards[ 1 ].code,
                suit: data.cards[ 1 ].suit,
                value: data.cards[ 1 ].value,
                imgUrl: data.cards[ 1 ].image
            }
        ];
        // this will give the drawn set of cards to whichever player is 'i' //
        playerArray[ i ].Hand = playerHand
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
    for(var i = 0; i < playerArray.length; i++) {
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
    for(var i = 0; i < playerArray.length; i++) {

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
        divPlayer.appendChild(divHand);
        divPlayer.appendChild(divPoints);
        divPlayer.appendChild(divScore);

        // appends all the data held in the player div to the gameboard
        players.appendChild(divPlayer);
    }
}

// this function will be called when the user presses restart button //
function onRestart() {
    // will clear everything on the gameboard //
    players.innerHTML = '';
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
        for(var i = 0; i < playerArray.length; i++) {
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
        // creating a timer function to give time for the card to render before busting //
        setTimeout(function () {
            // if the hit card makes the points go over 21 the user will get a bust alert and the game will end //
            itsABust();
        }, 500);
    })
    setTimeout(function () {
        hitHouseLogic();
    }, 1000);
}

function itsABust() {
    for (var i = 0; i < playerArray.length; i++) {
        if (playerArray[i].Points > 21) {
            //sends user alert //
            alert("you bust");
            // sets bst property to true //
            playerArray[i].Bust = true;
            // calls function //
            endRound();
        }
    }
}

function hitHouseLogic() {
    if (playerArray[1].Bust === true) {
        console.log("end round already called")
    }
    else if (playerArray[0].Points > playerArray[1].Points) {
        playerArray[0].Stand = true;
        console.log("else if");
        console.log(playerArray);
    }
    else {
        console.log("house needs to add a card here");
        playerArray[0].Points = 20;
        console.log(playerArray);
    }
}

// this function will be called when the user presses the stand button //
function onStand() {
    playerArray[1].Stand = true
    playerArray[0].Stand = true
    if (playerArray[0].Stand === true & playerArray[1].Stand === true) {
        endRound();
    }
    // afterStandHouseLogic();
}

// function afterStandHouseLogic() {
//     if (playerArray[0].Stand === true) {
//         endRound();
//     }
//     else if (playerArray[0].Points > playerArray[1].Points) {
//         playerArray[0].Stand = true;
//         endRound();
//     }
//     else {
//         hitHouseLogic();
//     }
// }


// when this function is called the game is ended //
function endRound() {
    // the users will get an alert that the game is over //
    alert(`round over`)
    // display points from round to user //
    for(var i = 0; i < playerArray.length; i++) {
        console.log(`${playerArray[i].Name} has ${playerArray[i].Points} points`)
        alert(`${playerArray[i].Name} has ${playerArray[i].Points} points`)
    }
    // if the players tie //
    if (playerArray[0].Points === playerArray[1].Points) {
        alert(`you tied`)
        // increase both scores by 1 //
        playerArray[0].Score = playerArray[0].Score + 1;
        playerArray[1].Score = playerArray[1].Score + 1;
        // alert the users of current scores //
        alert(`${playerArray[0].Name}: ${playerArray[0].Score} || ${playerArray[1].Name}: ${playerArray[1].Score}`)
        // update scores on html //
        divScore.innerHTML = `Score: ${playerArray[0].Score} `;
        divScore.innerHTML = `Score: ${playerArray[1].Score} `;
    } 
    // if the House wins //
    else if (playerArray[1].Bust === true || playerArray[0].Bust === false && playerArray[0].Points > playerArray[1].Points) {
        // alert users //
        alert(`${playerArray[0].Name} won || ${playerArray[1].Name} lost`)
        // increase House points by 2 //
        playerArray[0].Score = playerArray[0].Score + 2;
        // alert the users of current scores //
        alert(`${playerArray[0].Name}: ${playerArray[0].Score} || ${playerArray[1].Name}: ${playerArray[1].Score}`) 
        scoreHouse = document.querySelector("#scoreHouse");
        scoreHouse.innerHTML = `Score: ${playerArray[0].Score} `;

    }
    // if player1 wins //
    else if (playerArray[0].Bust === true || playerArray[1].Bust === false && playerArray[1].Points > playerArray[0].Points){
        // alert users //
        alert (`${playerArray[0].Name} lost || ${playerArray[1].Name} won`)
        // increase player1 points by 2 //
        playerArray[1].Score = playerArray[1].Score + 2;
        // alert the users of current scores //
        alert(`${playerArray[0].Name}: ${playerArray[0].Score} || ${playerArray[1].Name}: ${playerArray[1].Score}`)
        scorePlayer1 = document.querySelector("#scorePlayer1");
        scorePlayer1.innerHTML = `Score: ${playerArray[1].Score} `;
    }

    // hides all game buttons besides and changes the value to ask user if they want to play another game //
    if (hitBtn.style.display === 'block') {
        hitBtn.style.display = 'none'
    }
    if (standBtn.style.display === 'block') {
        standBtn.style.display = 'none'
    }
    restartBtn.value = "play another round";

    // reset player values //
    playerArray[0].Bust = false;
    playerArray[1].Bust = false;
    playerArray[0].Stand = false;
    playerArray[1].Stand = false;
}

///////////////////////////////////////////////
//                On Clicks                  //
///////////////////////////////////////////////

startBtn.addEventListener('click', onStart);
restartBtn.addEventListener('click', onRestart);
hitBtn.addEventListener('click', onHit);
standBtn.addEventListener('click', onStand);
