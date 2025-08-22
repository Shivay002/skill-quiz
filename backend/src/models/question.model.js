import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Skill from "./skill.model.js";

const Question = sequelize.define(
  "Question",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidOptions(value) {
          if (!Array.isArray(value) || value.length < 2) {
            throw new Error("At least two options are required");
          }
        },
      },
    },
    correctOption: { type: DataTypes.INTEGER, allowNull: false },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      defaultValue: "medium",
    },
    skillId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Skill, key: "id" },
      onDelete: "CASCADE",
    },
  },
  { timestamps: true, tableName: "questions" }
);

Skill.hasMany(Question, { foreignKey: "skillId" });
Question.belongsTo(Skill, { foreignKey: "skillId" });

export default Question;
