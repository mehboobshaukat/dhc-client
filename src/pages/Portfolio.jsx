import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Portfolio.css";

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProjects(),
          fetchFeatured(),
          fetchCategories()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("http://localhost:5285/api/portfolios/get-all");
    const data = await res.json();
    setProjects(data);
  };

  const fetchFeatured = async () => {
    const res = await fetch("http://localhost:5285/api/portfolios/featured");
    const data = await res.json();
    setFeatured(data);
  };

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5285/api/portfolio-categories/get-all");
    const data = await res.json();
    setCategories(data);
  };

  // ================= FILTER =================
  const filteredProjects = selectedCategory
    ? projects.filter(p => p.categoryName === selectedCategory)
    : projects;

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing projects...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      {/* Hero Section */}
      <div className="portfolio-hero">
        <div className="portfolio-hero-overlay"></div>
        <div className="portfolio-hero-content">
          <h1>Our Portfolio</h1>
          <p>Explore our latest work and success stories</p>
        </div>
      </div>

      <div className="portfolio-container">
        {/* Header with Filters */}
        <div className="portfolio-header">
          <div className="portfolio-header-content">
            <h2>All Projects</h2>
            <p className="portfolio-count">{filteredProjects.length} projects</p>
          </div>
          
          <div className="portfolio-filters">
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Layout */}
        <div className="portfolio-layout">
          
          {/* LEFT COLUMN - All Projects */}
          <div className="portfolio-left">
            {filteredProjects.length === 0 ? (
              <div className="no-projects">
                <p>No projects found in this category.</p>
              </div>
            ) : (
              filteredProjects.map(project => (
                <Link 
                  to={`/portfolio/${project.slug}`} 
                  key={project.id} 
                  className="project-card"
                >
                  <div className="project-image-wrapper">
                    <img
                      src={`http://localhost:5285${project.featuredImageURL}`}
                      alt={project.title}
                      className="project-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
                      }}
                    />
                    {project.isFeatured && (
                      <span className="featured-badge">⭐ Featured</span>
                    )}
                  </div>
                  <div className="project-content">
                    <span className="project-category">{project.categoryName}</span>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.shortDescription}</p>
                    <div className="project-read-more">
                      View Project <span className="arrow">→</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* RIGHT COLUMN - Featured Projects Sidebar */}
          <div className="portfolio-right">
            <div className="featured-sidebar">
              <h3>🔥 Featured Projects</h3>
              <p className="sidebar-subtitle">Our most outstanding work</p>
              
              {featured.length === 0 ? (
                <p className="no-featured">No featured projects yet.</p>
              ) : (
                <div className="featured-list">
                  {featured.map(project => (
                    <Link 
                      to={`/portfolio/${project.slug}`} 
                      key={project.id} 
                      className="featured-item"
                    >
                      <div className="featured-image">
                        <img
                          src={`http://localhost:5285${project.featuredImageURL}`}
                          alt={project.title}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x60?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="featured-info">
                        <h4>{project.title}</h4>
                        <span className="featured-category">{project.categoryName}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Optional: Newsletter Widget */}
            <div className="sidebar-widget">
              <h3>📧 Get Updates</h3>
              <p>Subscribe to get notified about new projects</p>
              <form className="widget-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" />
                <button type="submit">Subscribe →</button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Portfolio;