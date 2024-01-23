import React, { useState } from 'react';
import { encryptFile, decryptFile } from '@lib/crypto-js';

export const FileUploader: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [downloadQueue, setDownloadQueue] = useState<{ data: string; fileName: string }[]>([]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);
        }
    };

    const processFiles = async (processFunction: (file: File) => Promise<void>) => {
        setIsLoading(true);
        setError('');

        for (let file of selectedFiles) {
            try {
                await processFunction(file);
            } catch (err) {
                setError(`Error processing file ${file.name}: ${err}`);
                break;
            }
        }

        setIsLoading(false);
    };

    const handleEncrypt = async () => {
        await processFiles(async (file) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const encrypted = encryptFile(e.target.result as string, password);
                setDownloadQueue(queue => [...queue, { data: encrypted, fileName: `encrypted-${file.name}` }]);
            };
            reader.readAsText(file);
        });
    };

    const handleDecrypt = async () => {
        await processFiles(async (file) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const decrypted = decryptFile(e.target.result as string, password);
                setDownloadQueue(queue => [...queue, { data: decrypted, fileName: file.name.replace(/^encrypted-/, '') }]);
            };
            reader.readAsText(file);
        });
    };

    const downloadFile = (data: string, fileName: string) => {
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

    const handleDownloadQueue = () => {
        downloadQueue.forEach(item => downloadFile(item.data, item.fileName));
        setDownloadQueue([]);
    };

    return (
        <div className="p-4">
            <input className="border p-2 mb-2" type="file" multiple onChange={handleFileInput} />
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
            <button
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDownloadQueue}
                disabled={downloadQueue.length === 0}
            >
                Download Queue
            </button>
            {isLoading && <p className="text-blue-500">Processing...</p>}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default FileUploader;
