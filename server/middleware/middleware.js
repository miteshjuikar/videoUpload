const fileUpload = require("express-fileupload");

// middleware for handling file upload 
const withoutStreamMiddle = fileUpload({
    useTempFiles:true     // set as true as we are storing file in temp folder first
});

const streamAndChunkMiddle = fileUpload({
    useTempFiles:false,     // set as false as we are not storing file in temp folder first
    createParentPath: true,
//    tempFileDir: tempDirectory // Specify where the temporary files should be stored
});

module.exports = { withoutStreamMiddle, streamAndChunkMiddle }