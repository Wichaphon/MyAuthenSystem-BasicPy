import React, { useState } from "react";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:30002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        // เก็บ token และโปรไฟล์ไว้
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));

        // ไปหน้าโปรไฟล์
        navigate("/profile");
      } else {
        alert("Login failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <>
      <div className="WPS">
        <h1>WPS Performante Club</h1>
      </div>
      <form className="input-content" onSubmit={handleSubmit}>
        <h1 className="Header-Login">Login</h1>

        <div className="input-form">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUserCircle className="Icon" />
        </div>
        <div className="input-form">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <TbLockPassword className="Icon" />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </>
  );
}
