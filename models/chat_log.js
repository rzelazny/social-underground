// Creating our model of chat log
module.exports = function(sequelize, DataTypes) {
    console.log("ChatLog sequelize.define")
    var ChatLog = sequelize.define("chat_log", {
    
    //
    user: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // chat logs are per gaming table
    table_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    });
    return ChatLog;
};