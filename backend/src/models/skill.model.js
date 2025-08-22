import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Skill = sequelize.define(
  "Skill",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true }
  },
  { timestamps: true, tableName: "skills" }
);

export default Skill;