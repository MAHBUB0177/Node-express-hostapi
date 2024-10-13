const Product =require('../models/product')

const getAllProducts=async(req,res)=>{
    // var id="66235417527a174ad295dca2"
    const{company,name,featured,sort,select,_id}=req.query;
    const queryObject={}
    if(company){
        queryObject.company=company
    }
    if(_id){
        queryObject._id=_id
    }
    if(name){
        queryObject.name={$regex: name, $options: 'i'}
    }
    if(featured){
        queryObject.featured=featured
    }

    let appData=Product.find(queryObject);
//add sort functionality
// http://localhost:500/api/products?name=iphone&sort=price
    if(sort){
        let sortFix= sort.replace(',', " ")
        appData=appData.sort(sortFix)

    }

//add select functionality
// http://localhost:500/api/products?name=iphone&select=company,featured
if(select){
    let selectFix= select.replace(',', " ")
    appData=appData.select(selectFix)

}

//add paqgination part
let page=Number(req.query.page) || 1
let limit=Number(req.query.limit) || 10
console.log(page,limit,'+++++')

let skip=(page -1 ) * 5
appData=appData.skip(skip).limit(limit)


    // const myData=await Product.find({company:"mi12"})//get
    // const myData=await Product.findById(id=id) //findbyid
    // const myData=await Product.find(queryObject)//get all

    const Products=await appData//sort queryObject
    res.status(200).json({Products,totalrecords:Products.length})

}

const getAllProductTesting=async(req,res)=>{
    // const myData=await Product.find(req.query)//receive queryparams and filter only query data
    // const myData=await Product.find(req.query).sort('name')//sort functionality
    const Products=await Product.find(req.query).select('name company')//select functionality
    console.log(req.query)
    res.status(200).json(Products)

  

}

module.exports={getAllProductTesting,getAllProducts}