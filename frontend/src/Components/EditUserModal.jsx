import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./EditUserModal.css"; 

function EditUserModal({ open, user, onClose, onSaved }) {
  const [form, setForm] = useState({
    username: "",
    myname: "", 
    myposition: "",
    address: "",
    roleId: 1,
  });

  const [savingField, setSavingField] = useState(null);

  useEffect(() => {
    if (user && typeof user.id !== 'undefined') {
      console.log("🔄 EditUserModal: Syncing form with user prop:", user);
      setForm({
        username: user.username ?? "",
        myname: user.name ?? "", 
        myposition: user.myposition ?? "",
        address: user.address ?? "",
        roleId: user.role === "admin" ? 2 : 1, 
      });
    } else {
        console.warn("EditUserModal: User prop is invalid or missing ID or role, cannot sync form:", user);
    }
  }, [user]);

  if (!open || !user || typeof user.id === 'undefined') {
    if (!open) console.log("EditUserModal: Modal is not open.");
    if (!user) console.warn("EditUserModal: User prop is null/undefined.");
    if (user && typeof user.id === 'undefined') console.warn("EditUserModal: User object is missing 'id'.", user);
    return null; 
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSingleFieldSave = async (fieldName) => {
    if (!user || typeof user.id === 'undefined') {
      console.error("Error: Cannot save, user object or ID is missing in modal.", user);
      toast.error("Save failed: Invalid user data.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("No token found");
        return;
    }

    setSavingField(fieldName); 
    try {
      const body = new FormData();

      if (fieldName !== "username" && form.username) {
        body.append("username", form.username);
      }

      if (typeof form[fieldName] !== 'undefined' && form[fieldName] !== null) {
        if (fieldName === 'roleId') {
            body.append('roleId', form[fieldName]); 
        } else {
            body.append(fieldName, form[fieldName]);
        }
      } else {
        console.warn(`Attempted to save field '${fieldName}' but its value is undefined/null in form:`, form[fieldName]);
      }

      console.log(`📡 EditUserModal: Sending PUT request to http://localhost/admin/user/${user.id} for field '${fieldName}'`);

      const res = await fetch(`http://localhost/admin/user/${user.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      if (res.status === 401 || res.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      const responseData = await res.json().catch(() => ({ status: 'error', message: "Unknown response format" }));

      if (res.ok && responseData.status === 'success') {
        const updatedUser = {
            ...user, 
            username: form.username,
            name: form.myname, 
            myposition: form.myposition,
            address: form.address,
            role: form.roleId === 2 ? 'admin' : 'user',
            id: user.id 
        };

        onSaved(updatedUser);
        toast.success(responseData.message || `User '${fieldName}' updated successfully!`);
      } else {
        console.error("Update failed based on API response:", responseData);
        toast.error(responseData.message || "Update failed: Server response indicates failure.");
      }

    } catch (error) {
      console.error("Update failed for field", fieldName, ":", error);
      toast.error(`Update failed: ${error.message || "Unknown network error"}`);
    } finally {
      setSavingField(null); 
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          <span className="red">Edit user</span> –{" "}
          <span className="highlight">{user?.username || 'N/A'}</span>
        </h2>
        {[
          { label: "Username", name: "username" },
          { label: "Full name", name: "myname" }, 
          { label: "Position", name: "myposition" },
          { label: "Address", name: "address" },
        ].map(({ label, name }) => (
          <div key={name} className="form-group">
            <label htmlFor={name}>{label}</label>
            <div className="field-row">
              <input
                id={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
              />
              <button
                onClick={() => handleSingleFieldSave(name)}
                disabled={savingField === name}
              >
                {savingField === name ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="roleId">Role</label>
          <div className="field-row">
            <select
              id="roleId"
              name="roleId"
              value={form.roleId}
              onChange={handleChange}
            >
              <option value={1}>user</option>
              <option value={2}>admin</option>
            </select>
            <button
              onClick={() => handleSingleFieldSave("roleId")}
              disabled={savingField === "roleId"}
            >
              {savingField === "roleId" ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        <div className="btn-close">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default EditUserModal;