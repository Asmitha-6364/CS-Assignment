import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { KeyProvider } from "./contexts/KeyContext";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import PrivateRouter from "./components/PrivateRouter";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";

import KeyManager from "./components/KeyManager";
import FileUploader from "./components/FileUploader";
import FileDownloader from "./components/FileDownloader";
import VaultDashboard from "./components/VaultDashboard";
import { fetchFileList } from "./utils/api";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function AppContent() {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const refreshFileList = async () => {
    try {
      const { data } = await fetchFileList();
      setFiles(data);
    } catch (err) {
      console.error("Failed to fetch file list:", err);
      setFiles([]);
    }
  };

  // Refresh file list whenever the logged-in user changes
  useEffect(() => {
    if (user) {
      refreshFileList();
    } else {
      setFiles([]); // clear files on logout
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRouter>
              <div className="app-layout" style={{ marginTop: "60px" }}>
                <Sidebar
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  isOpen={sidebarOpen}
                />
                <div className="main-content">
                  <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                  {/* Dashboard Section */}
                  <section id="dashboard" className="page-section">
                    <h1>Welcome to Secure File Vault 🔐</h1>
                    {user && (
                      <p style={{ fontSize: "18px", marginTop: "10px" }}>
                        Hello <strong>{user.email}</strong>, you are now logged in!
                      </p>
                    )}
                    <VaultDashboard files={files} />
                  </section>

                  {/* Key Manager Section */}
                  <section id="keyManager" className="page-section">
                    <KeyManager />
                  </section>

                  {/* Upload Section */}
                  <section id="upload" className="page-section">
                    <FileUploader refreshFileList={refreshFileList} />
                  </section>

                  {/* Download Section */}
                  <section id="download" className="page-section">
                    <FileDownloader />
                  </section>
                </div>
              </div>
            </PrivateRouter>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <KeyProvider>
        <AppContent />
        <ToastContainer />
      </KeyProvider>
    </AuthProvider>
  );
}

export default App;


