import React, { useState } from 'react';
import { encryptFile, decryptFile } from '@lib/crypto-js';

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
        if (selectedFile) {
            setIsLoading(true);
            setError('');
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    if (e.target.result) {
                        const encrypted = encryptFile(e.target.result as string, password);
                        setEncryptedData(encrypted);
                    }
                } catch (err) {
                    setError('Error');
                } finally {
                    setIsLoading(false);
                }
            };
            reader.readAsText(selectedFile);
        }
    };

    const handleDecrypt = async () => {
        setIsLoading(true);
        setError('');
        try {
            const decrypted = decryptFile(encryptedData, password);
            setDecryptedData(decrypted);
        } catch (err) {
            setError('Error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileInput} />
            {selectedFile && <p>Selected: {selectedFile.name}</p>}
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleEncrypt} disabled={isLoading}>Encrypt</button>
            <button onClick={handleDecrypt} disabled={isLoading}>Decrypt</button>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {encryptedData && <p>Encrypted: {encryptedData}</p>}
            {decryptedData && <p>Decrypted: {decryptedData}</p>}
        </div>
    );
};

export default FileUploader;
