const Productschema = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError")
const APIFeatures = require("../utils/apiFeatures");

// Get all products --  /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {

  const apiFeatures = new APIFeatures(Productschema.find(), req.query)
  .search()
  .filter();

  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// Create Product --  /api/v1/product/new
exports.newProduct = catchAsyncError( async (req, res, next) => {
  const product = await Productschema.create(req.body);
  res.status(201).json({
    success: true,
    product, // Shorthand Property Name
  });
});

// Get Single Product -- /api/v1/product/:id
exports.getSingleProduct = async (req, res, next) => {
    const product = await Productschema.findById(req.params.id);
  //3. Custom Application Errors
//These are custom errors that you define in your application, such as when a specific resource is not found.

//Example:
    if (!product) {
      // return res.status(404).json({
    //   sucess: false,
    //   message: "Product not found",
    // });
       return next( new ErrorHandler('Product Not Found', 400)) ;
    }
    res.status(201).json({
      success: true,
      product,
    });
  };

  //Update Product -- api/v1/product/:id
  exports.updateProduct = async (req, res,next) => {
    let product = await Productschema.findById(req.params.id);

    if(!product) {
        return res.status(404).json({
            success: false,
            message:"Product not found",
        });
    }

    product = await Productschema.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
        
    })
 res.status(200).json({
    success : true,
    product
 })
  }

  //Delete Product - api/v1/product/:id
  exports.deleteProduct = async (req,res,next) => {
    let product = await Productschema.findById(req.params.id);

    if(!product) {
        return res.status(404).json({
            success: false,
            message:"Product not found",
        });
    }

    await Productschema.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success : true,
        message: "Product Deleted!"
     })

  }

  //Summary
// Validation Errors: Occur when data does not meet validation rules.
// Cast Errors: Occur when an invalid ObjectId is provided.
// Custom Application Errors: Defined by the application, such as resource not found.
// Database Connection Errors: Issues connecting to the database.
// Syntax Errors: Mistakes in the code syntax.
// Runtime Errors: Errors during code execution.
// Unhandled Promise Rejections: Promises rejected without a .catch handler.