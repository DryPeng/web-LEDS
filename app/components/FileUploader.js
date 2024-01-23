import React, { useState } from 'react';

const FileUploader = ({ onFileSelect }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        // handle
        setSelectedFile(e.target.files[0]);
        onFileSelect(e.target.files[0]);
    };

    return (
        <div>
            <input type="file" onChange={handleFileInput} />
            {selectedFile && <p>Selected: {selectedFile.name}</p>}
        </div>
    );
};

export default FileUploader;
