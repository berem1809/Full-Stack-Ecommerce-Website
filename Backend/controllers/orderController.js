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
    } = req.body;
    
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
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