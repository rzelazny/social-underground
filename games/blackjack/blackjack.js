///////////////////////////////////////////////
//                Variables                  //
///////////////////////////////////////////////
var players =  document.querySelector('#players');

var startBtn = document.querySelector('#start');
var restartBtn = document.querySelector('#restart');
var hitBtn = document.querySelector('#hit');
var stayBtn = document.querySelector('#stay');

// hard coded for now but will use players from db
let playerArray = [];


let hand = [];

//making a global variable to be used throughout several functions//
var divPlayer = null;
var divHand = null;
var divPoints = null;
var divScore = null;
///////////////////////////////////////////////
//                Functions                  //
///////////////////////////////////////////////

let i = 0;
function drawCards () {
    var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=2"
    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function (data) {
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
        playerArray[ i ].Hand = playerHand
        i++
        if (i < playerArray.length) {
            drawCards()
        }
        else {
            totalPoints();
            createElements();
        }
    })
}

function displayBtns() {
    if (startBtn.style.display === 'block') {
        startBtn.style.display = 'none'
    }
    if (hitBtn.style.display === 'none') {
        hitBtn.style.display = 'block'
    }
    if (stayBtn.style.display === 'none') {
        stayBtn.style.display = 'block'
    }
    if (restartBtn.style.display === 'none') {
        restartBtn.style.display = 'block'
    }
}

function createElements() {
    players.innerHTML = '';
    for(var i = 0; i < playerArray.length; i++) {

        divPlayer = document.createElement('div');
        divPlayer.className = ('player');
        divPlayer.id = playerArray[i].Name;
        divPlayer.innerHTML = (playerArray[i].Name);

        divHand = document.createElement("div");
        divHand.id = ("hand" + playerArray[i].Name);

        var cardOneImg = document.createElement('img');
        cardOneImg.id = ('cardOne' + playerArray[i].Name)
        cardOneImg.src = (playerArray[i].Hand[0].imgUrl)

        var cardTwoImg = document.createElement('img');
        cardTwoImg.id = ('cardTwo' + playerArray[i].Name)
        cardTwoImg.src = (playerArray[i].Hand[1].imgUrl)

        divPoints = document.createElement('div');
        divPoints.className = ('points');
        divPoints.id = ('points' + playerArray[i].Name);
        divPoints.innerHTML = `Points: ${playerArray[i].Points} `;

        divScore = document.createElement('div');
        divScore.className = ('score');
        divScore.id = ('score' + playerArray[i].Name);
        divScore.innerHTML = `Score: ${playerArray[i].Score} `;

        divHand.appendChild(cardOneImg);
        divHand.appendChild(cardTwoImg);
        divPlayer.appendChild(divHand);
        divPlayer.appendChild(divPoints);
        divPlayer.appendChild(divScore);
        players.appendChild(divPlayer);
    }
}

function addPlayers() {
    var house = { Name: 'House', ID: 0, Score: 0, Points: 0, Hand: hand[0] };
    var player1 = { Name: 'Player1',  ID: 1, Score: 0, Points: 0, Hand: hand[1] };
    playerArray.push(house, player1);
}

//currently a hard coded but will need a function where there are actual players
// // function addPlayers(amount) {
//     playerArray = [{ Name: House, ID: 0, Points: 0, Hand: hand }];
//     for (var i = 1; i <= amount; i++) {
//         var Hand = [];
//         var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
//         playerArray.push(player)
//     }
// }


function onStart() {
    console.log('you pressed start')
    displayBtns();
    addPlayers();
    drawCards();
}

function onRestart() {
    console.log('you pressed restart');
    players.innerHTML = '';
    i = 0;
    displayBtns();
    restartBtn.value = "restart";
    drawCards();
}

function onHit() {
    console.log('you pressed hit me');
    playerOneHit();
}

// hard coded for one player // 
function playerOneHit() {
    var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=1"
    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function (data) {
        hitCard = {
                code: data.cards[0].code,
                suit: data.cards[0].suit,
                value: data.cards[0].value,
                imgUrl: data.cards[0].image
            };
        var originalHand = playerArray[1].Hand;
        originalHand.push(hitCard);
        var hitCardImg = document.createElement('img');
        hitCardImg.className = ('hitCard' + playerArray[1].Name)
        hitCardImg.src = (hitCard.imgUrl)
        console.log(divHand);
        divHand.appendChild(hitCardImg);

        var handVal = 0;
        for(var i = 0; i < playerArray.length; i++) {
            playerArray[i].Points = 0;
            for (var j = 0; j < (playerArray[i].Hand).length; j++) {
                if (playerArray[i].Hand[j].value === "JACK" || playerArray[i].Hand[j].value === "QUEEN" || playerArray[i].Hand[j].value === "KING") {
                    playerArray[i].Hand[j].value = "10";
                } 
                // else if (playerArray[i].Hand[j].value === "ACE") {
                //     playerArray[i].Hand[j].value = "11";
                // }

                else if (playerArray[i].Hand[j].value === "ACE" && handVal < 11) {
                    playerArray[i].Hand[j].value = "11";
                } else if (playerArray[i].Hand[j].value === "ACE" && handVal > 10) {
                    playerArray[i].Hand[j].value = "1";
                }
                handVal += parseInt(playerArray[i].Hand[j].value);
            }
            playerArray[i].Points = handVal;
            handVal = 0;

            divPoints.innerHTML = ''
            divPoints = document.createElement('div');
            divPoints.className = ('points');
            divPoints.id = ('points' + playerArray[i].Name);
            divPoints.innerHTML = `Points: ${playerArray[i].Points} `;
            divPlayer.appendChild(divPoints);
            
        }
        for (var i = 0; i < playerArray.length; i++) {
            console.log(playerArray[i].Points);
            if (playerArray[i].Points > 21) {
                alert("you have bust");
                endRound();
            }
        }

    })
}


// to end round //
function onStay() {
    console.log('you pressed stay');
    endRound();
    //house logic function//
}

function endRound() {
    alert(`Game is over`)
    for(var i = 0; i < playerArray.length; i++) {
        console.log(playerArray[i].Points);
        console.log(`${playerArray[i].Name} has ${playerArray[i].Points} points.`)
        alert(`${playerArray[i].Name} has ${playerArray[i].Points} points.`)
    }
    if (playerArray[0].Points === playerArray[1].Points) {
        alert(`You tied.`)

    } 
    else if (playerArray[0].Points > playerArray[1].Points) {
        alert(`${playerArray[0].Name} won. ${playerArray[1].Name} lost.`)
    }
    else if (playerArray[1].Points > playerArray[0].Points){
        alert (`${playerArray[1].Name} won. ${playerArray[0].Name} lost.`)
    }
     // add stats & update "score"
    if (hitBtn.style.display === 'block') {
        hitBtn.style.display = 'none'
    }
    if (stayBtn.style.display === 'block') {
        stayBtn.style.display = 'none'
    }
    restartBtn.value = "Play another round";
}


function totalPoints() {
    var handVal = 0;
    for(var i = 0; i < playerArray.length; i++) {
        playerArray[i].Points = 0;
        for (var j = 0; j < (playerArray[i].Hand).length; j++) {
            if (playerArray[i].Hand[j].value === "JACK" || playerArray[i].Hand[j].value === "QUEEN" || playerArray[i].Hand[j].value === "KING") {
                playerArray[i].Hand[j].value = "10";
            } 
            if (playerArray[i].Hand[0].value === "ACE") {
                playerArray[i].Hand[0].value = "11";
            } else if (playerArray[i].Hand[1].value === "ACE" && playerArray[i].Hand[0].value < 11) {
                playerArray[i].Hand[1].value = "11";
            } else if (playerArray[i].Hand[1].value === "ACE" && playerArray[i].Hand[0].value > 10) {
                playerArray[i].Hand[1].value = "1";
            }

            handVal += parseInt(playerArray[i].Hand[j].value);
        }
        playerArray[i].Points = handVal;
        handVal = 0;
    }
}

//house logic function//
//if the house total is less than player1 hit until more than or bust OR Dealer will hit until his/her cards total 17 or higher//

//hide house cards after game is built //

///////////////////////////////////////////////
//                On Clicks                  //
///////////////////////////////////////////////

startBtn.addEventListener('click', onStart);
restartBtn.addEventListener('click', onRestart);
hitBtn.addEventListener('click', onHit);
stayBtn.addEventListener('click', onStay);
