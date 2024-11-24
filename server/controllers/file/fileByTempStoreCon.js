const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

// Without stream
const fileUploadWithoutStreams = async(req, res) => {
    try {
        const file = req.files.file;
        const customFileName = req.body.fileName;

        if (!file || Object.keys(file).length === 0) {
            return res.status(400).json({ success: false, msg: "No file uploaded" });
        }

//Normal method to store file whithout stream  
        const result = await cloudinary.uploader.upload(file.tempFilePath,{ 
            folder: 'fileUpload',
            resource_type: "auto",
            public_id: customFileName
        });
    
        // Delete the file from temp folder asynchronously
        await fs.unlink(file.tempFilePath);  // Deletes the file asynchronously

        res.status(200).json({
            success: true,
            msg: "File uploaded successfully",
            result: result || null
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error uploading file",
            error: error.message
        });
    }
}

module.exports = { fileUploadWithoutStreams }