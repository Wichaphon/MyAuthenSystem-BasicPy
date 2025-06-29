import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminApp.css";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminAllUsers from "./AdminAllUsers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_API_URL } from "../config/api";

function AdminApp() {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch(`${BASE_API_URL}/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        const data = await res.json();
        if (data && data.myname) {
          setUserProfile(data);
        } else {
          console.error("Invalid profile response:", data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch(`${BASE_API_URL}/admin/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        const data = await res.json();
        if (data && Array.isArray(data.users)) {
          setAllUsers(data.users);
        } else {
          console.error("Invalid API response:", data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div className="sidebar-container">
      <AdminSidebar />
      <div className="navbar-content">
        <AdminNavbar user={userProfile} />
      </div>

      <div className="users-content">
        {loading ? (
          <div className="loader-container">
            <div className="custom-loader"></div>
            <div className="loading-text">Loading users...</div>
          </div>
        ) : (
          <AdminAllUsers
            allUsers={allUsers}
            setAllUsers={setAllUsers}
            loading={loading}
          />
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeButton={false}
        newestOnTop
      />
    </div>
  );
}

export default AdminApp;
