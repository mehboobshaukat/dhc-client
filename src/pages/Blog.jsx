import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getBlogs,
  getPinnedBlogs,
  getBlogCategories,
} from "../services/api";
import "./Blog.css";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [pinnedBlogs, setPinnedBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const all = await getBlogs();
        const pinned = await getPinnedBlogs();
        const cats = await getBlogCategories();

        setBlogs(all || []);
        setPinnedBlogs(pinned || []);
        setCategories(cats || []);
      } catch (err) {
        console.error("Error fetching blog data:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // FILTER LOGIC
  const filterByCategory = (list) => {
    if (!list || list.length === 0) return [];
    if (selectedCategory === "All") return list;
    return list.filter(
      (b) => b.categoryName === selectedCategory
    );
  };

  // SORT LOGIC
  const sortBlogs = (list) => {
    if (!list || list.length === 0) return [];
    if (sortOrder === "newest") {
      return [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    if (sortOrder === "oldest") {
      return [...list].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }
    return list;
  };

  const filteredBlogs = sortBlogs(filterByCategory(blogs));
  const filteredPinned = sortBlogs(filterByCategory(pinnedBlogs));

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading amazing blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Oops! Something went wrong</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Hero Section with Filters */}
      <div className="blog-hero-section">
        <div className="container">
          <div className="blog-hero-content text-center">
            <h1 className="blog-hero-title">Our Blog</h1>
            <p className="blog-hero-subtitle">Insights, stories & updates from our team</p>
            
            {/* Filter Controls */}
            <div className="blog-filter-controls">
              {/* Category Filter */}
              <div className="filter-group">
                <select
                  className="blog-select"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  value={selectedCategory}
                >
                  <option value="All">📚 All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.title}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="filter-group">
                <select
                  className="blog-select"
                  onChange={(e) => setSortOrder(e.target.value)}
                  value={sortOrder}
                >
                  <option value="newest">🆕 Newest First</option>
                  <option value="oldest">📅 Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-4">
          
          {/* LEFT COLUMN - All Blogs (Responsive: full width on mobile) */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="section-title">
                <span className="title-icon">📖</span> All Articles
              </h2>
              <span className="blog-count">{filteredBlogs.length} articles</span>
            </div>

            {filteredBlogs.length > 0 ? (
              <div className="blogs-grid">
                {filteredBlogs.map((blog) => (
                  <article key={blog.id} className="blog-card-modern">
                    <Link to={`/blog/${blog.slug}`} className="blog-link">
                      <div className="blog-card-inner">
                        <div className="blog-image-wrapper">
                          <img
                            src={`http://localhost:5285${blog.featuredImageURL}`}
                            alt={blog.title}
                            className="blog-image"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
                            }}
                          />
                          <div className="blog-category-badge">
                            {blog.categoryName}
                          </div>
                        </div>
                        <div className="blog-content">
                          <h3 className="blog-title">{blog.title}</h3>
                          <div className="blog-meta">
                            <span className="blog-date">
                              📅 {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                            <span className="blog-read-time">⏱️ 5 min read</span>
                          </div>
                          <p className="blog-summary">{blog.summary}</p>
                          <div className="blog-read-more">
                            Read Article <span className="arrow">→</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="no-results text-center py-5">
                <p className="text-muted">No blogs found in this category.</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Pinned Blogs (Sidebar) */}
          <div className="col-lg-4">
            <div className="sidebar-widget">
              <h2 className="section-title">
                <span className="title-icon"></span> Picked for You
              </h2>
              
              {filteredPinned.length > 0 ? (
                <div className="pinned-blogs-list">
                  {filteredPinned.map((blog) => (
                    <Link
                      to={`/blog/${blog.slug}`}
                      key={blog.id}
                      className="pinned-card-modern"
                    >
                      <div className="pinned-card-image">
                        <img
                          src={`http://localhost:5285${blog.featuredImageURL}`}
                          alt={blog.title}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150x100?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="pinned-card-content">
                        <h3 className="pinned-title">{blog.title}</h3>
                        <p className="pinned-summary">{blog.summary.substring(0, 80)}...</p>
                        <div className="pinned-meta">
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">No pinned blogs available</p>
              )}

              {/* Newsletter Widget */}
              <div className="newsletter-widget mt-4">
                <h3>Stay Updated</h3>
                <p>Get the latest blogs directly in your inbox</p>
                <div className="input-group">
                  <input type="email" className="form-control" placeholder="Your email" />
                  <button className="btn btn-primary">Subscribe</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Blog;