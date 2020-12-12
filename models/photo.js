// Creating our model of webcam photos
module.exports = function(sequelize, DataTypes) {
    var Photo = sequelize.define("photo", {

    photo: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
        get() {
            return this.getDataValue('photo').toString('base64');
        },
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

    sequelize.sync({
        force: true})
    return Photo;
}; 