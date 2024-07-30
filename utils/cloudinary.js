const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadImage = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            folder: "products",  //read on documentation of cloudinary
            resource_type: "image"
            // resource_type: "auto" //to send file other than image but in this case i will put image
        });
        console.log(uploadResult)
        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove locally saved file
        console.error(error);
        throw error;
    }
}

module.exports = uploadImage;