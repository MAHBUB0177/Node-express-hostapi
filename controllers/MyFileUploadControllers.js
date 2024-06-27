// const cloudinary=require("cloudinary")

// export const uploadImage = async (file) => {
//     const image = file;
//     const base64Image = Buffer.from(image.buffer).toString("base64");
//     const dataURI = `data:${image.mimetype};base64,${base64Image}`;

//     const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
//     return uploadResponse.url;
// };

// Import the Cloudinary module
const cloudinary = require('cloudinary').v2;

// Configure your Cloudinary account with credentials
cloudinary.config({
    cloud_name: 'dg8qdhrgh',
    api_key: '168874616399531',
    api_secret: 'CWymX5cZlRYIIcL3BlKms6Av60o'
});

// Define the upload function
const uploadImage = async (file) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    try {
        const uploadResponse = await cloudinary.uploader.upload(dataURI);
        return uploadResponse.url;
    } catch (error) {
        console.error("Error uploading image to Cloudinary", error);
        throw new Error("Image upload failed");
    }
};

// Export the upload function
module.exports = {
    uploadImage
};
