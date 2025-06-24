import React from "react";
import "./ConfirmDeleteModal.css";

function ConfirmDeleteModal({ isOpen, user, onCancel, onConfirm }) {
  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete 
          <strong>{user.name} ?</strong> 
        </p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={() => onConfirm(user.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
