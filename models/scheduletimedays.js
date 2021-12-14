"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ScheduleTimeDays extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Day, {
        foreignKey: "day_id",
      });
      this.belongsTo(models.ScheduleTime, {
        foreignKey: "schedule_time_id",
      });
    }
  }
  ScheduleTimeDays.init(
    {
      schedule_time_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Schedule time id must have a value" },
          notEmpty: { msg: "Schedule time id must not be an empty" },
        },
      },
      day_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Day id time id must have a value" },
          notEmpty: { msg: "Day id time id must not be an empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "ScheduleTimeDays",
    }
  );
  return ScheduleTimeDays;
};
