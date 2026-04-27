import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const res = await fetch(
        "http://localhost:5285/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      setMessage("If this email exists, a reset link has been sent. Please check your email inbox or spam folder.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-background">
        <div className="bg-blur-1"></div>
        <div className="bg-blur-2"></div>
        <div className="bg-blur-3"></div>
      </div>

      <div className="forgot-container">
        <div className="forgot-card">
          
          <div className="forgot-icon">
            🔐
          </div>
          
          <h2>Forgot Password?</h2>
          <p className="forgot-subtitle">
            Don't worry! Enter your email address and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setMessage("");
                }}
                disabled={loading}
              />
              <label htmlFor="email">Email Address</label>
              <span className="input-icon">📧</span>
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                ✓ {message}
              </div>
            )}

            <button type="submit" className="reset-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="back-link">
            <Link to="/auth">
              ← Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;