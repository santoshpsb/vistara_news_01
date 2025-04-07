import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const ProfilePage = () => {
  const [selectedSection, setSelectedSection] = useState('basic');
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const articlesPerPage = 10;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/news/general');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const email = "san@gmail.com";
      if (!email) {
        navigate('/');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/profile?email=${email}`);
        setUserData(res.data.user);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  // Pagination logic
  const savedArticles = userData?.saved || [];
  const totalPages = Math.ceil(savedArticles.length / articlesPerPage);
  const startIdx = (currentPage - 1) * articlesPerPage;
  const visibleArticles = savedArticles.slice(startIdx, startIdx + articlesPerPage);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
      <div className="home-icon" onClick={() => navigate('/news/general')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>Home</span>
        </div>
        <div
          className={`sidebar-item ${selectedSection === 'basic' ? 'active' : ''}`}
          onClick={() => setSelectedSection('basic')}
        >
          Basic Info
        </div>
        <div
          className={`sidebar-item ${selectedSection === 'saved' ? 'active' : ''}`}
          onClick={() => setSelectedSection('saved')}
        >
          Saved Articles
        </div>
      </aside>

      {/* Logout Button */}
      <div className="logout-button" onClick={handleLogout}>
        <span>Logout</span>
      </div>

      {/* Main content */}
      <main className="content">
        {selectedSection === 'basic' ? (
          <div className="basic-info">
            <h2>User Profile</h2>
            {userData ? (
              <>
                <div className="info-box"><label>First Name</label><div className="info-value">{userData.firstName}</div></div>
                <div className="info-box"><label>Last Name</label><div className="info-value">{userData.lastName}</div></div>
                <div className="info-box"><label>Email</label><div className="info-value">{userData.email}</div></div>
                <div className="info-box"><label>Country</label><div className="info-value">{userData.country}</div></div>
              </>
            ) : (
              <p>Loading user information...</p>
            )}
          </div>
        ) : (
          <div className="saved-articles">
            <h2>Saved Articles</h2>
            {visibleArticles.length > 0 ? (
              <>
                <ul>
                  {visibleArticles.map((article, index) => (
                    <li key={index}>
                      <a href={article} target="_blank" rel="noopener noreferrer">{article}</a>
                    </li>
                  ))}
                </ul>
                <div className="pagination">
                  <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
                </div>
              </>
            ) : (
              <p>No saved articles found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
