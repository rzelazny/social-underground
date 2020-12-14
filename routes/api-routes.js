// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var User_stat = db.user_stat
// var fs = require("fs");
// var path = require("path");
// const { sequelize } = require("../models");
// const user = require("../models/user_login");
const { Op } = require("sequelize");
//const { pathToFileURL } = require("url");
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
    db.user_login.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
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
      gamePoints: req.body.gamePoints

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

 // Route for finding existing game tables that have room and an ongoing game
  app.get("/api/tables", function(req, res) {
    db.gaming_table.findAll({
      where: {
        game_ended: {
          [Op.eq]: false
        },
        [Op.or]: [
        {
          user1: 
          {
            [Op.eq]: "Open Seat"
          }
        }, 
        {
          user2: 
          {
            [Op.eq]: "Open Seat"
          }
        }, 
        {
          user3: 
          {
            [Op.eq]: "Open Seat"
          }
        }, 
        {
          user4: 
          {
            [Op.eq]: "Open Seat"
          }
        }, 
        {
          user5: 
          {
            [Op.eq]: "Open Seat"
          }
      }]},
    }).then(function(results){
      console.log("get tables returning data");
      return res.send(results);
    })
});

 // Route for finding data on a given table
app.get("/api/table:table", function(req, res) {
  console.log("getting info for table: ", req.params.table);
  db.gaming_table.findAll({
    where: {
      id: {
        [Op.eq]: req.params.table
      }
  }}).then(function(results){
    console.log("sending table data back");
    return res.send(results);
  })
});


// Route for finding existing game tables
// app.get("/api/findseat", function(req, res) {
//   db.gaming_table.findAll({
//     where: {
//       game_ended: {
//         [Op.eq]: false
//       }
//     }
//   }).then(function(results){
//     console.log("sending table data back")
//     return res.send(results);
//   })
// });

// Route for getting chat log data
  app.get("/api/chat:table", function(req, res) {
    db.chat_log.findAll({
      where: {
        table_id: {
          [Op.eq]: req.params.table
        }
      }
    }).then(function(results){
      res.send(results);
    })
  });

  // // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    console.log("get api user data is running")
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

// Route for retrieving a photo
app.get("/api/photo/:id/:table", function(req, res) {
  console.log("getting photo for user", req.params.id)
  console.log("getting photo for table", req.params.table)

  //finalAll limit 1 instead of findOne so we can sort the results and only get the most recent
  db.photo.findAll({
    limit: 1,
    where: {
      table_id: {
        [Op.eq]: req.params.table
      },
      user_email: {
        [Op.eq]: req.params.id
      }
    },
    order: [[ 'createdAt', 'DESC' ]]
  }).then(function(results){
    console.log("I got results");
    return res.json(results);
  }).catch(function(err) {
    return res.status(401).json(err);
  });
  
});

  //create a new gaming table
  app.post("/api/newtable", function(req, res) {

    console.log("Creating a new table");

    db.gaming_table.create({
      game: "Just Chatting",
      game_started: false,
      user1: req.user.email
    })
    .then(function(results){
      console.log("sending new table data back")
      return res.json(results);
    })
      .catch(function(err) {
        return res.status(401).json(err);
      });
  });

  //update an existing table
  app.post("/api/table:table", function(req, res) {

    console.log("Updating table ", req.params.table);
    let updateCol = req.body.column
    switch(updateCol){
      case "user1":
        db.gaming_table.update(
          {
          user1: req.body.data
        },
        {
          where: 
          {
            id: {
              [Op.eq]: req.params.table
            }
          }
        })
        .then(function(results){
          console.log("sending new table data back")
          return res.json(results);
        })
          .catch(function(err) {
            return res.status(401).json(err);
          });
      break;
      case "user2":
        db.gaming_table.update(
          {
          user2: req.body.data
        },
        {
          where: 
          {
            id: {
              [Op.eq]: req.params.table
            }
          }
        })
        .then(function(results){
          console.log("sending new table data back")
          return res.json(results);
        })
          .catch(function(err) {
            return res.status(401).json(err);
          });
      break;
      case "user3":
        db.gaming_table.update(
          {
          user3: req.body.data
        },
        {
          where: 
          {
            id: {
              [Op.eq]: req.params.table
            }
          }
        })
        .then(function(results){
          console.log("sending new table data back")
          return res.json(results);
        })
          .catch(function(err) {
            return res.status(401).json(err);
          });
      break;
      case "user4":
        db.gaming_table.update(
          {
          user4: req.body.data
        },
        {
          where: 
          {
            id: {
              [Op.eq]: req.params.table
            }
          }
        })
        .then(function(results){
          console.log("sending new table data back")
          return res.json(results);
        })
          .catch(function(err) {
            return res.status(401).json(err);
          });
      break;
      case "user5":
        db.gaming_table.update(
          {
          user5: req.body.data
        },
        {
          where: 
          {
            id: {
              [Op.eq]: req.params.table
            }
          }
        })
        .then(function(results){
          console.log("sending new table data back")
          return res.json(results);
        })
          .catch(function(err) {
            return res.status(401).json(err);
          });
      break;
      case "game":
        db.gaming_table.update(
          {
          game: req.body.data
        },
        {
          where: 
          {
            id: {
              [Op.eq]: req.params.table
            }
          }
        })
        .then(function(results){
          console.log("sending new table data back")
          return res.json(results);
        })
          .catch(function(err) {
            return res.status(401).json(err);
          });
      break;
    }
  });
  
  //clean out tables that have no users or TODO: that haven't been updated recently
  app.post("/api/cleanup", function(req, res) {
    
    console.log("cleanup running");
    db.gaming_table.findAll({
      where: {
        user1: {
          [Op.eq]: "Open Seat"
        },
        user2: {
          [Op.eq]: "Open Seat"
        },
        user3: {
          [Op.eq]: "Open Seat"
        },
        user4: {
          [Op.eq]: "Open Seat"
        },
        user5: {
          [Op.eq]: "Open Seat"
        }
      }
    })
    .then(function(results){
      if(results != null){
        for(i=0; i < results.length; i++){
          db.gaming_table.destroy({
            where: {
              id: {
                [Op.eq]: results[i].id
              }
            }
          })
          console.log("deleting empty table", results[i].id)
        }
        res.send(results);
      }
    })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  //post a new chat message
  app.post("/api/chat/", function(req, res) {

    db.chat_log.create({
      user: req.user.id,
      message: req.body.message,
      table_id: req.body.table
    })
    .then(function(results){
      console.log("sending new table data back")
      res.send(results);
    })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  //deletes photos from a given table
  app.post("/api/photo/cleanup", function(req, res) {

  console.log("photo cleanup for table: ", req.body.table);
  console.log("removing photos of user: ", req.user.email);

  db.photo.findAll({
    where: {
      user_email: {
        [Op.eq]: req.user.email
      },
      table_id: {
        [Op.eq]: req.body.table
      }
    }
  })
  .then(function(results){
    if(results != null){
      for(i=0; i < results.length; i++){
        db.photo.destroy({
          where: {
            user_email: {
              [Op.eq]: req.user.email
            },
            table_id: {
              [Op.eq]: req.body.table
            }
          }
        })
        console.log("deleting photo ", results[i].id)
      }
      res.send(results);
    }
  })
    .catch(function(err) {
      res.status(401).json(err);
    });
});

  //stores a photo captured from the webcam to the photo table
  app.post("/api/photo", function(req, res) {

    console.log("storing photo");
    console.log(req.user.email);
    console.log(req.body.table);

    let data = req.body.photo;
    let base64Data = data.replace("data:image/png;base64,", "");
    db.photo.create({
      photo: base64Data,
      user_email: req.user.email,
      table_id: req.body.table
    })
    .then(function(results){
      console.log("sending new table data back")
      res.send(results);
    })
      .catch(function(err) {
        res.status(401).json(err);
      });
    });
    // This successfully stores the photo as a png file in the public/assets/imgages folder, but the page can't use the images as a src
    // console.log("storing photo");
    // let data = req.body.photo;
    // let base64Data = data.replace(/^data:image\/png;base64,/, "");
    // let pathName = path.join(__dirname, "..");

    // fs.writeFile(pathName + "/public/assets/images/tbl_" + req.body.table + "_user_" + req.user.id + ".png", base64Data, 'base64', 
    // function(err, data) {
    // if (err) {
    //     console.log('err', err);
    // }
    //   console.log('success');
    
    //   res.send(pathName + "/public/assets/images/tbl_" + req.body.table + "_user_" + req.user.id + ".png");
    //});
};


