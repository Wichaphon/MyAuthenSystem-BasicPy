import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProfilePage.css"

const ProfilePage = () =>{
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(null);

    useEffect(() =>{
        const token = localStorage.getItem("token");

        if (!token){
            navigate("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:30002/auth/profile", {
                    headers:{
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Invaild token");

                const data = await res.json();
                setUser(data);
            } catch (err) {
                localStorage.clear();
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    },[navigate]);

    const handleLogout = () =>{
        localStorage.clear();
        navigate("/");
    };

    if (loading) return <p className="loading-text">Loading...</p>;
    if (!user) return null;
  return (
    <div className="profile-page">
  <div className="profile-card">
    <img src={user.picture} alt="Profile" className="profile-pic" />
    <h2>{user.myname}</h2>
    <p>{user.myposition}</p>
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  </div>
</div>
  );
};

export default ProfilePage;