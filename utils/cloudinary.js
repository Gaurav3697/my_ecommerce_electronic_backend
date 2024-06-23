const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadImage = async (localFilePath) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            folder: "avatars",  //read on documentation of cloudinary
            width: 150,
            crop: "scale",
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