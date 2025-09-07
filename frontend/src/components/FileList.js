import React, { useEffect, useState } from 'react';
import { getFiles } from '../utils/api';

const FileList = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await getFiles();
      setFiles(res);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h3>Your Uploaded Files</h3>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map(file => (
            <li key={file._id}>
              <strong>{file.originalFileName}</strong>
              <br />
              <small>Encrypted name: {file.filename}</small>
              <br />
              <small>Uploaded: {new Date(file.uploadedAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
