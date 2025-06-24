import { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import "./AdminAllUsers.css";

import ConfirmDeleteModal from "../ConfirmDeleteModal";

function AdminAllUsers({ allUsers, loading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedIds, setDeletedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const usersPerPage = 5;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = allUsers.filter((user) => !deletedIds.includes(user.id));
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="custom-loader"></div>
        <p className="loading-text">Loading users...</p>
      </div>
    );
  }

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found");
      return;
    }

    try {
      const response = await fetch(`http://localhost/admin/user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        toast.error("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      if (!response.ok) throw new Error("Failed to delete");

      setDeletedIds((prev) => [...prev, id]);
      setIsModalOpen(false);
      setSelectedUser(null);

      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error occurred while deleting user");
    }
  };

  return (
    <div className="admin-all-users">
      <div className="header-section">
        <span id="icon-users">
          <FaUserFriends size={40} />
        </span>
        <h2 id="Header"> User Management</h2>
        <input
          type="text"
          placeholder="Search user..."
          className="search-box"
        />
      </div>

      <table className="user-table">
        <thead>
          <tr className="column-header">
            <th>Picture</th>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <img src={user.picture} alt={user.name} className="user-img" />
              </td>
              <td className="column-fullname">{user.name}</td>
              <td>@{user.username}</td>
              <td>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </td>
              <td className="column-joined">{user.joined}</td>
              <td>
                <div className="action-icons">
                  <FaRegEdit className="edit-icon" size={20} />
                  <MdDelete
                    className="delete-icon"
                    size={20}
                    onClick={() => handleDeleteClick(user)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <div className="page-indicator">
          Page {currentPage} of {totalPages}
        </div>

        <div className="page-nav-buttons">
          <button
            className="page-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <button
            className="page-btn"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        user={selectedUser}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => handleConfirmDelete(selectedUser?.id)}
      />
    </div>
  );
}

export default AdminAllUsers;
