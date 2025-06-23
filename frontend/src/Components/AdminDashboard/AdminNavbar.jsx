import "./AdminNavbar.css";

function AdminNavbar({ user }) {
  return (
    <div className="navbar-main">
      <div className="navbar-content">
        <img src={user.picture} alt="profile" className="profile-img" />
        <div className="profile-info">
          <span className="myname">{user.myname}</span>
          <span className="role">{user.role}</span>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
