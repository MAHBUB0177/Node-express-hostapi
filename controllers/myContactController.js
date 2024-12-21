const Contact = require("../models/contact");


const CreateMyContact= async (req, res) => {
    try {
      const { name, email, message } = req.body;
      // Validate request body
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Create a new contact
      const contact = new Contact({
        name,
        email,
        message,
      });
  
      // Save to database
     await contact.save();
      res.status(200).json({isSuccess:true, message: 'Contact saved successfully'});
    } catch (error) {
      // Handle duplicate email errors or validation errors
      if (error.code === 11000) {
        res.status(400).json({ error: 'Email must be unique' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }


  module.exports = { CreateMyContact, }