import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { getServices, getCategories } from "../services/api";
import { formatDate } from "../services/api"; 
import "../assets/style.css"

function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("oldest");

  console.log(services);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getServices();
      const catData = await getCategories();

      setServices(data);
      setCategories(catData);
    };

    fetchData();
  }, []);

  let filteredServices = [...services];

  if (selectedCategory !== "All") {
    filteredServices = filteredServices.filter(
      (s) => s.categoryName === selectedCategory
    );
  }

  if (sortOrder === "newest") {
    filteredServices = [...filteredServices].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  if (sortOrder === "oldest") {
    filteredServices = [...filteredServices].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  return (
    <div className="container-fluid scOuter py-5">
      {/* Header Section with Filters */}
      <div className="services-header text-center mb-5">
        <h1>Our Services</h1>
        <p>Explore our powerful digital solutions</p>
        
        {/* Filter Controls in Header */}
        <div className="filter-controls d-flex justify-content-center gap-3 mt-4 flex-wrap">
          {/* Category Filter */}
          <div className="filter-group" style={{ minWidth: "200px" }}>
            <select
              className="form-select"
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
              aria-label="Filter by category"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="filter-group" style={{ minWidth: "150px" }}>
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort by date"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid - Responsive columns: 4 on large, 3 on medium, 2 on small */}
      <div className="row sGrid row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4 justify-content-center">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              imageURL={service.imageURL}
              title={service.title}
              summary={service.summary}
              createdAt={service.createdAt}
              showDate={true}
              slug = {service.slug}
            />
          ))
        ) : (
          <p className="text-center mt-5">No services found</p>
        )}
      </div>
    </div>
  );
}

export default Services;