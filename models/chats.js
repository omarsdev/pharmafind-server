"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        foreignKey: "userId",
      });
      this.belongsTo(models.Pharmacy, {
        foreignKey: "pharmacyId",
      });

      this.hasMany(models.Messages, {
        foreignKey: "chatId",
      });
    }
  }
  Chats.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User id must have a name in arabic" },
          notEmpty: { msg: "User id arabic name must not be an empty" },
        },
      },
      pharmacyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Pharmacy id must have a name in arabic" },
          notEmpty: { msg: "Pharmacy id arabic name must not be an empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "Chats",
    }
  );
  return Chats;
};
