import axios from "axios";

const API = "http://localhost:5285/api";

export const getBlogs = async () => {
    const res = await fetch(`${API}/blogs/get-all`);
    return res.json();
};

export const getPinnedBlogs = async () => {
  const res = await fetch(`${API}/blogs/get-all-pin`);
  return res.json();
};

export const getBlogCategories = async () => {
  const res = await fetch(`${API}/blog-category/get-all`);
  return res.json();
};

export const getServices = async() => {
    try {
        const response = await axios.get(`${API}/services/get-all`);
            return response.data;
    } catch(error) {
        console.error("Error fetching services:", error);
        return [];    
    };
};

export const getCategories = async() => {
    try {
        const res = await axios.get(`${API}/service-categories/get-all`);
        return res.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export function formatDate(dateString) {
  const dateObj = new Date(dateString);
  return dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
