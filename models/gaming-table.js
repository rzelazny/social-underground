// Creating our model of the gaming/socializing tables
module.exports = function(sequelize, DataTypes) {
    console.log("Table sequelize.define")
    var Table = sequelize.define("gaming_tables", {
    
    // The email cannot be null, and must be a proper email before creation
    game: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Just Chatting"
    },
    game_started: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // There must be at least one player at a table
    user1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user2: {
        type: DataTypes.STRING,
    },
    user3: {
        type: DataTypes.STRING,
    },
    user4: {
        type: DataTypes.STRING,
    },
    user5: {
        type: DataTypes.STRING,
    }
    });

    return Table;
};