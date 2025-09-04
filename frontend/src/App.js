// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// import React from 'react';
// import { KeyProvider } from './contexts/KeyContext';
// import KeyManager from './components/KeyManager';
// import FileUploader from './components/FileUploader';
// import FileDownloader from './components/FileDownloader';
// import VaultDashboard from './components/VaultDashboard';

// function App() {
//   return (
//     <KeyProvider>
//       <div className="App" style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
//         <h1>Secure File Vault</h1>
//         <KeyManager />
//         <hr />
//         <FileUploader />
//         <hr />
//         <VaultDashboard />
//         <hr />
//         <FileDownloader />
//       </div>
//     </KeyProvider>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import { KeyProvider } from './contexts/KeyContext';
import KeyManager from './components/KeyManager';
import FileUploader from './components/FileUploader';
import FileDownloader from './components/FileDownloader';
import VaultDashboard from './components/VaultDashboard';
import { fetchFileList } from './utils/api';

function App() {
  const [files, setFiles] = useState([]);

  const refreshFileList = async () => {
    try {
      const { data } = await fetchFileList();
      setFiles(data);
    } catch (err) {
      console.error('Failed to fetch file list:', err);
    }
  };

  useEffect(() => {
    refreshFileList();
  }, []);

  return (
    <KeyProvider>
      <div className="App" style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
        <h1>Secure File Vault</h1>
        <KeyManager />
        <hr />
        <FileUploader refreshFileList={refreshFileList} />
        <hr />
        <VaultDashboard files={files} />
        <hr />
        <FileDownloader />
      </div>
    </KeyProvider>
  );
}

export default App;

