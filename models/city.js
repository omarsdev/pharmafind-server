"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Country, {
        foreignKey: "countryId",
      });
      this.hasMany(models.Street, {
        foreignKey: "cityId",
      });
    }
  }
  City.init(
    {
      name_en: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "City must have a name in english" },
          notEmpty: { msg: "City english name must not be an empty" },
        },
      },
      name_ar: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "City must have a name in arabic" },
          notEmpty: { msg: "City arabic name must not be an empty" },
        },
      },
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Country ID must have an ID" },
          notEmpty: { msg: "Country ID must not be an empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "City",
    }
  );
  return City;
};
