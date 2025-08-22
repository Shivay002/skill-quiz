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

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optionIndex) => {
    const updated = [...answers];
    updated[currentIndex] = {
      questionId: currentQuestion.id,
      selectedOption: optionIndex
    };
    setAnswers(updated);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      try {
        await submitAttempt(skillId, answers);
        navigate("/dashboard");
      } catch {
        alert("Error submitting quiz");
      }
    }
  };

  if (!currentQuestion) return <p>No questions available</p>;

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
        disabled={answers[currentIndex] == null}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {currentIndex < questions.length - 1 ? "Next" : "Finish"}
      </button>
    </div>
  );
}
