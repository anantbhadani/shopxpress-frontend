import React, { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const UserProfile = ({ isLoggedIn, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
            left: "20",
            zIndex: 1000,
            backgroundColor: "#fff",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            minWidth: "140px",
            border: "1px solid #ddd",
          }}
        >
          {isLoggedIn ? (
            <button className="dropdown-item btn btn-link text-dark w-100" onClick={onLogout}>
              Logout
            </button>
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