"use strict";
const { Model } = require("sequelize");

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class Pharmacist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Pharmacy);
      this.hasMany(models.Report, {
        foreignKey: "pharmacistId",
      });
    }
    toJSON() {
      return {
        ...this.get(),
        password: undefined,
      };
    }
  }
  Pharmacist.init(
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
          msg: "This email is already taken.",
        },
        validate: {
          notNull: { msg: "Email must have a value" },
          notEmpty: { msg: "Email must not be an empty" },
          isEmail: { msg: "Email is not valid" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password must have a value" },
          notEmpty: { msg: "Password must not be an empty" },
        },
      },
      isApprove: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Pharmacist",
      hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword,
      },
    }
  );
  return Pharmacist;
};

const hashPassword = async (pharmacist) => {
  if (pharmacist.changed("password")) {
    pharmacist.password = await bcrypt.hash(pharmacist.password, 10);
  }

  return pharmacist;
};
