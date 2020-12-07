///////////////////////////////////////////////
//                Variables                  //
///////////////////////////////////////////////

const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
const vals = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const deck = [];

function createDeck() {
    deck = [];
    for (var i = 0; i < vals.length; i++) {
        for (var j = 0; j < suits.length; j++) {
            if(vals[i] === "J" || vals[i] === "Q" || vals[i] === "K") {
                value = 10;
            }
            else if (vals[i] === "A") {
                value = 11
            }
            else {
                value = parseInt(vals[i])
            }
            var card = { Value: values[i], Suit: suits[j], Value: value };
            deck.push(card);
        }
    }
}