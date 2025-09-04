// import React, { useContext, useState } from 'react';
// import { KeyContext } from '../contexts/KeyContext';
// import {
//   importPublicKeyFromHex,
//   generateAESKey,
//   sha256Digest,
//   encryptWithAESGCM,
//   encryptAESKeyWithRSA,
//   bufferToHex,
//   hexToBytes
// } from '../utils/cryptoUtils';
// import { uploadFile } from '../utils/api';

// const FileUploader = () => {
//   const { publicKeyHex } = useContext(KeyContext);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

//   const handleEncryptAndUpload = async () => {
//     if (!selectedFile) return alert('Select a file first!');
//     if (!publicKeyHex) return alert('Public key is required! Please set it in Key Manager.');

//     setLoading(true);

//     try {
//       // 1. Import public key
//       const publicKey = await importPublicKeyFromHex(publicKeyHex);

//       // 2. Generate AES key
//       const aesKey = await generateAESKey();

//       // 3. Hash file
//       const fileHashHex = await sha256Digest(selectedFile);

//       // 4. Prepare combined data: file bytes + hash (as bytes)
//       const fileBuffer = await selectedFile.arrayBuffer();
//       const hashBytes = hexToBytes(fileHashHex);
//       const combinedData = new Uint8Array(fileBuffer.byteLength + hashBytes.byteLength);
//       combinedData.set(new Uint8Array(fileBuffer), 0);
//       combinedData.set(hashBytes, fileBuffer.byteLength);

//       // 5. Encrypt combined data with AES-GCM
//       const { encrypted, iv } = await encryptWithAESGCM(aesKey, combinedData.buffer);

//       // 6. Encrypt AES key with RSA public key
//       const encryptedAESKeyBuffer = await encryptAESKeyWithRSA(publicKey, aesKey);

//       // 7. Prepare form data
//       const formData = new FormData();
//       formData.append('encryptedFile', new Blob([encrypted]), `${selectedFile.name}.enc`);
//       formData.append('iv', JSON.stringify(Array.from(iv)));
//       formData.append('encryptedAESKeyHex', bufferToHex(encryptedAESKeyBuffer));
//       formData.append('originalFileName', selectedFile.name);

//       // 8. Upload
//       await uploadFile(formData);
//       alert('File encrypted and uploaded successfully!');
//       setSelectedFile(null);
//     } catch (err) {
//       console.error(err);
//       alert('Encryption or upload failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h3>Upload and Encrypt File</h3>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleEncryptAndUpload} disabled={loading}>
//         {loading ? 'Encrypting and Uploading...' : 'Encrypt & Upload'}
//       </button>
//     </div>
//   );
// };

// export default FileUploader;


import React, { useContext, useState } from 'react';
import { KeyContext } from '../contexts/KeyContext';
import {
  importPublicKeyFromHex,
  generateAESKey,
  sha256Digest,
  encryptWithAESGCM,
  encryptAESKeyWithRSA,
  bufferToHex,
  hexToBytes
} from '../utils/cryptoUtils';
import { uploadFile } from '../utils/api';

const FileUploader = ({ refreshFileList }) => {
  const { publicKeyHex } = useContext(KeyContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleEncryptAndUpload = async () => {
    if (!selectedFile) return alert('Select a file first!');
    if (!publicKeyHex) return alert('Public key is required! Please set it in Key Manager.');
    setLoading(true);
    try {
      const publicKey = await importPublicKeyFromHex(publicKeyHex);
      const aesKey = await generateAESKey();
      const fileHashHex = await sha256Digest(selectedFile);
      const fileBuffer = await selectedFile.arrayBuffer();
      const hashBytes = hexToBytes(fileHashHex);
      const combinedData = new Uint8Array(fileBuffer.byteLength + hashBytes.byteLength);
      combinedData.set(new Uint8Array(fileBuffer), 0);
      combinedData.set(hashBytes, fileBuffer.byteLength);
      const { encrypted, iv } = await encryptWithAESGCM(aesKey, combinedData.buffer);
      const encryptedAESKeyBuffer = await encryptAESKeyWithRSA(publicKey, aesKey);
      const formData = new FormData();
      formData.append('encryptedFile', new Blob([encrypted]), `${selectedFile.name}.enc`);
      formData.append('iv', JSON.stringify(Array.from(iv)));
      formData.append('encryptedAESKeyHex', bufferToHex(encryptedAESKeyBuffer));
      formData.append('originalFileName', selectedFile.name);
      await uploadFile(formData);
      alert('File encrypted and uploaded successfully!');
      setSelectedFile(null);

      // Refresh file list after successful upload
      if (refreshFileList) {
        await refreshFileList();
      }
    } catch (err) {
      console.error(err);
      alert('Encryption or upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Upload and Encrypt File</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleEncryptAndUpload} disabled={loading}>
        {loading ? 'Encrypting and Uploading...' : 'Encrypt & Upload'}
      </button>
    </div>
  );
};

export default FileUploader;
