import React, { useState } from "react";
import styles from "./Auth.module.css";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/constants";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URL}/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Password reset successfully");
      setEmail("");
      setOTP("");
      setNewPassword("");

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Reset Password</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <div className="alert alert-warning" role="alert">
            Please check your email for the OTP to reset your password.
          </div>

          <label htmlFor="email" className={styles.formLabel}>
            Email address
          </label>
          <input
            type="email"
            id="email"
            className={styles.formInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="otp" className={styles.formLabel}>
            OTP
          </label>
          <input
            type="text"
            id="otp"
            className={styles.formInput}
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="newPassword" className={styles.formLabel}>
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className={styles.formInput}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitBtn}>
          Reset Password
        </button>
      </form>
      <div className={styles.signInLink}>
        Remembered your password? <Link to="/signin">Sign in</Link>
      </div>
    </div>
  );
}
