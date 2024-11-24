const { Router } = require("express");
const { fileUploadWithoutStreams } = require("../../controllers/file/fileByTempStoreCon");
const { fileUploadUsingStreams } = require("../../controllers/file/fileStreamCon");
const { chunkUploadFile } = require("../../controllers/file/chunkFileCon");
const { withoutStreamMiddle, streamAndChunkMiddle } = require("../../middleware/middleware");

const router = Router();

router.post('/withoutStreams',withoutStreamMiddle, fileUploadWithoutStreams);
router.post('/streams',streamAndChunkMiddle, fileUploadUsingStreams);
router.post('/chunkUpload',withoutStreamMiddle, chunkUploadFile);

module.exports = router;