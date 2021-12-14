"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PharmacyTime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.ScheduleTime, {
        foreignKey: "scheduleTimeID",
      });
      this.belongsTo(models.Pharmacy, {
        foreignKey: "pharmacyID",
      });
    }
  }
  PharmacyTime.init(
    {
      scheduleTimeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Schedule time id must have a value" },
          notEmpty: { msg: "Schedule time id must not be an empty" },
        },
      },
      pharmacyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Pharmacy id must have a value" },
          notEmpty: { msg: "Pharmacy id must not be an empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "PharmacyTime",
    }
  );
  return PharmacyTime;
};
