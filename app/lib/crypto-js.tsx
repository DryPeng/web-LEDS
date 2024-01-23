import CryptoJS from 'crypto-js';

// 加密函数
export const encryptFile = (fileContent, password) => {
    return CryptoJS.AES.encrypt(fileContent, password).toString();
};

// 解密函数
export const decryptFile = (ciphertext, password) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    return bytes.toString(CryptoJS.enc.Utf8);
};
