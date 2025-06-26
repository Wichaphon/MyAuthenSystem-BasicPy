// src/Components/AdminDashboard/AdminNavbar.jsx
import "./AdminNavbar.css";

function AdminNavbar({ user }) {
  return (
    <header className="navbar-main">
      <div className="navbar-content">
        
        {user ? (
          <img src={user.picture} alt="profile" className="profile-img" />
        ) : (
          <div className="skeleton skeleton-img" />
        )}

        <div className="profile-info">
          {user ? (
            <>
              <span className="myname">{user.myname}</span>
              <span className="role">{user.role}</span>
            </>
          ) : (
            <>
              <div className="skeleton skeleton-name" />
              <div className="skeleton skeleton-role" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
