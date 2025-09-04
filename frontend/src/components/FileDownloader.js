// import React, { useContext, useState } from 'react';
// import { KeyContext } from '../contexts/KeyContext';
// import {
//   importPrivateKeyFromHex,
//   decryptAESKeyWithRSA,
//   decryptWithAESGCM,
//   sha256Digest,
//   hexToBytes
// } from '../utils/cryptoUtils';
// import { fetchFileMeta } from '../utils/api';

// const FileDownloader = () => {
//   const { privateKeyHex } = useContext(KeyContext);
//   const [filename, setFilename] = useState('');
//   const [message, setMessage] = useState('');

//   const handleDownloadAndDecrypt = async () => {
//     setMessage('');
//     if (!privateKeyHex) return alert('Enter your private key first!');
//     if (!filename) return alert('Enter the filename to download.');

//     try {
//       // Fetch metadata and file URL
//       const { data } = await fetchFileMeta(filename);
//       const { fileUrl, iv, encryptedAESKeyHex, originalFileName } = data;

//       // Download encrypted file
//       const response = await fetch(fileUrl);
//       const encryptedBuffer = await response.arrayBuffer();

//       // Import private key
//       const privateKey = await importPrivateKeyFromHex(privateKeyHex);

//       // Decrypt AES key
//       const decryptedAESKeyBuffer = await decryptAESKeyWithRSA(privateKey, hexToBytes(encryptedAESKeyHex));
//       const aesKey = await window.crypto.subtle.importKey(
//         "raw",
//         decryptedAESKeyBuffer,
//         { name: "AES-GCM" },
//         false,
//         ["decrypt"]
//       );

//       // Decrypt file contents (includes appended hash)
//       const ivArray = new Uint8Array(iv);
//       const decryptedBuffer = await decryptWithAESGCM(aesKey, encryptedBuffer, ivArray);

//       // Extract original file and appended hash (last 32 bytes, SHA-256 hash length in bytes)
//       const hashLength = 32;
//       const decryptedBytes = new Uint8Array(decryptedBuffer);
//       const fileBytes = decryptedBytes.slice(0, decryptedBytes.length - hashLength);
//       const extractedHashBytes = decryptedBytes.slice(decryptedBytes.length - hashLength);
//       const extractedHashHex = [...extractedHashBytes].map(b => b.toString(16).padStart(2, '0')).join('');

//       // Compute hash of decrypted file content
//       const computedHashHex = await sha256Digest(fileBytes.buffer);

//       if (extractedHashHex !== computedHashHex) {
//         setMessage('Hash mismatch! File integrity compromised.');
//         return;
//       }

//       // Create downloadable blob with original filename
//       const blob = new Blob([fileBytes]);
//       const a = document.createElement('a');
//       a.href = URL.createObjectURL(blob);
//       a.download = originalFileName || 'decryptedFile';
//       a.click();

//       setMessage('File decrypted and downloaded successfully!');
//     } catch (error) {
//       console.error(error);
//       setMessage('Decryption failed or file not found.');
//     }
//   };

//   return (
//     <div>
//       <h3>Download and Decrypt File</h3>
//       <input
//         type="text"
//         placeholder="Enter encrypted filename"
//         value={filename}
//         onChange={(e) => setFilename(e.target.value.trim())}
//       />
//       <button onClick={handleDownloadAndDecrypt}>Download & Decrypt</button>
//       <p>{message}</p>
//     </div>
//   );
// };

// export default FileDownloader;

// import React, { useContext, useState } from 'react';
// import { KeyContext } from '../contexts/KeyContext';
// import {
//   importPrivateKeyFromHex,
//   decryptAESKeyWithRSA,
//   decryptWithAESGCM,
//   sha256Digest,
//   hexToBytes
// } from '../utils/cryptoUtils';
// import { fetchFileMeta } from '../utils/api';

// const FileDownloader = () => {
//   const { privateKeyHex } = useContext(KeyContext);
//   const [filename, setFilename] = useState('');
//   const [message, setMessage] = useState('');

//   const handleDownloadAndDecrypt = async () => {
//     setMessage('');
//     if (!privateKeyHex) {
//       alert('Enter your private key first!');
//       return;
//     }
//     if (!filename) {
//       alert('Enter the filename to download.');
//       return;
//     }

//     try {
//       // URL-encode filename for safe API request
//       const encodedFilename = encodeURIComponent(filename);

//       // Fetch metadata and file URL
//       const { data } = await fetchFileMeta(encodedFilename);
//       const { fileUrl, iv, encryptedAESKeyHex, originalFileName } = data;

//       // Download encrypted file
//       const response = await fetch(fileUrl);
//       if (!response.ok) {
//         throw new Error(`Failed to download file: HTTP ${response.status}`);
//       }
//       const encryptedBuffer = await response.arrayBuffer();

//       // Import private key
//       const privateKey = await importPrivateKeyFromHex(privateKeyHex);

//       // Decrypt AES key
//       const decryptedAESKeyBuffer = await decryptAESKeyWithRSA(privateKey, hexToBytes(encryptedAESKeyHex));
//       const aesKey = await window.crypto.subtle.importKey(
//         'raw',
//         decryptedAESKeyBuffer,
//         { name: 'AES-GCM' },
//         false,
//         ['decrypt']
//       );

//       // Decrypt file contents (includes appended hash)
//       const ivArray = new Uint8Array(iv);
//       const decryptedBuffer = await decryptWithAESGCM(aesKey, encryptedBuffer, ivArray);

//       // Extract original file and appended SHA-256 hash (last 32 bytes)
//       const hashLength = 32;
//       const decryptedBytes = new Uint8Array(decryptedBuffer);
//       if (decryptedBytes.length < hashLength) {
//         throw new Error('Decrypted data length is too short.');
//       }
//       const fileBytes = decryptedBytes.slice(0, decryptedBytes.length - hashLength);
//       const extractedHashBytes = decryptedBytes.slice(decryptedBytes.length - hashLength);
//       const extractedHashHex = [...extractedHashBytes].map(b => b.toString(16).padStart(2, '0')).join('');

//       // Compute hash of decrypted file content
//       const computedHashHex = await sha256Digest(fileBytes.buffer);

//       if (extractedHashHex !== computedHashHex) {
//         setMessage('Hash mismatch! File integrity compromised.');
//         return;
//       }

//       // Create and trigger download of the original file
//       const blob = new Blob([fileBytes]);
//       const a = document.createElement('a');
//       a.href = URL.createObjectURL(blob);
//       a.download = originalFileName || 'decryptedFile';
//       document.body.appendChild(a);
//       a.click();
//       a.remove();

//       setMessage('File decrypted and downloaded successfully!');
//     } catch (error) {
//       console.error(error);
//       setMessage(`Decryption failed or file not found. ${error.message || ''}`);
//     }
//   };

//   return (
//     <div>
//       <h3>Download and Decrypt File</h3>
//       <input
//         type="text"
//         placeholder="Enter encrypted filename"
//         value={filename}
//         onChange={(e) => setFilename(e.target.value.trim())}
//       />
//       <button onClick={handleDownloadAndDecrypt}>Download & Decrypt</button>
//       <p>{message}</p>
//     </div>
//   );
// };

// export default FileDownloader;


import React, { useContext, useState } from 'react';
import { KeyContext } from '../contexts/KeyContext';
import {
  importPrivateKeyFromHex,
  decryptAESKeyWithRSA,
  decryptWithAESGCM,
  sha256Digest,
  hexToBytes
} from '../utils/cryptoUtils';
import { fetchFileMeta } from '../utils/api';

const FileDownloader = () => {
  const { privateKeyHex } = useContext(KeyContext);
  const [filename, setFilename] = useState('');
  const [message, setMessage] = useState('');

  const handleDownloadAndDecrypt = async () => {
    setMessage('');
    if (!privateKeyHex) {
      alert('Enter your private key first!');
      return;
    }
    if (!filename) {
      alert('Enter the filename to download.');
      return;
    }

    try {
      // URL-encode filename for safe API request
      const encodedFilename = encodeURIComponent(filename);

      // Fetch metadata and file URL
      const { data } = await fetchFileMeta(encodedFilename);
      const { fileUrl, iv, encryptedAESKeyHex, originalFileName } = data;

      // Download encrypted file
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to download file: HTTP ${response.status}`);
      }
      const encryptedBuffer = await response.arrayBuffer();

      // Import private key
      const privateKey = await importPrivateKeyFromHex(privateKeyHex);

      // Decrypt AES key
      const decryptedAESKeyBuffer = await decryptAESKeyWithRSA(privateKey, hexToBytes(encryptedAESKeyHex));
      const aesKey = await window.crypto.subtle.importKey(
        'raw',
        decryptedAESKeyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      // Parse IV correctly (from JSON string to Uint8Array)
      const ivArray = new Uint8Array(Array.isArray(iv) ? iv : JSON.parse(iv));

      // Decrypt file contents (includes appended hash)
      const decryptedBuffer = await decryptWithAESGCM(aesKey, encryptedBuffer, ivArray);

      // Extract original file and appended SHA-256 hash (last 32 bytes)
      const hashLength = 32;
      const decryptedBytes = new Uint8Array(decryptedBuffer);
      if (decryptedBytes.length < hashLength) {
        throw new Error('Decrypted data length is too short.');
      }
      const fileBytes = decryptedBytes.slice(0, decryptedBytes.length - hashLength);
      const extractedHashBytes = decryptedBytes.slice(decryptedBytes.length - hashLength);
      const extractedHashHex = [...extractedHashBytes].map(b => b.toString(16).padStart(2, '0')).join('');

      // Compute hash of decrypted file content
      const computedHashHex = await sha256Digest(fileBytes.buffer);

      if (extractedHashHex !== computedHashHex) {
        setMessage('Hash mismatch! File integrity compromised.');
        return;
      }

      // Create and trigger download of the original file
      const blob = new Blob([fileBytes]);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = originalFileName || 'decryptedFile';
      document.body.appendChild(a);
      a.click();
      a.remove();

      setMessage('File decrypted and downloaded successfully!');
    } catch (error) {
      console.error(error);
      setMessage(`Decryption failed or file not found. ${error.message || ''}`);
    }
  };

  return (
    <div>
      <h3>Download and Decrypt File</h3>
      <input
        type="text"
        placeholder="Enter encrypted filename"
        value={filename}
        onChange={(e) => setFilename(e.target.value.trim())}
      />
      <button onClick={handleDownloadAndDecrypt}>Download & Decrypt</button>
      <p>{message}</p>
    </div>
  );
};

export default FileDownloader;