const Items = require("../models/items");
const { uploadImage } = require("./MyFileUploadControllers");

const createMyProduct = async (req, res) => {
  try {
    const { productName } = req.body;
    const existingProduct = await Items.findOne({ productName });
    if (existingProduct) {
      return res
        .status(409)
        .json({ isSuccess: false, message: "Product already exists" });
    }
    const imageUrl = await uploadImage(req.file);
    const product = new Items(req.body);
    product.image = imageUrl;
    await product.save();

    res
      .status(201)
      .send({ isSuccess: true, message: "Product added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        isSuccess: false,
        error: error,
        message: "Something went wrong",
      });
  }
}; 

// const geatAllProducts = async (req, res) => {
//   console.log('we are called',req.query)
//   try {
//     const { productName, brand, sort, select, _id,category ,searchTerm} = req.query;
//        console.log(_id,'+++++_id',brand)
//     const queryObject = {};

//     if (_id) {
//       queryObject._id = _id;
//     }
//     if (productName) {
//       queryObject.productName = { $regex: productName, $options: "i" };
//     }
//     if (category) {
//       queryObject.category = category;
//     }
//     if (brand) {
//       queryObject.brand = brand;
//     }
//     let appData = Items.find(queryObject);
//     console.log(appData, "appData+++++++++++++");

//     if (sort) {
//       let sortFix = sort.replace(",", " ");
//       appData = appData.sort(sortFix);
//     }

//     if (select) {
//       const selectFix = select.replace(",", " ");
//       appData = appData.select(selectFix);
//     }

//     //pagination
//     let page = Number(req.query.page) || 1;
//     let limit = Number(req.query.limit) || 9;
//     let skip = (page - 1) * 9;
//     appData = appData.skip(skip).limit(limit);
//     //Count total records
//     const totalRecord = await Items.countDocuments(queryObject);

//     const totalPage = Math.ceil(totalRecord / limit);

//     const item = await appData;
//     res
//       .status(200)
//       .json({ item, totalRecords: totalRecord, totalPage: totalPage });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

const geatAllProducts = async (req, res) => {
  console.log('we are called', req.query);
  try {
    const {  sort, select, _id,  searchTerm } = req.query;
    console.log(_id, '+++++_id');

    const queryObject = {};

    if (_id) {
      queryObject._id = _id;
    }
    
    // if (productName) {
    //   queryObject.productName = { $regex: productName, $options: "i" };
    // }
    // if (category) {
    //   queryObject.category = category;
    // }
    // if (brand) {
    //   queryObject.brand = brand;
    // }

    // If searchTerm is provided, it should match either brand or category
    if (searchTerm) {
      queryObject.$or = [
        { brand: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
        { productName: { $regex: searchTerm, $options: "i" } }
      ];
    }

    let appData = Items.find(queryObject);
    console.log(appData, "appData+++++++++++++");

    if (sort) {
      let sortFix = sort.replace(",", " ");
      appData = appData.sort(sortFix);
    }

    if (select) {
      const selectFix = select.replace(",", " ");
      appData = appData.select(selectFix);
    }

    // Pagination
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;
    let skip = (page - 1) * limit;
    appData = appData.skip(skip).limit(limit);

    // Count total records
    const totalRecord = await Items.countDocuments(queryObject);

    const totalPage = Math.ceil(totalRecord / limit);

    const item = await appData;
    res.status(200).json({ item, totalRecords: totalRecord, totalPage: totalPage });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateMyProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Assuming product ID is passed as a URL parameter
    const { productName, ...otherFields } = req.body;
    // console.log('try called')
    // Find the existing product by ID
    const existingProduct = await Items.findById(productId);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Product not found" });
    }

    // Check if the new product name already exists (if it's being updated)
    if (productName && productName !== existingProduct.productName) {
      const duplicateProduct = await Items.findOne({ productName });
      if (duplicateProduct) {
        return res
          .status(409)
          .json({ isSuccess: false, message: "Product name already exists" });
      }
    }

    // Handle image upload if a new image is provided
    if (req.file) {
      const imageUrl = await uploadImage(req.file);
      existingProduct.image = imageUrl;
    }

    // Update other fields
    Object.assign(existingProduct, otherFields);
    if (productName) {
      existingProduct.productName = productName;
    }

    // Save the updated product
    await existingProduct.save();

    res
      .status(200)
      .send({ isSuccess: true, message: "Product updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        isSuccess: false,
        error: error,
        message: "Something went wrong",
      });
  }
};

module.exports = { createMyProduct, geatAllProducts, updateMyProduct };
