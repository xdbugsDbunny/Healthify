import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const PublicRoutes = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          "/api/v1/users/check-auth",
          {},
          {
            withCredentials: true, // Ensure cookies are included
          }
        );
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="spinner-parent">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/home" /> : children;
};

export default PublicRoutes;
