
const Orders = require("../models/orders");
const Divisions = require("../models/division");
const Citys=require('../models/city')
const Area=require('../models/area')
const ConfirmOrder=require('../models/confirmOrder')

const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_API_URL);

const createMyOrder = async (req, res) => {
  const { userId } = req.user;
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          isSuccess: false,
          message: "Request body cannot be empty. Please provide order details.",
        });
      }
      const myOrder = req.body;
      const orders = new Orders({...myOrder,userId:userId});
      await orders.save();
      res.status(201).json({
        isSuccess: true,
        message: "Order added successfully",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        isSuccess: false,
        error: error.message,
        message: "Something went wrong",
      });
    }
  };



  const saveOrderInfo = async (req, res) => {
   
      try {
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({
            isSuccess: false,
            message: "Request body cannot be empty. Please provide order details.",
          });
        }
        const saveOrderinfo = req.body;
        const orders = new Orders({...saveOrderinfo,active:true});
        await orders.save();
        res.status(201).json({
          isSuccess: true,
          message: "Order added successfully",
        });
      } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
          isSuccess: false,
          error: error.message,
          message: "Something went wrong",
        });
      }
    };

  const getOrderInfo = async (req, res) => {
    const { userId } = req.user;
    try {
      let appData = await Orders.find({ userId });
      if (!appData) {
        return res.status(404).json({ message: "No order found", isSuccess: false });
      }
      res.status(200).json({ item: appData, isSuccess: true }); 
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message, isSuccess: false });
    }
  };
  
 const geatAllDivision = async (req, res) => {
    try {
      let appData = Divisions.find({});
      // Count total records
      const totalRecord = await Divisions.countDocuments({});
      const item = await appData;
      res.status(200).json({ item, totalRecords: totalRecord,isSuccess:true});
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message ,isSuccess:false});
    }
  };

  const createMyDivision = async (req, res) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          isSuccess: false,
          message: "Request body cannot be empty. Please provide order details.",
        });
      }
      // Extract order data from request body
      const myDivision = req.body;
      // Create and save the order
      const division = new Divisions(myDivision);
      await division.save();
      // Return success response
      res.status(201).json({
        isSuccess: true,
        message: "Order added successfully",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        isSuccess: false,
        error: error.message,
        message: "Something went wrong",
      });
    }
  };
  

  const createMyCity = async (req, res) => {
    try {
      // Check if the request body is empty
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          isSuccess: false,
          message: "Request body cannot be empty. Please provide order details.",
        });
      }
      // Extract order data from request body
      const myCity = req.body;
      // Create and save the order
      const city = new Citys(myCity);
      await city.save();
      // Return success response
      res.status(201).json({
        isSuccess: true,
        message: "Order added successfully",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        isSuccess: false,
        error: error.message,
        message: "Something went wrong",
      });
    }
  };

  const getCityByType = async (req, res) => {
    try {
      const { division } = req.query;
      if (!division) {
        return res.status(400).json({ message: "Division query parameter is required", isSuccess: false });
      }
  
      let appData = Citys.find({ division });
      const totalRecord = await Citys.countDocuments({ division });
      const item = await appData;
  
      res.status(200).json({ item, totalRecords: totalRecord, isSuccess: true });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message, isSuccess: false });
    }
  };
  

  const createMyArea = async (req, res) => {
    try {
      // Check if the request body is empty
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          isSuccess: false,
          message: "Request body cannot be empty. Please provide order details.",
        });
      }
      // Extract order data from request body
      const myArea = req.body;
      // Create and save the order
      const area = new Area(myArea);
      await area.save();
      // Return success response
      res.status(201).json({
        isSuccess: true,
        message: "Order added successfully",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        isSuccess: false,
        error: error.message,
        message: "Something went wrong",
      });
    }
  };

  const getAreaByType = async (req, res) => {
    try {
      const { city } = req.query;
      if (!city) {
        return res.status(400).json({ message: "Division query parameter is required", isSuccess: false });
      }
  
      let appData = Area.find({ city });
      const totalRecord = await Area.countDocuments({ city });
      const item = await appData;
  
      res.status(200).json({ item, totalRecords: totalRecord, isSuccess: true });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message, isSuccess: false });
    }
  };



const confirmMyOrder = async (req, res) => {
  try {
    // Check if the request body is an array
    const ordersArray = req.body;
    if (!Array.isArray(ordersArray) || ordersArray.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Request body should contain an array of order details.",
      });
    }


    // Loop through the array and save each order separately
    const orderPromises = ordersArray.map(async (orderItem) => {
      // Destructure the required fields from each order object
      const { brand, category, price, oldprice, productName, qnty, color,userId,name,email,shippingFee,grandTotal,shippingUserName,shippingPhone,shippingHouseNo,shippingCity } = orderItem;
      // Create a new order
      const newOrder = new ConfirmOrder({
        brand,
        category,
        price,
        oldprice,
        productName,
        quantity: qnty, // Storing `qnty` as `quantity` in the model
        color,
        userId,
        name,
        email,
        shippingFee,
        grandTotal,
        shippingUserName,
        shippingPhone,
        shippingHouseNo,
        shippingCity,
      });

      // Save the new order to the database
      return newOrder.save(); 
    });

    // Wait for all promises to resolve (all orders to be saved)
    // await Promise.all(orderPromises);//previous
    const savedOrders = await Promise.all(orderPromises);

    // Generate Invoice PDF
    const pdfPath = await generateInvoiceWithPDFKit(savedOrders);
  // Send Email with the Invoice PDF
    await sendEmailWithInvoice(pdfPath, ordersArray[0].email);

  // Cleanup: Remove the generated PDF
  fs.unlinkSync(pdfPath);
    // Return success response
    res.status(201).json({
      isSuccess: true,
      message: "Orders Confirmed successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      isSuccess: false,
      error: error.message,
      message: "Something went wrong",
    });
  }
};


// Helper: Generate Invoice PDF with PDFKit
const generateInvoiceWithPDFKit = async (orders) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filePath = `./invoice_${Date.now()}.pdf`;

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Add Header
    doc.fontSize(18).text("Invoice", { align: "center" });
    doc.moveDown();

    // Add Order Details
    orders.forEach((order, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. ${order.productName} - ${order.quantity} x ${order.price} = ${order.quantity * order.price}`
        )
        .moveDown(0.5);
    });

    // Add Total
    const total = orders.reduce((sum, order) => sum + order.quantity * order.price, 0);
    doc.moveDown().fontSize(14).text(`Grand Total: $${total.toFixed(2)}`, { align: "right" });

    // Finalize the PDF and save
    doc.end();

    writeStream.on("finish", () => {
      resolve(filePath);
    });

    writeStream.on("error", (err) => {
      reject(err);
    });
  });
};



const confirmMyPayment = async (req, res) => {
  const { payload } = req.body;

  if (!payload || !Array.isArray(payload)) {
    return res.status(400).json({ error: 'Invalid payload format.' });
  }

  try {
    const line_items = payload.map((item) => ({
      price_data: {
        currency: 'BDT',
        product_data: {
          name: item.product_name || 'Unknown Product', // Dynamic product name
        },
        unit_amount: item.unit_amount * 100  , // Convert Taka to poisha
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    res.status(500).send(`Error creating checkout session: ${error.message}`);
  }
};



  module.exports = { createMyOrder, 
    createMyDivision,
    createMyCity,
    createMyArea,
    geatAllDivision,
    getCityByType,
    getAreaByType,
    confirmMyOrder,
    getOrderInfo,
    confirmMyPayment
    };