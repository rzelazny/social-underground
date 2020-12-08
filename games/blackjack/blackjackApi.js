function shuffleCards() {
    var docUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"

    $.ajax({
        url: docUrl,
        method: "GET"
    }).then(function(data) {
        console.log(data)
    })
}

shuffleCards();