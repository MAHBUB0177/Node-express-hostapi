
// Import the Cloudinary module
const cloudinary = require('cloudinary').v2;

// Configure your Cloudinary account with credentials
cloudinary.config({
    cloud_name: 'dg8qdhrgh',
    api_key: '168874616399531',
    api_secret: 'CWymX5cZlRYIIcL3BlKms6Av60o'
});

// Define the upload function
const uploadImage = async (files) => {
    console.log(files,'first++++++++++++++')
    try {
        const imageUrls = await Promise.all(
            files.map(async (file) => {
                const base64Image = Buffer.from(file.buffer).toString("base64");
                const dataURI = `data:${file.mimetype};base64,${base64Image}`;

                // Log each file upload
                console.log("Uploading file to Cloudinary...");

                const uploadResponse = await cloudinary.uploader.upload(dataURI);
                return uploadResponse.url; // Return the image URL after upload
            })
        );
        return imageUrls; // Return an array of image URLs
    } catch (error) {
        throw new Error("Image upload failed");
    }
};

// Export the upload function
module.exports = {
    uploadImage
};