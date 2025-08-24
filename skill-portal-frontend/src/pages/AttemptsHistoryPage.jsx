// src/pages/AttemptsHistoryPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserAttempts } from "../services/quizService";

export default function AttemptsHistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadAttempts();
  }, []);

  async function loadAttempts() {
    try {
      setLoading(true);
      setError("");
      const attemptsRes = await fetchUserAttempts();
      setAttempts(attemptsRes.data?.data || []);
    } catch {
      setError("⚠️ Failed to load attempts.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-center sm:text-left">
          Attempts History
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {loading && <p className="text-blue-600 text-center">Loading...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {attempts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 shadow-sm bg-white">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-3">Skill</th>
                <th className="border p-3">Score</th>
                <th className="border p-3">Date</th>
                <th className="border p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-gray-50">
                  <td className="border p-3">{attempt.Skill?.name}</td>
                  <td className="border p-3">{attempt.score}%</td>
                  <td className="border p-3">
                    {attempt.createdAt
                      ? new Date(attempt.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="border p-3">
                    <button
                      onClick={() => navigate(`/attempt/${attempt.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No attempts found.</p>
      )}
    </div>
  );
}
    