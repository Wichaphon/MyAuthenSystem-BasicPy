import {Route,Routes} from 'react-router-dom'
import LoginForm from '../Components/LoginForm';
import RegisterForm from '../Components/RegisterForm'
import ProfilePage from '../Components/ProfilePage'

const AppRoutes = () => {
  const token = localStorage.getItem('token'); // เปลี่ยนได้ภายหลังถ้าใช้ context

  return (
    <Routes>
        <Route path="/" element={<LoginForm/>} />
        <Route path="/register" element={<RegisterForm/>} />
        <Route path="/profile" element={token  ? <ProfilePage/> : <navigator to="/"/>} />
    </Routes>

  );
};

  export default AppRoutes

