//Users stats
var Sequelize = require("sequelize");
// sequelize (lowercase) references our connection to the DB.
var sequelize = require("./index");

// Creates a "Character" model that matches up with DB
var User = sequelize.define("User", {
    routeName: Sequelize.STRING,
    name: Sequelize.STRING,
    age: Sequelize.INTEGER,
    gamePoints: Sequelize.INTEGER
}, {
    freezeTableName: true
});
// Syncs with DB
User.sync();

// Makes the User Model available for other files (will also create a table)
module.exports = User;



