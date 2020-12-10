///////////////////////////////////////////////
//                Variables                  //
///////////////////////////////////////////////
var gameBody =  document.querySelector('#gameBody');
var players =  document.querySelector('#players');

var startBtn = document.querySelector('#start');
var restartBtn = document.querySelector('#restart');
var hitBtn = document.querySelector('#hit');
var stayBtn = document.querySelector('#stay');

// hard coded for now but will use players from db
let playerArray = [];

let score = [];

var wins = 0;
var losses = 0;
var ties = 0;

let hand = [];

//making a global variable to be used throughout several functions//
var divPlayer = null;
var divHand = null;
var divPoints = null;
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
            createElements();
            totalPoints();
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
        divPoints.innerHTML = `Points: ` + playerArray[i].Points

        divHand.appendChild(cardOneImg);
        divHand.appendChild(cardTwoImg);
        divPlayer.appendChild(divHand);
        divPlayer.appendChild(divPoints);
        players.appendChild(divPlayer);
    }
}

function addPlayers() {
    
    var house = { Name: 'House', ID: 0, Points: 0, Hand: hand[0] };

    var player1 = { Name: 'Player1',  ID: 1, Points: 0, Hand: hand[1] };

    // var player2 = { Name: 'Player2',  ID: 2, Points: 0, Hand: hand[2] };

    playerArray.push(house, player1);
    // console.log(playerArray);
}


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
    drawCards();
}

function onHit() {
    console.log('you pressed hit me');
    playerOneHit();

    //house logic function//
    //total point value
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
    })
}

// to end round //
function onStay() {
    //total point value

    console.log('you pressed stay');
    //house logic function//
}

//house logic function//
//if the house total is less than player1 hit until more than or bust//

function totalPoints() {
    for(var i = 0; i < playerArray.length; i++) {

        if (playerArray[i].Hand[0].value === "JACK" || playerArray[i].Hand[0].value === "QUEEN" || playerArray[i].Hand[0].value === "KING") {
            playerArray[i].Hand[0].value = "10";
        } else if (playerArray[i].Hand[0].value === "ACE") {
            playerArray[i].Hand[0].value = "11";
        }
        var cardOneVal = parseInt(playerArray[i].Hand[0].value);

        if (playerArray[i].Hand[1].value === "JACK" || playerArray[i].Hand[1].value === "QUEEN" || playerArray[i].Hand[1].value === "KING") {
            playerArray[i].Hand[1].value = "10";
        } else if (playerArray[i].Hand[1].value === "ACE") {
            playerArray[i].Hand[1].value = "11";
        }
        var cardTwoVal = parseInt(playerArray[i].Hand[1].value);

        var handVal = cardOneVal + cardTwoVal;
        playerArray[i].Points = handVal;

        console.log(playerArray[i].Points);

        divPoints.innerHTML = `Points: ` + playerArray[i].Points
    }
    //count values of all cards
    //if bust logic
}

//hide house cards after game is built//

///////////////////////////////////////////////
//                On Clicks                  //
///////////////////////////////////////////////

startBtn.addEventListener('click', onStart);
restartBtn.addEventListener('click', onRestart);
hitBtn.addEventListener('click', onHit);
stayBtn.addEventListener('click', onStay);
