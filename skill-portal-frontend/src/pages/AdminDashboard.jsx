// src/pages/AdminDashboard.jsx
import { useState } from "react";
import LogoutButton from "../components/LogoutButton";
import ManageQuestions from "./admin/ManageQuestions";
import UserReports from "./admin/Reports";
import PerformancePage from "./PerformancePage";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("questions");

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>
      <LogoutButton />
      <div className="flex justify-center space-x-4 mb-8">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "questions" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("questions")}
        >
          Manage Questions
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "reports" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("reports")}
        >
          User Reports
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "performance"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </button>
      </div>

      {activeTab === "questions" && <ManageQuestions />}
      {activeTab === "reports" && <UserReports />}
      {activeTab === "performance" && <PerformancePage />}
    </div>
  );
}
