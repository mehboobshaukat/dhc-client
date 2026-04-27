import { useState, useEffect, useRef } from "react";
import Login from "./Login";
import Register from "./Register";
import "./auth.css";
import { useSearchParams } from "react-router-dom";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState("");
  const [searchParams] = useSearchParams();

  // Check URL parameter for mode - Run once on mount
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") {
      setIsLogin(false);
    } else if (mode === "login") {
      setIsLogin(true);
    }
  }, [searchParams]);

  const switchToRegister = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationDirection("to-register");
    
    setTimeout(() => {
      setIsLogin(false);
      setAnimationDirection("");
      setIsAnimating(false);
    }, 600);
  };

  const switchToLogin = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationDirection("to-login");
    
    setTimeout(() => {
      setIsLogin(true);
      setAnimationDirection("");
      setIsAnimating(false);
    }, 600);
  };

  // Particle effect initialization
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
      });
    }
    
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array - run once on mount

  return (
    <div className="auth-page">
      <canvas id="particle-canvas" className="particle-canvas"></canvas>
      
      <div className="auth-container">
        <div className={`auth-card ${animationDirection}`}>
          
          {/* LEFT PANEL - Changes based on active page */}
          <div className={`auth-panel left-panel ${isLogin ? "active" : "inactive"}`}>
            <div className="panel-content">
              <div className="panel-icon">🚀</div>
              <h2>Welcome Back!</h2>
              <p>Login to access your dashboard and manage your projects</p>
              <div className="panel-features">
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Manage your bookings</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Track your orders</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>24/7 Support</span>
                </div>
              </div>
              <button className="panel-switch-btn" onClick={switchToRegister}>
                Create Account →
              </button>
            </div>
          </div>

          {/* RIGHT PANEL - Changes based on active page */}
          <div className={`auth-panel right-panel ${!isLogin ? "active" : "inactive"}`}>
            <div className="panel-content">
              <div className="panel-icon">✨</div>
              <h2>Join Our Community</h2>
              <p>Create an account and start your journey with us</p>
              <div className="panel-features">
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Access to premium services</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Exclusive offers</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Priority support</span>
                </div>
              </div>
              <button className="panel-switch-btn" onClick={switchToLogin}>
                ← Back to Login
              </button>
            </div>
          </div>

          {/* FORM CONTAINER - Slides between login and register */}
          <div className={`form-container ${isLogin ? "login-active" : "register-active"}`}>
            <div className="form-wrapper">
              {isLogin ? (
                <Login switchToRegister={switchToRegister} />
              ) : (
                <Register switchToLogin={switchToLogin} />
              )}
            </div>
          </div>
          
          {/* Glowing orb effect */}
          <div className="glowing-orb"></div>
          <div className="glowing-orb-2"></div>
          
        </div>
      </div>
    </div>
  );
}

export default Auth;