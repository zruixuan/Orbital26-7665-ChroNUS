import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Eisenhower from "./pages/Eisenhower";
import WeeklyReflection from "./pages/WeeklyReflection";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />
      
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/eisenhower" element={<Eisenhower />} />

      <Route path="/weekly-reflection" element={<WeeklyReflection />} />

      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App;