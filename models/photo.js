// Creating our model of webcam photos
module.exports = function(sequelize, DataTypes) {
    var Photo = sequelize.define("photo", {

    photo: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
        get() { //make sure the data returns as base64 string
            return this.getDataValue('photo').toString('base64');
        },
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // chat logs are per gaming table
    table_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "gaming_table",
            key: "id",
        }
    }
    });

    // sequelize.sync({
    //     force: true})
    return Photo;
}; 