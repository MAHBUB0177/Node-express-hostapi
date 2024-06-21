const Items =require('../models/items');
const { uploadImage } = require('./MyFileUploadControllers');
const ItemJson =require('../items.json')

const createMyProduct = async (req, res) => {
    try {
        const { productName } = req.body;
        console.log(productName,'productName++++++++++',req.body)

        const existingProduct = await Items.findOne({ productName });

        console.log(existingProduct,'+++++++++++')
        if (existingProduct) {
            return res.status(409).json({ isSuccess: false, message: "Product already exists" });
        }
        // const imageUrl = await uploadImage(req.file );
        // console.log(imageUrl,'imageUrl++++++++++++')
        const Item = new Items(req.body);
        // Items.imageUrl = imageUrl;

       
        // await Items.create(ProductJson)
        await Item.save();

        res.status(201).send({ isSuccess: true, message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ isSuccess: false, error: error, message: "Something went wrong" });
    }
};


module.exports={createMyProduct}