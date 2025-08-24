// src/pages/QuizPage.jsx
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { submitAttempt } from "../services/quizService";

export default function QuizPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { skillId: skillIdParam } = useParams();

  const skillId = state?.skillId || parseInt(skillIdParam, 10);
  const questions = state?.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optionIndex) => {
    const updated = [...answers];
    updated[currentIndex] = {
      questionId: currentQuestion.id,
      selectedOption: optionIndex,
    };
    setAnswers(updated);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      try {
        setLoading(true);
        const { data } = await submitAttempt({ skillId, answers });
        setResults(data); // store entire attempt object
        setLoading(false);
      } catch (err) {
        setLoading(false);
        alert("Error submitting quiz");
      }
    }
  };

  if (!questions.length) {
    return <p className="text-center mt-10">No questions available</p>;
  }

  // Results view
  if (results) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2 text-center">
          {results.Skill?.name || "Quiz"} Results
        </h2>
        <p className="text-center text-lg mb-6">
          Score: <span className="font-bold">{results.score}%</span> (
          {results.correctAnswers}/{results.totalQuestions} correct)
        </p>

        {results.QuizAnswers?.map((ans, idx) => (
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

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Question view
  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-lg font-bold mb-4">
        Question {currentIndex + 1} of {questions.length}
      </h2>
      <p className="mb-4">{currentQuestion.text}</p>
      <div className="space-y-2 mb-6">
        {currentQuestion.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectOption(idx)}
            className={`block w-full text-left px-4 py-2 border rounded ${
              answers[currentIndex]?.selectedOption === idx
                ? "bg-blue-100 border-blue-500"
                : "border-gray-300"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={answers[currentIndex] == null || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading
          ? "Submitting..."
          : currentIndex < questions.length - 1
          ? "Next"
          : "Finish"}
      </button>
    </div>
  );
}
