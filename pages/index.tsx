import React from 'react';
import FileUploader from '@components/FileUploader';
import Footer from '@components/Footer';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-6xl font-bold pt-12 mb-4">Test</h1>
      <FileUploader />

      <Footer />
    </div>
  );
}

export default Home;
