// import React, { useEffect, useState } from 'react';
// import { fetchFileList } from '../utils/api';

// const VaultDashboard = () => {
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     async function loadFiles() {
//       const { data } = await fetchFileList();
//       setFiles(data);
//     }
//     loadFiles();
//   }, []);

//   return (
//     <div>
//       <h3>Uploaded Files</h3>
//       {files.length === 0 ? (
//         <p>No files uploaded yet.</p>
//       ) : (
//         <ul>
//           {files.map((file) => (
//             <li key={file.filename}>
//               {file.originalFileName} (Encrypted filename: {file.filename})
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default VaultDashboard;

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
            <li key={file.filename}>
              {file.originalFileName} (Encrypted filename: {file.filename})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VaultDashboard;
