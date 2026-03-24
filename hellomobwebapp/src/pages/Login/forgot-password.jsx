import React, { useState } from 'react';
import "./Forgotpassword.css"
import  logo from "../../assets/logo.png"
import { FiMail, FiLock, FiKey } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ForgotPassword = () => {

  const navigate = useNavigate();

  // Steps: 1 = enter email, 2 = verify OTP, 3 = change password
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ── Step 1: Send OTP ──
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error("Email not found. Please try again.");
    }
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/verify-reset-otp", { email, otp });
      toast.success("OTP verified!");
      setStep(3);
    } catch (error) {
      console.error(error);
      toast.error("Invalid or expired OTP.");
    }
  };

  // ── Step 3: Change Password ──
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/auth/change-password", {
        email,
        otp,
        newPassword,
        confirmPassword
      });
      toast.success("Password changed successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to change password. Try again.");
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
            <img src={logo} alt="logoimg" className="logo-image" width={250} />
          </div>

          {/* Step indicators */}
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
            <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`step-dot ${step >= 3 ? 'active' : ''}`}></div>
          </div>

          <p className="step-label">
            {step === 1 && "Enter your registered email"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Set your new password"}
          </p>

          {/* ── Step 1: Email ── */}
          {step === 1 && (
            <form className="login-form" onSubmit={handleForgotPassword}>
              <div className="input-container">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  placeholder="EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-btn">
                SEND OTP
              </button>
            </form>
          )}

          {/* ── Step 2: OTP ── */}
          {step === 2 && (
            <form className="login-form" onSubmit={handleVerifyOtp}>
              <div className="input-container">
                <FiKey className="input-icon" />
                <input
                  type="text"
                  placeholder="ENTER OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
              <button type="submit" className="login-btn">
                VERIFY OTP
              </button>
              <button
                type="button"
                className="resend-btn"
                onClick={handleForgotPassword}
              >
                Resend OTP
              </button>
            </form>
          )}

          {/* ── Step 3: New Password ── */}
          {step === 3 && (
            <form className="login-form" onSubmit={handleChangePassword}>
              <div className="input-container">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  placeholder="NEW PASSWORD"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-container">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  placeholder="CONFIRM PASSWORD"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-btn">
                CHANGE PASSWORD
              </button>
            </form>
          )}

          <div className="forgot-password-container">
            <Link to="/login" className="forgot-password">
              Back to Login
            </Link>
          </div>

        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ForgotPassword;