const Productschema = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError")
const APIFeatures = require("../utils/apiFeatures");

// Get all products --  /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {
const resPerPage = 2;
  const apiFeatures = new APIFeatures(Productschema.find(), req.query)
  .search()
  .filter()
  .paginate(resPerPage)

  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// Create Product --  /api/v1/product/new
exports.newProduct = catchAsyncError( async (req, res, next) => {

  req.body.user = req.user.id;
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


// Create Review - api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment,
  };

  const product = await Productschema.findById(productId);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const isReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//Get reviews - api/v1/reviews?id={productId}
exports.getReviews =  catchAsyncError(async ( req,res,next) => {
  const product = await Productschema.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})

// productController.js
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  // Fix query parameter case sensitivity
  const productId = req.query.productid || req.query.productId;
  const reviewId = req.query.id;

  if (!productId) {
    return next(new ErrorHandler('Please provide product ID', 400));
  }

  if (!reviewId) {
    return next(new ErrorHandler('Please provide review ID', 400));
  }

  const product = await Productschema.findById(productId);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  // Filter out the review
  const reviews = product.reviews.filter(
    review => review._id.toString() !== reviewId
  );

  // Recalculate ratings
  const numOfReviews = reviews.length;
  const ratings = numOfReviews === 0 ? 0 : 
    reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

  // Update product
  await Productschema.findByIdAndUpdate(
    productId,
    {
      reviews,
      ratings,
      numOfReviews
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});