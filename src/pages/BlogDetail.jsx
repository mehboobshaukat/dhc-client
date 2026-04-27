// import { useParams, Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./BlogDetail.css";

// function BlogDetail() {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [relatedBlogs, setRelatedBlogs] = useState([]);

//   useEffect(() => {
//     const fetchBlog = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(
//           `http://localhost:5285/api/blogs/get-by-slug/${slug}`
//         );
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         const data = await res.json();
//         setBlog(data);
        
//         if (data && data.categoryName) {
//           try {
//             const relatedRes = await fetch(
//               `http://localhost:5285/api/blogs/get-by-category/${data.categoryName.toLowerCase()}`
//             );
//             if (relatedRes.ok) {
//               const relatedData = await relatedRes.json();
//               setRelatedBlogs(relatedData.filter(b => b.slug !== slug).slice(0, 3));
//             }
//           } catch (err) {
//             console.error("Error fetching related blogs:", err);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching blog:", error);
//         setError("Failed to load blog. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlog();
//   }, [slug]);

//   const handleFollow = (platform) => {
//     const socialLinks = {
//       twitter: 'https://twitter.com/developershub',
//       linkedin: 'https://linkedin.com/company/developershub',
//       github: 'https://github.com/developershub',
//       facebook: 'https://facebook.com/developershub'
//     };
    
//     if (socialLinks[platform]) {
//       window.open(socialLinks[platform], '_blank');
//     }
//   };

//   const handleSubscribe = async (e) => {
//     e.preventDefault();
//     const email = e.target.querySelector('input[type="email"]').value;
    
//     if (!email) {
//       alert('Please enter your email address');
//       return;
//     }

//     console.log('Subscribing email:', email);
//     alert(`Thanks for subscribing! ${email} will receive our newsletter.`);
//     e.target.reset();
//   };

//   if (loading) {
//     return (
//       <div className="blog-detail-loading">
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Loading amazing content...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !blog) {
//     return (
//       <div className="blog-detail-error">
//         <div className="error-container">
//           <div className="error-icon">📄</div>
//           <h2>Blog Not Found</h2>
//           <p>{error || "The blog you're looking for doesn't exist or has been removed."}</p>
//           <Link to="/blog" className="error-btn">
//             ← Back to Blogs
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="blog-detail-page">
//       {/* Hero Section */}
//       <div className="blog-detail-hero">
//         <div className="hero-overlay"></div>
//         <div 
//           className="hero-background"
//           style={{ backgroundImage: `url(http://localhost:5285${blog.featuredImageURL})` }}
//         ></div>
//         <div className="container hero-content">
//           <div className="hero-breadcrumb">
//             <Link to="/">Home</Link> / 
//             <Link to="/blog">Blog</Link> / 
//             <span>{blog.categoryName}</span>
//           </div>
//           <h1 className="hero-title">{blog.title}</h1>
//           <div className="hero-meta">
//             <div className="meta-item">
//               <span className="meta-icon">📅</span>
//               {new Date(blog.createdAt).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//               })}
//             </div>
//             <div className="meta-item">
//               <span className="meta-icon">⏱️</span>
//               {Math.ceil((blog.content?.length || 0) / 1000) || 3} min read
//             </div>
//             <div className="meta-item">
//               <span className="meta-icon">📂</span>
//               {blog.categoryName}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="blog-detail-main">
//         <div className="container">
//           <div className="row g-5">
            
//             {/* Left Column - Blog Content */}
//             <div className="col-lg-8">
//               <article className="blog-article">
//                 <div className="blog-summary-box">
//                   <div className="summary-icon">✨</div>
//                   <h3>Quick Summary</h3>
//                   <p>{blog.summary}</p>
//                 </div>

//                 {/* Main Content */}
//                 <div 
//                   className="blog-content-wrapper"
//                   dangerouslySetInnerHTML={{ __html: blog.content }}
//                 />

//                 {blog.tags && blog.tags.length > 0 && (
//                   <div className="blog-tags-section">
//                     <h4>🏷️ Tags</h4>
//                     <div className="tags-list">
//                       {blog.tags.map((tag, index) => (
//                         <span key={index} className="tag-item">
//                           #{tag}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="blog-author-box">
//                   <div className="author-avatar">
//                     <div className="avatar-placeholder">👨‍💻</div>
//                   </div>
//                   <div className="author-info">
//                     <h4>Written by DevelopersHub Team</h4>
//                     <p>Expert developers sharing insights about web development, digital solutions, and industry best practices.</p>
//                     <div className="author-social">
//                       <button onClick={() => handleFollow('twitter')} className="social-link-btn twitter">Twitter</button>
//                       <button onClick={() => handleFollow('linkedin')} className="social-link-btn linkedin">LinkedIn</button>
//                       <button onClick={() => handleFollow('github')} className="social-link-btn github">GitHub</button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="blog-navigation">
//                   <Link to="/blog" className="nav-btn">
//                     ← All Blogs
//                   </Link>
//                   <Link to="/booking" className="nav-btn primary">
//                     Book a Consultation →
//                   </Link>
//                 </div>
//               </article>
//             </div>

//             {/* Right Column - Sidebar */}
//             <div className="col-lg-4">
//               <div className="blog-sidebar">
                
//                 {/* ============================================ */}
//                 {/* TABLE OF CONTENTS - REMOVED / COMMENTED OUT */}
//                 {/* ============================================ */}
//                 {/*
//                 <div className="sidebar-widget toc-widget">
//                   <h3>📑 Table of Contents</h3>
//                   <div className="toc-content">
//                     // TOC items would go here
//                   </div>
//                 </div>
//                 */}

//                 {/* Follow Widget */}
//                 <div className="sidebar-widget follow-widget">
//                   <h3>👥 Follow Us</h3>
//                   <p>Stay connected on social media for daily updates</p>
//                   <div className="follow-buttons">
//                     <button onClick={() => handleFollow('twitter')} className="follow-btn-twitter">🐦 Twitter</button>
//                     <button onClick={() => handleFollow('linkedin')} className="follow-btn-linkedin">🔗 LinkedIn</button>
//                     <button onClick={() => handleFollow('github')} className="follow-btn-github">💻 GitHub</button>
//                     <button onClick={() => handleFollow('facebook')} className="follow-btn-facebook">📘 Facebook</button>
//                   </div>
//                   <div className="follow-stats">
//                     <span>🌟 5.2k followers</span>
//                     <span>📈 Growing daily</span>
//                   </div>
//                 </div>

//                 {/* Related Posts */}
//                 {relatedBlogs.length > 0 && (
//                   <div className="sidebar-widget related-widget">
//                     <h3>🔗 Related Posts</h3>
//                     <div className="related-posts">
//                       {relatedBlogs.map((related) => (
//                         <Link to={`/blog/${related.slug}`} key={related.id} className="related-post">
//                           <div className="related-post-image">
//                             <img 
//                               src={`http://localhost:5285${related.featuredImageURL}`} 
//                               alt={related.title}
//                               onError={(e) => e.target.src = "https://via.placeholder.com/80x60"}
//                             />
//                           </div>
//                           <div className="related-post-info">
//                             <h4>{related.title}</h4>
//                             <span>{new Date(related.createdAt).toLocaleDateString()}</span>
//                           </div>
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Subscribe Widget */}
//                 <div className="sidebar-widget subscribe-widget">
//                   <h3>📧 Subscribe to Newsletter</h3>
//                   <p>Get the latest blogs directly in your inbox.</p>
//                   <form className="subscribe-form" onSubmit={handleSubscribe}>
//                     <input type="email" placeholder="Enter your email" required />
//                     <button type="submit">Subscribe →</button>
//                   </form>
//                 </div>

//                 {/* Share Widget */}
//                 <div className="sidebar-widget share-widget">
//                   <h3>📤 Share This Post</h3>
//                   <div className="share-buttons">
//                     <button 
//                       className="share-btn twitter"
//                       onClick={() => window.open(`https://twitter.com/intent/tweet?text=${blog.title}&url=${window.location.href}`, '_blank')}
//                     >🐦 Twitter</button>
//                     <button 
//                       className="share-btn linkedin"
//                       onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
//                     >🔗 LinkedIn</button>
//                     <button 
//                       className="share-btn facebook"
//                       onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
//                     >📘 Facebook</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Comments Section */}
//       <div className="blog-comments-section">
//         <div className="container">
//           <div className="comments-wrapper">
//             <h3>💬 Discussion (0 Comments)</h3>
//             <div className="comment-form">
//               <textarea placeholder="Share your thoughts..." rows="4"></textarea>
//               <div className="comment-form-footer">
//                 <input type="text" placeholder="Your name" />
//                 <input type="email" placeholder="Your email" />
//                 <button className="submit-comment">Post Comment</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BlogDetail;







import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getToken, isAuthenticated } from "../utils/auth";
import "./BlogDetail.css";

function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const contentRef = useRef(null);

  // Fetch user profile if logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5285/api/auth/get-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:5285/api/blogs/get-by-slug/${slug}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setBlog(data);
        
        // Fetch comments for this blog
        await fetchComments(data.id);
        
        if (data && data.categoryName) {
          try {
            const relatedRes = await fetch(
              `http://localhost:5285/api/blogs/get-by-category/${data.categoryName.toLowerCase()}`
            );
            if (relatedRes.ok) {
              const relatedData = await relatedRes.json();
              setRelatedBlogs(relatedData.filter(b => b.slug !== slug).slice(0, 3));
            }
          } catch (err) {
            console.error("Error fetching related blogs:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to load blog. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Fetch comments for a blog
  const fetchComments = async (blogId) => {
    try {
      const res = await fetch(`http://localhost:5285/api/comments/blog/${blogId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Handle comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      alert("Please login to post a comment");
      return;
    }

    if (!commentContent.trim()) {
      alert("Please enter a comment");
      return;
    }

    setSubmitting(true);
    
    try {
      const token = getToken();
      const res = await fetch("http://localhost:5285/api/comments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          blogId: blog.id,
          userId: user?.id,
          content: commentContent.trim(),
        }),
      });

      if (res.ok) {
        setCommentContent("");
        // Refresh comments
        await fetchComments(blog.id);
        alert("Comment posted successfully.");
      } else {
        const error = await res.text();
        alert(error || "Failed to post comment");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-error">
        <div className="error-container">
          <div className="error-icon">📄</div>
          <h2>Blog Not Found</h2>
          <p>{error || "The blog you're looking for doesn't exist or has been removed."}</p>
          <Link to="/blog" className="error-btn">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      {/* Hero Section */}
      <div className="blog-detail-hero">
        <div className="hero-overlay"></div>
        <div 
          className="hero-background"
          style={{ backgroundImage: `url(http://localhost:5285${blog.featuredImageURL})` }}
        ></div>
        <div className="container hero-content">
          <div className="hero-breadcrumb">
            <Link to="/">Home</Link> / 
            <Link to="/blog">Blog</Link> / 
            <span>{blog.categoryName}</span>
          </div>
          <h1 className="hero-title">{blog.title}</h1>
          <div className="hero-meta">
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              {formatDate(blog.createdAt)}
            </div>
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              {Math.ceil((blog.content?.length || 0) / 1000) || 3} min read
            </div>
            <div className="meta-item">
              <span className="meta-icon">📂</span>
              {blog.categoryName}
            </div>
            <div className="meta-item">
              <span className="meta-icon">💬</span>
              {comments.length} Comments
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="blog-detail-main">
        <div className="container">
          <div className="row g-5">
            
            {/* Left Column - Blog Content */}
            <div className="col-lg-8">
              <article className="blog-article">
                <div className="blog-summary-box">
                  <div className="summary-icon">✨</div>
                  <h3>Quick Summary</h3>
                  <p>{blog.summary}</p>
                </div>

                <div 
                  ref={contentRef}
                  className="blog-content-wrapper"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {blog.tags && blog.tags.length > 0 && (
                  <div className="blog-tags-section">
                    <h4>🏷️ Tags</h4>
                    <div className="tags-list">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className="tag-item">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="blog-author-box">
                  <div className="author-avatar">
                    <div className="avatar-placeholder">👨‍💻</div>
                  </div>
                  <div className="author-info">
                    <h4>Written by DevelopersHub Team</h4>
                    <p>Expert developers sharing insights about web development, digital solutions, and industry best practices.</p>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="blog-comments-section-full">
                  <h3 className="comments-title">
                    💬 Comments ({comments.length})
                  </h3>

                  {/* Comment Form - Only for logged in users */}
                  {isAuthenticated() ? (
                    <form onSubmit={handleSubmitComment} className="comment-form">
                      <div className="comment-user-info">
                        <img 
                          src={
                            user?.imageURL 
                              ? `http://localhost:5285${user.imageURL}`
                              : `https://ui-avatars.com/api/?background=3b82f6&color=fff&name=${user?.name?.[0] || 'U'}`
                          }
                          alt={user?.name}
                          className="comment-avatar"
                        />
                        <div className="comment-user-details">
                          <span className="comment-user-name">{user?.name || user?.userName}</span>
                          <span className="comment-user-email">{user?.email}</span>
                        </div>
                      </div>
                      <textarea
                        className="comment-textarea"
                        placeholder="Share your thoughts..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        rows="4"
                        required
                      ></textarea>
                      <button type="submit" className="submit-comment-btn" disabled={submitting}>
                        {submitting ? "Posting..." : "Post Comment"}
                      </button>
                    </form>
                  ) : (
                    <div className="login-to-comment">
                      <p>🔐 Please <Link to="/auth">login</Link> to leave a comment</p>
                    </div>
                  )}

                  {/* Comments List */}
                  <div className="comments-list">
                    {comments.length === 0 ? (
                      <div className="no-comments">
                        <p>No comments yet. Be the first to share your thoughts!</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-header">
                            <div className="comment-author-info">
                              <div className="comment-author-avatar">
                                {comment.userName?.[0] || 'U'}
                              </div>
                              <div className="comment-author-details">
                                <span className="comment-author-name">{comment.userName || 'Anonymous'}</span>
                                <span className="comment-date">{formatDate(comment.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="comment-content">
                            <p>{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="blog-navigation">
                  <Link to="/blog" className="nav-btn">
                    ← All Blogs
                  </Link>
                  <Link to="/booking" className="nav-btn primary">
                    Book a Consultation →
                  </Link>
                </div>
              </article>
            </div>

            {/* Right Column - Sidebar */}
            <div className="col-lg-4">
              <div className="blog-sidebar">
                
                {/* Related Posts */}
                {relatedBlogs.length > 0 && (
                  <div className="sidebar-widget related-widget">
                    <h3>🔗 Related Posts</h3>
                    <div className="related-posts">
                      {relatedBlogs.map((related) => (
                        <Link to={`/blog/${related.slug}`} key={related.id} className="related-post">
                          <div className="related-post-image">
                            <img 
                              src={`http://localhost:5285${related.featuredImageURL}`} 
                              alt={related.title}
                              onError={(e) => e.target.src = "https://via.placeholder.com/80x60"}
                            />
                          </div>
                          <div className="related-post-info">
                            <h4>{related.title}</h4>
                            <span>{formatDate(related.createdAt)}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subscribe Widget */}
                <div className="sidebar-widget subscribe-widget">
                  <h3>📧 Subscribe to Newsletter</h3>
                  <p>Get the latest blogs directly in your inbox.</p>
                  <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="Enter your email" required />
                    <button type="submit">Subscribe →</button>
                  </form>
                </div>

                {/* Share Widget */}
                <div className="sidebar-widget share-widget">
                  <h3>📤 Share This Post</h3>
                  <div className="share-buttons">
                    <button 
                      className="share-btn twitter"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=${blog.title}&url=${window.location.href}`, '_blank')}
                    >
                      🐦 Twitter
                    </button>
                    <button 
                      className="share-btn linkedin"
                      onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
                    >
                      🔗 LinkedIn
                    </button>
                    <button 
                      className="share-btn facebook"
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                    >
                      📘 Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;