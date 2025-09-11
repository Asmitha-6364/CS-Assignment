import React, { useContext, useState } from 'react';
import { generateRSAKeyPair } from '../utils/cryptoUtils';
import { KeyContext } from '../contexts/KeyContext';

const KeyManager = () => {
  const { publicKeyHex, setPublicKeyHex, privateKeyHex, setPrivateKeyHex, clearPrivateKey } = useContext(KeyContext);
  const [genPrivKey, setGenPrivKey] = useState('');

  const handleGenerate = async () => {
    const keys = await generateRSAKeyPair();
    setPublicKeyHex(keys.publicKeyHex);
    setPrivateKeyHex(keys.privateKeyHex);
    setGenPrivKey(keys.privateKeyHex);
    alert('RSA Key pair generated. Save your Private Key securely!');
  };

  return (
    <div>
      <h2>RSA Key Management</h2>
      <button onClick={handleGenerate}>Generate New RSA Key Pair</button>
      <div className="key-boxes">
      <div className="key-box">
        <label>Public Key (HEX, stored in localStorage):</label>
        <textarea rows="5" cols="80" value={publicKeyHex} readOnly />
      </div>
      <div className="key-box">
        <label>Private Key (HEX, enter to decrypt files, never stored):</label>
        <textarea
          rows="5"
          value={privateKeyHex}
          onChange={(e) => setPrivateKeyHex(e.target.value.trim())}
          placeholder="Paste your private key here"
        />
      </div>
      </div>
      <button onClick={clearPrivateKey}>Clear Private Key from Memory</button>
    </div>
  );
};

export default KeyManager;
