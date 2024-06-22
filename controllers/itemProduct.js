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

        await Items.deleteMany()
        // await Items.create(ProductJson)
        await Item.save();

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
    res.status(200).json({item,totalRecords:Items.length})}
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

module.exports={createMyProduct,geatAllProducts}