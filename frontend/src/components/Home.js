import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="home-container">
      <header className="header">
        <h2>Secure File Vault</h2>
        <div className="account-info">
          <span>{user?.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="content">
        <aside className="sidebar">
          <ul>
            <li>Encryption</li>
            <li>Decryption</li>
            <li>Key Management</li>
            <li>My Files</li>
          </ul>
        </aside>

        <main className="dashboard">
          <h3>Welcome, {user?.email}</h3>
          <p>This is your secure dashboard for file encryption and decryption.</p>
        </main>
      </div>
    </div>
  );
};

export default Home;
