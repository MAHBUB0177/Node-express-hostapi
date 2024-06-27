const Items =require('../models/items');
const { uploadImage } = require('./MyFileUploadControllers');

const createMyProduct = async (req, res) => {
    try {
        const { productName } = req.body;
        const existingProduct = await Items.findOne({ productName });
        if (existingProduct) {
            return res.status(409).json({ isSuccess: false, message: "Product already exists" });
        }
        const imageUrl = await uploadImage(req.file );
        const product = new Items(req.body);
        product.image = imageUrl;
        await product.save();

        res.status(201).send({ isSuccess: true, message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ isSuccess: false, error: error, message: "Something went wrong" });
    }
};
const geatAllProducts=async (req,res)=>{
    console.log('we are called')
   try{ 
    const{productName,company,sort,select,_id}=req.query;
   console.log(productName,'+++++productName')
    const queryObject={};

    if(_id){
        queryObject._id=_id;
    }
    if(productName){
        queryObject.productName={$regex: productName, $options: 'i'}
    }
    if(company){
        queryObject.company=company
    }
    let appData=Items.find(queryObject);

    if(sort){
        let sortFix=sort.replace(',', " ")
        appData=appData.sort(sortFix)

    }

    if(select){
        const selectFix=select.replace(',', " ");
        appData=appData.select(selectFix)
    }

    //pagination
    let page=Number(req.query.page) || 1
    let limit =Number(req.query.limit) || 10
    let skip=(page -1) * 5
    appData=appData.skip(skip).limit(limit)

    const item=await appData;
    res.status(200).json({item,totalRecords:item.length})}
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}


const updateMyProduct = async (req, res) => {
    console.log('update called')
    try {
        const { productId } = req.params; // Assuming product ID is passed as a URL parameter
        const { productName, ...otherFields } = req.body;
        console.log('try called')
        // Find the existing product by ID
        const existingProduct = await Items.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ isSuccess: false, message: "Product not found" });
        }

        // Check if the new product name already exists (if it's being updated)
        if (productName && productName !== existingProduct.productName) {
            const duplicateProduct = await Items.findOne({ productName });
            if (duplicateProduct) {
                return res.status(409).json({ isSuccess: false, message: "Product name already exists" });
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

        res.status(200).send({ isSuccess: true, message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ isSuccess: false, error: error, message: "Something went wrong" });
    }
};

module.exports={createMyProduct,geatAllProducts,updateMyProduct}