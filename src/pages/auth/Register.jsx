import { useState, useRef } from "react";
import { registerUser } from "../../services/authService";
import "./Register.css";

function Register({ switchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    phone: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
      setForm({ ...form, image: file });
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: "" });
    } else {
      setErrors({ ...errors, image: "Please select a valid image (JPEG, PNG, JPG)" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.userName) newErrors.userName = "Username is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password && form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!form.phone) newErrors.phone = "Phone number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("UserName", form.userName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("password", form.password);
    if (form.image) formData.append("ImageURL", form.image);

    try {
      await registerUser(formData);
      alert("Registered successfully! Please verify your email.");
      switchToLogin();
    } catch (err) {
      if (err.message === "Email already exists") {
        setErrors({ email: "Email already registered" });
      } else if (err.message === "Username already exists") {
        setErrors({ userName: "Username already taken" });
      } else {
        alert(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Create Account</h2>
      <p className="form-subtitle">Join our community today</p>

      {/* Avatar Upload */}
      <div className="avatar-upload">
        <div className="avatar-preview" onClick={handleImageClick}>
          <div className="avatar-circle">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" />
            ) : (
              <span className="avatar-placeholder">📸</span>
            )}
          </div>
          <div className="avatar-overlay">
            <span>📷</span>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>
      {errors.image && <span className="error-text" style={{ textAlign: "center", display: "block" }}>{errors.image}</span>}

      {/* Form Fields - Full Width with Bottom Border */}
      <div className="form-grid">
        {/* Full Name */}
        <div className="input-group">
          <input
            type="text"
            name="name"
            id="name"
            placeholder=" "
            onChange={handleChange}
            disabled={loading}
          />
          <label htmlFor="name">Full Name</label>
          <span className="input-icon">👤</span>
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Username */}
        <div className="input-group">
          <input
            type="text"
            name="userName"
            id="username"
            placeholder=" "
            onChange={handleChange}
            disabled={loading}
          />
          <label htmlFor="username">Username</label>
          <span className="input-icon">@</span>
          {errors.userName && <span className="error-text">{errors.userName}</span>}
        </div>

        {/* Email */}
        <div className="input-group">
          <input
            type="email"
            name="email"
            id="email"
            placeholder=" "
            onChange={handleChange}
            disabled={loading}
          />
          <label htmlFor="email">Email Address</label>
          <span className="input-icon">📧</span>
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="input-group">
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder=" "
            onChange={handleChange}
            disabled={loading}
          />
          <label htmlFor="phone">Phone Number</label>
          <span className="input-icon">📞</span>
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        {/* Password */}
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder=" "
            onChange={handleChange}
            disabled={loading}
          />
          <label htmlFor="password">Password (min 6 characters)</label>
          <span 
            className="input-icon"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? "👁️" : "🔒"}
          </span>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
      </div>

      <button type="submit" className="register-btn" disabled={loading}>
        {loading ? <span className="loading-spinner"></span> : null}
        {loading ? "Creating Account..." : "Register"}
      </button>

      <div className="auth-link">
        Already have an account?{" "}
        <span onClick={switchToLogin}>Login</span>
      </div>
    </form>
  );
}

export default Register;