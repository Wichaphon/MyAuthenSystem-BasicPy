import { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from '../Components/LoginForm';
import RegisterForm from '../Components/RegisterForm';
import ProfilePage from '../Components/ProfilePage';

const AppRoutes = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  //ดัก token เปลี่ยนจาก login/logout
  useEffect(() => {
    const syncToken = () => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    };

    window.addEventListener("storage", syncToken);
    window.addEventListener("tokenChange", syncToken); //custom event 
    return () => {
      window.removeEventListener("storage", syncToken);
      window.removeEventListener("tokenChange", syncToken);
    };
  }, []);

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
    </Routes>
  );
};

export default AppRoutes;
