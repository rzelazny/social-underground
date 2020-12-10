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

//https://deckofcardsapi.com/// 

let hand = [];

///////////////////////////////////////////////
//                Functions                  //
///////////////////////////////////////////////

function drawCards() {
    // for (var i = 0; i < playerArray.length; i++) {
        var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=2"
        $.ajax({
            url: docUrl,
            method: "GET"
        }).then(function(data) {
            // console.log(data);
            for (var i = 0; i < playerArray.length; i++) {
                playerHand = [
                    {
                        ID: 1,
                        code: data.cards[0].code,
                        suit: data.cards[0].suit,
                        value: data.cards[0].value,
                        imgUrl: data.cards[0].image
    
                    }, {
                        ID: 2,
                        code: data.cards[1].code,
                        suit: data.cards[1].suit,
                        value: data.cards[1].value,
                        imgUrl: data.cards[1].image
                    }
                ];
                hand.push(playerHand);
                playerArray[i].Hand = hand[i]
            };
            createElements();
            // totalPoints();
        })
    // };
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

        var divPlayer = document.createElement('div');
        divPlayer.className = ('player');
        divPlayer.id = playerArray[i].Name;
        divPlayer.innerHTML = (playerArray[i].Name);

        var divHand = document.createElement('div');
        divHand.id = ('hand' + playerArray[i].Name);

        var cardOneImg = document.createElement('img');
        cardOneImg.id = ('cardOne' + playerArray[i].Name)
        cardOneImg.src = (playerArray[i].Hand[0].imgUrl)

        var cardTwoImg = document.createElement('img');
        cardTwoImg.id = ('cardTwo' + playerArray[i].Name)
        cardTwoImg.src = (playerArray[i].Hand[1].imgUrl)

        console.log("============Card 1============")
        console.log(playerArray[i].Hand[0].imgUrl)
        console.log("===========Card 2============")
        console.log(playerArray[i].Hand[1].imgUrl)

        var divPoints = document.createElement('div');
        divPoints.className = ('points');
        divPoints.id = ('points' + playerArray[i].Name);

        divHand.appendChild(cardOneImg, cardTwoImg);
        divPlayer.appendChild(divHand, divPoints);
        players.appendChild(divPlayer);
    }
}

function addPlayers() {
    
    var house = { Name: 'House', ID: 0, Points: 0, Hand: hand[0] };

    var player1 = { Name: 'Player1',  ID: 1, Points: 0, Hand: hand[1] };

    playerArray.push(house, player1);
    // console.log(playerArray);
}


function onStart() {
    console.log('you pressed start')

    displayBtns();

    addPlayers();

    drawCards();

    //total point value
}

function onRestart() {
    //updating hands only
    console.log('you pressed restart');
}

function onHit() {
    // to add card
    console.log('you pressed hit me');
    //house logic function//
    //total point value
}

function onStay() {
    // to end round
    //total point value

    console.log('you pressed stay');
    //house logic function//
}

//house logic function//
//if the house total is less than player1 hit until more than or bust//

// function totalPoints() {
//     //count values of all cards
//     //if bust logic
// }

///////////////////////////////////////////////
//                On Clicks                  //
///////////////////////////////////////////////

startBtn.addEventListener('click', onStart);
restartBtn.addEventListener('click', onRestart);
hitBtn.addEventListener('click', onHit);
stayBtn.addEventListener('click', onStay);