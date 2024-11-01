const Items = require("../models/items");
const Shops = require("../models/shops");
const Category=require('../models/category')
const Brand=require('../models/brand')
const { uploadImage } = require("./MyFileUploadControllers");

// const createMyProduct = async (req, res) => {
//   try {
//     const { productName } = req.body;
//     const existingProduct = await Items.findOne({ productName });
//     if (existingProduct) {
//       return res
//         .status(409)
//         .json({ isSuccess: false, message: "Product already exists" });
//     }
//     const imageUrl = await uploadImage(req.file);
//     const product = new Items(req.body);
//     product.image = imageUrl;
//     await product.save();

//     res
//       .status(201)
//       .send({ isSuccess: true, message: "Product added successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         isSuccess: false,
//         error: error,
//         message: "Something went wrong",
//       });
//   }
// }; 





const createMyProduct = async (req, res) => {
  try {
    const { productName } = req.body;
    // Check if product already exists
    const existingProduct = await Items.findOne({ productName });
    if (existingProduct) {
      return res
        .status(409)
        .json({ isSuccess: false, message: "Product already exists" });
    }

    // Upload multiple images and get an array of URLs
    const imageUrls = await uploadImage(req.files);
    // Create the product and assign the image URLs
    const product = new Items({ ...req.body, image: imageUrls });
    await product.save();

    res.status(201).json({ isSuccess: true, message: "Product added successfully", images: imageUrls });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ isSuccess: false, error, message: "Something went wrong" });
  }
};

const geatAllProducts = async (req, res) => {
  try {
    const {  sort, select, _id,  searchTerm } = req.query;

    const queryObject = {};

    if (_id) {
      queryObject._id = _id;
    }

    // If searchTerm is provided, it should match either brand or category
    if (searchTerm) {
      queryObject.$or = [
        { brand: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
        { productName: { $regex: searchTerm, $options: "i" } }
      ];
    }

    let appData = Items.find(queryObject);

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

// Backend: Fetch Product by ID (uses path parameter)
const fetchProductById = async (req, res) => {
  try {
    const { id } = req.params;  // Use req.params to get the id from the URL
    if (!id) {
      return res.status(400).json({
        isSuccess: false,
        message: "Product ID is required",
      });
    }

    const product = await Items.findById(id);
    if (!product) {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: "Product not found",
      });
    }

    res.status(200).json({
      isSuccess: true,
      data: product,
      message: "Successfully fetched product",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: error.message,
      data: {},
      message: "Please try again",
    });
  }
};


const getRelatedProducts = async (req, res) => {
  try {
    const { category } = req.query;

    // Check if category is provided in the query
    if (!category) {
      return res.status(200).json({
        item: [],
        totalRecords: 0,
        isSuccess: true,
        message: "Category not found or not provided",
      });
    }

    // Find products by category
    let appData = Items.find({ category: { $regex: category, $options: "i" } });  // Case-insensitive search for category
    const item = await appData;

    // If no items found, return success with empty array
    if (item.length === 0) {
      return res.status(200).json({
        item: [],
        totalRecords: 0,
        isSuccess: true,
        message: "No products found in this category",
      });
    }
    // Count total records for pagination or other purposes (optional)
    const totalRecord = await Items.countDocuments({ category: { $regex: category, $options: "i" } });
    res.status(200).json({ item, totalRecords: totalRecord, isSuccess: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// Route definition for fetching product by ID
const updateMyProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Assuming product ID is passed as a URL parameter
    const { productName, ...otherFields } = req.body;
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


//shops create
const createMyShops = async (req, res) => {
  try {
    const { shopName } = req.body;
    const existingShop = await Shops.findOne({ shopName });
    if (existingShop) {
      return res
        .status(409)
        .json({ isSuccess: false, message: "Shop already exists" });
    }

    const imageUrls = await uploadImage(req.files);
    const shop = new Shops({ ...req.body, image: imageUrls });
    await shop.save();

    res.status(201).json({ isSuccess: true, message: "Product added successfully", images: imageUrls });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ isSuccess: false, error, message: "Something went wrong" });
  }
};


const geatAllShops = async (req, res) => {
  try {
    let appData = Shops.find({});
    // Count total records
    const totalRecord = await Shops.countDocuments({});
    // const totalPage = Math.ceil(totalRecord / limit);
    const shop = await appData;
    res.status(200).json({ shop, totalRecords: totalRecord, });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const fetchShopById = async (req, res) => {
  try {
    const { id } = req.params; 
    if (!id) {
      return res.status(400).json({
        isSuccess: false,
        message: "Shop ID is required",
      });
    }

    const shop = await Shops.findById(id);
    if (!shop) {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: "shop not found",
      });
    }

    res.status(200).json({
      isSuccess: true,
      data: shop,
      message: "Successfully fetched data",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: error.message,
      data: {},
      message: "Please try again",
    });
  }
};


const createMyProductCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const existingCategory = await Category.findOne({ category });
    if (existingCategory) {
      return res
        .status(409)
        .json({ isSuccess: false, message: "Category already exists" });
    }

    const categoryitem = new Category({ ...req.body});
    await categoryitem.save();

    res.status(201).json({ isSuccess: true, message: "Category added successfully"});
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ isSuccess: false, error, message: "Something went wrong" });
  }
};

const getCategoryByType = async (req, res) => {
  try {
    const { productName } = req.query;
    let queryObject = {};

    // If productName is provided, filter by productName using regex
    if (productName) {
      const lowercaseProductName = productName.toLowerCase();
      queryObject.productName = { $regex: new RegExp("^" + lowercaseProductName, "i") };
    }

    // Find data based on queryObject (either all or filtered)
    const appData = Category.find(queryObject);

    // Count the total records that match
    const totalRecord = await Category.countDocuments(queryObject);

    const item = await appData;

    res.status(200).json({ item, totalRecords: totalRecord, isSuccess: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message, isSuccess: false });
  }
};




const createMyProductBrand = async (req, res) => {
  try {
    const { brand } = req.body;
    const existingBrand = await Brand.findOne({ brand });
    if (existingBrand) {
      return res
        .status(409)
        .json({ isSuccess: false, message: "Brand already exists" });
    }

    const branditem = new Brand({ ...req.body});
    await branditem.save();

    res.status(201).json({ isSuccess: true, message: "Brand added successfully"});
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ isSuccess: false, error, message: "Something went wrong" });
  }
};

const getBrandByType = async (req, res) => {
  try {
    const { productName } = req.query;
    let queryObject = {};

    // If productName is provided, filter by productName using regex
    if (productName) {
      const lowercaseProductName = productName.toLowerCase();
      queryObject.productName = { $regex: new RegExp("^" + lowercaseProductName, "i") };
    }

    // Find brands based on queryObject (either all or filtered)
    const appData = Brand.find(queryObject);

    // Count the total records that match
    const totalRecord = await Brand.countDocuments(queryObject);

    const item = await appData;

    res.status(200).json({ item, totalRecords: totalRecord, isSuccess: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message, isSuccess: false });
  }
};


module.exports = { createMyProduct, 
  geatAllProducts,
 updateMyProduct,
  fetchProductById,
  getRelatedProducts,
  createMyShops,
  geatAllShops,
  fetchShopById,
  createMyProductCategory,
  createMyProductBrand ,
  getBrandByType,
  getCategoryByType
};
