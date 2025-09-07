import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        background: "#2c2f48",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "40px",          // fixed header height
        zIndex: 1000,
      }}
    >
      <h2 style={{ margin: 0 }}>Secure File Vault</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {user && <span>{user.email}</span>}
        <button
          onClick={logout}
          style={{
            background: "#00bcd4",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
