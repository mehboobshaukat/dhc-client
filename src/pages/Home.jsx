import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { getServices } from "../services/api";
import bgvideo from "../assets/bgvideo.mp4";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    const [services, setServices] = useState([]);

    useEffect(()=>{
        const fetchData = async () => {
            const data = await getServices();
            setServices(data);
        };

        fetchData();
    }, []);

    return (
        <div className="container-fluid p-0">
            {/* Hero section - Fully Responsive */}
            <section className="hero w-100">
                <div className="container-fluid hero-video-container">
                    <video autoPlay loop muted className="hero-video">
                        <source src={bgvideo} type="video/mp4" />
                    </video>

                    <div className="hero-content text-center">
                        <h1 className="display-4">DevelopersHub Corporation</h1>
                        <p className="lead">We build powerful digital solutions</p>
                        <button className="btn btn-primary btn-lg">Get Started</button>
                    </div>
                </div>
            </section>

            {/* Services Section - Responsive Cards (4 → 3 → 2 → 1) */}
            <div className="container py-5">
                <h2 className="text-center mb-4">Our Services</h2>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4 justify-content-center">
                    {services.length > 0 ? (
                        services.slice(0, 4).map((service) => (
                            <ServiceCard
                                key={service.id}
                                imageURL={service.imageURL}
                                title={service.title}
                                summary={service.summary}
                                slug = {service.slug}
                            />
                        ))
                    ) : (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading services...</p>
                        </div>
                    )}
                </div>

                {/* View All Services Button */}
                {services.length > 4 && (
                    <div className="text-center mt-5">
                        <Link to="/services">
                            <button className="btn btn-primary btn-lg">View All Services →</button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Call to Action Section - Responsive */}
            <section className="cta-section d-flex align-items-center justify-content-center">
                <div className="cta-box ctaBoxToBook text-center">
                    <h2>Ready to start your project?</h2>
                    <p>Let’s build something amazing together.</p>
                    <Link to="/booking">
                        <button className="cta-btn">Book Now</button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;