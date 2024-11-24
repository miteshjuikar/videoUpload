const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

const chunkUploadFile = async (req, res) => {
  
  if (!req.files || !req.files.chunk) {
    return res.status(400).send('No chunk uploaded.');
  }
  
  const chunk = req.files.chunk; // Current chunk
  const chunkIndex = parseInt(req.body.chunkIndex, 10); // Index of the current chunk
  const totalChunks = parseInt(req.body.totalChunks, 10); // Total number of chunks
  const publicId = req.body.publicId; // Unique identifier for the file
    
    try {
      // Using Cloudinary's upload_large with Promise instead of callback
      const result = await cloudinary.uploader.upload_large(chunk.tempFilePath, {
        resource_type: 'raw',
        folder: 'fileUpload',
        public_id: publicId,
        chunk_size: 2 * 1024 * 1024, // 2MB chunk size
        upload_preset: 'resumable', // Optional: Cloudinary preset for resumable uploads
      });
  
      // Check if all chunks are uploaded
      if (chunkIndex === totalChunks - 1) {
        res.status(200).send({
          message: 'All chunks uploaded successfully.',
          url: result.secure_url,
          type: result.resource_type,
        });
      } else {
        res.status(200).send({
          message: `Chunk ${chunkIndex + 1} uploaded successfully.`,
        });
      }

    } 
    catch (error) {
      console.error('Error uploading chunk:', error);
      res.status(500).send({ message: 'Chunk upload failed.', error });
    }
};

module.exports = { chunkUploadFile }