
const Orders = require("../models/orders");
const Divisions = require("../models/division");
const Citys=require('../models/city')
const Area=require('../models/area')
const ConfirmOrder=require('../models/confirmOrder')

const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");
const os = require("os");
const path = require("path");

const Stripe = require('stripe');
const { transporter } = require("../helper/emailConfig");
const { generateMailOptions, generateMailOptionsForInvoice } = require("../helper/emailOptions");
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



// const confirmMyOrder = async (req, res) => {
//   try {
//     // Check if the request body is an array
//     const ordersArray = req.body;
//     if (!Array.isArray(ordersArray) || ordersArray.length === 0) {
//       return res.status(400).json({
//         isSuccess: false,
//         message: "Request body should contain an array of order details.",
//       });
//     }


//     // Loop through the array and save each order separately
//     const orderPromises = ordersArray.map(async (orderItem) => {
//       // Destructure the required fields from each order object
//       const { brand, category, price, oldprice, productName, qnty, color,userId,name,email,shippingFee,grandTotal,shippingUserName,shippingPhone,shippingHouseNo,shippingCity } = orderItem;
//       // Create a new order
//       const newOrder = new ConfirmOrder({
//         brand,
//         category,
//         price,
//         oldprice,
//         productName,
//         quantity: qnty, // Storing `qnty` as `quantity` in the model
//         color,
//         userId,
//         name,
//         email,
//         shippingFee,
//         grandTotal,
//         shippingUserName,
//         shippingPhone,
//         shippingHouseNo,
//         shippingCity,
//       });

//       // Save the new order to the database
//       return newOrder.save(); 
//     });

//     // Wait for all promises to resolve (all orders to be saved)
//     // await Promise.all(orderPromises);//previous
//     const savedOrders = await Promise.all(orderPromises);

//     // Generate Invoice PDF
//     const pdfPath = await generateInvoiceWithPDFKit(savedOrders);
//   // Send Email with the Invoice PDF
//     // await sendEmailWithInvoice(pdfPath, ordersArray[0].email);

//      // Send Email with the Invoice PDF
//    await  transporter.sendMail(
//       generateMailOptions(
//         "mahbub15-9283@diu.edu.bd", // Customer email
//         "Your Order Invoice",
//         "Thank you for your order! Please find your invoice attached.",
//         null, // No custom HTML content
//         pdfPath
//       ),
//       (error, info) => {
//         if (error) {
//           console.error("Error occurred while sending email:", error);
//         } else {
//           console.log("Email sent successfully:", info.response);
//         }
//       }
//     );

   

//       // Cleanup: Remove the generated PDF
//       fs.unlink(pdfPath, (err) => {
//         if (err) console.error("Failed to delete PDF file:", err);
//       });
  
//     // Return success response
//     res.status(201).json({
//       isSuccess: true,
//       message: "Orders confirmed successfully and invoice sent via email.",
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({
//       isSuccess: false,
//       error: error.message,
//       message: "Something went wrong",
//     });
//   }
// };


// Helper: Generate Invoice PDF with PDFKit

const confirmMyOrder = async (req, res) => {
  // await ConfirmOrder.deleteMany({});
  try {
    const ordersArray = req.body;
    if (!Array.isArray(ordersArray) || ordersArray.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Request body should contain an array of order details.",
      });
    }

    const orderPromises = ordersArray.map(async (orderItem) => {
      const { brand, category, price, oldprice, productName, qnty, color, userId, name, email, shippingUserName, shippingPhone, shippingHouseNo, shippingCity } = orderItem;
     
      const newOrder = new ConfirmOrder({
        brand,
        category,
        price,
        oldprice,
        productName,
        quantity: qnty,
        color,
        userId,
        name,
        email,
        shippingFee:qnty*30,
        grandTotal:price*qnty,
        shippingUserName,
        shippingPhone,
        shippingHouseNo,
        shippingCity,
      });

      return newOrder.save();
    });
  // Wait for all promises to resolve (all orders to be saved)
    const savedOrders = await Promise.all(orderPromises);
    // Generate Invoice PDF
    let orderInfo = {
      orderId: "Z4B11D1730718627300",
      orderDate: "04 Nov 2024, 05:21 PM",
      deliveryDate: "04 Nov 2024, 06:18 PM",
      restaurantName: "Burger Xpress - Banani",
      restaurantPhone: "01601979711",
      restaurantAddress: "House-33, (4th floor), Road-17, Block-E, Banani, Dhaka-1213",
      customerName: "Rakibul Hasan",
      customerPhone: "01777871569",
      customerAddress: "97 Sohrawardy Ave, Dhaka 1212, Bangladesh",
      vat: 207,
      deliveryCharge: 45,
      discount: 100,
      restaurantInstruction: "N/A",
      riderInstruction: "N/A",
    };
    
    const pdfPath = await generateInvoiceWithPDFKit(savedOrders,orderInfo);
    // Send Email with the Invoice PDF 
    transporter.sendMail(
      generateMailOptionsForInvoice(
        "mahbub15-9283@diu.edu.bd",
        "Your Order Invoice",
        "Thank you for your order! Please find your invoice attached.",
        null, // No custom HTML
        pdfPath
      ),
      (error, info) => {
        if (error) {
          console.error("Error occurred while sending email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }

        // Cleanup: Remove the generated PDF (avoid crashing the server if the file is missing.)
        fs.unlink(pdfPath, (err) => {
          if (err) console.error("Failed to delete PDF file:", err);
        });
      }
    );

    res.status(201).json({
      isSuccess: true,
      message: "Orders confirmed successfully and invoice sent via email.",
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

const generateInvoiceWithPDFKit = async (orderDetails,orderInfo) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const filePath = path.join(os.tmpdir(), `invoice_${Date.now()}.pdf`);
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Header Section
    doc
      .fontSize(20)
      .text("INVOICE", { align: "center" })
      .moveDown(1);

      //     // Order Details
    doc
      .fontSize(12)
      .text(`Order Id: ${orderInfo.orderId}`)
      .text(`Order date: ${orderInfo.orderDate}`)
      .text(`Delivery date: ${orderInfo.deliveryDate}`)
      .moveDown(1);

      //     // Customer Info: Order From
    doc
      .fontSize(12)
      .text("Order from:")
      .fontSize(10)
      .text(`Name: ${orderInfo.restaurantName}`)
      .text(`Phone: ${orderInfo.restaurantPhone}`)
      .text(`Address: ${orderInfo.restaurantAddress}`)
      .moveDown(1);
    // Customer Info Section
    const firstOrder = orderDetails[0];
    doc
    .fontSize(12)
    .text("Order from:")
    .fontSize(10)
    .text(`Customer Name: ${firstOrder.name}`)
    .text(`Email: ${firstOrder.email}`)
    .text(`Shipping Name: ${firstOrder.shippingUserName}`)
    .text(`Shipping Phone: ${firstOrder.shippingPhone}`)
    .text(`Shipping Address: ${firstOrder.shippingHouseNo}, ${firstOrder.shippingCity}`)
    .moveDown(1);

     

    // Items Table Header
    const tableStartY = doc.y;
    doc
      .fontSize(14)
      .text(`#`, 50, tableStartY)
      .text(`Items`, 80, tableStartY)
      .text(`Quantity`, 300, tableStartY, { align: "" })
      .text(`Unit Price`, 400, tableStartY, { align: "" })
      .text(`Total`, 500, tableStartY, { align: "" });

    doc.moveTo(50, tableStartY + 15) // Draw a line under the headers
      .lineTo(550, tableStartY + 15)
      .stroke();

    // Items Table Content
    let grandTotal = 0;
    let currentY = tableStartY + 20; // Start the first row below the header
    orderDetails.forEach((order, index) => {
      const rowHeight = 20; // Height of each row

      // Calculate values
      const total = order.quantity * order.price;
      grandTotal += total;

      // Draw row content
      doc
        .fontSize(12)
        .text(index + 1, 50, currentY)
        .text(order.productName, 80, currentY)
        .text(order.quantity, 300, currentY, { align: "" })
        .text(order?.price?.toFixed(2), 400, currentY, { align: "" })
        .text(total?.toFixed(2), 500, currentY, { align: "" });

      currentY += rowHeight; // Move to the next row
    });

    // Draw a line before the summary
    doc
      .moveTo(50, currentY + 10)
      .lineTo(550, currentY + 10)
      .stroke();

    // Summary Section
    const shippingFee = firstOrder.shippingFee;
    const overallTotal = grandTotal + shippingFee;

    doc
      .fontSize(12)
      .text(`Subtotal:`, 400, currentY + 20, { align: "" })
      .text(grandTotal?.toFixed(2), 500, currentY + 20, { align: "" })
      .text(`Shipping Fee:`, 400, currentY + 40, { align: "" })
      .text(shippingFee?.toFixed(2), 500, currentY + 40, { align: "" })
      .fontSize(14)
      .text(`Grand Total:`, 400, currentY + 60, { align: "" })
      .text(overallTotal?.toFixed(2), 500, currentY + 60, { align: "" });

    // Finalize the PDF
    doc.end();

    writeStream.on("finish", () => resolve(filePath));
    writeStream.on("error", (err) => reject(err));
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