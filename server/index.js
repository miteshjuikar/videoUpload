const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const path = require("path");

const userRouter = require("./routers/authRoute/userRoute");
const fileRouter= require("./routers/fileRoute/fileRoute");
const connectToMongoDB = require("./config/config");
const cloudinary = require('./config/cloudinary');

const app = express();
const PORT = 4000;

//MongoDB connection
const url = `mongodb+srv://${Mongodb_User}:${Mongodb_pass}@mycluster.krravcy.mongodb.net/fileUpload?retryWrites=true&w=majority&appName=MyCluster`;

connectToMongoDB(url)
.then(() => console.log("MongoDB connected"))
.catch((err) => {console.log("Error: ", err);});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: [ 'GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials: true
}));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Define the temp directory where files will be stored temporarily
const tempDirectory = path.join(__dirname, 'tmp');
0
app.use('/auth', userRouter );
app.use('/file', fileRouter);

app.listen(PORT, ()=>{console.log(`Server started at port: ${PORT}`);});