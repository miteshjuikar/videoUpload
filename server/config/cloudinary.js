const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dslqocpya', 
    api_key: '497337285795762', 
    api_secret: 'R9TvFIUViv5PSJ-AseWIujcQmq0'
});

module.exports = cloudinary;