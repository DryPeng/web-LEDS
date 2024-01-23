import React, { useState } from 'react';
import { encryptFile, decryptFile } from '@lib/crypto-js';

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const base64ToArrayBuffer = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

const FileUploader: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [downloadQueue, setDownloadQueue] = useState<{ data: ArrayBuffer; fileName: string; type: string }[]>([]);

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
                if (e.target && e.target.result) {
                    const base64 = arrayBufferToBase64(e.target.result as ArrayBuffer);
                    const encrypted = encryptFile(base64, password);
                    setDownloadQueue(queue => [...queue, { data: base64ToArrayBuffer(encrypted), fileName: `encrypted-${file.name}`, type: file.type }]);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const handleDecrypt = async () => {
        await processFiles(async (file) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                if (e.target && e.target.result) {
                    const base64 = arrayBufferToBase64(e.target.result as ArrayBuffer);
                    const decryptedBase64 = decryptFile(base64, password);
                    const decrypted = base64ToArrayBuffer(decryptedBase64);
                    const newFileName = file.name.startsWith('encrypted-') ? file.name.replace('encrypted-', '') : `decrypted-${file.name}`;
                    setDownloadQueue(queue => [...queue, { data: decrypted, fileName: newFileName, type: file.type }]);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const downloadFile = (item: { data: ArrayBuffer; fileName: string; type: string }) => {
        const blob = new Blob([item.data], { type: item.type || 'application/octet-stream' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = item.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const handleDownloadQueue = () => {
        downloadQueue.forEach(downloadFile);
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
