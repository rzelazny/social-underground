$(document).ready(function() {
    // Getting references to our form and inputs
    var joinGame = document.getElementById("joinGame");

    // When the form is submitted, we validate there's an email and password entered
    $("#newTable").on("click", function(event) {
        console.log("You clicked me! That tickled...");
        $.post("/api/newtable");
            console.log("The table was made");
            window.location.replace("/casino");
        
    })

    joinGame.addEventListener("click", function() {
        console.log("Stopppppp that tickles!! >:(");
    });
});


