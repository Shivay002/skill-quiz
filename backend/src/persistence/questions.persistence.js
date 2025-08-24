import { Op } from "sequelize";
import Question from "../models/question.model.js";
import Skill from "../models/skill.model.js";
import { getPagination } from "../utils/pagination.utils.js";

export async function createQuestion(data) {
  return await Question.create(data);
}

export async function findQuestionById(id) {
  return await Question.findByPk(id, { include: Skill });
}

export async function updateQuestion(id, data) {
  const q = await Question.findByPk(id);
  if (!q) return null;
  await q.update(data);
  return q;
}

export async function deleteQuestion(id) {
  const q = await Question.findByPk(id);
  if (!q) return null;
  await q.destroy();
  return true;
}

export async function paginateQuestions(query) {
  const { page, limit, offset } = getPagination(query);

  const where = {};
  if (query.search) {
    where.text = { [Op.like]: `%${query.search}%` };
  }
  if (query.skillId) {
    where.skillId = parseInt(query.skillId, 10);
  }
 const ques =  [// Sequelize (skillId: 5)
{
  text: "Which method is used to define a model in Sequelize?",
  options: ["sequelize.create()", "sequelize.define()", "Model.define()", "sequelize.model()"],
  correctOption: 1,
  difficulty: "easy",
  skillId: 5,
},
{
  text: "What does Sequelize's sync() method do?",
  options: ["Creates migrations", "Drops all data", "Syncs models with DB tables", "Seeds test data"],
  correctOption: 2,
  difficulty: "medium",
  skillId: 5,
},
{
  text: "How do you specify a primary key in a Sequelize model?",
  options: ["primary: true", "key: primary", "primaryKey: true", "PK: true"],
  correctOption: 2,
  difficulty: "easy",
  skillId: 5,
},
{
  text: "Which Sequelize data type is used for JSON storage?",
  options: ["DataTypes.STRING", "DataTypes.OBJECT", "DataTypes.JSON", "DataTypes.TEXT"],
  correctOption: 2,
  difficulty: "easy",
  skillId: 5,
},

// MySQL (skillId: 6)
{
  text: "Which command lists all databases in MySQL?",
  options: ["SHOW DATABASES;", "LIST DB;", "DISPLAY DATABASES;", "SELECT * FROM DATABASES;"],
  correctOption: 0,
  difficulty: "easy",
  skillId: 6,
},
{
  text: "What is the default port number for MySQL?",
  options: ["3306", "5432", "1433", "27017"],
  correctOption: 0,
  difficulty: "easy",
  skillId: 6,
},
{
  text: "Which SQL statement is used to update data in a MySQL table?",
  options: ["UPDATE", "CHANGE", "ALTER", "MODIFY"],
  correctOption: 0,
  difficulty: "easy",
  skillId: 6,
},
{
  text: "Which MySQL storage engine supports transactions?",
  options: ["MyISAM", "InnoDB", "Memory", "CSV"],
  correctOption: 1,
  difficulty: "medium",
  skillId: 6,
},

// PostgreSQL (skillId: 7)
{
  text: "What is the default port for PostgreSQL?",
  options: ["3306", "5432", "1433", "1521"],
  correctOption: 1,
  difficulty: "easy",
  skillId: 7,
},
{
  text: "Which psql command lists all databases?",
  options: ["\\l", "\\d", "\\db", "\\list"],
  correctOption: 0,
  difficulty: "easy",
  skillId: 7,
},
{
  text: "Which PostgreSQL type stores JSON efficiently?",
  options: ["TEXT", "JSON", "JSONB", "BLOB"],
  correctOption: 2,
  difficulty: "medium",
  skillId: 7,
},
{
  text: "What is the default superuser name in PostgreSQL?",
  options: ["root", "postgres", "admin", "superuser"],
  correctOption: 1,
  difficulty: "easy",
  skillId: 7,
},

// HTML (skillId: 8)
{
  text: "What does HTML stand for?",
  options: [
    "HyperText Markup Language",
    "Hyperlinks and Text Markup Language",
    "Home Tool Markup Language",
    "Hyperlinking Text Management Language"
  ],
  correctOption: 0,
  difficulty: "easy",
  skillId: 8,
},
{
  text: "Which HTML tag creates a hyperlink?",
  options: ["<link>", "<a>", "<href>", "<hyperlink>"],
  correctOption: 1,
  difficulty: "easy",
  skillId: 8,
},
{
  text: "Which HTML element is used to embed JavaScript?",
  options: ["<javascript>", "<js>", "<script>", "<code>"],
  correctOption: 2,
  difficulty: "easy",
  skillId: 8,
},
{
  text: "Which is the correct HTML5 doctype declaration?",
  options: [
    "<!DOCTYPE html5>",
    "<DOCTYPE html>",
    "<!DOCTYPE HTML>",
    "<!DOCTYPE html>"
  ],
  correctOption: 3,
  difficulty: "easy",
  skillId: 8,
},

// CSS (skillId: 9)
{
  text: "What does CSS stand for?",
  options: [
    "Creative Style Sheets",
    "Cascading Style Sheets",
    "Computer Style Sheets",
    "Colorful Style Sheets"
  ],
  correctOption: 1,
  difficulty: "easy",
  skillId: 9,
},
{
  text: "Which property changes text color in CSS?",
  options: ["color", "font-color", "text-color", "font-style"],
  correctOption: 0,
  difficulty: "easy",
  skillId: 9,
},
{
  text: "How do you select an element with id 'main' in CSS?",
  options: ["#main", ".main", "*main", "id.main"],
  correctOption: 0,
  difficulty: "easy",
  skillId: 9,
},
{
  text: "Which CSS position value fixes an element relative to the viewport?",
  options: ["relative", "absolute", "fixed", "static"],
  correctOption: 2,
  difficulty: "medium",
  skillId: 9,
},

// Git (skillId: 10)
{
  text: "Which command initializes a Git repository?",
  options: ["git start", "git init", "git new", "git create"],
  correctOption: 1,
  difficulty: "easy",
  skillId: 10,
},
{
  text: "Which command stages all changes for commit?",
  options: ["git commit .", "git add -A", "git push", "git stage all"],
  correctOption: 1,
  difficulty: "easy",
  skillId: 10,
},
{
  text: "Which command creates a new Git branch?",
  options: ["git branch", "git new-branch", "git checkout -b", "git create branch"],
  correctOption: 0,
  difficulty: "easy",
  skillId: 10,
},
{
  text: "What is the default branch name in newer Git versions?",
  options: ["master", "main", "develop", "production"],
  correctOption: 1,
  difficulty: "medium",
  skillId: 10,
},
]
await Question.bulkCreate(ques)
  const { rows, count } = await Question.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "ASC"]],
    include: [{ model: Skill }],
  });
  const plainRows = JSON.parse(JSON.stringify(rows));

  const skills = plainRows.reduce((acc, question) => {
    const skillId = question.Skill?.id || null;
    const skillName = question.Skill?.name || "Unknown Skill";
    if (!skillId) return acc;
    const { Skill: _removed, ...questionWithoutSkill } = question;

    let skillGroup = acc.find((g) => g.skillId === skillId);
    if (!skillGroup) {
      skillGroup = {
        skillId,
        name: skillName,
        questions: [],
      };
      acc.push(skillGroup);
    }

    skillGroup.questions.push(questionWithoutSkill);
    return acc;
  }, []);

  return {
    skills,
    count,
    page,
    limit,
  };
}
