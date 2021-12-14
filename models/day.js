"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Day extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.ScheduleTime, {
        through: "ScheduleTimeDays",
        foreignKey: "day_id",
      });
    }
  }
  Day.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Day must have a name" },
          notEmpty: { msg: "Day name must not be an empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "Day",
    }
  );
  return Day;
};
