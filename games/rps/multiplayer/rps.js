// array of choices //
var houseChoices = ["r", "p", "s"];

// variables to hold the number of wins, losses, and ties starting at 0
var player1wins = 0;
var player1losses = 0;
var player1ties = 0;

var player2wins = 0;
var player2losses = 0;
var player2ties = 0;

var winner = null;

alert('This game lasts 10 rounds');

for (var i = 0; i < 10; i++) {
// collect the users response
    var player1Guess = prompt("Player One: enter r, p, or s to play!")
    player1Guess = player1Guess.toLowerCase();
    
    var player2Guess = prompt("Player Two: enter r, p, or s to play!")
    player2Guess = player2Guess.toLowerCase();

    // runs game logic if user chose a valid option
    if ((player1Guess === "r" || player1Guess === "p" || player1Guess === "s") && (player2Guess === "r" || player2Guess === "p" || player2Guess === "s")) {
        alert(`Player 1 chose: ${player1Guess} || Player 2 chose: ${player2Guess}`);

        if ((player1Guess === "r" && player2Guess === "s") ||
            (player1Guess === "s" && player2Guess === "p") ||
            (player1Guess === "p" && player2Guess === "r")) {
            player1wins++ && player2losses++;
            alert(`Player 1 wins this round.`);
            alert (`Current stats: 
            Player 1: ${player1wins} wins. ${player1ties} ties. ${player1losses} losses.
            Player 2: ${player2wins} wins. ${player2ties} ties. ${player2losses} losses.`)
        } else if (player1Guess === player2Guess) {
            player1ties++ && player2ties++;
            alert("You've tied.");
            alert (`Current stats: 
            Player 1: ${player1wins} wins. ${player1ties} ties. ${player1losses} losses.
            Player 2: ${player2wins} wins. ${player2ties} ties. ${player2losses} losses.`)
        } else {
            alert(`Player 2 wins this round.`);
            alert (`Current stats: 
            Player 1: ${player1wins} wins. ${player1ties} ties. ${player1losses} losses.
            Player 2: ${player2wins} wins. ${player2ties} ties. ${player2losses} losses.`)
        }
    }
}

// figure out who won
if (player1wins > player2wins) {
    winner = "Player 1";
} else {
    winner = "Player 2";
}


// once the users have played the 10 rounds an alert of the totals will be displayed to the user
alert(`The game has ended. ${winner} is the winner.`)
alert (`Current stats: 
            Player 1: ${player1wins} wins. ${player1ties} ties. ${player1losses} losses.
            Player 2: ${player2wins} wins. ${player2ties} ties. ${player2losses} losses.`)