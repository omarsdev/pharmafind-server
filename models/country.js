"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.City, {
        foreignKey: "countryId",
      });
    }
  }
  Country.init(
    {
      name_en: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Country must have a name in english" },
          notEmpty: { msg: "Country english name must not be an empty" },
        },
      },
      name_ar: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Country must have a name in arabic" },
          notEmpty: { msg: "Country arabic name must not be an empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "Country",
    }
  );
  return Country;
};
