import React, { useState } from 'react';
import { encryptFile, decryptFile } from '@lib/crypto-js'; // 确保正确导入加密解密函数

const FileUploader: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [password, setPassword] = useState<string>('');
    const [encryptedData, setEncryptedData] = useState<string>('');
    const [decryptedData, setDecryptedData] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setSelectedFile(file);
    };

    const handleEncrypt = async () => {
        if (selectedFile && password) {
            setIsLoading(true);
            setError('');
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    if (e.target && e.target.result) {
                        const encrypted = encryptFile(e.target.result as string, password);
                        setEncryptedData(encrypted);
                        downloadEncryptedFile(encrypted, 'encrypted.txt');
                    }
                } catch (err) {
                    setError('Error during encryption');
                } finally {
                    setIsLoading(false);
                }
            };
            reader.readAsText(selectedFile);
        }
    };

    const handleDecrypt = async () => {
        if (encryptedData && password) {
            setIsLoading(true);
            setError('');
            try {
                const decrypted = decryptFile(encryptedData, password);
                setDecryptedData(decrypted);
            } catch (err) {
                setError('Error during decryption');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const downloadEncryptedFile = (data, fileName) => {
        const blob = new Blob([data], { type: 'text/plain' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    return (
        <div className="p-4">
            <input className="border p-2 mb-2" type="file" onChange={handleFileInput} />
            {selectedFile && <p className="text-sm mb-2">File: {selectedFile.name}</p>}
            <input
                className="border p-2 mb-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleEncrypt}
                disabled={isLoading}
            >
                Encrypt
            </button>
            <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDecrypt}
                disabled={isLoading}
            >
                Decrypt
            </button>
            {isLoading && <p className="text-blue-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {encryptedData && <p className="text-green-500">Encrypted: {encryptedData}</p>}
            {decryptedData && <p className="text-green-500">Decrypted: {decryptedData}</p>}
        </div>
    );
};

export default FileUploader;
