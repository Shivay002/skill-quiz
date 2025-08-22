import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    createQuestion,
    deleteQuestion,
    getAllQuestions,
    updateQuestion,
} from "../../services/questionService";
import { getAllSkills } from "../../services/skillService";

export default function ManageQuestions() {
  const [skills, setSkills] = useState([]);
  const [expandedSkillId, setExpandedSkillId] = useState(null);
  const [questionsBySkill, setQuestionsBySkill] = useState({});
  const [formData, setFormData] = useState({
    text: "",
    skillId: "",
    options: "",
    answer: "",
  });
  const [editId, setEditId] = useState(null);
  const [showFormForSkill, setShowFormForSkill] = useState(null);

  // Load all skills
  async function loadSkills() {
    try {
      const { data } = await getAllSkills();
      setSkills(data || []);
    } catch {
      toast.error("Failed to load skills");
    }
  }

async function loadQuestions(skillId) {
  try {
    const { data } = await getAllQuestions({ skillId });
    const skillsArr = data.data || [];
    const questionsForSkill = skillsArr.find(s => s.skillId === skillId)?.questions || [];
    setQuestionsBySkill(prev => ({ ...prev, [skillId]: questionsForSkill }));
  } catch {
    toast.error("Failed to load questions");
  }
}


  useEffect(() => {
    loadSkills();
  }, []);

  function toggleSkill(skillId) {
    if (expandedSkillId === skillId) {
      setExpandedSkillId(null);
      return;
    }
    setExpandedSkillId(skillId);
    loadQuestions(skillId);
    setShowFormForSkill(null);
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.text || !formData.skillId || !formData.options || !formData.answer) {
      toast.error("All fields are required");
      return;
    }

    const optionsArray = formData.options.split(",").map((o) => o.trim());
    const answerIndex = optionsArray.indexOf(formData.answer.trim());

    if (answerIndex === -1) {
      toast.error("Correct answer must match one of the options");
      return;
    }

    const payload = {
      text: formData.text.trim(),
      skillId: formData.skillId,
      options: optionsArray,
      correctOption: answerIndex,
    };

    try {
      if (editId) {
        await updateQuestion(editId, payload);
        toast.success("Question updated successfully");
      } else {
        await createQuestion(payload);
        toast.success("Question added successfully");
      }
      resetForm();
      loadQuestions(formData.skillId);
    } catch {
      toast.error("Failed to save question");
    }
  }

  function handleEdit(skillId, q) {
    setFormData({
      text: q.text,
      skillId: skillId,
      options: q.options.join(", "),
      answer: q.options[q.correctOption] || "",
    });
    setEditId(q.id);
    setShowFormForSkill(skillId);
  }

  async function handleDelete(skillId, id) {
    try {
      await deleteQuestion(id);
      toast.success("Question deleted");
      loadQuestions(skillId);
    } catch {
      toast.error("Failed to delete question");
    }
  }

  function resetForm() {
    setFormData({ text: "", skillId: "", options: "", answer: "" });
    setEditId(null);
    setShowFormForSkill(null);
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Questions</h2>

      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Skill Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map(skill => (
            <>
              <tr
                key={skill.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSkill(skill.id)}
              >
                <td className="border p-2">{skill.name}</td>
                <td className="border p-2">{skill.description || "-"}</td>
                <td className="border p-2 text-center">
                  {expandedSkillId === skill.id ? "▲" : "▼"}
                </td>
              </tr>

              {expandedSkillId === skill.id && (
                <tr>
                  <td colSpan="3" className="border p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold">Questions</h3>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => {
                          setFormData({ ...formData, skillId: skill.id });
                          setShowFormForSkill(skill.id);
                          setEditId(null);
                        }}
                      >
                        Add Question
                      </button>
                    </div>

                    {/* Question Table */}
                    <table className="table-auto border-collapse border border-gray-300 w-full mb-3">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">Question</th>
                          <th className="border p-2">Options</th>
                          <th className="border p-2">Correct Answer</th>
                          <th className="border p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {questionsBySkill[skill.id]?.length > 0 ? (
                          questionsBySkill[skill.id].map((q) => (
                            <tr key={q.id}>
                              <td className="border p-2">{q.text}</td>
                              <td className="border p-2">{q.options.join(", ")}</td>
                              <td className="border p-2">{q.options[q.correctOption]}</td>
                              <td className="border p-2 space-x-2">
                                <button
                                  onClick={() => handleEdit(skill.id, q)}
                                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(skill.id, q.id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="border p-2 text-center">
                              No questions found for this skill
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Add/Edit Form */}
                    {showFormForSkill === skill.id && (
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                          type="text"
                          name="text"
                          placeholder="Question"
                          value={formData.text}
                          onChange={handleChange}
                          className="border p-2 w-full"
                        />
                        <input
                          type="text"
                          name="options"
                          placeholder="Options (comma separated)"
                          value={formData.options}
                          onChange={handleChange}
                          className="border p-2 w-full"
                        />
                        <input
                          type="text"
                          name="answer"
                          placeholder="Correct Answer"
                          value={formData.answer}
                          onChange={handleChange}
                          className="border p-2 w-full"
                        />
                        <div>
                          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            {editId ? "Update Question" : "Add Question"}
                          </button>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-400 text-white px-4 py-2 rounded ml-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
