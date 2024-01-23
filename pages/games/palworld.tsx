import { Footer } from '@components/Footer';
import FileUploader from '@components/FileUploader';

const Pulworld () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pulworld</h1>
      <FileUploader />
      <Footer />
    </div>
  );
}

export default Pulworld;
