import React from "react";
import './RegisterForm.css'
import {Link} from 'react-router-dom'

export default function RegisterForm(){


    
    const handleSubmit = async(e) =>{
        e.preventDefault();
    }
    return(
        <div className="Box">
            <form className="input-content" action="" onSubmit={handleSubmit}>
                <h1 className="Header">Register</h1>
                <div className="input-form">
                    <input type="text" placeholder="Username"/>
                </div>
                <div className="input-form">
                    <input type="password" placeholder="Password"/>
                </div>
                <div className="input-form">
                    <input type="password" placeholder="Confirm Password"/>
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
                <div className="Login-link">
                    <p>Already have an account <Link to="/"> Login</Link>
                        </p>
                </div>
            </form>
        </div>
    )
}