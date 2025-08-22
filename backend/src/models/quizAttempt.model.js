import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Skill from "./skill.model.js";
import User from "./user.model.js";

const QuizAttempt = sequelize.define(
  "QuizAttempt",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    totalQuestions: { type: DataTypes.INTEGER, allowNull: false },
    correctAnswers: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { timestamps: true, tableName: "quiz_attempts" }
);

User.hasMany(QuizAttempt, { foreignKey: "userId" });
QuizAttempt.belongsTo(User, { foreignKey: "userId" });

Skill.hasMany(QuizAttempt, { foreignKey: "skillId" });
QuizAttempt.belongsTo(Skill, { foreignKey: "skillId" });

export default QuizAttempt;
