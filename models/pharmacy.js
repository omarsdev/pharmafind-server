"use strict";
const { Model } = require("sequelize");

const config = require("../config/app");

module.exports = (sequelize, DataTypes) => {
  class Pharmacy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.ScheduleTime, {
        through: "PharmacyTime",
        foreignKey: "pharmacyID",
      });
      this.belongsTo(models.Pharmacist, {
        foreignKey: "PharmacistId",
      });
      this.belongsTo(models.Street, {
        foreignKey: "streetId",
      });
      // this.belongsToMany(models.Users, {
      //   through: "Chats",
      //   as: "pharmacy",
      //   foreignKey: "pharmacyId",
      //   otherKey: "userId",
      // });
    }

    toJSON() {
      return {
        ...this.get(),
        PharmacistId: undefined,
      };
    }
  }
  Pharmacy.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "First name must have a value" },
          notEmpty: { msg: "First name must not be an empty" },
        },
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "First name must have a value" },
          notEmpty: { msg: "First name must not be an empty" },
        },
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Location latitude must have a value" },
          notEmpty: { msg: "Location latitude must not be an empty" },
        },
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Location longitude must have a value" },
          notEmpty: { msg: "Location longitude must not be an empty" },
        },
      },
      photo: {
        type: DataTypes.STRING,
        get() {
          let photo = this.getDataValue("photo");
          const id = this.getDataValue("id");
          if (photo) {
            photo = `${config.appUrl}:${config.appPort}/pharmacy/${id}/${photo}`;
          } else {
            photo =
              "https://i.pinimg.com/originals/57/1a/e3/571ae39ce1b3360b0cf852322b413bdb.png";
          }

          return photo;
        },
      },
      locationDescription: {
        type: DataTypes.STRING,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      PharmacistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Pharmacist id must have a value" },
          notEmpty: { msg: "Pharmacist id must not be an empty" },
        },
      },
      streetId: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        // validate: {
        //   notNull: { msg: "Street id must have a value" },
        //   notEmpty: { msg: "Street id must not be an empty" },
        // },
      },
      isOpen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Pharmacy",
    }
  );
  return Pharmacy;
};
