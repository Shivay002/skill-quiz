// src/pages/Landing.jsx
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Welcome to Skill Quiz App</h1>
        <p className="text-gray-600 mb-6">
          Sharpen your skills or manage quizzes — login or register to continue
        </p>
        <div className="space-y-4">
          <Link
            to="/login"
            className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
