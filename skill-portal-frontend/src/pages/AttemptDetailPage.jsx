import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAttemptById } from "../services/quizService";

export default function AttemptDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttempt() {
      try {
        const { data } = await getAttemptById(id);
        setAttempt(data);
      } catch {
        alert("⚠️ Failed to load attempt details.");
      } finally {
        setLoading(false);
      }
    }
    loadAttempt();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!attempt) return <p className="text-center mt-6">Attempt not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-center">
        {attempt.Skill?.name || "Quiz"} Results
      </h2>
      <p className="text-center text-lg mb-6">
        Score: <span className="font-bold">{attempt.score}%</span> (
        {attempt.correctAnswers}/{attempt.totalQuestions} correct)
      </p>

      {attempt.QuizAnswers?.map((ans, idx) => (
        <div key={idx} className="border p-4 rounded mb-3">
          <p className="font-semibold mb-2">
            {idx + 1}. {ans.Question.text}
          </p>
          <p>Your answer: {ans.Question.options[ans.selectedOption]}</p>
          <p>Correct answer: {ans.Question.options[ans.Question.correctOption]}</p>
          <p className={ans.isCorrect ? "text-green-600" : "text-red-600"}>
            {ans.isCorrect ? "✅ Correct" : "❌ Incorrect"}
          </p>
        </div>
      ))}

      {/* Navigation buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate("/attempts-history")}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
        >
          Back to History
        </button>
      </div>
    </div>
  );
}
