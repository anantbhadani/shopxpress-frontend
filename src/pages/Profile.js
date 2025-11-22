import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const UserProfile = ({ isLoggedIn, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDashboardClick = () => {
    setIsDropdownOpen(false);
    navigate("/user-dashboard");
  };

  return (
    <div className="position-relative d-inline-block" ref={dropdownRef}>
      <FaUser
        size={24}
        className="icon"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{ cursor: "pointer" }}
        aria-label="User profile"
      />

      {isDropdownOpen && (
        <div
          className="dropdown-menu show"
          style={{
            position: "absolute",
            top: "100%",
            right: "0",
            zIndex: 1000,
            backgroundColor: "#fff",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            minWidth: "160px",
            border: "1px solid #ddd",
          }}
        >
          {isLoggedIn ? (
            <>
              <button
                className="dropdown-item btn btn-link text-dark w-100 text-left"
                onClick={handleDashboardClick}
                style={{ textAlign: "left", padding: "8px 12px" }}
              >
                My Dashboard
              </button>
              <hr style={{ margin: "5px 0" }} />
              <button
                className="dropdown-item btn btn-link text-dark w-100 text-left"
                onClick={onLogout}
                style={{ textAlign: "left", padding: "8px 12px" }}
              >
                Logout
              </button>
            </>
          ) : (
            <button className="dropdown-item btn btn-link text-dark w-100">
              Login
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;