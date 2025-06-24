import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginForm from "../Components/LoginForm";
import RegisterForm from "../Components/RegisterForm";
import ProfilePage from "../Components/ProfilePage";
import AdminApp from "../Components/AdminDashboard/AdminApp";

const AppRoutes = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route
        path="/profile"
        element={
          token ? <ProfilePage /> : <Navigate to="/" />
        }
      />
      <Route
        path="/dashboard"
        element={
          token ? <AdminApp /> : <Navigate to="/" />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
