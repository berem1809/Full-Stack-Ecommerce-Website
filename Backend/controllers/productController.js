const Productschema = require("../models/productModel");

// Get all products --  /api/v1/products
exports.getProducts = async (req, res, next) => {
  const products = await Productschema.find();
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};

// Create Product --  /api/v1/product/new
exports.newProduct = async (req, res, next) => {
  const product = await Productschema.create(req.body);
  res.status(201).json({
    success: true,
    product, // Shorthand Property Name
  });
};

// Get Single Product -- /api/v1/product/:id
exports.getSingleProduct = async (req, res, next) => {
    const product = await Productschema.findById(req.params.id);
  
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      product
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