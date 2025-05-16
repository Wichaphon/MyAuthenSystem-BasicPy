import React,{ useState } from "react";
import './LoginForm.css';

export default function LoginForm() {

    const [username , setUsername] = useState('');
    const [password , setPassword] = useState('');
    
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

    return (
        <div>
            <form className="input-content" action="" onSubmit={handleSubmit}>
                <h1 className="Header-login"> Login </h1>
                <div className="input-form">
                    <input type="text" placeholder="Username" onChange={(e) => {setUsername(e.target.value)}}></input>
                </div>
                <div className="input-form">
                    <input type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}></input>
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}