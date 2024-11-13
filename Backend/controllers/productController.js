const Productschema = require('../models/productModel');

//Get all products --  /api/v1/products
exports.getProducts = async (req, res , next) =>{
const products = await Productschema.find();
res.status(200).json({
    success: true,
    count : products.length,
    products
});
};

//Create Product --  /api/v1/product/new
exports.newProduct = async (req, res , next) =>{
 const product =   await Productschema.create(req.body);
res.status(201).json({
    success: true,
    product  //Shorthand Property Name
});
}