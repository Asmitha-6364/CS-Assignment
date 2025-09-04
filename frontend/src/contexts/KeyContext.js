import React, { createContext, useState } from 'react';

export const KeyContext = createContext();

export const KeyProvider = ({ children }) => {
  const [publicKeyHex, setPublicKeyHex] = useState(localStorage.getItem('publicKeyHex') || '');
  const [privateKeyHex, setPrivateKeyHex] = useState('');

  const savePublicKey = (keyHex) => {
    setPublicKeyHex(keyHex);
    localStorage.setItem('publicKeyHex', keyHex);
  };

  const clearPrivateKey = () => setPrivateKeyHex('');

  return (
    <KeyContext.Provider value={{ publicKeyHex, setPublicKeyHex: savePublicKey, privateKeyHex, setPrivateKeyHex, clearPrivateKey }}>
      {children}
    </KeyContext.Provider>
  );
};
