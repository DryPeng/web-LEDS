import CryptoJS from 'crypto-js';

// Encrypt
export const encryptFile = (fileContent, password) => {
    return CryptoJS.AES.encrypt(fileContent, password).toString();
};

// Decrypt
export const decryptFile = (ciphertext, password) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    return bytes.toString(CryptoJS.enc.Utf8);
};
