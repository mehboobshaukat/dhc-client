// import { useEffect, useState } from "react";
// import { getToken, logout } from "../../utils/auth";
// import { useNavigate } from "react-router-dom";
// import "./Profile.css";

// function Profile() {
//   const navigate = useNavigate();
//   const token = getToken();

//   const [user, setUser] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [passwordMode, setPasswordMode] = useState(false);
//   const [activeTab, setActiveTab] = useState("bookings");

//   const [form, setForm] = useState({});
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [bookings, setBookings] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ================= FETCH PROFILE =================
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch("http://localhost:5285/api/auth/get-profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setUser(data);
//         setForm(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchProfile();
//   }, []);

//   // ================= FETCH BOOKINGS =================
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const res = await fetch("http://localhost:5285/api/booking/my-bookings", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setBookings(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchBookings();
//   }, []);

//   // ================= FETCH MESSAGES =================
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await fetch("http://localhost:5285/api/contact/my-messages", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setMessages(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMessages();
//   }, []);

//   // ================= UPDATE PROFILE =================
//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", form.name);
//     formData.append("userName", form.userName);
//     formData.append("email", form.email);
//     formData.append("phone", form.phone);

//     if (image) {
//       formData.append("imageURL", image);
//     }

//     try {
//       const res = await fetch("http://localhost:5285/api/auth/update-profile", {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (res.ok) {
//         alert("Profile Updated Successfully!");
//         setEditMode(false);
//         window.location.reload();
//       } else {
//         alert("Update failed");
//       }
//     } catch (err) {
//       alert("Error updating profile");
//     }
//   };

//   // ================= CHANGE PASSWORD =================
//   const handlePassword = async (e) => {
//     e.preventDefault();

//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       alert("New passwords do not match");
//       return;
//     }

//     if (passwordForm.newPassword.length < 6) {
//       alert("Password must be at least 6 characters");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5285/api/auth/change-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           currentPassword: passwordForm.currentPassword,
//           newPassword: passwordForm.newPassword,
//         }),
//       });

//       if (res.ok) {
//         alert("Password updated successfully!");
//         setPasswordMode(false);
//         setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
//       } else {
//         const error = await res.text();
//         alert(error || "Password update failed");
//       }
//     } catch (err) {
//       alert("Error changing password");
//     }
//   };

//   // ================= LOGOUT =================
//   const handleLogout = () => {
//     logout();
//     navigate("/auth");
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     } else {
//       alert("Please select a valid image (JPEG, PNG, JPG)");
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "Pending":
//         return <span className="badge pending">⏳ Pending</span>;
//       case "Confirmed":
//         return <span className="badge confirmed">✅ Confirmed</span>;
//       case "Rejected":
//         return <span className="badge rejected">❌ Rejected</span>;
//       default:
//         return <span className="badge pending">{status}</span>;
//     }
//   };

//   if (!user) {
//     return (
//       <div className="profile-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading profile...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-page">
//       <div className="profile-hero">
//         <div className="profile-hero-overlay"></div>
//         <div className="profile-hero-content">
//           <h1>My Dashboard</h1>
//           <p>Manage your profile, bookings and messages</p>
//         </div>
//       </div>

//       <div className="profile-container">
//         {/* Sidebar */}
//         <div className="profile-sidebar">
//           <div className="profile-avatar">
//             <img
//               src={
//                 user.imageURL
//                   ? `http://localhost:5285${user.imageURL}`
//                   : "https://ui-avatars.com/api/?background=3b82f6&color=fff&name=" + (user.name || 'User')
//               }
//               alt={user.name}
//             />
//             {editMode && (
//               <label className="avatar-edit-btn">
//                 <input type="file" accept="image/*" onChange={handleImageChange} hidden />
//                 📷
//               </label>
//             )}
//           </div>
//           <h3>{user.name}</h3>
//           <p className="profile-email">{user.email}</p>
//           <p className="profile-role">{user.role}</p>

//           <div className="sidebar-buttons">
//             <button className="sidebar-btn edit" onClick={() => setEditMode(!editMode)}>
//               ✏️ {editMode ? "Cancel Edit" : "Edit Profile"}
//             </button>
//             <button className="sidebar-btn password" onClick={() => setPasswordMode(!passwordMode)}>
//               🔒 {passwordMode ? "Cancel" : "Change Password"}
//             </button>
//             <button className="sidebar-btn logout" onClick={handleLogout}>
//               🚪 Logout
//             </button>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="profile-main">
//           {/* Edit Profile Form */}
//           {editMode && (
//             <div className="profile-card edit-card">
//               <h3>✏️ Edit Profile</h3>
//               <form onSubmit={handleUpdate} className="profile-form">
//                 <div className="form-row">
//                   <div className="input-group">
//                     <input
//                       type="text"
//                       id="name"
//                       placeholder=" "
//                       value={form.name || ""}
//                       onChange={(e) => setForm({ ...form, name: e.target.value })}
//                       required
//                     />
//                     <label htmlFor="name">Full Name</label>
//                     <span className="input-icon">👤</span>
//                   </div>

//                   <div className="input-group">
//                     <input
//                       type="text"
//                       id="userName"
//                       placeholder=" "
//                       value={form.userName || ""}
//                       onChange={(e) => setForm({ ...form, userName: e.target.value })}
//                       required
//                     />
//                     <label htmlFor="userName">Username</label>
//                     <span className="input-icon">@</span>
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="input-group">
//                     <input
//                       type="email"
//                       id="email"
//                       placeholder=" "
//                       value={form.email || ""}
//                       onChange={(e) => setForm({ ...form, email: e.target.value })}
//                       required
//                     />
//                     <label htmlFor="email">Email Address</label>
//                     <span className="input-icon">📧</span>
//                   </div>

//                   <div className="input-group">
//                     <input
//                       type="tel"
//                       id="phone"
//                       placeholder=" "
//                       value={form.phone || ""}
//                       onChange={(e) => setForm({ ...form, phone: e.target.value })}
//                       required
//                     />
//                     <label htmlFor="phone">Phone Number</label>
//                     <span className="input-icon">📞</span>
//                   </div>
//                 </div>

//                 {imagePreview && (
//                   <div className="image-preview">
//                     <img src={imagePreview} alt="Preview" />
//                     <span>New image preview</span>
//                   </div>
//                 )}

//                 <button type="submit" className="submit-btn">Save Changes</button>
//               </form>
//             </div>
//           )}

//           {/* Change Password Form */}
//           {passwordMode && (
//             <div className="profile-card password-card">
//               <h3>🔒 Change Password</h3>
//               <form onSubmit={handlePassword} className="profile-form">
//                 <div className="input-group">
//                   <input
//                     type="password"
//                     id="currentPassword"
//                     placeholder=" "
//                     value={passwordForm.currentPassword}
//                     onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
//                     required
//                   />
//                   <label htmlFor="currentPassword">Current Password</label>
//                   <span className="input-icon">🔐</span>
//                 </div>

//                 <div className="input-group">
//                   <input
//                     type="password"
//                     id="newPassword"
//                     placeholder=" "
//                     value={passwordForm.newPassword}
//                     onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
//                     required
//                   />
//                   <label htmlFor="newPassword">New Password</label>
//                   <span className="input-icon">🔒</span>
//                 </div>

//                 <div className="input-group">
//                   <input
//                     type="password"
//                     id="confirmPassword"
//                     placeholder=" "
//                     value={passwordForm.confirmPassword}
//                     onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
//                     required
//                   />
//                   <label htmlFor="confirmPassword">Confirm Password</label>
//                   <span className="input-icon">✓</span>
//                 </div>

//                 <button type="submit" className="submit-btn">Update Password</button>
//               </form>
//             </div>
//           )}

//           {/* Tabs for Bookings and Messages */}
//           <div className="profile-tabs">
//             <button className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`} onClick={() => setActiveTab("bookings")}>
//               📅 My Bookings ({bookings.length})
//             </button>
//             <button className={`tab-btn ${activeTab === "messages" ? "active" : ""}`} onClick={() => setActiveTab("messages")}>
//               💬 My Messages ({messages.length})
//             </button>
//           </div>

//           {/* Bookings Tab */}
//           {activeTab === "bookings" && (
//             <div className="profile-card bookings-card">
//               <h3>📅 My Bookings</h3>
//               {bookings.length === 0 ? (
//                 <div className="empty-state">
//                   <span className="empty-icon">📭</span>
//                   <p>No bookings yet</p>
//                   <button className="empty-action" onClick={() => navigate("/booking")}>Book a Service →</button>
//                 </div>
//               ) : (
//                 <div className="bookings-list">
//                   {bookings.map((booking) => (
//                     <div key={booking.id} className="booking-item">
//                       <div className="booking-header">
//                         <h4>{booking.purpose}</h4>
//                         {getStatusBadge(booking.bookingStatusName)}
//                       </div>
//                       <div className="booking-details">
//                         <span>📅 {booking.preferredDateTime || "Date to be confirmed"}</span>
//                         <span>🌐 {booking.bookingTypeName}</span>
//                         {booking.serviceTitle && <span>🛠️ {booking.serviceTitle}</span>}
//                       </div>
//                       {booking.adminMessage && (
//                         <div className="admin-message">
//                           <strong>Admin Note:</strong> {booking.adminMessage}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Messages Tab */}
//           {activeTab === "messages" && (
//             <div className="profile-card messages-card">
//               <h3>💬 My Messages</h3>
//               {messages.length === 0 ? (
//                 <div className="empty-state">
//                   <span className="empty-icon">📭</span>
//                   <p>No messages sent yet</p>
//                   <button className="empty-action" onClick={() => navigate("/contact")}>Contact Us →</button>
//                 </div>
//               ) : (
//                 <div className="messages-list">
//                   {messages.map((message) => (
//                     <div key={message.id} className={`message-item ${!message.isRead ? "unread" : ""}`}>
//                       <div className="message-header">
//                         <h4>{message.subject}</h4>
//                         <span className="message-date">{new Date(message.createdAt).toLocaleDateString()}</span>
//                       </div>
//                       <p>{message.message}</p>
//                       {!message.isRead && <span className="unread-badge">New</span>}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;









import { useEffect, useState } from "react";
import { getToken, logout } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const token = getToken();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");

  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userId, setUserId] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5285/api/auth/get-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
        setForm(data);
        setUserId(data.id); // Store user ID for bookings fetch
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  // ================= FETCH BOOKINGS (FIXED ENDPOINT) =================
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) return; // Wait for userId to be available
      
      try {
        console.log("Fetching bookings for user:", userId);
        const res = await fetch(`http://localhost:5285/api/booking/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Bookings data:", data);
        setBookings(data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId, token]);

  // ================= FETCH MESSAGES (FIXED) =================
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("Fetching messages");
        const res = await fetch("http://localhost:5285/api/contact/my-messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Messages data:", data);
        setMessages(data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [token]);

  // ================= UPDATE PROFILE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("userName", form.userName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);

    if (image) {
      formData.append("imageURL", image);
    }

    try {
      const res = await fetch("http://localhost:5285/api/auth/update-profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert("Profile Updated Successfully!");
        setEditMode(false);
        window.location.reload();
      } else {
        const error = await res.text();
        alert(error || "Update failed");
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };

  // ================= CHANGE PASSWORD =================
  const handlePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("http://localhost:5285/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (res.ok) {
        alert("Password updated successfully!");
        setPasswordMode(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const error = await res.text();
        alert(error || "Password update failed");
      }
    } catch (err) {
      alert("Error changing password");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image (JPEG, PNG, JPG)");
    }
  };

  const getStatusBadge = (status) => {
    const statusName = status?.toString() || "";
    switch (statusName) {
      case "Pending":
        return <span className="badge pending">⏳ Pending</span>;
      case "Confirmed":
        return <span className="badge confirmed">✅ Confirmed</span>;
      case "Rejected":
        return <span className="badge rejected">❌ Rejected</span>;
      default:
        return <span className="badge pending">⏳ {statusName || "Pending"}</span>;
    }
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-hero-overlay"></div>
        <div className="profile-hero-content">
          <h1>My Dashboard</h1>
          <p>Manage your profile, bookings and messages</p>
        </div>
      </div>

      <div className="profile-container">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <img
              src={
                user.imageURL
                  ? `http://localhost:5285${user.imageURL}`
                  : `https://ui-avatars.com/api/?background=3b82f6&color=fff&name=${encodeURIComponent(user.name || 'User')}`
              }
              alt={user.name}
            />
            {editMode && (
              <label className="avatar-edit-btn">
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                📷
              </label>
            )}
          </div>
          <h3>{user.name}</h3>
          <p className="profile-email">{user.email}</p>
          <p className="profile-role">{user.role || "User"}</p>

          <div className="sidebar-buttons">
            <button className="sidebar-btn edit" onClick={() => setEditMode(!editMode)}>
              ✏️ {editMode ? "Cancel Edit" : "Edit Profile"}
            </button>
            <button className="sidebar-btn password" onClick={() => setPasswordMode(!passwordMode)}>
              🔒 {passwordMode ? "Cancel" : "Change Password"}
            </button>
            <button className="sidebar-btn logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Edit Profile Form */}
          {editMode && (
            <div className="profile-card edit-card">
              <h3>✏️ Edit Profile</h3>
              <form onSubmit={handleUpdate} className="profile-form">
                <div className="form-row">
                  <div className="input-group">
                    <input
                      type="text"
                      id="name"
                      placeholder=" "
                      value={form.name || ""}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    <label htmlFor="name">Full Name</label>
                    <span className="input-icon">👤</span>
                  </div>

                  <div className="input-group">
                    <input
                      type="text"
                      id="userName"
                      placeholder=" "
                      value={form.userName || ""}
                      onChange={(e) => setForm({ ...form, userName: e.target.value })}
                      required
                    />
                    <label htmlFor="userName">Username</label>
                    <span className="input-icon">@</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <input
                      type="email"
                      id="email"
                      placeholder=" "
                      value={form.email || ""}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                    <label htmlFor="email">Email Address</label>
                    <span className="input-icon">📧</span>
                  </div>

                  <div className="input-group">
                    <input
                      type="tel"
                      id="phone"
                      placeholder=" "
                      value={form.phone || ""}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                    <label htmlFor="phone">Phone Number</label>
                    <span className="input-icon">📞</span>
                  </div>
                </div>

                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <span>New image preview</span>
                  </div>
                )}

                <button type="submit" className="submit-btn">Save Changes</button>
              </form>
            </div>
          )}

          {/* Change Password Form */}
          {passwordMode && (
            <div className="profile-card password-card">
              <h3>🔒 Change Password</h3>
              <form onSubmit={handlePassword} className="profile-form">
                <div className="input-group">
                  <input
                    type="password"
                    id="currentPassword"
                    placeholder=" "
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                  <label htmlFor="currentPassword">Current Password</label>
                  <span className="input-icon">🔐</span>
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    id="newPassword"
                    placeholder=" "
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                  <label htmlFor="newPassword">New Password</label>
                  <span className="input-icon">🔒</span>
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder=" "
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <span className="input-icon">✓</span>
                </div>

                <button type="submit" className="submit-btn">Update Password</button>
              </form>
            </div>
          )}

          {/* Tabs for Bookings and Messages */}
          <div className="profile-tabs">
            <button className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`} onClick={() => setActiveTab("bookings")}>
              📅 My Bookings ({bookings.length})
            </button>
            <button className={`tab-btn ${activeTab === "messages" ? "active" : ""}`} onClick={() => setActiveTab("messages")}>
              💬 My Messages ({messages.length})
            </button>
          </div>

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="profile-card bookings-card">
              <h3>📅 My Bookings</h3>
              {bookings.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>No bookings yet</p>
                  <button className="empty-action" onClick={() => navigate("/booking")}>Book a Service →</button>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-item">
                      <div className="booking-header">
                        <h4>{booking.purpose || "No purpose specified"}</h4>
                        {getStatusBadge(booking.bookingStatusName)}
                      </div>
                      <div className="booking-details">
                        <span>📅 {booking.preferredDateTime || "Date to be confirmed"}</span>
                        <span>🌐 {booking.bookingTypeName || "Not specified"}</span>
                        {booking.serviceTitle && <span>🛠️ {booking.serviceTitle}</span>}
                      </div>
                      {booking.adminMessage && (
                        <div className="admin-message">
                          <strong>Admin Note:</strong> {booking.adminMessage}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="profile-card messages-card">
              <h3>💬 My Messages</h3>
              {messages.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>No messages sent yet</p>
                  <button className="empty-action" onClick={() => navigate("/contact")}>Contact Us →</button>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map((message) => (
                    <div key={message.id} className={`message-item ${!message.isRead ? "unread" : ""}`}>
                      <div className="message-header">
                        <h4>{message.subject}</h4>
                        <span className="message-date">{new Date(message.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p>{message.message}</p>
                      {!message.isRead && <span className="unread-badge">New</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;