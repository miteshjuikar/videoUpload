const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Using stream which will not consume memory
const fileUploadUsingStreams = async (req, res) => {
    try {
        const file = req.files.file;
        const customFileName = req.body.fileName;

        // Check if a file was uploaded
        if (!file || Object.keys(file).length === 0) {
            return res.status(400).json({ success: false, msg: "No file uploaded" });
        }

        // Create Cloudinary upload stream
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: 'fileUpload',
            resource_type: "auto", // Automatically detects file type
            public_id: customFileName || "customName" // You can set custom public ID if required
        }, (error, result) => {
            if (error) {
                console.error("Cloudinary Upload Error:", error);
                return res.status(500).json({
                    success: false,
                    msg: "Error uploading file to Cloudinary",
                    error: error.message
                });
            }

        // Successful upload response
            res.status(200).json({
                success: true,
                msg: "File uploaded successfully",
                result: result || null
            });
        });

    // Create a readable stream from file data and pipe to Cloudinary upload stream
        const bufferStream = Readable.from(file.data);
        bufferStream.pipe(uploadStream);

    } catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({
            success: false,
            msg: "Error uploading file",
            error: error.message
        });
    }
};

module.exports = { fileUploadUsingStreams }