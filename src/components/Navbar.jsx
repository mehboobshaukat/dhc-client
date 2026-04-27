import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken, logout, isAuthenticated } from "../utils/auth";
import "../components/Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // fetch profile if logged in
  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5285/api/auth/get-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data);
      } catch {
        logout(); // invalid token
      }
    };

    fetchProfile();
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector('.navbar-collapse');
      const toggler = document.querySelector('.navbar-toggler');
      
      if (nav && toggler && nav.classList.contains('show')) {
        if (!nav.contains(event.target) && !toggler.contains(event.target)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top glass-navbar">
      <div className="container">
        {/* Brand Logo */}
        <NavLink className="navbar-brand" to="/">
          DHC
        </NavLink>

        {/* Mobile Toggle Button - Right side on mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links - Centered with Glassmorphism */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services" onClick={() => setIsMenuOpen(false)}>Services</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/booking" onClick={() => setIsMenuOpen(false)}>Booking</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact" onClick={() => setIsMenuOpen(false)}>Contact us</NavLink>
            </li>
          </ul>

          {/* Right Side - Auth System (Moves inside burger menu on mobile) */}
          <div className="auth-system">
            {!isAuthenticated() ? (
              <div className="auth-buttons">
                <Link to="/auth" className="btn-login-modern" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/auth?mode=register" className="btn-register-modern" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </div>
            ) : (
              <Link to="/profile" className="user-profile-link" onClick={() => setIsMenuOpen(false)}>
                <div className="user-avatar">
                  <img
                    src={
                      user?.imageURL
                        ? `http://localhost:5285${user.imageURL}`
                        : `https://ui-avatars.com/api/?background=3b82f6&color=fff&name=${encodeURIComponent(user?.name || user?.userName || 'User')}`
                    }
                    alt="Profile"
                  />
                  <span className="avatar-name">{user?.name?.split(' ')[0] || user?.userName || 'User'}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;