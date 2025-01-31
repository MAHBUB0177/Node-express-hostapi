const review = require("../models/review");


const CreateMyReview= async (req, res) => {
    try {
      const {message,rating,reviewer_name,image,productId} = req.body;
      // Validate request body
      if (!message || !reviewer_name) {
        return res.status(400).json({ error: 'message or name fields are required' });
      }
  
      // Create a new contact
      const userReview = new review({
        message,
        rating,
        reviewer_name,
        image,
        productId
      });
  
      // Save to database
     await userReview.save();
      res.status(200).json({isSuccess:true, message: 'Review saved successfully'});
    } catch (error) {
        res.status(500).json({ error: error.message });
     
    }
  }


    const geatReviewById = async (req, res) => {
      try {
        const { productId } = req.query;
     
        if (!productId) {
          return res.status(400).json({ message: "ProductID query parameter is required", isSuccess: false });
        }
    
        let appData = review.find({ productId });
        const totalRecord = await review.countDocuments({ productId });
        const item = await appData;
       
        res.status(200).json({ item, totalRecords: totalRecord, isSuccess: true });
      } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, isSuccess: false });
      }
    };

  module.exports = { CreateMyReview,geatReviewById }