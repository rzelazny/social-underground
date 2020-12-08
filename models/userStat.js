// Creates a "Character" model that matches up with DB
module.exports = function (sequelize, DataTypes){
    return sequelize.define("User", {
        routeName: DataTypes.STRING,
        name: DataTypes.STRING,
        gamePoints: DataTypes.INTEGER
    }, {
        freezeTableName: true
    });
};
// // Syncs with DB
// User.sync();

// // Makes the User Model available for other files (will also create a table)
// module.exports = User;