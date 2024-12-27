const path = require("path")

const cloudinary=require("cloudinary").v2
exports.uploadImageToCloudinary=async(file,folder,height,quality)=>{
const options={folder}
if(height){
    options.height=height
}
if(quality){
    options.quality=quality
}
if (file.mimetype.startsWith("video/")) {
    options.resource_type = "video";
  } else if (file.mimetype.startsWith("image/")) {
    options.resource_type = "image";
  } else {
    throw new Error("Unsupported file type");
  }

  console.log("Uploading to Cloudinary with options:", options);
// const normalizedPath = path.resolve(file.tempFilePath);
return await cloudinary.uploader.upload(file.tempFilePath,options)
}