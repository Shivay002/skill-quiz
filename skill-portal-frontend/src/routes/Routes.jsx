// src/routes/Routes.jsx
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import UserReport from "../pages/admin/Reports.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AttemptDetailPage from "../pages/AttemptDetailPage.jsx";
import AttemptsHistoryPage from "../pages/AttemptsHistoryPage.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Landing from "../pages/HomePage.jsx";
import Login from "../pages/Login.jsx";
import PerformancePage from "../pages/PerformancePage.jsx";
import QuizPage from "../pages/QuizPage.jsx";
import Register from "../pages/Register.jsx";
import ReportsList from "../pages/ReportsList.jsx";

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  const user = JSON.parse(atob(token.split(".")[1]));
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="user">
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/reports" element={<ReportsList />} />
        <Route path="/reports/:userId" element={<UserReport />} />
        <Route path="/quiz/:skillId" element={<QuizPage />} />
        <Route path="/attempt/:id" element={<AttemptDetailPage />} />
        <Route path="/attempts-history" element={<AttemptsHistoryPage />} />
        <Route path="/performance" element={<PerformancePage />} />
      </Routes>
    </Router>
  );
}
