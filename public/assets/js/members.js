$(document).ready(function() {
  
  //variables
  var userName = document.getElementsByClassName("card-text-user")
  var userBio = document.getElementsByClassName("card-text-bio")
  var userStat = document.getElementsByClassName("card-text-w/l")

  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });

  $.get("/api/user_stat").then(function(data) {
    $(".member-name").text(data.email);
  });


  function proFile() {

  }
});
