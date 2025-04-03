import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Login.css';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    setIsValidEmail(emailRegex.test(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidEmail && email && password) {
      try {
        const response = await axios.post('http://localhost:5000/login', { email, password });
        console.log('Login Success', response.data);
        // You can redirect the user after successful login
        // For example: window.location.href = "/dashboard";
      } catch (error) {
        console.error('Login Error:', error.response);
        setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
      }
    } else {
      setErrorMessage('Please enter a valid email and password.');
    }
  };

  const responseGoogle = async (response) => {
    if (response.error) {
      console.log('Google login error:', response.error);
      setErrorMessage('Google login failed. Please try again.');
      return;
    }

    const decodedToken = jwtDecode(response.credential);  // response.credential is the JWT token
    const googleEmail = decodedToken.email;

  try {
      // Send the Google email to the backend to check if the user exists
      console.log(1,googleEmail)
      const res = await axios.post('http://localhost:5000/google-login', { email: googleEmail });
      console.log('Google Login Success', res.data);
      // Handle the login success (e.g., store user info, redirect, etc.)
    } catch (error) {
      console.error('Google Login Error:', error.response);
      setErrorMessage('An error occurred with Google login.');
    }
  };

  return (
    <div className="login-container">
      <a href="/" className="back-to-home">← Back to Home</a>
      <div className="login-box">
        <div className="login-box__upper">
          <h2>Welcome Back!</h2>
          <p>Login to your account to continue</p>
        </div>
        <div className="login-box__middle">
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Your@gmail.com"
                value={email}
                onChange={handleEmailChange}
                className={!isValidEmail ? 'invalid' : ''}
                required
              />
              {!isValidEmail && <p className="error-text">Please enter a valid email address.</p>}
            </div>
            <div className="input-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">Login</button>
            {errorMessage && <p className="error-text">{errorMessage}</p>}
          </form>

          <div className="or-divider">
            <hr />
            <span>Or continue with</span>
          </div>

          <div className="goog-btn">
            <GoogleLogin
              clientId="94220719907-me90csormslrvgjtiaj71q5kj88vrh6f.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
        <div className="login-box__lower">
          <p>Don't have an account? <Link to="/SignUp" className="login-link">SignUp here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
