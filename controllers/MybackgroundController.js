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



  const geatAllBgImage = async (req, res) => {
    try {
      let appData = Bgimage.find({});
      const totalRecord = await Bgimage.countDocuments({ });
      const item = await appData;
  
      res.status(200).json({ item, totalRecords: totalRecord, isSuccess: true });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message, isSuccess: false });
    }
  };

module.exports = { createMyBgImage,geatAllBgImage };
