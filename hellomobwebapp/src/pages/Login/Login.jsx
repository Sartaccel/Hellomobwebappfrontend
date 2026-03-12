import React, { useState } from 'react';
import './Login.css';
import { FiUser, FiLock } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: email,
          password: password
        }
      );

      console.log(response.data);

      // store JWT token
      localStorage.setItem("token", response.data.token);

toast.success("Login successful");
      // redirect after login
      navigate("/home");

    } catch (error) {

      console.error(error);

toast.error("Invalid email or password");
    }
  };

  return (
    <>
    <div className="login-page">

      <div className="bg-shape shape-top-right"></div>
      <div className="bg-shape shape-bottom-left-1"></div>
      <div className="bg-shape shape-bottom-left-2"></div>
      <div className="bg-shape shape-bottom-left-3"></div>

      <div className="login-content">

        <div className="login-header">
          <h1>hello</h1>
          <p>FUTURE STORE</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="input-container">
            <FiUser className="input-icon" />
            <input 
              type="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <FiLock className="input-icon" />
            <input 
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            LOGIN
          </button>

        </form>

        <div className="forgot-password-container">
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>

      </div>
    </div>
        <ToastContainer position="top-right" autoClose={3000} />
</>
  );
};

export default Login;