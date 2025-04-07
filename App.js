import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import News from './pages/news_main/News';
import LoadingBar from 'react-top-loading-bar';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import ProfilePage from './pages/profile/Profile';

export default class App extends Component {
  pageSize = 6;

  state = {
    progress: 0,
    isAuthenticated: true,
  };

  setProgress = (progress) => {
    this.setState({ progress });
  };

  handleLogin = () => {
    this.setState({ isAuthenticated: true });
  };

  renderNewsRoutes = () => {
    const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

    return categories.map((category) => (
      <Route
        key={category}
        path={`/news/${category}`}
        element={
          <News
            setProgress={this.setProgress}
            pageSize={this.pageSize}
            country="us"
            category={category}
          />
        }
      />
    ));
  };

  render() {
    const { isAuthenticated } = this.state;
    const isNewsRoute = window.location.pathname.startsWith('/news');

    return (
      <Router>
        {/* Show Navbar only on news routes */}
        {isAuthenticated && isNewsRoute && <Navbar />}

        <LoadingBar color="#f11946" progress={this.state.progress} height={2} />

        <Routes>
          {/* Public Routes */}
          <Route path="/ss" element={<Login setIsAuthenticated={this.handleLogin} />} />
          <Route path="/" element={<ProfilePage />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              {/* Protected Profile Route */}
              <Route path="/profile" element={<ProfilePage />} />

              {/* Protected News Routes */}
              {this.renderNewsRoutes()}

              {/* Default Redirect */}
              <Route path="*" element={<Navigate to="/news/general" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </Router>
    );
  }
}
