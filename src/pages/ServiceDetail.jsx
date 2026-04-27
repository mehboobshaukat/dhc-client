import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ServiceDetail.css";

function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5285/api/services/get-by-slug/${slug}`
        );
        const data = await res.json();
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Service Not Found!</h4>
          <p>The service you're looking for doesn't exist or has been removed.</p>
          <Link to="/services" className="btn btn-primary mt-3">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="service-detail-page">
      {/* Hero Banner Section */}
      <div className="service-hero-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white text-decoration-none">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/services" className="text-white text-decoration-none">Services</Link>
              </li>
              <li className="breadcrumb-item active text-white-50" aria-current="page">
                {service.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          {/* Left Column - Image */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="service-image-container">
              <img
                src={`http://localhost:5285${service.imageURL}`}
                alt={service.title}
                className="service-main-image"
              />
              {/* Badge over image */}
              <div className="service-badge">
                <span className="badge bg-primary fs-6 px-3 py-2">
                  {service.categoryName}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="col-lg-6">
            <div id="service-info-card" className="service-info-card">
              <h1 className="service-title">{service.title}</h1>
              
              {/* Rating/Stats Row */}
              <div className="service-stats mb-4">
                <div className="d-flex gap-3 flex-wrap">
                  <div className="stat-item">
                    <i className="bi bi-clock-history"></i>
                    <span>Updated: {new Date(service.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="stat-item">
                    <i className="bi bi-star-fill text-warning"></i>
                    <span>4.9 (128 reviews)</span>
                  </div>
                  <div className="stat-item">
                    <i className="bi bi-people-fill"></i>
                    <span>500+ happy clients</span>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="service-summary mb-4">
                <h5><i className="bi bi-card-text me-2"></i>Overview</h5>
                <p className="text-muted">{service.summary || service.description.substring(0, 150)}</p>
              </div>

              {/* Price Card */}
              <div className="price-card mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="price-label">Starting from</span>
                    <h2 className="price-value mb-0">Rs. {service.price.toLocaleString()}</h2>
                  </div>
                  <div className="price-badge">
                    <i className="bi bi-tag-fill"></i> Best Price
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <Link to="/booking" state={{ service: service }}>
                  <button className="btn-book-now">
                    <i className="bi bi-calendar-check me-2"></i>
                    Book This Service
                  </button>
                </Link>
              </div>

              {/* Features List */}
              <div className="features-list mt-4 pt-3">
                <h5><i className="bi bi-check-circle-fill text-primary me-2"></i>What's Included</h5>
                <div className="row g-2 mt-2">
                  <div className="col-md-6">
                    <p><i className="bi bi-check-lg text-success me-2"></i>Professional Support</p>
                  </div>
                  <div className="col-md-6">
                    <p><i className="bi bi-check-lg text-success me-2"></i>24/7 Customer Service</p>
                  </div>
                  <div className="col-md-6">
                    <p><i className="bi bi-check-lg text-success me-2"></i>Money Back Guarantee</p>
                  </div>
                  <div className="col-md-6">
                    <p><i className="bi bi-check-lg text-success me-2"></i>Free Consultation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Description Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="description-card">
              <ul className="nav nav-tabs mb-4" id="serviceTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab">
                    <i className="bi bi-file-text me-2"></i>Full Description
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="process-tab" data-bs-toggle="tab" data-bs-target="#process" type="button" role="tab">
                    <i className="bi bi-gear me-2"></i>Our Process
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="faq-tab" data-bs-toggle="tab" data-bs-target="#faq" type="button" role="tab">
                    <i className="bi bi-question-circle me-2"></i>FAQ
                  </button>
                </li>
              </ul>
              
              <div className="tab-content">
                <div className="tab-pane fade show active" id="description" role="tabpanel">
                  <div className="service-description">
                    {service.description.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-3">{paragraph}</p>
                    ))}
                  </div>
                </div>
                
                <div className="tab-pane fade" id="process" role="tabpanel">
                  <div className="process-steps">
                    <div className="step">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <h5>Requirement Gathering</h5>
                        <p>We discuss your needs and project requirements in detail.</p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <h5>Planning & Design</h5>
                        <p>Our team creates a comprehensive plan and design mockups.</p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <h5>Development</h5>
                        <p>We build your solution using latest technologies.</p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">4</div>
                      <div className="step-content">
                        <h5>Delivery & Support</h5>
                        <p>Final delivery with ongoing support and maintenance.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="tab-pane fade" id="faq" role="tabpanel">
                  <div className="faq-list">
                    <div className="faq-item">
                      <h6>How long does delivery take?</h6>
                      <p>Typically 7-14 business days depending on project complexity.</p>
                    </div>
                    <div className="faq-item">
                      <h6>Do you offer refunds?</h6>
                      <p>Yes, we offer a 30-day money-back guarantee.</p>
                    </div>
                    <div className="faq-item">
                      <h6>Can I customize this service?</h6>
                      <p>Absolutely! Contact us for custom requirements.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Services Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="related-services">
              <h3 className="text-center mb-4">
                <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                Related Services You May Like
              </h3>
              <p className="text-center text-muted mb-5">
                Explore more services from the same category
              </p>
              <div className="text-center">
                <Link to="/services">
                  <button className="btn btn-outline-primary btn-lg">
                    View All Services <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;