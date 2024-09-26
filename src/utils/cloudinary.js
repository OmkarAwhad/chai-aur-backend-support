// import {v2 as cloudinary} from 'cloudinary';
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
     try {
          if(!localFilePath)return null;
          // upload the file on cloudinary
          const response = await cloudinary.uploader.upload(localFilePath , {
               resource_type:"auto"
          })
          // file has been uploaded successfully
          console.log('File is uploaded on cloudinary : ',response.url);
          return response;
     } catch (error) {
          // ab mai cloudinary ko use karra hu 
          // matlab woh file mere server pe toh h
          // matlab localFilePath toh aa chuka h
          // toh upload fail huya toh woh file hume apne server se toh hata deni chahiye, Clean rakhne ke liye
          fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed ()
          return null;

     }
}

export {uploadOnCloudinary};