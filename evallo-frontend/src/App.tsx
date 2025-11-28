import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/register";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
import PublicRoute from "./components/PublicRoutes/PublicRoute";

function App() {
  return (
    <div className="h-screen bg-slate-200">
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
