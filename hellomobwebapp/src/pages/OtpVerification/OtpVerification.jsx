import React, { useState, useRef } from "react";
import axios from "axios";
import "./OtpVerification.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OtpVerification = () => {

    const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {

    const otpCode = otp.join("");

    try {

      const res = await axios.post(
        "http://localhost:8080/api/auth/verify-otp",
        {
          email: localStorage.getItem("email"),
          otp: otpCode
        }
      );

toast.success("OTP verified successfully!");

    // remove saved email
    localStorage.removeItem("email");

    // redirect to login page
    navigate("/login");

  } catch (error) {

toast.error("Invalid OTP. Please try again.");
  }
};

  return (
    <>
    <div className="otp-container">

      <div className="otp-card">

        <h2>OTP Verification</h2>

        <p>
          Enter the verification code we just sent to your email address
        </p>

        <div className="otp-input-group">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              ref={(el) => (inputs.current[index] = el)}
              onChange={(e) => handleChange(e.target, index)}
              className="otp-input"
            />
          ))}
        </div>

        <button className="verify-btn" onClick={handleVerify}>
          Verify
        </button>

        <p className="resend-text">
          Didn't receive a code? <span>Resend</span>
        </p>

      </div>
    </div>
        <ToastContainer position="top-right" autoClose={3000} />
</>
  );
};

export default OtpVerification;