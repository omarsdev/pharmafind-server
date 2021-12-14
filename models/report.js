"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
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
      this.belongsTo(models.Pharmacist, {
        foreignKey: "pharmacistId",
      });
    }
  }
  Report.init(
    {
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {},
      },
      userId: DataTypes.INTEGER,
      pharmacistId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Report",
    }
  );
  return Report;
};
