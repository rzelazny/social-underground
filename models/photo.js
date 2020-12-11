// Creating our model of webcam photos
module.exports = function(sequelize, DataTypes) {
    var Photo = sequelize.define("photo", {
    
    photo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // chat logs are per gaming table
    table_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    });
    return Photo;
};