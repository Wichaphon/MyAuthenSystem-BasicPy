import React from "react"
import './LoginForm.css'
import { useState } from 'react';

import { FaUserCircle } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";

export default function LoginForm() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); //กันไม่ให้ <form> โหลดหน้าเว็บใหม่
    
        try {
          const res = await fetch("http://localhost:30002/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
    
          const data = await res.json();
    
          if (data.status === "success") {
            alert("Login success!");
            console.log("Token:", data.token);
            // เก็บ token ไว้ใน localStorage หรือจะเอาไปใช้ต่อก็ได้...
            // localStorage.setItem("token", data.token);
          } else {
            alert("Login failed: " + data.message);
          }
        } catch (err) {
          alert("Error: " + err.message);
        }
      };

    // function LoginSubmit() {
    //     alert("Username : " + username + "Password : " + password)
    // }

    
    return(
        <>
        <div className="WPS"><h1>WPS Performante Club</h1></div>
        <form className="input-content" onSubmit={handleSubmit}>
            <h1 className='Header-Login'>Login</h1>
        
            <div className='input-form'>
                <input type="text" placeholder="Username" onChange={(e) => {setUsername(e.target.value)}}/>
                <FaUserCircle className="Icon"/>
            </div>
            <div className='input-form'>
                <input type="password" placeholder="password"onChange={e => setPassword(e.target.value)}/>
                <TbLockPassword className="Icon"/>
            </div>
            <div>
                <button type="submit" >Login</button>
            </div>
        </form>
        </>
    )
}

