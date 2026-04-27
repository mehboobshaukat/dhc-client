import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./VerifyEmail.css";

function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid or missing verification link");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5285/api/auth/verify-email?token=${token}`
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Verification failed");
        }

        setStatus("success");
        setMessage("Your email has been verified successfully!");
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Verification failed. The link may have expired.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleResend = async () => {
    if (!email) {
      setResendMessage("Please enter your email address");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setResendMessage("Please enter a valid email address");
      return;
    }

    setResendLoading(true);
    setResendMessage("");

    try {
      const res = await fetch(
        "http://localhost:5285/api/auth/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to resend verification");
      }

      setResendMessage("✓ Verification email sent! Please check your inbox.");
      setEmail("");
    } catch (err) {
      setResendMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-background">
        <div className="bg-blur-1"></div>
        <div className="bg-blur-2"></div>
        <div className="bg-blur-3"></div>
      </div>

      <div className="verify-container">
        <div className="verify-card">
          
          {/* Loading State */}
          {status === "loading" && (
            <>
              <div className="verify-icon loading-icon">
                <div className="spinner"></div>
              </div>
              <h2>Verifying Your Email</h2>
              <p className="verify-subtitle">Please wait while we verify your email address...</p>
            </>
          )}

          {/* Success State */}
          {status === "success" && (
            <>
              <div className="verify-icon success-icon">
                ✓
              </div>
              <h2 style={{ color: "#16a34a" }}>Email Verified!</h2>
              <p className="verify-subtitle success-text">{message}</p>
              <Link to="/login" className="login-link-btn">
                Go to Login →
              </Link>
            </>
          )}

          {/* Error State */}
          {status === "error" && (
            <>
              <div className="verify-icon error-icon">
                ✗
              </div>
              <h2 style={{ color: "#dc2626" }}>Verification Failed</h2>
              <p className="verify-subtitle error-text">{message}</p>
              
              <div className="resend-section">
                <div className="divider">
                  <span>Request a new verification link</span>
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    id="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setResendMessage("");
                    }}
                    disabled={resendLoading}
                  />
                  <label htmlFor="email">Email Address</label>
                  <span className="input-icon">📧</span>
                </div>

                {resendMessage && (
                  <div className={`resend-message ${resendMessage.includes("✓") ? "success" : "error"}`}>
                    {resendMessage}
                  </div>
                )}

                <button 
                  className="resend-btn" 
                  onClick={handleResend}
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </button>
              </div>

              <div className="back-link">
                <Link to="/auth">
                  ← Back to Login
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;