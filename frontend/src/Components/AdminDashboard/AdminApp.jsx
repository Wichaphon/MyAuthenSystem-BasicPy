import "../../styles/AdminApp.css"
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

function AdminApp() {
    const user = {
        myname: "Wichaphon BtoX",
        myposition: "Intern Programmer",
        picture: "https://storage.googleapis.com/my-app-bucket-2025/wichaphon001.png", 
        role: "admin",
        address: "99/104 test test",
    };

    return (
        <div className="sidebar-container">
            <AdminSidebar />

            <div className="navbar-content">
                <AdminNavbar user={user} />
            </div>
        </div>

    )
}

export default AdminApp;