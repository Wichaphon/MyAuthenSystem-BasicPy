import React, { useState, useEffect } from "react";
import './LoginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaLock } from "react-icons/fa";

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        //เก็บ token แล้วแจ้ง AppRoutes ว่า token เปลี่ยน
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        window.dispatchEvent(new Event("tokenChange")); //trigger ให้ AppRoutes รู้

        navigate("/profile");
      } else {
        alert("Login failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="Box">
      <form className="input-content" onSubmit={handleSubmit}>
        <h1 className="Header-login">Login</h1>
        <div className="input-form">
          <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <FaUserCircle className="icon" />
        </div>
        <div className="input-form">
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <FaLock className="icon" />
        </div>
        <div className="Remember">
          <label><input type="checkbox" />Remember me</label>
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        <div className="Register-link">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </form>
    </div>
  );
}
