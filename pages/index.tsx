import React from 'react';
import FileUploader from '@components/FileUploader';
import { Footer } from '@components/Footer';

const Home: React.FC = () => {
  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-6xl font-bold pt-12 mb-4">Test</h1>
        <FileUploader />
      </div>
      <div className="mx-auto">
        <div className="border-2">
          <p>
            Currently testing a version that can automatically encrypt files 
            in segments. However, due to browser limitations, it may not be able 
            to encrypt files larger than 60% of the available memory. Please test 
            this on your own. All files are not uploaded to the server; the 
            website is deployed on Cloudflare Pages.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Home;
