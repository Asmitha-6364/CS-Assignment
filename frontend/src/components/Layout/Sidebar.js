import React from "react";

const Sidebar = ({ currentPage, setCurrentPage, isOpen }) => {
  const menu = [
    { id: "dashboard", label: "Dashboard" },
    { id: "keyManager", label: "Key Manager" },
    { id: "upload", label: "Upload File" },
    { id: "download", label: "Download File" },
  ];

  const handleClick = (id) => {
    setCurrentPage(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`sidebar ${isOpen ? "" : "hidden"}`}>
      {menu.map((item) => (
        <button
          key={item.id}
          className={currentPage === item.id ? "active" : ""}
          onClick={() => handleClick(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
