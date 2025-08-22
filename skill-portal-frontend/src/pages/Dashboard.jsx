// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import {
  fetchSkills,
  fetchUserAttempts,
  startQuiz,
  submitQuiz,
} from "../services/quizService";

export default function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const skillsRes = await fetchSkills();
      setSkills(skillsRes.data || skillsRes);

      const attemptsRes = await fetchUserAttempts();
      setAttempts(attemptsRes.data || attemptsRes);
    } catch (err) {
      setError("⚠️ Failed to load data. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStartQuiz(skillId) {
    try {
      setLoading(true);
      const { questions } = await startQuiz(skillId);

      navigate(`/quiz/${skillId}`, {
        state: { skillId, questions: questions.data },
      });
    } catch {
      setError("⚠️ Failed to start quiz.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitQuiz() {
    try {
      setLoading(true);
      const res = await submitQuiz(quiz.id, answers);
      alert("✅ Quiz submitted! Score: " + res.score);
      setQuiz(null);
      setSelectedSkill(null);
      loadData();
    } catch {
      setError("⚠️ Failed to submit quiz.");
    } finally {
      setLoading(false);
    }
  }

  function handleAnswerChange(questionId, value) {
    setAnswers({ ...answers, [questionId]: value });
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">User Dashboard</h1>
      <LogoutButton />
      {loading && <p className="text-blue-600 text-center">Loading...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {!loading && !quiz && (
        <>
          {/* Skills Section */}
          <h2 className="text-xl font-semibold mb-4">Available Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="border rounded-lg p-4 shadow-sm flex flex-col items-center bg-white hover:shadow-md transition"
              >
                <h3 className="text-lg font-medium mb-2">{skill.name}</h3>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => handleStartQuiz(skill.id)}
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>

          {/* Past Attempts Section */}
          <h2 className="text-xl font-semibold mb-4">Past Attempts</h2>
          {attempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 shadow-sm bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border p-3">Skill</th>
                    <th className="border p-3">Score</th>
                    <th className="border p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-gray-50">
                      <td className="border p-3">{attempt.skill?.name}</td>
                      <td className="border p-3">{attempt.score}</td>
                      <td className="border p-3">
                        {attempt.date
                          ? new Date(attempt.date).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No past attempts found.</p>
          )}
        </>
      )}

      {!loading && quiz && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">
            Quiz: {quiz.skill?.name}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitQuiz();
            }}
            className="space-y-6"
          >
            {quiz.questions.map((q) => (
              <div
                key={q.id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <p className="font-medium mb-3">{q.text}</p>
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) =>
                          handleAnswerChange(q.id, e.target.value)
                        }
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Quiz"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
