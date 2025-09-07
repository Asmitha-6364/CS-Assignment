import React from 'react';

const VaultDashboard = ({ files }) => {
  return (
    <div>
      <h3>Uploaded Files</h3>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              {file.originalFileName}
              <br />
              <small>Encrypted filename: {file.filename}</small>
              <br />
              <small>Uploaded: {new Date(file.uploadedAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VaultDashboard;
