import { useNavigate } from "react-router-dom";
import { getAllQuestions } from "../services/questionService";

export function StartQuiz({ skillId }) {
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      const { data } = await getAllQuestions({ skillId });
      navigate(`/quiz/${skillId}`, { state: { skillId, questions: data } });
    } catch (err) {
      console.error(err);
      alert("Could not load quiz questions");
    }
  };

  return (
    <button
      onClick={handleStart}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Start Quiz
    </button>
  );
}
