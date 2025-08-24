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
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctOption: null,
  });
  const [editId, setEditId] = useState(null);
  const [showFormForSkill, setShowFormForSkill] = useState(null);

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
      const questionsForSkill = data.data.details
        ? data.data.details[0].questions
        : [];
      setQuestionsBySkill((prev) => ({
        ...prev,
        [skillId]: questionsForSkill,
      }));
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

    if (
      !formData.text ||
      !formData.skillId ||
      !formData.option1 ||
      !formData.option2 ||
      !formData.option3 ||
      !formData.option4
    ) {
      toast.error("All fields are required");
      return;
    }
    const optionsArray = [
      formData.option1.trim(),
      formData.option2.trim(),
      formData.option3.trim(),
      formData.option4.trim(),
    ];

    if (optionsArray.some((o) => !o)) {
      toast.error("All 4 options are required");
      return;
    }

    if (formData.correctOption === null) {
      toast.error("Please select the correct option");
      return;
    }
    const payload = {
      text: formData.text.trim(),
      skillId: formData.skillId,
      options: optionsArray,
      correctOption: formData.correctOption,
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
      skillId,
      option1: q.options[0] || "",
      option2: q.options[1] || "",
      option3: q.options[2] || "",
      option4: q.options[3] || "",
      correctOption: q.correctOption,
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
          {skills.map((skill) => (
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
                              <td className="border p-2">
                                {q.options.join(", ")}
                              </td>
                              <td className="border p-2">
                                {q.options[q.correctOption]}
                              </td>
                              <td className="border p-2 space-x-2">
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => handleEdit(skill.id, q)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs border border-yellow-500 text-yellow-600 rounded hover:bg-yellow-50 transition"
                                    title="Edit question"
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(skill.id, q.id)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs border border-red-500 text-red-600 rounded hover:bg-red-50 transition"
                                    title="Delete question"
                                  >
                                    🗑 Delete
                                  </button>
                                </div>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[0, 1, 2, 3].map((idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="correctOption"
                                value={idx}
                                checked={formData.correctOption === idx}
                                onChange={() =>
                                  setFormData({
                                    ...formData,
                                    correctOption: idx,
                                  })
                                }
                              />
                              <input
                                type="text"
                                placeholder={`Option ${idx + 1}`}
                                value={formData[`option${idx + 1}`] || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    [`option${idx + 1}`]: e.target.value,
                                  })
                                }
                                className="border p-2 w-full"
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                          >
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
