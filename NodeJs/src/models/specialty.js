"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here    
      Specialty.hasMany(models.Doctor_Info, {
        foreignKey: "specialtyId",
        as: "specialtyTypeData",
      });
    }
  }
  Specialty.init(
    {
      name: DataTypes.STRING,
      contentMarkdown: DataTypes.TEXT,
      contentHTML: DataTypes.TEXT,
      image: DataTypes.BLOB("long"),
    },
    {
      sequelize,
      modelName: "Specialty",
    }
  );
  return Specialty;
};
