// array of choices //
var houseChoices = ["r", "p", "s"];

// variables to hold the number of wins, losses, and ties starting at 0
var wins = 0;
var losses = 0;
var ties = 0;

alert('This game lasts 10 rounds');

for (var i = 0; i < 10; i++) {
    // randomly chooses a choice from the options array as the houses guess
    var houseGuess = houseChoices[Math.floor(Math.random() * houseChoices.length)];

    // collect the users response
    var userGuess = prompt("Enter r, p, or s to play!")
    userGuess = userGuess.toLowerCase();

    // runs game logic if user chose a valid option
    if (userGuess === "r" || userGuess === "p" || userGuess === "s") {

        alert("The house chose " + houseGuess);

        if ((userGuess === "r" && houseGuess === "s") ||
            (userGuess === "s" && houseGuess === "p") ||
            (userGuess === "p" && houseGuess === "r")) {
            wins++;
            alert("You've won " + wins + " time(s)!");
        } else if (userGuess === houseGuess) {
            ties++;
            alert("You've tied " + ties + " time(s).");
        } else {
            losses++;
            alert("You've lost " + losses + " time(s).");
        }
    }
}

// once the user has played the 10 rounds an alert of the totals will be displayed to the user
alert("Total wins: " + wins + "\nTotal ties: " + ties + "\nTotal losses: " + losses);