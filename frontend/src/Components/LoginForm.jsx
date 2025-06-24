import React, { useState } from "react";
import './LoginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaLock } from "react-icons/fa";

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", JSON.stringify(data));

        if (data.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      } else {
        alert("Login failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="Box">
        <form className="input-content" onSubmit={handleSubmit}>
          <h1 className="Header-login"> Login </h1>
          <div className="input-form">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUserCircle className="icon" />
          </div>
          <div className="input-form">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>
          <div className="Remember">
            <label><input type="checkbox" /> Remember me</label>
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
          <div className="Register-link">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
