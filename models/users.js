"use strict";
const { Model } = require("sequelize");

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Report, {
        foreignKey: "userId",
      });
      // this.belongsToMany(models.Pharmacy, {
      //   through: "Chats",
      //   as: "pharmacy",
      //   foreignKey: "userId",
      //   otherKey: "pharmacyId",
      // });
    }
    toJSON() {
      return {
        ...this.get(),
        password: undefined,
      };
    }
  }
  Users.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name must have a value" },
          notEmpty: { msg: "Name must not be an empty" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "This Email is already taken.",
        },
        validate: {
          notNull: { msg: "Email must have a value" },
          notEmpty: { msg: "Email must not be an empty" },
          isEmail: { msg: "Email is not valid" },
        },
      },
      password: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Users",
      hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword,
      },
    }
  );
  return Users;
};

const hashPassword = async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  return user;
};
