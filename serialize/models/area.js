module.exports = function(sequelize, DataTypes) {
    const Area = sequelize.define('Area', {
        area_name: DataTypes.STRING,
        area_city: DataTypes.STRING,
        area_state: DataTypes.STRING,
        area_pincode: DataTypes.STRING
    });
    return Area;
};