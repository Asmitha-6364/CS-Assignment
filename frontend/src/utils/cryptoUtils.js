// Helper: Convert ArrayBuffer to HEX
export function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  
  // Helper: Convert HEX string to Uint8Array
  export function hexToBytes(hex) {
    const bytes = [];
    for (let c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
    return new Uint8Array(bytes);
  }
  
  export async function generateRSAKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      },
      true,
      ["encrypt", "decrypt"]
    );
  
    const pubKeyBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privKeyBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  
    return {
      publicKeyHex: bufferToHex(pubKeyBuffer),
      privateKeyHex: bufferToHex(privKeyBuffer),
    };
  }
  
  export async function importPublicKeyFromHex(hexKey) {
    const keyData = hexToBytes(hexKey).buffer;
    return await window.crypto.subtle.importKey(
      "spki",
      keyData,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,
      ["encrypt"]
    );
  }
  
  export async function importPrivateKeyFromHex(hexKey) {
    const keyData = hexToBytes(hexKey).buffer;
    return await window.crypto.subtle.importKey(
      "pkcs8",
      keyData,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,
      ["decrypt"]
    );
  }
  
  export async function generateAESKey() {
    return await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }
  
  export async function sha256Digest(data) {
    const buffer = data instanceof ArrayBuffer ? data : await data.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);
    return bufferToHex(hashBuffer);
  }
  
  export async function encryptWithAESGCM(aesKey, data) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      data
    );
    return { encrypted, iv };
  }
  
  export async function decryptWithAESGCM(aesKey, encryptedData, iv) {
    return await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      aesKey,
      encryptedData
    );
  }
  
  export async function encryptAESKeyWithRSA(publicKey, aesKey) {
    const rawKey = await window.crypto.subtle.exportKey("raw", aesKey);
    return await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      rawKey
    );
  }
  
  export async function decryptAESKeyWithRSA(privateKey, encryptedAESKey) {
    return await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encryptedAESKey
    );
  }
  