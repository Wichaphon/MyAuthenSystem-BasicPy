import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  const token = localStorage.getItem('token'); // เปลี่ยนได้ภายหลังถ้าใช้ context

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
