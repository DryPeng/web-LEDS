import React from 'react';
import { Footer } from '@components/Footer';
import FileUploader from '@components/FileUploader';

const Pulworld: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pulworld</h1>
      <Footer />
    </div>
  );
}

export default Pulworld;
