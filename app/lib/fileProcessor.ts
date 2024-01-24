// fileProcessor.ts

import CryptoJS from 'crypto-js';

export class FileProcessor {
  private file: File;
  private chunkSize: number;

  // 16MB
  constructor(file: File, chunkSize = 16 * 1024 * 1024) { 
    this.file = file;
    this.chunkSize = chunkSize;
  }

  public getChunks() {
    const chunks = [];
    let currentPos = 0;

    while (currentPos < this.file.size) {
      const chunk = this.file.slice(currentPos, currentPos + this.chunkSize);
      chunks.push(chunk);
      currentPos += this.chunkSize;
    }

    return chunks;
  }

  private blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as ArrayBuffer);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  // Encrypt
  async encryptChunk(chunk: Blob, password: string): Promise<ArrayBuffer> {
    const arrayBuffer = await this.blobToArrayBuffer(chunk);
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    const encrypted = CryptoJS.AES.encrypt(wordArray, password).ciphertext;
    return encrypted.toString(CryptoJS.enc.Base64);
  }
  
  // Decrypt
  async decryptChunk(chunk: Blob, password: string): Promise<ArrayBuffer> {
    const arrayBuffer = await this.blobToArrayBuffer(chunk);
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: wordArray }, password);
    return decrypted.toString(CryptoJS.enc.Base64);
  }

  public async processFile(processChunk: (chunk: Blob) => Promise<ArrayBuffer>): Promise<ArrayBuffer[]> {
    const chunks = this.getChunks();
    let processedChunks: ArrayBuffer[] = [];

    for (const chunk of chunks) {
        const processed = await processChunk(chunk);
        processedChunks.push(processed);
    }

    return processedChunks;
  }
}
