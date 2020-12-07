///////////////////////////////////////////////
//                Variables                  //
///////////////////////////////////////////////

const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
const vals = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];

let hand = [];

// let players = [];
// hard coded for now but will use players from db
let playerArray = [{ Name: 'House', ID: 0, Points: 0, Hand: hand }, { Name: 'Player 1',  ID: 1, Points: 0, Hand: hand }]

var players =  document.querySelector('#players');

var startBtn = document.querySelector('#start');
var hitBtn = document.querySelector('#hit');
var stayBtn = document.querySelector('#stay');

var score = 0;
var wins = 0;
var losses = 0;
var ties = 0;

///////////////////////////////////////////////
//                Functions                  //
///////////////////////////////////////////////

function createDeck() {
    deck = [];
    for (let i = 0; i < vals.length; i++) {
        for (let j = 0; j < suits.length; j++) {
            if (vals[i] === "J" || vals[i] === "Q" || vals[i] === "K") {
                weight = 10;
            }
            else if (vals[i] === "A") {
                weight = 11
            }
            else {
                weight = parseInt(vals[i])
            }
            var card = { Value: vals[i], Suit: suits[j], Weight: weight };
            deck.push(card);
        }
    }
}

createDeck();
console.log(deck.length);
console.log(deck);

//credit: fisher-yates shuffle method
function shuffleDeck(deck) {
    var i = 0, j = 0, temp = null

    for (i = deck.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = deck[i]
        deck[i] = deck[j]
        deck[j] = temp
    }
    return console.log(deck.length),
    console.log(deck);
}

shuffleDeck(deck);

//currently a hard coded array under variables but will need a function where there are actual players
// function addPlayers(amount) {

// }

function displayPlayers() {
    console.log('Hello ' + playerArray[1].Name);
}

displayPlayers();

function onStart() {
    console.log("you pressed start")
    function displayBtns() {
        if (hitBtn.style.display === "none") {
            hitBtn.style.display = "block"
        }
        if (stayBtn.style.display === "none") {
            stayBtn.style.display = "block"
        }
        if (startBtn.style.display === "block") {
            startBtn.style.display = "none"
        }
    }
    displayBtns();
}

function onHit() {
    console.log("you pressed hit");
}

function onStay() {
    console.log("you pressed stay");
}


///////////////////////////////////////////////
//                On Clicks                  //
///////////////////////////////////////////////

startBtn.addEventListener("click", onStart);
hitBtn.addEventListener("click", onHit);
stayBtn.addEventListener("click", onStay);