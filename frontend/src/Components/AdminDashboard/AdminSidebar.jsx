import "./AdminSidebar.css";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { useLocation , useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuBar = [
    {
      id: 1,
      name: "Users",
      icon: <FaUserFriends size={20} />,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Settings",
      icon: <MdOutlineSettings size={20} />,
      path: "/dashboard/settings",
    },
  ];

  const handleLogout = () =>{
        localStorage.clear();
        navigate("/");
    };
  return (
    <div className="content">
      <div className="sidebar-top">
        <div className="sidebar-header">
          <h2>AdminPanel</h2>
        </div>
        <div className="sidebar-sector">
          <ul className="menu-list">
            {menuBar.map((item) => (
              <li
                key={item.id}
                className={`menu-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="icon-bar">{item.icon}</span>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="logout-section" onClick={handleLogout}>
        <span className="menu-item">
          <span className="icon-bar">
            <LuLogOut size={20} />
          </span>
          <span>Log out</span>
        </span>
      </div>
    </div>
  );
}

export default AdminSidebar;
