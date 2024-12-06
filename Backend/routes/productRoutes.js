// const express = require('express');
// const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController');
// const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate'); // Correct the path if necessary
// const router = express.Router();

// router.route('/products').get(isAuthenticatedUser, getProducts);
// router.route('/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);
// router.route('/product/:id').get(getSingleProduct);
// router.route('/product/:id').put(updateProduct);
// router.route('/product/:id').delete(deleteProduct);
// router.route('/product/review').put(isAuthenticatedUser, createReview);

// module.exports = router;

// productRoutes.js
const express = require('express');
const { 
    getProducts, 
    newProduct, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct, 
    createReview ,
    getReviews
} = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const router = express.Router();

// Static routes first
router.route('/products').get(isAuthenticatedUser, getProducts);
router.route('/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);
router.route('/review').put(isAuthenticatedUser, createReview); 
router.route('/reviews').get(isAuthenticatedUser, getReviews);

// Dynamic routes last
router.route('/product/:id')
    .get(getSingleProduct)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

module.exports = router;