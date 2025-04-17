import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from './pages/login';
import { jwtDecode } from "jwt-decode";

// Employer Pages
import EmployerDashboard from "./pages/employer/dashboard"
import ManagersPage from "./pages/employer/managers"
import LeadsPage from "./pages/employer/leads"

// Manager Pages
import ManagerLeadsPage from "./pages/manager/leads"

// Auth Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token")

  const getUserRole = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return "";
      const decoded = jwtDecode(token);
      return decoded.role || "";
    } catch (err) {
      console.error("Invalid token", err);
      return "";
    }
  }

  const userRole = getUserRole()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === "employer") {
      return <Navigate to="/employer/dashboard" replace />
    } else if (userRole === "manager") {
      return <Navigate to="/manager/leads" replace />
    } else {
      return <Navigate to="/login" replace />
    }
  }

  return children
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Employer Routes */}
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/managers"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <ManagersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/leads"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <LeadsPage />
            </ProtectedRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager/leads"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerLeadsPage />
            </ProtectedRoute>
          }
        />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
