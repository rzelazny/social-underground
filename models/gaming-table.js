// Creating our model of the gaming/socializing tables
module.exports = function(sequelize, DataTypes) {
    console.log("Table sequelize.define")
    var Table = sequelize.define("gaming_table", {
    
    game: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Just Chatting"
    },
    game_ended: {
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
        defaultValue: "Open Seat"
    },
    user3: {
        type: DataTypes.STRING,
        defaultValue: "Open Seat"
    },
    user4: {
        type: DataTypes.STRING,
        defaultValue: "Open Seat"
    },
    user5: {
        type: DataTypes.STRING,
        defaultValue: "Open Seat"
    }
    });

    return Table;
};