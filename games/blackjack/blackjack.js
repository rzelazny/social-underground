///////////////////////////////////////////////
//                Variables                  //
///////////////////////////////////////////////

const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
const vals = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];

function createDeck() {
    deck = [];
    for (var i = 0; i < vals.length; i++) {
        for (var j = 0; j < suits.length; j++) {
            if(vals[i] === "J" || vals[i] === "Q" || vals[i] === "K") {
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
console.log(deck);
