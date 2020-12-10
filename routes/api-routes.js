// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
// var User = require("../models/userStat")
var User_stat = db.User_stat
const { sequelize } = require("../models");
const user = require("../models/user_login");
const { Op } = require("sequelize");
// const user = require("../models/user");


module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    console.log("app post api/login");
    res.json(req.user);
  });
  
  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {

    console.log("My email is: " + req.body.email + " my pass is: " + req.body.password);
    console.log()
    db.User_login.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/new");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  app.post("/api/user_stat", function(req, res) {
    // Take the request...
    var routeName = req.body.name.replace(/\s+/g, "").toLowerCase();
    // Then add the user to the database using sequelize
    User_stat.create({
      name: req.body.name,
      gamePoints: req.body.gamePoints,
      bio: req.body.bio

    }).then ((user_stat) => {
      res.status(201).json(user_stat);
    })
  });

  app.get("/api/user_stat", function(req, res) {
    // Take the request...
    // Then add the user to the database using sequelize
    User_stat.findAll().then((user_stat) => {
      res.json(user_stat);
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

 // Route for finding existing game tables
  app.get("/api/tables", function(req, res) {
    db.gaming_tables.findAll({
      where: {
        game_started: {
          [Op.eq]: false
        }
      }
    }).then(function(results){
      console.log("sending table data back")
      res.send(results);
    })
});

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    console.log("app.get api user data")
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.post("/api/newtable", function(req, res) {

    console.log("api new table running");

    console.log("User ID is: " + req.user.email);
    db.gaming_tables.create({
      game: "Just Chatting",
      game_started: false,
      user1: req.user.email
    })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });
};
