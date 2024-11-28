const { uploadSingleImage } = require("./MyFileUploadControllers");
const Bgimage = require('../models/bgImage');

const createMyBgImage = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ isSuccess: false, message: "No file uploaded" });
        }

        // Upload the single image and get the URL
        const imageUrl = await uploadSingleImage(req.file);

        // Create the background image record in the database
        const bgImage = new Bgimage({ ...req.body, image: imageUrl });
        await bgImage.save();

        res.status(201).json({ isSuccess: true, message: "Image added successfully", image: imageUrl });
    } catch (error) {
        console.error("Error creating background image:", error);
        res.status(500).json({ isSuccess: false, error, message: "Something went wrong" });
    }
};

module.exports = { createMyBgImage };
