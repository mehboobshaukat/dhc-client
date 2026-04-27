import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { getToken, isAuthenticated } from "../utils/auth";
import "./Booking.css";

function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    bookingCategory: "",
    purpose: "",
    serviceId: "",
    bookingType: "",
    preferredStartDate: "",
    preferredEndDate: "",
    preferredTimeSlot: "",
  });

  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Time slots options
  const timeSlots = [
    "Morning (9:00 AM - 12:00 PM)",
    "Afternoon (12:00 PM - 3:00 PM)",
    "Evening (3:00 PM - 6:00 PM)",
    "Flexible (Any time)",
  ];

  // Check login status
  useEffect(() => {
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);
  }, []);

  // Fetch services for dropdown
  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const res = await fetch("http://localhost:5285/api/services/get-all");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // Handle URL parameters (from Service Detail or Blog Detail page)
  useEffect(() => {
    const serviceId = searchParams.get("serviceId");
    const blogTitle = searchParams.get("blogTitle");
    const type = searchParams.get("type");

    if (type === "service" && serviceId) {
      setForm((prev) => ({
        ...prev,
        bookingCategory: "Service",
        serviceId: serviceId,
      }));
      const fetchServiceDetails = async () => {
        try {
          const res = await fetch(`http://localhost:5285/api/services/get-by-id/${serviceId}`);
          const data = await res.json();
          setSelectedService(data);
          setForm((prev) => ({
            ...prev,
            purpose: data.title || "",
          }));
        } catch (err) {
          console.error(err);
        }
      };
      fetchServiceDetails();
    } 
    else if (type === "blog" && blogTitle) {
      setForm((prev) => ({
        ...prev,
        bookingCategory: "General",
        purpose: `Blog Consultation: ${decodeURIComponent(blogTitle)}`,
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === "serviceId" && value) {
      const service = services.find(s => s.id === parseInt(value));
      if (service) {
        setSelectedService(service);
        setForm(prev => ({
          ...prev,
          serviceId: value,
          purpose: service.title,
          bookingCategory: "Service"
        }));
      }
    }
    
    if (name === "bookingCategory" && value === "General") {
      setForm(prev => ({
        ...prev,
        serviceId: "",
        purpose: "",
      }));
      setSelectedService(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      return;
    }

    // Validation for date range
    if (form.preferredStartDate && form.preferredEndDate) {
      const startDate = new Date(form.preferredStartDate);
      const endDate = new Date(form.preferredEndDate);
      if (endDate < startDate) {
        alert("End date cannot be earlier than start date");
        return;
      }
    }

    try {
      setLoading(true);

      const token = getToken();

      // Combine date range and time slot into preferredDateTime format
      const preferredDateTime = `${form.preferredStartDate} to ${form.preferredEndDate} (${form.preferredTimeSlot})`;

      const res = await fetch("http://localhost:5285/api/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingCategory: form.bookingCategory === "Service" ? 2 : 1,
          purpose: form.purpose,
          serviceId: form.serviceId ? parseInt(form.serviceId) : null,
          bookingType: form.bookingType === "Online" ? 1 : 2,
          preferredDateTime: preferredDateTime,
        }),
      });

      if (!res.ok) throw new Error("Booking failed");

      alert("✅ Booking request submitted successfully! Our team will contact you soon.");

      setForm({
        bookingCategory: "",
        purpose: "",
        serviceId: "",
        bookingType: "",
        preferredStartDate: "",
        preferredEndDate: "",
        preferredTimeSlot: "",
      });
      setSelectedService(null);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // If user is not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div className="booking-page">
        <div className="booking-hero">
          <div className="booking-hero-overlay"></div>
          <div className="booking-hero-content">
            <h1>Book a Service</h1>
            <p>Schedule your appointment with us</p>
          </div>
        </div>
        
        <div className="booking-container">
          <div className="login-prompt-card">
            <div className="prompt-icon">🔐</div>
            <h2>Login Required</h2>
            <p>To make a booking, you need to login to your account first.</p>
            <div className="prompt-buttons">
              <Link to="/auth" className="prompt-login-btn">Login Now</Link>
              <Link to="/auth?mode=register" className="prompt-register-btn">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-hero">
        <div className="booking-hero-overlay"></div>
        <div className="booking-hero-content">
          <h1>Book a Service</h1>
          <p>Schedule your appointment with us</p>
        </div>
      </div>

      <div className="booking-container">
        <div className="booking-card">
          <h2>Booking Request</h2>
          <p className="booking-subtitle">Fill out the form below to schedule your appointment</p>

          {selectedService && (
            <div className="selected-service-preview">
              <div className="preview-icon">📋</div>
              <div className="preview-content">
                <h4>Selected Service: {selectedService.title}</h4>
                <p>{selectedService.summary}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="booking-form">
            {/* Booking Category */}
            <div className="input-group">
              <select
                name="bookingCategory"
                id="bookingCategory"
                value={form.bookingCategory}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="Service">Service</option>
              </select>
              <label htmlFor="bookingCategory">Booking Category</label>
              <span className="input-icon">📂</span>
            </div>

            {/* Service Selection */}
            {form.bookingCategory === "Service" && (
              <div className="input-group">
                <select
                  name="serviceId"
                  id="serviceId"
                  value={form.serviceId}
                  onChange={handleChange}
                  required
                  disabled={loading || loadingServices}
                >
                  <option value="">Select a Service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
                <label htmlFor="serviceId">Choose Service</label>
                <span className="input-icon">🛠️</span>
                {loadingServices && <span className="loading-text">Loading services...</span>}
              </div>
            )}

            {/* Purpose */}
            <div className="input-group">
              <input
                type="text"
                name="purpose"
                id="purpose"
                placeholder=" "
                value={form.purpose}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <label htmlFor="purpose">Purpose / Description</label>
              <span className="input-icon">📝</span>
            </div>

            {/* Booking Type */}
            <div className="input-group">
              <select
                name="bookingType"
                id="bookingType"
                value={form.bookingType}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Type</option>
                <option value="Online">Online (Video Call)</option>
                <option value="Physical">Physical (In Person)</option>
              </select>
              <label htmlFor="bookingType">Booking Type</label>
              <span className="input-icon">🌐</span>
            </div>

            {/* Date Range - Start Date */}
            <div className="input-group">
              <input
                type="date"
                name="preferredStartDate"
                id="preferredStartDate"
                placeholder=" "
                value={form.preferredStartDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <label htmlFor="preferredStartDate">Preferred Start Date</label>
              <span className="input-icon">📅</span>
            </div>

            {/* Date Range - End Date */}
            <div className="input-group">
              <input
                type="date"
                name="preferredEndDate"
                id="preferredEndDate"
                placeholder=" "
                value={form.preferredEndDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <label htmlFor="preferredEndDate">Preferred End Date</label>
              <span className="input-icon">📅</span>
            </div>

            {/* Time Slot Selection */}
            <div className="input-group">
              <select
                name="preferredTimeSlot"
                id="preferredTimeSlot"
                value={form.preferredTimeSlot}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Preferred Time Slot</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <label htmlFor="preferredTimeSlot">Preferred Time Slot</label>
              <span className="input-icon">⏰</span>
            </div>

            {/* Date Range Info */}
            <div className="date-range-info">
              <span className="info-icon">ℹ️</span>
              <span>Please select your preferred date range. Our team will confirm the final schedule with you.</span>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Submitting...
                </>
              ) : (
                "Submit Booking Request →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Booking;