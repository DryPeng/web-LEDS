import React, { useState } from 'react';
import { encryptFile, decryptFile } from '@lib/crypto';

const FileUploader: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [password, setPassword] = useState<string>('');
    const [encryptedData, setEncryptedData] = useState<string>('');
    const [decryptedData, setDecryptedData] = useState<string>('');

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setSelectedFile(file);
    };

    const handleEncrypt = async () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const encrypted = encryptFile(e.target.result as string, password);
                setEncryptedData(encrypted);
            };
            reader.readAsText(selectedFile);
        }
    };

    const handleDecrypt = async () => {
        const decrypted = decryptFile(encryptedData, password);
        setDecryptedData(decrypted);
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
            <button onClick={handleEncrypt}>加密</button>
            <button onClick={handleDecrypt}>解密</button>
            {encryptedData && <p>Encrypted: {encryptedData}</p>}
            {decryptedData && <p>Decrypted: {decryptedData}</p>}
        </div>
    );
};

export default FileUploader;
