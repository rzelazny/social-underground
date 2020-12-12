// Creates a "Character" model that matches up with DB
module.exports = function (sequelize, DataTypes){
    var User_Stat = sequelize.define("user_stat", {
        name: {
            type: DataTypes.STRING,
            defaultValue: "New Player"
        },
        gamePoints: DataTypes.INTEGER,
        bio: DataTypes.STRING,
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            }
        }
    });
    return User_Stat;
};
// // Syncs with DB
// User.sync();

// // Makes the User Model available for other files (will also create a table)
// module.exports = User;