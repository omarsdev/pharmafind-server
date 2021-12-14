"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ScheduleTime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Day, {
        through: "ScheduleTimeDays",
        foreignKey: "schedule_time_id",
      });
      this.belongsToMany(models.Pharmacy, {
        through: "PharmacyTime",
        foreignKey: "scheduleTimeID",
      });
    }
  }
  ScheduleTime.init(
    {
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Start Date must have a value" },
          notEmpty: { msg: "Start Date must not be an empty" },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "End Date must have a value" },
          notEmpty: { msg: "End Date must not be an empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "ScheduleTime",
    }
  );
  return ScheduleTime;
};
