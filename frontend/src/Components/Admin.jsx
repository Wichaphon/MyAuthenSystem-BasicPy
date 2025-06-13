import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import "./ProfilePage.css"

export default function Admin() {

    return (
        <body>
            <div className="dashboard">
                <aside className="sidebar">
                    <div className="sidebar-header">Admin panel</div>
                    <nav>
                        <ul>
                            <li className="active">Users</li>
                            <li>Setting</li>
                        </ul>
                    </nav>
                    <div className="logout">Log out</div>
                </aside>

                <main className="main">
                    <header className="main-header">
                        <div className="title">User Management</div>
                        <div className="admin-info">
                            <img src="" alt="Admin" className="avatar"/>
                            <div className="">
                                <span className="Role">Admin</span>
                            </div>
                        </div>
                    </header>

                    <section className="table-section">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*  */}
                            </tbody>
                        </table>
                        <div className="pagination"></div>
                    </section>
                </main>
            </div>
        </body>
    )
}