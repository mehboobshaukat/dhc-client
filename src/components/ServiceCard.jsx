import { Link } from "react-router-dom";
import "./ServiceCard.css";
import { formatDate } from "../services/api";

function ServiceCard({imageURL, title, summary, createdAt, showDate, slug}) {
  
  return (
    <div className="HM-SC-O col-md-4">
      <div className=" HM-SC-I card p-3 h-100">
        <img className="HM-SC-img" src={`http://localhost:5285${imageURL}`} alt="Image is not loaded yet." />
        <h4>{title}</h4>
        <p>{summary}</p>
        {showDate && createdAt && (
          <small className="datetime text-muted">{formatDate(createdAt)}</small>
        )}
        <Link to={`/services/${slug}`}>
          <button type="button" className="service-btn">
            Discover More
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ServiceCard;