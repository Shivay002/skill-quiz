import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Question from "./question.model.js";
import QuizAttempt from "./quizAttempt.model.js";

const QuizAnswer = sequelize.define(
  "QuizAnswer",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    selectedOption: { type: DataTypes.INTEGER, allowNull: false },
    isCorrect: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  { timestamps: true, tableName: "quiz_answers" }
);

QuizAttempt.hasMany(QuizAnswer, { foreignKey: "attemptId", onDelete: "CASCADE" });
QuizAnswer.belongsTo(QuizAttempt, { foreignKey: "attemptId" });

Question.hasMany(QuizAnswer, { foreignKey: "questionId" });
QuizAnswer.belongsTo(Question, { foreignKey: "questionId" });

export default QuizAnswer;
