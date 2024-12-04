const catchAsyncError = require("../middlewares/catchAsyncError");
const Order = require("../models/orderModel");

// Create a new order => /api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {  
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        orderStatus = 'Processing',
    } = req.body;
    
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        orderStatus,
        paidAt: Date.now(),
        user: req.user._id,
    });
    
    res.status(200).json({
        success: true,
        order,
    });
    });

// Get single order details => /api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    //populate('user', 'name email') => this will populate the user field with the name and email of the user and exclude the other fields.under order, 
    
    if (!order) {
        return next(new ErrorHandler('Order not found with this ID', 404));
    }
    
    res.status(200).json({
        success: true,
        order,
    });
    }
    );

// Get logged in user orders => /api/v1/orders/me
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    
    res.status(200).json({
        success: true,
        orders,
    });
    });

// Get all orders => /api/v1/admin/orders
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();
    
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });
    
    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
    });

// // Admin: Update Order Status => /api/v1/admin/order/:id    
// exports.updateOrder = catchAsyncError(async (req, res, next) => {

//     const order = await Order.findById(req.params.id);

//     if(order.orderStatus === 'Delivered'){
//         return next(new ErrorHandler('You have already delivered this order',400));
//     }
// //The updateStock function will update the stock of the products in the order.
//     order.orderItems.forEach(async orderItem => {
//         await updateStock(orderItem.product, orderItem.quantity)
//     });

//     order.orderStatus = req.body.status;
//     order.deliveredAt = Date.now();

//     await order.save();

//     res.status(200).json({
//         success: true,
//     });
// });

// async function updateStock(id, quantity){
//     const product = await product.findById(id);

//     product.stock = product.stock - quantity;

//     await product.save({ validateBeforeSave: false });
// }


// Admin: Update Order Status => /api/v1/admin/order/:id    
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandler('Order not found with this ID', 404));
    }
  
    if (order.orderStatus === 'Delivered') {
      return next(new ErrorHandler('You have already delivered this order', 400));
    }
  
    // Update stock
    order.orderItems.forEach(async orderItem => {
      await updateStock(orderItem.product, orderItem.quantity);
    });
  
    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }
  
    await order.save();
  
    res.status(200).json({
      success: true,
      order,
    });
  });
  
  async function updateStock(id, quantity) {
    const product = await product.findById(id);
  
    product.stock = product.stock - quantity;
  
    await product.save({ validateBeforeSave: false });
  }