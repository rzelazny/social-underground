///////////////////////////////////////////////
//                Variables                  //
///////////////////////////////////////////////

// hard coded for now but will use players from db
let playerArray = [{ Name: 'House', ID: 0, Points: 0, Hand: hand }, { Name: 'Player1',  ID: 1, Points: 0, Hand: hand }]

var players =  document.querySelector('#players');

var startBtn = document.querySelector('#start');
var hitBtn = document.querySelector('#hit');
var stayBtn = document.querySelector('#stay');

let score = [];

var wins = 0;
var losses = 0;
var ties = 0;

//https://deckofcardsapi.com/// 

let hand = [];

///////////////////////////////////////////////
//                Functions                  //
///////////////////////////////////////////////

function drawCards() {
        var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=2"
        $.ajax({
            url: docUrl,
            method: "GET"
        }).then(function(data) {
            console.log(data);
            hand = [];
            var cardOne = {
                    ID: 1,
                    code: data.cards[0].code,
                    suit: data.cards[0].suit,
                    value: data.cards[0].value,
                    imgUrl: drawCards.cards[0].image

                };
            var cardTwo = 
                {
                    ID: 1,
                    code: data.cards[1].code,
                    suit: data.cards[1].suit,
                    value: data.cards[1].value,
                    imgUrl: drawCards.cards[1].image
                }
            ;
            hand.push(cardOne, cardTwo);
        })
}

drawCards();


function displayBtns() {
    if (hitBtn.style.display === 'none') {
        hitBtn.style.display = 'block'
    }
    if (stayBtn.style.display === 'none') {
        stayBtn.style.display = 'block'
    }
}

function displayPlayers() {
    players.innerHTML = '';
    for(var i = 0; i < playerArray.length; i++) {

        var divPlayer = document.createElement('div');
        divPlayer.className = ('player');
        divPlayer.id = playerArray[i].Name;

        var divPlayerName = document.createElement('div');
        divPlayerName.innerHTML = (playerArray[i].Name);

        var divHand = document.createElement('div');
        divHand.id = ('hand' + playerArray[i].Name);

        var divPoints = document.createElement('div');
        divPoints.className = ('points');
        divPoints.id = ('points' + playerArray[i].Name);


        divPlayer.appendChild(divPlayerName, divHand, divPoints);
        players.appendChild(divPlayer);
    }
}


function onStart() {
    console.log('you pressed start')
    startBtn.value = ('restart');
    displayBtns();
    displayPlayers();

    createDeck();
    shuffleDeck(deck);

    drawCards();

    // dealHands();
}

function onHit() {
    console.log('you pressed hit');
}

function onStay() {
    console.log('you pressed stay');
}

//if the house total is less than player1 hit until more than or bust//

///////////////////////////////////////////////
//                On Clicks                  //
///////////////////////////////////////////////

startBtn.addEventListener('click', onStart);
hitBtn.addEventListener('click', onHit);
stayBtn.addEventListener('click', onStay);