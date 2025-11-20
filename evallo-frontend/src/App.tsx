import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/register";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
