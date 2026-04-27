import axios from "axios";

const API = "http://localhost:5285/api/auth";

export const registerUser = async (formData) => {
  try {
    const res = await axios.post(`${API}/register`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Register API error:", error);
    let errorMessage = "Registration failed";
    
    if (error.response?.data) {
      // If response data is string or object with message
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else {
        errorMessage = error.response.data.message || error.response.data.title || error.response.data.error || "Registration failed";
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const loginUser = async (data) => {
  try {
    console.log("Sending login request to:", `${API}/login`);
    console.log("Request data:", { userName: data.userName, password: "***" });
    
    const res = await axios.post(`${API}/login`, data, {
      headers: { "Content-Type": "application/json" },
    });
    
    console.log("Response status:", res.status);
    console.log("Response data:", res.data);
    
    if (!res.data.token) {
      throw new Error("No token received from server");
    }
    
    return {
      token: res.data.token,
      user: res.data.user
    };
  } catch (error) {
    console.error("Login API error full:", error);
    
    let errorMessage = "Login failed";
    
    // Check if error response exists
    if (error.response) {
      console.log("Error response status:", error.response.status);
      console.log("Error response data:", error.response.data);
      
      // Extract message from various possible formats
      if (typeof error.response.data === 'string') {
        // If response is plain text (like exception message)
        errorMessage = error.response.data;
      } else if (error.response.data) {
        // If response is JSON
        errorMessage = error.response.data.message || 
                      error.response.data.title ||
                      error.response.data.error ||
                      error.response.data;
      }
      
      // Clean up the error message (remove stack trace if present)
      if (errorMessage.includes("System.Exception")) {
        const match = errorMessage.match(/System\.Exception:\s*(.+?)(?:\n|$)/);
        if (match && match[1]) {
          errorMessage = match[1].trim();
        }
      }
    } else if (error.request) {
      errorMessage = "Cannot connect to server. Please check if backend is running on port 5285.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.log("Extracted error message:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const verifyEmail = async (token) => {
  try {
    const res = await axios.get(`${API}/verify-email?token=${token}`);
    return res.data;
  } catch (error) {
    console.error("Verify email error:", error);
    let errorMessage = "Email verification failed";
    if (error.response?.data) {
      errorMessage = typeof error.response.data === 'string' ? error.response.data : error.response.data.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios.post(`${API}/forgot-password`, { email });
    return res.data;
  } catch (error) {
    console.error("Forgot password error:", error);
    let errorMessage = "Failed to send reset link";
    if (error.response?.data) {
      errorMessage = typeof error.response.data === 'string' ? error.response.data : error.response.data.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

export const resetPassword = async (data) => {
  try {
    const res = await axios.post(`${API}/reset-password`, data);
    return res.data;
  } catch (error) {
    console.error("Reset password error:", error);
    let errorMessage = "Failed to reset password";
    if (error.response?.data) {
      errorMessage = typeof error.response.data === 'string' ? error.response.data : error.response.data.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API}/get-profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};

export const updateProfile = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${API}/update-profile`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    });
    return res.data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API}/change-password`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Change password error:", error);
    throw error;
  }
};

export const resendVerification = async (email) => {
  try {
    const res = await axios.post(`${API}/resend-verification`, JSON.stringify(email), {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("Resend verification error:", error);
    throw error;
  }
};