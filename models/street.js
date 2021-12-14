"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Street extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.City, {
        foreignKey: "cityId",
      });
      this.hasMany(models.Pharmacy, {
        foreignKey: "streetId",
      });
    }
  }
  Street.init(
    {
      name_en: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Street must have a name in english" },
          notEmpty: { msg: "Street english name must not be an empty" },
        },
      },
      name_ar: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Street must have a name in arabic" },
          notEmpty: { msg: "Street arabic name must not be an empty" },
        },
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "City ID must have an ID" },
          notEmpty: { msg: "City ID must not be an empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "Street",
    }
  );
  return Street;
};
