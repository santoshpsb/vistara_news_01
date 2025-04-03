import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Use Routes instead of Switch
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import LoginPage from "./Login"; // Import LoginPage
import SignupPage from "./Signup"; // Import SignupPage

const App = () => {
  return (
    <GoogleOAuthProvider clientId="94220719907-me90csormslrvgjtiaj71q5kj88vrh6f.apps.googleusercontent.com"> {/* Replace with your actual Google client ID */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* Login page route */}
          <Route path="/SignUp" element={<SignupPage />} /> {/* Signup page route */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
