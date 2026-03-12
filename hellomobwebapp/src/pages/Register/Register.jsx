import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateAccount = () => {

    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData
      );

      console.log(response.data);
       // ✅ Save email for OTP verification
    localStorage.setItem("email", formData.email);

toast.success("OTP sent successfully! Please check your email.");
    // navigate to OTP page
    navigate("/verify-otp");

  } catch (error) {

    console.error(error);
toast.error("Registration failed. Please try again.");
  }
};

  return (
    <>
    <div className="create-account-container">

      <header className="brand-header">
        <h1>hello</h1>
        <p>FUTURE STORE</p>
      </header>

      <main className="form-wrapper">
        <h2>Create account</h2>

        <form className="account-form" onSubmit={handleRegister}>

          <div className="form-row">
            <div className="input-group">
              <label>First name</label>
              <input
                type="text"
                name="firstName"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Last name</label>
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Phone number</label>
              <input
                type="tel"
                name="phoneNumber"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="action-buttons">
            <button type="submit" className="btn-primary">
              Create account
            </button>

            <button type="button" className="btn-secondary">
              <FcGoogle className="google-icon" />
              Sign-in with google
            </button>
          </div>

          <div className="login-prompt">
            Already have an account? <a href="/login">Log In</a>
          </div>

        </form>
      </main>
    </div>
        <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
    />
  </>
  );
};

export default CreateAccount;