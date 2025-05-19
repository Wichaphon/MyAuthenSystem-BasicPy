import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:30002/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          throw new Error("Token expired or invalid");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        // redirect ถ้า token หมดอายุหรือผิด
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return <p className="loading-text">Loading...</p>;

  return (
    <div className="profile-container">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <div className="profile-card">
        <img src={user.picture} alt="Profile" className="profile-pic" />
        <h2>{user.myname}</h2>
        <p>{user.myposition}</p>
      </div>
    </div>
  );
};

export default Profile;
