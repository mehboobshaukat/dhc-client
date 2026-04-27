import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PortfolioDetail.css";

function PortfolioDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5285/api/portfolios/get-by-slug/${slug}`);
        if (!res.ok) throw new Error("Project not found");
        const data = await res.json();
        setProject(data);
        
        // Parse gallery images if they exist
        if (data.galleryImages) {
          try {
            const gallery = JSON.parse(data.galleryImages);
            setActiveImage(gallery[0] || data.featuredImageURL);
          } catch {
            setActiveImage(data.featuredImageURL);
          }
        } else {
          setActiveImage(data.featuredImageURL);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  // Parse technologies
  const parseTechnologies = (techString) => {
    if (!techString) return [];
    if (Array.isArray(techString)) return techString;
    return techString.split(',').map(t => t.trim());
  };

  // Parse gallery images
  const parseGalleryImages = () => {
    if (!project?.galleryImages) return [];
    try {
      return JSON.parse(project.galleryImages);
    } catch {
      return [];
    }
  };

  const galleryImages = parseGalleryImages();
  const technologies = parseTechnologies(project?.technologies);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="detail-loading-spinner"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="detail-error">
        <div className="detail-error-content">
          <span className="detail-error-icon">📁</span>
          <h2>Project Not Found</h2>
          <p>{error || "The project you're looking for doesn't exist."}</p>
          <Link to="/portfolio" className="detail-error-btn">← Back to Portfolio</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="detail-hero">
        <div className="detail-hero-bg" style={{ backgroundImage: `url(http://localhost:5285${project.featuredImageURL})` }}></div>
        <div className="detail-hero-overlay"></div>
        <div className="detail-hero-content">
          <div className="detail-hero-breadcrumb">
            <Link to="/">Home</Link> <span>/</span>
            <Link to="/portfolio">Portfolio</Link> <span>/</span>
            <span>{project.categoryName}</span>
          </div>
          <h1 className="detail-hero-title">{project.title}</h1>
          <div className="detail-hero-meta">
            <span className="detail-meta-badge">{project.categoryName}</span>
            {project.projectUrl && (
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="detail-meta-link">
                🌐 Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="detail-meta-link">
                💻 GitHub
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="detail-main">
        <div className="detail-container">
          
          {/* Image Gallery */}
          <div className="detail-gallery">
            <div className="detail-main-image">
              <img src={`http://localhost:5285${activeImage || project.featuredImageURL}`} alt={project.title} />
            </div>
            {(galleryImages.length > 0 || project.featuredImageURL) && (
              <div className="detail-thumbnails">
                <img 
                  src={`http://localhost:5285${project.featuredImageURL}`}
                  alt="Featured"
                  className={`detail-thumb ${activeImage === project.featuredImageURL ? 'active' : ''}`}
                  onClick={() => setActiveImage(project.featuredImageURL)}
                />
                {galleryImages.map((img, idx) => (
                  <img 
                    key={idx}
                    src={`http://localhost:5285${img}`}
                    alt={`Gallery ${idx + 1}`}
                    className={`detail-thumb ${activeImage === img ? 'active' : ''}`}
                    onClick={() => setActiveImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Project Info - Left Aligned */}
          <div className="detail-info">
            <h2 className="detail-info-title">Project Overview</h2>
            <p className="detail-info-text">{project.description}</p>

            {technologies.length > 0 && (
              <div className="detail-tech">
                <h3 className="detail-section-title">Technologies Used</h3>
                <div className="detail-tech-list">
                  {technologies.map((tech, idx) => (
                    <span key={idx} className="detail-tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {project.challenges && (
              <div className="detail-challenges">
                <h3 className="detail-section-title">Challenges</h3>
                <p className="detail-section-text">{project.challenges}</p>
              </div>
            )}

            {project.solution && (
              <div className="detail-solution">
                <h3 className="detail-section-title">Solution</h3>
                <p className="detail-section-text">{project.solution}</p>
              </div>
            )}

            <div className="detail-actions">
              <Link to="/portfolio" className="detail-action-btn secondary">← Back to Portfolio</Link>
              {(project.projectUrl || project.githubUrl) && (
                <div className="detail-action-links">
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="detail-action-btn primary">Live Demo →</a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="detail-action-btn dark">GitHub →</a>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default PortfolioDetail;