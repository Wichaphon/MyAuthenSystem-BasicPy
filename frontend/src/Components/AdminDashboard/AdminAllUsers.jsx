import { useState, useEffect, useCallback } from "react";
import { FaUserFriends } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import "./AdminAllUsers.css";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import EditUserModal from "../EditUserModal";

function AdminAllUsers({ allUsers = [], loading, setAllUsers }) {
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedIds, setDeletedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const usersPerPage = 5;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const filteredUsers = Array.isArray(allUsers)
    ? allUsers.filter((u) => {
        if (!u || typeof u.id === "undefined" || deletedIds.includes(u.id)) {
          if (!u)
            console.warn("Filtered out a null/undefined user from allUsers.");
          else if (typeof u.id === "undefined")
            console.warn("Filtered out user without 'id':", u);
          return false;
        }
        return true;
      })
    : [];

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage)
  );

  const handleDeleteClick = useCallback((user) => {
    if (!user || typeof user.id === "undefined") {
      console.error(
        "Error: User object for delete is invalid or missing ID.",
        user
      );
      toast.error("Cannot delete: Invalid user data.");
      return;
    }
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleEditClick = useCallback((user) => {
    if (!user || typeof user.id === "undefined") {
      console.error(
        "Error: User object for edit is invalid or missing ID.",
        user
      );
      toast.error("Cannot edit: Invalid user data.");
      return;
    }
    console.log("✨ AdminAllUsers: handleEditClick called with user:", user);
    setEditUser(user);
    setEditOpen(true);
  }, []);

  const handleConfirmDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found");
      return;
    }
    if (typeof id === "undefined" || id === null) {
      console.error("Error: Cannot confirm delete, user ID is missing.");
      toast.error("Delete failed: User ID is missing.");
      return;
    }

    try {
      const res = await fetch(`http://localhost/admin/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error("Session expired");
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || "Network response was not ok");
      }

      setDeletedIds((prev) => [...prev, id]);
      setIsModalOpen(false);
      setSelectedUser(null);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(`Delete failed: ${error.message || "Unknown error"}`);
    }
  };

  const fetchAllUsers = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Failed to fetch users" }));
        throw new Error(errorData.message || "Network response was not ok");
      }

      const data = await res.json();

      if (Array.isArray(data.users)) {
        const validUsers = data.users.filter((u) => {
          if (!u || typeof u.id === "undefined") {
            return false;
          }
          return true;
        });
        setAllUsers(validUsers);
      } else {
        setAllUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      toast.error(`Failed to load users: ${error.message || "Unknown error"}`);
      setAllUsers([]);
    } finally {
    }
  }, [setAllUsers]);

  const performSearch = useCallback(
    async (keyword) => {
      if (!keyword.trim()) {
        fetchAllUsers();
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      setSearching(true);

      try {
        const res = await fetch(
          `http://localhost/admin/search?keyword=${encodeURIComponent(
            keyword
          )}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 401 || res.status === 403) {
          toast.error("Session expired. Please log in again.");
          localStorage.clear();
          window.location.href = "/";
          return;
        }

        if (!res.ok) {
          const errorData = await res
            .json()
            .catch(() => ({ message: "Search failed" }));
          throw new Error(errorData.message || "Network response was not ok");
        }

        const data = await res.json();

        const usersArr = Array.isArray(data.users) ? data.users : [];
        const validUsers = usersArr.filter((u) => {
          if (!u || typeof u.id === "undefined") {
            return false;
          }
          return true;
        });
        setAllUsers(validUsers);
        setCurrentPage(1);

        if (validUsers.length === 0)
          toast.info("No users found matching your search.");
      } catch (error) {
        console.error("Search failed:", error);
        toast.error(`Search failed: ${error.message || "Unknown error"}`);
        setAllUsers([]);
      } finally {
        setSearching(false);
      }
    },
    [fetchAllUsers, setAllUsers]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch(searchTerm);
      }
    },
    [performSearch, searchTerm]
  );

  const handleUserSaved = useCallback(
    (updatedUser) => {
      if (!updatedUser || typeof updatedUser.id === "undefined") {
        console.error(
          "Error: updatedUser is invalid or missing ID:",
          updatedUser
        );
        toast.error("Update failed: Invalid user data returned.");
        setEditOpen(false);
        setEditUser(null);
        return;
      }

      setAllUsers((prev) => {
        const newList = prev
          .map((u) => {
            if (!u || typeof u.id === "undefined") {
              return null;
            }
            return u.id === updatedUser.id ? updatedUser : u;
          })
          .filter(Boolean);

        return newList;
      });

      setEditOpen(false);
      setEditUser(null);
    },
    [setAllUsers]
  );

  if (loading) {
    return (
      <div className="loader-container">
        <div className="custom-loader"></div>
        <p className="loading-text">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="admin-all-users">
      <div className="header-section">
        <span id="icon-users">
          <FaUserFriends size={40} />
        </span>
        <h2 id="Header">User Management</h2>

        <div className="search-wrapper">
          {searching && (
            <div className="search-loading">
              <div className="custom-loader small" />
              <span className="loading-msg">Searching…</span>
            </div>
          )}
          <input
            className="search-box"
            type="text"
            placeholder="Search user…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
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
          {currentUsers
            .filter((u) => u && typeof u.id !== "undefined")
            .map((u) => (
              <tr key={u.id}>
                <td>
                  <img
                    className="user-img"
                    src={u.picture || "/default-user.png"}
                    alt={u.name || "Unknown"}
                  />
                </td>
                <td className="column-fullname">{u.name}</td>
                <td>@{u.username}</td>
                <td>
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                </td>
                <td className="column-joined">{u.joined}</td>
                <td>
                  <div className="action-icons">
                    <FaRegEdit
                      size={20}
                      className="edit-icon"
                      onClick={() => handleEditClick(u)}
                    />
                    <MdDelete
                      size={20}
                      className="delete-icon"
                      onClick={() => handleDeleteClick(u)}
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
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </button>
          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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

      {editOpen && editUser && (
        <EditUserModal
          open={editOpen}
          user={editUser}
          onClose={() => setEditOpen(false)}
          onSaved={handleUserSaved}
        />
      )}
    </div>
  );
}

export default AdminAllUsers;
