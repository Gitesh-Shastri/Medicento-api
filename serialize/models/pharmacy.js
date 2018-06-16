module.exports = function (sequelize, DataTypes) {
    const Pharmacy = sequelize.define('Pharmacy', {
        pharma_name: DataTypes.STRING,
        pharma_paddress: DataTypes.TEXT,
        pharma_saddress: DataTypes.TEXT,
        pharma_mobile: DataTypes.STRING,
        pharma_tele: DataTypes.STRING,
        pharma_email: DataTypes.STRING,
        pharma_gst: DataTypes.STRING,
        pharma_license: DataTypes.STRING,
        pharma_contact_name: DataTypes.STRING,
        pharma_contact_number: DataTypes.STRING
    });
    Pharmacy.associate = function (models) {
        Pharmacy.belongsTo(models.Area, {
            foreignKey: {
                allowNull: false
            }
        })
    }
    return Pharmacy;
};