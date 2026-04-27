// import { useEffect, useState } from "react";

// function About() {
//   const [about, setAbout] = useState(null);
//   const [team, setTeam] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // About Data
//         const aboutRes = await fetch("http://localhost:5285/api/about/get-about");
//         const aboutData = await aboutRes.json();

//         // Team Data
//         const teamRes = await fetch("http://localhost:5285/api/team/team-getby-public");
//         const teamData = await teamRes.json();

//         setAbout(aboutData);
//         setTeam(teamData);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

//   return (
//     <div className="container" style={{ marginTop: "100px" }}>
      
//       {/* About Section */}
//       <section>
//         <h1>About Us</h1>

//         <div>
//           <h3>Mission</h3>
//           <p>{about?.mission || "No mission added yet."}</p>
//         </div>

//         <div>
//           <h3>Vision</h3>
//           <p>{about?.vision || "No vision added yet."}</p>
//         </div>

//         <div>
//           <h3>Background</h3>
//           <p>{about?.background || "No background added yet."}</p>
//         </div>

//         <div>
//           <h3>Goals</h3>
//           <p>{about?.goals || "No goals added yet."}</p>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section style={{ marginTop: "60px" }}>
//         <h2>Meet Our Team</h2>

//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//           gap: "20px",
//           marginTop: "20px"
//         }}>
//           {team.length > 0 ? (
//             team.map((member, index) => (
//               <div key={index} style={{
//                 border: "1px solid #ddd",
//                 padding: "15px",
//                 textAlign: "center",
//                 borderRadius: "10px"
//               }}>
//                 <img
//                   src={
//                     member.imageURL
//                       ? `http://localhost:5285${member.imageURL}`
//                       : "https://via.placeholder.com/150"
//                   }
//                   alt={member.name}
//                   style={{
//                     width: "100%",
//                     height: "200px",
//                     objectFit: "cover",
//                     borderRadius: "10px"
//                   }}
//                 />

//                 <h4 style={{ marginTop: "10px" }}>{member.name}</h4>
//                 <p>{member.role}</p>
//               </div>
//             ))
//           ) : (
//             <p>No team members found.</p>
//           )}
//         </div>
//       </section>

//     </div>
//   );
// }

// export default About;



import { useEffect, useState } from "react";
import "./About.css";

function About() {
  const [about, setAbout] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    mission: false,
    vision: false,
    background: false,
    goals: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aboutRes = await fetch("http://localhost:5285/api/about/get-about");
        const aboutData = await aboutRes.json();

        const teamRes = await fetch("http://localhost:5285/api/team/team-getby-public");
        const teamData = await teamRes.json();

        setAbout(aboutData);
        setTeam(teamData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleReadMore = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const truncateText = (text, limit = 150) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  if (loading) {
    return (
      <div className="about-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing content...</p>
      </div>
    );
  }

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1>About Us</h1>
          <p>Discover who we are and what drives us</p>
        </div>
      </div>

      <div className="about-container">
        
        {/* Mission & Vision Row */}
        <div className="about-grid">
          <div className="about-card mission-card">
            <div className="card-icon">🎯</div>
            <h3>Our Mission</h3>
            <div className="card-content">
              <p className={!expandedSections.mission ? "truncated" : ""}>
                {!expandedSections.mission && about?.mission?.length > 150 
                  ? truncateText(about?.mission, 150)
                  : about?.mission || "No mission added yet."}
              </p>
              {about?.mission?.length > 150 && (
                <button className="read-more-btn" onClick={() => toggleReadMore("mission")}>
                  {expandedSections.mission ? "Show Less ↑" : "Read More ↓"}
                </button>
              )}
            </div>
          </div>

          <div className="about-card vision-card">
            <div className="card-icon">👁️</div>
            <h3>Our Vision</h3>
            <div className="card-content">
              <p className={!expandedSections.vision ? "truncated" : ""}>
                {!expandedSections.vision && about?.vision?.length > 150 
                  ? truncateText(about?.vision, 150)
                  : about?.vision || "No vision added yet."}
              </p>
              {about?.vision?.length > 150 && (
                <button className="read-more-btn" onClick={() => toggleReadMore("vision")}>
                  {expandedSections.vision ? "Show Less ↑" : "Read More ↓"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Background Section */}
        <div className="about-section background-section">
          <div className="section-icon">📜</div>
          <h2>Our Background</h2>
          <div className="section-content">
            <p className={!expandedSections.background ? "truncated" : ""}>
              {!expandedSections.background && about?.background?.length > 200 
                ? truncateText(about?.background, 200)
                : about?.background || "No background added yet."}
            </p>
            {about?.background?.length > 200 && (
              <button className="read-more-btn" onClick={() => toggleReadMore("background")}>
                {expandedSections.background ? "Show Less ↑" : "Read More ↓"}
              </button>
            )}
          </div>
        </div>

        {/* Goals Section */}
        <div className="about-section goals-section">
          <div className="section-icon">🏆</div>
          <h2>Our Goals</h2>
          <div className="section-content">
            <p className={!expandedSections.goals ? "truncated" : ""}>
              {!expandedSections.goals && about?.goals?.length > 200 
                ? truncateText(about?.goals, 200)
                : about?.goals || "No goals added yet."}
            </p>
            {about?.goals?.length > 200 && (
              <button className="read-more-btn" onClick={() => toggleReadMore("goals")}>
                {expandedSections.goals ? "Show Less ↑" : "Read More ↓"}
              </button>
            )}
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2>Meet Our Team</h2>
          <p className="team-subtitle">The passionate people behind our success</p>

          <div className="team-grid">
            {team.length > 0 ? (
              team.map((member, index) => (
                <div className="team-card" key={index}>
                  <div className="team-image-wrapper">
                    <img
                      src={
                        member.imageURL
                          ? `http://localhost:5285${member.imageURL}`
                          : "https://ui-avatars.com/api/?background=3b82f6&color=fff&name=" + (member.name || 'Team')
                      }
                      alt={member.name}
                      className="team-image"
                    />
                    <div className="team-overlay">
                      <span>🔍</span>
                    </div>
                  </div>
                  <h4>{member.name}</h4>
                  <p className="team-role">{member.role}</p>
                  {member.bio && <p className="team-bio">{member.bio.substring(0, 80)}...</p>}
                </div>
              ))
            ) : (
              <p className="no-team">No team members found.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default About;