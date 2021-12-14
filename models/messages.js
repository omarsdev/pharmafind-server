"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Chats, {
        foreignKey: "chatId",
      });
    }
  }
  Messages.init(
    {
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Message must have a value" },
          notEmpty: { msg: "Message must not be an empty" },
        },
      },
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Chat id must have a value" },
          notEmpty: { msg: "Chat id must not be an empty" },
        },
      },
      fromUserId: DataTypes.INTEGER,
      fromPharmacyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Messages",
    }
  );
  return Messages;
};
