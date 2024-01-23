import CryptoJS from 'crypto-js';

// Encrypt
export const encryptFile = (fileContent: string, password: string) => {
    return CryptoJS.AES.encrypt(fileContent, password).toString();
};

// Decrypt
export const decryptFile = (ciphertext: string, password: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    return bytes.toString(CryptoJS.enc.Utf8);
};
