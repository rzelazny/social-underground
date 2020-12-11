// Creating our model of webcam photos
module.exports = function(sequelize, DataTypes) {
    var Photo = sequelize.define("photo", {

    photo: {
        type: DataTypes.BLOB,
        allowNull: false,
        get () { // define a getter
            const data = this.getDataValue('photo')
            return data ? data.toString('base64') : ''
        },
        set(val) {
            this.setDataValue('photo', val);
        }
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