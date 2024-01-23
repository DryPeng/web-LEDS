import React from 'react';
import { FileUploader } from '@components/FileUploader';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test</h1>
      <FileUploader />
    </div>
  );
}

export default Home;
