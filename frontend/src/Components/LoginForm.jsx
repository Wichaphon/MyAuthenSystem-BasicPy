import React,{ useState } from "react";
import './LoginForm.css';
import {Link, useNavigate} from 'react-router-dom'
import { FaUserCircle , FaLock } from "react-icons/fa";

export default function LoginForm() {

    const [username , setUsername] = useState('');
    const [password , setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault(); //กันไม่ให้ <form> โหลดหน้าเว็บใหม่

            try {
          const res = await fetch("http://localhost/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
    
          const data = await res.json();
    
          if (res.ok && data.status === "success") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.data));
            navigate("/profile");
          } else {
            alert("Login failed: " +(data.message || "Unknow error"));
          }
        } catch (err) {
          alert("Error: " + err.message);
        }
      };

    return (
        <div className="Box">
            <form className="input-content" action="" onSubmit={handleSubmit}>
                <h1 className="Header-login"> Login </h1>
                <div className="input-form">
                    <input type="text" placeholder="Username" onChange={(e) => {setUsername(e.target.value)}}></input>
                    <FaUserCircle className="icon"/>
                </div>
                <div className="input-form">
                    <input type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}></input>
                    <FaLock className="icon"/>
                </div>
                <div className="Remember">
                    <label><input type="checkbox"/>Remember me</label>
                </div>
                <div>
                    <button type="submit">Login</button>    
                </div>
                <div className="Register-link">
                    <p>Don't have an account? <Link to="/register"> Register</Link>
                        </p>
                </div>
            </form>
        </div>
    )
}