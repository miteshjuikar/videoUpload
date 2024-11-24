import React, { useState } from 'react';
import './app.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileDetails, setFileDetails] = useState({
    fileName: '',
    uploadType: '',
  });
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle file name input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFileDetails((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  // Function to handle chunked file upload
  const uploadFileInChunks = async (file) => {
    const chunkSize = 2 * 1024 * 1024; // 2MB per chunk
    const totalChunks = Math.ceil(file.size / chunkSize);
    const publicId = fileDetails.fileName; // Public ID for the upload (could be dynamic)
console.log(file.size, totalChunks);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end); // Get the current chunk

      // Prepare FormData for this chunk
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkIndex', chunkIndex);
      formData.append('totalChunks', totalChunks);
      formData.append('publicId', publicId);

      try {
        const response = await fetch('http://localhost:4000/file/chunkUpload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Chunk ${chunkIndex + 1} upload failed`);
        }

        const data = await response.json();
        console.log(data.message); // Log success message

        if (chunkIndex === totalChunks - 1) {
          alert('File upload completed successfully!');
        }
      } 
      catch (error) {
        console.error('Error uploading chunk:', error);
        break; // Stop further uploads if a chunk fails
      }
      finally{
        setLoading(false);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!file || fileDetails.fileName === '' || fileDetails.uploadType === '') {
      alert('Ensure that file is selected and file name is entered before submitting.');
      setLoading(false);
      return false;
    }

    if (fileDetails.uploadType === 'chunk') {
      // If the user selects chunk upload, perform chunked upload
      uploadFileInChunks(file);
    } else {
      // Handle other upload types (withoutStream, withStream)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileDetails.fileName);
      formData.append('uploadType', fileDetails.uploadType);

      let uploadURL = '';

      if (fileDetails.uploadType === 'withoutStream') {
        uploadURL = 'http://localhost:4000/file/withoutStreams';
      } else if (fileDetails.uploadType === 'withStream') {
        uploadURL = 'http://localhost:4000/file/streams';
      }

      try {
        const response = await fetch(uploadURL, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          alert(`File uploaded successfully using ${fileDetails.uploadType}`);
          console.log('File uploaded successfully', response);
        } else {
          alert('Error uploading file');
        }
      } catch (error) {
        console.error('Error uploading file', error);
        alert('Error uploading file');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload a File</h2>
      <form className="file-upload-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
          <input
            type="text"
            name="fileName"
            value={fileDetails.fileName}
            placeholder="Enter file name"
            onChange={handleInputChange}
            className="text-input"
          />
          <div className="dropdown-container">
            <label htmlFor="uploadType">Select File Upload Type</label>
            <select
              id="uploadType"
              name="uploadType"
              value={fileDetails.uploadType}
              onChange={handleInputChange}
              className="dropdown"
            >
              <option value="">-- Select file upload type --</option>
              <option value="withoutStream">Without Stream</option>
              <option value="withStream">With Stream</option>
              <option value="chunk">Chunk</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
