// ///////////////////////////////////////////////
// //                Variables                  //
// ///////////////////////////////////////////////

// //https://deckofcardsapi.com/// 

// const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
// const vals = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// let deck = [];

// let hand = [];

// // hard coded for now but will use players from db
// let playerArray = [{ Name: 'House', ID: 0, Points: 0, Hand: hand }, { Name: 'Player1',  ID: 1, Points: 0, Hand: hand }]

// var players =  document.querySelector('#players');

// var startBtn = document.querySelector('#start');
// var hitBtn = document.querySelector('#hit');
// var stayBtn = document.querySelector('#stay');

// let score = [];

// var wins = 0;
// var losses = 0;
// var ties = 0;

// ///////////////////////////////////////////////
// //                Functions                  //
// ///////////////////////////////////////////////

// function createDeck() {
//     deck = [];
//     for (let i = 0; i < vals.length; i++) {
//         for (let j = 0; j < suits.length; j++) {
//             if (vals[i] === 'J' || vals[i] === 'Q' || vals[i] === 'K') {
//                 weight = 10;
//             }
//             else if (vals[i] === 'A') {
//                 weight = 11
//             }
//             else {
//                 weight = parseInt(vals[i])
//             }
//             var card = { Value: vals[i], Suit: suits[j], Weight: weight };
//             deck.push(card);
//         }
//     }
//     return console.log(deck.length),
//     console.log(deck);
// }

// //credit: fisher-yates shuffle method
// function shuffleDeck(deck) {
//     var i = 0, j = 0, temp = null

//     for (i = deck.length - 1; i > 0; i -= 1) {
//         j = Math.floor(Math.random() * (i + 1))
//         temp = deck[i]
//         deck[i] = deck[j]
//         deck[j] = temp
//     }
//     return console.log(deck.length),
//     console.log(deck);
// }

// // function drawCards() {
// //         var docUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=2"
// //         $.ajax({
// //             url: docUrl,
// //             method: "GET"
// //         }).then(function(data) {
// //             console.log(data);
// //             hand = [];
// //             var cardOne = {
// //                     ID: 1,
// //                     code: data.cards[0].code,
// //                     suit: data.cards[0].suit,
// //                     value: data.cards[0].value,
// //                     imgUrl: drawCards.cards[0].image

// //                 };
// //             var cardTwo = 
// //                 {
// //                     ID: 1,
// //                     code: data.cards[1].code,
// //                     suit: data.cards[1].suit,
// //                     value: data.cards[1].value,
// //                     imgUrl: drawCards.cards[1].image
// //                 }
// //             ;
// //             hand.push(cardOne, cardTwo);
// //         })
// // }

// // drawCards();

// //currently a hard coded array under variables but will need a function where there are actual players
// // // function addPlayers(amount) {
// //     playerArray = [{ Name: House, ID: 0, Points: 0, Hand: hand }];
// //     for (var i = 1; i <= amount; i++) {
// //         var Hand = [];
// //         var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
// //         playerArray.push(player)
// //     }
// // }

// function displayBtns() {
//     if (hitBtn.style.display === 'none') {
//         hitBtn.style.display = 'block'
//     }
//     if (stayBtn.style.display === 'none') {
//         stayBtn.style.display = 'block'
//     }
// }

// function displayPlayers() {
//     players.innerHTML = '';
//     for(var i = 0; i < playerArray.length; i++) {

//         var divPlayer = document.createElement('div');
//         divPlayer.className = ('player');
//         divPlayer.id = playerArray[i].Name;

//         var divPlayerName = document.createElement('div');
//         divPlayerName.innerHTML = (playerArray[i].Name);

//         var divHand = document.createElement('div');
//         divHand.id = ('hand' + playerArray[i].Name);

//         var divPoints = document.createElement('div');
//         divPoints.className = ('points');
//         divPoints.id = ('points' + playerArray[i].Name);


//         divPlayer.appendChild(divPlayerName, divHand, divPoints);
//         players.appendChild(divPlayer);
//     }
// }


// function onStart() {
//     console.log('you pressed start')
//     startBtn.value = ('restart');
//     displayBtns();
//     displayPlayers();

//     createDeck();
//     shuffleDeck(deck);

//     drawCards();

//     // dealHands();
// }

// //deal hands function//
// // function dealHands() {
// //     for (var i = 0; i <=2; i++) {
// //         for (var j = 0; j < playerArray.length; j++) {
// //             var card = deck.pop();
// //             players[j].Hand.push(card);
// //             getCard(card, j);
// //             updatePoints();
// //         }
// //     }
// //     updateDeck();
// // }

// // function getCard(card, player) {
// //     var hand = document.getElementById('hand' + player);
// //     hand.appendChild(displayCards(card));
// // }

// // function updateDeck() {
// //     document.getElementById('deckcount').innerHTML = deck.length;
// // }

// //display cards function//
// // function displayCards() {
// //     var div = document.createElement('div');
// //     var icon = '';

// //     if (card.Suit === 'clubs') {
// //         icon = '&clubs;';
// //     }
// //     else if (card.Suit === 'diamonds') {
// //         icon = '&diams;';
// //     }
// //     else if (card.Suit === 'hearts') {
// //         icon = '&hearts;';
// //     }
// //     else if (card.Suit === 'spades') {
// //         icon = '&spades;';
// //     }

// //     div.className = 'card';
// //     div.innerHTML = card.Value + '<br/>' + icon;
// //     return div;
// // }


// //get points from hand//
// // function updatePoints() {
// //     var points = 0;
// //     for (var i = 0; i < players[player].Hand.length; i++) {
// //         points += players[player].Hand[i].Weight;
// //     }
// //     players[player].Points = points;
// //     return points;
// // }

// //update points//
// // function updatePoints(){
// //     for (var i = 0 ; i < players.length; i++) {
// //         getPoints(i);
// //         document.getElementById('points_' + i).innerHTML = players[i].Points;
// //     }
// // }

// function onHit() {
//     console.log('you pressed hit');
// }

// function onStay() {
//     console.log('you pressed stay');
// }

// //if the house total is less than player1 hit until more than or bust//

// ///////////////////////////////////////////////
// //                On Clicks                  //
// ///////////////////////////////////////////////

// startBtn.addEventListener('click', onStart);
// hitBtn.addEventListener('click', onHit);
// stayBtn.addEventListener('click', onStay);