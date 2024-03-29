import React, { useState } from 'react';
import { encryptFile, decryptFile } from '@lib/crypto-js';
import { FileProcessor } from '@lib/fileProcessor';

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
    const [downloadQueue, setDownloadQueue] = useState<{ data: Blob; fileName: string; type: string }[]>([]);
    const [progress, setProgress] = useState<number>(0);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);
        }
    };

    const processFiles = async (processFunction: (file: File) => Promise<void>) => {
        setIsLoading(true);
        setError('');

        try {
            for (const file of selectedFiles) {
                await processFunction(file);
            }
        } catch (err) {
            setError(`Error processing file: ${err}`);
        }

        setIsLoading(false);
    };

    const handleProcessedChunks = async (file: File, processChunk: (chunk: Blob, processor: FileProcessor) => Promise<ArrayBuffer>) => {
        const fileProcessor = new FileProcessor(file);
        const chunks = fileProcessor.getChunks();
        const processedChunksArray = [];
        let processedChunksCount = 0;
    
        for (const chunk of chunks) {
            const processedChunk = await processChunk(chunk, fileProcessor);
            processedChunksArray.push(processedChunk);
            processedChunksCount++;
            setProgress((processedChunksCount / chunks.length) * 100);
        }
    
        return processedChunksArray;
    };       
    
    const handleEncrypt = async () => {
        await processFiles(async (file) => {
            const processedChunks = await handleProcessedChunks(file, async (chunk, processor) => {
                return await processor.encryptChunk(chunk, password);
            });
    
            const blob = new Blob(processedChunks, { type: file.type });
            setDownloadQueue(queue => [...queue, { data: blob, fileName: `encrypted-${file.name}`, type: file.type }]);
        });
    };
    
    const handleDecrypt = async () => {
        await processFiles(async (file) => {
            const processedChunks = await handleProcessedChunks(file, async (chunk, processor) => {
                return await processor.decryptChunk(chunk, password);
            });
    
            const blob = new Blob(processedChunks, { type: file.type });
            setDownloadQueue(queue => [...queue, { data: blob, fileName: file.name.startsWith('encrypted-') ? file.name.replace('encrypted-', '') : `decrypted-${file.name}`, type: file.type }]);
        });
    };

    const handleDownloadQueue = () => {
        downloadQueue.forEach(item => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(item.data);
            link.download = item.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        });
    
        setDownloadQueue([]);
    };

    const progressBarStyle = {
        width: `${progress}%`,
        backgroundColor: 'blue',
        height: '5px',
        transition: 'width 0.5s ease-in-out'
    };

    return (
        <div className="p-4">
            <div className="p-4 mb-2">
                <input className="border p-2" type="file" multiple onChange={handleFileInput} />
            </div>
            <div className="p-4">
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
            </div>
            <button
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDownloadQueue}
                disabled={downloadQueue.length === 0}
            >
                Download Queue
            </button>
            {isLoading && <p className="text-blue-500">Processing...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {isLoading && (
                <div style={{ width: '100%', backgroundColor: '#ddd' }}>
                    <div style={{ height: '10px', width: `${progress}%`, backgroundColor: 'green', transition: 'width 0.5s ease-in-out' }}></div>
                </div>
            )}

        </div>
    );
};

export default FileUploader;