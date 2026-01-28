// import { v2 as cloudinary } from "cloudinary";

// const uploadOnCloudinary = async () => {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });

//   console.log(process.env.CLOUDINARY_CLOUD_NAME)
//   console.log(process.env.CLOUDINARY_CLOUD_NAME)
//   console.log(process.env.CLOUDINARY_CLOUD_NAME)
// };


// const uploadOnCloudinary1 = async (localFilePath) => {
//   try {
//     if (!localFilePath) 
//   return null;

//     const absolutePath = path.resolve(localFilePath);

//     const response = await cloudinary.uploader.upload(absolutePath, {
//       resource_type: "auto",
//     });

//     fs.unlinkSync(absolutePath);
//     return response;

//   } catch (error) {
//     console.error("🔥 REAL CLOUDINARY ERROR:", error.message);
//     if (fs.existsSync(localFilePath)) {
//       fs.unlinkSync(localFilePath);
//     }
//     return null;
//   }
// };

// export { uploadOnCloudinary };

// import { v2 as cloudinary } from "cloudinary";

// const uploadOnCloudinary = async () => {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });

//   console.log(process.env.CLOUDINARY_CLOUD_NAME)
//   console.log(process.env.CLOUDINARY_CLOUD_NAME)
//   console.log(process.env.CLOUDINARY_CLOUD_NAME)
// };

// export  {uploadOnCloudinary};

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export default connectCloudinary;

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const absolutePath = path.resolve(localFilePath);

    const response = await cloudinary.uploader.upload(absolutePath, {
      resource_type: "image",
    });
    console.log(response)

    fs.unlinkSync(absolutePath);
    return response;

  } catch (error) {
    console.error("🔥 REAL CLOUDINARY ERROR:", error.message);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export { uploadOnCloudinary };


