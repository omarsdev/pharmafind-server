"use strict";
const { Model } = require("sequelize");

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON() {
      return {
        ...this.get(),
        password: undefined,
      };
    }
  }
  Employee.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "First name must have a value" },
          notEmpty: { msg: "First name must not be an empty" },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Last name must have a value" },
          notEmpty: { msg: "Last name must not be an empty" },
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
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Phone number must have a value" },
          notEmpty: { msg: "Phone number must not be an empty" },
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
    },
    {
      sequelize,
      modelName: "Employee",
      hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword,
      },
    }
  );
  return Employee;
};

const hashPassword = async (employee) => {
  if (employee.changed("password")) {
    employee.password = await bcrypt.hash(employee.password, 10);
  }

  return employee;
};
